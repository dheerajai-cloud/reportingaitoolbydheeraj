import React, { useState } from 'react';
import { GeneratedReport, UploadedImage } from '../types/report';
import { ChartRenderer } from './ChartRenderer';
import { ScreenshotGallery } from './ScreenshotGallery';
import {
  downloadReportAsPDF,
  downloadReportAsWord,
  downloadReportAsExcel,
  downloadReportAsImage,
  printReportNative,
  formatReportAsMarkdown,
} from '../utils/exportUtils';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  Copy,
  Presentation,
  Check,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Edit3,
  CheckCircle,
  Clock,
  Building2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportViewerProps {
  report: GeneratedReport;
  onUpdateReport: (updated: GeneratedReport) => void;
  onOpenSlideDeck: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  onUpdateReport,
  onOpenSlideDeck,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  // Trigger celebratory confetti on initial view
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCopyMarkdown = async () => {
    const md = formatReportAsMarkdown(report);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePDFExport = async () => {
    try {
      setIsExportingPDF(true);
      await downloadReportAsPDF('report-canvas', report.suggestedFileName);
    } catch (err) {
      console.error('PDF Export error:', err);
      alert('Could not export PDF automatically. You can also use the "Print" button to save as PDF.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleImageExport = async () => {
    try {
      setIsExportingImage(true);
      await downloadReportAsImage('report-canvas', report.suggestedFileName);
    } catch (err) {
      console.error('Image Export error:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  const updateMetric = (index: number, key: string, value: any) => {
    const newMetrics = [...report.keyMetrics];
    newMetrics[index] = { ...newMetrics[index], [key]: value };
    onUpdateReport({ ...report, keyMetrics: newMetrics });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Floating Control Toolbar */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        {/* Left Status & Edit Mode */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Executive Ready
          </span>

          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isEditMode
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Done Editing' : 'Edit Text In-Place'}</span>
          </button>
        </div>

        {/* Right Export Options Menu */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Slide Deck presentation mode */}
          <button
            type="button"
            onClick={onOpenSlideDeck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xs"
            title="Open Interactive Presentation Slides"
          >
            <Presentation className="w-4 h-4" />
            <span>Slide Deck Mode</span>
          </button>

          {/* PDF Download */}
          <button
            type="button"
            disabled={isExportingPDF}
            onClick={handlePDFExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPDF ? 'Rendering PDF...' : 'Download PDF'}</span>
          </button>

          {/* Word .doc Download */}
          <button
            type="button"
            onClick={() => downloadReportAsWord(report)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Export as Microsoft Word (.doc) / Google Docs"
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Word (.doc)</span>
          </button>

          {/* Excel .xlsx Download */}
          <button
            type="button"
            onClick={() => downloadReportAsExcel(report)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Export KPI & Roadmap Data to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Excel (.xlsx)</span>
          </button>

          {/* PNG Image Download */}
          <button
            type="button"
            disabled={isExportingImage}
            onClick={handleImageExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Download as High-Res PNG Image"
          >
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>Image</span>
          </button>

          {/* Native Vector Print */}
          <button
            type="button"
            onClick={printReportNative}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Print or Save Vector PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Copy Markdown */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy as Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Printable Deliverable Container */}
      <div
        id="report-canvas"
        className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 lg:p-12 space-y-10 text-slate-900 dark:text-slate-100 print:p-0 print:border-none print:shadow-none"
      >
        {/* Header Branding & Metadata */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                {report.reportType.replace('-', ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Language: {report.language}
              </span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200 font-mono">
              Deliverable ID: #{report.id.substring(0, 8)}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            {isEditMode ? (
              <input
                type="text"
                value={report.title}
                onChange={(e) => onUpdateReport({ ...report, title: e.target.value })}
                className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white p-2 rounded border border-indigo-400 bg-indigo-50/20"
              />
            ) : (
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
                {report.title}
              </h1>
            )}

            {isEditMode ? (
              <input
                type="text"
                value={report.subtitle}
                onChange={(e) => onUpdateReport({ ...report, subtitle: e.target.value })}
                className="w-full text-base sm:text-lg text-slate-600 dark:text-slate-400 p-2 rounded border border-indigo-400 bg-indigo-50/20 mt-2"
              />
            ) : (
              <p className="mt-2 text-base sm:text-xl text-slate-600 dark:text-slate-400 font-medium">
                {report.subtitle}
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block flex items-center gap-1">
                <Building2 className="w-3 h-3 text-indigo-500" /> Client / Account
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                {report.meta.client || 'Client Confidential'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-500" /> Execution Period
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                {report.meta.timeframe || 'Recent Performance Cycle'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Review Status
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {report.meta.status || 'Verified & Approved'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-500" /> Published Date
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Key Performance Indicators (KPIs) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Key Performance Indicators (ROI & Impact)</span>
            </h2>
            <span className="text-xs text-slate-700 dark:text-slate-200">
              Baseline vs Achieved Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.keyMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                      className="font-bold text-xs p-1 border rounded w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  ) : (
                    <span className="font-semibold uppercase tracking-wider truncate text-slate-700 dark:text-slate-300">
                      {metric.label}
                    </span>
                  )}

                  {metric.changePercent && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      {metric.changePercent}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 my-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                      className="text-2xl font-extrabold p-1 border rounded w-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                    />
                  ) : (
                    <span className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                      {metric.value}
                    </span>
                  )}
                </div>

                {metric.previousValue && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                    <span>Baseline:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 line-through">
                      {metric.previousValue}
                    </span>
                  </div>
                )}

                {metric.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {metric.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Executive Summary */}
        <div className="p-6 sm:p-8 rounded-2xl bg-indigo-50/60 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-950 space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Executive Summary
          </div>
          {isEditMode ? (
            <textarea
              rows={4}
              value={report.executiveSummary}
              onChange={(e) => onUpdateReport({ ...report, executiveSummary: e.target.value })}
              className="w-full text-sm sm:text-base p-2 rounded border border-indigo-400 bg-white dark:bg-slate-800 leading-relaxed"
            />
          ) : (
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {report.executiveSummary}
            </p>
          )}
        </div>

        {/* Section: Challenge vs Solution Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              The Challenge & Bottleneck
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {report.challenge.headline}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.challenge.overview}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Critical Pain Points:
              </span>
              <ul className="space-y-2">
                {report.challenge.painPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Solution Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              Strategic Solution & Execution
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {report.solution.headline}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.solution.overview}
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Strategic Pillars:
              </span>
              <div className="space-y-2.5">
                {report.solution.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {pillar.title}
                      </span>
                      {pillar.tags && pillar.tags.length > 0 && (
                        <div className="flex gap-1">
                          {pillar.tags.map((t, tidx) => (
                            <span
                              key={tidx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Visual Charts */}
        {report.charts && report.charts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Performance Growth Trajectory
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {report.charts.map((chart) => (
                <ChartRenderer key={chart.id} chart={chart} />
              ))}
            </div>
          </div>
        )}

        {/* Section: Before vs After Comparison */}
        {report.beforeAfter && report.beforeAfter.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Before vs. After Transformation Matrix
              </h3>
              <span className="text-xs text-slate-700 dark:text-slate-200">
                Measurable Impact Comparison
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">Metric / Area</th>
                    <th className="p-3.5 text-rose-600 dark:text-rose-400">Baseline (Before)</th>
                    <th className="p-3.5 text-emerald-600 dark:text-emerald-400">Optimized (After)</th>
                    <th className="p-3.5">Key Impact Achieved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {report.beforeAfter.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {row.metric}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">
                        {row.before}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {row.after}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {row.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Screenshot Evidence Gallery (Attached Proofs) */}
        {report.images && report.images.length > 0 && (
          <ScreenshotGallery
            images={report.images}
            isEditable={isEditMode}
            onUpdateCaption={(id, caption) => {
              const updated = (report.images || []).map((img) =>
                img.id === id ? { ...img, caption } : img
              );
              onUpdateReport({ ...report, images: updated });
            }}
          />
        )}

        {/* Section: Action / Priority Matrix (for Audits & Roadmaps) */}
        {report.actionMatrix && report.actionMatrix.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Action & Optimization Priority Matrix
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">Area</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Key Finding / Gap</th>
                    <th className="p-3.5">Prescribed Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {report.actionMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {item.area}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            item.priority === 'High'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : item.priority === 'Medium'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">
                        {item.finding}
                      </td>
                      <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                        {item.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Testimonial / Stakeholder Endorsement */}
        {report.quote && (
          <div className="relative p-6 sm:p-8 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-950 text-white shadow-xl overflow-hidden">
            <div className="relative z-10 space-y-3">
              <p className="text-base sm:text-xl font-medium italic leading-relaxed">
                "{report.quote.statement}"
              </p>
              <div className="pt-2 text-xs sm:text-sm font-semibold text-indigo-200">
                — {report.quote.author}, {report.quote.role}
              </div>
            </div>
          </div>
        )}

        {/* Section: Strategic Next Steps & Roadmap */}
        {report.nextSteps && report.nextSteps.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Next Steps & Strategic Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {report.nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Phase 0{idx + 1}
                    </span>
                    <span className="font-mono text-slate-400">{step.timeline}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {step.step}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    Lead: <span className="font-medium text-slate-700 dark:text-slate-300">{step.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concluding Remarks & Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Executive Conclusion
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
              {report.concludingRemarks}
            </p>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-200 font-mono mt-4 sm:mt-0">
            Powered by ReportCraft AI • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};
