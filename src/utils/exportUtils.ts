import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { GeneratedReport } from '../types/report';

/**
 * Download the report as a PDF using html2canvas & jsPDF
 */
export async function downloadReportAsPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Report element not found');
  }

  // Temporary clone or styling adjustment for crisp capture
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1200,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${filename || 'Report'}.pdf`);
}

/**
 * Trigger native print dialog for 100% crisp vector PDF print
 */
export function printReportNative(): void {
  window.print();
}

/**
 * Download as Microsoft Word / Google Docs compatible (.doc)
 */
export function downloadReportAsWord(report: GeneratedReport): void {
  const content = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${report.title}</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 20px; }
        h1 { color: #0f172a; font-size: 24pt; margin-bottom: 4px; }
        h2 { color: #2563eb; font-size: 16pt; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
        h3 { color: #334155; font-size: 13pt; margin-top: 14px; }
        .subtitle { color: #64748b; font-size: 14pt; margin-bottom: 20px; }
        .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 24px; border-radius: 6px; }
        .metric-table { width: 100%; border-collapse: collapse; margin: 18px 0; }
        .metric-table th, .metric-table td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        .metric-table th { background: #f1f5f9; color: #0f172a; }
        .highlight-val { font-weight: bold; color: #16a34a; font-size: 14pt; }
        .quote-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px; font-style: italic; margin: 20px 0; }
        .footer { margin-top: 40px; font-size: 9pt; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <div class="subtitle">${report.subtitle}</div>

      <div class="meta-box">
        <strong>Client:</strong> ${report.meta.client || 'N/A'} &nbsp;|&nbsp; 
        <strong>Timeframe:</strong> ${report.meta.timeframe || 'N/A'} &nbsp;|&nbsp; 
        <strong>Deliverable:</strong> ${report.reportType.toUpperCase()} &nbsp;|&nbsp;
        <strong>Status:</strong> ${report.meta.status}
      </div>

      <h2>Executive Summary</h2>
      <p>${report.executiveSummary.replace(/\n/g, '<br/>')}</p>

      <h2>Key Performance Indicators (KPIs)</h2>
      <table class="metric-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Result Achieved</th>
            <th>Previous / Baseline</th>
            <th>Growth / Delta</th>
            <th>Context</th>
          </tr>
        </thead>
        <tbody>
          ${report.keyMetrics
            .map(
              (m) => `
            <tr>
              <td><strong>${m.label}</strong></td>
              <td class="highlight-val">${m.value}</td>
              <td>${m.previousValue || '-'}</td>
              <td><strong>${m.changePercent || '-'}</strong></td>
              <td>${m.description || '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2>The Challenge & Baseline</h2>
      <h3>${report.challenge.headline}</h3>
      <p>${report.challenge.overview}</p>
      <ul>
        ${report.challenge.painPoints.map((p) => `<li>${p}</li>`).join('')}
      </ul>

      <h2>Strategic Solution & Core Pillars</h2>
      <h3>${report.solution.headline}</h3>
      <p>${report.solution.overview}</p>
      ${report.solution.pillars
        .map(
          (p) => `
        <div style="margin-bottom: 12px;">
          <strong>• ${p.title}:</strong> ${p.description}
          ${p.tags ? `<em>[${p.tags.join(', ')}]</em>` : ''}
        </div>
      `
        )
        .join('')}

      <h2>Execution Roadmap</h2>
      ${report.executionPhases
        .map(
          (phase) => `
        <h3>${phase.phase} (${phase.timeline})</h3>
        <ul>
          ${phase.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
      `
        )
        .join('')}

      <h2>Before vs After Comparison</h2>
      <table class="metric-table">
        <thead>
          <tr>
            <th>Area / Metric</th>
            <th>Before Intervention</th>
            <th>After Optimization</th>
            <th>Direct Impact</th>
          </tr>
        </thead>
        <tbody>
          ${report.beforeAfter
            .map(
              (item) => `
            <tr>
              <td><strong>${item.metric}</strong></td>
              <td style="color: #dc2626;">${item.before}</td>
              <td style="color: #16a34a; font-weight: bold;">${item.after}</td>
              <td>${item.impact}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      ${
        report.actionMatrix && report.actionMatrix.length > 0
          ? `
        <h2>Action & Priority Matrix</h2>
        <table class="metric-table">
          <thead>
            <tr>
              <th>Focus Area</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Finding</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            ${report.actionMatrix
              .map(
                (act) => `
              <tr>
                <td><strong>${act.area}</strong></td>
                <td>${act.status.toUpperCase()}</td>
                <td><strong>${act.priority}</strong></td>
                <td>${act.finding}</td>
                <td>${act.recommendation}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      ${
        report.quote
          ? `
        <div class="quote-box">
          "${report.quote.statement}"<br/>
          <strong>— ${report.quote.author}, ${report.quote.role}</strong>
        </div>
      `
          : ''
      }

      <h2>Strategic Next Steps</h2>
      <table class="metric-table">
        <thead>
          <tr>
            <th>Action Item</th>
            <th>Owner</th>
            <th>Target Timeline</th>
          </tr>
        </thead>
        <tbody>
          ${report.nextSteps
            .map(
              (step) => `
            <tr>
              <td>${step.step}</td>
              <td>${step.owner}</td>
              <td>${step.timeline}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2>Concluding Remarks</h2>
      <p>${report.concludingRemarks}</p>

      <div class="footer">
        Generated by ReportCraft AI • Confidential & Executive Deliverable
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.suggestedFileName || 'Executive_Report'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download structured data as Excel (.xlsx)
 */
export function downloadReportAsExcel(report: GeneratedReport): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary & Meta
  const summaryData = [
    ['REPORT TITLE', report.title],
    ['SUBTITLE', report.subtitle],
    ['CLIENT', report.meta.client || ''],
    ['TIMEFRAME', report.meta.timeframe || ''],
    ['DELIVERABLE TYPE', report.reportType],
    ['STATUS', report.meta.status],
    ['EXECUTIVE SUMMARY', report.executiveSummary],
    ['CONCLUDING REMARKS', report.concludingRemarks],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Sheet 2: Key Metrics
  const metricsData = [
    ['Metric Label', 'Achieved Value', 'Baseline Value', 'Change %', 'Context / Description'],
    ...report.keyMetrics.map((m) => [
      m.label,
      m.value,
      m.previousValue || '',
      m.changePercent || '',
      m.description || '',
    ]),
  ];
  const wsMetrics = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(wb, wsMetrics, 'Key Metrics');

  // Sheet 3: Before vs After
  const beforeAfterData = [
    ['Area / Metric', 'Before', 'After', 'Impact'],
    ...report.beforeAfter.map((b) => [b.metric, b.before, b.after, b.impact]),
  ];
  const wsBeforeAfter = XLSX.utils.aoa_to_sheet(beforeAfterData);
  XLSX.utils.book_append_sheet(wb, wsBeforeAfter, 'Before vs After');

  // Sheet 4: Action Matrix / Audit (if any)
  if (report.actionMatrix && report.actionMatrix.length > 0) {
    const actionData = [
      ['Focus Area', 'Status', 'Priority', 'Key Finding', 'Recommendation'],
      ...report.actionMatrix.map((a) => [
        a.area,
        a.status,
        a.priority,
        a.finding,
        a.recommendation,
      ]),
    ];
    const wsAction = XLSX.utils.aoa_to_sheet(actionData);
    XLSX.utils.book_append_sheet(wb, wsAction, 'Action Matrix');
  }

  // Sheet 5: Next Steps Roadmap
  const nextStepsData = [
    ['Action Step', 'Owner', 'Timeline'],
    ...report.nextSteps.map((s) => [s.step, s.owner, s.timeline]),
  ];
  const wsNext = XLSX.utils.aoa_to_sheet(nextStepsData);
  XLSX.utils.book_append_sheet(wb, wsNext, 'Roadmap & Next Steps');

  XLSX.writeFile(wb, `${report.suggestedFileName || 'Report_Data'}.xlsx`);
}

/**
 * Capture high-resolution image of the report element (PNG)
 */
export async function downloadReportAsImage(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Report element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: 1200,
  });

  const link = document.createElement('a');
  link.download = `${filename || 'Report_Visual'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Generate clean Markdown string for clipboard
 */
export function formatReportAsMarkdown(report: GeneratedReport): string {
  return `# ${report.title}
_${report.subtitle}_

**Client:** ${report.meta.client || 'N/A'} | **Timeframe:** ${report.meta.timeframe || 'N/A'} | **Type:** ${report.reportType}

---

## Executive Summary
${report.executiveSummary}

---

## Key Performance Indicators (KPIs)
${report.keyMetrics.map((m) => `- **${m.label}:** \`${m.value}\` (${m.changePercent || ''} vs ${m.previousValue || 'baseline'}) — ${m.description || ''}`).join('\n')}

---

## The Challenge
### ${report.challenge.headline}
${report.challenge.overview}

${report.challenge.painPoints.map((p) => `- ${p}`).join('\n')}

---

## Strategic Solution
### ${report.solution.headline}
${report.solution.overview}

${report.solution.pillars.map((p) => `### ${p.title}\n${p.description}\n`).join('\n')}

---

## Before vs After
| Metric | Before | After | Impact |
| --- | --- | --- | --- |
${report.beforeAfter.map((b) => `| ${b.metric} | ${b.before} | ${b.after} | ${b.impact} |`).join('\n')}

---

## Strategic Roadmap
${report.nextSteps.map((s) => `1. **${s.step}** (${s.owner} — ${s.timeline})`).join('\n')}

---

## Conclusion
${report.concludingRemarks}
`;
}
