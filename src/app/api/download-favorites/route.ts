import { NextResponse } from 'next/server';
import { PokemonDetails } from '../../../interfaces/interfaces';

export async function POST(request: Request) {
  try {
    const favorites: PokemonDetails[] = await request.json();

    const csvRows = favorites.map((pokemon) => {
      const statsString = JSON.stringify(
        pokemon.stats.map((stat) => ({
          name: stat.stat.name,
          base_stat: stat.base_stat,
        }))
      );
      const abilitiesString = JSON.stringify(
        pokemon.abilities.map((ability) => ability.ability.name)
      );
      return `"${pokemon.name}",${pokemon.base_experience || ''},"${statsString}","${abilitiesString}"`;
    });

    const csvData = ['name,baseExp,stats,abilities', ...csvRows].join('\n');

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="${favorites.length}_items.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
