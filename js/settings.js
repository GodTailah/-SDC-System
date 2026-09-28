// --- SETTINGS ---
const isAdmin = () => Boolean(Auth.user && Auth.user.role === 'admin');

// Called after pages/settings.html has been loaded into the DOM
function initSettingsPage() {
    document.getElementById('btn-reset-data').addEventListener('click', () => {
        if (!isAdmin()) return;
        if (confirm(t('set.confirmReset'))) {
            State.loadMock();
            alert(t('set.resetDone'));
            navTo('dashboard');
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        if (confirm(t('set.confirmLogout'))) {
            setDemoMode(false);
            closeNotifications();
            Auth.logout();
            showLoginScreen('login.loggedOut');
        }
    });

    document.getElementById('settings-sound').addEventListener('change', (e) => {
        Prefs.sound = e.target.checked;
        Prefs.save();
        if (Prefs.sound) playBeep(); // preview
        updateSettingsView();
    });

    updateSettingsView();
}

function updateSettingsView() {
    const demo = document.getElementById('settings-demo-status');
    if (!demo) return; // settings page not loaded yet
    demo.innerText = t(State.demoMode ? 'common.on' : 'common.off');

    document.getElementById('settings-sound').checked = Prefs.sound;
    document.getElementById('settings-sound-status').innerText = t(Prefs.sound ? 'common.on' : 'common.off');

    // Resetting the shared demo data is an admin-only action
    const admin = isAdmin();
    document.getElementById('btn-reset-data').disabled = !admin;
    document.getElementById('settings-admin-note').style.display = admin ? 'none' : 'block';
}
