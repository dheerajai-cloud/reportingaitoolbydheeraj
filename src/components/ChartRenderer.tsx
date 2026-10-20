import React from 'react';
import { VisualChart } from '../types/report';

interface ChartRendererProps {
  chart: VisualChart;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ chart }) => {
  if (!chart.dataPoints || chart.dataPoints.length === 0) {
    return null;
  }

  const values = chart.dataPoints.map((d) => d.value);
  const baselines = chart.dataPoints.map((d) => d.baseline || 0);
  const maxVal = Math.max(...values, ...baselines, 1);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
            {chart.title}
          </h4>
          {chart.unit && (
            <p className="text-xs text-slate-700 dark:text-slate-200">
              Measured in: <span className="font-medium text-slate-800 dark:text-slate-100">{chart.unit}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
            <span className="text-slate-700 dark:text-slate-200">Achieved Result</span>
          </div>
          {baselines.some((b) => b > 0) && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-300 dark:bg-slate-700 inline-block" />
              <span className="text-slate-700 dark:text-slate-200">Baseline / Target</span>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="space-y-3.5 pt-2">
        {chart.dataPoints.map((dp, idx) => {
          const percentage = Math.min(100, Math.round((dp.value / maxVal) * 100));
          const baselinePercentage = dp.baseline
            ? Math.min(100, Math.round((dp.baseline / maxVal) * 100))
            : null;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="truncate max-w-[200px]">{dp.label}</span>
                <div className="flex items-center gap-2">
                  {dp.baseline !== undefined && dp.baseline > 0 && (
                    <span className="text-slate-600 dark:text-slate-300">
                      Base: {dp.baseline.toLocaleString()}
                    </span>
                  )}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {dp.value.toLocaleString()} {chart.unit || ''}
                  </span>
                </div>
              </div>

              <div className="relative w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                {/* Baseline marker bar if present */}
                {baselinePercentage !== null && (
                  <div
                    className="absolute top-0 bottom-0 bg-slate-300 dark:bg-slate-700 rounded-full"
                    style={{ width: `${baselinePercentage}%` }}
                  />
                )}
                {/* Actual result bar with gradient */}
                <div
                  className="absolute top-0 bottom-0 bg-linear-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
