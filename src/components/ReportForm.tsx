import React, { useState, useRef, useEffect } from 'react';
import {
  ReportType,
  TargetLanguage,
  UploadedImage,
  GenerateReportRequest,
} from '../types/report';
import { SAMPLE_TEMPLATES, SampleTemplate } from '../data/sampleTemplates';
import { parseUploadedFile, fileToBase64 } from '../utils/fileParser';
import {
  Sparkles,
  FileText,
  Calendar,
  Layers,
  Search,
  Sliders,
  Upload,
  Image as ImageIcon,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ClipboardPaste,
  HelpCircle,
  Building2,
  Clock,
  Globe,
} from 'lucide-react';

interface ReportFormProps {
  onGenerate: (payload: GenerateReportRequest, images: UploadedImage[]) => void;
  isGenerating: boolean;
  prefillTemplate?: SampleTemplate | null;
  onClearTemplate?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  onGenerate,
  isGenerating,
  prefillTemplate,
  onClearTemplate,
}) => {
  const [reportType, setReportType] = useState<ReportType>('case-study');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('English');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [notes, setNotes] = useState('');
  const [highlightFocus, setHighlightFocus] = useState('');
  const [tone, setTone] = useState('executive-sharp');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadedFilesSummary, setUploadedFilesSummary] = useState<string[]>([]);
  const [extractedFileText, setExtractedFileText] = useState('');
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Apply prefilled template when selected
  useEffect(() => {
    if (prefillTemplate) {
      setReportType(prefillTemplate.reportType);
      setTargetLanguage(prefillTemplate.targetLanguage);
      setProjectName(prefillTemplate.projectName);
      setClientName(prefillTemplate.clientName);
      setTimeframe(prefillTemplate.timeframe);
      setNotes(prefillTemplate.notes);
      setHighlightFocus(prefillTemplate.highlightFocus);
    }
  }, [prefillTemplate]);

  // Clipboard paste handler for screenshots directly in textarea or box
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    let foundImage = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        foundImage = true;
        const file = items[i].getAsFile();
        if (file) {
          const { data, mimeType } = await fileToBase64(file);
          const newImg: UploadedImage = {
            id: 'paste_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            data,
            mimeType,
            previewUrl: URL.createObjectURL(file),
            name: `Pasted_Screenshot_${uploadedImages.length + 1}.png`,
            caption: 'Performance proof / result metric capture',
          };
          setUploadedImages((prev) => [...prev, newImg]);
          setPasteNotice('Screenshot captured from clipboard!');
          setTimeout(() => setPasteNotice(null), 3500);
        }
      }
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const { data, mimeType } = await fileToBase64(file);
        const newImg: UploadedImage = {
          id: 'upload_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          data,
          mimeType,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
          caption: 'Visual proof / result capture',
        };
        setUploadedImages((prev) => [...prev, newImg]);
      }
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Document/Spreadsheet Upload handler (.xlsx, .csv, .txt, .docx)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const extracted = await parseUploadedFile(file);
        setExtractedFileText((prev) => prev + `\n\n--- [Attachment: ${file.name}] ---\n` + extracted);
        setUploadedFilesSummary((prev) => [...prev, `${file.name} (${Math.round(file.size / 1024)} KB)`]);
      } catch (err: any) {
        console.error('File parsing error:', err);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleRemoveFileAttachment = (index: number) => {
    setUploadedFilesSummary((prev) => prev.filter((_, idx) => idx !== index));
    if (uploadedFilesSummary.length <= 1) {
      setExtractedFileText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() && !extractedFileText && uploadedImages.length === 0) {
      alert('Please provide some notes, upload a document, or attach screenshots.');
      return;
    }

    const payload: GenerateReportRequest = {
      reportType,
      targetLanguage,
      projectName: projectName.trim() || undefined,
      clientName: clientName.trim() || undefined,
      timeframe: timeframe.trim() || undefined,
      notes: notes.trim(),
      fileData: extractedFileText.trim() || undefined,
      images: uploadedImages.map((img) => ({
        data: img.data,
        mimeType: img.mimeType,
        caption: img.caption,
      })),
      tone,
      highlightFocus: highlightFocus.trim() || undefined,
    };

    onGenerate(payload, uploadedImages);
  };

  const reportTypes = [
    {
      id: 'case-study',
      label: 'Case Study',
      icon: FileText,
      desc: 'Client showcase, challenge, solution, ROI, and before/after metrics',
    },
    {
      id: 'weekly-report',
      label: 'Weekly Report',
      icon: Calendar,
      desc: 'Sprint wins, ad spend/ROAS, deliverables, blockers & next priorities',
    },
    {
      id: 'monthly-report',
      label: 'Monthly Report',
      icon: Layers,
      desc: 'Executive business overview, MoM growth trajectory & key metrics',
    },
    {
      id: 'growth-strategy',
      label: 'Strategy & Roadmap',
      icon: Sliders,
      desc: 'Actionable pillars, quarterly milestones & resource allocation',
    },
    {
      id: 'audit',
      label: 'Audit & Analysis',
      icon: Search,
      desc: 'Website/SEO/PPC health check, bottlenecks & action priority matrix',
    },
    {
      id: 'competitor-analysis',
      label: 'Competitor Matrix',
      icon: Building2,
      desc: 'Market benchmarking, keyword gaps & competitive positioning',
    },
  ];

  const languages: { id: TargetLanguage; label: string; flag: string }[] = [
    { id: 'English', label: 'English (US / Executive)', flag: '🇺🇸' },
    { id: 'Hindi', label: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { id: 'Hinglish', label: 'Hinglish (Hindi + English)', flag: '🇮🇳' },
    { id: 'Spanish', label: 'Spanish (Español)', flag: '🇪🇸' },
    { id: 'French', label: 'French (Français)', flag: '🇫🇷' },
    { id: 'German', label: 'German (Deutsch)', flag: '🇩🇪' },
    { id: 'Arabic', label: 'Arabic (العربية)', flag: '🇦🇪' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Welcome banner */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Professional Case Studies & Executive Reports
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Provide raw notes in <span className="font-semibold text-indigo-600 dark:text-indigo-400">any language</span> (Hindi, Hinglish, broken bullets, or spreadsheets). We structure, highlight, and elevate them into high-converting deliverables.
          </p>
        </div>
      </div>

      {/* 1-Click Quick Sample Loaders */}
      <div className="mb-8 p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-950">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Quick Test: Load Pre-Built Samples (1-Click)
          </span>
          {prefillTemplate && onClearTemplate && (
            <button
              type="button"
              onClick={onClearTemplate}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              Reset to Blank
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => {
                setReportType(tmpl.reportType);
                setTargetLanguage(tmpl.targetLanguage);
                setProjectName(tmpl.projectName);
                setClientName(tmpl.clientName);
                setTimeframe(tmpl.timeframe);
                setNotes(tmpl.notes);
                setHighlightFocus(tmpl.highlightFocus);
              }}
              className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                projectName === tmpl.projectName
                  ? 'border-indigo-600 bg-white dark:bg-slate-800 shadow-sm ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-indigo-300'
              }`}
            >
              <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                {tmpl.name}
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-200 line-clamp-1 mt-0.5">
                {tmpl.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Deliverable Type */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            1. Select Deliverable Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {reportTypes.map((item) => {
              const Icon = item.icon;
              const isSelected = reportType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReportType(item.id as ReportType)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Language & Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Target Language */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              Target Output Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as TargetLanguage)}
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-700 dark:text-slate-200 mt-1 block">
              Provide input in Hindi or Hinglish; output translates cleanly to this selection.
            </span>
          </div>

          {/* Client / Brand Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              Client / Brand Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Acme Corp, UrbanStyle, Self"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Timeframe / Date
            </label>
            <input
              type="text"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="e.g. Q3 2026, Oct 12-18, 5 Months"
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Step 3: Raw Data Box with Screenshot Paste & File Upload */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
              2. Raw Notes, Results & Project Data
            </label>
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1">
              <ClipboardPaste className="w-3.5 h-3.5" />
              Tip: You can press Ctrl+V / Cmd+V to paste screenshots directly here!
            </span>
          </div>

          <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-colors focus-within:border-indigo-500">
            <textarea
              ref={textareaRef}
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onPaste={handlePaste}
              placeholder={`Write anything you want in Hindi, Hinglish, or English:
- Kaha se start kiya (Baseline status / problem)
- Kya solution implement kiya
- Kitna result aaya (Numbers, revenue, traffic, ROAS, conversions)
- Client ka feedback kaisa tha

Paste screenshots here directly with Ctrl+V or use the buttons below!`}
              className="w-full resize-y text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-hidden font-normal leading-relaxed"
            />

            {pasteNotice && (
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {pasteNotice}
              </div>
            )}

            {/* Bottom Actions toolbar inside textarea box */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Upload Screenshots button */}
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  <span>Upload Screenshot</span>
                </button>

                {/* Upload Spreadsheet / Document button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.csv,.docx,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Upload Excel / Doc / CSV</span>
                </button>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                {notes.length} characters • {uploadedImages.length} images • {uploadedFilesSummary.length} docs
              </div>
            </div>
          </div>
        </div>

        {/* Attached Files & Screenshots Preview Strip */}
        {(uploadedImages.length > 0 || uploadedFilesSummary.length > 0) && (
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Attached Media & Evidence</span>
              <span className="text-[11px] font-normal text-slate-400">
                These will be analyzed by Gemini and included in the final report.
              </span>
            </div>

            {/* Screenshots list */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative group w-24 h-24 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 flex items-center justify-center shadow-xs"
                  >
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded Documents tags */}
            {uploadedFilesSummary.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {uploadedFilesSummary.map((fname, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    {fname}
                    <button
                      type="button"
                      onClick={() => handleRemoveFileAttachment(idx)}
                      className="text-emerald-700 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Key Highlights & Tone Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Highlights / What to Emphasize? (Optional)
            </label>
            <input
              type="text"
              value={highlightFocus}
              onChange={(e) => setHighlightFocus(e.target.value)}
              placeholder="e.g. Focus on 10x traffic jump, ROAS improvement, or PageSpeed fix"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Report Tone & Style
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="executive-sharp">Executive & Boardroom Ready (Crisp & High-Impact)</option>
              <option value="client-presentation">Client-Facing Sales Pitch (Persuasive & Engaging)</option>
              <option value="data-driven">Data-Driven & Analytical (Metrics Deep-Dive)</option>
              <option value="strategic-action">Action-Oriented & Tactical (Prioritized Roadmaps)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-xl flex items-center justify-center gap-2.5 transition-all ${
              isGenerating
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Architecting Executive Report with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Executive Report ({reportType.toUpperCase()})</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-700 dark:text-slate-200 mt-2">
            Non-technical friendly • Generates structured KPIs, visual charts, before/after, and multi-format exports.
          </p>
        </div>
      </form>
    </div>
  );
};
