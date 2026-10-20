export type ReportType =
  | 'case-study'
  | 'weekly-report'
  | 'monthly-report'
  | 'growth-strategy'
  | 'audit'
  | 'competitor-analysis'
  | 'custom';

export type TargetLanguage =
  | 'English'
  | 'Hindi'
  | 'Hinglish'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Arabic';

export interface KeyMetric {
  label: string;
  value: string;
  previousValue?: string;
  changePercent?: string;
  isPositive?: boolean;
  description?: string;
}

export interface SolutionPillar {
  title: string;
  description: string;
  tags?: string[];
}

export interface ExecutionPhase {
  phase: string;
  timeline: string;
  highlights: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  baseline?: number;
  unit?: string;
}

export interface VisualChart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'donut';
  unit?: string;
  dataPoints: ChartDataPoint[];
}

export interface BeforeAfterItem {
  metric: string;
  before: string;
  after: string;
  impact: string;
}

export interface ActionItem {
  area: string;
  status: 'critical' | 'warning' | 'good';
  finding: string;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface NextStep {
  step: string;
  owner: string;
  timeline: string;
}

export interface TestimonialQuote {
  statement: string;
  author: string;
  role: string;
}

export interface UploadedImage {
  id: string;
  data: string; // base64 without prefix
  mimeType: string;
  previewUrl: string;
  name?: string;
  caption?: string;
}

export interface GeneratedReport {
  id: string;
  createdAt: string;
  title: string;
  subtitle: string;
  reportType: ReportType;
  language: TargetLanguage;
  meta: {
    client: string;
    project: string;
    timeframe: string;
    preparedBy: string;
    status: string;
  };
  executiveSummary: string;
  keyMetrics: KeyMetric[];
  challenge: {
    headline: string;
    overview: string;
    painPoints: string[];
  };
  solution: {
    headline: string;
    overview: string;
    pillars: SolutionPillar[];
  };
  executionPhases: ExecutionPhase[];
  charts: VisualChart[];
  beforeAfter: BeforeAfterItem[];
  actionMatrix?: ActionItem[];
  quote?: TestimonialQuote;
  nextSteps: NextStep[];
  concludingRemarks: string;
  suggestedFileName: string;
  images?: UploadedImage[];
}

export interface GenerateReportRequest {
  reportType: ReportType;
  targetLanguage: TargetLanguage;
  projectName?: string;
  clientName?: string;
  timeframe?: string;
  notes: string;
  fileData?: string;
  images?: { data: string; mimeType: string; caption?: string }[];
  tone?: string;
  highlightFocus?: string;
}
