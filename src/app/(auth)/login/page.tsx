'use client';

import { useRouter } from 'next/navigation';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/auth/useLogin';

export default function LoginPage() {
  const router = useRouter();
  const { formState, errors, loading, handlers } = useLogin();

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-white/95">
          ログイン
        </CardTitle>
        <CardDescription className="text-left text-white/95">
          メールアドレスとパスワードを入力してログインしてください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handlers.handleSubmit}
          className="grid gap-6 px-1"
          noValidate
        >
          <FormInput
            id="email"
            type="email"
            label="メールアドレス"
            placeholder="name@example.com"
            value={formState.email}
            onChange={(value) => handlers.handleChange('email', value)}
            onBlur={() => handlers.handleBlur('email')}
            error={errors.email}
            required
          />
          <FormInput
            id="password"
            type="password"
            label="パスワード"
            value={formState.password}
            onChange={(value) => handlers.handleChange('password', value)}
            onBlur={() => handlers.handleBlur('password')}
            error={errors.password}
            required
          />
          <div className="mt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full border-none bg-white/80 text-base font-semibold text-black shadow-lg transition-all hover:bg-white active:scale-97"
            >
              {loading ? 'Processing...' : 'ログイン'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSignUp}
              disabled={loading}
              className="h-11 w-full rounded-full border-white/0 bg-transparent text-base font-semibold text-white shadow-none transition-all hover:bg-white/25 hover:text-white active:scale-97"
            >
              新規アカウント作成
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
