import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Sparkles, Eye } from "lucide-react";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  userId: string;
  amount: number;
  provider?: string;
  timestamp: Date;
}

const providers = ['JILI3', 'BNG', 'PGS', 'PP', 'EVO', 'NE'];

const generateUserId = () => {
  const prefix = '61*****';
  const suffix = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return prefix + suffix;
};

// Realistic win amounts from $23 to $27,500
const generateWinAmount = (): number => {
  const rand = Math.random();
  if (rand < 0.30) return Math.floor(Math.random() * 40) + 23; // $23-63
  if (rand < 0.55) return Math.floor(Math.random() * 100) + 60; // $60-160
  if (rand < 0.75) return Math.floor(Math.random() * 400) + 150; // $150-550
  if (rand < 0.88) return Math.floor(Math.random() * 1500) + 500; // $500-2000
  if (rand < 0.96) return Math.floor(Math.random() * 5000) + 2000; // $2000-7000
  return Math.floor(Math.random() * 20500) + 7000; // $7000-27500 MAX
};

const generateTransaction = (): Transaction => {
  const isDeposit = Math.random() > 0.45; // Balanced deposits/withdrawals
  return {
    id: Math.random().toString(36).substring(7),
    type: isDeposit ? 'deposit' : 'withdraw',
    userId: generateUserId(),
    amount: isDeposit 
      ? [20, 50, 100, 150, 200, 300, 500, 1000][Math.floor(Math.random() * 8)]
      : generateWinAmount(),
    provider: isDeposit ? undefined : providers[Math.floor(Math.random() * providers.length)],
    timestamp: new Date(),
  };
};

export const LiveTransactionsFeed = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    Array.from({ length: 6 }, generateTransaction)
  );

  useEffect(() => {
    const getRandomInterval = () => 2500 + Math.random() * 3500;
    
    let timeoutId: NodeJS.Timeout;
    
    const addTransaction = () => {
      const newTx = generateTransaction();
      newTx.id = `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setTransactions(prev => [newTx, ...prev.slice(0, 5)]);
      timeoutId = setTimeout(addTransaction, getRandomInterval());
    };
    
    timeoutId = setTimeout(addTransaction, getRandomInterval());

    return () => clearTimeout(timeoutId);
  }, []);

  const deposits = transactions.filter(t => t.type === 'deposit');
  const withdrawals = transactions.filter(t => t.type === 'withdraw');

  return (
    <Card className="bg-gaming-card border-premium-gold/30 tarot-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-premium-gold font-cinzel flex items-center gap-2 text-lg">
          <Eye className="w-5 h-5 animate-eye-pulse" />
          Live Transactions
          <span className="ml-auto flex items-center gap-1 text-xs text-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            LIVE
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x divide-premium-gold/20">
          {/* Deposits Column */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald/30">
              <ArrowDownCircle className="w-4 h-4 text-emerald" />
              <span className="text-sm font-cinzel font-bold text-emerald">DEPOSIT</span>
            </div>
            <div className="space-y-2">
              {deposits.slice(0, 5).map((tx, index) => (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between text-xs py-1 animate-in slide-in-from-left-5 fade-in duration-300`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-muted-foreground font-mono">{tx.userId}</span>
                  <span className="text-emerald font-bold">AUD {tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawals Column */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-premium-gold/30">
              <ArrowUpCircle className="w-4 h-4 text-premium-gold" />
              <span className="text-sm font-cinzel font-bold text-premium-gold">WITHDRAW</span>
            </div>
            <div className="space-y-2">
              {withdrawals.slice(0, 5).map((tx, index) => (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between text-xs py-1 animate-in slide-in-from-right-5 fade-in duration-300`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-muted-foreground font-mono">{tx.userId}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-premium-gold font-bold">AUD {tx.amount.toFixed(2)}</span>
                    {tx.provider && (
                      <span className="text-[10px] text-turquoise">{tx.provider}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Egyptian decoration */}
        <div className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-transparent via-premium-gold/10 to-transparent text-premium-gold/30 text-sm">
          <span>𓂀</span>
          <Sparkles className="w-3 h-3" />
          <span>𓃭</span>
        </div>
      </CardContent>
    </Card>
  );
};
