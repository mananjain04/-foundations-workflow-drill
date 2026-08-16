import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateBio,
    validateForm
} from '../src/validator.js';

describe('Username Validation', () => {
    test('rejects empty or whitespace-only username', () => {
        assert.strictEqual(validateUsername('').valid, false);
        assert.strictEqual(validateUsername('   ').valid, false);
    });

    test('rejects username outside 3-20 length range', () => {
        assert.strictEqual(validateUsername('ab').valid, false);
        assert.strictEqual(validateUsername('a'.repeat(21)).valid, false);
    });

    test('rejects special characters in username', () => {
        assert.strictEqual(validateUsername('user@name').valid, false);
        assert.strictEqual(validateUsername('user-name').valid, false);
    });

    test('accepts valid usernames and trims whitespace', () => {
        const res = validateUsername('  john_doe99  ');
        assert.strictEqual(res.valid, true);
        assert.strictEqual(res.value, 'john_doe99');
    });
});

describe('Email Validation', () => {
    test('rejects invalid email formats', () => {
        assert.strictEqual(validateEmail('plainaddress').valid, false);
        assert.strictEqual(validateEmail('#@%^%#$@#$@#.com').valid, false);
        assert.strictEqual(validateEmail('@example.com').valid, false);
        assert.strictEqual(validateEmail('Joe Smith <email@example.com>').valid, false);
        assert.strictEqual(validateEmail('email.example.com').valid, false);
        assert.strictEqual(validateEmail('email@example@example.com').valid, false);
    });

    test('accepts valid RFC 5322 standard emails', () => {
        assert.strictEqual(validateEmail('user@example.com').valid, true);
        assert.strictEqual(validateEmail('user.name+tag@sub.domain.co.uk').valid, true);
    });
});

describe('Password Validation', () => {
    test('rejects passwords under 8 characters', () => {
        assert.strictEqual(validatePassword('P@ss1').valid, false);
    });

    test('rejects passwords missing uppercase, number, or special char', () => {
        assert.strictEqual(validatePassword('lowercase1!').valid, false); // no upper
        assert.strictEqual(validatePassword('UPPERCASE1!').valid, false); // no lower is okay by rule, but let's check uppercase
        assert.strictEqual(validatePassword('NoNumber!').valid, false);  // no number
        assert.strictEqual(validatePassword('NoSpecial1').valid, false); // no special
    });

    test('accepts strong passwords', () => {
        assert.strictEqual(validatePassword('SecurePass123!').valid, true);
    });
});

describe('Form Integration Validation', () => {
    test('returns aggregate isValid true for valid payload', () => {
        const payload = {
            username: 'alice_w',
            email: 'alice@example.com',
            password: 'StrongPassword1$',
            bio: 'Software engineer and designer.'
        };
        const result = validateForm(payload);
        assert.strictEqual(result.isValid, true);
        assert.deepStrictEqual(result.errors, {});
    });

    test('returns all validation errors for invalid payload', () => {
        const payload = {
            username: 'a',
            email: 'bad-email',
            password: '123',
            bio: 'x'.repeat(250)
        };
        const result = validateForm(payload);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.username);
        assert.ok(result.errors.email);
        assert.ok(result.errors.password);
        assert.ok(result.errors.bio);
    });
});
