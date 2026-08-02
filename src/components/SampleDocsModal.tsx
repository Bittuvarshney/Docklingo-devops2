import React from 'react';
import { X, Sparkles, ArrowRight, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SampleDoc {
  id: string;
  title: string;
  language: string;
  flag: string;
  category: string;
  snippet: string;
  fullText: string;
}

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: 'sample_jp',
    title: 'Tokyo AI Engine Specification',
    language: 'Japanese',
    flag: '🇯🇵',
    category: 'Technical Architecture',
    snippet: '東京および大阪データセンター間での自動フェイルオーバーと低遅延AI推論エンジン...',
    fullText: `# 東京AI推論アーキテクチャ概要

## 1. システム目的
本システムは、低遅延かつ高可用性を持つグローバルAI翻訳エンジンを構築することを目的とします。

### 主要コンポーネント一覧:
1. **エッジ Gateway**: リクエスト検証およびダイナミックルーティング (応答時間 < 2ms)
2. **Gemini 2.5 Flash**: 文脈解析およびリアルタイム多言語翻訳 (応答時間 < 100ms)
3. **分散ストレージ**: ユーザー履歴管理およびリアルタイム同期 (応答時間 < 10ms)

| コンポーネント | 役割 | 応答時間 | 冗長性 |
| :--- | :--- | :--- | :--- |
| エッジ gateway | リクエスト検証 | < 2ms | アクティブ/アクティブ |
| Gemini 2.5 Flash | AI文脈解析 | < 100ms | 自動スケーリング |
| ストレージ | 履歴データ | < 10ms | マルチリージョン |

### 重要要件
- **フェイルオーバー**: 東京および大阪データセンター間での自動切り替え
- **セキュリティ**: データの暗号化 (AES-256) および TLS 1.3 義務化`
  },
  {
    id: 'sample_es',
    title: 'Contrato de Licencia Comercial',
    language: 'Spanish',
    flag: '🇪🇸',
    category: 'Legal Agreement',
    snippet: 'Acuerdo legal entre Paris Tech Solutions y el distribuidor internacional...',
    fullText: `# CONTRATO DE LICENCIA DE SOFTWARE COMERCIAL

**Entre los abajo firmantes:**
1. **Paris Tech Solutions SAS**, con domicilio social en París, Francia.
2. **Distribuidora Global S.A.**, representada por su Director Ejecutivo.

## Artículo 1: Objeto del Contrato
El presente contrato establece los términos y condiciones bajo los cuales el Licenciante otorga al Licenciatario una licencia no exclusiva para la comercialización de la plataforma.

### Términos clave:
- **Duración del acuerdo**: 24 meses con renovación automática.
- **Regalías**: 12% sobre las ventas brutas trimestrales.
- **Período de prueba**: 30 días naturales a partir de la firma.

| Concepto | Porcentaje | Frecuencia de Pago |
| :--- | :--- | :--- |
| Regalía base | 12% | Trimestral |
| Soporte técnico | 3% | Mensual |`
  },
  {
    id: 'sample_de',
    title: 'Klinische Studie - AI Diagnostik',
    language: 'German',
    flag: '🇩🇪',
    category: 'Medical Research Report',
    snippet: 'Ergebnisse der klinischen Studie zur automatisierten Bildanalyse...',
    fullText: `# KLINISCHE STUDIE: KI-GESTÜTZTE DIAGNOSTIK

## Zusammenfassung der Ergebnisse
Diese Studie untersucht die Präzision von neuronalen Netzwerken bei der Früherkennung von Gewebeveränderungen.

### Hauptergebnisse:
- **Sensitivität**: 98,4% bei der Erkennung frühzeitiger Läsionen.
- **Spezifität**: 96,1% im Vergleich zu erfahrenen Radiologen.
- **Verarbeitungszeit**: Durchschnittlich 1,2 Sekunden pro Datensatz.

| Parameter | KI-System | Kontrollgruppe |
| :--- | :--- | :--- |
| Genauigkeit | 97,8% | 94,2% |
| Analysezeit | 1,2s | 45,0s |`
  },
  {
    id: 'sample_fr',
    title: 'Plan Stratégique Business 2026',
    language: 'French',
    flag: '🇫🇷',
    category: 'Business Strategy',
    snippet: 'Feuille de route stratégique pour le déploiement international...',
    fullText: `# PLAN STRATÉGIQUE ET FEUILLE DE ROUTE 2026

## 1. Vision et Objectifs
Expansion de la plateforme de traduction intelligente sur les marchés européen et asiatique.

### Axes stratégiques:
1. **Pénétration du marché**: Cibler les entreprises du Fortune 500.
2. **Innovation R&D**: Intégration continue des modèles multimodaux Gemini.
3. **Rétention client**: Taux de satisfaction supérieur à 95%.`
  }
];

interface SampleDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (text: string, langName: string) => void;
}

export const SampleDocsModal: React.FC<SampleDocsModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden text-slate-800"
          >
            
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Sample Multilingual Documents</h2>
                  <p className="text-xs text-slate-500 font-medium">Test translation & layout preservation with 1 click</p>
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

            {/* Sample Items Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {SAMPLE_DOCS.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl space-y-3 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 flex items-center gap-1">
                        <span>{doc.flag}</span>
                        <span>{doc.language}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {doc.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed font-normal">
                      {doc.snippet}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectSample(doc.fullText, doc.language);
                      onClose();
                    }}
                    className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Translate This Sample</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

