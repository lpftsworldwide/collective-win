import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Shield, Eye, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
              <Lock className="w-4 h-4 text-premium-gold" />
              <span className="text-sm text-premium-gold font-medium">Privacy Document</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Information We Collect
              </h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li><strong>Personal Information:</strong> Name, email, phone number, date of birth, address</li>
                <li><strong>Financial Information:</strong> BSB, account number, PayID for withdrawals</li>
                <li><strong>Identity Documents:</strong> Passport, driver's license, proof of address for KYC</li>
                <li><strong>Gaming Activity:</strong> Betting history, deposits, withdrawals, game preferences</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                How We Use Your Information
              </h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>To verify your identity and prevent fraud</li>
                <li>To process deposits and withdrawals</li>
                <li>To comply with regulatory requirements and AML laws</li>
                <li>To provide customer support</li>
                <li>To improve our services and user experience</li>
                <li>To send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures including encryption, secure servers, 
                and regular security audits to protect your personal information. All KYC documents 
                are stored in encrypted, access-controlled storage with strict access policies.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as your account is active and for a 
                period thereafter as required by law (typically 7 years for financial records). 
                KYC documents are retained in accordance with AML regulations.
              </p>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">Your Rights</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to request deletion (subject to legal requirements)</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent for marketing communications</li>
              </ul>
            </section>

            <section className="bg-gaming-card border border-premium-gold/20 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-cinzel text-premium-gold">Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, contact our Data Protection Officer at{" "}
                <a href="mailto:privacy@collectivewinners.org" className="text-premium-gold hover:underline">
                  privacy@collectivewinners.org
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
