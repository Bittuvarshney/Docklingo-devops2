import React, { useState } from 'react';
import { History, X, Search, Trash2, Download, ExternalLink, Calendar, FileText, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = items.filter(
    item =>
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detectedLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-40"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-800"
          >
            
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <motion.div 
                  whileHover={{ rotate: -15, scale: 1.1 }}
                  className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
                >
                  <History className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Saved Document History</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{items.length} saved translation(s)</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search & Actions */}
            <div className="p-3 bg-slate-50/50 border-b border-slate-200 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by file name or language..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {items.length > 0 && (
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClearAll}
                    className="text-[11px] font-medium text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear History</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Item List */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <FileText className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-xs font-semibold text-slate-600">No saved document history found.</p>
                  <p className="text-[11px] mt-1">Translate a document and it will automatically be saved here for later access!</p>
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-3.5 bg-white border border-slate-200/80 hover:border-indigo-300 rounded-xl space-y-2.5 transition-all group shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {item.fileName}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-medium">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-indigo-600" />
                              {item.detectedLanguage} → {item.targetLanguage}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    {/* Summary Snippet */}
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/80 p-2 rounded-lg border border-slate-200/80">
                      {item.summary}
                    </p>

                    {/* Open Translation Button */}
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.keyPoints.length} key points • {item.metadata?.wordCount || 0} words
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { onSelectItem(item); onClose(); }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Load Document</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>

                  </motion.div>
                ))
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

