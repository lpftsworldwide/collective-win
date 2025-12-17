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

interface DepositConfirmationEmailProps {
  display_name: string;
  deposit_amount: number;
  new_balance: number;
  transaction_id: string;
  site_url: string;
}

export const DepositConfirmationEmail = ({
  display_name,
  deposit_amount,
  new_balance,
  transaction_id,
  site_url,
}: DepositConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Deposit Successful - Ready to Play! 💰</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>CollectiveWinnings.org</Heading>
          <Text style={tagline}>Where Winners Unite</Text>
        </Section>
        
        <Section style={content}>
          <Section style={successBox}>
            <Text style={successIcon}>✓</Text>
            <Heading style={h2}>Deposit Confirmed!</Heading>
          </Section>
          
          <Text style={text}>
            Hi {display_name},
          </Text>
          
          <Text style={text}>
            Your deposit has been successfully processed and your account is ready for action!
          </Text>
          
          <Section style={detailsBox}>
            <Section style={detailRow}>
              <Text style={detailLabel}>Deposit Amount:</Text>
              <Text style={detailValue}>${deposit_amount.toFixed(2)} AUD</Text>
            </Section>
            <Hr style={detailDivider} />
            <Section style={detailRow}>
              <Text style={detailLabel}>New Balance:</Text>
              <Text style={detailValueHighlight}>${new_balance.toFixed(2)} AUD</Text>
            </Section>
            <Hr style={detailDivider} />
            <Section style={detailRow}>
              <Text style={detailLabel}>Transaction ID:</Text>
              <Text style={detailValueSmall}>{transaction_id}</Text>
            </Section>
          </Section>
          
          <Text style={text}>
            {deposit_amount >= 30 && (
              <strong>🎁 Daily Bonus Eligible: You qualify for today's Free Spin round!</strong>
            )}
          </Text>
          
          <Link
            href={`${site_url}`}
            style={button}
          >
            Start Playing Now
          </Link>
          
          <Hr style={divider} />
          
          <Text style={infoText}>
            <strong>Quick Tips:</strong>
          </Text>
          <Section style={tips}>
            <Text style={tipItem}>• Your balance updates instantly after each game</Text>
            <Text style={tipItem}>• Check game RTP percentages before playing</Text>
            <Text style={tipItem}>• Set deposit limits in your account settings</Text>
            <Text style={tipItem}>• Withdrawals processed within 24 hours</Text>
          </Section>
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
            <Link href={`${site_url}/transactions`} style={link}>
              View Transactions
            </Link>
            {' | '}
            <Link href="mailto:compliance@collectivewinnings.org" style={link}>
              Support
            </Link>
          </Text>
          <Text style={footerDisclaimer}>
            This email confirms your financial transaction. If you did not authorize this deposit, 
            please contact our support team immediately at compliance@collectivewinnings.org
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default DepositConfirmationEmail;

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

const successBox = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const successIcon = {
  fontSize: '64px',
  color: '#4db8b8',
  margin: '0',
};

const h2 = {
  color: '#d4af37',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '10px 0 0',
  textAlign: 'center' as const,
};

const text = {
  color: '#e8eaed',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const detailsBox = {
  backgroundColor: '#0f1419',
  border: '1px solid #2a3f52',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const detailRow = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
};

const detailLabel = {
  color: '#9aa0a6',
  fontSize: '14px',
  margin: '0',
};

const detailValue = {
  color: '#e8eaed',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const detailValueHighlight = {
  color: '#d4af37',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
};

const detailValueSmall = {
  color: '#9aa0a6',
  fontSize: '12px',
  fontFamily: 'monospace',
  margin: '0',
};

const detailDivider = {
  borderColor: '#2a3f52',
  margin: '12px 0',
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

const infoText = {
  color: '#e8eaed',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
};

const tips = {
  margin: '12px 0',
};

const tipItem = {
  color: '#9aa0a6',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
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
