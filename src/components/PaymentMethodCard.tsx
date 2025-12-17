import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Building2, Bitcoin } from "lucide-react";

interface PaymentMethodCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const PaymentMethodCard = ({ name, description, icon }: PaymentMethodCardProps) => {
  const icons = {
    CreditCard: CreditCard,
    Wallet: Wallet,
    Building2: Building2,
    Bitcoin: Bitcoin,
  };

  const Icon = icons[icon as keyof typeof icons] || CreditCard;

  return (
    <Card className="hover:border-premium-gold/50 transition-all duration-300 bg-gaming-card border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-premium-gold/10">
            <Icon className="w-5 h-5 text-premium-gold" />
          </div>
          <CardTitle className="text-base">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
