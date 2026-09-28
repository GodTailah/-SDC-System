// --- AUDIO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep() {
    if (!Prefs.sound) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// --- UTILS ---
// Colors per incident type (badge class + accent/background for stat cards)
const TYPE_META = {
    'Speeding': { badge: 'badge-warning', color: '#f59e0b', bg: '#fffbeb' },
    'Pedestrian Violation': { badge: 'badge-indigo', color: '#4f46e5', bg: '#eef2ff' },
    'Illegal Parking': { badge: 'badge-slate', color: '#64748b', bg: '#f8fafc' },
    'Wrong-way': { badge: 'badge-purple', color: '#7c3aed', bg: '#f5f3ff' },
    'No Helmet': { badge: 'badge-orange', color: '#ea580c', bg: '#fff7ed' },
    'No License Plate': { badge: 'badge-teal', color: '#0d9488', bg: '#f0fdfa' },
    'Possible Accident': { badge: 'badge-danger', color: '#ef4444', bg: '#fef2f2' },
    'Normal': { badge: 'badge-success', color: '#10b981', bg: '#ecfdf5' }
};

function getStatusClass(status) {
    const map = {
        'Pending': 'status-pending pulse',
        'Reviewed': 'status-reviewed',
        'Action Taken': 'status-action-taken',
        'Closed': 'status-closed',
        'Verified': 'status-verified pulse',
        'Responding': 'status-responding',
        'Dismissed': 'status-dismissed'
    };
    return map[status] || 'status-closed';
}

function getStatusBadge(status) {
    return `<span class="status-badge ${getStatusClass(status)}">${statusLabel(status)}</span>`;
}

const svgIcon = (size, paths, strokeWidth = 2.2) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const ICON_PATHS = {
    'Possible Accident': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'Speeding': '<circle cx="12" cy="12" r="9"/><path d="M12 2v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="m16 8-4 4"/>',
    'Pedestrian Violation': '<circle cx="12" cy="4" r="2"/><path d="m9 20 3-6 3 6"/><path d="m6 13 6-3 6 3"/><path d="M12 10v4"/>',
    'Illegal Parking': '<rect width="18" height="18" x="3" y="3" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    'Wrong-way': '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
    'No Helmet': '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/>',
    'No License Plate': '<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 12h3"/><path d="M13 12h5"/><line x1="3" y1="3" x2="21" y2="21"/>',
    'Normal': '<polyline points="20 6 9 17 4 12"/>',
    'Vehicle': '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.3 2 11.7 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    'Clipboard': '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M9 12h6"/><path d="M9 16h6"/>',
    'MapPin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'Clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
};

function getIncidentIconSVG(type, size = 14) {
    return svgIcon(size, ICON_PATHS[type] || ICON_PATHS.Vehicle);
}

function getIncidentBadge(type, size = 14) {
    const badgeClass = (TYPE_META[type] || {}).badge || 'badge-slate';
    return `<span class="icon-badge-box ${badgeClass}">${getIncidentIconSVG(type, size)}</span>`;
}

// Risk level by event count at a location; keep in sync with the legend on pages/map.html
function getRiskLevel(count) {
    if (count > 10) return 'High';
    if (count >= 5) return 'Medium';
    return 'Low';
}

function getCurrentTime() {
    return nowStamp().time;
}

// --- FORMATTING ---
function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function parseDateKey(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);
    return new Date(y, m - 1, d);
}

// "28 Sep 2026" / "28 ก.ย. 2569"
function formatDate(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString(getLocale(), { day: 'numeric', month: 'short', year: 'numeric' });
}

// "28 Sep, 10:35" (short, for tables)
function formatDateTime(dateKey, time) {
    const day = parseDateKey(dateKey).toLocaleDateString(getLocale(), { day: 'numeric', month: 'short' });
    return `${day} ${time}`;
}

// Stamps are stored as "YYYY-MM-DD HH:MM"
function formatStamp(stamp) {
    const [date, time] = stamp.split(' ');
    return formatDateTime(date, time);
}

function plateText(inc) {
    if (inc.plate) return inc.plate;
    return inc.type === 'No License Plate' ? t('plate.none') : t('plate.na');
}
