import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

yahooFinance.suppressNotices(['yahooSurvey']);

// We calculate Cache-Control dynamically instead of static revalidate
// export const revalidate = 86400; 

const bnToEn = (str: string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (d) => bnDigits.indexOf(d).toString());
};

async function fetchBdGold() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout to avoid Vercel 10s limit
    
    // Don't cache here, let the main API route handle the Cache-Control header
    const res = await fetch('https://www.alaminjewellers.com/gold-price/', { 
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const text = await res.text();
    const match = text.match(/<div class="gpc-band">২২ ক্যারেট<\/div>.*?<div class="gpc-price">.*?<\/div>.*?<div class="gpc-price">(.*?)<\/div>/s);
    if (match && match[1]) {
      return Number(bnToEn(match[1]));
    }
  } catch (e) {
    console.warn('Failed to fetch BD Gold, using fallback:', e);
  }
  return 120500; // Realistic recent fallback price
}

export async function GET() {
  const symbols = [
    { id: 'BZ=F', name: 'Brent Oil', unit: '/ bbl', prefix: '$', fallback: 85.5 },
    { id: 'CL=F', name: 'Crude Oil (WTI)', unit: '/ bbl', prefix: '$', fallback: 81.2 },
    { id: 'NG=F', name: 'Natural Gas', unit: '/ MMBtu', prefix: '$', fallback: 2.5 },
    { id: 'HO=F', name: 'Heating Oil', unit: '/ gal', prefix: '$', fallback: 2.6 },
    { id: 'BTC-USD', name: 'BTC/USD', unit: '', prefix: '$', fallback: 65000 },
    { id: 'BDT=X', name: 'USD/BDT (Live Rate)', unit: '', prefix: '৳', fallback: 117.5 },
    { id: 'EURBDT=X', name: 'EUR/BDT (Live Rate)', unit: '', prefix: '৳', fallback: 125.0 },
  ];

  // Calculate seconds until next 12 AM (Midnight) Bangladesh Standard Time (UTC+6)
  const now = new Date();
  const bstTimeMs = now.getTime() + (6 * 3600000);
  const bstDate = new Date(bstTimeMs);
  
  // Set to next midnight in BST
  const nextMidnightBst = new Date(bstTimeMs);
  nextMidnightBst.setUTCHours(24, 0, 0, 0); // 24:00:00 is next midnight
  
  const secondsUntilMidnightBst = Math.max(0, Math.floor((nextMidnightBst.getTime() - bstDate.getTime()) / 1000));

  try {
    // 1. Fetch Yahoo Finance Data with timeout
    const fetchYahoo = yahooFinance.quote(symbols.map(s => s.id));
    const timeoutPromise = new Promise<any[]>((_, reject) => 
      setTimeout(() => reject(new Error('Yahoo Finance timeout')), 8000)
    );
    
    const results = await Promise.race([fetchYahoo, timeoutPromise]);
    
    const formattedResults = results.map(quote => {
      const symbolDef = symbols.find(s => s.id === quote.symbol);
      return {
        id: quote.symbol,
        name: symbolDef?.name || quote.shortName,
        value: quote.regularMarketPrice || symbolDef?.fallback || 0,
        change: quote.regularMarketChangePercent || 0,
        unit: symbolDef?.unit || '',
        prefix: symbolDef?.prefix || '',
      };
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

    return NextResponse.json(formattedResults, {
      headers: {
        'Cache-Control': `public, s-maxage=${secondsUntilMidnightBst}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    console.warn('Market Data Fetch Error, returning fallback data:', error);
    
    // Return graceful fallback data so the UI doesn't break
    const fallbackResults = symbols.map(s => ({
      id: s.id,
      name: s.name,
      value: s.fallback,
      change: 0.1, // Slight mock change
      unit: s.unit,
      prefix: s.prefix,
    }));
    
    fallbackResults.splice(6, 0, {
      id: 'BD_GOLD_22K',
      name: 'Gold (22K BD)',
      value: await fetchBdGold(),
      change: 0.15,
      unit: '/ vori',
      prefix: '৳',
    });

    return NextResponse.json(fallbackResults, {
      headers: {
        'Cache-Control': 'public, s-maxage=300', // retry in 5 mins on failure
      },
    });
  }
}
