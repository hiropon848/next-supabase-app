import { Card } from '@/components/ui/card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="relative z-30">{children}</div>
      </Card>
    </div>
  );
}
