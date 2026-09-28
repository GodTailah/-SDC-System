// --- CONSTANTS & MOCK DATA ---
const LS_KEY = 'smartDriveCampus';
const PREFS_KEY = 'sdc_prefs';

// Bump whenever the mock data or incident shape changes: saved data with a
// different version is replaced by the fresh demo dataset automatically
// (unless State.init knows how to migrate it).
const DATA_VERSION = 3;

const INCIDENT_TYPES = ['Speeding', 'Pedestrian Violation', 'Illegal Parking', 'Wrong-way', 'No Helmet', 'No License Plate', 'Possible Accident'];
const STATUSES = ['Pending', 'Reviewed', 'Verified', 'Responding', 'Action Taken', 'Closed', 'Dismissed'];
const CLOSED_STATUSES = ['Closed', 'Dismissed'];

// Types where a vehicle plate is readable (pedestrians have none, and
// "No License Plate" is by definition unreadable)
const PLATE_TYPES = ['Speeding', 'Illegal Parking', 'Wrong-way', 'No Helmet', 'Possible Accident'];

const SPEED_LIMIT = 50; // km/h campus limit

// Status flow per incident type; Dismissed can end either flow early
function getStatusFlow(type) {
    return type === 'Possible Accident'
        ? ['Pending', 'Verified', 'Responding', 'Closed']
        : ['Pending', 'Reviewed', 'Action Taken', 'Closed'];
}

// Last flow step reached before a dismissal: accidents are dismissed right after
// detection (False Alarm), other types after being reviewed.
function getDismissedAfterIdx(type) {
    return type === 'Possible Accident' ? 0 : 1;
}

// dayOffset: 0 = today, 1 = yesterday, ... Real dates/times are assigned by
// anchorMockIncidents() each time the app opens.
const INITIAL_MOCK_DATA = [
    { id: "SDC-001", dayOffset: 3, type: "Speeding", loc: "Gate 2", cam: "C02", time: "08:20", speed: 72, conf: 96, plate: "กท 4821", status: "Closed" },
    { id: "SDC-002", dayOffset: 3, type: "Pedestrian Violation", loc: "Crosswalk A", cam: "C03", time: "10:42", conf: 91, plate: null, status: "Closed" },
    { id: "SDC-003", dayOffset: 2, type: "Illegal Parking", loc: "Building A", cam: "C04", time: "09:15", conf: 88, plate: "1กข 7730", status: "Closed" },
    { id: "SDC-004", dayOffset: 2, type: "Possible Accident", loc: "Gate 1", cam: "C01", time: "14:32", conf: 89, plate: "ขค 1956", status: "Dismissed" },
    { id: "SDC-005", dayOffset: 1, type: "Speeding", loc: "Gate 1", cam: "C01", time: "08:50", speed: 66, conf: 94, plate: "งจ 3310", status: "Closed" },
    { id: "SDC-006", dayOffset: 1, type: "No Helmet", loc: "Gate 2", cam: "C02", time: "16:10", conf: 92, plate: "2กค 845", status: "Action Taken" },
    { id: "SDC-007", dayOffset: 0, type: "No Helmet", loc: "Gate 1", cam: "C01", time: "08:05", conf: 90, plate: "1ฒษ 624", status: "Pending" },
    { id: "SDC-008", dayOffset: 0, type: "Speeding", loc: "Gate 2", cam: "C02", time: "08:40", speed: 65, conf: 94, plate: "ฆม 2207", status: "Reviewed" },
    { id: "SDC-009", dayOffset: 0, type: "No License Plate", loc: "Gate 2", cam: "C02", time: "09:30", conf: 88, plate: null, status: "Reviewed" },
    { id: "SDC-010", dayOffset: 0, type: "Speeding", loc: "Gate 2", cam: "C02", time: "09:45", speed: 61, conf: 92, plate: "ชล 9031", status: "Action Taken" },
    { id: "SDC-011", dayOffset: 0, type: "Pedestrian Violation", loc: "Crosswalk A", cam: "C03", time: "10:35", conf: 87, plate: null, status: "Pending" },
    { id: "SDC-012", dayOffset: 0, type: "Illegal Parking", loc: "Building A", cam: "C04", time: "11:20", conf: 90, plate: "บพ 5512", status: "Pending" },
    { id: "SDC-013", dayOffset: 0, type: "No Helmet", loc: "Gate 2", cam: "C02", time: "12:10", conf: 93, plate: "3กธ 118", status: "Action Taken" },
    { id: "SDC-014", dayOffset: 0, type: "Speeding", loc: "Gate 1", cam: "C01", time: "12:30", speed: 68, conf: 95, plate: "ศร 7084", status: "Closed" },
    { id: "SDC-015", dayOffset: 0, type: "Possible Accident", loc: "Gate 1", cam: "C01", time: "13:05", conf: 89, plate: "นก 6645", status: "Verified" },
    { id: "SDC-016", dayOffset: 0, type: "Speeding", loc: "Gate 2", cam: "C02", time: "14:15", speed: 59, conf: 91, plate: "ผส 2390", status: "Pending" },
    { id: "SDC-017", dayOffset: 0, type: "Pedestrian Violation", loc: "Crosswalk A", cam: "C03", time: "15:05", conf: 85, plate: null, status: "Reviewed" },
    { id: "SDC-018", dayOffset: 0, type: "No License Plate", loc: "Gate 1", cam: "C01", time: "15:40", conf: 86, plate: null, status: "Pending" },
    { id: "SDC-019", dayOffset: 0, type: "Speeding", loc: "Gate 1", cam: "C01", time: "16:45", speed: 70, conf: 97, plate: "รว 4178", status: "Pending" },
    { id: "SDC-020", dayOffset: 0, type: "Wrong-way", loc: "Gate 2", cam: "C02", time: "17:20", conf: 89, plate: "กฮ 3052", status: "Pending" }
];

