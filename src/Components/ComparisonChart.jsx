import React, { useState, useMemo } from 'react';
import { TIME_RANGES } from './constants';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const ComparisonChart = ({ funds }) => {
  const [range, setRange] = useState('1Y');

  const chartData = useMemo(() => {
    let days = 365;
    if (range === '5D') days = 5;
    if (range === '1M') days = 30;
    if (range === '6M') days = 180;
    if (range === '1Y') days = 365;

    const primaryFund = funds[0];
    if (!primaryFund) return [];

    const slicedData = primaryFund.history.slice(-days).map((point, index) => {
      const entry = { date: point.date };
      funds.forEach(f => {
        const fPoint = f.history[f.history.length - days + index];
        if (fPoint) {
          entry[f.id] = fPoint.value;
        }
      });
      return entry;
    });

    return slicedData;
  }, [funds, range]);

  const getColor = (theme) => {
    switch (theme) {
      case 'purple': return '#6e27ff';
      case 'teal': return '#00c4cc';
      case 'gold': return '#ffb700';
      default: return '#666';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">NAV Performance</h2>
          <p className="text-slate-500 text-sm mt-1">Growth of investment over time</p>
        </div>

        <div className="flex flex-wrap justify-center gap-1 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                range === r
                  ? 'bg-white text-fintech-teal shadow-md text-teal-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
              }}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '12px' }}
              itemStyle={{ fontSize: '14px', fontWeight: 600, padding: 0 }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {funds.map((fund) => (
              <Line
                key={fund.id}
                type="monotone"
                dataKey={fund.id}
                name={fund.name}
                stroke={getColor(fund.colorTheme)}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
