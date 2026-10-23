export function validatePakistaniPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, normalized: '', error: 'Phone number is required for courier delivery.' };
  }

  // Remove spaces, dashes, parentheses
  const clean = phone.replace(/[\s\-\(\)]/g, '');

  // Valid patterns: 03XXXXXXXXX (11 digits) or +923XXXXXXXXX / 923XXXXXXXXX
  const regex = /^(?:\+92|92|0)?(3\d{9})$/;
  const match = clean.match(regex);

  if (!match) {
    return {
      isValid: false,
      normalized: clean,
      error: 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567 or +92 300 1234567).',
    };
  }

  // Standardize to 03XXXXXXXXX for display / local courier
  const normalized = `0${match[1]}`;
  return { isValid: true, normalized };
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validatePostalCode(code: string): boolean {
  if (!code) return false;
  // Pakistan postal codes are typically 5 digits e.g. 75500, 54000, 44000
  const clean = code.trim();
  return /^\d{4,6}$/.test(clean);
}
