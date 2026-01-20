import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/auth/actions';

export function useSignup() {
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

    console.log('[Debug] validateForm result:', isValid, {
      emailError: !email ? 'empty' : null,
      passwordError: !password ? 'empty' : null,
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      let errorMessage = result.error;
      if (result.error.includes('User already registered')) {
        errorMessage = 'すでに登録されているメールアドレスです。';
      } else if (result.error.includes('Rate limit exceeded')) {
        errorMessage = '不正な大量アクセスが発生しています。';
      } else if (result.error.includes('Too many requests')) {
        errorMessage =
          'リクエスト上限に達しています。時間をおいて再度送信してください。';
      }
      alert(`エラー: ${errorMessage}`);
    } else {
      alert(
        '確認メールを送信しました。\nメールボックスを確認し、認証リンクをクリックして登録を完了してください。'
      );
      router.push('/login');
    }
    setLoading(false);
  };

  return {
    formState: { username, email, password },
    errors: { email: emailError, password: passwordError },
    loading,
    handlers: { handleChange, handleBlur, handleSubmit },
  };
}
