// --- INCIDENTS LIST & DETAIL ---

// Called after pages/incidents.html has been loaded into the DOM
function initIncidentsPage() {
    renderStatusFilterOptions();
    document.getElementById('incident-search').addEventListener('input', updateIncidentsList);
    document.getElementById('incident-status-filter').addEventListener('change', updateIncidentsList);
    document.getElementById('incident-export').addEventListener('click', exportIncidentsCSV);
    document.getElementById('det-note-add').addEventListener('click', addNoteFromInput);
}

function renderStatusFilterOptions() {
    const select = document.getElementById('incident-status-filter');
    const current = select.value || 'All';
    select.innerHTML = `<option value="All">${t('inc.allStatus')}</option>` +
        STATUSES.map(s => `<option value="${s}">${statusLabel(s)}</option>`).join('');
    select.value = current;
}

// Search matches raw values and their translated labels, so either language works
function getFilteredIncidents() {
    const search = document.getElementById('incident-search').value.trim().toLowerCase();
    const statusFilter = document.getElementById('incident-status-filter').value;

    return State.incidents.filter(inc => {
        if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
        if (!search) return true;
        return [inc.id, inc.loc, locLabel(inc.loc), inc.cam, inc.plate || '', inc.type, typeLabel(inc.type)]
            .some(value => value.toLowerCase().includes(search));
    });
}

