import React, { useState, useEffect } from 'react';
import { GeneratedReport, GenerateReportRequest, UploadedImage } from './types/report';
import { SampleTemplate, SAMPLE_TEMPLATES } from './data/sampleTemplates';
import { Navbar } from './components/Navbar';
import { ReportForm } from './components/ReportForm';
import { ReportViewer } from './components/ReportViewer';
import { SlideDeckModal } from './components/SlideDeckModal';
import { HistoryModal } from './components/HistoryModal';
import { SampleTemplatesModal } from './components/SampleTemplatesModal';
import { HelpModal } from './components/HelpModal';
import { AlertCircle, RefreshCw, Sparkles, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'reportcraft_saved_reports_v1';

export default function App() {
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Modals
  const [isSlideDeckOpen, setIsSlideDeckOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Prefill template state
  const [selectedTemplate, setSelectedTemplate] = useState<SampleTemplate | null>(null);

  // Saved reports history from localStorage
  const [savedHistory, setSavedHistory] = useState<GeneratedReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));
    } catch (e) {
      console.warn('Failed to save report history to localStorage:', e);
    }
  }, [savedHistory]);

  const handleGenerate = async (
    payload: GenerateReportRequest,
    images: UploadedImage[]
  ) => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Server failed to generate deliverable.');
      }

      const generatedData = json.data;

      const newReport: GeneratedReport = {
        id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
        title: generatedData.title || 'Executive Performance Deliverable',
        subtitle:
          generatedData.subtitle ||
          'Comprehensive Strategic Analysis & Results Overview',
        reportType: payload.reportType,
        language: payload.targetLanguage,
        meta: {
          client: payload.clientName || generatedData.meta?.client || 'Confidential Client',
          project: payload.projectName || generatedData.meta?.project || 'Growth Sprint',
          timeframe: payload.timeframe || generatedData.meta?.timeframe || 'Recent Cycle',
          preparedBy: generatedData.meta?.preparedBy || 'ReportCraft Executive Studio',
          status: generatedData.meta?.status || 'Final Approved',
        },
        executiveSummary:
          generatedData.executiveSummary ||
          'Strategic outcomes achieved exceeding projected baselines across all core performance vectors.',
        keyMetrics: generatedData.keyMetrics || [],
        challenge: generatedData.challenge || {
          headline: 'Initial Performance & Market Constraints',
          overview: 'Key bottlenecks identified prior to strategic intervention.',
          painPoints: [],
        },
        solution: generatedData.solution || {
          headline: 'Targeted Multi-Phase Strategy',
          overview: 'Implementation methodology across core execution pillars.',
          pillars: [],
        },
        executionPhases: generatedData.executionPhases || [],
        charts: generatedData.charts || [],
        beforeAfter: generatedData.beforeAfter || [],
        actionMatrix: generatedData.actionMatrix || [],
        quote: generatedData.quote,
        nextSteps: generatedData.nextSteps || [],
        concludingRemarks:
          generatedData.concludingRemarks ||
          'Demonstrated high-ROI trajectory with sustained compounding benefits for ongoing cycles.',
        suggestedFileName:
          generatedData.suggestedFileName ||
          `${(payload.clientName || 'Report').replace(/\s+/g, '_')}_${payload.reportType}`,
        images: images,
      };

      setCurrentReport(newReport);
      setSavedHistory((prev) => [newReport, ...prev]);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Report Generation Error:', err);
      setGenerationError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateReport = (updated: GeneratedReport) => {
    setCurrentReport(updated);
    setSavedHistory((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteReport = (id: string) => {
    setSavedHistory((prev) => prev.filter((r) => r.id !== id));
    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear your saved reports history?')) {
      setSavedHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        onNewReport={() => setCurrentReport(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        savedCount={savedHistory.length}
      />

      <main className="flex-1 pb-16">
        {generationError && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-start justify-between gap-3 text-rose-800 dark:text-rose-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Generation Error</h4>
                  <p className="text-xs mt-0.5">{generationError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGenerationError(null)}
                className="text-xs font-semibold px-2 py-1 rounded bg-rose-200 dark:bg-rose-900 hover:bg-rose-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentReport ? (
          <div>
            <div className="max-w-6xl mx-auto px-4 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentReport(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-3 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Create Another Report / Back to Editor</span>
              </button>
            </div>

            <ReportViewer
              report={currentReport}
              onUpdateReport={handleUpdateReport}
              onOpenSlideDeck={() => setIsSlideDeckOpen(true)}
            />
          </div>
        ) : (
          <ReportForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            prefillTemplate={selectedTemplate}
            onClearTemplate={() => setSelectedTemplate(null)}
          />
        )}
      </main>

      {/* Slide Deck Presentation Modal */}
      {isSlideDeckOpen && currentReport && (
        <SlideDeckModal
          report={currentReport}
          onClose={() => setIsSlideDeckOpen(false)}
        />
      )}

      {/* History Drawer / Modal */}
      {isHistoryOpen && (
        <HistoryModal
          history={savedHistory}
          onSelectReport={(rep) => setCurrentReport(rep)}
          onDeleteReport={handleDeleteReport}
          onClearAll={handleClearAllHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Sample Templates Modal */}
      {isSamplesOpen && (
        <SampleTemplatesModal
          onSelect={(tmpl) => {
            setSelectedTemplate(tmpl);
            setCurrentReport(null);
          }}
          onClose={() => setIsSamplesOpen(false)}
        />
      )}

      {/* Help Modal */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
