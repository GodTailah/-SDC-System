// --- CAMERA SIMULATION LOGIC ---
const SIM_TYPES = ['Normal', ...INCIDENT_TYPES];
const AUTO_SIM_INTERVALS = [5, 10, 30]; // seconds

// Last detection per camera, kept so the meta line can be re-rendered in another language
const lastDetection = {};
let autoSimTimer = null;

// Called after pages/camera.html has been loaded into the DOM
function initCameraPage() {
    Object.keys(CAMERA_STATUS).forEach(camId => {
        renderCameraControls(camId);
        renderCameraStatus(camId);
        renderCameraMeta(camId);
    });

    const { online, total } = getOnlineCameraCount();
    const badge = document.getElementById('camera-live-badge');
    if (badge) badge.innerText = t('cam.onlineBadge', { online, total });
}

function renderCameraControls(camId) {
    const controls = document.querySelector(`#cam-${camId} .camera-controls`);
    if (!controls) return;
    controls.innerHTML = SIM_TYPES.map(type =>
        `<button class="btn btn-secondary btn-sm" onclick="simEvent('${camId}', '${type}')">${typeShort(type)}</button>`
    ).join('');
}

function renderCameraStatus(camId) {
    const panel = document.getElementById(`cam-${camId}`);
    if (!panel) return;

    const isOnline = CAMERA_STATUS[camId] === 'Online';
    const indicator = panel.querySelector('.status-indicator');
    const overlay = panel.querySelector('.cam-overlay');

    if (indicator) {
        indicator.innerText = t(isOnline ? 'cam.online' : 'cam.offline');
        indicator.style.color = isOnline ? 'var(--success-color)' : 'var(--text-muted)';
    }
    if (overlay && !isOnline) {
        overlay.innerText = 'NO SIGNAL';
        overlay.style.color = 'var(--text-muted)';
    }

    panel.querySelectorAll('.camera-controls button').forEach(btn => {
        btn.disabled = !isOnline;
        btn.style.opacity = isOnline ? '1' : '0.5';
        btn.style.cursor = isOnline ? 'pointer' : 'not-allowed';
    });
}

function renderCameraMeta(camId) {
    const meta = document.querySelector(`#cam-${camId} .camera-meta`);
    if (!meta) return;
    const last = lastDetection[camId];
    if (!last) {
        meta.innerText = t('cam.awaiting');
        return;
    }
    const speed = last.speed ? ` (${last.speed} ${t('unit.kmh')})` : '';
    const plate = last.plate ? ` • ${last.plate}` : '';
    meta.innerHTML = `${t('cam.last')} ${getIncidentIconSVG(last.type, 13)} ${typeLabel(last.type)}${speed}${plate} • ${last.conf}% • ${last.time}`;
}

function getOnlineCameraCount() {
    const ids = Object.keys(CAMERA_STATUS);
    return {
        online: ids.filter(id => CAMERA_STATUS[id] === 'Online').length,
        total: ids.length
    };
}

function simEvent(camId, type) {
    if (CAMERA_STATUS[camId] !== 'Online') return; // offline cameras can't detect anything

    const panel = document.getElementById(`cam-${camId}`);
    if (!panel) return;

    const overlay = panel.querySelector('.cam-overlay');
    const detText = panel.querySelector('.detection-text');

    if (type === 'Normal') {
        panel.classList.remove('alert');
        overlay.innerText = 'SYS_OK';
        overlay.style.color = 'var(--success-color)';
        return;
    }

    // Visual effect
    panel.classList.add('alert');
    overlay.innerText = 'ALERT_DETECTED';
    overlay.style.color = 'var(--danger-color)';

    const speed = type === 'Speeding' ? SPEED_LIMIT + 5 + Math.floor(Math.random() * 26) : null; // 5-30 over the limit
    const plate = PLATE_TYPES.includes(type) ? randomPlate() : null;
    const conf = Math.floor(Math.random() * 15) + 85; // 85-99
    const { date, time } = nowStamp();

    const label = speed ? t('cam.speedLimit', { speed, limit: SPEED_LIMIT }) : typeLabel(type).toUpperCase();
    detText.innerText = plate ? `${label} · ${plate}` : label;

    const newInc = {
        id: State.getNextId(),
        type,
        loc: CAMS[camId],
        cam: camId,
        date,
        time,
        plate,
        conf,
        status: 'Pending',
        read: false,
        history: [{ status: 'Pending', at: `${date} ${time}`, by: 'System' }],
        notes: []
    };
    if (speed) {
        newInc.speed = speed;
        newInc.limit = SPEED_LIMIT;
    }

    State.addIncident(newInc);

    // Persistent last-detection info (survives the 5s visual reset)
    lastDetection[camId] = { type, speed, plate, conf, time };
    renderCameraMeta(camId);

    // Auto reset visual after 5s
    setTimeout(() => {
        if (panel.classList.contains('alert')) {
            panel.classList.remove('alert');
            overlay.innerText = 'SYS_OK';
            overlay.style.color = 'var(--success-color)';
        }
    }, 5000);
}

function randomSim(type) {
    const onlineCamIds = Object.keys(CAMS).filter(id => CAMERA_STATUS[id] === 'Online');
    if (onlineCamIds.length === 0) return;
    const randomCam = onlineCamIds[Math.floor(Math.random() * onlineCamIds.length)];
    simEvent(randomCam, type);
}

// --- DEMO PANEL ---
function renderDemoPanel() {
    document.getElementById('demo-buttons').innerHTML = SIM_TYPES.map(type => `
        <button class="btn btn-secondary demo-btn" onclick="randomSim('${type}')">
            ${getIncidentIconSVG(type, 14)}
            <span>${t('demo.simulate', { type: typeLabel(type) })}</span>
        </button>
    `).join('');

    const select = document.getElementById('demo-auto-interval');
    const current = select.value || String(AUTO_SIM_INTERVALS[0]);
    select.innerHTML = AUTO_SIM_INTERVALS.map(n => `<option value="${n}">${t('demo.every', { n })}</option>`).join('');
    select.value = current;
}

function startAutoSim() {
    stopAutoSim();
    const seconds = parseInt(document.getElementById('demo-auto-interval').value, 10);
    autoSimTimer = setInterval(() => {
        randomSim(INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)]);
    }, seconds * 1000);
}

function stopAutoSim() {
    if (autoSimTimer) clearInterval(autoSimTimer);
    autoSimTimer = null;
}

function syncAutoSim() {
    const enabled = State.demoMode && document.getElementById('demo-auto-toggle').checked;
    if (enabled) startAutoSim();
    else stopAutoSim();
}

function setDemoMode(on) {
    State.demoMode = on;
    document.getElementById('demo-toggle').classList.toggle('active', on);
    document.getElementById('demo-panel').classList.toggle('active', on);
    if (!on) document.getElementById('demo-auto-toggle').checked = false;
    syncAutoSim();
    if (typeof updateSettingsView === 'function') updateSettingsView();
}

document.getElementById('demo-toggle').addEventListener('click', () => setDemoMode(!State.demoMode));
document.getElementById('demo-auto-toggle').addEventListener('change', syncAutoSim);
document.getElementById('demo-auto-interval').addEventListener('change', syncAutoSim);
renderDemoPanel();
