'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validateEmail = (value: string) => {
    if (!value) return 'メールアドレスは必須項目です';
    if (!/\S+@\S+\.\S+/.test(value))
      return '有効なメールアドレスを入力してください';
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'パスワードは必須項目です';
    if (value.length < 6) return 'パスワードは6文字以上で入力してください';
    return null;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setEmailError(validateEmail(email));
    } else {
      setPasswordError(validatePassword(password));
    }
  };

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
      if (touched.email || emailError) {
        setEmailError(validateEmail(value));
      }
    } else {
      setPassword(value);
      if (touched.password || passwordError) {
        setPasswordError(validatePassword(value));
      }
    }
  };

  const validateForm = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setTouched({ email: true, password: true });

    if (emailErr || passwordErr) {
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/main_background.png')] bg-cover bg-fixed bg-top bg-no-repeat px-4">
      <svg className="invisible fixed h-0 w-0">
        <defs>
          {/* TRUE EDGE REFRACTION FILTER */}
          {/* 本当の境界屈折フィルター (Zenn記事のスタイル) */}
          <filter
            id="liquid-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            {/* 1. 有機的な液体の波のための低周波乱流 */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004 0.004"
              numOctaves="1"
              seed="0"
              result="noise"
            />

            {/* 2. ノイズをぼかして粒子を取り除き、滑らかな波を作成 */}
            <feGaussianBlur in="noise" stdDeviation="8" result="blurred" />

            {/* 3. 複合演算を使用して強度を調整 */}
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="2"
              k4="0"
              in="blurred"
              in2="blurred"
              result="litImage"
            />

            {/* 4. 液体効果のための強力な変位 */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="litImage"
              scale="-50"
              xChannelSelector="G"
              yChannelSelector="G"
            />
          </filter>

          <linearGradient
            id="border-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255, 255, 255, 1.0)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 1.0)" />
          </linearGradient>
        </defs>
      </svg>

      <Card className="relative w-full max-w-sm overflow-hidden rounded-[30px] border-none bg-transparent shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        {/* レイヤー0: SVGボーダーオーバーレイ */}
        <svg className="pointer-events-none absolute inset-0 z-50 h-full w-full">
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="29.5"
            ry="29.5"
            fill="none"
            stroke="url(#border-gradient)"
            strokeWidth="1.2"
            className="opacity-70"
          />
        </svg>

        {/* レイヤー1: 本当の屈折エンジン (追加のぼかしなし、幾何学的歪みのみ) */}
        {/* レイヤー1: エッジ歪み (Zennのポリシー) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backdropFilter: 'url(#liquid-distortion)',
            WebkitBackdropFilter: 'url(#liquid-distortion)',
            maskImage:
              'radial-gradient(circle at center, transparent 50%, black 85%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, transparent 50%, black 85%)',
            isolation: 'isolate',
          }}
        />

        {/* レイヤー2: 微妙なベースのぼかしと色合い */}
        <div className="absolute inset-0 z-10 bg-black/[0.10] backdrop-blur-[2px]" />

        {/* レイヤー3: コンテンツ */}
        <div className="relative z-30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-white/95">
              ログイン
            </CardTitle>
            <CardDescription className="text-left text-white/95">
              メールアドレスとパスワードを入力してログインしてください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-6 px-1" noValidate>
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
        </div>
      </Card>
    </div>
  );
}
