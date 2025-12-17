import { Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertTriangle, FileText, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Disclosure = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Platform Disclosure</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Demo Notice */}
        <Card className="bg-amber-500/10 border-amber-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-amber-300 mb-2">
                  Demo Platform Disclosure
                </h2>
                <p className="text-muted-foreground">
                  Collective Winners is currently operating as a <strong>demonstration platform</strong> using 
                  test credits (XP) only. No real money gambling is available. This platform is designed 
                  for preview, educational, and technical demonstration purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Platform Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-primary" />
                Platform Status & Licensing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Current Status</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo Mode - Pre-License
                  </span>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Currency</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Test Credits (XP) Only
                  </span>
                </div>
              </div>
              
              <p>
                This platform is preparing for regulatory licensing and certification. All gameplay 
                currently uses demonstration credits that have no monetary value and cannot be 
                withdrawn or exchanged.
              </p>
            </CardContent>
          </Card>

          {/* Game Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="w-5 h-5 text-primary" />
                Game Information & Integrity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Demo Game Engine</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All game outcomes are generated server-side using secure random number generation</li>
                  <li>Demo RNG uses seeded algorithms for auditability and reproducibility</li>
                  <li>Each spin is logged with full outcome data for integrity verification</li>
                  <li>Demo games simulate slot mechanics for educational demonstration only</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Provider Attribution</h4>
                <p>
                  Game names and provider references shown on this platform are for demonstration 
                  purposes only. They represent simulated gameplay experiences and do not indicate 
                  actual licensed provider integrations until such integrations are formally completed 
                  and certified.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">RTP (Return to Player)</h4>
                <p>
                  Demo games display theoretical RTP values for educational purposes. These values 
                  represent the expected return over millions of spins in a certified environment. 
                  Demo mode outcomes may vary as they are not certified by gaming regulators.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fair Play */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Scale className="w-5 h-5 text-primary" />
                Fair Play & Responsible Gaming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Even in demo mode, we are committed to demonstrating responsible gaming practices:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Session time reminders and limits</li>
                <li>Demo credit balance management</li>
                <li>Clear distinction between demo and real-money gaming</li>
                <li>Educational information about gaming mechanics</li>
                <li>Links to responsible gambling resources</li>
              </ul>

              <div className="bg-muted/30 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-foreground mb-2">Need Help?</h4>
                <p className="text-sm mb-3">
                  If you or someone you know has a gambling problem, please contact:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Gambling Help Online: 1800 858 858</li>
                  <li>• Lifeline: 13 11 14</li>
                  <li>• gamblinghelponline.org.au</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For auditors and technical reviewers, our demo platform implements:
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                <ul className="space-y-2">
                  <li>• Server-side outcome resolution (Edge Functions)</li>
                  <li>• Seeded RNG with audit trail logging</li>
                  <li>• Idempotent spin operations (unique session + spin index)</li>
                  <li>• Full spin history with outcome JSON</li>
                  <li>• Separate demo balance ledger</li>
                  <li>• Row-level security on all user data</li>
                </ul>
              </div>
              
              <p className="text-sm">
                Demo integrity can be verified through the Admin Demo Integrity Panel, 
                which tests API connectivity, outcome generation, and database logging.
              </p>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Link to="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link to="/responsible-gambling">
              <Button variant="outline">Responsible Gaming</Button>
            </Link>
            <Link to="/fair-play">
              <Button variant="outline">Fair Play</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Disclosure;
