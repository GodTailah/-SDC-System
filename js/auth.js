// --- AUTH (simulated, client-side only) ---
// Credentials are checked in the browser against MOCK_USERS. This is for the
// prototype demo only and provides no real security.
const AUTH_KEY = 'sdc_session';

const MOCK_USERS = [
    { email: 'chompoonuch@sdc-demo.ac.th', password: 'demo1234', name: 'Chompoonuch', initials: 'CM', role: 'officer' },
    { email: 'admin@sdc-demo.ac.th', password: 'admin1234', name: 'Admin', initials: 'AD', role: 'admin' }
];

const Auth = {
    user: null,
    init() {
        // "Remember me" sessions live in localStorage, others only for this tab
        const email = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
        this.user = MOCK_USERS.find(u => u.email === email) || null;
    },
    login(email, password, remember) {
        const user = MOCK_USERS.find(u => u.email === email.toLowerCase() && u.password === password);
        if (!user) return false;
        this.user = user;
        (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, user.email);
        return true;
    },
    logout() {
        this.user = null;
        localStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_KEY);
    }
};

// --- LOGIN UI ---
// Messages are kept as i18n keys so they can be re-rendered when the language changes
let loginErrorKey = '';
let loginNoticeKey = '';

function applyUserToUI() {
    const user = Auth.user;
    if (!user) return;
    const set = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };
    set('officer-avatar', user.initials);
    set('officer-name', user.name);
    set('settings-officer-name', `${user.name} (${user.initials})`);
    set('settings-officer-email', user.email);
    set('settings-officer-role', t(`role.${user.role}`));
    if (typeof updateSettingsView === 'function') updateSettingsView();
}

function renderLoginMessages() {
    document.getElementById('login-error').innerText = loginErrorKey ? t(loginErrorKey) : '';
    document.getElementById('login-notice').innerText = loginNoticeKey ? t(loginNoticeKey) : '';
}

function setLoginError(key) {
    loginErrorKey = key;
    renderLoginMessages();
    if (!key) return;
    const card = document.getElementById('login-card');
    card.classList.remove('shake');
    void card.offsetWidth; // restart the animation
    card.classList.add('shake');
}

function showLoginScreen(noticeKey) {
    document.getElementById('login-form').reset();
    loginNoticeKey = noticeKey || '';
    setLoginError('');
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('login-email').focus();
}

function hideLoginScreen() {
    document.getElementById('login-screen').classList.remove('active');
}

function renderDemoAccounts() {
    document.getElementById('demo-accounts-list').innerHTML = MOCK_USERS.map(u => `
        <button type="button" class="demo-account" data-email="${u.email}">
            <span class="avatar">${u.initials}</span>
            <span class="demo-account-info">
                <span class="demo-account-email">${u.email}</span>
                <span class="demo-account-meta">${t(`role.${u.role}`)} • ${t('login.password')}: <code>${u.password}</code></span>
            </span>
        </button>
    `).join('');
}

document.getElementById('demo-accounts-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.demo-account');
    if (!btn) return;
    const user = MOCK_USERS.find(u => u.email === btn.dataset.email);
    document.getElementById('login-email').value = user.email;
    document.getElementById('login-password').value = user.password;
    setLoginError('');
    document.getElementById('login-submit').focus();
});

document.getElementById('login-password-toggle').addEventListener('click', function () {
    const input = document.getElementById('login-password');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    this.classList.toggle('active', show);
    this.dataset.i18nAria = show ? 'login.hidePassword' : 'login.showPassword';
    this.setAttribute('aria-label', t(this.dataset.i18nAria));
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const passwordInput = document.getElementById('login-password');
    const remember = document.getElementById('login-remember').checked;

    if (!email || !passwordInput.value) {
        setLoginError('login.errEmpty');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setLoginError('login.errEmail');
        return;
    }

    const submitBtn = document.getElementById('login-submit');
    submitBtn.disabled = true;
    submitBtn.innerText = t('login.signingIn');

    // Short delay to mimic a server round-trip
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = t('login.submit');

        if (!Auth.login(email, passwordInput.value, remember)) {
            setLoginError('login.errWrong');
            passwordInput.value = '';
            passwordInput.focus();
            return;
        }

        loginNoticeKey = '';
        renderLoginMessages();
        hideLoginScreen();
        applyUserToUI();
        navTo('dashboard');
    }, 500);
});

PubSub.on('language_changed', () => {
    renderDemoAccounts();
    renderLoginMessages();
    applyUserToUI();
});

// Boot: show the login screen right away if there is no saved session
renderDemoAccounts();
Auth.init();
if (Auth.user) applyUserToUI();
else showLoginScreen();
