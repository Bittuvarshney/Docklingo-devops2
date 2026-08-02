export type ThemeId = 'indigo-modern' | 'obsidian-dark' | 'emerald-oasis' | 'sunset-amber' | 'cyber-neon';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  isDark: boolean;
  previewColors: string[];
  bgClass: string;
  cardClass: string;
  navbarClass: string;
  textPrimary: string;
  textSecondary: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  buttonPrimary: string;
  particleColors: number[]; // hex for Three.js
  blobColors: string[];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'indigo-modern': {
    id: 'indigo-modern',
    name: 'Indigo Modern',
    tagline: 'Refined, crisp light workspace with subtle indigo accents',
    isDark: false,
    previewColors: ['#4f46e5', '#38bdf8', '#f8fafc'],
    bgClass: 'bg-slate-100 text-slate-800',
    cardClass: 'bg-white border-slate-200/80 shadow-md',
    navbarClass: 'bg-white/90 border-slate-200/80 text-slate-800',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-600',
    accentBorder: 'border-indigo-200',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
    particleColors: [0x6366f1, 0x10b981, 0x0284c7, 0x8b5cf6],
    blobColors: ['bg-indigo-300/40', 'bg-emerald-300/35', 'bg-purple-300/30'],
  },
  'obsidian-dark': {
    id: 'obsidian-dark',
    name: 'Obsidian Dark',
    tagline: 'Sleek, eye-friendly dark mode with neon indigo glass cards',
    isDark: true,
    previewColors: ['#6366f1', '#0f172a', '#1e293b'],
    bgClass: 'bg-slate-950 text-slate-100',
    cardClass: 'bg-slate-900/90 border-slate-800 shadow-xl backdrop-blur-md',
    navbarClass: 'bg-slate-950/90 border-slate-800 text-slate-100',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    accentBg: 'bg-indigo-950/80',
    accentText: 'text-indigo-400',
    accentBorder: 'border-indigo-800/60',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30',
    particleColors: [0x818cf8, 0x38bdf8, 0x34d399, 0xc084fc],
    blobColors: ['bg-indigo-600/20', 'bg-sky-600/20', 'bg-purple-600/20'],
  },
  'emerald-oasis': {
    id: 'emerald-oasis',
    name: 'Emerald Oasis',
    tagline: 'Calm, organic sage & emerald tones on clean warm ivory',
    isDark: false,
    previewColors: ['#059669', '#34d399', '#f4f6f0'],
    bgClass: 'bg-[#f4f6f0] text-slate-800',
    cardClass: 'bg-white border-emerald-100 shadow-md',
    navbarClass: 'bg-[#f4f6f0]/90 border-emerald-200/80 text-slate-800',
    textPrimary: 'text-emerald-950',
    textSecondary: 'text-emerald-700/70',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    particleColors: [0x059669, 0x10b981, 0x34d399, 0x0284c7],
    blobColors: ['bg-emerald-300/40', 'bg-teal-300/35', 'bg-sky-300/30'],
  },
  'sunset-amber': {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    tagline: 'Warm linen canvas with terracotta and warm amber accents',
    isDark: false,
    previewColors: ['#ea580c', '#f59e0b', '#faf8f5'],
    bgClass: 'bg-[#faf8f5] text-amber-950',
    cardClass: 'bg-white border-orange-200/70 shadow-md',
    navbarClass: 'bg-[#faf8f5]/90 border-orange-200/80 text-amber-950',
    textPrimary: 'text-amber-950',
    textSecondary: 'text-amber-800/70',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    accentBorder: 'border-orange-200',
    buttonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20',
    particleColors: [0xea580c, 0xf59e0b, 0xf43f5e, 0xd97706],
    blobColors: ['bg-orange-300/40', 'bg-amber-300/35', 'bg-rose-300/30'],
  },
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Studio',
    tagline: 'Ultra-modern dark aesthetic with cyan glow & magenta accents',
    isDark: true,
    previewColors: ['#06b6d4', '#ec4899', '#09090b'],
    bgClass: 'bg-zinc-950 text-cyan-50',
    cardClass: 'bg-zinc-900/95 border-cyan-900/50 shadow-2xl backdrop-blur-md',
    navbarClass: 'bg-zinc-950/90 border-cyan-900/50 text-cyan-50',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-zinc-400',
    accentBg: 'bg-cyan-950/80',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-800/60',
    buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold shadow-cyan-500/30',
    particleColors: [0x06b6d4, 0xec4899, 0xa855f7, 0x3b82f6],
    blobColors: ['bg-cyan-600/20', 'bg-pink-600/20', 'bg-purple-600/20'],
  }
};
