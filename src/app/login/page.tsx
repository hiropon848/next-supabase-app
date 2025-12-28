'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
        } else {
            router.push('/dashboard')
        }
        setLoading(false)
    }

    const handleSignUp = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            alert(error.message)
        } else {
            alert('Check your email for the confirmation link!')
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/images/main_background.png')] bg-cover bg-top bg-no-repeat bg-fixed px-4 overflow-hidden relative">

            <svg className="fixed invisible w-0 h-0">
                <defs>
                    {/* TRUE EDGE REFRACTION FILTER */}
                    {/* TRUE EDGE REFRACTION FILTER (Zenn Article Style) */}
                    <filter id="liquid-distortion" x="0%" y="0%" width="100%" height="100%">
                        {/* 1. Low frequency turbulence for organic liquid wave */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.004" numOctaves="1" seed="0" result="noise" />

                        {/* 2. Blur the noise to remove grain and create smooth waves */}
                        <feGaussianBlur in="noise" stdDeviation="8" result="blurred" />

                        {/* 3. Adjust intensity using composite arithmetic */}
                        <feComposite operator="arithmetic" k1="0" k2="1" k3="2" k4="0" in="blurred" in2="blurred" result="litImage" />

                        {/* 4. Strong displacement for liquid effect */}
                        <feDisplacementMap in="SourceGraphic" in2="litImage" scale="-50" xChannelSelector="G" yChannelSelector="G" />
                    </filter>

                    <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 1.0)" />
                        <stop offset="30%" stopColor="rgba(255, 255, 255, 0.1)" />
                        <stop offset="70%" stopColor="rgba(255, 255, 255, 0.1)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 1.0)" />
                    </linearGradient>
                </defs>
            </svg>

            <Card className="w-full max-w-sm rounded-[30px] overflow-hidden relative border-none bg-transparent shadow-[0_30px_60px_rgba(0,0,0,0.6)]">

                {/* Layer 0: SVG Border Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
                    <rect
                        x="0.5" y="0.5"
                        width="calc(100% - 1px)" height="calc(100% - 1px)"
                        rx="29.5" ry="29.5"
                        fill="none"
                        stroke="url(#border-gradient)"
                        strokeWidth="1.2"
                        className="opacity-70"
                    />
                </svg>

                {/* Layer 1: TRUE REFRACTION ENGINE (No extra blur, just geometrical distortion) */}
                {/* Layer 1: Edge Distortion (Zenn Policy) */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backdropFilter: 'url(#liquid-distortion)',
                        WebkitBackdropFilter: 'url(#liquid-distortion)',
                        maskImage: 'radial-gradient(circle at center, transparent 50%, black 85%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, transparent 50%, black 85%)',
                        isolation: 'isolate',
                    }}
                />

                {/* Layer 2: Subtle Base Blur & Tint */}
                <div className="absolute inset-0 z-10 bg-white/[0.01] backdrop-blur-[2px]" />

                {/* Layer 3: Content */}
                <div className="relative z-30">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-white/95">ログイン</CardTitle>
                        <CardDescription className="text-white/95 text-left">
                            メールアドレスとパスワードを入力してログインしてください。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="grid gap-5">
                            <div className="grid gap-1">
                                <Label htmlFor="email" className="text-white/70 font-semibold text-xs uppercase tracking-[0.2em] pl-1">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 bg-white/[0.15] border-white/30 text-white placeholder:text-white/60 focus:border-white/60 focus:bg-white/[0.25] rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 backdrop-blur-[4px]"
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="password" className="text-white/70 font-semibold text-xs uppercase tracking-[0.2em] pl-1">パスワード</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11 bg-white/[0.15] border-white/30 text-white focus:border-white/60 focus:bg-white/[0.25] rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 backdrop-blur-[4px] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <MdVisibilityOff size={20} />
                                        ) : (
                                            <MdVisibility size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Button type="submit" disabled={loading} className="w-full h-11 bg-white/80 text-black hover:bg-white font-semibold transition-all rounded-full shadow-lg border-none text-base">
                                    {loading ? 'Processing...' : 'ログイン'}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleSignUp} disabled={loading} className="w-full h-11 border-white/0 text-white hover:bg-white/25 hover:text-white bg-transparent transition-all rounded-full text-base font-semibold shadow-none">
                                    新規アカウント作成
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}
