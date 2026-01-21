'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVerificationProtection } from '@/hooks/auth/useVerificationProtection';

function VerifiedContent() {
  const { isAuthorized } = useVerificationProtection();

  // リダイレクト中は何も表示しない（チラつき防止）
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-white/95">
          認証完了
        </CardTitle>
        <CardDescription className="text-left text-white/95">
          認証が完了しました。
          <br />
          ログイン画面からログインしてください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-white/0 bg-transparent text-base font-semibold text-white shadow-none transition-all hover:bg-white/25 hover:text-white active:scale-97"
            >
              ログイン画面へ
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense fallback={null}>
      <VerifiedContent />
    </Suspense>
  );
}
