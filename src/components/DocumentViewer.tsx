import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Copy, Check, FileCode, FileText, Globe, Columns, Eye, Sparkles, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import { TranslationResult } from '../types';

interface DocumentViewerProps {
  result: TranslationResult;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'split' | 'translated' | 'original'>('split');
  const [copied, setCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.translatedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    setDownloadingFormat('PDF');
    const elem = document.getElementById('translated-markdown-container');
    if (!elem) {
      setDownloadingFormat(null);
      return;
    }

    const opt = {
      margin: 15,
      filename: `${result.fileName.replace(/\.[^/.]+$/, '')}_${result.targetLanguage}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(elem).save().then(() => {
      setDownloadingFormat(null);
    }).catch(() => {
      setDownloadingFormat(null);
    });
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([result.translatedDocument], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName.replace(/\.[^/.]+$/, '')}_${result.targetLanguage}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${result.fileName} (${result.targetLanguage})</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f1f5f9; }
    code { background: #f1f5f9; padding: 2px 6px; rounded: 4px; font-family: monospace; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; color: #475569; }
  </style>
</head>
<body>
  ${document.getElementById('translated-markdown-container')?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName.replace(/\.[^/.]+$/, '')}_${result.targetLanguage}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const blob = new Blob([result.translatedDocument], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName.replace(/\.[^/.]+$/, '')}_${result.targetLanguage}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-lg overflow-hidden text-slate-800"
    >
      
      {/* Top Toolbar */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        
        {/* View Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
            <span className="sm:hidden">Split</span>
          </button>
          <button
            onClick={() => setViewMode('translated')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'translated' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Translated Only</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'original' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Original Doc</span>
          </button>
        </div>

        {/* Copy & Download Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </motion.button>

          {/* Download Dropdown */}
          <div className="relative group">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </motion.button>

            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block z-20 animate-fadeIn">
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingFormat === 'PDF'}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-rose-600" />
                  PDF Document
                </span>
                {downloadingFormat === 'PDF' && <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />}
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-600" />
                <span>Markdown (.md)</span>
              </button>
              <button
                onClick={handleDownloadHTML}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>HTML Page (.html)</span>
              </button>
              <button
                onClick={handleDownloadText}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plain Text (.txt)</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Main Document Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={viewMode}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.2 }}
          className={`grid gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 ${
            viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          
          {/* Original Document Panel */}
          {(viewMode === 'split' || viewMode === 'original') && (
            <div className="p-5 sm:p-6 bg-slate-50/50">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Original ({result.detectedLanguage})
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{result.fileName}</span>
              </div>

              <div className="prose max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed font-sans max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.originalText}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Translated Formatted Document Panel */}
          {(viewMode === 'split' || viewMode === 'translated') && (
            <div className="p-5 sm:p-6 bg-white">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Translated ({result.targetLanguage})
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Formatting Preserved
                </span>
              </div>

              <div
                id="translated-markdown-container"
                className="prose max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed max-h-[600px] overflow-y-auto pr-2 custom-scrollbar prose-headings:text-slate-900 prose-headings:font-bold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-table:border prose-table:border-slate-200 prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-slate-200 prose-blockquote:border-l-indigo-600 prose-blockquote:bg-indigo-50/50 prose-blockquote:p-3 prose-blockquote:rounded-r-lg"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.translatedDocument}
                </ReactMarkdown>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </motion.div>
  );
};

