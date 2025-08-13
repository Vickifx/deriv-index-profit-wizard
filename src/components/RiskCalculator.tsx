
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Percent, Shield } from 'lucide-react';

interface RiskResult {
  riskAmount: number;
  remainingCapital: number;
  stopLossPips?: number;
  pipValue?: number;
}

export const RiskCalculator: React.FC = () => {
  const [tradingCapital, setTradingCapital] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [pipValue, setPipValue] = useState('');
  const { toast } = useToast();
  const [result, setResult] = useState<RiskResult | null>(null);

  const calculate = () => {
    const capitalStr = tradingCapital.trim();
    const percentageStr = riskPercentage.trim();
    const pipValueStr = pipValue.trim();

    if (!capitalStr || !percentageStr) {
      toast({
        title: "Missing Information",
        description: "Please fill in both trading capital and risk percentage.",
        variant: "destructive",
      });
      return;
    }

    const capital = parseFloat(capitalStr);
    const percentage = parseFloat(percentageStr);

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

    const riskAmount = (capital * percentage) / 100;
    const remainingCapital = capital - riskAmount;

    let stopLossPips: number | undefined;
    let pipValueNum: number | undefined;

    // Calculate stop loss pips if pip value is provided
    if (pipValueStr) {
      pipValueNum = parseFloat(pipValueStr);
      if (!isNaN(pipValueNum) && pipValueNum > 0) {
        stopLossPips = riskAmount / pipValueNum;
      }
    }

    setResult({
      riskAmount,
      remainingCapital,
      stopLossPips,
      pipValue: pipValueNum
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

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pipvalue">Pip Value ($) - Optional for Stop Loss Calculation</Label>
              <Input
                id="pipvalue"
                type="number"
                step="any"
                min="0"
                value={pipValue}
                onChange={(e) => setPipValue(e.target.value)}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                Enter the pip value to calculate recommended stop loss in pips
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Risk Amount</div>
                <div className="text-xl font-bold text-trading-loss">{formatCurrency(result.riskAmount)}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                <div className="text-sm text-muted-foreground">Remaining Capital</div>
                <div className="text-xl font-bold text-trading-profit">{formatCurrency(result.remainingCapital)}</div>
              </div>

              {result.stopLossPips && (
                <div className="text-center p-4 rounded-lg bg-trading-result-bg">
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Stop Loss (Pips)
                  </div>
                  <div className="text-xl font-bold text-orange-600">{result.stopLossPips.toFixed(1)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
