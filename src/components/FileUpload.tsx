import React, { useState, useRef } from 'react';
import { Upload, FileText, Globe, Search, Sparkles, Check, FileType, AlertCircle, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES } from '../lib/languages';

interface FileUploadProps {
  onTranslate: (file: File | null, textInput: string, targetLanguage: string, customInstructions: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTranslate, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchLang, setSearchLang] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = LANGUAGES.filter(
    lang =>
      lang.name.toLowerCase().includes(searchLang.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchLang.toLowerCase())
  );

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'upload' && !selectedFile) return;
    if (activeTab === 'text' && !textInput.trim()) return;

    onTranslate(
      activeTab === 'upload' ? selectedFile : null,
      activeTab === 'text' ? textInput : '',
      targetLanguage,
      customInstructions
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-lg p-4 sm:p-6 text-slate-800"
    >
      
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
        <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Raw Text</span>
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
            showAdvanced
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Instructions</span>
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Upload Zone or Text Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-10 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
                    : selectedFile
                    ? 'border-emerald-500 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp,.csv,.html"
                  className="hidden"
                />

                {selectedFile ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-sm">
                      <FileType className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{selectedFile.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="mt-2 text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Change file
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shadow-sm"
                    >
                      <Upload className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Drop your document here, or <span className="text-indigo-600 font-bold underline">browse files</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports PDF, Word (.docx), Text, Markdown, Scanned Docs & Images (PNG/JPG)
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                      {['PDF', 'DOCX', 'TXT', 'MD', 'PNG', 'JPG', 'HTML'].map((ext) => (
                        <span key={ext} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="text-zone"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Source Document Text
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste document text in any language here... Original headers, bullet points, and structures will be preserved."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Prompt Instructions (Optional) */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2 overflow-hidden"
            >
              <label className="block text-xs font-semibold text-indigo-900">
                Custom Translation & Formatting Instructions (Optional)
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. 'Use formal business German', 'Keep legal terms intact', 'Translate with bullet points'"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Target Language Selection Grid & Search */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Select Target Output Language</span>
            </label>
            <span className="text-[11px] text-slate-500 font-medium">Current: <strong className="text-indigo-600 font-bold">{targetLanguage}</strong></span>
          </div>

          {/* Quick Popular Languages Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {LANGUAGES.filter(l => l.popular).map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setTargetLanguage(lang.code)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  targetLanguage === lang.code
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Language Search Input */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchLang}
              onChange={(e) => setSearchLang(e.target.value)}
              placeholder="Search 40+ world languages..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Expanded Scrollable List if Searching */}
          {searchLang && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-h-36 overflow-y-auto p-1.5 bg-white border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-3 gap-1 shadow-sm"
            >
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => { setTargetLanguage(lang.code); setSearchLang(''); }}
                  className={`p-1.5 text-left text-xs rounded-md flex items-center gap-2 cursor-pointer ${
                    targetLanguage === lang.code
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading || (activeTab === 'upload' && !selectedFile) || (activeTab === 'text' && !textInput.trim())}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>Translating Document & Preserving Layout...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>Translate & Summarize Document Now</span>
            </>
          )}
        </motion.button>

      </form>
    </motion.div>
  );
};

