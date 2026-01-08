'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/auth/actions';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    console.log('[Debug] validateForm started');
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError('メールアドレスを入力してください');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      isValid = false;
    }

    if (!password) {
      setPasswordError('パスワードを入力してください');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('パスワードは6文字以上で入力してください');
      isValid = false;
    }

    console.log('[Debug] validateForm result:', isValid, { emailError: !email ? 'empty' : null, passwordError: !password ? 'empty' : null });
    return isValid;
  };

  const handleChange = (
    field: 'username' | 'email' | 'password',
    value: string
  ) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'email') {
      setEmail(value);
      if (emailError) setEmailError(null);
    } else {
      setPassword(value);
      if (passwordError) setPasswordError(null);
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (field === 'email') {
      if (!email) {
        setEmailError('メールアドレスを入力してください');
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('有効なメールアドレスを入力してください');
      }
    } else if (field === 'password') {
      if (!password) {
        setPasswordError('パスワードを入力してください');
      } else if (password.length < 6) {
        setPasswordError('パスワードは6文字以上で入力してください');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Debug] handleSignUp started');
    if (!validateForm()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);

    console.log('[Debug] Calling signup server action');
    const result = await signup(formData);
    console.log('[Debug] Server action result:', result);

    if (result?.error) {
      alert(`エラー: ${result.error}`);
    } else {
      //alert('確認メールを送信しました。メールボックスを確認してください。');
      router.push('/login');
    }
    setLoading(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-white/95">
          アカウント作成
        </CardTitle>
        <CardDescription className="text-left text-white/95">
          メールアドレスとパスワードを入力してアカウントを作成してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="grid gap-6 px-1" noValidate>
          <FormInput
            id="username"
            type="text"
            label="ユーザー名"
            placeholder="user name"
            value={username}
            onChange={(value) => handleChange('username', value)}
            required
          />
          <FormInput
            id="email"
            type="email"
            label="メールアドレス"
            placeholder="name@example.com"
            value={email}
            onChange={(value) => handleChange('email', value)}
            onBlur={() => handleBlur('email')}
            error={emailError}
            required
          />
          <FormInput
            id="password"
            type="password"
            label="パスワード"
            value={password}
            onChange={(value) => handleChange('password', value)}
            onBlur={() => handleBlur('password')}
            error={passwordError}
            required
          />
          <div className="mt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full border-none bg-white/80 text-base font-semibold text-black shadow-lg transition-all hover:bg-white active:scale-97"
            >
              {loading ? 'Processing...' : 'アカウント作成'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogin}
              disabled={loading}
              className="h-11 w-full rounded-full border-white/0 bg-transparent text-base font-semibold text-white shadow-none transition-all hover:bg-white/25 hover:text-white active:scale-97"
            >
              すでにアカウントをお持ちの方はこちら
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
