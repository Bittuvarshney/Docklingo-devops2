import { HistoryItem, TranslationResult } from '../types';

const HISTORY_KEY_PREFIX = 'doc_trans_history_user_';

const SAMPLE_HISTORY_ITEMS: TranslationResult[] = [
  {
    id: 'hist_sample_01',
    fileName: 'Tokyo_AI_Tech_Architecture.pdf',
    fileType: 'application/pdf',
    fileSize: 245000,
    detectedLanguage: 'Japanese',
    targetLanguage: 'English',
    summary: 'An architectural overview of modern distributed high-performance AI inference pipelines deployed in edge nodes across Tokyo data centers.',
    keyPoints: [
      'Edge latency reduced to under 12ms for real-time translation.',
      'Auto-scaling cluster nodes utilizing low-power ARM architecture.',
      'Strict fault isolation with fallback routing to Osaka backup center.'
    ],
    originalText: `# 東京AI推論アーキテクチャ概要

## 1. システム目的
本システムは、低遅延かつ高可用性を持つグローバルAI翻訳エンジンを構築することを目的とします。

| コンポーネント | 役割 | 応答時間 |
| :--- | :--- | :--- |
| エッジ gateway | リクエスト検証とルーティング | < 2ms |
| Gemini 2.5 Flash | 文脈解析およびリアルタイム翻訳 | < 100ms |
| ストレージ | 履歴管理および同期 | < 10ms |

### 重要要件
- 東京および大阪データセンター間での自動フェイルオーバー
- データの暗号化（AES-256）`,
    translatedDocument: `# Tokyo AI Inference Architecture Overview

## 1. System Objective
This system aims to construct a global AI translation engine characterized by ultra-low latency and high availability.

| Component | Role | Response Time |
| :--- | :--- | :--- |
| Edge Gateway | Request validation and dynamic routing | < 2ms |
| Gemini 2.5 Flash | Contextual analysis and real-time translation | < 100ms |
| Storage | History management and multi-device sync | < 10ms |

### Critical Requirements
- Automatic failover between Tokyo and Osaka data centers
- End-to-end data encryption (AES-256)`,
    metadata: {
      docType: 'Technical Architecture Specification',
      tone: 'Formal & Technical',
      wordCount: 145,
      pageCount: 1,
      formattingNotes: 'Preserved markdown tables, headers, and bulleted lists perfectly.'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'hist_sample_02',
    fileName: 'Contrat_de_Licence_Paris.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 180000,
    detectedLanguage: 'French',
    targetLanguage: 'Spanish',
    summary: 'Contrato de licencia comercial entre Paris Tech Solutions y el socio distribuidor internacional.',
    keyPoints: [
      'Duración del acuerdo: 24 meses renovables automáticamente.',
      'Regalías del 12% sobre las ventas brutas trimestrales.',
      'Jurisdicción aplicable: Tribunales de Comercio de París.'
    ],
    originalText: `# CONTRAT DE LICENCE COMMERCIALE

**Entre les soussignés:**
1. **Paris Tech Solutions SAS**, représentée par M. Laurent Blanc.
2. **Distribuidora Global S.A.**

## Article 1: Objet
Le présent contrat définit les termes d'utilisation de la plateforme de traduction intelligente.

### Conditions financières:
- Redevance mensuelle: 12% du chiffre d'affaires
- Période d'évaluation: 30 jours`,
    translatedDocument: `# CONTRATO DE LICENCIA COMERCIAL

**Entre los abajo firmantes:**
1. **Paris Tech Solutions SAS**, representada por el Sr. Laurent Blanc.
2. **Distribuidora Global S.A.**

## Artículo 1: Objeto
El presente contrato define los términos de uso de la plataforma de traducción inteligente.

### Condiciones financieras:
- Regalía mensual: 12% de los ingresos brutos
- Período de evaluación: 30 días`,
    metadata: {
      docType: 'Legal Contract',
      tone: 'Legal & Official',
      wordCount: 120,
      pageCount: 2,
      formattingNotes: 'Preserved numbered sections and bold key clauses.'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  }
];

export function getUserHistory(userId: string): HistoryItem[] {
  try {
    const key = HISTORY_KEY_PREFIX + userId;
    const raw = localStorage.getItem(key);
    if (!raw) {
      if (userId === 'usr_demo_101') {
        const seeded: HistoryItem[] = SAMPLE_HISTORY_ITEMS.map(item => ({
          ...item,
          userId,
        }));
        localStorage.setItem(key, JSON.stringify(seeded));
        return seeded;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get user history', err);
    return [];
  }
}

export function saveToHistory(userId: string, result: TranslationResult): HistoryItem {
  const history = getUserHistory(userId);
  const newItem: HistoryItem = {
    ...result,
    userId,
  };

  // Avoid duplicates if saved already
  const filtered = history.filter(h => h.id !== result.id);
  const updated = [newItem, ...filtered];

  try {
    localStorage.setItem(HISTORY_KEY_PREFIX + userId, JSON.stringify(updated));
    window.dispatchEvent(new Event('history_updated'));
  } catch (err) {
    console.error('Failed to save history item', err);
  }

  return newItem;
}

export function deleteHistoryItem(userId: string, id: string): void {
  const history = getUserHistory(userId);
  const updated = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY_PREFIX + userId, JSON.stringify(updated));
    window.dispatchEvent(new Event('history_updated'));
  } catch (err) {
    console.error('Failed to delete history item', err);
  }
}

export function clearUserHistory(userId: string): void {
  try {
    localStorage.setItem(HISTORY_KEY_PREFIX + userId, JSON.stringify([]));
    window.dispatchEvent(new Event('history_updated'));
  } catch (err) {
    console.error('Failed to clear user history', err);
  }
}
