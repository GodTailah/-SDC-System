// --- PAGE FRAGMENT LOADER ---
const PAGES = ['dashboard', 'camera', 'alerts', 'incidents', 'map', 'stats', 'settings'];
let appReady = false;

async function loadPages() {
    await Promise.all(PAGES.map(async (page) => {
        const res = await fetch(`pages/${page}.html`);
        if (!res.ok) throw new Error(`pages/${page}.html: HTTP ${res.status}`);
        const html = await res.text();
        const container = document.getElementById(`page-${page}`);
        if (container) container.innerHTML = html;
    }));
}

// fetch() is blocked when index.html is opened straight from disk (file://),
// so explain how to run the prototype instead of leaving every page blank.
function showLoadError(err) {
    console.error(err);
    document.getElementById('page-dashboard').innerHTML = `
        <div class="card load-error">
            <h2>${t('error.loadTitle')}</h2>
            <p>${t('error.loadBody')}</p>
            <code>${escapeHtml(err.message)}</code>
        </div>
    `;
}

// --- RENDERING ---
let renderedDay = todayKey();

function renderDataViews() {
    renderedDay = todayKey();
    updateDashboardStats();
    updateAlertsList();
    updateIncidentsList();
    updateMap();
    updateCharts();
}

PubSub.on('data_updated', () => {
    if (appReady) renderDataViews();
});

PubSub.on('notifications_changed', () => {
    if (appReady) updateNotifications();
});

// Re-render everything built in JS; static markup is already handled by applyTranslations()
PubSub.on('language_changed', () => {
    updateTopbarTitle();
    updateSidebarToggleTitle();
    renderDemoPanel();
    if (!appReady) return;

    initCameraPage();
    renderAlertFilters();
    renderStatusFilterOptions();
    renderStatsTypeOptions();
    hideMapTooltip();
    renderDataViews();
    updateNotifications();
    updateSettingsView();

    const openInc = State.incidents.find(i => i.id === State.currentIncidentId);
    if (openInc) renderIncidentDetail(openInc);
});

// Boot
window.onload = async () => {
    // Fetch every page fragment and inject it into its container before
    // wiring up anything that depends on elements living inside them.
    try {
        await loadPages();
    } catch (err) {
        showLoadError(err);
        return;
    }
    applyTranslations();

    State.init();
    initAlertsPage();
    initIncidentsPage();
    initSettingsPage();
    initCameraPage();
    initCharts();
    applyUserToUI(); // fill officer info on the freshly loaded settings page

    appReady = true;
    renderDataViews();
    updateNotifications();

    // If the page stays open past midnight, refresh everything that depends on
    // "today" (dashboard date and counts, stats date filters, table dates)
    setInterval(() => {
        if (todayKey() !== renderedDay) renderDataViews();
    }, 60 * 1000);
};
