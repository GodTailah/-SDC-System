// --- DASHBOARD ---
function renderStatCard(label, value, color, bg, icon) {
    return `
        <div class="card stat-card" style="border-left: 4px solid ${color};">
            <div class="stat-icon" style="background-color: ${bg}; color: ${color};">${icon}</div>
            <div class="stat-title">${label}</div>
            <div class="stat-value">${value}</div>
        </div>
    `;
}

function updateDashboardStats() {
    const data = State.incidents;
    const today = data.filter(i => i.date === todayKey());

    document.getElementById('dash-today-date').innerText = formatDate(todayKey());

    // Per-type cards count today's events only
    document.getElementById('dash-type-cards').innerHTML =
        renderStatCard(t('dash.todayEvents'), today.length, 'var(--primary-color)', 'var(--primary-light)', svgIcon(17, ICON_PATHS.Clipboard, 2)) +
        INCIDENT_TYPES.map(type => renderStatCard(
            typeLabel(type),
            today.filter(i => i.type === type).length,
            TYPE_META[type].color,
            TYPE_META[type].bg,
            getIncidentIconSVG(type, 17)
        )).join('');

    // Status breakdown covers every open case, whatever day it was detected
    document.getElementById('dash-stat-new').innerText = data.filter(i => i.status === 'Pending').length;
    document.getElementById('dash-stat-reviewing').innerText = data.filter(i => ['Reviewed', 'Verified'].includes(i.status)).length;
    document.getElementById('dash-stat-actiontaken').innerText = data.filter(i => ['Action Taken', 'Responding'].includes(i.status)).length;

    const { online, total } = getOnlineCameraCount();
    document.getElementById('dash-stat-cameras').innerText = `${online}/${total}`;

    // Recent alerts table (newest 5)
    document.getElementById('dash-alerts-table').innerHTML = data.slice(0, 5).map(inc => `
        <tr>
            <td><strong>${inc.id}</strong></td>
            <td class="nowrap">${formatDateTime(inc.date, inc.time)}</td>
            <td>${typeLabel(inc.type)}</td>
            <td>${locLabel(inc.loc)}</td>
            <td>${getStatusBadge(inc.status)}</td>
            <td><button class="btn btn-sm btn-secondary" onclick="openIncidentDetail('${inc.id}')">${t('common.view')}</button></td>
        </tr>
    `).join('');

    // Top risk locations (hotspots)
    const locCounts = {};
    data.forEach(i => locCounts[i.loc] = (locCounts[i.loc] || 0) + 1);
    const topLocs = Object.keys(locCounts).sort((a, b) => locCounts[b] - locCounts[a]).slice(0, 3);

    const hotspots = document.getElementById('dash-hotspots');
    if (topLocs.length === 0) {
        hotspots.innerHTML = `<p style="color:var(--text-secondary); font-size:0.9rem;">${t('dash.noIncidents')}</p>`;
        return;
    }
    hotspots.innerHTML = topLocs.map((loc, idx) => {
        const count = locCounts[loc];
        const risk = getRiskLevel(count);
        const cls = { High: 'status-verified', Medium: 'status-responding', Low: 'status-closed' }[risk];
        return `
            <div class="detail-row" style="cursor:pointer;" onclick="navTo('map')">
                <span class="detail-label">${idx + 1}. ${locLabel(loc)}</span>
                <span class="detail-value" style="display:flex; align-items:center; gap:8px;">
                    ${t('dash.eventsCount', { n: count })}
                    <span class="status-badge ${cls}" style="padding:2px 8px;">${t(`risk.${risk}`)}</span>
                </span>
            </div>
        `;
    }).join('');
}
