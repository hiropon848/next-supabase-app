'use server';

import { AuthService } from '@/services/auth';
import { headers } from 'next/headers';

export async function login() {
  // TODO: Implement login
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  try {

    const headersList = headers();
    const origin = headersList.get('origin');

    // ホスト名が取得できない場合はデフォルトの環境変数を使用 (既存ロジックへのフォールバック)
    const redirectTo = origin || undefined;

    const result = await AuthService.signup({ email, password, username, redirectTo });
    if (!result) return { error: 'Signup failed' };
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}

export async function logout() { }
