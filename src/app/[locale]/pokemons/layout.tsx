import '../../../components/main/main.css';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PokemonsLayout: FC<Props> = async ({ children }) => {
  return (
    <main className="main-container" data-testid="main-container">
      {children}
    </main>
  );
};

export default PokemonsLayout;
