import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './about-page';

describe('AboutPage', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Hello to all students of the React 2025 Q3 course')
    ).toBeInTheDocument();

    const githubLink = screen.getByRole('link', { name: 'DmitriyRadovnya' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/DmitriyRadovnya'
    );

    const courseLink = screen.getByRole('link', { name: 'RSS React Course' });
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
  });
});
