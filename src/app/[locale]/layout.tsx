import './global.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { FavoritesProvider } from '../context/FavoritesContext';
import { CardFavorite } from '../../components/main/card-favorite/card-favorite';
import { Link } from '../../i18n/routing';
import { LocaleSwitcher } from '../../components/locale-switcher/locale-switcher';

export const metadata: Metadata = {
  title: 'Pokemons',
  description: 'Web application for viewing pokemon',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <div id="root">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <FavoritesProvider>
              <div className="app-wrapper">
                <header className="header">
                  <Link href={'/pokemons/1'} className="header-link">
                    {messages.Home}
                  </Link>
                  <Link href={'/about'} className="header-link">
                    {messages.About}
                  </Link>
                  <LocaleSwitcher />
                </header>
                {children}
                <footer className="footer">
                  <p className="footer-text">{messages.Footer}</p>
                </footer>
                <CardFavorite />
              </div>
            </FavoritesProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
