import React, { useState } from 'react';
import FundCard from './FundCard';
import ComparisonChart from './ComparisonChart';
import PerformanceHeatmap from './PerformanceHeatmap';
import HoldingsTable from './HoldingsTable';
import { MOCK_FUNDS } from './constants';
import Tablenav from './Tablenav';

function FundComparison() {
  const [selectedFunds] = useState(MOCK_FUNDS);

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-fintech-teal/20">
        <div> 
   <Tablenav />
   </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-8">
        
        {/* Page Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Fund Comparison
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Detailed analysis of NAV, CAGR, holdings & risk metrics.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Last Updated
            </p>
            <p className="text-sm font-medium text-slate-700">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedFunds.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </section>

        {/* Comparison Chart */}
        <section>
          <ComparisonChart funds={selectedFunds} />
        </section>

        {/* Heatmap & Metrics */}
        <section>
          <PerformanceHeatmap funds={selectedFunds} />
        </section>

        {/* Holdings Comparison */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Top Holdings</h2>
            <button className="text-sm text-fintech-purple font-semibold hover:underline">
              Download CSV
            </button>
          </div>

          <HoldingsTable funds={selectedFunds} />
        </section>

      </main>

    </div>
  );
}

export default FundComparison;
