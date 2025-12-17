import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  CheckCircle,
  Lock,
  Scale,
  FileCheck,
  Users,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Dice1,
  Globe,
  Award,
} from "lucide-react";

const FairPlay = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-premium-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-premium-gold" />
              <h1 className="text-xl font-bold text-premium-gold">Fair Play & Legal Compliance</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-4 rounded-full bg-premium-gold/10">
              <Shield className="w-12 h-12 text-premium-gold" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Fair Play & Transparency Commitment
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            CollectiveWinners.org is committed to providing a fair, transparent, and legally compliant
            gaming experience. This page outlines our compliance framework, game integrity measures,
            and player protection policies.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="bg-amber-500/10 border-amber-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-2">Important Disclosure</h3>
                <p className="text-foreground/90">
                  <strong>Demo Mode Notice:</strong> Games currently available on this platform operate in 
                  demonstration mode with simulated outcomes. Real-money gaming features require integration 
                  with licensed third-party game providers. We are actively working with regulated aggregators 
                  to bring fully licensed games to our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* RNG Certification */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-premium-gold/10">
                  <Dice1 className="w-6 h-6 text-premium-gold" />
                </div>
                <CardTitle className="text-premium-gold">RNG Certification</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                All real-money games integrated on this platform must be provided by licensed 
                third-party providers with certified Random Number Generators (RNG).
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Server-side RNG (no client-side outcomes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Independent audit by GLI, eCOGRA, or iTech Labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Cryptographically secure random number generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Regular third-party audits and certification renewal</span>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Demo Games:</strong> Demo games on this platform use server-side RNG for 
                  simulation purposes only and do not represent certified gambling outcomes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* RTP Disclosure */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-premium-gold/10">
                  <Scale className="w-6 h-6 text-premium-gold" />
                </div>
                <CardTitle className="text-premium-gold">RTP Disclosure</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                Return to Player (RTP) percentages are displayed for all games and represent the 
                theoretical long-term payout rate certified by the game provider.
              </p>
              <div className="bg-background/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Slot Games Average RTP:</span>
                  <Badge variant="outline" className="text-premium-gold border-premium-gold/30">
                    95% - 97%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Table Games Average RTP:</span>
                  <Badge variant="outline" className="text-premium-gold border-premium-gold/30">
                    97% - 99.5%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Live Casino RTP:</span>
                  <Badge variant="outline" className="text-premium-gold border-premium-gold/30">
                    97% - 99%
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> RTP values cannot be modified by the platform operator. They are 
                fixed by the game provider and certified by independent testing laboratories.
              </p>
            </CardContent>
          </Card>

          {/* Provider Attribution */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-premium-gold/10">
                  <Award className="w-6 h-6 text-premium-gold" />
                </div>
                <CardTitle className="text-premium-gold">Licensed Game Providers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                We partner exclusively with licensed and regulated game providers. All games are 
                delivered via secure API integration—not self-hosted or modified.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Pragmatic Play", license: "MGA, UKGC" },
                  { name: "Evolution Gaming", license: "MGA, UKGC" },
                  { name: "NetEnt", license: "MGA, UKGC" },
                  { name: "Playson", license: "MGA" },
                  { name: "Red Tiger", license: "MGA, UKGC" },
                  { name: "Play'n GO", license: "MGA, UKGC" },
                ].map((provider) => (
                  <div 
                    key={provider.name}
                    className="p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <p className="font-medium text-sm">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">{provider.license}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Provider integration pending. Currently displaying demo games only.
              </p>
            </CardContent>
          </Card>

          {/* Jurisdiction Statement */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-premium-gold/10">
                  <Globe className="w-6 h-6 text-premium-gold" />
                </div>
                <CardTitle className="text-premium-gold">Jurisdiction & Licensing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                This platform operates under the regulatory framework applicable to our licensing 
                jurisdiction and complies with all applicable gambling laws.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-premium-gold" />
                  <span className="text-sm">Anti-Money Laundering (AML) Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-premium-gold" />
                  <span className="text-sm">Know Your Customer (KYC) Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-premium-gold" />
                  <span className="text-sm">Responsible Gambling Policies</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-premium-gold" />
                  <span className="text-sm">Player Fund Protection</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground italic">
                  Gambling may be restricted in your jurisdiction. Please verify local laws before playing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Game Integrity Section */}
        <Card className="bg-gaming-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-premium-gold/10">
                <Lock className="w-6 h-6 text-premium-gold" />
              </div>
              <CardTitle className="text-premium-gold">Game Integrity Architecture</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80">
              Understanding how licensed casino games work is essential for transparency. 
              Here is the architecture that ensures fair play:
            </p>
            
            <div className="bg-background/50 rounded-lg p-6">
              <pre className="text-sm text-muted-foreground overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                    FAIR PLAY ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐ │
│    │   PLAYER     │───▸│   CASINO     │───▸│ AGGREGATOR  │ │
│    │   (You)      │    │  (Platform)  │    │  (API Hub)  │ │
│    └──────────────┘    └──────────────┘    └──────┬──────┘ │
│                                                    │        │
│                                                    ▼        │
│                                           ┌──────────────┐  │
│                                           │    GAME      │  │
│                                           │  PROVIDER    │  │
│                                           │(Pragmatic,   │  │
│                                           │ Evolution)   │  │
│                                           └──────┬──────┘  │
│                                                    │        │
│                                                    ▼        │
│                                           ┌──────────────┐  │
│                                           │  CERTIFIED   │  │
│                                           │  RNG SERVER  │  │
│                                           │(GLI/eCOGRA)  │  │
│                                           └──────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Casino CANNOT alter game logic or RTP                    │
│  ✓ All outcomes determined by certified RNG servers         │
│  ✓ Wallet transactions atomic and audited                   │
│  ✓ Player can verify bet/win history                        │
└─────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <h4 className="font-medium text-green-400 mb-2">What We Control</h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• User accounts & KYC</li>
                  <li>• Deposits & withdrawals</li>
                  <li>• Bonus management</li>
                  <li>• Game selection</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <h4 className="font-medium text-blue-400 mb-2">Provider Controls</h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Game mathematics</li>
                  <li>• RNG algorithms</li>
                  <li>• RTP configuration</li>
                  <li>• Outcome generation</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <h4 className="font-medium text-purple-400 mb-2">Regulator Verifies</h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• RNG certification</li>
                  <li>• RTP accuracy</li>
                  <li>• Fair play audits</li>
                  <li>• Payout verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsible Gambling */}
        <Card className="bg-gaming-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-premium-gold/10">
                <Users className="w-6 h-6 text-premium-gold" />
              </div>
              <CardTitle className="text-premium-gold">Responsible Gambling</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80">
              We are committed to promoting responsible gambling and providing tools to help 
              players stay in control.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Available Tools:</h4>
                <ul className="text-sm text-foreground/80 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Deposit limits (daily, weekly, monthly)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Session time reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Self-exclusion options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Reality check notifications
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Support Resources:</h4>
                <ul className="text-sm space-y-2">
                  <li>
                    <a 
                      href="https://www.gamblinghelponline.org.au" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-turquoise hover:underline flex items-center gap-1"
                    >
                      Gambling Help Online (AU)
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.gamblersanonymous.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-turquoise hover:underline flex items-center gap-1"
                    >
                      Gamblers Anonymous
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.begambleaware.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-turquoise hover:underline flex items-center gap-1"
                    >
                      BeGambleAware
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <div className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> Gambling involves risk. Only gamble with money you can afford 
            to lose. If you or someone you know has a gambling problem, please seek help. This platform 
            complies with all applicable laws and regulations in the jurisdictions where it operates.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default FairPlay;