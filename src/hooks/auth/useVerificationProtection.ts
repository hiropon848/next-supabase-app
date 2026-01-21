import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useVerificationProtection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verified = searchParams.get('verified');

    // verified=true パラメータがない場合はアクセス権なしとしてリダイレクト
    if (verified !== 'true') {
      router.replace('/signup');
    } else {
      setIsAuthorized(true);
    }
  }, [router, searchParams]);

  return { isAuthorized };
};
