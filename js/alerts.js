// --- ALERT CENTER ---
// A work queue: only incidents that are not closed or dismissed yet
let currentAlertFilter = 'All';

// Called after pages/alerts.html has been loaded into the DOM
function initAlertsPage() {
    renderAlertFilters();
    document.getElementById('alert-filters').addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        currentAlertFilter = tab.dataset.filter;
        renderAlertFilters();
        updateAlertsList();
    });
}

function renderAlertFilters() {
    const tabs = [{ value: 'All', label: t('alerts.all') }, ...INCIDENT_TYPES.map(type => ({ value: type, label: typeShort(type) }))];
    document.getElementById('alert-filters').innerHTML = tabs.map(tab =>
        `<button type="button" class="filter-tab${tab.value === currentAlertFilter ? ' active' : ''}" data-filter="${tab.value}">${tab.label}</button>`
    ).join('');
}

function updateAlertsList() {
    const open = State.incidents.filter(i => !CLOSED_STATUSES.includes(i.status));
    const filtered = currentAlertFilter === 'All' ? open : open.filter(i => i.type === currentAlertFilter);

    document.getElementById('alerts-open-count').innerText = open.length;

    const tbody = document.getElementById('alerts-table');
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-row">${t('alerts.empty')}</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(inc => {
        const details = [t('alerts.conf', { n: inc.conf })];
        if (inc.speed) details.push(t('alerts.speed', { speed: `<span style="color:var(--danger-color)">${inc.speed}</span>`, limit: inc.limit }));
        if (inc.plate) details.push(t('alerts.plate', { plate: inc.plate }));
        else if (inc.type === 'No License Plate') details.push(t('plate.none'));

        const isUnread = inc.read === false;
        return `
            <tr class="${isUnread ? 'unread-row' : ''}">
                <td class="nowrap">${formatDateTime(inc.date, inc.time)}</td>
                <td><strong>${inc.id}</strong>${isUnread ? ` <span class="status-badge status-pending" style="padding:2px 8px;">${t('common.new')}</span>` : ''}</td>
                <td><div class="cell-flex">${getIncidentBadge(inc.type, 14)} <span>${typeLabel(inc.type)}</span></div></td>
                <td>${locLabel(inc.loc)} (${inc.cam})</td>
                <td>${details.join(' • ')}</td>
                <td>${getStatusBadge(inc.status)}</td>
                <td>
                    <div class="cell-flex">
                        <button class="btn btn-sm btn-secondary" onclick="openIncidentDetail('${inc.id}')">${t('alerts.review')}</button>
                        ${isUnread ? `<button class="btn btn-sm btn-secondary" onclick="State.markIncidentRead('${inc.id}')">${t('alerts.markRead')}</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
