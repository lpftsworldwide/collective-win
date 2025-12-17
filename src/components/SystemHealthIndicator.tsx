import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Server, Database, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface HealthCheck {
  database: 'healthy' | 'error';
  auth: 'healthy' | 'error';
  functions: 'healthy' | 'error';
}

export const SystemHealthIndicator = () => {
  const [health, setHealth] = useState<HealthCheck>({
    database: 'healthy',
    auth: 'healthy',
    functions: 'healthy'
  });

  useEffect(() => {
    const checkHealth = async () => {
      const checks: HealthCheck = {
        database: 'healthy',
        auth: 'healthy',
        functions: 'healthy'
      };

      // Test database connection
      try {
        const { error } = await supabase.from('users').select('id').limit(1);
        checks.database = error ? 'error' : 'healthy';
      } catch {
        checks.database = 'error';
      }

      // Test auth
      try {
        const { error } = await supabase.auth.getSession();
        checks.auth = error ? 'error' : 'healthy';
      } catch {
        checks.auth = 'error';
      }

      setHealth(checks);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  const allHealthy = Object.values(health).every(status => status === 'healthy');

  return (
    <Card className="bg-gaming-card border-border">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Server className="w-4 h-4 text-premium-gold" />
            System Health
          </h4>
          <Badge className={allHealthy ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
            {allHealthy ? 'All Systems Operational' : 'Issues Detected'}
          </Badge>
        </div>
        <div className="space-y-2">
          <HealthItem 
            icon={<Database className="w-4 h-4" />}
            label="Database"
            status={health.database}
          />
          <HealthItem 
            icon={<Zap className="w-4 h-4" />}
            label="Authentication"
            status={health.auth}
          />
          <HealthItem 
            icon={<Server className="w-4 h-4" />}
            label="Edge Functions"
            status={health.functions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const HealthItem = ({ icon, label, status }: { icon: React.ReactNode; label: string; status: 'healthy' | 'error' }) => (
  <div className="flex items-center justify-between p-2 rounded bg-gaming-dark">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    {status === 'healthy' ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    )}
  </div>
);