'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, parseQuestionOptions, type ViewName, type Question, type ViewMode } from '@/lib/store'

// ============================================
// ICONS (inline SVG to avoid import issues)
// ============================================
const Icons = {
  home: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  trophy: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  target: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  chart: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  user: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>,
  store: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>,
  shield: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>,
  volume: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  mic: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  heart: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  star: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  zap: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>,
  coin: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 9.5h5.5a2.5 2.5 0 0 1 0 5H8"/></svg>,
  lock: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  check: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M20 6 9 17l-5-5"/></svg>,
  x: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  arrowLeft: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  arrowRight: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  lightbulb: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  flame: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  bookmark: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  settings: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  logOut: (p: any) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
}

// ============================================
// CONFETTI COMPONENT
// ============================================
function ConfettiEffect() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: ['#22c55e', '#f97316', '#a855f7', '#eab308', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// LOGIN SCREEN
// ============================================
function LoginScreen() {
  const [email, setEmail] = useState('demo@lingoquest.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAppStore((s) => s.login)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-game p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            LingoQuest
          </h1>
          <p className="text-muted-foreground mt-2">Master English like a game</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="demo@lingoquest.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="demo123"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow disabled:opacity-50"
          >
            {loading ? '⏳ Signing in...' : '🚀 Start Learning'}
          </motion.button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials</p>
          <div className="flex gap-4 justify-center text-xs text-muted-foreground">
            <span>👤 Player: demo@lingoquest.com</span>
            <span>🔑 demo123</span>
          </div>
          <div className="flex gap-4 justify-center text-xs text-muted-foreground mt-1">
            <span>🛡️ Admin: admin@lingoquest.com</span>
            <span>🔑 admin123</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// HEADER / TOP BAR
// ============================================
function Header() {
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)
  const currentView = useAppStore((s) => s.currentView)
  const soundEnabled = useAppStore((s) => s.soundEnabled)
  const infiniteLivesUntil = useAppStore((s) => s.infiniteLivesUntil)
  const store = useAppStore()

  const xpForNextLevel = user ? user.level * (user.level + 1) * 50 + 100 * (user.level + 1) : 100
  const xpForCurrentLevel = user ? user.level * (user.level - 1) * 50 + 100 * user.level : 0
  const xpProgress = user ? ((user.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 : 0
  const hasInfiniteLives = infiniteLivesUntil > Date.now()

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {currentView !== 'dashboard' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('dashboard')}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Icons.arrowLeft size={20} />
            </motion.button>
          )}
          <button onClick={() => navigate('dashboard')} className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
              LingoQuest
            </span>
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Icons.flame size={16} className="text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{user.streak}</span>
            </div>

            {/* Lives */}
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border ${
              hasInfiniteLives 
                ? 'bg-pink-500/10 border-pink-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <Icons.heart size={14} className={hasInfiniteLives ? 'text-pink-400' : 'text-red-400'} />
              <span className={`text-sm font-bold ${hasInfiniteLives ? 'text-pink-400' : 'text-red-400'}`}>
                {hasInfiniteLives ? '∞' : user.lives}
              </span>
              {hasInfiniteLives && (
                <span className="text-[9px] text-pink-400 font-medium">
                  {Math.max(0, Math.ceil((infiniteLivesUntil - Date.now()) / 60000))}m
                </span>
              )}
            </div>

            {/* XP */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Icons.zap size={14} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">{user.xp}</span>
              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
                <div className="xp-bar h-full rounded-full" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Icons.coin size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">{user.coins}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => store.setState({ soundEnabled: !soundEnabled })}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

// ============================================
// BOTTOM NAV
// ============================================
function BottomNav() {
  const currentView = useAppStore((s) => s.currentView)
  const navigate = useAppStore((s) => s.navigate)
  const user = useAppStore((s) => s.user)

  const navItems: { view: ViewName; icon: any; label: string }[] = [
    { view: 'dashboard', icon: Icons.home, label: 'Home' },
    { view: 'rankings', icon: Icons.trophy, label: 'Rank' },
    { view: 'missions', icon: Icons.target, label: 'Missions' },
    { view: 'statistics', icon: Icons.chart, label: 'Stats' },
    { view: 'profile', icon: Icons.user, label: 'Profile' },
  ]

  if (currentView === 'exercise') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (item.view === 'dashboard' && currentView === 'scenario-map')
          return (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon size={20} className={isActive ? 'drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('admin')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentView === 'admin' ? 'text-purple-400 bg-purple-500/10' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icons.shield size={20} />
            <span className="text-[10px] font-medium">Admin</span>
          </button>
        )}
      </div>
    </nav>
  )
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard() {
  const user = useAppStore((s) => s.user)
  const levels = useAppStore((s) => s.levels)
  const navigate = useAppStore((s) => s.navigate)
  const loadLevels = useAppStore((s) => s.loadLevels)
  const loadScenarios = useAppStore((s) => s.loadScenarios)

  useEffect(() => {
    loadLevels()
  }, [loadLevels])

  const handleLevelClick = async (levelId: string) => {
    await loadScenarios(levelId)
    navigate('scenario-map', { levelId })
  }

  const levelColors = {
    basic: { from: 'from-emerald-500', to: 'to-green-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    intermediate: { from: 'from-orange-500', to: 'to-amber-600', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    advanced: { from: 'from-purple-500', to: 'to-violet-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
              {user?.avatar || '🎯'}
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome back, {user?.name}!</h2>
              <p className="text-muted-foreground text-sm">
                Level {user?.level} • {user?.title}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Icons.flame size={18} className="text-orange-400" />
              <div>
                <p className="text-lg font-bold text-orange-400">{user?.streak || 0}</p>
                <p className="text-[10px] text-muted-foreground">Day Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Icons.zap size={18} className="text-emerald-400" />
              <div>
                <p className="text-lg font-bold text-emerald-400">{user?.xp || 0}</p>
                <p className="text-[10px] text-muted-foreground">Total XP</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Icons.coin size={18} className="text-yellow-400" />
              <div>
                <p className="text-lg font-bold text-yellow-400">{user?.coins || 0}</p>
                <p className="text-[10px] text-muted-foreground">Coins</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <Icons.star size={18} className="text-pink-400" />
              <div>
                <p className="text-lg font-bold text-pink-400">{user?.totalStars || 0}</p>
                <p className="text-[10px] text-muted-foreground">Stars</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Levels */}
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        🗺️ Choose Your World
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        {levels.map((level, i) => {
          const colors = levelColors[level.slug as keyof typeof levelColors] || levelColors.basic
          const isLocked = level.minXp > (user?.xp || 0)

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={!isLocked ? { scale: 1.03 } : {}}
              whileTap={!isLocked ? { scale: 0.97 } : {}}
              onClick={() => !isLocked && handleLevelClick(level.id)}
              disabled={isLocked}
              className={`card-premium rounded-2xl p-6 text-left relative overflow-hidden ${
                isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } bg-gradient-card border ${colors.border} shadow-lg ${colors.glow}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.from} ${colors.to} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="text-4xl mb-3">{level.icon}</div>
              <h4 className={`text-xl font-bold ${colors.text}`}>{level.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{level.descriptionEs}</p>

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icons.lock size={20} />
                    <span className="text-sm font-medium">{level.minXp} XP required</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {level.minXp === 0 ? 'Free' : `${level.minXp} XP`}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '🏆', label: 'Rankings', view: 'rankings' as ViewName, color: 'from-yellow-500 to-amber-600' },
          { icon: '📋', label: 'Missions', view: 'missions' as ViewName, color: 'from-emerald-500 to-green-600' },
          { icon: '📊', label: 'Statistics', view: 'statistics' as ViewName, color: 'from-cyan-500 to-blue-600' },
          { icon: '🛍️', label: 'Shop', view: 'shop' as ViewName, color: 'from-purple-500 to-violet-600' },
        ].map((item, i) => (
          <motion.button
            key={item.view}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.view)}
            className="glass rounded-xl p-4 text-center hover:bg-secondary/50 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="text-xs font-medium mt-2 text-muted-foreground">{item.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// SCENARIO MAP (Story Mode)
// ============================================
function ScenarioMap() {
  const scenarios = useAppStore((s) => s.scenarios)
  const navigate = useAppStore((s) => s.navigate)
  const selectedLevelId = useAppStore((s) => s.selectedLevelId)
  const loadLessons = useAppStore((s) => s.loadLessons)
  const user = useAppStore((s) => s.user)
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null)

  const handleScenarioClick = async (scenario: any) => {
    const isUnlockedStatus = scenario.isStarter || scenario.order === 1 ||
      scenarios.some((s) => s.order === scenario.order - 1 && s.progress?.status === 'completed')

    if (!isUnlockedStatus) return

    setLoadingScenario(scenario.id)
    try {
      await loadLessons(scenario.id)
      // Show lesson selection via state
      setSelectedScenarioForLessons(scenario)
    } catch (err) {
      console.error(err)
    }
    setLoadingScenario(null)
  }

  const startLesson = async (lessonId: string) => {
    await useAppStore.getState().startExercise(lessonId)
    setSelectedScenarioForLessons(null)
  }

  const isUnlocked = (scenario: any) => {
    if (scenario.isStarter || scenario.order === 1) return true
    const prevScenario = scenarios.find((s) => s.order === scenario.order - 1)
    return prevScenario?.progress?.status === 'completed'
  }

  const lessons = useAppStore((s) => s.lessons)
  const [selectedScenarioForLessons, setSelectedScenarioForLessons] = useState<any>(null)

  const currentLevel = useAppStore((s) => s.levels.find((l) => l.id === s.selectedLevelId))
  const levelColor = currentLevel?.slug === 'basic' ? 'emerald' : currentLevel?.slug === 'intermediate' ? 'orange' : 'purple'
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-emerald-500/10',
    orange: 'border-orange-500/30 bg-orange-500/5 text-orange-400 shadow-orange-500/10',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 shadow-purple-500/10',
  }
  const activeColor: Record<string, string> = {
    emerald: 'border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/20',
    orange: 'border-orange-500/50 bg-orange-500/10 shadow-orange-500/20',
    purple: 'border-purple-500/50 bg-purple-500/10 shadow-purple-500/20',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      {/* Level Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl mb-3 block">{currentLevel?.icon}</span>
        <h2 className="text-2xl font-bold">{currentLevel?.name}</h2>
        <p className="text-muted-foreground">{currentLevel?.descriptionEs}</p>
      </motion.div>

      {/* Scenario Path */}
      <div className="flex flex-col items-center gap-1">
        {scenarios.map((scenario, i) => {
          const unlocked = isUnlocked(scenario)
          const completed = scenario.progress?.status === 'completed'
          const inProgress = scenario.progress?.status === 'in_progress'
          const stars = scenario.progress?.stars || 0
          const progress = scenario.progress?.progress || 0

          return (
            <React.Fragment key={scenario.id}>
              {/* Connector line */}
              {i > 0 && (
                <div className={`w-0.5 h-4 ${unlocked ? 'bg-emerald-500/30' : 'bg-border'}`} />
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={unlocked ? { scale: 1.05 } : {}}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                onClick={() => unlocked && handleScenarioClick(scenario)}
                className={`w-full max-w-md rounded-2xl p-4 border relative overflow-hidden cursor-pointer transition-all ${
                  completed
                    ? `card-premium border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/10`
                    : inProgress
                    ? `card-premium ${activeColor[levelColor]} shadow-lg`
                    : unlocked
                    ? `card-premium ${colorMap[levelColor]} shadow-md`
                    : 'border-border/30 bg-secondary/20 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    completed ? 'bg-emerald-500/20' : unlocked ? 'bg-secondary' : 'bg-secondary/50'
                  }`}>
                    {unlocked ? scenario.icon : '🔒'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{scenario.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{scenario.nameEs}</p>

                    {/* Progress bar */}
                    {(inProgress || completed) && (
                      <div className="mt-2 w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8 }}
                          className="xp-bar h-full rounded-full"
                        />
                      </div>
                    )}

                    {/* Lock hint for locked scenarios */}
                    {!unlocked && (
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        🔓 Complete previous scenario to unlock
                      </p>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1">
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Icons.star
                          key={s}
                          size={12}
                          className={s <= stars ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>

                    {/* Difficulty */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, d) => (
                        <div
                          key={d}
                          className={`w-1.5 h-1.5 rounded-full ${
                            d < scenario.difficulty ? 'difficulty-dot-active' : 'difficulty-dot-inactive'
                          }`}
                        />
                      ))}
                    </div>

                    {/* XP */}
                    <span className="text-[10px] text-emerald-400 font-medium">+{scenario.xpReward} XP</span>
                  </div>
                </div>

                {/* Completed check */}
                {completed && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Icons.check size={14} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Loading overlay */}
                {loadingScenario === scenario.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            </React.Fragment>
          )
        })}
      </div>

      {/* Lesson Selection Modal */}
      <AnimatePresence>
        {selectedScenarioForLessons && lessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80"
            onClick={() => setSelectedScenarioForLessons(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedScenarioForLessons.icon} {selectedScenarioForLessons.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedScenarioForLessons.nameEs}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {lessons.filter((l: any) => l.userProgress?.status === 'completed').length}/{lessons.length} lessons completed
                  </p>
                </div>
                <button onClick={() => setSelectedScenarioForLessons(null)} className="p-2 rounded-xl hover:bg-secondary">
                  <Icons.x size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, i) => {
                  const lessonCompleted = lesson.userProgress?.status === 'completed'
                  const lessonStars = lesson.userProgress?.stars || 0
                  return (
                  <motion.button
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startLesson(lesson.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      lessonCompleted
                        ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                        : 'border-border hover:border-emerald-500/30 bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        lessonCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-secondary'
                      }`}>
                        {lessonCompleted ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.titleEs}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs text-emerald-400">+{lesson.xpReward} XP</span>
                        <p className="text-[10px] text-muted-foreground capitalize">{lesson.type}</p>
                        {lessonCompleted && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((s) => (
                              <Icons.star
                                key={s}
                                size={10}
                                className={s <= lessonStars ? 'star-filled' : 'star-empty'}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// EXERCISE ENGINE
// ============================================
function ExerciseView() {
  const questions = useAppStore((s) => s.questions)
  const currentQuestionIndex = useAppStore((s) => s.currentQuestionIndex)
  const selectedAnswer = useAppStore((s) => s.selectedAnswer)
  const isCorrect = useAppStore((s) => s.isCorrect)
  const showResult = useAppStore((s) => s.showResult)
  const isExerciseComplete = useAppStore((s) => s.isExerciseComplete)
  const exerciseXpEarned = useAppStore((s) => s.exerciseXpEarned)
  const exerciseStars = useAppStore((s) => s.exerciseStars)
  const exerciseResults = useAppStore((s) => s.exerciseResults)
  const answerQuestion = useAppStore((s) => s.answerQuestion)
  const nextQuestion = useAppStore((s) => s.nextQuestion)
  const navigate = useAppStore((s) => s.navigate)
  const playSound = useAppStore((s) => s.playSound)
  const resetExercise = useAppStore((s) => s.resetExercise)
  const useHint = useAppStore((s) => s.useHint)
  const hintsUsed = useAppStore((s) => s.hintsUsed)
  const showConfetti = useAppStore((s) => s.showConfetti)
  const setShowConfetti = useAppStore((s) => s.setShowConfetti)
  const scenarios = useAppStore((s) => s.scenarios)

  const currentQuestion = questions[currentQuestionIndex]
  const [inputAnswer, setInputAnswer] = useState('')
  const [dragItems, setDragItems] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState('')

  // Reset exercise state when question changes (using useMemo for derived state)
  const shuffledItems = React.useMemo(() => {
    if (currentQuestion?.type === 'order_words' || currentQuestion?.type === 'build_sentence') {
      const opts = parseQuestionOptions(currentQuestion.options)
      return [...opts].sort(() => Math.random() - 0.5)
    }
    return []
  }, [currentQuestionIndex, currentQuestion?.id])

  useEffect(() => {
    setDragItems(shuffledItems)
  }, [shuffledItems])

  useEffect(() => {
    setInputAnswer('')
    setShowHint(false)
    setRecognitionResult('')
  }, [currentQuestionIndex])

  const handleAnswer = useCallback((answer: string) => {
    if (showResult) return
    answerQuestion(answer)
  }, [showResult, answerQuestion])

  const handleSubmitInput = () => {
    if (inputAnswer.trim()) {
      handleAnswer(inputAnswer.trim())
    }
  }

  const handleDragItemClick = (word: string, index: number) => {
    const newItems = [...dragItems]
    newItems.splice(index, 1)
    setDragItems(newItems)
    setInputAnswer(prev => (prev ? prev + ' ' + word : word))
  }

  const handleRemoveFromAnswer = () => {
    const words = inputAnswer.trim().split(' ')
    if (words.length > 0) {
      const removed = words.pop()!
      setDragItems(prev => [...prev, removed])
      setInputAnswer(words.join(' '))
    }
  }

  const speechSpeed = useAppStore((s) => s.speechSpeed)
  const setSpeechSpeed = useAppStore((s) => s.setSpeechSpeed)
  const speechVoiceIndex = useAppStore((s) => s.speechVoiceIndex)
  const setSpeechVoiceIndex = useAppStore((s) => s.setSpeechVoiceIndex)

  // Load available browser voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [showVoiceSelector, setShowVoiceSelector] = useState(false)

  // Fallback virtual voices for when browser has no English voices
  const virtualVoices = [
    { name: 'Default', pitch: 1, rate: 0.9, local: true },
    { name: 'Deep Male', pitch: 0.6, rate: 0.85, local: true },
    { name: 'High Female', pitch: 1.4, rate: 0.9, local: true },
    { name: 'Fast Speaker', pitch: 1, rate: 1.2, local: true },
    { name: 'Slow & Clear', pitch: 0.9, rate: 0.5, local: true },
    { name: 'Friendly', pitch: 1.2, rate: 0.85, local: true },
    { name: 'Teacher', pitch: 0.8, rate: 0.75, local: true },
  ]

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      // Filter to only English voices
      const englishVoices = voices.filter(v => v.lang.startsWith('en'))
      setAvailableVoices(englishVoices)
    }

    // Voices may already be loaded
    loadVoices()
    // But on some browsers they load asynchronously
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech before starting new one
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = speechSpeed === 'slow' ? 0.5 : 0.9
      // Apply selected voice if available
      if (speechVoiceIndex >= 0 && speechVoiceIndex < availableVoices.length) {
        utterance.voice = availableVoices[speechVoiceIndex]
      } else if (speechVoiceIndex >= availableVoices.length) {
        // Virtual voice: apply pitch and rate settings
        const vIdx = speechVoiceIndex - availableVoices.length
        const virtualVoice = virtualVoices[vIdx]
        if (virtualVoice) {
          utterance.pitch = virtualVoice.pitch
          utterance.rate = speechSpeed === 'slow' ? virtualVoice.rate * 0.6 : virtualVoice.rate
        }
      }
      speechSynthesis.speak(utterance)
    }
  }

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      setRecognitionResult(transcript)
      handleAnswer(transcript)
    }
    recognition.onerror = () => setIsRecording(false)

    recognition.start()
  }

  const correctCount = exerciseResults.filter(r => r.isCorrect).length
  const totalCount = exerciseResults.length
  const totalQuestions = questions.length

  // Exercise Complete Screen
  if (isExerciseComplete) {
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {showConfetti && <ConfettiEffect />}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {exerciseStars >= 3 ? '🌟' : exerciseStars >= 2 ? '⭐' : exerciseStars >= 1 ? '👍' : '💪'}
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">
            {exerciseStars >= 3 ? 'Perfect!' : exerciseStars >= 2 ? 'Great Job!' : exerciseStars >= 1 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>

          <div className="flex justify-center gap-1 my-4">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + s * 0.2 }}
              >
                <Icons.star size={32} className={s <= exerciseStars ? 'star-filled' : 'star-empty'} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-2xl font-bold text-emerald-400">+{exerciseXpEarned}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-400">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <p className="text-2xl font-bold text-pink-400">{correctCount}/{totalCount}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                resetExercise()
                if (questions.length > 0) {
                  // restart
                }
              }}
              className="flex-1 py-3 rounded-xl bg-secondary border border-border text-foreground font-medium"
            >
              🔄 Retry
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                resetExercise()
                navigate('scenario-map')
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/25"
            >
              ✅ Continue
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No questions available</p>
          <button onClick={() => navigate('scenario-map')} className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-white">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Progress bar
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Render different exercise types
  const renderExercise = () => {
    const q = currentQuestion
    switch (q.type) {
      case 'multiple_choice': {
        const options = parseQuestionOptions(q.options)
        return (
          <div className="grid gap-3">
            {options.map((option, i) => {
              const isSelected = selectedAnswer === option
              const isCorrectOption = option === q.correctAnswer
              let btnClass = 'glass border border-border hover:border-emerald-500/30'
              if (showResult && isSelected && isCorrectOption) btnClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              else if (showResult && isSelected && !isCorrectOption) btnClass = 'bg-red-500/20 border-red-500/50 text-red-400'
              else if (showResult && !isSelected && isCorrectOption) btnClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                    {showResult && isSelected && isCorrectOption && <Icons.check size={18} className="ml-auto text-emerald-400" />}
                    {showResult && isSelected && !isCorrectOption && <Icons.x size={18} className="ml-auto text-red-400" />}
                  </div>
                </motion.button>
              )
            })}
          </div>
        )
      }

      case 'fill_blank':
      case 'translate':
      case 'listen_write':
      case 'dictation':
        return (
          <div className="space-y-4">
            {q.type === 'listen_write' || q.type === 'dictation' ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => speakText(q.audioText || q.prompt)}
                className="mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              >
                <Icons.volume size={20} />
                <span className="font-medium">Play Audio</span>
                {speechSpeed === 'slow' && <span className="text-[10px] opacity-70 ml-1">🐢</span>}
              </motion.button>
            ) : null}

            <div className="relative">
              <input
                type="text"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitInput()}
                placeholder={q.type === 'translate' ? 'Type your translation...' : 'Type your answer...'}
                disabled={showResult}
                className="w-full px-4 py-4 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg disabled:opacity-50"
              />
            </div>

            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitInput}
                disabled={!inputAnswer.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold disabled:opacity-50"
              >
                Submit Answer
              </motion.button>
            )}
          </div>
        )

      case 'order_words':
      case 'build_sentence':
        return (
          <div className="space-y-4">
            {/* Built sentence */}
            <div
              onClick={handleRemoveFromAnswer}
              className="min-h-[60px] p-4 rounded-xl bg-secondary border border-border flex flex-wrap gap-2 cursor-pointer"
            >
              {inputAnswer ? (
                inputAnswer.split(' ').map((word, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm">
                    {word}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">Tap words to build the sentence...</span>
              )}
            </div>

            {/* Available words */}
            <div className="flex flex-wrap gap-2 justify-center">
              {dragItems.map((word, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDragItemClick(word, i)}
                  disabled={showResult}
                  className="px-4 py-2 rounded-xl glass border border-border font-medium text-sm hover:border-emerald-500/30 transition-colors disabled:opacity-50"
                >
                  {word}
                </motion.button>
              ))}
            </div>

            {!showResult && inputAnswer && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(inputAnswer)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold"
              >
                Check Sentence
              </motion.button>
            )}
          </div>
        )

      case 'pronunciation':
        return (
          <div className="space-y-6 text-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => speakText(q.audioText || q.correctAnswer)}
              className="mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            >
              <Icons.volume size={20} />
              <span className="font-medium">Listen First</span>
              {speechSpeed === 'slow' && <span className="text-[10px] opacity-70 ml-1">🐢</span>}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecognition}
              disabled={isRecording || showResult}
              className={`mx-auto flex flex-col items-center gap-2 p-8 rounded-2xl border transition-all ${
                isRecording
                  ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/20'
                  : 'bg-secondary border-border hover:border-emerald-500/30'
              }`}
            >
              <Icons.mic size={40} className={isRecording ? 'text-red-400 animate-pulse' : 'text-foreground'} />
              <span className="text-sm font-medium">
                {isRecording ? '🎤 Listening...' : 'Tap to Speak'}
              </span>
            </motion.button>

            {recognitionResult && (
              <p className="text-lg text-muted-foreground">
                You said: <span className="text-foreground font-medium">{recognitionResult}</span>
              </p>
            )}

            {!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) && (
              <p className="text-xs text-muted-foreground">
                ⚠️ Speech recognition not available. Try Chrome.
              </p>
            )}
          </div>
        )

      case 'flashcard':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: showHint ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-full max-w-sm h-48 glass rounded-2xl flex items-center justify-center p-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div style={{ backfaceVisibility: 'hidden' }}>
                <p className="text-2xl font-bold">{q.prompt}</p>
                <p className="text-sm text-muted-foreground mt-2">{q.promptEs}</p>
              </div>
            </motion.div>

            {!showResult && (
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    speakText(q.audioText || q.prompt)
                    setShowHint(true)
                  }}
                  className="px-6 py-3 rounded-xl bg-secondary border border-border"
                >
                  🔊 Listen {speechSpeed === 'slow' && '🐢'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(q.correctAnswer)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold"
                >
                  ✅ I Know This
                </motion.button>
              </div>
            )}
          </div>
        )

      case 'find_error':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-lg font-medium text-red-300">❌ {q.prompt}</p>
              <p className="text-xs text-muted-foreground mt-1">Find and fix the error</p>
            </div>
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitInput()}
              placeholder="Type the corrected sentence..."
              disabled={showResult}
              className="w-full px-4 py-4 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg disabled:opacity-50"
            />
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitInput}
                disabled={!inputAnswer.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold disabled:opacity-50"
              >
                Submit Correction
              </motion.button>
            )}
          </div>
        )

      case 'choose_image':
      case 'match_concepts':
      default:
        // Fallback to multiple choice style
        const options = parseQuestionOptions(q.options)
        if (options.length > 0) {
          return (
            <div className="grid gap-3">
              {options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all glass border border-border hover:border-emerald-500/30 ${
                    showResult && selectedAnswer === option ? (option === q.correctAnswer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400') : ''
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )
        }
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitInput()}
              placeholder="Type your answer..."
              disabled={showResult}
              className="w-full px-4 py-4 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-emerald-500 outline-none text-lg disabled:opacity-50"
            />
            {!showResult && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitInput}
                disabled={!inputAnswer.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold disabled:opacity-50"
              >
                Submit
              </motion.button>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 glass border-b border-border/50 p-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              resetExercise()
              navigate('scenario-map')
            }}
            className="p-2 rounded-xl hover:bg-secondary"
          >
            <Icons.x size={20} />
          </motion.button>

          <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="xp-bar h-full rounded-full"
            />
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>

          {/* Speed toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSpeechSpeed(speechSpeed === 'slow' ? 'normal' : 'slow')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              speechSpeed === 'slow'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-secondary text-muted-foreground border border-border hover:bg-secondary/80'
            }`}
          >
            {speechSpeed === 'slow' ? '🐢 Slow' : '🐇 Normal'}
          </motion.button>

          {/* Voice selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
              className="p-2 rounded-xl hover:bg-secondary text-cyan-400 relative"
              title="Change voice"
            >
              <Icons.volume size={18} />
              {speechVoiceIndex >= 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </motion.button>

            {/* Voice dropdown */}
            <AnimatePresence>
              {showVoiceSelector && (
                <>
                  {/* Backdrop to close on click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowVoiceSelector(false)} />
                  <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-popover border border-border shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-2 border-b border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Voice Selection</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {/* Default voice option */}
                    <button
                      onClick={() => {
                        setSpeechVoiceIndex(-1)
                        setShowVoiceSelector(false)
                        // Preview the voice
                        if ('speechSynthesis' in window) {
                          speechSynthesis.cancel()
                          const u = new SpeechSynthesisUtterance('Hello, this is the default voice.')
                          u.lang = 'en-US'
                          u.rate = speechSpeed === 'slow' ? 0.5 : 0.9
                          speechSynthesis.speak(u)
                        }
                      }}
                      className={`w-full px-3 py-2.5 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 ${
                        speechVoiceIndex === -1 ? 'bg-cyan-500/10 text-cyan-400' : 'text-foreground'
                      }`}
                    >
                      <span className="text-base">🔊</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">Default</p>
                        <p className="text-[10px] text-muted-foreground">System default voice</p>
                      </div>
                      {speechVoiceIndex === -1 && <Icons.check size={14} className="text-cyan-400 shrink-0" />}
                    </button>

                    {/* Virtual voice options (always available) */}
                    <div className="px-3 py-1.5 border-t border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Voice Styles</p>
                    </div>
                    {virtualVoices.map((voice, i) => {
                      const voiceIdx = availableVoices.length + i
                      return (
                        <button
                          key={`virtual-${i}`}
                          onClick={() => {
                            setSpeechVoiceIndex(voiceIdx)
                            setShowVoiceSelector(false)
                            // Preview the voice
                            if ('speechSynthesis' in window) {
                              speechSynthesis.cancel()
                              const u = new SpeechSynthesisUtterance('Hello, this is how I sound.')
                              u.lang = 'en-US'
                              u.pitch = voice.pitch
                              u.rate = speechSpeed === 'slow' ? voice.rate * 0.6 : voice.rate
                              speechSynthesis.speak(u)
                            }
                          }}
                          className={`w-full px-3 py-2.5 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 ${
                            speechVoiceIndex === voiceIdx ? 'bg-cyan-500/10 text-cyan-400' : 'text-foreground'
                          }`}
                        >
                          <span className="text-base">🗣️</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{voice.name}</p>
                            <p className="text-[10px] text-muted-foreground">Pitch: {voice.pitch.toFixed(1)} • Speed: {voice.rate.toFixed(1)}</p>
                          </div>
                          {speechVoiceIndex === voiceIdx && <Icons.check size={14} className="text-cyan-400 shrink-0" />}
                        </button>
                      )
                    })}

                    {/* Browser English voices (if available) */}
                    {availableVoices.length > 0 && (
                      <div className="px-3 py-1.5 border-t border-border">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Browser Voices</p>
                      </div>
                    )}
                    {availableVoices.map((voice, i) => (
                      <button
                        key={`${voice.name}-${i}`}
                        onClick={() => {
                          setSpeechVoiceIndex(i)
                          setShowVoiceSelector(false)
                          // Preview the voice
                          if ('speechSynthesis' in window) {
                            speechSynthesis.cancel()
                            const u = new SpeechSynthesisUtterance('Hello, this is how I sound.')
                            u.lang = 'en-US'
                            u.rate = speechSpeed === 'slow' ? 0.5 : 0.9
                            u.voice = voice
                            speechSynthesis.speak(u)
                          }
                        }}
                        className={`w-full px-3 py-2.5 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 ${
                          speechVoiceIndex === i ? 'bg-cyan-500/10 text-cyan-400' : 'text-foreground'
                        }`}
                      >
                        <span className="text-base">{voice.localService ? '🤖' : '☁️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{voice.name.replace(/Microsoft |Google |Apple /, '')}</p>
                          <p className="text-[10px] text-muted-foreground">{voice.lang} {voice.localService ? '• Local' : '• Cloud'}</p>
                        </div>
                        {speechVoiceIndex === i && <Icons.check size={14} className="text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const hint = currentQuestion.hintEn || currentQuestion.hintEs || 'No hint available'
              setShowHint(true)
              // Use the store's notification for hints
              useAppStore.setState({ notification: { type: 'hint', message: `💡 ${hint}` } })
            }}
            className="p-2 rounded-xl hover:bg-secondary text-yellow-400"
          >
            <Icons.lightbulb size={20} />
          </motion.button>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            {/* Question type badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary border border-border">
                {currentQuestion.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="text-xs text-muted-foreground">+{currentQuestion.points} pts</span>
            </div>

            {/* Question prompt */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{currentQuestion.prompt}</h2>
              {currentQuestion.promptEs && (
                <p className="text-sm text-muted-foreground">{currentQuestion.promptEs}</p>
              )}
            </div>

            {/* Audio button */}
            {currentQuestion.audioText && currentQuestion.type !== 'listen_write' && currentQuestion.type !== 'dictation' && currentQuestion.type !== 'pronunciation' && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => speakText(currentQuestion.audioText)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                >
                  <Icons.volume size={16} />
                  Listen {speechSpeed === 'slow' && '🐢'}
                </motion.button>
              </div>
            )}

            {/* Hint */}
            {showHint && (currentQuestion.hintEn || currentQuestion.hintEs) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm"
              >
                💡 {currentQuestion.hintEn}
                {currentQuestion.hintEs && <span className="block text-yellow-400/70 mt-1">{currentQuestion.hintEs}</span>}
              </motion.div>
            )}

            {/* Exercise content */}
            {renderExercise()}

            {/* Result feedback */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                  <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                {currentQuestion.explanationEs && (
                  <p className="text-xs text-muted-foreground mt-1">{currentQuestion.explanationEs}</p>
                )}
                {!isCorrect && (
                  <p className="text-sm mt-2">
                    Correct answer: <span className="font-bold text-emerald-400">{currentQuestion.correctAnswer}</span>
                  </p>
                )}
              </motion.div>
            )}

            {/* Next button */}
            {showResult && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextQuestion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25"
              >
                {currentQuestionIndex < totalQuestions - 1 ? '➡️ Next Question' : '🏁 Complete Exercise'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================
// RANKINGS VIEW
// ============================================
function RankingsView() {
  const [rankings, setRankings] = useState<Array<{rank: number; name: string; avatar: string; xp: number}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rankings')
      .then(r => r.json())
      .then(data => {
        setRankings(data.rankings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <h2 className="text-2xl font-bold mb-6 text-center">🏆 Rankings</h2>

      {loading ? (
        <div className="space-y-4">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="animate-pulse h-16 rounded-xl bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                i === 0 ? 'bg-yellow-500/10 border-yellow-500/20' :
                i === 1 ? 'bg-gray-400/10 border-gray-400/20' :
                i === 2 ? 'bg-orange-500/10 border-orange-500/20' :
                'glass border-border'
              }`}
            >
              <span className={`text-2xl font-black w-10 text-center ${
                i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-muted-foreground'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${r.rank || i + 1}`}
              </span>
              <span className="text-2xl">{r.avatar || '🎯'}</span>
              <div className="flex-1">
                <p className="font-bold">{r.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <Icons.zap size={16} className="text-emerald-400" />
                <span className="font-bold text-emerald-400">{r.xp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// STATISTICS VIEW
// ============================================
function StatisticsView() {
  const user = useAppStore((s) => s.user)

  const stats = [
    { label: 'Words Learned', value: user?.wordsLearned || 0, icon: '📚', color: 'emerald' },
    { label: 'Exercises Done', value: user?.exercisesDone || 0, icon: '✏️', color: 'cyan' },
    { label: 'Study Time', value: `${user?.totalStudyTime || 0}m`, icon: '⏱️', color: 'orange' },
    { label: 'Accuracy', value: `${Math.round((user?.accuracy || 0) * 100)}%`, icon: '🎯', color: 'pink' },
    { label: 'Listening', value: `${Math.round((user?.listeningScore || 0) * 100)}%`, icon: '👂', color: 'purple' },
    { label: 'Writing', value: `${Math.round((user?.writingScore || 0) * 100)}%`, icon: '✍️', color: 'yellow' },
    { label: 'Speaking', value: `${Math.round((user?.speakingScore || 0) * 100)}%`, icon: '🗣️', color: 'red' },
    { label: 'Longest Streak', value: user?.longestStreak || 0, icon: '🔥', color: 'orange' },
  ]

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <h2 className="text-2xl font-bold mb-6 text-center">📊 Statistics</h2>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl border ${colorClasses[stat.color]}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="text-xs opacity-70">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="mt-6 p-6 rounded-2xl glass border border-border">
        <h3 className="font-bold mb-4">Level Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>🌱 Basic</span>
              <span className="text-emerald-400">3/25 completed</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>🔥 Intermediate</span>
              <span className="text-orange-400">0/25 completed</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>👑 Advanced</span>
              <span className="text-purple-400">0/25 completed</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MISSIONS VIEW
// ============================================
function MissionsView() {
  const [missions, setMissions] = useState<{daily: any[], weekly: any[], special: any[]}>({daily: [], weekly: [], special: []})
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'special'>('daily')
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  const playSound = useAppStore((s) => s.playSound)

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/missions/${user.id}`)
        .then(r => r.json())
        .then(data => {
          setMissions({
            daily: data.daily || [],
            weekly: data.weekly || [],
            special: data.special || [],
          })
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [user?.id])

  const handleClaim = async (missionId: string, date: string) => {
    if (!user) return
    setClaimingId(missionId)
    try {
      const res = await fetch('/api/missions/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, missionId, date }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Claim failed')
      }
      const data = await res.json()
      // Update user with new XP and coins
      if (data.user) setUser(data.user)
      playSound('reward')

      // Reload missions
      const missionsRes = await fetch(`/api/missions/${user.id}`)
      const missionsData = await missionsRes.json()
      setMissions({
        daily: missionsData.daily || [],
        weekly: missionsData.weekly || [],
        special: missionsData.special || [],
      })
    } catch (err: any) {
      console.error('Claim error:', err)
    }
    setClaimingId(null)
  }

  const renderMission = (m: any, i: number, colorClass: string = 'bg-emerald-500') => (
    <motion.div
      key={m.id || i}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className={`p-4 rounded-xl border relative overflow-hidden ${
        m.claimed
          ? 'bg-gray-500/5 border-gray-500/20 opacity-70'
          : m.completed
          ? 'bg-yellow-500/10 border-yellow-500/30'
          : 'glass border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{m.icon || '📋'}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm">{m.titleEs || m.title}</p>
            {m.claimed && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 font-bold">CLAIMED</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{m.descriptionEs || m.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClass} rounded-full transition-all`}
                style={{ width: `${Math.min((m.progress / (m.requirement || 1)) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{Math.min(m.progress, m.requirement)}/{m.requirement}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 min-w-[70px]">
          <span className="text-xs text-emerald-400 font-medium">+{m.rewardXp} XP</span>
          <span className="text-xs text-yellow-400 font-medium">+{m.rewardCoins} 🪙</span>
          {m.completed && !m.claimed && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleClaim(m.id, m.date)}
              disabled={claimingId === m.id}
              className="mt-1 px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] font-bold disabled:opacity-50"
            >
              {claimingId === m.id ? '⏳' : '🎁 Claim'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )

  const tabs = [
    { key: 'daily' as const, label: '☀️ Daily', count: missions.daily.length },
    { key: 'weekly' as const, label: '📅 Weekly', count: missions.weekly.length },
    { key: 'special' as const, label: '⭐ Special', count: missions.special.length },
  ]

  const currentMissions = activeTab === 'daily' ? missions.daily : activeTab === 'weekly' ? missions.weekly : missions.special

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <h2 className="text-2xl font-bold mb-2 text-center">📋 Missions</h2>
      <p className="text-xs text-muted-foreground text-center mb-6">
        Complete missions to earn XP and coins. Claim your rewards when done!
      </p>

      {/* How Missions Work */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 mb-6 border border-border"
      >
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">❓ How Do Missions Work?</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>☀️ <strong className="text-foreground">Daily Missions</strong> — Reset every day. Complete them before midnight!</p>
          <p>📅 <strong className="text-foreground">Weekly Missions</strong> — Reset every Monday. Bigger challenges, bigger rewards!</p>
          <p>⭐ <strong className="text-foreground">Special Missions</strong> — One-time achievements. Complete them at your own pace!</p>
          <p>🎁 <strong className="text-yellow-400">Claim Rewards</strong> — When a mission is complete, tap &quot;Claim&quot; to receive your XP and coins!</p>
        </div>
      </motion.div>

      {/* Mission Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-secondary/50 text-muted-foreground border border-transparent'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="animate-pulse h-20 rounded-xl bg-secondary" />
          ))}
        </div>
      ) : currentMissions.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">📋</span>
          <p className="text-muted-foreground">No missions available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentMissions.map((m: any, i: number) =>
            renderMission(m, i, activeTab === 'daily' ? 'bg-emerald-500' : activeTab === 'weekly' ? 'bg-orange-500' : 'bg-purple-500')
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// PROFILE VIEW
// ============================================
function ProfileView() {
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)
  const navigate = useAppStore((s) => s.navigate)
  const inventory = useAppStore((s) => s.inventory)
  const loadShop = useAppStore((s) => s.loadShop)
  const equipReward = useAppStore((s) => s.equipReward)
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'settings'>('stats')
  const [inventoryFilter, setInventoryFilter] = useState<string>('all')

  useEffect(() => {
    loadShop()
  }, [loadShop])

  if (!user) return null

  const filteredInventory = inventoryFilter === 'all'
    ? inventory
    : inventory.filter((item) => item.type === inventoryFilter)

  const inventoryTypes = ['all', 'avatar', 'frame', 'title']

  const rarityColors: Record<string, string> = {
    common: 'border-gray-500/30 bg-gray-500/5',
    rare: 'border-cyan-500/30 bg-cyan-500/5',
    epic: 'border-purple-500/30 bg-purple-500/5',
    legendary: 'border-yellow-500/30 bg-yellow-500/5',
  }
  const rarityGlow: Record<string, string> = {
    common: '',
    rare: 'shadow-cyan-500/20',
    epic: 'shadow-purple-500/20',
    legendary: 'shadow-yellow-500/20',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 text-center mb-6"
      >
        {/* Avatar with Frame */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          {/* Frame as border decoration only */}
          {user.frame && (
            <div className="absolute -inset-3 rounded-2xl border-4 border-yellow-500/60 z-0 animate-pulse-glow" />
          )}
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-5xl shadow-lg shadow-emerald-500/20 relative z-10">
            {user.avatar}
          </div>
          {/* Frame emoji in corner */}
          {user.frame && (
            <div className="absolute -bottom-1 -right-1 text-lg z-20 bg-background rounded-full w-8 h-8 flex items-center justify-center border border-border shadow-md">
              {user.frame}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-emerald-400 font-medium">{user.title}</p>
        <p className="text-xs text-muted-foreground mt-1">Level {user.level} • {user.email}</p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xl font-bold text-emerald-400">{user.xp}</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xl font-bold text-yellow-400">{user.coins}</p>
            <p className="text-[10px] text-muted-foreground">Coins</p>
          </div>
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <p className="text-xl font-bold text-pink-400">{user.totalStars}</p>
            <p className="text-[10px] text-muted-foreground">Stars</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'stats' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-secondary/50 text-muted-foreground border border-transparent'
          }`}
        >
          📊 Stats
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'inventory' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-secondary/50 text-muted-foreground border border-transparent'
          }`}
        >
          🎒 My Items ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'settings' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-secondary/50 text-muted-foreground border border-transparent'
          }`}
        >
          ⚙️ Settings
        </button>
      </div>

      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Detailed Stats */}
          <div className="glass rounded-2xl p-5 mb-4">
            <h3 className="text-lg font-bold mb-3">📈 Detailed Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-lg font-bold text-orange-400">{user.streak}</p>
                <p className="text-[10px] text-muted-foreground">Day Streak (Best: {user.longestStreak})</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-lg font-bold text-emerald-400">{user.exercisesDone}</p>
                <p className="text-[10px] text-muted-foreground">Exercises Done</p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-lg font-bold text-cyan-400">{user.wordsLearned}</p>
                <p className="text-[10px] text-muted-foreground">Words Learned</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-lg font-bold text-purple-400">{Math.round(user.accuracy * 100)}%</p>
                <p className="text-[10px] text-muted-foreground">Accuracy</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-lg font-bold text-blue-400">{Math.round(user.listeningScore * 100)}%</p>
                <p className="text-[10px] text-muted-foreground">Listening</p>
              </div>
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <p className="text-lg font-bold text-pink-400">{Math.round(user.speakingScore * 100)}%</p>
                <p className="text-[10px] text-muted-foreground">Speaking</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-3">🏆 Achievements</h3>
            <div className="grid grid-cols-5 gap-2">
              {['👶', '🔥', '⚡', '🌟', '💯', '⭐', '💫', '🧠', '🎓', '📈'].map((icon, i) => (
                <div key={i} className="aspect-square rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-xl">
                  {i < 3 ? icon : '🔒'}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('shop')}
              className="w-full p-4 rounded-xl glass border border-border flex items-center gap-3 text-left"
            >
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="font-bold">Shop</p>
                <p className="text-xs text-muted-foreground">Spend your coins on avatars & items</p>
              </div>
              <Icons.arrowRight size={20} className="ml-auto text-muted-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={logout}
              className="w-full p-4 rounded-xl glass border border-red-500/20 flex items-center gap-3 text-left text-red-400"
            >
              <Icons.logOut size={20} />
              <div>
                <p className="font-bold">Log Out</p>
                <p className="text-xs text-red-400/60">Sign out of your account</p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {activeTab === 'inventory' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {inventoryTypes.map((type) => (
              <button
                key={type}
                onClick={() => setInventoryFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  inventoryFilter === type
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-secondary/50 text-muted-foreground border border-transparent'
                }`}
              >
                {type === 'all' ? '📦 All' : type === 'avatar' ? '👤 Avatars' : type === 'frame' ? '🖼️ Frames' : '🏷️ Titles'}
              </button>
            ))}
          </div>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🎒</span>
              <p className="text-muted-foreground mb-2">No items yet</p>
              <p className="text-xs text-muted-foreground mb-4">Visit the shop to buy avatars, frames, and titles!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('shop')}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold text-sm"
              >
                🛍️ Go to Shop
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredInventory.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`relative p-4 rounded-xl border text-center transition-all ${
                    rarityColors[item.rarity] || rarityColors.common
                  } ${item.equipped ? `ring-2 ring-emerald-500/50 shadow-lg ${rarityGlow[item.rarity] || ''}` : ''}`}
                >
                  {/* Equipped badge */}
                  {item.equipped && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center z-10">
                      <Icons.check size={12} className="text-white" />
                    </div>
                  )}

                  <span className="text-3xl block mb-2">{item.icon}</span>
                  <p className="font-bold text-xs">{item.nameEs || item.name}</p>
                  <p className="text-[9px] text-muted-foreground capitalize">{item.type}</p>

                  {/* Equip/Unequip button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => equipReward(item.rewardId)}
                    className={`mt-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      item.equipped
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-secondary text-foreground hover:bg-emerald-500/10 hover:text-emerald-400'
                    }`}
                  >
                    {item.equipped ? '✓ Equipped' : 'Equip'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* View Mode */}
          <div className="p-4 rounded-xl glass border border-border">
            <h3 className="font-bold mb-3">🎨 View Mode</h3>
            <p className="text-xs text-muted-foreground mb-3">Choose your preferred visual style</p>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('normal')}
                className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                  viewMode === 'normal'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-secondary/50 border-border text-muted-foreground hover:border-emerald-500/20'
                }`}
              >
                <span className="text-2xl block mb-1">🌙</span>
                <p className="text-xs font-bold">Normal</p>
                <p className="text-[9px] text-muted-foreground">Dark theme</p>
              </button>
              <button
                onClick={() => setViewMode('clean')}
                className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                  viewMode === 'clean'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-secondary/50 border-border text-muted-foreground hover:border-emerald-500/20'
                }`}
              >
                <span className="text-2xl block mb-1">☀️</span>
                <p className="text-xs font-bold">Clean</p>
                <p className="text-[9px] text-muted-foreground">Light & readable</p>
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout()
            }}
            className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-colors"
          >
            🚪 Logout
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ============================================
// SHOP VIEW
// ============================================
function ShopView() {
  const user = useAppStore((s) => s.user)
  const shopItems = useAppStore((s) => s.shopItems)
  const inventory = useAppStore((s) => s.inventory)
  const isLoading = useAppStore((s) => s.isLoading)
  const loadShop = useAppStore((s) => s.loadShop)
  const buyReward = useAppStore((s) => s.buyReward)
  const equipReward = useAppStore((s) => s.equipReward)
  const playSound = useAppStore((s) => s.playSound)
  const [shopFilter, setShopFilter] = useState<string>('all')
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    loadShop()
  }, [loadShop])

  const rarityColors: Record<string, string> = {
    common: 'border-gray-500/30 bg-gray-500/5',
    rare: 'border-cyan-500/30 bg-cyan-500/5',
    epic: 'border-purple-500/30 bg-purple-500/5',
    legendary: 'border-yellow-500/30 bg-yellow-500/5',
  }
  const rarityLabels: Record<string, string> = {
    common: 'text-gray-400',
    rare: 'text-cyan-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  }
  const rarityGlow: Record<string, string> = {
    common: '',
    rare: 'shadow-cyan-500/20',
    epic: 'shadow-purple-500/20',
    legendary: 'shadow-yellow-500/20',
  }

  const shopTypes = ['all', 'avatar', 'frame', 'title']

  const filteredItems = shopFilter === 'all'
    ? shopItems
    : shopItems.filter((item) => item.type === shopFilter)

  // Check if an item is equipped
  const isEquipped = (rewardId: string) => inventory.some((i) => i.rewardId === rewardId && i.equipped)

  const handleBuy = async (rewardId: string) => {
    setBuyingId(rewardId)
    await buyReward(rewardId)
    setBuyingId(null)
  }

  const handleEquip = async (rewardId: string) => {
    await equipReward(rewardId)
  }

  // Show success message briefly
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">🛍️ Shop</h2>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <Icons.coin size={14} className="text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">{user?.coins || 0}</span>
        </div>
      </div>

      {/* Success notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center font-medium"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {shopTypes.map((type) => (
          <button
            key={type}
            onClick={() => setShopFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              shopFilter === type
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-secondary/50 text-muted-foreground border border-transparent'
            }`}
          >
            {type === 'all' ? '📦 All' : type === 'avatar' ? '👤 Avatars' : type === 'frame' ? '🖼️ Frames' : '🏷️ Titles'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="animate-pulse h-44 rounded-xl bg-secondary" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">🛍️</span>
          <p className="text-muted-foreground">No items available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredItems.map((item, i) => {
            const owned = item.purchased
            const equipped = isEquipped(item.id)
            const canAfford = (user?.coins || 0) >= item.cost
            const isBuying = buyingId === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={!owned ? { scale: 1.05 } : {}}
                className={`relative p-4 rounded-xl border text-center transition-all ${
                  rarityColors[item.rarity] || rarityColors.common
                } ${equipped ? `ring-2 ring-emerald-500/50 shadow-lg ${rarityGlow[item.rarity] || ''}` : ''}`}
              >
                {/* Owned badge */}
                {owned && !equipped && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center z-10">
                    <Icons.check size={12} className="text-white" />
                  </div>
                )}
                {equipped && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center z-10">
                    <Icons.check size={12} className="text-white" />
                  </div>
                )}

                <span className="text-4xl block mb-2">{item.icon}</span>
                <p className="font-bold text-sm">{item.nameEs || item.name}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{item.descriptionEs || item.description}</p>
                <p className={`text-[10px] uppercase font-bold mt-1 ${rarityLabels[item.rarity] || ''}`}>
                  {item.rarity}
                </p>

                {owned ? (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEquip(item.id)}
                    className={`mt-3 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      equipped
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-secondary text-foreground hover:bg-emerald-500/10 hover:text-emerald-400'
                    }`}
                  >
                    {equipped ? '✓ Equipped' : 'Equip'}
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBuy(item.id)}
                    disabled={!canAfford || isBuying}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
                  >
                    {isBuying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>{item.cost} 🪙</>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Bottom info */}
      <div className="mt-6 p-4 rounded-xl glass border border-border text-center">
        <p className="text-xs text-muted-foreground">
          💡 Earn coins by completing exercises. Equip your items in <button onClick={() => useAppStore.getState().navigate('profile')} className="text-emerald-400 hover:underline">Profile → My Items</button>
        </p>
      </div>
    </div>
  )
}

// ============================================
// ADMIN VIEW
// ============================================
function AdminView() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'create'>('overview')
  const [actionLoading, setActionLoading] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' })

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const loadUsers = useCallback(() => {
    setUsersLoading(true)
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data.users || [])
        setUsersLoading(false)
      })
      .catch(() => setUsersLoading(false))
  }, [])

  // Load users when switching to users tab (via click handler, not effect)

  const handleAdminAction = async (action: string, userId: string, data?: any) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...data }),
      })
      const result = await res.json()
      if (res.ok) {
        useAppStore.getState().setNotification({ type: 'success', message: result.message || 'Action completed!' })
        loadUsers()
      } else {
        useAppStore.getState().setNotification({ type: 'error', message: result.error || 'Action failed' })
      }
    } catch (err) {
      useAppStore.getState().setNotification({ type: 'error', message: 'Network error' })
    }
    setActionLoading(false)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_user', ...newUser }),
      })
      const result = await res.json()
      if (res.ok) {
        useAppStore.getState().setNotification({ type: 'success', message: 'User created successfully!' })
        setNewUser({ name: '', email: '', password: '', role: 'user' })
        loadUsers()
      } else {
        useAppStore.getState().setNotification({ type: 'error', message: result.error || 'Failed to create user' })
      }
    } catch (err) {
      useAppStore.getState().setNotification({ type: 'error', message: 'Network error' })
    }
    setActionLoading(false)
  }

  const filteredUsers = users.filter((u: any) =>
    u.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <h2 className="text-2xl font-bold mb-6 text-center">🛡️ Admin Panel</h2>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: '📊 Overview' },
          { key: 'users', label: '👥 Users' },
          { key: 'create', label: '➕ Create User' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveSection(tab.key as any)
              if (tab.key === 'users') loadUsers()
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeSection === tab.key
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-secondary/50 text-muted-foreground border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="animate-pulse h-24 rounded-xl bg-secondary" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-400">{stats?.totalUsers || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-2xl font-bold text-cyan-400">{stats?.totalExercisesCompleted || 0}</p>
                  <p className="text-xs text-muted-foreground">Exercises Completed</p>
                </div>
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-2xl font-bold text-orange-400">{stats?.totalXpEarned || 0}</p>
                  <p className="text-xs text-muted-foreground">Total XP Earned</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-2xl font-bold text-purple-400">{stats?.activeUsersToday || 0}</p>
                  <p className="text-xs text-muted-foreground">Active Today</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border">
                <h3 className="font-bold mb-4">Platform Overview</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>📚 3 Levels (75 Scenarios)</p>
                  <p>📝 6 Exams (Midterm + Final per level)</p>
                  <p>🏆 15 Achievements</p>
                  <p>📋 18 Missions (8 Daily + 6 Weekly + 4 Special)</p>
                  <p>🎁 68 Shop Items (33 Avatars, 18 Frames, 17 Titles)</p>
                  <p>👤 {stats?.totalUsers || 0} Users</p>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="🔍 Search by name, email, or role..."
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {usersLoading ? (
            <div className="space-y-3">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="animate-pulse h-20 rounded-xl bg-secondary" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">👥</span>
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredUsers.map((u: any) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-border glass"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{u.avatar || '👤'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                        u.blocked ? 'bg-red-500/20 text-red-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {u.role === 'admin' ? 'Admin' : u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div className="text-center p-1.5 rounded-lg bg-secondary/50">
                      <p className="text-xs font-bold text-emerald-400">{u.xp || 0}</p>
                      <p className="text-[8px] text-muted-foreground">XP</p>
                    </div>
                    <div className="text-center p-1.5 rounded-lg bg-secondary/50">
                      <p className="text-xs font-bold text-yellow-400">{u.coins || 0}</p>
                      <p className="text-[8px] text-muted-foreground">Coins</p>
                    </div>
                    <div className="text-center p-1.5 rounded-lg bg-secondary/50">
                      <p className="text-xs font-bold text-red-400">{u.lives || 0}</p>
                      <p className="text-[8px] text-muted-foreground">Lives</p>
                    </div>
                    <div className="text-center p-1.5 rounded-lg bg-secondary/50">
                      <p className="text-xs font-bold text-orange-400">{u.streak || 0}</p>
                      <p className="text-[8px] text-muted-foreground">Streak</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => handleAdminAction('give_lives', u.id, { amount: 5 })}
                      disabled={actionLoading}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 disabled:opacity-50"
                    >
                      ❤️ +5 Lives
                    </button>
                    <button
                      onClick={() => handleAdminAction('give_coins', u.id, { amount: 100 })}
                      disabled={actionLoading}
                      className="px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold hover:bg-yellow-500/20 disabled:opacity-50"
                    >
                      🪙 +100 Coins
                    </button>
                    <button
                      onClick={() => handleAdminAction('give_xp', u.id, { amount: 50 })}
                      disabled={actionLoading}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      ⚡ +50 XP
                    </button>
                    <button
                      onClick={() => handleAdminAction(u.blocked ? 'unblock' : 'block', u.id)}
                      disabled={actionLoading}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold disabled:opacity-50 ${
                        u.blocked
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20'
                      }`}
                    >
                      {u.blocked ? '✅ Unblock' : '🚫 Block'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          handleAdminAction('delete_user', u.id)
                        }
                      }}
                      disabled={actionLoading || u.role === 'admin'}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 disabled:opacity-30"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <button
            onClick={loadUsers}
            className="w-full mt-4 p-3 rounded-xl bg-secondary border border-border text-muted-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            🔄 Refresh Users
          </button>
        </>
      )}

      {/* Create User Section */}
      {activeSection === 'create' && (
        <form onSubmit={handleCreateUser} className="glass rounded-2xl p-6 border border-border">
          <h3 className="font-bold mb-4">➕ Create New User</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="User name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold disabled:opacity-50"
            >
              {actionLoading ? '⏳ Creating...' : '✨ Create User'}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  )
}

// ============================================
// MAIN APP
// ============================================
export default function Home() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn)
  const currentView = useAppStore((s) => s.currentView)
  const showConfetti = useAppStore((s) => s.showConfetti)
  const setShowConfetti = useAppStore((s) => s.setShowConfetti)
  const showLevelUpAnimation = useAppStore((s) => s.showLevelUpAnimation)
  const setShowLevelUpAnimation = useAppStore((s) => s.setShowLevelUpAnimation)
  const updateStreak = useAppStore((s) => s.updateStreak)
  const checkStreakGift = useAppStore((s) => s.checkStreakGift)
  const showStreakGiftModal = useAppStore((s) => s.showStreakGiftModal)
  const claimStreakGift = useAppStore((s) => s.claimStreakGift)
  const setShowStreakGiftModal = useAppStore((s) => s.setShowStreakGiftModal)
  const viewMode = useAppStore((s) => s.viewMode)

  // Update streak on login
  useEffect(() => {
    if (isLoggedIn) {
      updateStreak()
      // Check for streak gift after streak update
      setTimeout(() => checkStreakGift(), 500)
    }
  }, [isLoggedIn, updateStreak, checkStreakGift])

  // Auto-hide confetti
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, setShowConfetti])

  // Clear infinite lives when expired
  const infiniteLivesUntil = useAppStore((s) => s.infiniteLivesUntil)
  useEffect(() => {
    if (infiniteLivesUntil > Date.now()) {
      const remaining = infiniteLivesUntil - Date.now()
      const timer = setTimeout(() => {
        useAppStore.setState({ infiniteLivesUntil: 0 })
      }, remaining + 1000)
      return () => clearTimeout(timer)
    }
  }, [infiniteLivesUntil])

  if (!isLoggedIn) {
    return <LoginScreen />
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />
      case 'scenario-map': return <ScenarioMap />
      case 'exercise': return <ExerciseView />
      case 'rankings': return <RankingsView />
      case 'statistics': return <StatisticsView />
      case 'missions': return <MissionsView />
      case 'profile': return <ProfileView />
      case 'shop': return <ShopView />
      case 'admin': return <AdminView />
      default: return <Dashboard />
    }
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-game ${viewMode === 'clean' ? 'view-mode-clean' : ''}`}>
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />

      {/* Confetti overlay */}
      {showConfetti && <ConfettiEffect />}

      {/* Streak Gift Modal */}
      <AnimatePresence>
        {showStreakGiftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="glass rounded-3xl p-6 max-w-sm w-full text-center"
            >
              <div className="text-5xl mb-2">🎁</div>
              <h2 className="text-2xl font-black mb-2">Streak Reward!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                You reached a 7-day streak! Pick one gift box:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => claimStreakGift(i)}
                    className="aspect-square rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 flex items-center justify-center text-4xl hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
                  >
                    🎁
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowStreakGiftModal(false)}
                className="mt-4 px-6 py-2 rounded-xl bg-secondary text-muted-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Skip
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUpAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
            onClick={() => setShowLevelUpAnimation(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-black neon-green">LEVEL UP!</h2>
              <p className="text-xl text-muted-foreground mt-2">Keep up the great work!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
