
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Percent, Shield } from 'lucide-react';

interface RiskResult {
  riskAmount: number;
  remainingCapital: number;
  stopLossPips: number;
  pipValue: number;
}

const forexPairCategories = {
  metals: [
    { value: 'XAUUSD', label: 'XAU/USD (Gold)', precision: 2 },
    { value: 'XAGUSD', label: 'XAG/USD (Silver)', precision: 3 },
    { value: 'XPTUSD', label: 'XPT/USD (Platinum)', precision: 2 },
    { value: 'XPDUSD', label: 'XPD/USD (Palladium)', precision: 2 },
  ],
  major: [
    { value: 'EURUSD', label: 'EUR/USD', precision: 5 },
    { value: 'GBPUSD', label: 'GBP/USD', precision: 5 },
    { value: 'USDJPY', label: 'USD/JPY', precision: 3 },
    { value: 'USDCHF', label: 'USD/CHF', precision: 5 },
    { value: 'AUDUSD', label: 'AUD/USD', precision: 5 },
    { value: 'USDCAD', label: 'USD/CAD', precision: 5 },
    { value: 'NZDUSD', label: 'NZD/USD', precision: 5 },
  ],
  minor: [
    { value: 'EURJPY', label: 'EUR/JPY', precision: 3 },
    { value: 'GBPJPY', label: 'GBP/JPY', precision: 3 },
    { value: 'EURGBP', label: 'EUR/GBP', precision: 5 },
    { value: 'EURAUD', label: 'EUR/AUD', precision: 5 },
    { value: 'EURCHF', label: 'EUR/CHF', precision: 5 },
    { value: 'GBPAUD', label: 'GBP/AUD', precision: 5 },
    { value: 'AUDCAD', label: 'AUD/CAD', precision: 5 },
    { value: 'AUDCHF', label: 'AUD/CHF', precision: 5 },
    { value: 'AUDJPY', label: 'AUD/JPY', precision: 3 },
    { value: 'CADJPY', label: 'CAD/JPY', precision: 3 },
    { value: 'CHFJPY', label: 'CHF/JPY', precision: 3 },
    { value: 'EURJPY', label: 'EUR/JPY', precision: 3 },
    { value: 'EURCAD', label: 'EUR/CAD', precision: 5 },
    { value: 'GBPCAD', label: 'GBP/CAD', precision: 5 },
    { value: 'GBPCHF', label: 'GBP/CHF', precision: 5 },
    { value: 'NZDCAD', label: 'NZD/CAD', precision: 5 },
    { value: 'NZDCHF', label: 'NZD/CHF', precision: 5 },
    { value: 'NZDJPY', label: 'NZD/JPY', precision: 3 },
  ],
  crypto: [
    { value: 'BTCUSD', label: 'BTC/USD', precision: 2 },
    { value: 'ETHUSD', label: 'ETH/USD', precision: 2 },
    { value: 'LTCUSD', label: 'LTC/USD', precision: 2 },
    { value: 'BCHUSD', label: 'BCH/USD', precision: 2 },
    { value: 'ADAUSD', label: 'ADA/USD', precision: 4 },
    { value: 'DOTUSD', label: 'DOT/USD', precision: 3 },
    { value: 'LINKUSD', label: 'LINK/USD', precision: 3 },
    { value: 'XLMUSD', label: 'XLM/USD', precision: 4 },
    { value: 'XRPUSD', label: 'XRP/USD', precision: 4 },
  ],
  energies: [
    { value: 'USOIL', label: 'US Oil', precision: 2 },
    { value: 'UKOIL', label: 'UK Oil', precision: 2 },
    { value: 'NGAS', label: 'Natural Gas', precision: 3 },
  ],
  stocks: [
    { value: 'AAPL', label: 'Apple Inc.', precision: 2 },
    { value: 'GOOGL', label: 'Alphabet Inc.', precision: 2 },
    { value: 'MSFT', label: 'Microsoft Corp.', precision: 2 },
    { value: 'AMZN', label: 'Amazon.com Inc.', precision: 2 },
    { value: 'TSLA', label: 'Tesla Inc.', precision: 2 },
    { value: 'NVDA', label: 'NVIDIA Corp.', precision: 2 },
    { value: 'META', label: 'Meta Platforms', precision: 2 },
    { value: 'NFLX', label: 'Netflix Inc.', precision: 2 },
  ]
};

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

