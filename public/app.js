// Round 1: Generated from vague prompt "Build a user settings form with validation"
document.getElementById('settingsForm').addEventListener('submit', function() {
    let isValid = true;
    
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    document.getElementById('usernameError').innerText = '';
    document.getElementById('emailError').innerText = '';
    document.getElementById('passwordError').innerText = '';

    // Vague validation rules
    if (!username) {
        document.getElementById('usernameError').innerText = 'Username is required';
        isValid = false;
    }

    if (!email || !email.includes('@')) {
        document.getElementById('emailError').innerText = 'Invalid email';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').innerText = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (isValid) {
        alert('Settings saved successfully!');
    }
});
