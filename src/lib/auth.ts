'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const OTP_CODE = process.env.OTP_CODE;

export async function verifyOTP(code: string) {
  if (code === OTP_CODE) {
    const token = 'verified';
    cookies().set('session', token, {
      httpOnly: true,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid OTP' };
}

export async function requireAuth() {
  const session = cookies().get('session');

  if (!session || session.value !== 'verified') {
    redirect('/auth');
  }

  return {
    name: 'Admin User',
    email: 'admin@example.com',
  };
}

export async function logout() {
  cookies().delete('session');
  redirect('/auth');
}