export const RiskCalculator: React.FC = () => {
  const [tradingCapital, setTradingCapital] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [marketType, setMarketType] = useState('forex');
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [selectedIndex, setSelectedIndex] = useState('R_10');
  const { toast } = useToast();
  const [result, setResult] = useState<RiskResult | null>(null);

  const calculate = () => {
    const capitalStr = tradingCapital.trim();
    const percentageStr = riskPercentage.trim();
    const lotSizeStr = lotSize.trim();

    if (!capitalStr || !percentageStr || !lotSizeStr) {
      toast({
        title: "Missing Information",
        description: "Please fill in trading capital, risk percentage, and lot size.",
        variant: "destructive",
      });
      return;
    }

    const capital = parseFloat(capitalStr);
    const percentage = parseFloat(percentageStr);
    const lots = parseFloat(lotSizeStr);

    if (isNaN(capital) || capital <= 0) {
      toast({
        title: "Invalid Capital",
        description: "Please enter a valid trading capital amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast({
        title: "Invalid Percentage",
        description: "Risk percentage must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(lots) || lots <= 0) {
      toast({
        title: "Invalid Lot Size",
        description: "Please enter a valid lot size greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const riskAmount = (capital * percentage) / 100;
    const remainingCapital = capital - riskAmount;

    // Calculate pip value automatically (standard forex: $10 per pip for 1 lot)
    const pipValue = lots * 10;
    
    // Calculate stop loss pips
    const stopLossPips = riskAmount / pipValue;

    setResult({
      riskAmount,
      remainingCapital,
      stopLossPips,
      pipValue
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
            <Percent className="h-5 w-5" />
            Risk Calculator with Stop Loss
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capital">Trading Capital ($)</Label>
              <Input
                id="capital"
                type="number"
                step="any"
                min="0"
                value={tradingCapital}
                onChange={(e) => setTradingCapital(e.target.value)}
                placeholder="10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">Risk Percentage (%)</Label>
              <Input
                id="risk"
                type="number"
                step="any"
                min="0"
                max="100"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(e.target.value)}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label>Market Type</Label>
              <RadioGroup 
                value={marketType} 
                onValueChange={setMarketType}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="forex" id="forex" />
                  <Label htmlFor="forex" className="text-sm font-medium cursor-pointer">
                    Forex/Pairs
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="index" id="index" />
                  <Label htmlFor="index" className="text-sm font-medium cursor-pointer">
                    Indices
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {marketType === 'forex' && (
              <div className="space-y-2">
                <Label htmlFor="pair">Select Currency Pair</Label>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency pair" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto z-50" side="bottom" align="start" sideOffset={8}>
                    {Object.entries(forexPairCategories).map(([category, pairs]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground capitalize">
                          {category}
                        </div>
                        {pairs.map((pair) => (
                          <SelectItem key={pair.value} value={pair.value}>
                            {pair.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {marketType === 'index' && (
              <div className="space-y-2">
                <Label htmlFor="index">Select Index</Label>
                <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an index" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto z-50" side="bottom" align="start" sideOffset={8}>
                    {tradingInstruments.map((instrument) => (
                      <SelectItem key={instrument.value} value={instrument.value}>
                        {instrument.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="lotsize">Lot Size</Label>
              <Input
                id="lotsize"
                type="number"
                step="any"
                min="0"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                placeholder="1.0"
              />
              <p className="text-xs text-muted-foreground">
                Standard lot size for pip value calculation
              </p>
            </div>
          </div>

          <Button 
            onClick={calculate} 
            className="w-full"
            size="lg"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Calculate Risk & Stop Loss
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Risk Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Risk Amount</div>
                <div className="text-xl font-bold text-trading-loss">{formatCurrency(result.riskAmount)}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Remaining Capital</div>
                <div className="text-xl font-bold text-trading-profit">{formatCurrency(result.remainingCapital)}</div>
              </div>

              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Pip Value</div>
                <div className="text-xl font-bold text-primary">{formatCurrency(result.pipValue)}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  Stop Loss (Pips)
                </div>
                <div className="text-xl font-bold text-orange-600">{result.stopLossPips.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
