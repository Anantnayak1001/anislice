import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 });
    return true;
  }
  if (limit.count >= 3) return false;
  limit.count++;
  return true;
}

function hashEmail(email: string): string {
  return createHmac('sha256', process.env.EMAIL_HASH_SECRET!)
    .update(email)
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429 }
      );
    }

    const { email, name } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required.' },
        { status: 400 }
      );
    }

    const emailHash = hashEmail(email.toLowerCase());

    const { data: existing } = await supabase
      .from('wallpaper_subscribers')
      .select('id')
      .eq('email_hash', emailHash)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from('wallpaper_subscribers')
      .insert({
        email_hash: emailHash,
        email: email.toLowerCase(),
        name: name || null,
      });

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}