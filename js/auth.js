// ==========================================
// ALJANNAT AUTHENTICATION ENGINE
// ==========================================

(function () {
  const USER_STORAGE_KEY = 'aljannat_users';
  const CURRENT_USER_KEY = 'aljannat_current_user';
  const ROLE_LABELS = {
    customer: 'Customer',
    wholesale: 'Wholesale B2B',
    admin: 'Administrator'
  };

  const defaultUsers = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@aljannat.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 'wholesale-1',
      name: 'Wholesale Partner',
      email: 'wholesale@aljannat.com',
      password: 'wholesale123',
      role: 'wholesale'
    },
    {
      id: 'customer-1',
      name: 'Customer User',
      email: 'customer@aljannat.com',
      password: 'customer123',
      role: 'customer'
    }
  ];

  function readUsers() {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUsers));
        return [...defaultUsers];
      }
      return JSON.parse(raw);
    } catch (error) {
      return [...defaultUsers];
    }
  }

  function writeUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }

  function readCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function normalizeRole(role) {
    const safeRole = String(role || 'customer').trim().toLowerCase();
    return ROLE_LABELS[safeRole] ? safeRole : 'customer';
  }

  function publicUserFromRecord(user) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizeRole(user.role)
    };
  }

  function writeCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUserFromRecord(user)));
  }

  function createUser(name, email, password, role = 'customer') {
    const users = readUsers();
    const existing = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const safeRole = normalizeRole(role);
    const user = {
      id: `user-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      name,
      email,
      password,
      role: safeRole
    };
    users.push(user);
    writeUsers(users);
    writeCurrentUser(publicUserFromRecord(user));
    return { success: true, data: publicUserFromRecord(user) };
  }

  function loginUser(email, password) {
    const users = readUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    const publicUser = publicUserFromRecord(user);
    writeCurrentUser(publicUser);
    return { success: true, data: publicUser };
  }

  function logoutUser() {
    writeCurrentUser(null);
    return { success: true };
  }

  function sanitizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function createAuthModal() {
    const existing = document.getElementById('aljannat-auth-modal');
    if (existing) return existing;

    const modal = document.createElement('div');
    modal.id = 'aljannat-auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-modal-backdrop" data-close-auth></div>
      <div class="auth-modal-card">
        <button class="auth-close" data-close-auth aria-label="Close auth">×</button>
        <div class="auth-tabs">
          <button class="auth-tab active" data-auth-tab="login">Sign In</button>
          <button class="auth-tab" data-auth-tab="register">Register</button>
        </div>

        <div class="auth-panel" data-auth-panel="login">
          <h2 style="font-size: 1.5rem; text-align: center; margin-bottom: 0.5rem;">Welcome to ALJANNAT</h2>
          <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">Access your saved pieces and private couture services.</p>
          <div class="auth-form">
            <label class="auth-label">
              <span>Email Address</span>
              <input type="email" id="login-email" placeholder="client@aljannat.com" required />
            </label>
            <label class="auth-label">
              <span>Password</span>
              <input type="password" id="login-password" placeholder="••••••••" required />
            </label>
            <div class="auth-row">
              <button class="btn btn-primary btn-block auth-submit" data-login-submit>Sign In</button>
            </div>
            <div class="auth-message" id="auth-login-message"></div>
          </div>
        </div>

        <div class="auth-panel hidden" data-auth-panel="register">
          <h2 style="font-size: 1.5rem; text-align: center; margin-bottom: 0.5rem;">Join ALJANNAT</h2>
          <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">Create an account for personal styling & fast checkout.</p>
          <div class="auth-form">
            <label class="auth-label">
              <span>Full Name</span>
              <input type="text" id="register-name" placeholder="Your Name" required />
            </label>
            <label class="auth-label">
              <span>Email Address</span>
              <input type="email" id="register-email" placeholder="client@aljannat.com" required />
            </label>
            <label class="auth-label">
              <span>Password</span>
              <input type="password" id="register-password" placeholder="••••••••" required minlength="6" />
            </label>
            <label class="auth-label">
              <span>Account Type</span>
              <select id="register-role">
                <option value="customer">Private Customer</option>
                <option value="wholesale">Wholesale B2B Partner</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
            <div class="auth-row">
              <button class="btn btn-primary btn-block auth-submit" data-register-submit>Create Account</button>
            </div>
            <div class="auth-message" id="auth-register-message"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function updateAuthUI() {
    const currentUser = readCurrentUser();
    const navActions = document.querySelectorAll('.nav-actions');

    navActions.forEach((nav) => {
      let authWidget = nav.querySelector('[data-auth-widget]');
      if (!authWidget) {
        authWidget = document.createElement('div');
        authWidget.className = 'auth-widget';
        authWidget.setAttribute('data-auth-widget', 'true');
        nav.appendChild(authWidget);
      }

      if (currentUser) {
        const roleName = ROLE_LABELS[currentUser.role] || 'Customer';
        let extraLink = '';
        if (currentUser.role === 'admin') {
          extraLink = `<a href="admin.html" class="btn btn-secondary auth-button"><i class="fa-solid fa-gauge"></i> Admin</a>`;
        } else if (currentUser.role === 'wholesale') {
          extraLink = `<a href="wholesale.html" class="btn btn-secondary auth-button"><i class="fa-solid fa-briefcase"></i> Wholesale</a>`;
        }

        authWidget.innerHTML = `
          <div class="auth-user-info">
            <span class="auth-user">${currentUser.name}</span>
            <span class="auth-role-label">${roleName}</span>
          </div>
          <a href="orders.html" class="btn btn-secondary auth-button" title="My Orders"><i class="fa-solid fa-box"></i></a>
          ${extraLink}
          <button class="btn btn-secondary auth-button" data-auth-action="logout" title="Sign Out"><i class="fa-solid fa-right-from-bracket"></i></button>
        `;
      } else {
        authWidget.innerHTML = `
          <button class="btn btn-primary auth-button" data-auth-action="login">Sign In</button>
        `;
      }
    });

    document.querySelectorAll('[data-auth-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-auth-action');
        if (action === 'login') openAuth('login');
        if (action === 'register') openAuth('register');
        if (action === 'logout') {
          logoutUser();
          updateAuthUI();
          if (typeof showToast === 'function') showToast('Signed out successfully');
        }
      });
    });
  }

  function openAuth(mode = 'login') {
    const modal = createAuthModal();
    modal.classList.add('show');

    const tabs = Array.from(modal.querySelectorAll('[data-auth-tab]'));
    const panels = Array.from(modal.querySelectorAll('[data-auth-panel]'));
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === mode));
    panels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.authPanel !== mode));

    const loginSubmit = modal.querySelector('[data-login-submit]');
    if (loginSubmit) {
      loginSubmit.onclick = () => {
        const email = sanitizeEmail(modal.querySelector('#login-email').value);
        const password = modal.querySelector('#login-password').value.trim();
        const result = loginUser(email, password);
        const msg = modal.querySelector('#auth-login-message');
        if (!result.success) {
          msg.textContent = result.message;
          return;
        }
        msg.textContent = 'Sign in successful';
        modal.classList.remove('show');
        updateAuthUI();
        if (typeof showToast === 'function') showToast(`Welcome back, ${result.data.name}`);
      };
    }

    const registerSubmit = modal.querySelector('[data-register-submit]');
    if (registerSubmit) {
      registerSubmit.onclick = () => {
        const name = modal.querySelector('#register-name').value.trim();
        const email = sanitizeEmail(modal.querySelector('#register-email').value);
        const password = modal.querySelector('#register-password').value.trim();
        const role = modal.querySelector('#register-role').value || 'customer';
        const msg = modal.querySelector('#auth-register-message');

        if (!name || !email || password.length < 6) {
          msg.textContent = 'Please complete all fields with a valid password (6+ chars).';
          return;
        }

        const result = createUser(name, email, password, role);
        if (!result.success) {
          msg.textContent = result.message;
          return;
        }
        msg.textContent = 'Account created successfully';
        modal.classList.remove('show');
        updateAuthUI();
        if (typeof showToast === 'function') showToast(`Welcome to ALJANNAT, ${result.data.name}`);
      };
    }

    modal.querySelectorAll('[data-close-auth]').forEach((close) => {
      close.onclick = () => modal.classList.remove('show');
    });

    tabs.forEach((tab) => {
      tab.onclick = () => {
        const selected = tab.dataset.authTab;
        tabs.forEach((x) => x.classList.toggle('active', x === tab));
        panels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.authPanel !== selected));
      };
    });
  }

  function initAuth() {
    updateAuthUI();
  }

  window.AljannatAuth = {
    createUser,
    loginUser,
    logoutUser,
    readCurrentUser,
    readUsers,
    openAuth,
    initAuth
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
