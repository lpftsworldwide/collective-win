# SoftGamings API Integration Setup Guide

## Overview

This guide will help you integrate SoftGamings API to access 16,000+ licensed casino games including JILI, Boomberg, Pragmatic Play, and more.

**Reference:** [SoftGamings Casino Games Integration](https://www.softgamings.com/products/casino-games-integration/)

## Step 1: Contact SoftGamings

### Contact Information
- **Email:** sales@softgamings.com
- **Phone:** +357 2200 7440 or +371 23 201 221
- **Website:** https://www.softgamings.com/products/casino-games-integration/
- **Contact Form:** Available on their website

### What to Request
1. API access for casino games integration
2. Access to JILI and Boomberg games (specifically)
3. API documentation
4. Test/sandbox credentials
5. Production credentials after approval
6. Webhook configuration details

### Expected Timeline
- Initial response: 24-48 hours
- Approval process: 1-2 weeks
- Integration support: Provided by SoftGamings team

## Step 2: Get API Credentials

Once approved, SoftGamings will provide:

```
- API Endpoint: https://api.softgamings.com/v1 (example - confirm with them)
- API Key: <provided by SoftGamings>
- Secret Key: <provided by SoftGamings>
- Merchant ID: <your merchant account ID>
- Webhook Secret: <for verifying webhook signatures>
```

## Step 3: Add Credentials to Database

### Option A: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL (replace with your actual credentials):

```sql
-- Get SoftGamings provider ID
DO $$
DECLARE
  v_provider_id UUID;
BEGIN
  -- Get or create SoftGamings provider
  SELECT id INTO v_provider_id
  FROM public.game_providers
  WHERE code = 'softgamings';

  IF v_provider_id IS NULL THEN
    INSERT INTO public.game_providers (name, code, status, integration_type, api_endpoint)
    VALUES ('SoftGamings', 'softgamings', 'active', 'aggregator', 'https://api.softgamings.com/v1')
    RETURNING id INTO v_provider_id;
  END IF;

  -- Insert or update provider config
  INSERT INTO public.game_provider_configs (
    provider_id,
    aggregator_name,
    aggregator_api_endpoint,
    aggregator_api_key,
    aggregator_secret_key,
    merchant_id,
    iframe_base_url,
    launch_url_template,
    status
  ) VALUES (
    v_provider_id,
    'softgamings',
    'https://api.softgamings.com/v1', -- Confirm actual endpoint with SoftGamings
    'YOUR_API_KEY_HERE', -- Replace with actual API key
    'YOUR_SECRET_KEY_HERE', -- Replace with actual secret key
    'YOUR_MERCHANT_ID_HERE', -- Replace if required
    'https://games.softgamings.com', -- Confirm actual iframe base URL
    'https://games.softgamings.com/launch?game={gameCode}&token={token}', -- Confirm template
    'active'
  )
  ON CONFLICT (provider_id, status) 
  DO UPDATE SET
    aggregator_api_key = EXCLUDED.aggregator_api_key,
    aggregator_secret_key = EXCLUDED.aggregator_secret_key,
    merchant_id = EXCLUDED.merchant_id,
    updated_at = now();
END $$;
```

### Option B: Via Migration Script

Create a file: `supabase/migrations/YYYYMMDD_add_softgamings_config.sql`

```sql
-- Add SoftGamings configuration
-- Replace YOUR_* values with actual credentials from SoftGamings

DO $$
DECLARE
  v_provider_id UUID;
BEGIN
  SELECT id INTO v_provider_id FROM public.game_providers WHERE code = 'softgamings';
  
  INSERT INTO public.game_provider_configs (
    provider_id,
    aggregator_name,
    aggregator_api_endpoint,
    aggregator_api_key,
    aggregator_secret_key,
    merchant_id,
    iframe_base_url,
    launch_url_template,
    status
  ) VALUES (
    v_provider_id,
    'softgamings',
    'YOUR_API_ENDPOINT',
    'YOUR_API_KEY',
    'YOUR_SECRET_KEY',
    'YOUR_MERCHANT_ID',
    'YOUR_IFRAME_BASE_URL',
    'YOUR_LAUNCH_URL_TEMPLATE',
    'active'
  )
  ON CONFLICT DO NOTHING;
END $$;
```

## Step 4: Configure Edge Functions

### Add Webhook Secret

1. Go to Supabase Dashboard → Edge Functions → Settings
2. Add Secret:
   - Name: `WEBHOOK_SECRET`
   - Value: `<webhook secret from SoftGamings>`

### Deploy Edge Functions

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Deploy game-launch function
supabase functions deploy game-launch

# Deploy game-webhook function
supabase functions deploy game-webhook
```

## Step 5: Configure Webhook URL

In SoftGamings dashboard, set webhook URL to:

```
https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/game-webhook
```

## Step 6: Populate Game Catalog

Once API is working, you can fetch game list from SoftGamings and populate the `licensed_games` table.

### Example: Add JILI Games

```sql
-- Example: Add Fortune Tiger (JILI game)
INSERT INTO public.licensed_games (
  provider_id,
  game_code,
  name,
  category,
  rtp_certified,
  volatility,
  status,
  min_bet_aud,
  max_bet_aud
) VALUES (
  (SELECT id FROM public.game_providers WHERE code = 'jili'),
  'fortune-tiger', -- Confirm actual game code with SoftGamings
  'Fortune Tiger',
  'slot',
  96.50,
  'High',
  'active',
  0.20,
  1000.00
);
```

## Step 7: Test Integration

1. **Test Game Launch:**
   - Go to a licensed game in your app
   - Click "Play"
   - Should launch game in iframe

2. **Test Webhooks:**
   - Play a game
   - Check Supabase logs for webhook events
   - Verify transactions are recorded

3. **Test Balance Updates:**
   - Make a bet in game
   - Verify balance updates in your database
   - Check transaction records

## Troubleshooting

### "Provider API configuration not found"
- Check `game_provider_configs` table has entry for SoftGamings
- Verify `status = 'active'`
- Check provider_id matches

### "SoftGamings API error"
- Verify API endpoint is correct
- Check API key and secret key
- Confirm signature algorithm matches SoftGamings requirements
- Check API documentation for exact request format

### Webhooks not working
- Verify webhook URL is set in SoftGamings dashboard
- Check webhook secret matches
- Review Supabase Edge Functions logs
- Test webhook endpoint manually

## API Documentation

Once you have SoftGamings access, they will provide:
- API endpoint URLs
- Authentication method
- Request/response formats
- Signature algorithm
- Webhook event types
- Error codes

## Support

- **SoftGamings Support:** Contact your account manager
- **Technical Issues:** Check Supabase Edge Functions logs
- **Integration Help:** Refer to SoftGamings API documentation

## Next Steps After Setup

1. ✅ Add API credentials to database
2. ✅ Deploy edge functions
3. ✅ Configure webhook URL
4. ✅ Test game launch
5. ✅ Populate game catalog
6. ✅ Test transactions
7. ✅ Go live!

## Important Notes

- **Never commit API keys to git** - use Supabase secrets
- **Test in sandbox first** - SoftGamings provides test environment
- **Monitor webhooks** - Check logs regularly
- **Keep credentials secure** - Rotate keys periodically

