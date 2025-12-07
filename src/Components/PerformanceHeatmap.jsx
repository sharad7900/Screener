import React from 'react';

const METRICS_CONFIG = [
  { key: 'metrics.pe', label: 'P/E Ratio', good: 'low', format: (v) => v.toFixed(1) },
  { key: 'metrics.pb', label: 'P/B Ratio', good: 'low', format: (v) => v.toFixed(1) },
  { key: 'metrics.alpha', label: 'Alpha', good: 'high', format: (v) => v.toFixed(2) },
  { key: 'metrics.beta', label: 'Beta', good: 'low', format: (v) => v.toFixed(2) },
  { key: 'metrics.sharpe', label: 'Sharpe Ratio', good: 'high', format: (v) => v.toFixed(2) },
  { key: 'metrics.roce', label: 'ROCE %', good: 'high', format: (v) => v.toFixed(1) + '%' },
  { key: 'metrics.roe', label: 'ROE %', good: 'high', format: (v) => v.toFixed(1) + '%' },
];

const PerformanceHeatmap = ({ funds }) => {
  const getValue = (fund, path) => {
    return path.split('.').reduce((o, i) => o[i], fund);
  };

  const getCellColor = (value, metricKey, allValues) => {
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const config = METRICS_CONFIG.find((m) => m.key === metricKey);

    if (!config || min === max) return 'bg-slate-50';

    let percentage = (value - min) / (max - min);

    if (config.good === 'low') {
      percentage = 1 - percentage;
    }

    if (percentage > 0.66)
      return 'bg-emerald-100 text-emerald-800 font-bold border-emerald-200';
    if (percentage > 0.33)
      return 'bg-yellow-50 text-yellow-700 font-medium border-yellow-200';

    return 'bg-red-50 text-red-700 font-medium border-red-100';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Risk & Return Metrics</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[600px] grid grid-cols-[150px_repeat(3,1fr)] gap-4">
          
          {/* Header Row */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider self-end pb-2">
            Metric
          </div>

          {funds.map((f) => (
            <div key={f.id} className="text-center pb-2 border-b border-slate-200">
              <span
                className={`text-sm font-bold ${
                  f.colorTheme === 'purple'
                    ? 'text-fintech-purple'
                    : f.colorTheme === 'teal'
                    ? 'text-fintech-teal'
                    : 'text-fintech-gold'
                }`}
              >
                {f.ticker}
              </span>
            </div>
          ))}

          {/* Metric Rows */}
          {METRICS_CONFIG.map((metric) => {
            const rowValues = funds.map((f) => getValue(f, metric.key));

            return (
              <React.Fragment key={metric.key}>
                <div className="flex items-center text-sm font-medium text-slate-600 py-2">
                  {metric.label}
                </div>

                {funds.map((f, i) => (
                  <div key={`${f.id}-${metric.key}`} className="p-1">
                    <div
                      className={`h-full w-full rounded-lg flex items-center justify-center py-2.5 px-4 text-sm border transition-colors 
                      ${getCellColor(rowValues[i], metric.key, rowValues)}`}
                    >
                      {metric.format(rowValues[i])}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;
