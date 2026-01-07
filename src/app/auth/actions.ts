'use server';

import { AuthService } from '@/services/auth';

export async function login() {
  // TODO: Implement login
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  try {
    const result = await AuthService.signup({ email, password, username });
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
