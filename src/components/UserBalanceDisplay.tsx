import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserBalance {
  total_balance_aud: number;
  bonus_balance: number;
}

export const UserBalanceDisplay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBalance(null);
      setIsLoading(false);
      return;
    }

    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("total_balance_aud, bonus_balance")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setBalance(data);
      }
      setIsLoading(false);
    };

    fetchBalance();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("user-balance-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const newData = payload.new as UserBalance;
          setBalance({
            total_balance_aud: newData.total_balance_aud,
            bonus_balance: newData.bonus_balance,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user || isLoading) return null;

  const totalBalance = (balance?.total_balance_aud || 0) + (balance?.bonus_balance || 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gaming-card/50 border border-premium-gold/30">
        {/* Total Balance */}
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-premium-gold" />
          <span className="text-sm font-bold text-premium-gold">
            ${totalBalance.toFixed(2)}
          </span>
        </div>
        
        {/* Bonus Balance indicator */}
        {(balance?.bonus_balance || 0) > 0 && (
          <div className="flex items-center gap-1 text-xs text-emerald">
            <Gift className="w-3 h-3" />
            <span>${balance?.bonus_balance.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {/* Quick Deposit Button */}
      <Button
        size="sm"
        onClick={() => navigate("/deposit")}
        className="bg-gradient-to-r from-emerald to-turquoise text-white hover:opacity-90 px-3"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
