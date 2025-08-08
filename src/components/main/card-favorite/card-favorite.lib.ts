import type { IFavoriteCard } from '../card-list/card/card.types';

export const downloadFavoritesInCSV = (data: IFavoriteCard[]) => {
  const csvRows = data.map((pokemon) => {
    const statsString = JSON.stringify(
      pokemon.stats.map((stat) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
      }))
    );
    const abilitiesString = JSON.stringify(
      pokemon.abilities.map((ability) => ability.ability.name)
    );
    return `"${pokemon.name}",${pokemon.baseExp},"${statsString}","${abilitiesString}"`;
  });

  const csvData = ['name,baseExp,stats,abilities', ...csvRows].join('\n');
  const filename = `${data.length}_items.csv`;

  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
