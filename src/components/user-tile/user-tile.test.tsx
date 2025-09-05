import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getImageSrc } from './user-tile.lib';
import { UserTile } from './user-tile';
import type { IFormData } from '../../interfaces/interfaces';

beforeEach(() => {
  cleanup();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('getImageSrc utility', () => {
  it('returns PNG data URL when decoded base64 starts with PNG signature', () => {
    const base64 = 'iVBORw0KGgo';
    const result = getImageSrc(base64);
    expect(result).toBe(`data:image/png;base64,${base64}`);
  });

  it('returns JPEG data URL when decoded base64 starts with JPEG signature', () => {
    const base64 = '/9j/';
    const result = getImageSrc(base64);
    expect(result).toBe(`data:image/jpeg;base64,${base64}`);
  });

  it('returns empty string for invalid base64 (atob throws)', () => {
    const bad = '!!!not_base64!!!';
    const result = getImageSrc(bad);
    expect(result).toBe('');
  });

  it('returns empty string when decoded content has unknown signature', () => {
    const base64 = 'YWNtZQ==';
    const result = getImageSrc(base64);
    expect(result).toBe('');
  });
});

describe('UserTile component', () => {
  const baseData: IFormData = {
    name: 'User',
    age: 28,
    email: 'user@gmail.com',
    country: 'Wonderland',
    gender: 'Female',
    password: '123',
    confirmPassword: '123',
    terms: true,
    avatar: '',
  };

  it('renders all textual fields', () => {
    render(<UserTile data={baseData} />);

    expect(screen.getByText(/Name:/i)).toHaveTextContent(
      `Name: ${baseData.name}`
    );
    expect(screen.getByText(/Age:/i)).toHaveTextContent(`Age: ${baseData.age}`);
    expect(screen.getByText(/Email:/i)).toHaveTextContent(
      `Email: ${baseData.email}`
    );
    expect(screen.getByText(/Gender:/i)).toHaveTextContent(
      `Gender: ${baseData.gender}`
    );
    expect(screen.getByText(/Country:/i)).toHaveTextContent(
      `Country: ${baseData.country}`
    );

    expect(screen.queryByRole('img')).toBeNull();
  });
});
