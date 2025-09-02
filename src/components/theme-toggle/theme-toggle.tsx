'use client';

import './theme-toggle.css';
import { useTheme } from '../../hook/use-theme';
import { getThemeToggleIcon } from './theme-toggle.utils';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {getThemeToggleIcon(theme)}
    </button>
  );
};
