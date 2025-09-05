export const currentPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length === 0) return '';
  if (password.length >= 8) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  if (strength <= 2) return 'easy-pass';
  if (strength <= 4) return 'medium-pass';
  if (strength > 4) return 'hard-pass';
  return '';
};
