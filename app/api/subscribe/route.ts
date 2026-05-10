import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestLog.get(ip) || [];
  const validRequests = requests.filter(time => now - time < WINDOW_MS);
  if (validRequests.length >= RATE_LIMIT) return false;
  validRequests.push(now);
  requestLog.set(ip, validRequests);
  return true;
}

function hashEmail(email: string): string {
  const secret = process.env.EMAIL_HASH_SECRET || 'default-secret';
  return crypto.createHmac('sha256', secret).update(email.toLowerCase().trim()).digest('hex');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    const hashedEmail = hashEmail(email);

    const { data: existingEmail, error: checkError } = await supabase
      .from('waitlist_emails')
      .select('id')
      .eq('email_hash', hashedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Supabase error:', checkError);
      return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
    }

    if (existingEmail) {
      return NextResponse.json({ error: 'This email is already on the waitlist!' }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('waitlist_emails')
      .insert([{ email_hash: hashedEmail, created_at: new Date().toISOString() }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Successfully subscribed to waitlist!' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}