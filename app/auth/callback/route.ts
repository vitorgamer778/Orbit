import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const origin = url.origin;

  if (!code) return NextResponse.redirect(`${origin}/?auth=missing-code`);

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/?auth=not-configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(
    `${origin}/?auth=${error ? 'failed' : 'success'}`,
  );
}
