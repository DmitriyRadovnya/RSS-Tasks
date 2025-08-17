import type { FC } from 'react';
import './about-page.css';

const AboutPage: FC = () => {
  return (
    <div className="about">
      <h2 className="about-title">
        Hello to all students of the React 2025 Q3 course
      </h2>
      <div className="about-photo"></div>
      <p className="about-text">
        My name is Dima and here is my GitHub -
        <a
          className="about-me"
          href="https://github.com/DmitriyRadovnya"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          DmitriyRadovnya
        </a>
      </p>
      <a
        className="about-rss"
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
      >
        RSS React Course
      </a>
    </div>
  );
};

export default AboutPage;
