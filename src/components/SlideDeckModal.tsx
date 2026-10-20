import React, { useState, useEffect } from 'react';
import { GeneratedReport } from '../types/report';
import { ChartRenderer } from './ChartRenderer';
import {
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Maximize2,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SlideDeckModalProps {
  report: GeneratedReport;
  onClose: () => void;
}

export const SlideDeckModal: React.FC<SlideDeckModalProps> = ({ report, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalSlides = 5;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between select-none">
      {/* Top Slide Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-indigo-600 text-xs font-bold uppercase tracking-wider">
            Executive Presentation
          </span>
          <span className="text-sm font-semibold text-slate-300 truncate max-w-md">
            {report.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Exit Slide Deck (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-5xl w-full">
          {/* SLIDE 0: Title & Executive Summary & Top 4 KPIs */}
          {currentSlide === 0 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                  {report.meta.client ? `${report.meta.client} • ` : ''}
                  {report.reportType.toUpperCase()}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {report.title}
                </h1>
                <p className="text-lg text-slate-300 font-light max-w-3xl">
                  {report.subtitle}
                </p>
              </div>

              {/* Top Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {report.keyMetrics.slice(0, 4).map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl"
                  >
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {m.label}
                    </div>
                    <div className="text-3xl font-extrabold text-indigo-400 mt-2">
                      {m.value}
                    </div>
                    {m.changePercent && (
                      <div className="text-xs font-bold text-emerald-400 mt-1">
                        {m.changePercent} vs baseline
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-sm text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">Executive Summary:</strong>
                {report.executiveSummary}
              </div>
            </div>
          )}

          {/* SLIDE 1: Challenge & Pain Points */}
          {currentSlide === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
                  The Problem & Bottleneck
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {report.challenge.headline}
                </h2>
                <p className="text-base text-slate-300 mt-2 max-w-3xl">
                  {report.challenge.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {report.challenge.painPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900 border border-rose-900/30 space-y-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                      0{idx + 1}
                    </div>
                    <h3 className="font-bold text-white text-base">Key Obstacle</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 2: Strategic Solution & Pillars */}
          {currentSlide === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                  Methodology & Strategy
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {report.solution.headline}
                </h2>
                <p className="text-base text-slate-300 mt-2 max-w-3xl">
                  {report.solution.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {report.solution.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                      Pillar {idx + 1}
                    </div>
                    <h3 className="font-bold text-white text-lg">{pillar.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3: Performance Trajectory & Charts */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                  Data-Backed Results
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  Performance Trajectory & ROI
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {report.charts && report.charts.length > 0 ? (
                  report.charts.map((c) => <ChartRenderer key={c.id} chart={c} />)
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900 text-slate-400 text-sm">
                    All performance targets achieved within scheduled sprint windows.
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white">
                    Transformation Highlights:
                  </h3>
                  {report.beforeAfter.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-400">{item.metric}</div>
                        <div className="text-sm font-semibold text-emerald-400">
                          {item.after}
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        Baseline: <span className="line-through">{item.before}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Next Steps & Conclusion */}
          {currentSlide === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                  Moving Forward
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  Strategic Next Steps & Recommendations
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {report.nextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="text-xs font-mono font-bold text-indigo-400">
                      STEP 0{idx + 1} • {step.timeline}
                    </div>
                    <h3 className="font-bold text-white text-base">{step.step}</h3>
                    <div className="text-xs text-slate-400">
                      Assigned Lead: <span className="text-slate-200">{step.owner}</span>
                    </div>
                  </div>
                ))}
              </div>

              {report.quote && (
                <div className="p-6 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-slate-200 italic text-base">
                  "{report.quote.statement}" —{' '}
                  <span className="font-bold text-white not-italic">
                    {report.quote.author}, {report.quote.role}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slide Navigation Footer */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <button
          type="button"
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={currentSlide === totalSlides - 1}
          onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-md"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
