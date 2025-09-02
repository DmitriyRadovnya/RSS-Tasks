export const getThemeToggleIcon = (theme: string) => {
  if (theme === 'light') {
    return '🌙';
  }

  if (theme === 'dark') {
    return '☀️';
  }
};
