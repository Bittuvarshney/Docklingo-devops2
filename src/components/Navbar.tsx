import React from 'react';
import { Languages, FileText, History, User as UserIcon, LogOut, Sparkles, FolderOpen, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  historyCount: number;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenSampleDocs: () => void;
  onOpenThemeSelector: () => void;
  onLogout: () => void;
  onNewTranslation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  historyCount,
  onOpenAuth,
  onOpenHistory,
  onOpenSampleDocs,
  onOpenThemeSelector,
  onLogout,
  onNewTranslation,
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <motion.div 
          onClick={onNewTranslation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <motion.div 
            whileHover={{ rotate: 12 }}
            className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/30 group-hover:bg-indigo-700 transition-colors duration-200"
          >
            <Languages className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Linguify<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-[10px] uppercase tracking-wider font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full"
              >
                Format-Preserving
              </motion.span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Universal Document Translator & Summarizer
            </p>
          </div>
        </motion.div>

        {/* Action Buttons & Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Design Theme Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenThemeSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Choose Web Theme & Colors"
          >
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="hidden lg:inline">Design Theme</span>
            <span className="lg:hidden">Theme</span>
          </motion.button>

          {/* Sample Docs Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSampleDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Try sample documents"
          >
            <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">Samples</span>
          </motion.button>

          {/* History Button with Counter Badge */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="View translation history"
          >
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-indigo-600 text-white rounded-full shadow-xs"
              >
                {historyCount}
              </motion.span>
            )}
          </motion.button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] font-medium">{user.email}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

      </div>
    </motion.header>
  );
};


