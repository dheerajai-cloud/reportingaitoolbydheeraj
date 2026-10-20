import React from 'react';
import { GeneratedReport } from '../types/report';
import { X, Trash2, Calendar, FileText, ArrowUpRight, ExternalLink } from 'lucide-react';

interface HistoryModalProps {
  history: GeneratedReport[];
  onSelectReport: (report: GeneratedReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onSelectReport,
  onDeleteReport,
  onClearAll,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Generated Reports History
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-200">
              {history.length} {history.length === 1 ? 'report saved locally' : 'reports saved locally'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2.5 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-semibold">No saved reports yet</p>
              <p className="text-xs">
                Generated case studies and reports will automatically be saved here so you never lose them.
              </p>
            </div>
          ) : (
            history.map((rep) => (
              <div
                key={rep.id}
                onClick={() => {
                  onSelectReport(rep);
                  onClose();
                }}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {rep.reportType}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                    {rep.meta.client && (
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        • {rep.meta.client}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {rep.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-200 truncate">
                    {rep.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(rep.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
