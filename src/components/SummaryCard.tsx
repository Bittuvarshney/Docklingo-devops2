import React from 'react';
import { Sparkles, FileCheck, Layers, BookOpen, Clock, Tag, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { TranslationResult } from '../types';

interface SummaryCardProps {
  result: TranslationResult;
  onOpenChat: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result, onOpenChat }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-md text-slate-800 space-y-5"
    >
      
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2.5">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">AI Document Insights & Summary</h3>
            <p className="text-xs text-slate-500 font-medium">Key takeaways extracted from {result.fileName}</p>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg flex items-center gap-1 shadow-xs">
            <Tag className="w-3 h-3" />
            {result.detectedLanguage} → {result.targetLanguage}
          </span>
          {result.metadata?.docType && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" />
              {result.metadata.docType}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenChat}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask AI About Doc</span>
          </motion.button>
        </div>
      </div>

      {/* Executive Summary */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/80"
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Executive Summary</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {result.summary}
        </p>
      </motion.div>

      {/* Key Takeaways Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2.5 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Key Important Points ({result.keyPoints.length})</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {result.keyPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              whileHover={{ scale: 1.01, x: 2 }}
              className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-start gap-2.5 hover:border-slate-300 transition-all shadow-xs"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center mt-0.5 border border-emerald-200">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-snug font-normal">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Stat Pills */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-200/80 font-medium">
        <div className="flex items-center gap-4">
          {result.metadata?.wordCount && (
            <span>Words: <strong className="text-slate-800">{result.metadata.wordCount}</strong></span>
          )}
          {result.metadata?.pageCount && (
            <span>Estimated Pages: <strong className="text-slate-800">{result.metadata.pageCount}</strong></span>
          )}
          {result.metadata?.tone && (
            <span>Tone: <strong className="text-slate-800">{result.metadata.tone}</strong></span>
          )}
        </div>
        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Layout & Formatting Preserved
        </span>
      </div>

    </motion.div>
  );
};

