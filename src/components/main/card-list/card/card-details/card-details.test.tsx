import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { server } from '../../../../../mocks/node';
import CardDetails from './card-details';
import { MemoryRouter } from 'react-router-dom';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CardDetails Component', () => {
  it('рендерит placeholder при начальной загрузке', () => {
    render(
      <MemoryRouter initialEntries={['/1/charmeleon']}>
        <CardDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
