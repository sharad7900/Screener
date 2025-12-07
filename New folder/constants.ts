import { Fund, TimeRange } from './types';

// Helper to generate a wavy line for charts
const generateHistory = (startValue: number, days: number, volatility: number): { date: string, value: number }[] => {
  let currentValue = startValue;
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk
    const change = (Math.random() - 0.48) * volatility; 
    currentValue = currentValue * (1 + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(currentValue.toFixed(2))
    });
  }
  return data;
};

export const TIME_RANGES: TimeRange[] = ['5D', '1M', '6M', 'YTD', '1Y', '3Y', '5Y', 'Max'];

export const MOCK_FUNDS: Fund[] = [
  {
    id: 'f1',
    name: 'Quantum BlueChip Growth',
    ticker: 'QBCG',
    category: 'Large Cap',
    nav: 145.23,
    cagr1Y: 18.5,
    changePercentage: 1.25,
    expenseRatio: 0.75,
    inceptionDate: '2015-04-12',
    exitLoad: '1% if < 1yr',
    risk: 'Moderate',
    colorTheme: 'purple',
    metrics: {
      pe: 24.5,
      pb: 3.2,
      alpha: 2.1,
      beta: 0.95,
      sharpe: 1.8,
      sortino: 2.1,
      roce: 15.4,
      roe: 14.2
    },
    holdings: [
      { asset: 'HDFC Bank', assetClass: 'Equity', sector: 'Financials', percentage: 9.5 },
      { asset: 'Reliance Ind.', assetClass: 'Equity', sector: 'Energy', percentage: 8.2 },
      { asset: 'Infosys', assetClass: 'Equity', sector: 'Technology', percentage: 6.8 },
      { asset: 'ICICI Bank', assetClass: 'Equity', sector: 'Financials', percentage: 5.4 },
      { asset: 'TCS', assetClass: 'Equity', sector: 'Technology', percentage: 4.9 },
    ],
    history: generateHistory(100, 365, 0.015),
  },
  {
    id: 'f2',
    name: 'Nebula MidCap Emerging',
    ticker: 'NMCE',
    category: 'Mid Cap',
    nav: 88.45,
    cagr1Y: 26.8,
    changePercentage: -0.45,
    expenseRatio: 1.10,
    inceptionDate: '2018-08-20',
    exitLoad: '1% if < 1yr',
    risk: 'High',
    colorTheme: 'teal',
    metrics: {
      pe: 32.1,
      pb: 4.5,
      alpha: 4.5,
      beta: 1.25,
      sharpe: 1.2,
      sortino: 1.5,
      roce: 18.2,
      roe: 16.5
    },
    holdings: [
      { asset: 'Trent', assetClass: 'Equity', sector: 'Retail', percentage: 5.2 },
      { asset: 'Persistent Sys', assetClass: 'Equity', sector: 'Technology', percentage: 4.8 },
      { asset: 'Federal Bank', assetClass: 'Equity', sector: 'Financials', percentage: 4.1 },
      { asset: 'Polycab', assetClass: 'Equity', sector: 'Industrial', percentage: 3.9 },
      { asset: 'TVS Motor', assetClass: 'Equity', sector: 'Auto', percentage: 3.5 },
    ],
    history: generateHistory(55, 365, 0.025),
  },
  {
    id: 'f3',
    name: 'Solar FlexiCap Advantage',
    ticker: 'SFCA',
    category: 'Flexi Cap',
    nav: 210.60,
    cagr1Y: 12.4,
    changePercentage: 0.15,
    expenseRatio: 0.95,
    inceptionDate: '2012-01-15',
    exitLoad: 'Nil',
    risk: 'Very High',
    colorTheme: 'gold',
    metrics: {
      pe: 21.8,
      pb: 2.8,
      alpha: 1.1,
      beta: 1.05,
      sharpe: 0.9,
      sortino: 1.1,
      roce: 14.1,
      roe: 13.5
    },
    holdings: [
      { asset: 'Larsen & Toubro', assetClass: 'Equity', sector: 'Construction', percentage: 7.1 },
      { asset: 'Axis Bank', assetClass: 'Equity', sector: 'Financials', percentage: 6.5 },
      { asset: 'ITC', assetClass: 'Equity', sector: 'FMCG', percentage: 5.8 },
      { asset: 'Bharti Airtel', assetClass: 'Equity', sector: 'Telecom', percentage: 4.7 },
      { asset: 'SBI', assetClass: 'Equity', sector: 'Financials', percentage: 4.2 },
    ],
    history: generateHistory(180, 365, 0.012),
  }
];
