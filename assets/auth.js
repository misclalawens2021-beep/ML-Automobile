// ==========================================================================
// ML AUTOMOBILE — authentification (démo front-end)
//
// Cette version valide les formulaires côté client et simule la création
// de compte / connexion avec localStorage, à titre de démonstration.
//
// Pour brancher un vrai back-end (comme sur StadiumCompany / ML Automobile
// en PHP + MySQL), remplacer les fonctions handleLogin() et handleSignup()
// par un fetch() vers vos scripts PHP, par exemple :
//
//   fetch('api/login.php', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password })
//   })
//   .then(r => r.json())
//   .then(data => { ... })
//
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLoginForm();
  initSignupForm();
  initSwitchLink();
});

/* -------------------------------------------------------------------- */
/* Bascule des onglets Connexion / Inscription                          */
/* -------------------------------------------------------------------- */

function initTabs() {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const switchText = document.getElementById('auth-switch-text');

  function showLogin() {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    switchText.innerHTML = `Pas encore de compte ? <button type="button" id="switch-to-signup">Inscrivez-vous</button>`;
    initSwitchLink();
  }

  function showSignup() {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    switchText.innerHTML = `Déjà un compte ? <button type="button" id="switch-to-login">Connectez-vous</button>`;
    initSwitchLink();
  }

  tabLogin.addEventListener('click', showLogin);
  tabSignup.addEventListener('click', showSignup);

  window._mlShowLogin = showLogin;
  window._mlShowSignup = showSignup;
}

function initSwitchLink() {
  const toSignup = document.getElementById('switch-to-signup');
  const toLogin = document.getElementById('switch-to-login');
  if (toSignup) toSignup.addEventListener('click', () => window._mlShowSignup());
  if (toLogin) toLogin.addEventListener('click', () => window._mlShowLogin());
}

/* -------------------------------------------------------------------- */
/* Validation générique                                                  */
/* -------------------------------------------------------------------- */

function setFieldValid(fieldId, isValid) {
  const field = document.getElementById(fieldId);
  field.classList.toggle('invalid', !isValid);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showFeedback(el, message, type) {
  el.textContent = message;
  el.className = `form-feedback ${type}`;
}

/* -------------------------------------------------------------------- */
/* Formulaire de connexion                                               */
/* -------------------------------------------------------------------- */

function initLoginForm() {
  const form = document.getElementById('login-form');
  const feedback = document.getElementById('login-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const emailOk = isValidEmail(email);
    const passwordOk = password.length >= 8;

    setFieldValid('login-email-field', emailOk);
    setFieldValid('login-password-field', passwordOk);

    if (!emailOk || !passwordOk) {
      showFeedback(feedback, 'Merci de corriger les champs indiqués ci-dessus.', 'error');
      return;
    }

    handleLogin(email, password, feedback);
  });
}

function handleLogin(email, password, feedback) {
  // Démo : vérifie un compte précédemment enregistré dans localStorage.
  const accounts = JSON.parse(localStorage.getItem('mlAutomobileAccounts') || '[]');
  const account = accounts.find(a => a.email === email);

  if (!account) {
    showFeedback(feedback, "Aucun compte trouvé avec cette adresse e-mail.", 'error');
    return;
  }
  if (account.password !== password) {
    showFeedback(feedback, 'Mot de passe incorrect.', 'error');
    return;
  }

  showFeedback(feedback, `Connexion réussie. Bienvenue, ${account.name || email} !`, 'success');
  // Redirection possible après connexion réelle :
  // window.location.href = 'index.html';
}

/* -------------------------------------------------------------------- */
/* Formulaire d'inscription                                              */
/* -------------------------------------------------------------------- */

function initSignupForm() {
  const form = document.getElementById('signup-form');
  const feedback = document.getElementById('signup-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    const nameOk = name.length > 1;
    const emailOk = isValidEmail(email);
    const passwordOk = password.length >= 8;
    const confirmOk = confirm === password && passwordOk;

    setFieldValid('signup-name-field', nameOk);
    setFieldValid('signup-email-field', emailOk);
    setFieldValid('signup-password-field', passwordOk);
    setFieldValid('signup-confirm-field', confirmOk);

    if (!nameOk || !emailOk || !passwordOk || !confirmOk) {
      showFeedback(feedback, 'Merci de corriger les champs indiqués ci-dessus.', 'error');
      return;
    }

    handleSignup(name, email, password, feedback);
  });
}

function handleSignup(name, email, password, feedback) {
  const accounts = JSON.parse(localStorage.getItem('mlAutomobileAccounts') || '[]');

  if (accounts.some(a => a.email === email)) {
    showFeedback(feedback, 'Un compte existe déjà avec cette adresse e-mail.', 'error');
    return;
  }

  accounts.push({ name, email, password });
  localStorage.setItem('mlAutomobileAccounts', JSON.stringify(accounts));

  showFeedback(feedback, 'Compte créé avec succès. Vous pouvez maintenant vous connecter.', 'success');

  setTimeout(() => {
    window._mlShowLogin();
    document.getElementById('login-email').value = email;
  }, 1200);
}
