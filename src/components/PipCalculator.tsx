import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculationResult {
  pipValue: number;
  totalPips: number;
  profit: number;
  isProfit: boolean;
}

const tradingInstruments = [
  { value: 'R_10', label: 'Volatility 10', precision: 2 },
  { value: 'R_25', label: 'Volatility 25', precision: 2 },
  { value: 'R_50', label: 'Volatility 50', precision: 2 },
  { value: 'R_75', label: 'Volatility 75', precision: 2 },
  { value: 'R_100', label: 'Volatility 100', precision: 2 },
  { value: '1HZ10V', label: 'Volatility 10 (1s)', precision: 2 },
  { value: '1HZ25V', label: 'Volatility 25 (1s)', precision: 2 },
  { value: '1HZ50V', label: 'Volatility 50 (1s)', precision: 2 },
  { value: '1HZ75V', label: 'Volatility 75 (1s)', precision: 2 },
  { value: '1HZ100V', label: 'Volatility 100 (1s)', precision: 2 },
  { value: 'JD10', label: 'Jump 10 Index', precision: 2 },
  { value: 'JD25', label: 'Jump 25 Index', precision: 2 },
  { value: 'JD50', label: 'Jump 50 Index', precision: 2 },
  { value: 'JD75', label: 'Jump 75 Index', precision: 2 },
  { value: 'JD100', label: 'Jump 100 Index', precision: 2 },
  { value: 'CRASH300', label: 'Crash 300 Index', precision: 2 },
  { value: 'CRASH500', label: 'Crash 500 Index', precision: 2 },
  { value: 'CRASH1000', label: 'Crash 1000 Index', precision: 2 },
  { value: 'BOOM300', label: 'Boom 300 Index', precision: 2 },
  { value: 'BOOM500', label: 'Boom 500 Index', precision: 2 },
  { value: 'BOOM1000', label: 'Boom 1000 Index', precision: 2 },
  { value: 'RB100', label: 'Range Break 100 Index', precision: 2 },
  { value: 'RB200', label: 'Range Break 200 Index', precision: 2 },
];

export const PipCalculator: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('R_10');
  const [tradeDirection, setTradeDirection] = useState('buy');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [volume, setVolume] = useState('1');
  const [contractSize, setContractSize] = useState('1');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const selectedInstrument = tradingInstruments.find(inst => inst.value === selectedSymbol);

  const fetchLivePrice = async () => {
    setIsLoading(true);
    try {
      const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
      
      ws.onopen = () => {
        ws.send(JSON.stringify({ ticks: selectedSymbol, subscribe: 1 }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.tick && data.tick.quote) {
          setCurrentPrice(data.tick.quote);
          setEntryPrice(data.tick.quote.toString());
          ws.close();
        }
      };

      setTimeout(() => {
        ws.close();
        setIsLoading(false);
      }, 5000);

    } catch (error) {
      console.error('Error fetching live price:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePrice();
  }, [selectedSymbol]);

  const calculate = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const vol = parseFloat(volume);
    const contract = parseFloat(contractSize);
    const precision = selectedInstrument?.precision || 2;

    if (isNaN(entry) || isNaN(exit) || isNaN(vol) || isNaN(contract)) {
      alert('Please fill all fields with valid numbers.');
      return;
    }

    const pointValue = 1 / Math.pow(10, precision);
    const pipValue = pointValue * vol * contract;
    
    // Calculate pips based on trade direction
    let totalPips: number;
    let profit: number;
    
    if (tradeDirection === 'buy') {
      // For buy trades: profit when exit > entry
      totalPips = (exit - entry) / pointValue;
      profit = pipValue * totalPips;
    } else {
      // For sell trades: profit when exit < entry
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
            <Calculator className="h-5 w-5" />
            Trading Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Select Index</Label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an index" />
                </SelectTrigger>
                <SelectContent>
                  {tradingInstruments.map((instrument) => (
                    <SelectItem key={instrument.value} value={instrument.value}>
                      {instrument.label}
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
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="text-sm font-medium cursor-pointer">
                    Buy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="text-sm font-medium cursor-pointer">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry">Entry Price</Label>
              <div className="flex gap-2">
                <Input
                  id="entry"
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                />
                <Button 
                  variant="outline" 
                  onClick={fetchLivePrice}
                  disabled={isLoading}
                  className="whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'Live Price'}
                </Button>
              </div>
              {currentPrice && (
                <p className="text-sm text-muted-foreground">
                  Current: {currentPrice.toFixed(selectedInstrument?.precision || 2)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit">Exit Price</Label>
              <Input
                id="exit"
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume (Lots)</Label>
              <Input
                id="volume"
                type="number"
                step="any"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractSize">Contract Size</Label>
              <Input
                id="contractSize"
                type="number"
                step="any"
                value={contractSize}
                onChange={(e) => setContractSize(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <Button 
            onClick={calculate} 
            className="w-full"
            size="lg"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculate
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
              Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Pip Value</div>
                <div className="text-xl font-bold">{formatCurrency(result.pipValue)}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Total Pips</div>
                <div className="text-xl font-bold">{result.totalPips.toFixed(2)}</div>
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