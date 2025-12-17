import React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';

interface WelcomeBonusEmailProps {
  display_name: string;
  bonus_amount: number;
  site_url: string;
}

export const WelcomeBonusEmail = ({
  display_name,
  bonus_amount,
  site_url,
}: WelcomeBonusEmailProps) => (
  <Html>
    <Head />
    <Preview>Your $111 Welcome Bonus is Ready! 🎰</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>CollectiveWinnings.org</Heading>
          <Text style={tagline}>Where Winners Unite</Text>
        </Section>
        
        <Section style={content}>
          <Heading style={h2}>Welcome, {display_name}! 🎉</Heading>
          
          <Text style={text}>
            You've successfully joined CollectiveWinnings.org and your account is ready to roll!
          </Text>
          
          <Section style={bonusBox}>
            <Text style={bonusAmount}>${bonus_amount}</Text>
            <Text style={bonusLabel}>WELCOME BONUS CREDITED</Text>
          </Section>
          
          <Text style={text}>
            Your exclusive welcome bonus has been credited to your account. Here's what you can do next:
          </Text>
          
          <Section style={features}>
            <Text style={featureItem}>✨ Play 30+ premium slot games</Text>
            <Text style={featureItem}>🎯 Transparent RTP on all games</Text>
            <Text style={featureItem}>⚡ Instant deposits & withdrawals</Text>
            <Text style={featureItem}>🎁 Daily bonus top-ups available</Text>
          </Section>
          
          <Link
            href={`${site_url}`}
            style={button}
          >
            Start Playing Now
          </Link>
          
          <Hr style={divider} />
          
          <Text style={disclaimer}>
            <strong>Bonus Terms:</strong> Bonus is subject to a 35x playthrough requirement on eligible games. 
            Minimum deposit of AUD $30.00 required for withdrawals. Full T&Cs apply.
          </Text>
          
          <Text style={disclaimer}>
            Daily Bonus Top-Up: Deposit AUD $30+ to receive 1x Free Spin round credited instantly. 
            Free Spin winnings are subject to 1x turnover.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            CollectiveWinnings.org - Licensed & Regulated Gaming Platform
          </Text>
          <Text style={footerText}>
            <Link href={`${site_url}`} style={link}>
              Visit Website
            </Link>
            {' | '}
            <Link href={`${site_url}/help`} style={link}>
              Help Center
            </Link>
            {' | '}
            <Link href="mailto:compliance@collectivewinnings.org" style={link}>
              Contact Us
            </Link>
          </Text>
          <Text style={footerDisclaimer}>
            Please gamble responsibly. This platform is intended for entertainment purposes for users 18 years or older. 
            If you feel you have a gambling problem, please seek help from professional organizations.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeBonusEmail;

// Styles
const main = {
  backgroundColor: '#0f1419',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const h1 = {
  color: '#0f1419',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const tagline = {
  color: '#2a3f52',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  backgroundColor: '#1a2332',
  padding: '40px 30px',
  borderRadius: '0 0 12px 12px',
};

const h2 = {
  color: '#d4af37',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const text = {
  color: '#e8eaed',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const bonusBox = {
  backgroundColor: '#0f1419',
  border: '2px solid #d4af37',
  borderRadius: '12px',
  padding: '30px',
  textAlign: 'center' as const,
  margin: '30px 0',
  boxShadow: '0 10px 40px -10px rgba(212, 175, 55, 0.4)',
};

const bonusAmount = {
  color: '#d4af37',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0',
  textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
};

const bonusLabel = {
  color: '#4db8b8',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '10px 0 0',
  letterSpacing: '2px',
};

const features = {
  margin: '24px 0',
};

const featureItem = {
  color: '#e8eaed',
  fontSize: '16px',
  lineHeight: '32px',
  margin: '0',
};

const button = {
  backgroundColor: '#d4af37',
  backgroundImage: 'linear-gradient(135deg, #d4af37, #b8941f)',
  borderRadius: '8px',
  color: '#0f1419',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
  margin: '32px 0',
  boxShadow: '0 10px 40px -10px rgba(212, 175, 55, 0.4)',
};

const divider = {
  borderColor: '#2a3f52',
  margin: '32px 0',
};

const disclaimer = {
  color: '#9aa0a6',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '12px 0',
};

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9aa0a6',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const link = {
  color: '#4db8b8',
  textDecoration: 'underline',
};

const footerDisclaimer = {
  color: '#6e7681',
  fontSize: '11px',
  lineHeight: '16px',
  margin: '16px 0 0',
  fontStyle: 'italic' as const,
};
