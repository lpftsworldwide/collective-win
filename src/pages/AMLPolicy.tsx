import { Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertTriangle, Search, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const AMLPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-premium-gold hover:text-premium-gold/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30">
              <Shield className="w-4 h-4 text-premium-gold" />
              <span className="text-sm text-premium-gold font-medium">Compliance Document</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold">Anti-Money Laundering Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Our Commitment
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                CollectiveWinners.org is committed to preventing money laundering and terrorist financing. 
                We comply with all applicable Australian anti-money laundering laws and regulations, 
                including the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (AML/CTF Act).
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Customer Due Diligence (KYC)
              </h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>Identity verification required for all users</li>
                <li>Enhanced due diligence for high-value transactions</li>
                <li>Ongoing monitoring of customer activity</li>
                <li>Verification of source of funds when required</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Search className="w-5 h-5" />
                Transaction Monitoring
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We employ sophisticated transaction monitoring systems to detect suspicious activity including:
              </p>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>Unusual betting patterns</li>
                <li>Large or frequent deposits/withdrawals</li>
                <li>Structuring of transactions to avoid thresholds</li>
                <li>Inconsistencies in customer information</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-mystic-red/30 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-mystic-red flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Suspicious Activity Reporting
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We are obligated to report suspicious matters to AUSTRAC. This includes any transaction 
                or activity that we suspect may be related to money laundering, terrorism financing, 
                or other serious crimes.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">Record Keeping</h2>
              <p className="text-muted-foreground leading-relaxed">
                In accordance with AML/CTF requirements, we maintain records of all customer 
                identification, transactions, and risk assessments for a minimum of 7 years.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">Contact</h2>
              <p className="text-muted-foreground">
                For AML/compliance inquiries, contact our Compliance Officer at{" "}
                <a href="mailto:compliance@collectivewinners.org" className="text-premium-gold hover:underline">
                  compliance@collectivewinners.org
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMLPolicy;
