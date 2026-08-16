/**
 * Validator module for User Settings Form
 */

export function validateUsername(username) {
    const trimmed = (username || '').trim();
    if (!trimmed) {
        return { valid: false, message: 'Username is required.' };
    }
    if (trimmed.length < 3 || trimmed.length > 20) {
        return { valid: false, message: 'Username must be between 3 and 20 characters.' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores.' };
    }
    return { valid: true, value: trimmed };
}

export function validateEmail(email) {
    const trimmed = (email || '').trim();
    if (!trimmed) {
        return { valid: false, message: 'Email address is required.' };
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid email address (e.g., user@example.com).' };
    }
    return { valid: true, value: trimmed };
}

export function validatePassword(password) {
    const val = password || '';
    if (!val) {
        return { valid: false, message: 'Password is required.' };
    }
    if (val.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[a-z]/.test(val)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[A-Z]/.test(val)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[0-9]/.test(val)) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
        return { valid: false, message: 'Password must contain at least one special character.' };
    }
    return { valid: true, value: val };
}

export function validateBio(bio) {
    const val = bio || '';
    if (val.length > 200) {
        return { valid: false, message: 'Bio cannot exceed 200 characters.' };
    }
    return { valid: true, value: val.trim() };
}

export function validateForm(data) {
    const usernameResult = validateUsername(data.username);
    const emailResult = validateEmail(data.email);
    const passwordResult = validatePassword(data.password);
    const bioResult = validateBio(data.bio);

    const errors = {};
    if (!usernameResult.valid) errors.username = usernameResult.message;
    if (!emailResult.valid) errors.email = emailResult.message;
    if (!passwordResult.valid) errors.password = passwordResult.message;
    if (!bioResult.valid) errors.bio = bioResult.message;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        cleanData: {
            username: usernameResult.value,
            email: emailResult.value,
            password: passwordResult.value,
            bio: bioResult.value
        }
    };
}
