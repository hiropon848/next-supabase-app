import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { SignupParams } from '@/types/auth';

export async function signUpUser(params: SignupParams) {
    const supabase = await createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
            data: {
                username: params.username,
            },
        },
    });
}
