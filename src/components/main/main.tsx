import CardList from './card-list/card-list';
import type { MainProps } from '../../interfaces/interfaces';

export default function Main(props: MainProps) {
  const { details } = props;
  return (
    <main>
      <CardList details={details}></CardList>
    </main>
  );
}
