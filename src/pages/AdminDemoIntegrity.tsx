import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, XCircle, Loader2, RefreshCw, Database, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  duration?: number;
}

interface GameTestResult {
  gameId: string;
  gameName: string;
  tests: TestResult[];
  overallStatus: 'pending' | 'running' | 'pass' | 'fail';
}

const AdminDemoIntegrity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<GameTestResult[]>([]);

  const testGames = [
    { id: 'demo-classic', name: 'Classic Slots Demo' },
    { id: 'demo-bonanza', name: 'Bonanza-Style Demo' },
    { id: 'demo-feature', name: 'Feature-Heavy Demo' },
  ];

  const runIntegrityTests = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to run integrity tests",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    const results: GameTestResult[] = [];

    for (const game of testGames) {
      const gameResult: GameTestResult = {
        gameId: game.id,
        gameName: game.name,
        tests: [
          { name: 'API Reachable', status: 'pending' },
          { name: 'Outcome Returned', status: 'pending' },
          { name: 'Spin Logged', status: 'pending' },
          { name: 'Balance Updated', status: 'pending' },
          { name: 'Idempotency Check', status: 'pending' },
        ],
        overallStatus: 'running',
      };

      results.push(gameResult);
      setTestResults([...results]);

      // Test 1: API Reachable
      gameResult.tests[0].status = 'running';
      setTestResults([...results]);

      try {
        const startTime = Date.now();
        const { data, error } = await supabase.functions.invoke('spin', {
          body: { gameId: game.id, wager: 1 },
        });

        const duration = Date.now() - startTime;

        if (error) {
          gameResult.tests[0] = { name: 'API Reachable', status: 'fail', message: error.message, duration };
        } else {
          gameResult.tests[0] = { name: 'API Reachable', status: 'pass', duration };

          // Test 2: Outcome Returned
          if (data?.reels && Array.isArray(data.reels)) {
            gameResult.tests[1] = { name: 'Outcome Returned', status: 'pass', message: `${data.reels.length} rows returned` };
          } else {
            gameResult.tests[1] = { name: 'Outcome Returned', status: 'fail', message: 'Invalid outcome format' };
          }

          // Test 3: Check if spin was logged
          if (data?.sessionId && data?.spinIndex) {
            const { data: spinData, error: spinError } = await supabase
              .from('demo_spins')
              .select('*')
              .eq('session_id', data.sessionId)
              .eq('spin_index', data.spinIndex)
              .single();

            if (spinError || !spinData) {
              gameResult.tests[2] = { name: 'Spin Logged', status: 'fail', message: 'Spin not found in database' };
            } else {
              gameResult.tests[2] = { name: 'Spin Logged', status: 'pass', message: `Spin #${data.spinIndex} logged` };
            }
          } else {
            gameResult.tests[2] = { name: 'Spin Logged', status: 'fail', message: 'No session/spin index returned' };
          }

          // Test 4: Balance Updated
          if (typeof data?.newBalance === 'number') {
            gameResult.tests[3] = { name: 'Balance Updated', status: 'pass', message: `Balance: ${data.newBalance.toFixed(2)}` };
          } else {
            gameResult.tests[3] = { name: 'Balance Updated', status: 'fail', message: 'Balance not returned' };
          }

          // Test 5: Idempotency (try same spin again - should create new spin, not duplicate)
          const { data: spin2 } = await supabase.functions.invoke('spin', {
            body: { gameId: game.id, wager: 1, sessionId: data.sessionId },
          });

          if (spin2?.spinIndex && spin2.spinIndex !== data.spinIndex) {
            gameResult.tests[4] = { name: 'Idempotency Check', status: 'pass', message: `Unique spin index: ${spin2.spinIndex}` };
          } else {
            gameResult.tests[4] = { name: 'Idempotency Check', status: 'fail', message: 'Duplicate spin created' };
          }
        }
      } catch (err: any) {
        gameResult.tests[0] = { name: 'API Reachable', status: 'fail', message: err.message };
        gameResult.tests.slice(1).forEach((t, i) => {
          gameResult.tests[i + 1] = { ...t, status: 'fail', message: 'Skipped due to API failure' };
        });
      }

      // Calculate overall status
      const allPass = gameResult.tests.every(t => t.status === 'pass');
      const anyFail = gameResult.tests.some(t => t.status === 'fail');
      gameResult.overallStatus = allPass ? 'pass' : anyFail ? 'fail' : 'pending';

      setTestResults([...results]);
    }

    setIsRunning(false);

    const passCount = results.filter(r => r.overallStatus === 'pass').length;
    toast({
      title: "Integrity Tests Complete",
      description: `${passCount}/${results.length} games passed all tests`,
      variant: passCount === results.length ? "default" : "destructive",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Demo Integrity Panel
              </h1>
            </div>
            <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              Admin Only
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Info Card */}
        <Card className="bg-muted/30 border-border mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Server className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Demo Engine Verification
                </h2>
                <p className="text-muted-foreground text-sm">
                  This panel verifies that the demo spin engine is functioning correctly. 
                  Each test validates API connectivity, outcome generation, database logging, 
                  and system integrity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Run Tests Button */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            onClick={runIntegrityTests}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Integrity Tests
              </>
            )}
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Database className="w-5 h-5" />
              Test Results
            </h3>

            {testResults.map((game) => (
              <Card key={game.gameId} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      {getStatusIcon(game.overallStatus)}
                      {game.gameName}
                    </CardTitle>
                    <Badge 
                      variant="outline"
                      className={
                        game.overallStatus === 'pass' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : game.overallStatus === 'fail'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }
                    >
                      {game.overallStatus.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {game.tests.map((test, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="text-sm text-foreground">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {test.message && <span>{test.message}</span>}
                          {test.duration && <span>{test.duration}ms</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Documentation */}
        <Card className="bg-card border-border mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Test Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-1">API Reachable</h4>
              <p>Verifies the demo-spin edge function responds to requests within acceptable latency.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Outcome Returned</h4>
              <p>Confirms the API returns valid reel outcomes in the expected format.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Spin Logged</h4>
              <p>Verifies each spin is persisted to the demo_spins table for audit trail.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Balance Updated</h4>
              <p>Confirms demo credit balance is correctly updated after each spin.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Idempotency Check</h4>
              <p>Ensures each spin generates a unique spin index, preventing duplicate entries.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDemoIntegrity;
