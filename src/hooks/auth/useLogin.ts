import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validateForm = () => {
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

    return isValid;
  };

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
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
    } else {
      if (!password) {
        setPasswordError('パスワードを入力してください');
      } else if (password.length < 6) {
        setPasswordError('パスワードは6文字以上で入力してください');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = '無効なメールアドレスまたはパスワードです。';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage =
          'メール認証が完了していません。受信したメールから認証をおこなってください。';
      } else if (error.message.includes('Too many requests')) {
        errorMessage =
          'リクエスト上限に達しています。時間をおいて再度送信してください。';
      }
      alert(`エラー: ${errorMessage}`);
    } else {
      router.push('/main');
    }
    setLoading(false);
  };

  return {
    formState: { email, password },
    errors: { email: emailError, password: passwordError },
    loading,
    handlers: { handleChange, handleBlur, handleSubmit },
  };
}
