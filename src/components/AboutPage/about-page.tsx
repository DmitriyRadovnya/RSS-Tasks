import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div>
      <Link to={'/'}>Go Home</Link>
      <h2>Hello to all students of the React 2025 Q3 course</h2>
      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
      >
        RSS React Course
      </a>
    </div>
  );
}
