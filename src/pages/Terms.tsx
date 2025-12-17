import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
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
              <FileText className="w-4 h-4 text-premium-gold" />
              <span className="text-sm text-premium-gold font-medium">Legal Document</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Scale className="w-5 h-5" />
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using CollectiveWinners.org, you accept and agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">2. Eligibility</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>You must be at least 18 years of age to use this platform</li>
                <li>You must be a resident of an Australian jurisdiction where online gaming is legal</li>
                <li>You must not be self-excluded from gambling services</li>
                <li>You must provide accurate personal information during registration</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                3. Account Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account. Notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">4. Deposits & Withdrawals</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>All deposits are processed in Australian Dollars (AUD)</li>
                <li>KYC verification is required for withdrawals exceeding $100</li>
                <li>Withdrawal processing times vary by payment method (1-5 business days)</li>
                <li>We reserve the right to request additional verification at any time</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">5. Responsible Gaming</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to promoting responsible gaming. We provide tools including deposit limits, 
                session time limits, self-exclusion options, and cool-off periods. If you believe you may have 
                a gambling problem, please contact Gambling Help Online at 1800 858 858.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">6. Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions regarding these terms, please contact us at{" "}
                <a href="mailto:legal@collectivewinners.org" className="text-premium-gold hover:underline">
                  legal@collectivewinners.org
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
