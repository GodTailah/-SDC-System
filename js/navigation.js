// --- NAVIGATION ---
let currentPage = 'dashboard';

function navTo(pageId) {
    currentPage = pageId;
    document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(`page-${pageId}`).classList.add('active');
    const navLink = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (navLink) navLink.classList.add('active');

    updateTopbarTitle();

    if (pageId === 'incidents') {
        document.getElementById('incidents-list-view').style.display = 'block';
        document.getElementById('incidents-detail-view').style.display = 'none';
        State.currentIncidentId = null;
    }

    // Trigger chart resize if going to stats
    if (pageId === 'stats' && charts.type) {
        charts.type.resize();
        charts.loc.resize();
        charts.time.resize();
    }
}

function updateTopbarTitle() {
    const title = document.getElementById('topbar-title');
    if (title) title.innerText = t(`page.${currentPage}`);
}

// --- SIDEBAR TOGGLE ---
const isMobileView = () => window.innerWidth <= 900;

function updateSidebarToggleTitle() {
    const sidebar = document.getElementById('main-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (!toggleBtn) return;
    const label = t(sidebar.classList.contains('collapsed') ? 'sidebar.expand' : 'sidebar.collapse');
    toggleBtn.setAttribute('title', label);
    toggleBtn.setAttribute('aria-label', label);
}

function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');

    if (isMobileView()) {
        overlay.classList.toggle('active', !isCollapsed);
    } else {
        localStorage.setItem('sdc_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    }
    updateSidebarToggleTitle();

    // Trigger chart resize if charts exist
    if (charts && charts.type) {
        setTimeout(() => {
            if (charts.type) charts.type.resize();
            if (charts.loc) charts.loc.resize();
            if (charts.time) charts.time.resize();
        }, 320);
    }
}

// The sidebar starts collapsed in the markup (so it never flashes open on mobile);
// on desktop, expand it right away unless the user collapsed it last time.
(function restoreSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    if (!isMobileView() && localStorage.getItem('sdc_sidebar_collapsed') !== 'true') {
        sidebar.classList.remove('collapsed');
    }
    updateSidebarToggleTitle();
})();
updateTopbarTitle();

const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);

const sidebarOpen = document.getElementById('sidebar-open');
if (sidebarOpen) sidebarOpen.addEventListener('click', toggleSidebar);

const sidebarOverlay = document.getElementById('sidebar-overlay');
if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        navTo(el.getAttribute('data-page'));
        if (isMobileView()) {
            document.getElementById('main-sidebar').classList.add('collapsed');
            document.getElementById('sidebar-overlay').classList.remove('active');
        }
    });
});
