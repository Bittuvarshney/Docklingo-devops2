export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface DocumentMetadata {
  docType?: string;
  tone?: string;
  wordCount?: number;
  pageCount?: number;
  formattingNotes?: string;
}

export interface TranslationResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  detectedLanguage: string;
  targetLanguage: string;
  summary: string;
  keyPoints: string[];
  originalText: string;
  translatedDocument: string; // Markdown / HTML formatted
  metadata: DocumentMetadata;
  createdAt: string;
}

export interface HistoryItem extends TranslationResult {
  userId: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
