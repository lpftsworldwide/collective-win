# 🚀 DEPLOY ONBOARDING FUNCTION

## Quick Deploy Options

### Option 1: Automated Script (Recommended)

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-onboarding-function.sh
```

The script will:
- Check for access token
- Prompt if not found
- Deploy via CLI
- Provide fallback instructions if CLI fails

---

### Option 2: Python Script (Alternative)

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
python3 deploy-onboarding-via-api.py
```

This uses the Supabase Management API directly.

---

### Option 3: Manual via Supabase Dashboard

1. **Get Access Token:**
   - Go to: https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Copy the token (starts with `sbp_`)

2. **Deploy Function:**
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
   - Click "Create Function" or "New Function"
   - Name: `process-onboarding`
   - Copy contents from: `supabase/functions/process-onboarding/index.ts`
   - Paste into the editor
   - Click "Deploy"

---

### Option 4: CLI with Token

```bash
# Set token
export SUPABASE_ACCESS_TOKEN="sbp_YOUR_TOKEN_HERE"

# Deploy
npx supabase functions deploy process-onboarding \
  --project-ref yiorietrtfosjnpzznnr \
  --no-verify-jwt
```

---

## Verify Deployment

After deployment, test the function:

```bash
curl -X POST \
  https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/process-onboarding \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "processed": 0,
  "message": "Processed 0 onboarding items"
}
```

---

## Set Up Scheduled Task

After deploying, set up a cron job to process the queue every minute:

### Using pg_cron (if enabled):

```sql
SELECT cron.schedule(
  'process-onboarding',
  '* * * * *',
  'SELECT public.process_onboarding_queue(10);'
);
```

### Using External Cron Service:

Set up a cron job to call the function every minute:

```
POST https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/process-onboarding
Headers: Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

---

## Troubleshooting

### "Access token not provided"
- Get token from: https://supabase.com/dashboard/account/tokens
- Set: `export SUPABASE_ACCESS_TOKEN="sbp_..."`

### "Function not found"
- Deploy via Dashboard first
- Or use the Python script which handles creation

### "Unauthorized"
- Make sure token starts with `sbp_`
- Token must have project access

---

**Ready to deploy!** 🚀

