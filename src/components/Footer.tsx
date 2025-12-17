import { Link } from "react-router-dom";
import { Eye, Shield, FileText, Scale, Lock, HelpCircle, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-premium-gold/20 bg-gaming-dark/95 mt-16 relative">
      {/* Egyptian top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-premium-gold to-ancient-bronze">
                <Eye className="w-5 h-5 text-gaming-dark" />
              </div>
              <div>
                <p className="font-cinzel font-bold text-premium-gold">CollectiveWinners</p>
                <p className="text-xs text-muted-foreground">.org</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-crimson leading-relaxed">
              Australia's premier licensed gaming platform. Experience ancient fortune with modern security.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald">
              <Shield className="w-4 h-4" />
              <span>Licensed & Regulated</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel font-bold text-premium-gold text-sm flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-premium-gold transition-colors flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-premium-gold transition-colors flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/aml-policy" className="text-muted-foreground hover:text-premium-gold transition-colors flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  AML Policy
                </Link>
              </li>
              <li>
                <Link to="/fair-play" className="text-muted-foreground hover:text-premium-gold transition-colors flex items-center gap-2">
                  <Scale className="w-3 h-3" />
                  Fair Play & RNG
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel font-bold text-premium-gold text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/responsible-gambling" className="text-muted-foreground hover:text-premium-gold transition-colors">
                  Responsible Gaming
                </Link>
              </li>
              <li>
                <Link to="/kyc" className="text-muted-foreground hover:text-premium-gold transition-colors">
                  KYC Verification
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-premium-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a 
                  href="tel:0800654655" 
                  className="text-turquoise hover:text-turquoise-light transition-colors"
                >
                  Gambling Helpline NZ: 0800 654 655
                </a>
              </li>
              <li>
                <a 
                  href="tel:0800664262" 
                  className="text-turquoise hover:text-turquoise-light transition-colors"
                >
                  Problem Gambling Foundation: 0800 664 262
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-cinzel font-bold text-premium-gold text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3 h-3 text-premium-gold" />
                support@collectivewinners.org
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3 h-3 text-premium-gold" />
                1800 CW HELP (1800 29 4357)
              </li>
              <li className="text-xs text-muted-foreground mt-2">
                24/7 Support Available
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            {/* License Info */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-premium-gold" />
              <span>Licensed under Australian Gaming Regulations</span>
            </div>
            
            {/* Age Restriction */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-mystic-red/20 border border-mystic-red/50 flex items-center justify-center text-mystic-red font-bold text-xs">
                18+
              </div>
              <span className="text-xs text-muted-foreground">Adults Only</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed font-crimson">
            <strong className="text-amber-400">18+ | Play Responsibly</strong> • Compulsive gaming is when a person risks something in a hope to get something bigger in return. 
            Gambling addiction is the urge to continue betting no matter what impact the losses have on one's life. 
            This platform is intended for entertainment purposes only. If you feel you have a gambling problem, please seek help immediately. 
            <a href="tel:0800654655" className="text-premium-gold hover:underline ml-1">
              Gambling Helpline NZ: 0800 654 655
            </a>
            {" "}|{" "}
            <a href="tel:0800664262" className="text-premium-gold hover:underline">
              Problem Gambling Foundation: 0800 664 262
            </a>
          </p>

          {/* Egyptian decoration */}
          <div className="flex items-center justify-center gap-2 mt-6 text-premium-gold/30">
            <span>𓂀</span>
            <span>𓃭</span>
            <span>𓆣</span>
            <span>𓇳</span>
            <span>𓊹</span>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/50 mt-4">
            © {new Date().getFullYear()} CollectiveWinners.org. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
