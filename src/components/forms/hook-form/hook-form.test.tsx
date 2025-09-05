import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDispatch } from 'react-redux';
import { HookForm } from './hook-form';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

vi.mock('./uncontrolled-country-select/uncontrolled-country-select', () => ({
  CountrySelectWithoutHook: ({
    value,
    onChange,
    errors,
  }: {
    value: string;
    onChange: (value: string) => void;
    errors: Record<string, string>;
  }) => (
    <div>
      <label htmlFor="country">Country:</label>
      <input
        id="country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="country-input"
      />
      {errors.country && <p className="error">{errors.country}</p>}
    </div>
  ),
}));

describe('HookForm', () => {
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);
    render(
      <Provider store={store}>
        <HookForm onClose={mockOnClose} />
      </Provider>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('gender-select')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-input')).toBeInTheDocument();
    expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('displays validation errors on submit with invalid data', async () => {
    fireEvent.submit(screen.getByTestId('submit-button'));

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('displays and clears error messages', async () => {
    fireEvent.submit(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(
        screen.getByText(/Name must start with an uppercase letter/i)
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John' },
    });
    fireEvent.submit(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(
        screen.queryByText(/Name must start with an uppercase letter/i)
      ).not.toBeInTheDocument();
    });
  });
});
