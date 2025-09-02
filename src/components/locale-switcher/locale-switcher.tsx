'use client';

import './locale-switcher.css';
import { Link } from '../../i18n/routing';
import { APP_LOCALES } from '../../constants/constants';
import { usePathname, useSearchParams } from 'next/navigation';

export const LocaleSwitcher = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cleanPathname = pathname
    ? pathname.replace(/^\/(en|ru)/, '') || '/'
    : '/';

  const queryString = searchParams ? searchParams.toString() : '';

  return (
    <div className="locale-switcher">
      {APP_LOCALES.map((locale) => {
        return (
          <Link
            key={locale}
            href={{ pathname: cleanPathname, query: queryString }}
            locale={locale.toLowerCase()}
            className="locale-link"
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
};
