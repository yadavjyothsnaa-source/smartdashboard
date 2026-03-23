'use server';

import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const userId = formData.get('user_id') as string;
  const password = formData.get('password') as string;

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId) as { id: number; name: string; user_id: string; password: string; role: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { error: 'Invalid User ID or password.' };
  }

  const cookieStore = await cookies();
  cookieStore.set('session_user_id', String(user.id), { httpOnly: true, path: '/' });
  cookieStore.set('session_role', user.role, { httpOnly: true, path: '/' });
  cookieStore.set('session_name', user.name, { httpOnly: true, path: '/' });

  redirect(`/dashboard`);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_user_id');
  cookieStore.delete('session_role');
  cookieStore.delete('session_name');
  redirect('/');
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  const role = cookieStore.get('session_role')?.value;
  const name = cookieStore.get('session_name')?.value;
  if (!userId || !role) return null;
  return { userId: parseInt(userId), role, name: name || 'User' };
}
