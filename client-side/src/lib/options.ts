// Options calculation utilities

export type OptionType = 'call' | 'put' | 'stock';
export type PositionType = 'long' | 'short';

export interface OptionLeg {
  type: OptionType;
  position: PositionType;
  strike: number; // For stock, this is the purchase price
  premium: number; // For stock, this is 0
  quantity: number;
}

export interface OptionStrategy {
  name: string;
  legs: OptionLeg[];
}

export interface PayoffPoint {
  price: number;
  payoff: number;
}

export interface StrategyAnalysis {
  breakevens: number[];
  maxProfit: number | 'unlimited';
  maxLoss: number | 'unlimited';
  netPremium: number;
  payoffData: PayoffPoint[];
}

// Calculate payoff for a single option leg at a given underlying price
export function calculateLegPayoff(leg: OptionLeg, underlyingPrice: number): number {
  const { type, position, strike, premium, quantity } = leg;
  
  // Stock has linear payoff
  if (type === 'stock') {
    const multiplier = position === 'long' ? 1 : -1;
    return (underlyingPrice - strike) * multiplier * quantity * 100;
  }
  
  let intrinsicValue = 0;
  
  if (type === 'call') {
    intrinsicValue = Math.max(0, underlyingPrice - strike);
  } else {
    intrinsicValue = Math.max(0, strike - underlyingPrice);
  }
  
  const multiplier = position === 'long' ? 1 : -1;
  const premiumCost = position === 'long' ? -premium : premium;
  
  return (intrinsicValue * multiplier + premiumCost) * quantity * 100;
}

// Calculate total strategy payoff at a given price
export function calculateStrategyPayoff(legs: OptionLeg[], underlyingPrice: number): number {
  return legs.reduce((total, leg) => total + calculateLegPayoff(leg, underlyingPrice), 0);
}

// Generate payoff data points for charting
export function generatePayoffData(
  legs: OptionLeg[],
  minPrice?: number,
  maxPrice?: number,
  points: number = 100
): PayoffPoint[] {
  if (legs.length === 0) return [];
  
  const strikes = legs.map(l => l.strike);
  const avgStrike = strikes.reduce((a, b) => a + b, 0) / strikes.length;
  const range = Math.max(avgStrike * 0.5, 50);
  
  const min = minPrice ?? Math.max(0, avgStrike - range);
  const max = maxPrice ?? avgStrike + range;
  const step = (max - min) / points;
  
  const data: PayoffPoint[] = [];
  
  for (let i = 0; i <= points; i++) {
    const price = min + step * i;
    data.push({
      price: Math.round(price * 100) / 100,
      payoff: Math.round(calculateStrategyPayoff(legs, price) * 100) / 100,
    });
  }
  
  return data;
}

// Calculate net premium (positive = credit, negative = debit)
export function calculateNetPremium(legs: OptionLeg[]): number {
  return legs.reduce((total, leg) => {
    if (leg.type === 'stock') return total; // Stock has no premium
    const multiplier = leg.position === 'long' ? -1 : 1;
    return total + leg.premium * leg.quantity * 100 * multiplier;
  }, 0);
}

// Find breakeven points
export function findBreakevens(payoffData: PayoffPoint[]): number[] {
  const breakevens: number[] = [];
  
  for (let i = 1; i < payoffData.length; i++) {
    const prev = payoffData[i - 1];
    const curr = payoffData[i];
    
    // Check if payoff crosses zero
    if ((prev.payoff <= 0 && curr.payoff >= 0) || (prev.payoff >= 0 && curr.payoff <= 0)) {
      // Linear interpolation to find exact breakeven
      const ratio = Math.abs(prev.payoff) / (Math.abs(prev.payoff) + Math.abs(curr.payoff));
      const breakeven = prev.price + (curr.price - prev.price) * ratio;
      breakevens.push(Math.round(breakeven * 100) / 100);
    }
  }
  
  return breakevens;
}

// Analyze a complete strategy
export function analyzeStrategy(legs: OptionLeg[]): StrategyAnalysis {
  if (legs.length === 0) {
    return {
      breakevens: [],
      maxProfit: 0,
      maxLoss: 0,
      netPremium: 0,
      payoffData: [],
    };
  }
  
  const payoffData = generatePayoffData(legs);
  const breakevens = findBreakevens(payoffData);
  const netPremium = calculateNetPremium(legs);
  
  const payoffs = payoffData.map(p => p.payoff);
  const maxPayoff = Math.max(...payoffs);
  const minPayoff = Math.min(...payoffs);
  
  // Check if profit/loss is unlimited (at edges of range)
  const firstPayoff = payoffs[0];
  const lastPayoff = payoffs[payoffs.length - 1];
  const edgeTolerance = 100; // Consider unlimited if still changing at edges
  
  const hasUnlimitedProfit = 
    (maxPayoff === firstPayoff && Math.abs(firstPayoff - payoffs[5]) > edgeTolerance) ||
    (maxPayoff === lastPayoff && Math.abs(lastPayoff - payoffs[payoffs.length - 6]) > edgeTolerance);
    
  const hasUnlimitedLoss =
    (minPayoff === firstPayoff && Math.abs(firstPayoff - payoffs[5]) > edgeTolerance) ||
    (minPayoff === lastPayoff && Math.abs(lastPayoff - payoffs[payoffs.length - 6]) > edgeTolerance);
  
  return {
    breakevens,
    maxProfit: hasUnlimitedProfit ? 'unlimited' : maxPayoff,
    maxLoss: hasUnlimitedLoss ? 'unlimited' : Math.abs(minPayoff),
    netPremium,
    payoffData,
  };
}

