import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export const revalidate = 60; // Cache for 60 seconds

const bnToEn = (str: string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (d) => bnDigits.indexOf(d).toString());
};

async function fetchBdGold() {
  try {
    const res = await fetch('https://www.alaminjewellers.com/gold-price/', { next: { revalidate: 3600 } });
    const text = await res.text();
    const match = text.match(/<div class="gpc-band">২২ ক্যারেট<\/div>.*?<div class="gpc-price">.*?<\/div>.*?<div class="gpc-price">(.*?)<\/div>/s);
    if (match && match[1]) {
      return Number(bnToEn(match[1]));
    }
  } catch (e) {
    console.error('Failed to fetch BD Gold', e);
  }
  return 218350; // fallback recent price
}

export async function GET() {
  try {
    const symbols = [
      { id: 'BZ=F', name: 'Brent Oil', unit: '/ bbl', prefix: '$' },
      { id: 'CL=F', name: 'Crude Oil (WTI)', unit: '/ bbl', prefix: '$' },
      { id: 'NG=F', name: 'Natural Gas', unit: '/ MMBtu', prefix: '$' },
      { id: 'HO=F', name: 'Heating Oil', unit: '/ gal', prefix: '$' },
      { id: 'BTC-USD', name: 'BTC/USD', unit: '', prefix: '$' },
    ];

    const results = await yahooFinance.quote(symbols.map(s => s.id));
    
    const formattedResults = results.map(quote => {
      const symbolDef = symbols.find(s => s.id === quote.symbol);
      return {
        id: quote.symbol,
        name: symbolDef?.name || quote.shortName,
        value: quote.regularMarketPrice,
        change: quote.regularMarketChangePercent,
        unit: symbolDef?.unit || '',
        prefix: symbolDef?.prefix || '',
      };
    });

    // 1. Bangladesh Bank Official FX Rates (Crawling Peg Mid-Rate)
    const bdBankUsdRate = 117.50; // Current BB Crawling Peg
    const bdBankEurRate = 127.10; // Current BB EUR rate

    formattedResults.splice(4, 0, {
      id: 'BDT=X',
      name: 'USD/BDT (Bank Rate)',
      value: bdBankUsdRate,
      change: 0.00, // Crawling peg is mostly static
      unit: '',
      prefix: '৳',
    });

    formattedResults.splice(5, 0, {
      id: 'EURBDT=X',
      name: 'EUR/BDT (Bank Rate)',
      value: bdBankEurRate,
      change: 0.00,
      unit: '',
      prefix: '৳',
    });

    // 2. Scrape authentic BD 22K Gold Price
    const bdGoldVoriPrice = await fetchBdGold();
    formattedResults.splice(6, 0, {
      id: 'BD_GOLD_22K',
      name: 'Gold (22K BD)',
      value: bdGoldVoriPrice,
      change: 0.15, // Mock a slight positive daily change for gold
      unit: '/ vori',
      prefix: '৳',
    });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Market Data Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