function updateIncidentsList() {
    const rows = getFilteredIncidents();
    const tbody = document.getElementById('incidents-table');

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-row">${t('inc.empty')}</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(inc => `
        <tr>
            <td><strong>${inc.id}</strong></td>
            <td class="nowrap">${formatDateTime(inc.date, inc.time)}</td>
            <td>${typeLabel(inc.type)}</td>
            <td>${locLabel(inc.loc)}</td>
            <td>${inc.cam}</td>
            <td class="nowrap">${plateText(inc)}</td>
            <td>${inc.conf}%</td>
            <td>${getStatusBadge(inc.status)}</td>
            <td><button class="btn btn-sm btn-secondary" onclick="openIncidentDetail('${inc.id}')">${t('common.open')}</button></td>
        </tr>
    `).join('');
}

function csvCell(value) {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportIncidentsCSV() {
    const header = ['col.id', 'col.date', 'col.time', 'col.type', 'col.location', 'col.camera', 'col.plate', 'col.speed', 'col.limit', 'col.conf', 'col.status'].map(k => t(k));
    const rows = getFilteredIncidents().map(inc => [
        inc.id, inc.date, inc.time, typeLabel(inc.type), locLabel(inc.loc), inc.cam,
        inc.plate || '', inc.speed ?? '', inc.limit ?? '', inc.conf, statusLabel(inc.status)
    ]);
    const csv = [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');

    // BOM so Excel reads the Thai text as UTF-8
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sdc-incidents-${todayKey()}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function openIncidentDetail(id) {
    const inc = State.incidents.find(i => i.id === id);
    if (!inc) return;

    // Opening an incident counts as reading it (clears NEW and its notifications)
    State.markIncidentRead(id);

    navTo('incidents');
    document.getElementById('incidents-list-view').style.display = 'none';
    document.getElementById('incidents-detail-view').style.display = 'block';
    State.currentIncidentId = id;

    renderIncidentDetail(inc);
}

// Fills the detail view without navigating (also used to re-render on language change)
function renderIncidentDetail(inc) {
    document.getElementById('det-id').innerText = inc.id;
    document.getElementById('det-status-badge').className = `status-badge ${getStatusClass(inc.status)}`;
    document.getElementById('det-status-badge').innerText = statusLabel(inc.status);
    document.getElementById('det-time').innerText = `${formatDate(inc.date)} ${inc.time}`;

    document.getElementById('det-type').innerText = typeLabel(inc.type);
    document.getElementById('det-location').innerText = `${locLabel(inc.loc)} (${inc.cam})`;
    document.getElementById('det-conf').innerText = `${inc.conf}%`;
    document.getElementById('det-plate').innerText = plateText(inc);

    if (inc.speed) {
        document.getElementById('det-speed-row').style.display = 'flex';
        document.getElementById('det-speed').innerText = inc.speed;
        document.getElementById('det-limit').innerText = `${inc.limit} ${t('unit.kmh')}`;
    } else {
        document.getElementById('det-speed-row').style.display = 'none';
    }

    document.getElementById('det-cam-id').innerText = inc.cam;
    document.getElementById('det-icon').innerHTML = getIncidentIconSVG(inc.type, 96);

    let overlay = typeLabel(inc.type);
    if (inc.speed) overlay += ` (${inc.speed} ${t('unit.kmh')})`;
    if (inc.plate) overlay += ` · ${inc.plate}`;
    document.getElementById('det-overlay-text').innerText = overlay;

    renderTimeline(inc);
    renderActionButtons(inc);
    renderNotes(inc);
}

function closeIncidentDetail() {
    document.getElementById('incidents-list-view').style.display = 'block';
    document.getElementById('incidents-detail-view').style.display = 'none';
    State.currentIncidentId = null;
}

// Description of each flow step, by step index
function getStepDescription(inc, idx) {
    const isAccident = inc.type === 'Possible Accident';
    if (idx === 0) return t('tl.detected', { type: typeLabel(inc.type), conf: inc.conf });
    if (idx === 1) return t(isAccident ? 'tl.verified' : 'tl.reviewed');
    if (idx === 2) return t(isAccident ? 'tl.responding' : 'tl.actionTaken');
    return t('tl.closed');
}

function renderTimeline(inc) {
    const steps = getStatusFlow(inc.type);
    const isDismissed = inc.status === 'Dismissed';
    const lastIdx = steps.length - 1;
    const dismissedAfterIdx = getDismissedAfterIdx(inc.type);
    const currentIdx = isDismissed ? lastIdx : steps.indexOf(inc.status);

    document.getElementById('det-timeline').innerHTML = steps.map((step, idx) => {
        let status = step;
        let cls = '';
        if (isDismissed && idx > dismissedAfterIdx && idx < lastIdx) cls = 'skipped';
        else if (idx < currentIdx) cls = 'completed';
        else if (idx === currentIdx) cls = 'current';

        let desc = cls === 'skipped' ? t('tl.skipped') : getStepDescription(inc, idx);
        if (isDismissed && idx === lastIdx) {
            status = 'Dismissed';
            desc = t(inc.type === 'Possible Accident' ? 'tl.falseAlarm' : 'tl.dismissed');
            cls = 'completed';
        }

        // When and by whom this step happened, from the recorded history
        const entry = cls !== 'skipped' && inc.history.find(h => h.status === status);
        const who = entry && (entry.by === 'System' ? t('tl.system') : escapeHtml(entry.by));
        const meta = entry ? `<div class="timeline-meta">${formatStamp(entry.at)} · ${who}</div>` : '';

        return `
            <div class="timeline-item ${cls}">
                <div class="timeline-content">
                    <h4>${statusLabel(status)}</h4>
                    <p>${desc}</p>
                    ${meta}
                </div>
            </div>
        `;
    }).join('');
}

function renderActionButtons(inc) {
    const ab = document.getElementById('det-actions');
    ab.innerHTML = '';

    const btn = (key, cls, nextStatus) => {
        const b = document.createElement('button');
        b.className = `btn ${cls}`;
        b.innerText = t(key);
        b.onclick = () => {
            State.updateIncidentStatus(inc.id, nextStatus, Auth.user ? Auth.user.name : 'Officer');
            renderIncidentDetail(inc);
        };
        return b;
    };

    if (inc.type === 'Possible Accident') {
        if (inc.status === 'Pending') {
            ab.appendChild(btn('act.verify', 'btn-danger', 'Verified'));
            ab.appendChild(btn('act.falseAlarm', 'btn-secondary', 'Dismissed'));
        } else if (inc.status === 'Verified') {
            ab.appendChild(btn('act.dispatch', 'btn-warning', 'Responding'));
        } else if (inc.status === 'Responding') {
            ab.appendChild(btn('act.close', 'btn-success', 'Closed'));
        }
    } else {
        if (inc.status === 'Pending') {
            ab.appendChild(btn('act.review', 'btn-primary', 'Reviewed'));
        } else if (inc.status === 'Reviewed') {
            ab.appendChild(btn('act.takeAction', 'btn-warning', 'Action Taken'));
            ab.appendChild(btn('act.dismiss', 'btn-secondary', 'Dismissed'));
        } else if (inc.status === 'Action Taken') {
            ab.appendChild(btn('act.close', 'btn-success', 'Closed'));
        }
    }
    ab.style.display = ab.children.length ? 'flex' : 'none';
}

function renderNotes(inc) {
    const list = document.getElementById('det-notes-list');
    if (inc.notes.length === 0) {
        list.innerHTML = `<p class="notes-empty">${t('inc.noNotes')}</p>`;
        return;
    }
    list.innerHTML = inc.notes.map(note => `
        <div class="note-item">
            <div class="note-meta">${escapeHtml(note.by)} · ${formatStamp(note.at)}</div>
            <div class="note-text">${escapeHtml(note.text)}</div>
        </div>
    `).join('');
}

function addNoteFromInput() {
    const input = document.getElementById('det-note-input');
    const text = input.value.trim();
    const inc = State.incidents.find(i => i.id === State.currentIncidentId);
    if (!text || !inc) return;

    State.addNote(inc.id, text, Auth.user ? Auth.user.name : 'Officer');
    input.value = '';
    renderNotes(inc);
}
