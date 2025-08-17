'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import './locale-switcher.css';
import { Link } from '../../i18n/routing';

export const LocaleSwitcher = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cleanPathname = pathname
    ? pathname.replace(/^\/(en|ru)/, '') || '/'
    : '/';

  const queryString = searchParams ? searchParams.toString() : '';

  return (
    <div className="locale-switcher">
      <Link
        href={{ pathname: cleanPathname, query: queryString }}
        locale="en"
        className="locale-link"
      >
        EN
      </Link>
      <Link
        href={{ pathname: cleanPathname, query: queryString }}
        locale="ru"
        className="locale-link"
      >
        RU
      </Link>
    </div>
  );
};
