import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchForm from './search-form';

describe('SearchForm', () => {
  const setAppState = vi.fn();
  const setAppLoading = vi.fn();
  const setAppError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // it('fetches initial data and renders correctly', async () => {
  //   render(
  //     <SearchForm
  //       setAppState={setAppState}
  //       setAppLoading={setAppLoading}
  //       setAppError={setAppError}
  //     />
  //   );
  //   await waitFor(() => expect(setAppLoading).toHaveBeenCalledWith(true));

  //   await waitFor(() => {
  //     expect(setAppState).toHaveBeenCalled();
  //   });

  //   const input = screen.getByPlaceholderText(
  //     'Unfortunately PokeApi only provides search by full name of Pokemon'
  //   ) as HTMLInputElement;
  //   expect(input).toBeInTheDocument();

  //   const button = screen.getByRole('button');
  //   expect(button).toBeInTheDocument();
  // });

  it('handles user input', async () => {
    render(
      <SearchForm
        setAppState={setAppState}
        setAppLoading={setAppLoading}
        setAppError={setAppError}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  it('saves pokemon name to localStorage on button click', async () => {
    render(
      <SearchForm
        setAppState={setAppState}
        setAppLoading={setAppLoading}
        setAppError={setAppError}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'bulbasaur' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('pokemon')).toBe('bulbasaur');
    });
  });
});
