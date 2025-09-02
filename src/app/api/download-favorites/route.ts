import { NextResponse } from 'next/server';
import { PokemonDetails } from '../../../interfaces/interfaces';

export async function POST(request: Request) {
  try {
    const favorites: PokemonDetails[] = await request.json();

    const csvRows = favorites.map(
      ({ name, base_experience, stats, abilities }) => {
        const statsString = JSON.stringify(
          stats.map(({ stat: { name }, base_stat }) => ({
            name,
            base_stat,
          }))
        );
        const abilitiesString = JSON.stringify(
          abilities.map(({ ability: { name } }) => name)
        );
        return `"${name}",${base_experience || ''},"${statsString}","${abilitiesString}"`;
      }
    );

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
