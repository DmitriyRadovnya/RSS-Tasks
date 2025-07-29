import './card.css';
import type { CardProps } from '../../../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';

// export default function Card(props: CardProps) {
//   const navigate = useNavigate();
//   const {
//     currentPage,
//     allPokemons: { name },
//   } = props;

//   const showDetails = () => {
//     const formattedName = name.toLowerCase().trim();
//     navigate(`/${currentPage}/${formattedName}`);
//   };

//   return (
//     <div className="card-style" onClick={showDetails}>
//       <h2 className="card-name">{name}</h2>
//     </div>
//   );
// }
export default function Card(props: CardProps) {
  const navigate = useNavigate();
  const {
    currentPage,
    allPokemons: { name },
  } = props;

  const showDetails = () => {
    const formattedName = name.toLowerCase().trim();
    navigate(`/${currentPage}/${formattedName}`);
  };

  return (
    <div className="card-style" onClick={showDetails}>
      <h2 className="card-name">{name}</h2>
    </div>
  );
}
