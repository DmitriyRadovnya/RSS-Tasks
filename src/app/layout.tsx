import './global.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pokemons',
  description: 'Web application for viewing pokemon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <div className="app-wrapper">
            <header className="header">
              <Link href={'/pokemons/1'} className="header-link">
                Home
              </Link>
              <Link href={'/about'} className="header-link">
                About
              </Link>
            </header>
            {children}
            <footer className="footer">
              <p className="footer-text">RSSchool React</p>
            </footer>
            {/* <CardFavorite /> */}
          </div>
        </div>
      </body>
    </html>
  );
}
