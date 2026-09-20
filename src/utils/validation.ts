export const PHONE_PATTERN = /^[6-9]\d{9}$/;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 6;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateFullName(fullName: string): string | null {
  return fullName.trim().length < 2 ? 'Please enter your full name.' : null;
}

export function validatePhone(phone: string): string | null {
  return PHONE_PATTERN.test(phone.trim()) ? null : 'Enter a valid 10-digit Indian mobile number.';
}

export function validateAddress(address: string): string | null {
  return address.trim().length < 10 ? 'Please enter a complete delivery address.' : null;
}

export function validateEmail(email: string): string | null {
  return EMAIL_PATTERN.test(email.trim()) ? null : 'Enter a valid email address.';
}

export function validatePassword(password: string): string | null {
  return password.length < MIN_PASSWORD_LENGTH
    ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    : null;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  return password === confirmation ? null : 'Passwords do not match.';
}
