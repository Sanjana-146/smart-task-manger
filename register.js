document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        signupForm: document.getElementById('signup-form'),
        loginForm: document.getElementById('login-form'),
        authForm: document.getElementById('authForm'),
        authFormLogin: document.getElementById('authFormLogin'),
        togglePassword: document.getElementById('toggle-password'),
        passwordField: document.getElementById('new-password'),
        confirmPasswordField: document.getElementById('confirm-password')
    };

    const validateEmail = email => /\S+@\S+\.\S+/.test(email);
    const validatePhone = phone => /^\d{10}$/.test(phone);
    const validatePassword = password => password.length >= 8;

    const showError = (elementId, message) => {
        document.getElementById(elementId).textContent = message;
    };

    const addRealTimeValidation = (inputId, validationFunc, errorId, errorMessage) => {
        document.getElementById(inputId).addEventListener('input', function () {
            showError(errorId, validationFunc(this.value) ? '' : errorMessage);
        });
    };

    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('click', function () {
            elements.passwordField.type = elements.passwordField.type === 'password' ? 'text' : 'password';
            this.textContent = elements.passwordField.type === 'text' ? '👁‍🗨' : '👁';
        });
    }

    if (elements.authForm) {
        elements.authForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('signup-email').value,
                phone: document.getElementById('phone').value,
                password: elements.passwordField.value,
                confirmPassword: elements.confirmPasswordField.value
            };

            if (userData.confirmPassword !== userData.password) {
                showError('confirm-password-error', 'Passwords do not match.');
                return;
            }

            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            response.ok ? (alert('Signup successful'), window.location.href = 'sidebar.html') : alert(data.message);
        });
    }

    if (elements.authFormLogin) {
        elements.authFormLogin.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            response.ok ? (alert('Login successful'), window.location.href = 'Sidebar.html') : alert(data.message);
        });
    }
});
