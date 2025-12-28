'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
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
        <div className="absolute inset-0 z-10 bg-white/[0.01] backdrop-blur-[2px]" />

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
            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="pl-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg border-white/30 bg-white/[0.15] text-white backdrop-blur-[4px] placeholder:text-white/60 focus:border-white/60 focus:bg-white/[0.25] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="password"
                  className="pl-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  パスワード
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-lg border-white/30 bg-white/[0.15] pr-10 text-white backdrop-blur-[4px] focus:border-white/60 focus:bg-white/[0.25] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors hover:text-white"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-full border-none bg-white/80 text-base font-semibold text-black shadow-lg transition-all hover:bg-white"
                >
                  {loading ? 'Processing...' : 'ログイン'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignUp}
                  disabled={loading}
                  className="h-11 w-full rounded-full border-white/0 bg-transparent text-base font-semibold text-white shadow-none transition-all hover:bg-white/25 hover:text-white"
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
