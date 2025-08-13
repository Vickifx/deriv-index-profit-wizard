
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForexCalculationResult {
  pipValue: number;
  totalPips: number;
  profit: number;
  isProfit: boolean;
}

const forexPairs = [
  { value: 'EURUSD', label: 'EUR/USD', precision: 5, baseUnit: 100000 },
  { value: 'GBPUSD', label: 'GBP/USD', precision: 5, baseUnit: 100000 },
  { value: 'USDJPY', label: 'USD/JPY', precision: 3, baseUnit: 100000 },
  { value: 'USDCHF', label: 'USD/CHF', precision: 5, baseUnit: 100000 },
  { value: 'AUDUSD', label: 'AUD/USD', precision: 5, baseUnit: 100000 },
  { value: 'USDCAD', label: 'USD/CAD', precision: 5, baseUnit: 100000 },
  { value: 'NZDUSD', label: 'NZD/USD', precision: 5, baseUnit: 100000 },
  { value: 'EURGBP', label: 'EUR/GBP', precision: 5, baseUnit: 100000 },
  { value: 'EURJPY', label: 'EUR/JPY', precision: 3, baseUnit: 100000 },
  { value: 'GBPJPY', label: 'GBP/JPY', precision: 3, baseUnit: 100000 },
  { value: 'XAUUSD', label: 'Gold/USD (XAU/USD)', precision: 2, baseUnit: 100 },
  { value: 'XAGUSD', label: 'Silver/USD (XAG/USD)', precision: 3, baseUnit: 5000 },
  { value: 'EURCHF', label: 'EUR/CHF', precision: 5, baseUnit: 100000 },
  { value: 'GBPCHF', label: 'GBP/CHF', precision: 5, baseUnit: 100000 },
  { value: 'AUDCAD', label: 'AUD/CAD', precision: 5, baseUnit: 100000 },
  { value: 'AUDCHF', label: 'AUD/CHF', precision: 5, baseUnit: 100000 },
  { value: 'AUDJPY', label: 'AUD/JPY', precision: 3, baseUnit: 100000 },
  { value: 'CADJPY', label: 'CAD/JPY', precision: 3, baseUnit: 100000 },
  { value: 'CHFJPY', label: 'CHF/JPY', precision: 3, baseUnit: 100000 },
  { value: 'EURAUD', label: 'EUR/AUD', precision: 5, baseUnit: 100000 }
];

export const ForexCalculator: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [tradeDirection, setTradeDirection] = useState('buy');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [lotSize, setLotSize] = useState('1');
  const [result, setResult] = useState<ForexCalculationResult | null>(null);

  const selectedForexPair = forexPairs.find(pair => pair.value === selectedPair);

  const calculate = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const lots = parseFloat(lotSize);
    const precision = selectedForexPair?.precision || 5;
    const baseUnit = selectedForexPair?.baseUnit || 100000;

    if (!entryPrice.trim() || !exitPrice.trim() || !lotSize.trim()) {
      return;
    }

    if (isNaN(entry) || isNaN(exit) || isNaN(lots)) {
      return;
    }

    // Calculate pip value based on pair type
    let pipValue: number;
    let pointValue: number;
    
    if (selectedPair === 'USDJPY' || selectedPair.endsWith('JPY')) {
      pointValue = 0.01; // For JPY pairs, 1 pip = 0.01
    } else if (selectedPair === 'XAUUSD') {
      pointValue = 0.1; // For Gold, 1 pip = 0.1
    } else if (selectedPair === 'XAGUSD') {
      pointValue = 0.001; // For Silver, 1 pip = 0.001
    } else {
      pointValue = 0.0001; // Standard forex pairs, 1 pip = 0.0001
    }

    pipValue = (baseUnit * lots * pointValue) / (selectedPair.startsWith('USD') && !selectedPair.endsWith('USD') ? entry : 1);
    
    // Calculate pips based on trade direction
    let totalPips: number;
    let profit: number;
    
    if (tradeDirection === 'buy') {
      totalPips = (exit - entry) / pointValue;
      profit = pipValue * totalPips;
    } else {
      totalPips = (entry - exit) / pointValue;
      profit = pipValue * totalPips;
    }

    setResult({
      pipValue,
      totalPips,
      profit,
      isProfit: profit > 0
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Forex & Gold Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="forexpair">Select Currency Pair</Label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency pair" />
                </SelectTrigger>
                <SelectContent>
                  {forexPairs.map((pair) => (
                    <SelectItem key={pair.value} value={pair.value}>
                      {pair.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trade Direction</Label>
              <RadioGroup 
                value={tradeDirection} 
                onValueChange={setTradeDirection}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="forexbuy" />
                  <Label htmlFor="forexbuy" className="text-sm font-medium cursor-pointer">
                    Buy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="forexsell" />
                  <Label htmlFor="forexsell" className="text-sm font-medium cursor-pointer">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forexentry">Entry Price</Label>
              <Input
                id="forexentry"
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="1.1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forexexit">Exit Price</Label>
              <Input
                id="forexexit"
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="1.1050"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="lotsize">Lot Size</Label>
              <Input
                id="lotsize"
                type="number"
                step="any"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>

          <Button 
            onClick={calculate} 
            className="w-full"
            size="lg"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Forex Trade
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isProfit ? (
                <TrendingUp className="h-5 w-5 text-trading-profit" />
              ) : (
                <TrendingDown className="h-5 w-5 text-trading-loss" />
              )}
              Forex Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Pip Value</div>
                <div className="text-xl font-bold">{formatCurrency(result.pipValue)}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Total Pips</div>
                <div className="text-xl font-bold">{result.totalPips.toFixed(1)}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Profit/Loss</div>
                <div className={cn(
                  "text-xl font-bold flex items-center justify-center gap-1",
                  result.isProfit ? "text-trading-profit" : "text-trading-loss"
                )}>
                  {result.isProfit ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {formatCurrency(Math.abs(result.profit))}
                </div>
                <Badge 
                  variant={result.isProfit ? "default" : "destructive"}
                  className="mt-1"
                >
                  {result.isProfit ? "Profit" : "Loss"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
