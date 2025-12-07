export interface NAVPoint {
  date: string;
  value: number;
}

export interface Holding {
  asset: string;
  assetClass: 'Equity' | 'Debt' | 'Cash';
  sector: string;
  percentage: number;
}

export interface Metrics {
  pe: number;
  pb: number;
  alpha: number;
  beta: number;
  sharpe: number;
  sortino: number;
  roce: number;
  roe: number;
}

export interface Fund {
  id: string;
  name: string;
  ticker: string;
  category: string;
  nav: number;
  cagr1Y: number;
  changePercentage: number;
  expenseRatio: number;
  inceptionDate: string;
  exitLoad: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  metrics: Metrics;
  holdings: Holding[];
  history: NAVPoint[];
  colorTheme: 'purple' | 'teal' | 'gold';
}

export type TimeRange = '5D' | '1M' | '6M' | 'YTD' | '1Y' | '3Y' | '5Y' | 'Max';
