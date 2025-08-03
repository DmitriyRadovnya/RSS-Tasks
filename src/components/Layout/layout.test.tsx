import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout';

describe('Layout', () => {
  it('renders header, outlet, and footer', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('header');

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveClass('header-link');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).toHaveClass('header-link');

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('RSSchool React');
  });

  it('renders child routes via Outlet', () => {
    const ChildComponent = () => <div>Child Route</div>;

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/test" element={<ChildComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Child Route')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('RSSchool React')).toBeInTheDocument();
  });
});