// Preset strategies
export const presetStrategies = {
  longCall: (strike: number, premium: number): OptionStrategy => ({
    name: 'Long Call',
    legs: [{ type: 'call', position: 'long', strike, premium, quantity: 1 }],
  }),
  
  longPut: (strike: number, premium: number): OptionStrategy => ({
    name: 'Long Put',
    legs: [{ type: 'put', position: 'long', strike, premium, quantity: 1 }],
  }),
  
  shortCall: (strike: number, premium: number): OptionStrategy => ({
    name: 'Short Call',
    legs: [{ type: 'call', position: 'short', strike, premium, quantity: 1 }],
  }),
  
  shortPut: (strike: number, premium: number): OptionStrategy => ({
    name: 'Short Put',
    legs: [{ type: 'put', position: 'short', strike, premium, quantity: 1 }],
  }),
  
  longStraddle: (strike: number, callPremium: number, putPremium: number): OptionStrategy => ({
    name: 'Long Straddle',
    legs: [
      { type: 'call', position: 'long', strike, premium: callPremium, quantity: 1 },
      { type: 'put', position: 'long', strike, premium: putPremium, quantity: 1 },
    ],
  }),
  
  shortStraddle: (strike: number, callPremium: number, putPremium: number): OptionStrategy => ({
    name: 'Short Straddle',
    legs: [
      { type: 'call', position: 'short', strike, premium: callPremium, quantity: 1 },
      { type: 'put', position: 'short', strike, premium: putPremium, quantity: 1 },
    ],
  }),
  
  longStrangle: (putStrike: number, callStrike: number, putPremium: number, callPremium: number): OptionStrategy => ({
    name: 'Long Strangle',
    legs: [
      { type: 'put', position: 'long', strike: putStrike, premium: putPremium, quantity: 1 },
      { type: 'call', position: 'long', strike: callStrike, premium: callPremium, quantity: 1 },
    ],
  }),
  
  shortStrangle: (putStrike: number, callStrike: number, putPremium: number, callPremium: number): OptionStrategy => ({
    name: 'Short Strangle',
    legs: [
      { type: 'put', position: 'short', strike: putStrike, premium: putPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: callStrike, premium: callPremium, quantity: 1 },
    ],
  }),
  
  bullCallSpread: (lowerStrike: number, upperStrike: number, longPremium: number, shortPremium: number): OptionStrategy => ({
    name: 'Bull Call Spread',
    legs: [
      { type: 'call', position: 'long', strike: lowerStrike, premium: longPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: upperStrike, premium: shortPremium, quantity: 1 },
    ],
  }),
  
  bearPutSpread: (upperStrike: number, lowerStrike: number, longPremium: number, shortPremium: number): OptionStrategy => ({
    name: 'Bear Put Spread',
    legs: [
      { type: 'put', position: 'long', strike: upperStrike, premium: longPremium, quantity: 1 },
      { type: 'put', position: 'short', strike: lowerStrike, premium: shortPremium, quantity: 1 },
    ],
  }),
  
  ironCondor: (
    putLongStrike: number,
    putShortStrike: number,
    callShortStrike: number,
    callLongStrike: number,
    putLongPremium: number,
    putShortPremium: number,
    callShortPremium: number,
    callLongPremium: number
  ): OptionStrategy => ({
    name: 'Iron Condor',
    legs: [
      { type: 'put', position: 'long', strike: putLongStrike, premium: putLongPremium, quantity: 1 },
      { type: 'put', position: 'short', strike: putShortStrike, premium: putShortPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: callShortStrike, premium: callShortPremium, quantity: 1 },
      { type: 'call', position: 'long', strike: callLongStrike, premium: callLongPremium, quantity: 1 },
    ],
  }),
  
  ironButterfly: (
    lowerStrike: number,
    middleStrike: number,
    upperStrike: number,
    putLongPremium: number,
    putShortPremium: number,
    callShortPremium: number,
    callLongPremium: number
  ): OptionStrategy => ({
    name: 'Iron Butterfly',
    legs: [
      { type: 'put', position: 'long', strike: lowerStrike, premium: putLongPremium, quantity: 1 },
      { type: 'put', position: 'short', strike: middleStrike, premium: putShortPremium, quantity: 1 },
      { type: 'call', position: 'short', strike: middleStrike, premium: callShortPremium, quantity: 1 },
      { type: 'call', position: 'long', strike: upperStrike, premium: callLongPremium, quantity: 1 },
    ],
  }),
};
