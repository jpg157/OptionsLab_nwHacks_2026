import { Button } from '@/components/ui/button';
import type { OptionLeg } from '@/lib/options';

interface StrategyPresetsProps {
  onSelectPreset: (legs: OptionLeg[], name: string) => void;
  basePrice?: number;
}

interface PresetConfig {
  name: string;
  description: string;
  legs: OptionLeg[];
}

export function StrategyPresets({ onSelectPreset, basePrice = 100 }: StrategyPresetsProps) {
  const presets: PresetConfig[] = [
    {
      name: 'Long Call',
      description: 'Bullish, unlimited upside',
      legs: [{ type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 }],
    },
    {
      name: 'Long Put',
      description: 'Bearish, profit on decline',
      legs: [{ type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 }],
    },
    {
      name: 'Covered Call',
      description: 'Income on existing stock',
      legs: [
        { type: 'stock', position: 'long', strike: basePrice, premium: 0, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 3, quantity: 1 },
      ],
    },
    {
      name: 'Long Straddle',
      description: 'Profit from volatility',
      legs: [
        { type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
      ],
    },
    {
      name: 'Short Straddle',
      description: 'Profit from stability',
      legs: [
        { type: 'call', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
      ],
    },
    {
      name: 'Long Strangle',
      description: 'Cheaper volatility bet',
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 10, premium: 3, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 10, premium: 3, quantity: 1 },
      ],
    },
    {
      name: 'Bull Call Spread',
      description: 'Limited risk bullish',
      legs: [
        { type: 'call', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 2, quantity: 1 },
      ],
    },
    {
      name: 'Bear Put Spread',
      description: 'Limited risk bearish',
      legs: [
        { type: 'put', position: 'long', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice - 10, premium: 2, quantity: 1 },
      ],
    },
    {
      name: 'Iron Condor',
      description: 'Range-bound profit',
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 20, premium: 1, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice - 10, premium: 2.5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice + 10, premium: 2.5, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 20, premium: 1, quantity: 1 },
      ],
    },
    {
      name: 'Iron Butterfly',
      description: 'Pinpoint stability bet',
      legs: [
        { type: 'put', position: 'long', strike: basePrice - 10, premium: 2, quantity: 1 },
        { type: 'put', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'short', strike: basePrice, premium: 5, quantity: 1 },
        { type: 'call', position: 'long', strike: basePrice + 10, premium: 2, quantity: 1 },
      ],
    },
  ];

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Strategies</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            className="h-auto py-2 px-3 flex flex-col items-start text-left bg-background/30 hover:bg-primary/10 border-border/50"
            onClick={() => onSelectPreset(preset.legs, preset.name)}
          >
            <span className="text-xs font-medium">{preset.name}</span>
            <span className="text-[10px] text-muted-foreground">{preset.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
