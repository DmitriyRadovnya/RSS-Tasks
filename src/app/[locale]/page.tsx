import { redirect } from '../../i18n/routing';

export default function Page() {
  redirect({
    href: '/pokemons/1',
    locale: 'en',
  });
}
