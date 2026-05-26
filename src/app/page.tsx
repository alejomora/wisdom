'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, parseQuestionOptions, type ViewName, type Question, type ViewMode, computeTitle, TITLE_TIERS } from '@/lib/store'

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
// ANIMATED AVATAR COMPONENT (Emoji + Animated Background)
// ============================================
const AVATAR_BG_THEMES: Record<string, { colors: string[]; particles: string[]; glow: string }> = {
  '🎯': { colors: ['#10b981', '#06b6d4'], particles: ['#34d399', '#22d3ee', '#6ee7b7'], glow: '#10b981' },
  '👩': { colors: ['#ec4899', '#f43f5e'], particles: ['#f472b6', '#fb7185', '#fda4af'], glow: '#ec4899' },
  '👨': { colors: ['#3b82f6', '#6366f1'], particles: ['#60a5fa', '#818cf8', '#93c5fd'], glow: '#3b82f6' },
  '👧': { colors: ['#a855f7', '#ec4899'], particles: ['#c084fc', '#f472b6', '#e879f9'], glow: '#a855f7' },
  '🧑': { colors: ['#06b6d4', '#14b8a6'], particles: ['#22d3ee', '#2dd4bf', '#67e8f9'], glow: '#06b6d4' },
  '👩‍🎓': { colors: ['#eab308', '#f59e0b'], particles: ['#facc15', '#fbbf24', '#fde68a'], glow: '#eab308' },
  '👨‍💻': { colors: ['#8b5cf6', '#a855f7'], particles: ['#a78bfa', '#c084fc', '#c4b5fd'], glow: '#8b5cf6' },
  '👩‍🏫': { colors: ['#14b8a6', '#10b981'], particles: ['#2dd4bf', '#34d399', '#5eead4'], glow: '#14b8a6' },
  '🧑‍🎓': { colors: ['#f97316', '#ef4444'], particles: ['#fb923c', '#f87171', '#fdba74'], glow: '#f97316' },
  '🦊': { colors: ['#f97316', '#eab308'], particles: ['#fb923c', '#facc15', '#fdba74'], glow: '#f97316' },
  '🐱': { colors: ['#f472b6', '#fb7185'], particles: ['#f9a8d4', '#fda4af', '#fbcfe8'], glow: '#f472b6' },
  '🐶': { colors: ['#ca8a04', '#d97706'], particles: ['#eab308', '#fbbf24', '#fde68a'], glow: '#ca8a04' },
  '🤖': { colors: ['#6b7280', '#94a3b8'], particles: ['#9ca3af', '#cbd5e1', '#64748b'], glow: '#6b7280' },
  '👾': { colors: ['#7c3aed', '#8b5cf6'], particles: ['#8b5cf6', '#a78bfa', '#c4b5fd'], glow: '#7c3aed' },
  '🧙': { colors: ['#7c3aed', '#6366f1'], particles: ['#8b5cf6', '#818cf8', '#a78bfa'], glow: '#7c3aed' },
  '🦸': { colors: ['#ef4444', '#3b82f6'], particles: ['#f87171', '#60a5fa', '#fb923c'], glow: '#ef4444' },
  '👸': { colors: ['#fbbf24', '#f59e0b'], particles: ['#fde68a', '#fbbf24', '#fcd34d'], glow: '#fbbf24' },
  '🤴': { colors: ['#f59e0b', '#f97316'], particles: ['#fbbf24', '#fb923c', '#fdba74'], glow: '#f59e0b' },
  '🧛': { colors: ['#dc2626', '#374151'], particles: ['#ef4444', '#6b7280', '#991b1b'], glow: '#dc2626' },
  '🥷': { colors: ['#374151', '#111827'], particles: ['#4b5563', '#6b7280', '#1f2937'], glow: '#374151' },
}

const DEFAULT_BG_THEME = { colors: ['#10b981', '#06b6d4'], particles: ['#34d399', '#22d3ee', '#6ee7b7'], glow: '#10b981' }

function AnimatedAvatar({ avatar, size = 120, showExpression = true, className = '' }: {
  avatar: string
  size?: number
  showExpression?: boolean
  className?: string
}) {
  const theme = AVATAR_BG_THEMES[avatar] || DEFAULT_BG_THEME
  const emojiSize = Math.round(size * 0.6)

  // Generate floating particles
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 3 + Math.random() * 5,
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 70,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    color: theme.particles[i % theme.particles.length],
  }))

  return (
    <div
      className={`relative flex items-center justify-center animate-avatar-float ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 rounded-2xl animate-avatar-bg"
        style={{
          background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[0]})`,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Glow pulse behind */}
      <div
        className="absolute inset-0 rounded-2xl animate-avatar-glow-pulse"
        style={{
          boxShadow: `0 0 20px ${theme.glow}40, 0 0 40px ${theme.glow}20`,
        }}
      />

      {/* Floating particles */}
      {showExpression && particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-avatar-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Spinning ring accent */}
      {showExpression && (
        <div
          className="absolute inset-1 rounded-2xl animate-spin-slow opacity-20"
          style={{
            border: `2px dashed ${theme.colors[0]}`,
          }}
        />
      )}

      {/* Emoji avatar */}
      <span
        className="relative z-10 select-none animate-avatar-idle"
        style={{ fontSize: emojiSize, lineHeight: 1, filter: `drop-shadow(0 2px 8px ${theme.glow}60)` }}
      >
        {avatar}
      </span>
    </div>
  )
}