const MOCK_OFFICER = 'Chompoonuch';

const CAMS = {
    'C01': 'Gate 1',
    'C02': 'Gate 2',
    'C03': 'Crosswalk A',
    'C04': 'Building A'
};

const CAMERA_STATUS = {
    'C01': 'Online',
    'C02': 'Online',
    'C03': 'Online',
    'C04': 'Offline'
};

// --- DATE HELPERS ---
const pad2 = (n) => String(n).padStart(2, '0');

function toDateKey(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayKey() {
    return toDateKey(new Date());
}

// { date: 'YYYY-MM-DD', time: 'HH:MM' } for right now
function nowStamp() {
    const now = new Date();
    return { date: toDateKey(now), time: `${pad2(now.getHours())}:${pad2(now.getMinutes())}` };
}

const toMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};
const fromMinutes = (mins) => `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`;

// Stamps are "YYYY-MM-DD HH:MM" in local time
function stampToDate(stamp) {
    const [date, time] = stamp.split(' ');
    const [y, mo, d] = date.split('-').map(Number);
    return new Date(y, mo - 1, d, 0, toMinutes(time));
}

function dateToStamp(d) {
    return `${toDateKey(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Re-places the demo incidents on the real calendar every time the app opens:
// each one lands `dayOffset` days before today, and today's are squeezed before
// the current time so none are in the future. Right after midnight (too little
// of today has passed) the "today" set is shown as yesterday instead.
// User-simulated incidents (no `mock` field) are never moved.
const MOCK_MIN_TODAY_WINDOW = 120; // minutes of today needed to hold today's demo events

function anchorMockIncidents(incidents, now = new Date()) {
    const mocks = incidents.filter(i => i.mock);
    const lastToday = Math.max(0, ...mocks.filter(i => i.mock.dayOffset === 0).map(i => toMinutes(i.mock.time)));
    const end = Math.max(0, now.getHours() * 60 + now.getMinutes() - 5); // latest allowed time today
    const extraDays = end < MOCK_MIN_TODAY_WINDOW ? 1 : 0;
    const scale = !extraDays && lastToday > end ? end / lastToday : 1;

    mocks.forEach(inc => {
        const { dayOffset, time } = inc.mock;
        const mins = dayOffset === 0 ? Math.round(toMinutes(time) * scale) : toMinutes(time);
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset - extraDays, 0, mins);

        // Move the incident's history and notes by the same amount, never past "now"
        const shiftMs = target - stampToDate(`${inc.date} ${inc.time}`);
        const shift = (stamp) => dateToStamp(new Date(Math.min(stampToDate(stamp).getTime() + shiftMs, now.getTime())));

        inc.date = toDateKey(target);
        inc.time = fromMinutes(mins);
        inc.history.forEach(h => { h.at = shift(h.at); });
        inc.notes.forEach(n => { n.at = shift(n.at); });
    });
    return sortNewestFirst(incidents);
}

function sortNewestFirst(incidents) {
    return incidents.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
}

// Status history for a mock incident, consistent with its current status
function buildMockHistory(inc) {
    const flow = getStatusFlow(inc.type);
    const reached = inc.status === 'Dismissed'
        ? [...flow.slice(0, getDismissedAfterIdx(inc.type) + 1), 'Dismissed']
        : flow.slice(0, flow.indexOf(inc.status) + 1);

    const [h, m] = inc.time.split(':').map(Number);
    return reached.map((status, idx) => {
        const mins = h * 60 + m + idx * 12; // each step ~12 minutes after the previous
        return {
            status,
            at: `${inc.date} ${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`,
            by: idx === 0 ? 'System' : MOCK_OFFICER
        };
    });
}

// Random Thai-style plate, e.g. "กข 1234"
function randomPlate() {
    const letters = 'กขคฆงจฉชซญฎฐฒณดตถทธนบปผพฟภมยรลวศษสหฬอฮ';
    const pick = () => letters[Math.floor(Math.random() * letters.length)];
    return `${pick()}${pick()} ${Math.floor(Math.random() * 9000) + 1000}`;
}

// --- STATE & PUB/SUB ---
const PubSub = {
    events: {},
    on(evt, cb) {
        if (!this.events[evt]) this.events[evt] = [];
        this.events[evt].push(cb);
    },
    emit(evt, data) {
        if (this.events[evt]) {
            this.events[evt].forEach(cb => cb(data));
        }
    }
};

// Per-browser user preferences
const Prefs = {
    sound: true,
    load() {
        try {
            const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
            if (typeof saved.sound === 'boolean') this.sound = saved.sound;
        } catch (e) { /* keep defaults */ }
    },
    save() {
        localStorage.setItem(PREFS_KEY, JSON.stringify({ sound: this.sound }));
    }
};
Prefs.load();

const State = {
    incidents: [],
    notifications: [],
    demoMode: false,
    currentIncidentId: null,
    init() {
        let parsed = null;
        try {
            parsed = JSON.parse(localStorage.getItem(LS_KEY));
        } catch (e) { /* corrupt data: fall through to mock */ }

        if (!parsed || ![2, DATA_VERSION].includes(parsed.version)) {
            this.loadMock();
            return;
        }
        this.incidents = parsed.incidents || [];
        this.notifications = parsed.notifications || [];

        // v2 data has the same shape but doesn't mark which incidents are demo data
        if (parsed.version === 2) {
            this.incidents.forEach(inc => {
                const spec = INITIAL_MOCK_DATA.find(m => m.id === inc.id);
                if (spec && !inc.mock) inc.mock = { dayOffset: spec.dayOffset, time: spec.time };
            });
        }

        this.incidents.forEach(inc => {
            // Demo incidents always follow the current mock speeds and speed limit
            const spec = inc.mock && INITIAL_MOCK_DATA.find(m => m.id === inc.id);
            if (spec && spec.speed) {
                inc.speed = spec.speed;
                inc.limit = SPEED_LIMIT;
            }
            // Anything recorded under an older limit moves to the current one,
            // keeping how far over the limit it was (e.g. 41/30 -> 61/50)
            if (inc.speed && inc.limit !== SPEED_LIMIT) {
                inc.speed = inc.speed - inc.limit + SPEED_LIMIT;
                inc.limit = SPEED_LIMIT;
            }
        });

        anchorMockIncidents(this.incidents);
        this.save();
    },
    loadMock() {
        const today = new Date();
        this.incidents = INITIAL_MOCK_DATA.map(({ dayOffset, ...base }) => {
            const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOffset);
            const inc = { ...base, date: toDateKey(day), read: true, notes: [], mock: { dayOffset, time: base.time } };
            if (inc.speed) inc.limit = SPEED_LIMIT;
            inc.history = buildMockHistory(inc);
            return inc;
        });
        anchorMockIncidents(this.incidents);
        this.notifications = [];
        this.save();
    },
    save() {
        localStorage.setItem(LS_KEY, JSON.stringify({
            version: DATA_VERSION,
            incidents: this.incidents,
            notifications: this.notifications
        }));
        PubSub.emit('data_updated', this.incidents);
    },
    addIncident(inc) {
        this.incidents.unshift(inc); // newest first

        this.notifications.unshift({
            id: 'NOTIF-' + Date.now(),
            incidentId: inc.id,
            read: false
        });

        this.save();
        PubSub.emit('notifications_changed');
        playBeep();
    },
    updateIncidentStatus(id, newStatus, by) {
        const inc = this.incidents.find(i => i.id === id);
        if (!inc) return;
        const { date, time } = nowStamp();
        inc.status = newStatus;
        inc.history.push({ status: newStatus, at: `${date} ${time}`, by });
        this.save();
    },
    addNote(id, text, by) {
        const inc = this.incidents.find(i => i.id === id);
        if (!inc) return;
        const { date, time } = nowStamp();
        inc.notes.push({ text, at: `${date} ${time}`, by });
        this.save();
    },
    // An incident and its notifications share one read state: reading either marks both
    markIncidentRead(id) {
        const inc = this.incidents.find(i => i.id === id);
        const unreadNotifs = this.notifications.filter(n => n.incidentId === id && !n.read);
        const incUnread = inc && !inc.read;
        if (!incUnread && unreadNotifs.length === 0) return;

        if (inc) inc.read = true;
        unreadNotifs.forEach(n => n.read = true);
        this.save();
        PubSub.emit('notifications_changed');
    },
    markNotificationRead(id) {
        const n = this.notifications.find(x => x.id === id);
        if (n) this.markIncidentRead(n.incidentId);
    },
    clearNotifications() {
        this.notifications = [];
        this.save();
        PubSub.emit('notifications_changed');
    },
    getNextId() {
        const nums = this.incidents.map(i => parseInt(i.id.split('-')[1]));
        const max = Math.max(0, ...nums);
        return `SDC-${String(max + 1).padStart(3, '0')}`;
    }
};
