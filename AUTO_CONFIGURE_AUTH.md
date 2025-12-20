# 🚀 AUTOMATED AUTH CONFIGURATION

## ✅ I'VE CREATED AUTOMATED SCRIPTS FOR YOU!

### Option 1: Management API (FULLY AUTOMATED) ⭐ RECOMMENDED

**Script:** `configure-auth-via-api.py`

**Steps:**
1. Get Management API token:
   - Go to: https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Copy the token

2. Run the script:
   ```bash
   export SUPABASE_MANAGEMENT_TOKEN='your-token-here'
   python3 configure-auth-via-api.py
   ```

**This will automatically:**
- ✅ Configure redirect URLs
- ✅ Enable email confirmations
- ✅ Set signup settings
- ✅ Configure all auth settings

---

### Option 2: Supabase CLI (If you have it installed)

**Script:** `configure-auth-full-auto.sh`

**Steps:**
1. Install Supabase CLI (if not installed):
   ```bash
   # Fedora/RHEL
   sudo dnf install supabase-cli
   
   # Or via Homebrew
   brew install supabase/tap/supabase
   ```

2. Login to Supabase CLI:
   ```bash
   supabase login
   ```

3. Run the script:
   ```bash
   ./configure-auth-full-auto.sh
   ```

---

### Option 3: Quick Manual (2 minutes)

If automation doesn't work, do this manually:

1. **Configure Redirect URLs:**
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/auth/url-configuration
   - Add these URLs:
     - `https://collective-win.vercel.app/auth/confirm`
     - `https://collective-win.vercel.app/**`
     - `http://localhost:5173/auth/confirm`
     - `http://localhost:5173/**`
   - Click "Save"

2. **Enable Email Confirmations:**
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/auth/providers
   - Enable "Email confirmations"
   - Save

**That's it!** ✅

---

## 🎯 RECOMMENDED: Use Option 1 (Management API)

It's the fastest and fully automated. Just get the token and run the script!

