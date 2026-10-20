import React from 'react';
import { X, CheckCircle2, ClipboardPaste, FileSpreadsheet, Download, Sparkles, Globe } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            How to Use ReportCraft AI (Simple Guide)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 space-y-1">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300">
              Hindi / Hinglish me bhi data de sakte ho:
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aap rough notes, short points, ya Hindi me type kar sakte ho. System automatically use samajh kar professional English ya aapki chuni hui language me high-impact case study ya report bana dega.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">
                  Select Deliverable Type & Output Language
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Choose whether you need a Case Study, Weekly Report, Monthly Business Report, SEO/PPC Audit, or Competitor Matrix. Pick English, Hindi, or any global language.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">
                  Paste Screenshots & Upload Files
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  You can press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px]">Ctrl+V</kbd> directly into the box to paste proof screenshots, or upload Excel/CSV sheets. Gemini extracts all numbers automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white">
                  Export in Any Format You Need
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Once generated, download as <strong>PDF</strong>, Microsoft <strong>Word (.doc)</strong>, <strong>Excel (.xlsx)</strong>, High-Res <strong>Image (PNG)</strong>, or open the interactive <strong>Slide Deck presentation</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
