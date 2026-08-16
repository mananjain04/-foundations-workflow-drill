import { validateForm } from './validator.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusRegion = document.getElementById('statusRegion');
    const bioInput = document.getElementById('bio');
    const bioCharCount = document.getElementById('bioCharCount');

    const fields = ['username', 'email', 'password', 'bio'];

    // Bio character counter
    if (bioInput && bioCharCount) {
        bioInput.addEventListener('input', () => {
            bioCharCount.textContent = bioInput.value.length;
        });
    }

    // Clear individual field errors on user input (touch)
    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}Error`);
        if (input) {
            input.addEventListener('input', () => {
                input.removeAttribute('aria-invalid');
                if (errorSpan) errorSpan.textContent = '';
            });
        }
    });

    // Reset button handler
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            if (bioCharCount) bioCharCount.textContent = '0';
            statusRegion.className = 'status-region';
            statusRegion.textContent = '';
            fields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                const errorSpan = document.getElementById(`${fieldId}Error`);
                if (input) input.removeAttribute('aria-invalid');
                if (errorSpan) errorSpan.textContent = '';
            });
        });
    }

    // Form submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous status
        statusRegion.className = 'status-region';
        statusRegion.textContent = '';

        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            bio: document.getElementById('bio').value
        };

        const { isValid, errors, cleanData } = validateForm(formData);

        // Update UI with validation results
        let firstInvalidField = null;

        fields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            const errorSpan = document.getElementById(`${fieldId}Error`);
            
            if (errors[fieldId]) {
                input.setAttribute('aria-invalid', 'true');
                if (errorSpan) errorSpan.textContent = errors[fieldId];
                if (!firstInvalidField) firstInvalidField = input;
            } else {
                input.removeAttribute('aria-invalid');
                if (errorSpan) errorSpan.textContent = '';
            }
        });

        if (!isValid) {
            // Focus management: focus first invalid field for keyboard & screen reader users
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            return;
        }

        // Async submit simulation
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay

            statusRegion.textContent = `Settings saved successfully for ${cleanData.username}!`;
            statusRegion.className = 'status-region success';

            // Optional: reset password field after save
            document.getElementById('password').value = '';
        } catch (err) {
            statusRegion.textContent = 'An error occurred while saving settings. Please try again.';
            statusRegion.className = 'status-region error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Settings';
        }
    });
});