// ============================================
// ANIMATED FRAME COMPONENT (Enhanced)
// ============================================
function AnimatedFrame({ frame, size = 120, children }: { frame?: string; size?: number; children: React.ReactNode }) {
  if (!frame) {
    return <>{children}</>
  }

  const frameThemes: Record<string, { colors: string[]; pattern: string; glow: string; emoji: string }> = {
    '🔥': { colors: ['#EF4444', '#F97316', '#EAB308'], pattern: 'fire', glow: '#F97316', emoji: '🔥' },
    '❄️': { colors: ['#06B6D4', '#3B82F6', '#A78BFA'], pattern: 'ice', glow: '#06B6D4', emoji: '❄️' },
    '⭐': { colors: ['#EAB308', '#F59E0B', '#FBBF24'], pattern: 'stars', glow: '#EAB308', emoji: '⭐' },
    '💎': { colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'], pattern: 'diamond', glow: '#8B5CF6', emoji: '💎' },
    '👑': { colors: ['#EAB308', '#D97706', '#92400E'], pattern: 'royal', glow: '#D97706', emoji: '👑' },
    '🌈': { colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'], pattern: 'rainbow', glow: '#EC4899', emoji: '🌈' },
    '⚡': { colors: ['#EAB308', '#F59E0B', '#FDE68A'], pattern: 'electric', glow: '#F59E0B', emoji: '⚡' },
    '🌸': { colors: ['#EC4899', '#F472B6', '#FBCFE8'], pattern: 'sakura', glow: '#EC4899', emoji: '🌸' },
    '🌊': { colors: ['#06B6D4', '#0891B2', '#155E75'], pattern: 'wave', glow: '#0891B2', emoji: '🌊' },
    '🌿': { colors: ['#22C55E', '#16A34A', '#15803D'], pattern: 'nature', glow: '#22C55E', emoji: '🌿' },
    '🗡️': { colors: ['#9CA3AF', '#6B7280', '#D1D5DB'], pattern: 'blade', glow: '#9CA3AF', emoji: '🗡️' },
    '🛡️': { colors: ['#DC2626', '#991B1B', '#7F1D1D'], pattern: 'shield', glow: '#DC2626', emoji: '🛡️' },
    '🎭': { colors: ['#8B5CF6', '#EC4899', '#6366F1'], pattern: 'theater', glow: '#8B5CF6', emoji: '🎭' },
    '🎵': { colors: ['#06B6D4', '#8B5CF6', '#EC4899'], pattern: 'music', glow: '#8B5CF6', emoji: '🎵' },
    '💫': { colors: ['#FBBF24', '#F59E0B', '#D97706'], pattern: 'cosmic', glow: '#F59E0B', emoji: '💫' },
    '🦋': { colors: ['#8B5CF6', '#3B82F6', '#06B6D4'], pattern: 'butterfly', glow: '#3B82F6', emoji: '🦋' },
    '🏆': { colors: ['#EAB308', '#D97706', '#B45309'], pattern: 'champion', glow: '#D97706', emoji: '🏆' },
  }

  const theme = frameThemes[frame] || { colors: ['#EAB308', '#F97316', '#EF4444'], pattern: 'default', glow: '#F97316', emoji: frame }
  const borderSize = Math.max(8, size * 0.08)
  const totalSize = size + borderSize * 4

  // Generate orbit sparkle positions
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    delay: i * 0.25,
    size: 5 + Math.random() * 7,
  }))

  // Corner decorations
  const corners = [
    { x: 0, y: 0, rotate: 0 },
    { x: '100%', y: 0, rotate: 90 },
    { x: '100%', y: '100%', rotate: 180 },
    { x: 0, y: '100%', rotate: 270 },
  ]

  return (
    <div className="relative animate-frame-breathe" style={{ width: totalSize, height: totalSize }}>
      {/* Outer glow ring */}
      <div
        className="absolute -inset-3 rounded-3xl animate-frame-glow-pulse"
        style={{
          boxShadow: `0 0 30px ${theme.glow}30, 0 0 60px ${theme.glow}15, inset 0 0 30px ${theme.glow}10`,
        }}
      />

      {/* Main frame border with animated conic gradient */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {/* Rotating conic gradient border */}
        <div
          className="absolute inset-0 animate-frame-rotate"
          style={{
            background: `conic-gradient(from 0deg, ${theme.colors.join(', ')}, ${theme.colors[0]})`,
          }}
        />
        {/* Inner cutout */}
        <div
          className="absolute rounded-xl bg-background"
          style={{ inset: borderSize * 1.5 }}
        />
      </div>

      {/* Second animated border layer - pulsing colors */}
      <div
        className="absolute rounded-2xl animate-frame-dance"
        style={{
          inset: 2,
          border: `3px solid ${theme.colors[0]}`,
          opacity: 0.6,
        }}
      />

      {/* Orbit sparkles around the frame */}
      {sparkles.map((sparkle, i) => {
        const rad = (sparkle.angle * Math.PI) / 180
        const cx = 50 + 48 * Math.cos(rad)
        const cy = 50 + 48 * Math.sin(rad)
        return (
          <div
            key={i}
            className="absolute animate-frame-sparkle"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${sparkle.delay}s`,
              color: theme.colors[i % theme.colors.length],
              fontSize: sparkle.size,
              textShadow: `0 0 8px ${theme.colors[i % theme.colors.length]}`,
            }}
          >
            ✦
          </div>
        )
      })}

      {/* Animated corner decorations */}
      {corners.map((corner, i) => (
        <div
          key={i}
          className="absolute animate-frame-sparkle"
          style={{
            left: corner.x === 0 ? -4 : corner.x === '100%' ? undefined : corner.x,
            right: corner.x === '100%' ? -4 : undefined,
            top: corner.y === 0 ? -4 : corner.y === '100%' ? undefined : corner.y,
            bottom: corner.y === '100%' ? -4 : undefined,
            transform: `rotate(${corner.rotate}deg)`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M0,0 L20,0 L20,6 L6,6 L6,20 L0,20 Z" fill={theme.colors[i % theme.colors.length]} opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* Frame emoji badge - LARGE and prominent */}
      <div
        className="absolute -bottom-3 -right-3 z-30 animate-avatar-bounce"
        style={{ fontSize: Math.max(28, size * 0.28) }}
      >
        <div
          className="rounded-full p-1.5 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
            boxShadow: `0 0 15px ${theme.glow}50, 0 0 30px ${theme.glow}25`,
            border: `2px solid ${theme.colors[2] || theme.colors[0]}80`,
          }}
        >
          {frame}
        </div>
      </div>

      {/* Inner content area */}
      <div className="absolute rounded-xl overflow-hidden" style={{ inset: borderSize * 2 }}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// LOGIN SCREEN
// ============================================
function LoginScreen() {
  const [email, setEmail] = useState('demo@wisdomquest.com')
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
        className="glass rounded-3xl p-4 sm:p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl sm:text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Wisdom Quest
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
              placeholder="demo@wisdomquest.com"
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
            <span>👤 Player: demo@wisdomquest.com</span>
            <span>🔑 demo123</span>
          </div>
          <div className="flex gap-4 justify-center text-xs text-muted-foreground mt-1">
            <span>🛡️ Admin: admin@wisdomquest.com</span>
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
              Wisdom Quest
            </span>
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-1.5 sm:gap-4 overflow-x-auto scrollbar-hide">
            {/* Streak */}
            <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Icons.flame size={16} className="text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{user.streak}</span>
            </div>

            {/* Energy */}
            <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-sm">⚡</span>
              <span className="text-sm font-bold text-cyan-400">{user.energy ?? 100}</span>
            </div>

            {/* Lives */}
            <div className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border ${
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
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-black text-emerald-400">XP</span>
              <span className="text-sm font-bold text-emerald-400">{user.xp}</span>
              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
                <div className="xp-bar h-full rounded-full" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Icons.coin size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">{user.coins}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => store.setState({ soundEnabled: !soundEnabled })}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hidden sm:flex"
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
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2.5">
        {navItems.map((item) => {
          const isActive = currentView === item.view || (item.view === 'dashboard' && currentView === 'scenario-map')
          return (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`flex flex-col items-center gap-1 px-3 py-2.5 sm:px-4 rounded-xl transition-all ${
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
            className={`flex flex-col items-center gap-1 px-3 py-2.5 sm:px-4 rounded-xl transition-all ${
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
        className="glass rounded-2xl p-4 sm:p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
              <AnimatedAvatar avatar={user?.avatar || '🎯'} size={56} showExpression={true} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Welcome back, {user?.name}!</h2>
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
              className={`card-premium rounded-2xl p-4 sm:p-6 text-left relative overflow-hidden ${
                isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } bg-gradient-card border ${colors.border} shadow-lg ${colors.glow}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.from} ${colors.to} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="text-3xl sm:text-4xl mb-3">{level.icon}</div>
              <h4 className={`text-lg sm:text-xl font-bold ${colors.text}`}>{level.name}</h4>
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
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: '⚔️', label: 'Battle', view: 'battle' as ViewName, color: 'from-red-500 to-orange-600' },
          { icon: '📖', label: 'Readings', view: 'readings' as ViewName, color: 'from-teal-500 to-cyan-600' },
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

      {/* Mini Juegos */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">🎮 Mini Juegos</h3>
        <p className="text-xs text-muted-foreground mb-3">Espera a que el reloj llegue a cero para jugar</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🎁', label: 'Cajas Sorpresa', gameType: 'boxes', gradient: 'from-yellow-500/10 to-amber-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
            { icon: '🎡', label: 'Rueda', gameType: 'wheel', gradient: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
            { icon: '🧠', label: 'Memoria', gameType: 'memory', gradient: 'from-cyan-500/10 to-teal-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
            { icon: '⚡', label: 'Trivia', gameType: 'trivia', gradient: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
          ].map((game, i) => (
            <motion.button
              key={game.gameType}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => useAppStore.getState().activateMiniGame(game.gameType)}
              className={`glass rounded-xl p-4 text-center hover:bg-secondary/50 transition-all border ${game.border} relative bg-gradient-to-br ${game.gradient}`}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="text-2xl block"
              >
                {game.icon}
              </motion.span>
              <p className={`text-xs font-medium mt-2 ${game.text}`}>{game.label}</p>
              {user?.role !== 'admin' && (
                <span className="absolute top-1 right-1 text-[10px] animate-avatar-bounce">⏰</span>
              )}
            </motion.button>
          ))}
        </div>
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
        <span className="text-4xl sm:text-5xl mb-3 block">{currentLevel?.icon}</span>
        <h2 className="text-xl sm:text-2xl font-bold">{currentLevel?.name}</h2>
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
              className="glass rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
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
  const matchConceptsState = useRef<{ questionId: string; selectedLeft: string | null; matches: Record<string, string> } | null>(null)
  const [matchConceptsKey, setMatchConceptsKey] = useState(0)

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
    matchConceptsState.current = null
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
          className="glass rounded-3xl p-4 sm:p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {exerciseStars >= 3 ? '🌟' : exerciseStars >= 2 ? '⭐' : exerciseStars >= 1 ? '👍' : '💪'}
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-bold mb-2">
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

          <div className="grid grid-cols-3 gap-2 sm:gap-4 my-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">+{exerciseXpEarned}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-xl sm:text-2xl font-bold text-cyan-400">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <p className="text-xl sm:text-2xl font-bold text-pink-400">{correctCount}/{totalCount}</p>
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

      case 'match_concepts': {
        // Parse options like "A-Apple" into left/right pairs
        const options = parseQuestionOptions(q.options)
        const pairs = options.map(opt => {
          const sepIndex = opt.indexOf('-')
          return { left: sepIndex >= 0 ? opt.substring(0, sepIndex) : opt, right: sepIndex >= 0 ? opt.substring(sepIndex + 1) : opt }
        })
        const leftItems = pairs.map(p => p.left)
        const rightItems = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)

        // We use a ref for match selections to persist across re-renders of the same question
        // Initialize match state
        if (!matchConceptsState.current || matchConceptsState.current.questionId !== q.id) {
          matchConceptsState.current = {
            questionId: q.id,
            selectedLeft: null as string | null,
            matches: {} as Record<string, string>,
          }
        }
        const mState = matchConceptsState.current

        // Handle left item click
        const handleLeftClick = (left: string) => {
          if (showResult) return
          mState.selectedLeft = left
          // Force re-render by updating a dummy state
          setMatchConceptsKey(prev => prev + 1)
        }

        // Handle right item click
        const handleRightClick = (right: string) => {
          if (showResult || !mState.selectedLeft) return
          // Remove any existing match for this right item
          Object.keys(mState.matches).forEach(key => {
            if (mState.matches[key] === right) delete mState.matches[key]
          })
          mState.matches[mState.selectedLeft] = right
          mState.selectedLeft = null
          setMatchConceptsKey(prev => prev + 1)

          // Check if all matched
          const allNowMatched = leftItems.every(left => mState.matches[left])
          if (allNowMatched) {
            // Build answer string in correct order matching correctAnswer format
            const answerParts = leftItems.map(left => mState.matches[left])
            handleAnswer(answerParts.join(' '))
          }
        }

        // Get matched right for a left item
        const getMatchedRight = (left: string) => mState.matches[left] || null
        // Get matched left for a right item
        const getMatchedLeft = (right: string) => {
          const found = Object.entries(mState.matches).find(([, v]) => v === right)
          return found ? found[0] : null
        }

        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground text-center">Toca un elemento de la izquierda y luego su par de la derecha</p>
            <div className="flex gap-3">
              {/* Left column */}
              <div className="flex-1 space-y-2">
                {leftItems.map((left) => {
                  const isSelected = mState.selectedLeft === left
                  const matchedRight = getMatchedRight(left)
                  const isMatched = !!matchedRight
                  return (
                    <motion.button
                      key={left}
                      whileHover={!showResult && !isMatched ? { scale: 1.03 } : {}}
                      whileTap={!showResult && !isMatched ? { scale: 0.97 } : {}}
                      onClick={() => !isMatched && handleLeftClick(left)}
                      disabled={showResult}
                      className={`w-full p-3 rounded-xl text-center font-medium text-sm transition-all ${
                        showResult
                          ? isMatched && pairs.find(p => p.left === left && p.right === matchedRight)
                            ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                            : 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
                          : isSelected
                            ? 'bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/20'
                            : isMatched
                              ? 'bg-purple-500/15 border-2 border-purple-500/30 text-purple-300'
                              : 'glass border border-border hover:border-cyan-500/30'
                      }`}
                    >
                      <div>{left}</div>
                      {isMatched && !showResult && (
                        <div className="text-[10px] mt-1 opacity-70">↔ {matchedRight}</div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Right column */}
              <div className="flex-1 space-y-2">
                {rightItems.map((right) => {
                  const matchedLeft = getMatchedLeft(right)
                  const isMatched = !!matchedLeft
                  const isCorrectPair = matchedLeft && pairs.find(p => p.left === matchedLeft && p.right === right)
                  return (
                    <motion.button
                      key={right}
                      whileHover={!showResult && !isMatched && mState.selectedLeft ? { scale: 1.03 } : {}}
                      whileTap={!showResult && !isMatched && mState.selectedLeft ? { scale: 0.97 } : {}}
                      onClick={() => handleRightClick(right)}
                      disabled={showResult || isMatched || !mState.selectedLeft}
                      className={`w-full p-3 rounded-xl text-center font-medium text-sm transition-all ${
                        showResult
                          ? isCorrectPair
                            ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                            : isMatched
                              ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
                              : 'glass border border-border opacity-50'
                          : isMatched
                            ? 'bg-purple-500/15 border-2 border-purple-500/30 text-purple-300'
                            : mState.selectedLeft
                              ? 'glass border border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer'
                              : 'glass border border-border opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {right}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Hint for matching */}
            {!showResult && q.hintEs && (
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground opacity-50">💡 {q.hintEs}</p>
              </div>
            )}

            {/* Show result feedback */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-center ${
                  isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <p className={`text-sm font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? '✅ ¡Correcto!' : '❌ Intenta de nuevo'}
                </p>
                {!isCorrect && q.explanationEs && (
                  <p className="text-xs text-muted-foreground mt-1">{q.explanationEs}</p>
                )}
              </motion.div>
            )}
          </div>
        )
      }
      default: {
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
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 glass border-b border-border/50 p-2 sm:p-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2 sm:gap-3 flex-wrap">
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
            className={`hidden sm:flex px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              speechSpeed === 'slow'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-secondary text-muted-foreground border border-border hover:bg-secondary/80'
            }`}
          >
            {speechSpeed === 'slow' ? '🐢 Slow' : '🐇 Normal'}
          </motion.button>

          {/* Voice selector */}
          <div className="relative hidden sm:block">
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
                  className="absolute right-0 top-full mt-2 w-56 sm:w-64 rounded-xl bg-popover border border-border shadow-xl z-50 overflow-hidden"
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
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">🏆 Rankings</h2>

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
              <span className="text-2xl">
                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <AnimatedAvatar avatar={r.avatar || '🎯'} size={32} showExpression={false} />
                </div>
              </span>
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
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">📊 Statistics</h2>

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
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">📋 Missions</h2>
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
          <span className="text-4xl sm:text-5xl block mb-4">📋</span>
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
        className="glass rounded-2xl p-4 sm:p-6 text-center mb-6"
      >
        {/* Avatar with Animated Frame */}
        <div className="mx-auto mb-4 flex justify-center">
          <AnimatedFrame frame={user.frame} size={140}>
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <AnimatedAvatar avatar={user.avatar} size={130} showExpression={true} />
            </div>
          </AnimatedFrame>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">{user.name}</h2>
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
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
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
              <span className="text-4xl sm:text-5xl block mb-4">🎒</span>
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
  const buyLives = useAppStore((s) => s.buyLives)
  const buyEnergy = useAppStore((s) => s.buyEnergy)
  const buyCoinPack = useAppStore((s) => s.buyCoinPack)
  const buyReadingPack = useAppStore((s) => s.buyReadingPack)
  const [activeTab, setActiveTab] = useState<string>('cosmeticos')
  const [shopFilter, setShopFilter] = useState<string>('all')
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [watchingVideo, setWatchingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)

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

  const shopTypes = ['all', 'avatar', 'frame']

  const filteredItems = shopFilter === 'all'
    ? shopItems.filter((item) => item.type !== 'title')
    : shopItems.filter((item) => item.type === shopFilter && item.type !== 'title')

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

  const handleWatchVideo = (coinAmount: number) => {
    if (watchingVideo) return
    setWatchingVideo(true)
    setVideoProgress(0)
    const duration = 3000
    const interval = 50
    const steps = duration / interval
    let step = 0
    const timer = setInterval(() => {
      step++
      setVideoProgress(Math.min((step / steps) * 100, 100))
      if (step >= steps) {
        clearInterval(timer)
        buyCoinPack(coinAmount)
        playSound('reward')
        setSuccessMsg(`¡Ganaste ${coinAmount} monedas! 🎉`)
        setWatchingVideo(false)
        setVideoProgress(0)
      }
    }, interval)
  }

  // Show success message briefly
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  const tabs = [
    { id: 'cosmeticos', label: '💄 Cosméticos', icon: '💄' },
    { id: 'vidas', label: '❤️ Vidas', icon: '❤️' },
    { id: 'energia', label: '⚡ Energía', icon: '⚡' },
    { id: 'monedas', label: '🪙 Monedas', icon: '🪙' },
    { id: 'lecturas', label: '📖 Lecturas', icon: '📖' },
  ]

  const livesPacks = [
    { amount: 5, cost: 1000, label: '5 Vidas', icon: '❤️' },
    { amount: 10, cost: 1800, label: '10 Vidas', icon: '❤️‍🔥' },
    { amount: 15, cost: 2500, label: '15 Vidas', icon: '💖' },
    { amount: 20, cost: 3000, label: '20 Vidas', icon: '💘' },
  ]

  const coinPacks = [
    { amount: 1000, label: '1,000 Monedas', icon: '🪙' },
    { amount: 3000, label: '3,000 Monedas', icon: '💰' },
    { amount: 5000, label: '5,000 Monedas', icon: '💎' },
    { amount: 10000, label: '10,000 Monedas', icon: '👑' },
  ]

  const readingPacks = [
    { level: 'basic', label: 'Lectura Básico', icon: '🌱', cost: 1000 },
    { level: 'intermediate', label: 'Lectura Intermedio', icon: '🔥', cost: 1500 },
    { level: 'advanced', label: 'Lectura Avanzado', icon: '🧠', cost: 2000 },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">🛍️ Tienda</h2>
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

      {/* Main tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-secondary/50 text-muted-foreground border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cosméticos tab */}
      {activeTab === 'cosmeticos' && (
        <>
          {/* Sub-filter for cosmetics */}
          <div className="flex gap-2 mb-4">
            {shopTypes.map((type) => (
              <button
                key={type}
                onClick={() => setShopFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  shopFilter === type
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-secondary/50 text-muted-foreground border border-transparent'
                }`}
              >
                {type === 'all' ? '📦 Todos' : type === 'avatar' ? '👤 Avatares' : '🖼️ Marcos'}
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
              <span className="text-4xl sm:text-5xl block mb-4">🛍️</span>
              <p className="text-muted-foreground">No hay artículos disponibles</p>
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

                    <span className="text-3xl sm:text-4xl block mb-2">{item.icon}</span>
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
                        {equipped ? '✓ Equipado' : 'Equipar'}
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
        </>
      )}

      {/* Vidas tab */}
      {activeTab === 'vidas' && (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <span className="text-3xl sm:text-4xl">❤️</span>
            <p className="text-sm text-muted-foreground mt-2">Compra vidas para seguir jugando</p>
            <p className="text-xs text-muted-foreground">Vidas actuales: <span className="text-red-400 font-bold">{user?.lives || 0}</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {livesPacks.map((pack, i) => {
              const canAfford = (user?.coins || 0) >= pack.cost
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={canAfford ? { scale: 1.05 } : {}}
                  whileTap={canAfford ? { scale: 0.95 } : {}}
                  onClick={() => { buyLives(pack.amount); playSound('reward'); setSuccessMsg(`¡Compraste ${pack.amount} vidas!`) }}
                  disabled={!canAfford}
                  className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-3xl block mb-2">{pack.icon}</span>
                  <p className="font-bold text-sm text-red-400">{pack.label}</p>
                  <div className="mt-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold inline-block">
                    {pack.cost} 🪙
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* Energía tab */}
      {activeTab === 'energia' && (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <span className="text-4xl sm:text-5xl block mb-3">⚡</span>
            <h3 className="text-lg font-bold">Recargar Energía</h3>
            <p className="text-sm text-muted-foreground">Recupera energía para seguir aprendiendo</p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={(user?.coins || 0) >= 500 ? { scale: 1.03 } : {}}
            whileTap={(user?.coins || 0) >= 500 ? { scale: 0.97 } : {}}
            onClick={() => { buyEnergy(); playSound('reward'); setSuccessMsg('¡Energía recargada! ⚡') }}
            disabled={(user?.coins || 0) < 500}
            className="w-full p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-4xl sm:text-5xl block mb-3">⚡</span>
            <p className="font-bold text-cyan-400">Recarga Completa</p>
            <p className="text-xs text-muted-foreground mt-1">Recupera toda tu energía</p>
            <div className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-bold inline-block">
              500 🪙
            </div>
          </motion.button>
        </div>
      )}

      {/* Monedas tab */}
      {activeTab === 'monedas' && (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <span className="text-3xl sm:text-4xl">🪙</span>
            <p className="text-sm text-muted-foreground mt-2">¡Gana monedas gratis viendo un video!</p>
          </div>
          {watchingVideo && (
            <div className="mb-4 p-4 rounded-xl glass border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-yellow-400">Viendo video...</p>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${videoProgress}%` }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {coinPacks.map((pack, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={!watchingVideo ? { scale: 1.05 } : {}}
                whileTap={!watchingVideo ? { scale: 0.95 } : {}}
                onClick={() => handleWatchVideo(pack.amount)}
                disabled={watchingVideo}
                className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="text-3xl block mb-2">{pack.icon}</span>
                <p className="font-bold text-sm text-yellow-400">{pack.label}</p>
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold inline-block">
                  🎬 Ver Video
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Lecturas tab - EXCLUSIVE shop readings */}
      {activeTab === 'lecturas' && (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <span className="text-3xl sm:text-4xl">📚</span>
            <p className="text-sm text-muted-foreground mt-2">Lecturas exclusivas de la tienda</p>
            <p className="text-xs text-muted-foreground">Historias diferentes que solo encuentras aquí</p>
          </div>
          <div className="space-y-3">
            {(() => {
              const shopReadings = useAppStore.getState().shopReadings;
              const purchasedShopReadings = useAppStore.getState().purchasedShopReadings;
              const buyShopReading = useAppStore.getState().buyShopReading;
              const isShopReadingUnlocked = useAppStore.getState().isShopReadingUnlocked;
              const levelColors: Record<string, string> = {
                basic: 'border-emerald-500/30 bg-emerald-500/5',
                intermediate: 'border-orange-500/30 bg-orange-500/5',
                advanced: 'border-purple-500/30 bg-purple-500/5',
              };
              const levelText: Record<string, string> = {
                basic: 'text-emerald-400',
                intermediate: 'text-orange-400',
                advanced: 'text-purple-400',
              };
              const levelIcons: Record<string, string> = {
                basic: '🌱',
                intermediate: '🔥',
                advanced: '🧠',
              };
              return shopReadings.map((reading, i) => {
                const unlocked = isShopReadingUnlocked(reading.id);
                const cost = reading.level === 'basic' ? 800 : reading.level === 'intermediate' ? 1200 : 1500;
                const canAfford = (user?.coins || 0) >= cost;
                return (
                  <motion.div
                    key={reading.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-full p-4 rounded-xl border text-left ${levelColors[reading.level]}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                        {unlocked ? '📖' : '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-sm ${levelText[reading.level]}`}>{reading.title}</p>
                          {unlocked && <span className="text-[10px] text-emerald-400 font-bold">✅</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{reading.titleEs}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">{levelIcons[reading.level]} {reading.level}</span>
                          <span className="text-[10px] text-emerald-400">+{reading.xpReward} XP</span>
                          <span className="text-[10px] text-cyan-400">❓ {reading.questions.length} preguntas</span>
                        </div>
                      </div>
                      {unlocked ? (
                        <span className="text-xs text-emerald-400 font-bold">Desbloqueada</span>
                      ) : (
                        <motion.button
                          whileHover={canAfford ? { scale: 1.05 } : {}}
                          whileTap={canAfford ? { scale: 0.95 } : {}}
                          onClick={() => { buyShopReading(reading.id); playSound('reward'); setSuccessMsg(`¡Lectura "${reading.title}" desbloqueada!`) }}
                          disabled={!canAfford}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          🔓 {cost} 🪙
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="mt-6 p-4 rounded-xl glass border border-border text-center">
        <p className="text-xs text-muted-foreground">
          💡 Gana monedas completando ejercicios. Equipa tus artículos en <button onClick={() => useAppStore.getState().navigate('profile')} className="text-emerald-400 hover:underline">Perfil → Mis Artículos</button>
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
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">🛡️ Admin Panel</h2>

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

              <div className="glass rounded-2xl p-4 sm:p-6 border border-border">
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
              <span className="text-3xl sm:text-4xl block mb-3">👥</span>
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
                    <div className="w-8 h-8 overflow-hidden rounded-full">
                      <AnimatedAvatar avatar={u.avatar || '👤'} size={32} showExpression={false} />
                    </div>
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
        <form onSubmit={handleCreateUser} className="glass rounded-2xl p-4 sm:p-6 border border-border">
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
// BATTLE VIEW
// ============================================
function BattleView() {
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)
  const battleQuestions = useAppStore((s) => s.battleQuestions)
  const battleCurrentIndex = useAppStore((s) => s.battleCurrentIndex)
  const battleScore = useAppStore((s) => s.battleScore)
  const battleTimeLeft = useAppStore((s) => s.battleTimeLeft)
  const battleIsActive = useAppStore((s) => s.battleIsActive)
  const battleOpponentScore = useAppStore((s) => s.battleOpponentScore)
  const battleOpponent = useAppStore((s) => s.battleOpponent)
  const startBattle = useAppStore((s) => s.startBattle)
  const answerBattleQuestion = useAppStore((s) => s.answerBattleQuestion)
  const nextBattleQuestion = useAppStore((s) => s.nextBattleQuestion)
  const endBattle = useAppStore((s) => s.endBattle)
  const resetBattle = useAppStore((s) => s.resetBattle)
  const playSound = useAppStore((s) => s.playSound)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timer, setTimer] = useState(10)
  const [isStarting, setIsStarting] = useState(false)

  // Handle answer submission (shared logic)
  const handleAnswer = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)
    answerBattleQuestion(answer)
  }

  // Timer countdown - only runs the interval
  useEffect(() => {
    if (!battleIsActive || showResult) return
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [battleIsActive, showResult, battleCurrentIndex])

  const handleStartBattle = async () => {
    setIsStarting(true)
    try {
      await startBattle()
      setTimer(10)
    } catch (err) {
      console.error(err)
    }
    setIsStarting(false)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setTimer(10)
    nextBattleQuestion()
  }

  // Battle complete
  if (battleQuestions.length > 0 && battleCurrentIndex >= battleQuestions.length) {
    const won = battleScore > battleOpponentScore
    const tied = battleScore === battleOpponentScore
    const totalQuestions = battleQuestions.length
    const playerCorrect = battleScore
    const playerWrong = totalQuestions - playerCorrect
    const opponentCorrect = battleOpponentScore
    const opponentWrong = totalQuestions - opponentCorrect
    const playerAccuracy = totalQuestions > 0 ? Math.round((playerCorrect / totalQuestions) * 100) : 0
    const opponentAccuracy = totalQuestions > 0 ? Math.round((opponentCorrect / totalQuestions) * 100) : 0

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-4 sm:p-8"
        >
          {/* Fun result animation */}
          <motion.div
            animate={{ rotate: won ? [0, -10, 10, -10, 0] : [0, 0], scale: won ? [1, 1.2, 1] : [1, 0.9, 1] }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-7xl block mb-4">{won ? '🏆' : tied ? '🤝' : '😅'}</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            {won ? '¡VICTORIA!' : tied ? '¡EMPATE!' : '¡BUENA BATALLA!'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {won ? '¡Derrotaste a tu oponente! Eres increíble 🎉' : tied ? '¡Quedaron iguales! Intenta de nuevo 💪' : 'Tu oponente fue más rápido esta vez 😢'}
          </p>

          {/* Detailed Score Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Player stats */}
            <div className={`p-4 rounded-xl ${won ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-secondary border border-border'}`}>
              <div className="mx-auto mb-2 w-14 h-14 rounded-full overflow-hidden">
                <AnimatedAvatar avatar={user?.avatar || '🎯'} size={56} showExpression={won} />
              </div>
              <p className="text-sm font-bold mb-3">{user?.name}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-muted-foreground">✅ Correctas</span>
                  <span className="text-lg font-black text-emerald-400">{playerCorrect}</span>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-muted-foreground">❌ Incorrectas</span>
                  <span className="text-lg font-black text-red-400">{playerWrong}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${playerAccuracy}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{playerAccuracy}% precisión</p>
              </div>
            </div>

            {/* Opponent stats */}
            <div className={`p-4 rounded-xl ${!won ? 'bg-red-500/10 border border-red-500/30' : 'bg-secondary border border-border'}`}>
              <div className="mx-auto mb-2 w-14 h-14 rounded-full overflow-hidden">
                <AnimatedAvatar avatar="🤖" size={56} showExpression={!won} />
              </div>
              <p className="text-sm font-bold mb-3">{battleOpponent?.name || 'Oponente'}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-muted-foreground">✅ Correctas</span>
                  <span className="text-lg font-black text-emerald-400">{opponentCorrect}</span>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-muted-foreground">❌ Incorrectas</span>
                  <span className="text-lg font-black text-red-400">{opponentWrong}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${opponentAccuracy}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{opponentAccuracy}% precisión</p>
              </div>
            </div>
          </div>

          {/* VS Score */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-3xl font-black text-emerald-400">{playerCorrect}</span>
            <span className="text-lg font-bold text-muted-foreground">VS</span>
            <span className="text-3xl font-black text-red-400">{opponentCorrect}</span>
          </div>
          
          {/* Fun message based on score */}
          <p className="text-sm text-muted-foreground mb-6">
            {playerCorrect === totalQuestions ? '🌟 ¡PERFECTO! ¡Todas correctas! ¡Eres un maestro!' : 
             playerCorrect >= totalQuestions * 0.8 ? '🔥 ¡Casi perfecto! ¡Muy bien!' :
             playerCorrect >= totalQuestions * 0.6 ? '👍 ¡Buen trabajo! Puedes mejorar' :
             playerCorrect >= totalQuestions * 0.4 ? '💪 ¡Sigue practicando!' :
             playerCorrect >= 1 ? '📚 ¡Estudia más y vuelve!' :
             '😅 ¡No te rindas! La práctica hace al maestro'}
          </p>
          
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { resetBattle(); handleStartBattle() }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold"
            >
              ⚔️ Otra Batalla
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { resetBattle(); navigate('dashboard') }}
              className="px-6 py-3 rounded-xl bg-secondary border border-border font-bold"
            >
              🏠 Inicio
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Battle lobby
  if (!battleIsActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 sm:p-8 text-center"
        >
          <span className="text-5xl sm:text-6xl block mb-4">⚔️</span>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">¡Batalla de Inglés!</h2>
          <p className="text-muted-foreground mb-6">
            Responde 5 preguntas de selección lo más rápido posible. ¡Compite contra un oponente virtual!
          </p>
          
          {/* VS Display */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <AnimatedAvatar avatar={user?.avatar || '🎯'} size={56} showExpression={true} />
              </div>
              <p className="text-sm font-bold text-emerald-400">{user?.name || 'Tú'}</p>
              <p className="text-[10px] text-muted-foreground">Nivel {user?.currentLevelId === 'advanced' ? 'Avanzado' : user?.currentLevelId === 'intermediate' ? 'Intermedio' : 'Básico'}</p>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-red-400 animate-avatar-bounce">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                <AnimatedAvatar avatar="🤖" size={56} showExpression={true} />
              </div>
              <p className="text-sm font-bold text-red-400">Oponente</p>
              <p className="text-[10px] text-muted-foreground">Virtual</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">5</p>
              <p className="text-xs text-muted-foreground">Preguntas</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-xl sm:text-2xl font-bold text-orange-400">10s</p>
              <p className="text-xs text-muted-foreground">Por pregunta</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">+25</p>
              <p className="text-xs text-muted-foreground">XP/Correcta</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartBattle}
            disabled={isStarting}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-red-500/25"
          >
            {isStarting ? '⏳ Buscando oponente...' : '⚔️ ¡A Batalla!'}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Active battle
  const currentQ = battleQuestions[battleCurrentIndex]
  if (!currentQ) return null
  const options = parseQuestionOptions(currentQ.options)
  const progressPercent = ((battleCurrentIndex) / battleQuestions.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Battle header with VS */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 overflow-hidden">
            <AnimatedAvatar avatar={user?.avatar || '🎯'} size={40} showExpression={false} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{user?.name}</p>
            <span className="text-lg font-bold text-emerald-400">{battleScore}</span>
          </div>
        </div>
        <div className="text-center">
          <span className="text-xs text-muted-foreground font-bold">⚔️ VS</span>
          <div>
            <span className="text-[10px] text-muted-foreground">Pregunta {battleCurrentIndex + 1}/{battleQuestions.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{battleOpponent?.name || 'Oponente'}</p>
            <span className="text-lg font-bold text-red-400">{battleOpponentScore}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 overflow-hidden">
            <AnimatedAvatar avatar="🤖" size={40} showExpression={false} />
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(timer / 10) * 100}%` }}
            className={`h-full rounded-full transition-colors ${timer <= 3 ? 'bg-red-500' : timer <= 5 ? 'bg-orange-500' : 'bg-emerald-500'}`}
          />
        </div>
        <span className={`text-lg font-bold min-w-[40px] text-right ${timer <= 3 ? 'text-red-400' : timer <= 5 ? 'text-orange-400' : 'text-emerald-400'}`}>
          {timer}s
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-6">
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          className="xp-bar h-full rounded-full"
        />
      </div>

      {/* Question */}
      <motion.div
        key={battleCurrentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-4 sm:p-6 mb-4"
      >
        <p className="text-lg font-bold mb-2">{currentQ.prompt}</p>
        {currentQ.promptEs && <p className="text-sm text-muted-foreground mb-4">{currentQ.promptEs}</p>}
      </motion.div>

      {/* Options */}
      <div className="grid gap-3">
        {(options.length > 0 ? options : [currentQ.correctAnswer, ...Array(3).fill('')].filter(Boolean)).map((option, i) => {
          const isCorrect = option === currentQ.correctAnswer
          const isSelected = selectedAnswer === option
          let btnClass = 'glass border border-border hover:border-emerald-500/30'
          if (showResult) {
            if (isCorrect) btnClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            else if (isSelected && !isCorrect) btnClass = 'bg-red-500/20 border-red-500/50 text-red-400'
          }
          return (
            <motion.button
              key={i}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${btnClass}`}
            >
              {option}
            </motion.button>
          )
        })}
      </div>

      {/* Next button or Time's up */}
      {showResult ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold"
          >
            {battleCurrentIndex < battleQuestions.length - 1 ? 'Siguiente →' : 'Ver Resultado'}
          </motion.button>
        </motion.div>
      ) : timer === 0 && !selectedAnswer ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer('')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold"
          >
            ⏱️ ¡Se acabó el tiempo! Continuar
          </motion.button>
        </motion.div>
      ) : null}

      {/* Quit button */}
      <button
        onClick={() => { resetBattle(); navigate('dashboard') }}
        className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ✕ Salir de la batalla
      </button>
    </div>
  )
}

// ============================================
// READINGS VIEW
// ============================================
function ReadingsView() {
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)
  const readings = useAppStore((s) => s.readings)
  const currentReading = useAppStore((s) => s.currentReading)
  const loadReadings = useAppStore((s) => s.loadReadings)
  const selectReading = useAppStore((s) => s.selectReading)
  const unlockSpanishTranslation = useAppStore((s) => s.unlockSpanishTranslation)
  const unlockAudioReading = useAppStore((s) => s.unlockAudioReading)
  const showSpanishTranslation = useAppStore((s) => s.showSpanishTranslation)
  const setShowSpanishTranslation = useAppStore((s) => s.setShowSpanishTranslation)
  const unlockedSpanishReadings = useAppStore((s) => s.unlockedSpanishReadings)
  const unlockedAudioReadings = useAppStore((s) => s.unlockedAudioReadings)
  const answerReadingQuestion = useAppStore((s) => s.answerReadingQuestion)
  const playSound = useAppStore((s) => s.playSound)
  const addXp = useAppStore((s) => s.addXp)
  const speechSpeed = useAppStore((s) => s.speechSpeed)
  const speechVoiceIndex = useAppStore((s) => s.speechVoiceIndex)
  const buyReading = useAppStore((s) => s.buyReading)
  const isReadingUnlocked = useAppStore((s) => s.isReadingUnlocked)
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>({})
  const [showReadingResults, setShowReadingResults] = useState(false)
  const [readingCompleted, setReadingCompleted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const purchasedReadings = useAppStore((s) => s.purchasedReadings)
  const shopReadings = useAppStore((s) => s.shopReadings)
  const purchasedShopReadings = useAppStore((s) => s.purchasedShopReadings)
  const isShopReadingUnlocked = useAppStore((s) => s.isShopReadingUnlocked)
  const [selectedLevel, setSelectedLevel] = useState<string>('basic')
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all')

  useEffect(() => {
    loadReadings()
  }, [loadReadings])

  const handleAnswerQuestion = (qIndex: number, aIndex: number) => {
    if (readingCompleted) return
    setReadingAnswers(prev => ({ ...prev, [qIndex]: aIndex }))
  }

  const handleCheckAnswers = () => {
    if (!currentReading) return
    let correct = 0
    currentReading.questions.forEach((q, i) => {
      if (readingAnswers[i] === q.correctAnswer) correct++
    })
    const xpEarned = correct * 10
    addXp(xpEarned)
    if (correct === currentReading.questions.length) playSound('reward')
    else if (correct > 0) playSound('correct')
    else playSound('wrong')
    setShowReadingResults(true)
    setReadingCompleted(true)
  }

  const handleSpeakPassage = () => {
    if (!currentReading) return
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(currentReading.passage)
      u.lang = 'en-US'
      u.rate = speechSpeed === 'slow' ? 0.6 : 0.9
      const voices = speechSynthesis.getVoices()
      const engVoices = voices.filter(v => v.lang.startsWith('en'))
      if (engVoices.length > 0 && speechVoiceIndex >= 0 && speechVoiceIndex < engVoices.length) {
        u.voice = engVoices[speechVoiceIndex]
      }
      u.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(u)
      setIsSpeaking(true)
    }
  }

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const hasAudio = currentReading ? unlockedAudioReadings.includes(currentReading.id) : false
  const hasSpanish = currentReading ? unlockedSpanishReadings.includes(currentReading.id) : false

  // Reading detail view
  if (currentReading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { selectReading(null); setShowReadingResults(false); setReadingCompleted(false); setReadingAnswers({}); handleStopSpeaking() }}
            className="p-2 rounded-xl hover:bg-secondary"
          >
            <Icons.arrowLeft size={20} />
          </motion.button>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{currentReading.title}</h2>
            <p className="text-xs text-muted-foreground">{currentReading.titleEs} • Nivel: {currentReading.level}</p>
          </div>
        </div>

        {/* Passage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 sm:p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">📖 Passage</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {/* Audio button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={hasAudio ? (isSpeaking ? handleStopSpeaking : handleSpeakPassage) : () => unlockAudioReading(currentReading.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  hasAudio ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                }`}
              >
                {hasAudio ? (isSpeaking ? '⏹️ Detener Lectura' : '🔊 Escuchar Lectura') : '🔒 Audio (250 🪙)'}
              </motion.button>
              {/* Spanish toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (hasSpanish) {
                    setShowSpanishTranslation(!showSpanishTranslation)
                  } else {
                    unlockSpanishTranslation(currentReading.id)
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  hasSpanish ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                }`}
              >
                {hasSpanish ? (showSpanishTranslation ? '🇬🇧 English' : '🇪🇸 Español') : '🔒 Traducción (200 🪙)'}
              </motion.button>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            {showSpanishTranslation && hasSpanish ? currentReading.passageEs : currentReading.passage}
          </p>
        </motion.div>

        {/* Questions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">❓ Comprensión</h3>
          {currentReading.questions.map((q, qIndex) => {
            const userAnswer = readingAnswers[qIndex]
            const isCorrect = showReadingResults && userAnswer === q.correctAnswer
            const isWrong = showReadingResults && userAnswer !== undefined && userAnswer !== q.correctAnswer
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIndex * 0.1 }}
                className={`glass rounded-xl p-4 border ${
                  isCorrect ? 'border-emerald-500/50' : isWrong ? 'border-red-500/50' : 'border-border'
                }`}
              >
                <p className="font-medium text-sm mb-2">{q.question}</p>
                <p className="text-xs text-muted-foreground mb-3">{q.questionEs}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIndex) => {
                    const isSelected = userAnswer === oIndex
                    const showCorrect = showReadingResults && oIndex === q.correctAnswer
                    let optClass = 'p-2 rounded-lg text-xs font-medium border border-border hover:border-emerald-500/30 transition-all'
                    if (showCorrect) optClass = 'p-2 rounded-lg text-xs font-medium border border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    else if (isSelected && isWrong) optClass = 'p-2 rounded-lg text-xs font-medium border border-red-500/50 bg-red-500/10 text-red-400'
                    else if (isSelected && !showReadingResults) optClass = 'p-2 rounded-lg text-xs font-medium border border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerQuestion(qIndex, oIndex)}
                        disabled={readingCompleted}
                        className={optClass}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {showReadingResults && (
                  <p className={`text-xs mt-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isCorrect ? '✅ ' : '❌ '}{q.explanationEs || q.explanation}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Check answers button */}
        {!readingCompleted && Object.keys(readingAnswers).length === currentReading.questions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckAnswers}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold"
            >
              ✅ Verificar Respuestas
            </motion.button>
          </motion.div>
        )}

        {readingCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { selectReading(null); setShowReadingResults(false); setReadingCompleted(false); setReadingAnswers({}); handleStopSpeaking() }}
              className="px-6 py-3 rounded-xl bg-secondary border border-border font-bold"
            >
              📖 Más Lecturas
            </motion.button>
          </motion.div>
        )}
      </div>
    )
  }

  // Readings list - organized by level with purchase system
  const difficultyIcon: Record<number, string> = { 1: '🟢', 2: '🟢', 3: '🟡', 4: '🔴', 5: '🔴' }
  const levels = ['basic', 'intermediate', 'advanced'] as const
  const levelConfig: Record<string, { label: string; icon: string; color: string; borderColor: string; bgColor: string; textColor: string }> = {
    basic: { label: 'Básico', icon: '🌱', color: 'emerald', borderColor: 'border-emerald-500/30', bgColor: 'bg-emerald-500/5', textColor: 'text-emerald-400' },
    intermediate: { label: 'Intermedio', icon: '🔥', color: 'orange', borderColor: 'border-orange-500/30', bgColor: 'bg-orange-500/5', textColor: 'text-orange-400' },
    advanced: { label: 'Avanzado', icon: '🧠', color: 'purple', borderColor: 'border-purple-500/30', bgColor: 'bg-purple-500/5', textColor: 'text-purple-400' },
  }

  const filteredReadings = readings.filter(r => r.level === selectedLevel)
  const myReadings = filteredReadings.filter(r => isReadingUnlocked(r.id))
  const myShopReadings = shopReadings.filter(r => isShopReadingUnlocked(r.id))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="text-4xl sm:text-5xl block mb-3">📖</span>
        <h2 className="text-xl sm:text-2xl font-bold">Lecturas en Inglés</h2>
        <p className="text-muted-foreground text-sm">Mejora tu comprensión leyendo textos reales</p>
      </motion.div>

      {/* Tab selector: Todas / Mis Lecturas */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-secondary/50 text-muted-foreground border border-transparent'
          }`}
        >
          📚 Todas
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'mine'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-secondary/50 text-muted-foreground border border-transparent'
          }`}
        >
          📗 Mis Lecturas {myReadings.length > 0 && <span className="text-[10px] opacity-70">({myReadings.length})</span>}
        </button>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 mb-4">
        {levels.map((level) => {
          const cfg = levelConfig[level]
          return (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedLevel === level
                  ? `${cfg.bgColor} ${cfg.borderColor} border ${cfg.textColor}`
                  : 'bg-secondary/50 text-muted-foreground border border-transparent'
              }`}
            >
              {cfg.icon} {cfg.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'mine' ? (
        /* My Purchased Readings */
        <div className="space-y-3">
          {myReadings.length === 0 && myShopReadings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-3xl sm:text-4xl block mb-2">🔒</span>
              <p className="text-sm">Aún no tienes lecturas desbloqueadas</p>
              <p className="text-xs mt-1">La primera lectura de cada nivel es gratis 🎉</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('all')}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
              >
                Ver lecturas disponibles
              </motion.button>
            </div>
          ) : (
            <>
              {/* Regular readings */}
              {myReadings.map((reading, i) => {
                const cfg = levelConfig[reading.level] || levelConfig.basic
                const hasAudioForReading = unlockedAudioReadings.includes(reading.id)
                const hasSpanishForReading = unlockedSpanishReadings.includes(reading.id)
                return (
                  <motion.div
                    key={reading.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${cfg.borderColor} ${cfg.bgColor}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                        📖
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{reading.title}</h4>
                        <p className="text-xs text-muted-foreground">{reading.titleEs}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase ${cfg.textColor}`}>
                            {reading.level}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {difficultyIcon[reading.difficulty]} {reading.questions.length} preguntas
                          </span>
                          <span className="text-[10px] text-emerald-400">+{reading.xpReward} XP</span>
                          {hasAudioForReading && <span className="text-[10px] text-cyan-400">🔊 Audio</span>}
                          {hasSpanishForReading && <span className="text-[10px] text-teal-400">🇪🇸 Traducción</span>}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectReading(reading.id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20"
                      >
                        Leer →
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
              {/* Shop exclusive readings */}
              {myShopReadings.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mt-4 mb-2">
                    <span className="text-xs font-bold text-yellow-400">✨ Exclusivas de Tienda</span>
                    <div className="flex-1 h-px bg-yellow-500/20" />
                  </div>
                  {myShopReadings.map((reading, i) => {
                    const cfg = levelConfig[reading.level] || levelConfig.basic
                    return (
                      <motion.div
                        key={reading.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (myReadings.length + i) * 0.05 }}
                        className={`w-full p-4 rounded-xl border text-left transition-all border-yellow-500/20 bg-yellow-500/5`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">
                            📚
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-yellow-300">{reading.title}</h4>
                              <span className="text-[10px] text-yellow-400 font-bold">⭐</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{reading.titleEs}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`text-[10px] font-bold uppercase ${cfg.textColor}`}>
                                {reading.level}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {difficultyIcon[reading.difficulty]} {reading.questions.length} preguntas
                              </span>
                              <span className="text-[10px] text-emerald-400">+{reading.xpReward} XP</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => selectReading(reading.id)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-yellow-500/20"
                          >
                            Leer →
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </>
          )}
        </div>
      ) : (
        /* All Readings - with purchase system */
        <div className="space-y-3">
          {filteredReadings.map((reading, i) => {
            const cfg = levelConfig[reading.level] || levelConfig.basic
            const unlocked = isReadingUnlocked(reading.id)
            const isFirst = i === 0
            const hasAudioForReading = unlockedAudioReadings.includes(reading.id)
            const hasSpanishForReading = unlockedSpanishReadings.includes(reading.id)

            return (
              <motion.div
                key={reading.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`w-full p-4 rounded-xl border text-left transition-all ${cfg.borderColor} ${cfg.bgColor}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl relative">
                    {unlocked ? '📖' : '🔒'}
                    {isFirst && unlocked && (
                      <span className="absolute -top-1 -right-1 text-[10px]">🆓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{reading.title}</h4>
                      {!unlocked && <Icons.lock size={14} className="text-yellow-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{reading.titleEs}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase ${cfg.textColor}`}>
                        {reading.level}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {difficultyIcon[reading.difficulty]} {reading.questions.length} preguntas
                      </span>
                      <span className="text-[10px] text-emerald-400">+{reading.xpReward} XP</span>
                      {hasAudioForReading && <span className="text-[10px] text-cyan-400">🔊 Audio</span>}
                      {hasSpanishForReading && <span className="text-[10px] text-teal-400">🇪🇸 Traducción</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {unlocked ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectReading(reading.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
                      >
                        Leer →
                      </motion.button>
                    ) : isFirst ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectReading(reading.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold"
                      >
                        🆓 Gratis
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => buyReading(reading.id)}
                        disabled={(user?.coins || 0) < 500}
                        className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        🔓 500 🪙
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {filteredReadings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <span className="text-3xl sm:text-4xl block mb-2">📚</span>
          <p>Cargando lecturas...</p>
        </div>
      )}

      {/* Reading pack offer */}
      <div className="mt-6 p-4 rounded-xl glass border border-border text-center">
        <p className="text-xs text-muted-foreground">
          💡 La primera lectura de cada nivel es gratis. Compra lecturas individuales por 500 monedas o paquetes en la <button onClick={() => useAppStore.getState().navigate('shop')} className="text-emerald-400 hover:underline">Tienda</button>
        </p>
      </div>
    </div>
  )
}

// ============================================
// SESSION TIMER
// ============================================
const MINI_GAME_TYPES = ['boxes', 'wheel', 'memory', 'trivia']

function SessionTimer() {
  const sessionStartTime = useAppStore((s) => s.sessionStartTime)
  const showMiniGame = useAppStore((s) => s.showMiniGame)
  const miniGameCompleted = useAppStore((s) => s.miniGameCompleted)
  const activateMiniGame = useAppStore((s) => s.activateMiniGame)
  const playSound = useAppStore((s) => s.playSound)
  const currentView = useAppStore((s) => s.currentView)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const soundPlayedRef = useRef(false)
  const [dismissedSessionStart, setDismissedSessionStart] = useState<number>(0)

  // Derived state: timer is complete when time reaches 0
  const timerComplete = timeLeft <= 0 && !!sessionStartTime
  // Show notification only if timer is complete, game not played this cycle, and not dismissed for this session
  const showPlayNotification = timerComplete && !miniGameCompleted && sessionStartTime !== dismissedSessionStart

  useEffect(() => {
    if (!sessionStartTime || showMiniGame) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
      const remaining = Math.max(0, 15 * 60 - elapsed)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        // Play sound notification once when timer completes
        if (!miniGameCompleted && !soundPlayedRef.current) {
          soundPlayedRef.current = true
          playSound('reward')
        }
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStartTime, showMiniGame, miniGameCompleted, playSound])

  // Reset sound flag when a new session starts
  useEffect(() => {
    if (sessionStartTime) {
      soundPlayedRef.current = false
    }
  }, [sessionStartTime])

  // Don't show timer during exercise view
  if (!sessionStartTime || showMiniGame || currentView === 'exercise') return null

  const progress = ((15 * 60 - timeLeft) / (15 * 60)) * 100
  const isUrgent = timeLeft <= 60 && !timerComplete

  const handleRandomMiniGame = () => {
    const randomGame = MINI_GAME_TYPES[Math.floor(Math.random() * MINI_GAME_TYPES.length)]
    activateMiniGame(randomGame)
    setDismissedSessionStart(sessionStartTime || 0)
  }

  return (
    <>
      {/* Compact timer pill - bottom right */}
      {!timerComplete && (
        <div className="fixed bottom-16 right-2 z-50 sm:right-4 sm:bottom-20">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.08))' }}
          >
            <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-secondary/50" />
                <circle
                  cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 9}`}
                  strokeDashoffset={`${2 * Math.PI * 9 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className={isUrgent ? 'text-red-400' : 'text-cyan-400'}
                />
              </svg>
              <span className="text-[8px]">⏱️</span>
            </div>

          </motion.div>
        </div>
      )}

      {/* Play notification popup when timer completes */}
      {showPlayNotification && !miniGameCompleted && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 sm:bottom-20">
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-yellow-500/40 shadow-xl shadow-yellow-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(245,158,11,0.1))' }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xl"
            >
              🎁
            </motion.span>
            <div>
              <p className="text-xs font-bold text-yellow-400">¡Puedes jugar un Mini Juego!</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRandomMiniGame}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] font-bold shadow-md shadow-yellow-500/30 flex-shrink-0"
            >
              🎮 Jugar
            </motion.button>
            <button
              onClick={() => setDismissedSessionStart(sessionStartTime || 0)}
              className="p-1 rounded-full hover:bg-secondary/50 text-muted-foreground"
            >
              <Icons.x size={14} />
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}

// ============================================
// MINI GAME: BOXES
// ============================================
function MiniGameBoxes() {
  const showMiniGame = useAppStore((s) => s.showMiniGame)
  const miniGameType = useAppStore((s) => s.miniGameType)
  const closeMiniGame = useAppStore((s) => s.closeMiniGame)
  const addXp = useAppStore((s) => s.addXp)
  const addCoins = useAppStore((s) => s.addCoins)
  const playSound = useAppStore((s) => s.playSound)
  const [boxes, setBoxes] = useState<Array<{opened: boolean; isDog: boolean; prize: string; amount: number}>>([])
  const [gameOver, setGameOver] = useState(false)
  const [prizesWon, setPrizesWon] = useState<Array<{prize: string; amount: number}>>([])
  const livesUsed = useRef(false)
  const [prevGameActive, setPrevGameActive] = useState(false)

  // Reset game state when mini game activates (React-recommended pattern for adjusting state based on props)
  const gameActive = showMiniGame && miniGameType === 'boxes'
  if (gameActive && !prevGameActive) {
    const prizeOptions = [
      { isDog: false, prize: 'Vidas', amount: 5 },
      { isDog: false, prize: 'Monedas', amount: 1000 },
      { isDog: false, prize: 'Energía', amount: 100 },
      { isDog: true, prize: 'Perro Bravo', amount: 0 },
      { isDog: true, prize: 'Perro Bravo', amount: 0 },
      { isDog: true, prize: 'Perro Bravo', amount: 0 },
    ]
    const shuffled = [...prizeOptions].sort(() => Math.random() - 0.5)
    setBoxes(shuffled.map(p => ({ ...p, opened: false })))
    setGameOver(false)
    setPrizesWon([])
    livesUsed.current = false
    setPrevGameActive(true)
  }
  if (!gameActive && prevGameActive) {
    setPrevGameActive(false)
  }

  if (!showMiniGame || miniGameType !== 'boxes') return null

  const handleOpenBox = (index: number) => {
    if (boxes[index].opened || gameOver) return
    const newBoxes = [...boxes]
    newBoxes[index] = { ...newBoxes[index], opened: true }
    setBoxes(newBoxes)

    if (newBoxes[index].isDog) {
      playSound('bark')
      setGameOver(true)
    } else {
      playSound('reward')
      const prize = newBoxes[index]
      setPrizesWon(prev => [...prev, { prize: prize.prize, amount: prize.amount }])
      if (prize.prize === 'Monedas') addCoins(prize.amount)
      if (prize.prize === 'Vidas') {
        if (!livesUsed.current) {
          livesUsed.current = true
          // Free lives from mini game - add directly without deducting coins
          const { user } = useAppStore.getState()
          if (user) {
            const updatedUser = { ...user, lives: Math.min(user.lives + prize.amount, 20) }
            useAppStore.setState({ user: updatedUser })
            useAppStore.getState().playSound('reward')
          }
        }
      }
      if (prize.prize === 'Energía') {
        const { user } = useAppStore.getState()
        if (user) {
          const updatedUser = { ...user, energy: Math.min((user.energy || 100) + prize.amount, user.maxEnergy || 200) }
          useAppStore.setState({ user: updatedUser })
        }
      }
    }
  }

  const prizesOpened = boxes.filter(b => b.opened && !b.isDog).length
  const allPrizesFound = prizesOpened >= 3

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-3xl p-4 sm:p-6 w-full max-w-sm relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.x size={16} />
        </button>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-20 h-20 bg-yellow-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-center mb-2">🎁 ¡Cajas Sorpresa!</h2>
          <p className="text-xs text-muted-foreground text-center mb-5">Destapa las cajas para ganar premios. ¡Cuidado con el perro bravo! 🐕</p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {boxes.map((box, i) => (
              <motion.button
                key={i}
                whileHover={!box.opened ? { scale: 1.08, rotate: [-1, 1, -1, 0] } : {}}
                whileTap={!box.opened ? { scale: 0.92 } : {}}
                onClick={() => handleOpenBox(i)}
                disabled={box.opened || gameOver}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative ${
                  box.opened
                    ? box.isDog
                      ? 'bg-red-500/15 border-2 border-red-500/40 animate-box-reveal'
                      : 'bg-emerald-500/15 border-2 border-emerald-500/40 animate-box-reveal'
                    : 'bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-2 border-yellow-500/40 hover:border-yellow-400/60 cursor-pointer animate-box-glow'
                }`}
              >
                {box.opened ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex flex-col items-center"
                  >
                    {box.isDog ? (
                      <>
                        <span className="text-4xl animate-dog-angry">🐕</span>
                        <span className="text-[9px] text-red-400 font-bold mt-1">¡GRRR!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl">{box.prize === 'Vidas' ? '❤️' : box.prize === 'Energía' ? '⚡' : '🪙'}</span>
                        <span className="text-[9px] text-emerald-400 font-bold mt-1">+{box.amount}</span>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <motion.span
                      animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.05, 1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="text-4xl"
                    >
                      🎁
                    </motion.span>
                    <span className="text-[8px] text-yellow-400/60 font-bold mt-1">¿Qué hay?</span>
                  </div>
                )}

                {/* 3D lid effect for unopened boxes */}
                {!box.opened && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                )}
              </motion.button>
            ))}
          </div>

          {prizesWon.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <p className="text-xs font-bold text-emerald-400 mb-1">🏆 Premios ganados:</p>
              {prizesWon.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs text-emerald-300 flex items-center gap-1"
                >
                  <span>✨</span> +{p.amount} {p.prize}
                </motion.p>
              ))}
            </motion.div>
          )}

          {(gameOver || allPrizesFound) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {gameOver && !allPrizesFound && (
                <motion.div
                  animate={{ x: [-5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="mb-3"
                >
                  <p className="text-sm text-red-400 font-bold">🐕 ¡Perro bravo!</p>
                  <p className="text-xs text-red-400/70">Más suerte la próxima vez</p>
                </motion.div>
              )}
              {allPrizesFound && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="mb-3"
                >
                  <p className="text-lg font-bold text-emerald-400">🎉 ¡Encontraste todos los premios!</p>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                ✅ Cerrar
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// MINI GAME: WHEEL
// ============================================
function MiniGameWheel() {
  const showMiniGame = useAppStore((s) => s.showMiniGame)
  const miniGameType = useAppStore((s) => s.miniGameType)
  const closeMiniGame = useAppStore((s) => s.closeMiniGame)
  const addCoins = useAppStore((s) => s.addCoins)
  const addXp = useAppStore((s) => s.addXp)
  const playSound = useAppStore((s) => s.playSound)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  if (!showMiniGame || miniGameType !== 'wheel') return null

  const segments = [
    { label: '500🪙', color: '#22c55e', action: () => addCoins(500) },
    { label: '1000🪙', color: '#f97316', action: () => addCoins(1000) },
    { label: '100⚡', color: '#06b6d4', action: () => addCoins(100) },
    { label: '🐕', color: '#ef4444', action: () => {} },
    { label: '1500🪙', color: '#a855f7', action: () => addCoins(1500) },
    { label: '5❤️', color: '#ec4899', action: () => useAppStore.getState().buyLives(5) },
    { label: '2000🪙', color: '#eab308', action: () => addCoins(2000) },
    { label: '🐕', color: '#ef4444', action: () => {} },
  ]

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const extraSpins = 5 * 360
    const randomAngle = Math.random() * 360
    const newRotation = rotation + extraSpins + randomAngle
    setRotation(newRotation)

    setTimeout(() => {
      const normalizedAngle = newRotation % 360
      const segmentAngle = 360 / segments.length
      const index = Math.floor(((360 - normalizedAngle + segmentAngle / 2) % 360) / segmentAngle)
      const segment = segments[index % segments.length]
      setSpinning(false)
      if (segment.label.includes('🐕')) {
        playSound('bark')
        setResult('🐕 ¡Perro bravo! Más suerte la próxima vez')
      } else {
        playSound('reward')
        segment.action()
        setResult(`🎉 ¡Ganaste: ${segment.label}!`)
      }
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass rounded-3xl p-4 sm:p-6 w-full max-w-sm text-center relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.x size={16} />
        </button>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">🎡 Rueda de la Fortuna</h2>
          <p className="text-xs text-muted-foreground mb-4">¡Gira y gana premios! Pero cuidado con el perro 🐕</p>

          <div className="relative w-48 sm:w-56 h-48 sm:h-56 mx-auto mb-4">
            {/* LED lights around the wheel */}
            <div className="absolute inset-0 rounded-full">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    left: `${50 + 47 * Math.cos((i / 16) * 2 * Math.PI - Math.PI / 2)}%`,
                    top: `${50 + 47 * Math.sin((i / 16) * 2 * Math.PI - Math.PI / 2)}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: i % 2 === 0 ? '#EAB308' : '#EF4444',
                    animation: `wheel-led-blink 0.5s ease-in-out ${spinning ? 'infinite' : '1'} ${i * 0.05}s both`,
                    boxShadow: `0 0 6px ${i % 2 === 0 ? '#EAB30880' : '#EF444480'}`,
                  }}
                />
              ))}
            </div>

            {/* Wheel */}
            <div
              className="w-40 sm:w-48 h-40 sm:h-48 rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {segments.map((seg, i) => {
                  const startAngle = (360 / segments.length) * i
                  const endAngle = (360 / segments.length) * (i + 1)
                  const startRad = (startAngle - 90) * (Math.PI / 180)
                  const endRad = (endAngle - 90) * (Math.PI / 180)
                  const x1 = 100 + 100 * Math.cos(startRad)
                  const y1 = 100 + 100 * Math.sin(startRad)
                  const x2 = 100 + 100 * Math.cos(endRad)
                  const y2 = 100 + 100 * Math.sin(endRad)
                  const midRad = (startRad + endRad) / 2
                  const textX = 100 + 60 * Math.cos(midRad)
                  const textY = 100 + 60 * Math.sin(midRad)
                  const largeArc = (endAngle - startAngle) > 180 ? 1 : 0

                  return (
                    <g key={i}>
                      <path
                        d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={seg.color + '30'}
                        stroke={seg.color + '60'}
                        strokeWidth="1"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="14"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${(startAngle + endAngle) / 2}, ${textX}, ${textY})`}
                        fontWeight="bold"
                      >
                        {seg.label}
                      </text>
                    </g>
                  )
                })}
                {/* Center circle */}
                <circle cx="100" cy="100" r="20" fill="oklch(0.2 0.02 270)" stroke="#EAB30860" strokeWidth="2" />
                <text x="100" y="100" fill="#EAB308" fontSize="11" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">🎡</text>
              </svg>
            </div>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-yellow-400 drop-shadow-lg" />
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 rounded-xl border border-border"
              style={{
                background: result.includes('Perro') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                borderColor: result.includes('Perro') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
              }}
            >
              <p className={`text-sm font-bold ${result.includes('Perro') ? 'text-red-400' : 'text-emerald-400'}`}>{result}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={result ? () => { closeMiniGame(); useAppStore.getState().startSessionTimer() } : handleSpin}
            disabled={spinning}
            className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
              spinning
                ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-yellow-500/20'
            }`}
          >
            {spinning ? '⏳ Girando...' : result ? '✅ Cerrar' : '🎡 ¡Girar!'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// MINI GAME: MEMORY
// ============================================
function MiniGameMemory() {
  const showMiniGame = useAppStore((s) => s.showMiniGame)
  const miniGameType = useAppStore((s) => s.miniGameType)
  const closeMiniGame = useAppStore((s) => s.closeMiniGame)
  const addXp = useAppStore((s) => s.addXp)
  const addCoins = useAppStore((s) => s.addCoins)
  const playSound = useAppStore((s) => s.playSound)

  const wordPairs = [
    { en: 'House', es: 'Casa' },
    { en: 'Water', es: 'Agua' },
    { en: 'Book', es: 'Libro' },
    { en: 'School', es: 'Escuela' },
    { en: 'Friend', es: 'Amigo' },
    { en: 'Food', es: 'Comida' },
  ]

  const [cards, setCards] = useState<Array<{id: number; text: string; pairId: number; flipped: boolean; matched: boolean}>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [canFlip, setCanFlip] = useState(true)
  const [prevGameActive, setPrevGameActive] = useState(false)

  // Reset game state when mini game activates (React-recommended pattern for adjusting state based on props)
  const gameActive = showMiniGame && miniGameType === 'memory'
  if (gameActive && !prevGameActive) {
    const generated = wordPairs.flatMap((pair, i) => [
      { id: i * 2, text: pair.en, pairId: i, flipped: false, matched: false },
      { id: i * 2 + 1, text: pair.es, pairId: i, flipped: false, matched: false },
    ])
    const shuffled = [...generated].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setGameComplete(false)
    setCanFlip(true)
    setPrevGameActive(true)
  }
  if (!gameActive && prevGameActive) {
    setPrevGameActive(false)
  }

  if (!showMiniGame || miniGameType !== 'memory') return null

  const handleFlip = (cardId: number) => {
    if (!canFlip) return
    const card = cards.find(c => c.id === cardId)
    if (!card || card.flipped || card.matched) return
    if (flippedCards.length >= 2) return

    const newCards = cards.map(c => c.id === cardId ? { ...c, flipped: true } : c)
    setCards(newCards)
    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1)
      setCanFlip(false)
      const first = newCards.find(c => c.id === newFlipped[0])!
      const second = newCards.find(c => c.id === newFlipped[1])!
      if (first.pairId === second.pairId) {
        playSound('correct')
        const matchedCards = newCards.map(c =>
          c.pairId === first.pairId ? { ...c, matched: true } : c
        )
        setTimeout(() => {
          setCards(matchedCards)
          setFlippedCards([])
          setCanFlip(true)
          if (matchedCards.every(c => c.matched)) {
            setGameComplete(true)
            playSound('reward')
            addXp(50)
            addCoins(300)
          }
        }, 500)
      } else {
        playSound('wrong')
        setTimeout(() => {
          setCards(newCards.map(c =>
            c.id === newFlipped[0] || c.id === newFlipped[1] ? { ...c, flipped: false } : c
          ))
          setFlippedCards([])
          setCanFlip(true)
        }, 1000)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass rounded-3xl p-4 sm:p-6 w-full max-w-sm relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.x size={16} />
        </button>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-center mb-1">🧠 Memoria</h2>
          <p className="text-xs text-muted-foreground text-center mb-4">Encuentra los pares inglés-español</p>

          {/* Score display */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="text-xs">🔄</span>
              <span className="text-xs font-bold text-purple-400">{moves} movimientos</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs">✅</span>
              <span className="text-xs font-bold text-emerald-400">{cards.filter(c => c.matched).length / 2} pares</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                whileHover={!card.flipped && !card.matched ? { scale: 1.08, y: -2 } : {}}
                whileTap={!card.flipped && !card.matched ? { scale: 0.92 } : {}}
                onClick={() => handleFlip(card.id)}
                disabled={card.flipped || card.matched}
                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold p-1 transition-all relative ${
                  card.matched
                    ? 'bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-400 animate-memory-glow'
                    : card.flipped
                    ? 'bg-cyan-500/15 border-2 border-cyan-500/40 text-cyan-400'
                    : 'bg-gradient-to-br from-purple-500/15 to-violet-500/15 border-2 border-purple-500/30 cursor-pointer hover:border-purple-400/50'
                }`}
              >
                {card.flipped || card.matched ? (
                  <motion.span
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-[11px] leading-tight text-center"
                  >
                    {card.text}
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: card.id * 0.1 }}
                    className="text-lg"
                  >
                    🃏
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {gameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="mb-3"
              >
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-sm text-emerald-400 font-bold">¡Completado en {moves} movimientos!</p>
                <p className="text-xs text-emerald-300/70">+50 XP +300 monedas</p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                ✅ Cerrar
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// MINI GAME: TRIVIA
// ============================================
function MiniGameTrivia() {
  const showMiniGame = useAppStore((s) => s.showMiniGame)
  const miniGameType = useAppStore((s) => s.miniGameType)
  const closeMiniGame = useAppStore((s) => s.closeMiniGame)
  const addXp = useAppStore((s) => s.addXp)
  const addCoins = useAppStore((s) => s.addCoins)
  const playSound = useAppStore((s) => s.playSound)

  const triviaQuestions = [
    { q: 'What does "apple" mean?', opts: ['Naranja', 'Manzana', 'Pera', 'Uva'], correct: 1 },
    { q: 'Translate "dog"', opts: ['Gato', 'Pájaro', 'Perro', 'Pez'], correct: 2 },
    { q: 'What is "water" in Spanish?', opts: ['Fuego', 'Tierra', 'Aire', 'Agua'], correct: 3 },
    { q: 'What does "book" mean?', opts: ['Mesa', 'Libro', 'Silla', 'Puerta'], correct: 1 },
    { q: 'Translate "happy"', opts: ['Triste', 'Enojado', 'Feliz', 'Cansado'], correct: 2 },
  ]

  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [prevGameActive, setPrevGameActive] = useState(false)

  // Reset game state when mini game activates (React-recommended pattern for adjusting state based on props)
  const gameActive = showMiniGame && miniGameType === 'trivia'
  if (gameActive && !prevGameActive) {
    setCurrentQ(0)
    setScore(0)
    setTimeLeft(30)
    setAnswered(false)
    setSelectedAnswer(null)
    setGameOver(false)
    setPrevGameActive(true)
  }
  if (!gameActive && prevGameActive) {
    setPrevGameActive(false)
  }

  useEffect(() => {
    if (!showMiniGame || miniGameType !== 'trivia' || gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [showMiniGame, miniGameType, gameOver, currentQ])

  if (!showMiniGame || miniGameType !== 'trivia') return null

  const handleAnswer = (optIndex: number) => {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(optIndex)
    if (optIndex === triviaQuestions[currentQ].correct) {
      playSound('correct')
      setScore(prev => prev + 1)
    } else {
      playSound('wrong')
    }
    setTimeout(() => {
      if (currentQ < triviaQuestions.length - 1) {
        setCurrentQ(prev => prev + 1)
        setAnswered(false)
        setSelectedAnswer(null)
      } else {
        setGameOver(true)
        const xpEarned = (score + (optIndex === triviaQuestions[currentQ].correct ? 1 : 0)) * 15
        const coinsEarned = (score + (optIndex === triviaQuestions[currentQ].correct ? 1 : 0)) * 100
        addXp(xpEarned)
        addCoins(coinsEarned)
        if (score + (optIndex === triviaQuestions[currentQ].correct ? 1 : 0) >= 4) playSound('reward')
      }
    }, 800)
  }

  const finalScore = gameOver ? score + (answered && selectedAnswer === triviaQuestions[currentQ]?.correct ? 0 : 0) : score

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass rounded-3xl p-4 sm:p-6 w-full max-w-sm relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.x size={16} />
        </button>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">⚡ Trivia</h2>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-500/10 border border-red-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'}`}>
                <span className={`text-xs font-bold ${timeLeft <= 10 ? 'text-red-400 animate-trivia-pulse' : 'text-cyan-400'}`}>⏱ {timeLeft}s</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-400">{score}/{triviaQuestions.length}</span>
              </div>
            </div>
          </div>

          {!gameOver ? (
            <>
              {/* Progress bar */}
              <div className="w-full h-2 bg-secondary rounded-full mb-4 overflow-hidden">
                <motion.div
                  animate={{ width: `${((currentQ + 1) / triviaQuestions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Question number */}
              <div className="flex items-center gap-2 mb-3">
                {triviaQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < currentQ ? 'bg-emerald-500' : i === currentQ ? 'bg-cyan-400 scale-125' : 'bg-secondary'
                    }`}
                  />
                ))}
              </div>

              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-medium mb-4">{triviaQuestions[currentQ].q}</p>
                <div className="space-y-2">
                  {triviaQuestions[currentQ].opts.map((opt, i) => {
                    const isCorrect = i === triviaQuestions[currentQ].correct
                    const isSelected = selectedAnswer === i
                    let cls = 'w-full p-3 rounded-xl border text-sm font-medium text-left transition-all '
                    if (answered) {
                      if (isCorrect) cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      else if (isSelected) cls += 'border-red-500/50 bg-red-500/10 text-red-400'
                      else cls += 'border-border opacity-50'
                    } else {
                      cls += 'border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 cursor-pointer'
                    }
                    return (
                      <motion.button
                        key={i}
                        whileHover={!answered ? { scale: 1.02 } : {}}
                        whileTap={!answered ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(i)}
                        disabled={answered}
                        className={cls}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                          {answered && isCorrect && <span className="ml-auto">✅</span>}
                          {answered && isSelected && !isCorrect && <span className="ml-auto">❌</span>}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-6xl block mb-3">{score >= 4 ? '🏆' : score >= 2 ? '👍' : '📚'}</span>
              </motion.div>
              <p className="text-lg font-bold mb-1">{score}/{triviaQuestions.length} correctas</p>
              <p className="text-sm text-emerald-400 mb-1">+{score * 15} XP +{score * 100} monedas</p>
              <p className="text-xs text-muted-foreground mb-4">
                {score === 5 ? '🌟 ¡PERFECTO! ¡Eres un genio!' : 
                 score >= 4 ? '🔥 ¡Casi perfecto!' :
                 score >= 3 ? '👍 ¡Buen trabajo!' :
                 score >= 2 ? '💪 ¡Sigue practicando!' : '📚 ¡Estudia más!'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { closeMiniGame(); useAppStore.getState().startSessionTimer() }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                ✅ Cerrar
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
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
  const startSessionTimer = useAppStore((s) => s.startSessionTimer)

  // Update streak on login & start session timer
  useEffect(() => {
    if (isLoggedIn) {
      updateStreak()
      startSessionTimer()
      // Check for streak gift after streak update
      setTimeout(() => checkStreakGift(), 500)
    }
  }, [isLoggedIn, updateStreak, checkStreakGift, startSessionTimer])

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
      case 'battle': return <BattleView />
      case 'readings': return <ReadingsView />
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
      <SessionTimer />
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

      {/* Mini Games */}
      <MiniGameBoxes />
      <MiniGameWheel />
      <MiniGameMemory />
      <MiniGameTrivia />

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
              className="glass rounded-3xl p-4 sm:p-6 max-w-sm w-full text-center"
            >
              <div className="text-4xl sm:text-5xl mb-2">🎁</div>
              <h2 className="text-xl sm:text-2xl font-black mb-2">Streak Reward!</h2>
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
              <div className="text-6xl sm:text-8xl mb-4">🎉</div>
              <h2 className="text-3xl sm:text-4xl font-black neon-green">LEVEL UP!</h2>
              <p className="text-xl text-muted-foreground mt-2">Keep up the great work!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
