import React from 'react';
import { SAMPLE_TEMPLATES, SampleTemplate } from '../data/sampleTemplates';
import { X, Sparkles, ArrowRight, Check } from 'lucide-react';

interface SampleTemplatesModalProps {
  onSelect: (template: SampleTemplate) => void;
  onClose: () => void;
}

export const SampleTemplatesModal: React.FC<SampleTemplatesModalProps> = ({
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Pre-Loaded Industry Scenarios
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-200">
              Pick any scenario below to see how raw notes transform into an executive deliverable.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelect(tmpl);
                onClose();
              }}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-indigo-400 cursor-pointer transition-all shadow-xs group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {tmpl.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Client: {tmpl.clientName}
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Load Template <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {tmpl.name}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {tmpl.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-mono text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                "{tmpl.notes.substring(0, 160)}..."
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
