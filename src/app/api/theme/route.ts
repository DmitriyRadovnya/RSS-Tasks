import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { theme } = await request.json();
  if (theme !== 'light' && theme !== 'dark') {
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('theme', theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
