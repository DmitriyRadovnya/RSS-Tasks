import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { CountrySelectWithoutHook } from './uncontrolled-country-select';
import { filterCountries } from '../../../../store/countries-slice';
import countriesReducer from '../../../../store/countries-slice';
import type { SingleValue } from 'react-select';

interface IOptionType {
  value: string;
  label: string;
}

interface SelectProps {
  inputId: string;
  name: string;
  options: IOptionType[];
  value: IOptionType | null;
  onChange: (option: SingleValue<IOptionType>) => void;
  onInputChange: (inputValue: string) => string;
  placeholder: string;
  isClearable: boolean;
  isSearchable: boolean;
}

vi.mock('react-select', () => ({
  default: ({
    inputId,
    name,
    options,
    value,
    onChange,
    onInputChange,
    placeholder,
    isClearable,
    isSearchable,
  }: SelectProps) => (
    <div>
      <input
        id={inputId}
        name={name}
        data-testid="country-select"
        value={value ? value.label : ''}
        onChange={(e) => {
          const selectedOption = options.find(
            (opt) => opt.label === e.target.value
          );
          onChange(selectedOption || null);
        }}
        onInput={(e) => onInputChange(e.currentTarget.value)}
        placeholder={placeholder}
        data-is-clearable={isClearable}
        data-is-searchable={isSearchable}
      />
    </div>
  ),
}));

describe('CountrySelectWithoutHook', () => {
  const mockOnChange = vi.fn();
  const initialCountries: IOptionType[] = [
    { value: 'usa', label: 'USA' },
    { value: 'canada', label: 'Canada' },
    { value: 'uk', label: 'UK' },
  ];

  const store = configureStore({
    reducer: {
      countries: countriesReducer,
    },
    preloadedState: {
      countries: {
        allCountries: initialCountries,
        filteredCountries: initialCountries,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders country select with label', () => {
    render(
      <Provider store={store}>
        <CountrySelectWithoutHook
          value=""
          onChange={mockOnChange}
          errors={{}}
        />
      </Provider>
    );

    expect(screen.getByLabelText(/Country:/i)).toBeInTheDocument();
    expect(screen.getByTestId('country-select')).toBeInTheDocument();
    expect(screen.getByTestId('country-select')).toHaveAttribute(
      'placeholder',
      'Select country'
    );
  });

  it('displays error message when errors.country is provided', () => {
    render(
      <Provider store={store}>
        <CountrySelectWithoutHook
          value=""
          onChange={mockOnChange}
          errors={{ country: 'Country is required' }}
        />
      </Provider>
    );

    expect(screen.getByText(/Country is required/i)).toBeInTheDocument();
  });

  it('calls onChange with selected country value', () => {
    render(
      <Provider store={store}>
        <CountrySelectWithoutHook
          value=""
          onChange={mockOnChange}
          errors={{}}
        />
      </Provider>
    );

    const selectInput = screen.getByTestId('country-select');
    fireEvent.change(selectInput, { target: { value: 'USA' } });

    expect(mockOnChange).toHaveBeenCalledWith('usa');
  });

  it('dispatches filterCountries on input change', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CountrySelectWithoutHook
          value=""
          onChange={mockOnChange}
          errors={{}}
        />
      </Provider>
    );

    const selectInput = screen.getByTestId('country-select');
    fireEvent.input(selectInput, { target: { value: 'can' } });

    expect(dispatchSpy).toHaveBeenCalledWith(filterCountries('can'));
  });
});
