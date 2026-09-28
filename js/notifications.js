// --- NOTIFICATIONS ---
function updateNotifications() {
    const badge = document.getElementById('notif-badge');
    const list = document.getElementById('notif-list');

    const unreadCount = State.notifications.filter(n => !n.read).length;
    badge.innerText = unreadCount;
    badge.style.display = unreadCount === 0 ? 'none' : 'block';

    list.innerHTML = '';
    if (State.notifications.length === 0) {
        list.innerHTML = `<div class="dropdown-item text-center" style="color:var(--text-secondary)">${t('notif.empty')}</div>`;
        return;
    }

    State.notifications.forEach(n => {
        // Text is built from the incident at render time so it follows the current language
        const inc = State.incidents.find(i => i.id === n.incidentId);
        const text = inc ? t('notif.new', { type: typeLabel(inc.type), loc: locLabel(inc.loc) }) : n.incidentId;
        const time = inc ? formatDateTime(inc.date, inc.time) : '';

        const item = document.createElement('div');
        item.className = 'dropdown-item' + (n.read ? ' read' : '');
        item.innerHTML = `
            <div class="flex-between" style="gap:10px;">
                <div>
                    <div class="dropdown-title">${text}</div>
                    <div class="dropdown-time">${time} • ${n.incidentId}</div>
                </div>
                ${!n.read ? `<button class="btn btn-sm btn-secondary mark-read-btn" title="${t('notif.markRead')}" aria-label="${t('notif.markRead')}">✓</button>` : ''}
            </div>
        `;
        item.addEventListener('click', (e) => {
            if (e.target.closest('.mark-read-btn')) {
                // The list re-renders (detaching this item), which would otherwise make
                // the outside-click handler think the click was outside and close the dropdown
                e.stopPropagation();
                State.markNotificationRead(n.id);
                return;
            }
            closeNotifications();
            openIncidentDetail(n.incidentId);
        });
        list.appendChild(item);
    });
}

function closeNotifications() {
    document.getElementById('notif-wrapper').classList.remove('open');
}

// Only the bell toggles the dropdown; clicks inside the dropdown keep it open
document.getElementById('notif-bell').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notif-wrapper').classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#notif-wrapper')) closeNotifications();
});

document.getElementById('clear-notifs').addEventListener('click', () => {
    State.clearNotifications();
    closeNotifications();
});
