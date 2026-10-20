import React from 'react';
import {
  FileSpreadsheet,
  History,
  Sparkles,
  PlusCircle,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  onNewReport: () => void;
  onOpenHistory: () => void;
  onOpenSamples: () => void;
  onOpenHelp: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewReport,
  onOpenHistory,
  onOpenSamples,
  onOpenHelp,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onNewReport}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:via-indigo-100 dark:to-blue-200 bg-clip-text text-transparent">
                ReportCraft AI
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 hidden sm:block">
              Executive Case Studies • Weekly & Monthly Reports • Visual Audits
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Load sample case studies or reports"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">Sample Templates</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="View saved reports"
          >
            <History className="w-4 h-4 text-blue-500" />
            <span className="hidden md:inline">History</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="How to use & Tips"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNewReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-sm transition-all shadow-indigo-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
