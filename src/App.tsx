import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FileUpload } from './components/FileUpload';
import { SummaryCard } from './components/SummaryCard';
import { DocumentViewer } from './components/DocumentViewer';
import { DocumentChat } from './components/DocumentChat';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AuthModal } from './components/AuthModal';
import { SampleDocsModal } from './components/SampleDocsModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AnimatedBackground } from './components/AnimatedBackground';
import { getCurrentUser, logoutUser } from './lib/auth';
import { getUserHistory, saveToHistory, deleteHistoryItem, clearUserHistory } from './lib/historyStorage';
import { ThemeId, THEMES } from './lib/theme';
import { User, TranslationResult, HistoryItem } from './types';
import { Sparkles, MessageSquare, AlertCircle, Globe, ShieldCheck, FileCheck, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<TranslationResult | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('indigo-modern');
  const theme = THEMES[currentTheme] || THEMES['indigo-modern'];

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSampleDocsOpen, setIsSampleDocsOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sync dark mode class on html element for Tailwind dark: variants
  useEffect(() => {
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme, theme.isDark]);

  // Load history items on load and user change
  const reloadHistory = () => {
    const activeUserId = user?.id || 'usr_demo_101';
    const items = getUserHistory(activeUserId);
    setHistoryItems(items);
  };

  useEffect(() => {
    reloadHistory();

    const handleAuthChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    const handleHistoryChange = () => {
      reloadHistory();
    };

    window.addEventListener('auth_change', handleAuthChange);
    window.addEventListener('history_updated', handleHistoryChange);

    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
      window.removeEventListener('history_updated', handleHistoryChange);
    };
  }, [user?.id]);

  const handleTranslate = async (
    file: File | null,
    textInput: string,
    targetLanguage: string,
    customInstructions: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('textInput', textInput);
      }
      formData.append('targetLanguage', targetLanguage);
      formData.append('customInstructions', customInstructions);

      const response = await fetch('/api/translate-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to translate document.');
      }

      const result: TranslationResult = data.data;
      setCurrentResult(result);

      // Automatically save to current user's history
      const activeUserId = user?.id || 'usr_demo_101';
      saveToHistory(activeUserId, result);
      reloadHistory();

      // Smooth scroll down to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error('Translation error:', err);
      setErrorMessage(err.message || 'An error occurred during translation. Please check your file or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleText: string, langName: string) => {
    handleTranslate(null, sampleText, 'English', `Original document is in ${langName}. Translate to English while keeping all table structures and headers intact.`);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <div className={`relative min-w-full min-h-screen ${theme.bgClass} font-sans selection:bg-indigo-500 selection:text-white pb-20 overflow-x-hidden transition-colors duration-300`}>
      
      {/* Ambient Interactive Animated Particle Background */}
      <AnimatedBackground themeId={currentTheme} />

      {/* Header Navigation */}
      <Navbar
        user={user}
        historyCount={historyItems.length}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSampleDocs={() => setIsSampleDocsOpen(true)}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
        onLogout={handleLogout}
        onNewTranslation={() => {
          setCurrentResult(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${theme.accentBg} border ${theme.accentBorder} ${theme.accentText} text-xs font-semibold shadow-xs backdrop-blur-xs`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI-Powered Layout-Preserving Translation</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsThemeSelectorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span>Theme: {theme.name}</span>
            </motion.button>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${theme.textPrimary} leading-tight`}>
            Translate Any Document. <br className="hidden sm:inline" />
            <span className={theme.accentText}>
              Preserve Original Layout & Style.
            </span>
          </h1>

          <p className={`text-sm sm:text-base ${theme.textSecondary} max-w-2xl mx-auto leading-relaxed font-normal`}>
            Upload PDFs, Word files, text documents or images in any language. Our assistant translates into your preferred language with pristine formatting, extracts key insights, and builds your document history.
          </p>

          {/* Quick Badges */}
          <div className={`flex flex-wrap items-center justify-center gap-4 pt-2 text-xs ${theme.textSecondary} font-medium`}>
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Tables & Headers Intact</span>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>40+ World Languages</span>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Saved Document History</span>
            </motion.span>
          </div>
        </motion.div>

        {/* Translation Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <FileUpload
            onTranslate={handleTranslate}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Error Notification */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm shadow-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
              <p className="flex-1 font-medium">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {currentResult && (
            <motion.div 
              id="results-section" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 max-w-6xl mx-auto pt-6"
            >
              {/* AI Summary & Important Points */}
              <SummaryCard
                result={currentResult}
                onOpenChat={() => setIsChatOpen(true)}
              />

              {/* Document Viewer (Side by Side or Tabbed) */}
              <DocumentViewer
                result={currentResult}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Floating Ask AI Button when viewing result */}
      <AnimatePresence>
        {currentResult && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-full shadow-xl flex items-center gap-2 cursor-pointer border border-indigo-500/50"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI About Doc</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawers and Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          reloadHistory();
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectItem={(item) => {
          setCurrentResult(item);
          setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onDeleteItem={(id) => {
          const activeUserId = user?.id || 'usr_demo_101';
          deleteHistoryItem(activeUserId, id);
          reloadHistory();
        }}
        onClearAll={() => {
          const activeUserId = user?.id || 'usr_demo_101';
          clearUserHistory(activeUserId);
          reloadHistory();
        }}
      />

      <SampleDocsModal
        isOpen={isSampleDocsOpen}
        onClose={() => setIsSampleDocsOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <ThemeSelectorModal
        isOpen={isThemeSelectorOpen}
        currentTheme={currentTheme}
        onSelectTheme={(selectedTheme) => {
          setCurrentTheme(selectedTheme);
        }}
        onClose={() => setIsThemeSelectorOpen(false)}
      />

      <DocumentChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        result={currentResult || historyItems[0] || {
          id: 'dummy',
          fileName: 'Sample Document',
          fileType: 'text/plain',
          fileSize: 100,
          detectedLanguage: 'English',
          targetLanguage: 'English',
          summary: 'Sample summary',
          keyPoints: [],
          originalText: '',
          translatedDocument: '',
          metadata: {},
          createdAt: new Date().toISOString()
        }}
      />

    </div>
  );
}


