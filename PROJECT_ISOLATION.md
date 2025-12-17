# Project Isolation Verification

## Supabase Project Configuration

**COLLECTIVE-WINS Project:**
- **Project ID:** `yiorietrtfosjnpzznnr`
- **Project Name:** COLLECTUVE-WINS
- **Organization:** advisionLPFTS FREE
- **Status:** Isolated from lpfts.com

## Isolation Checklist

✅ **Separate Supabase Project**
- Uses project ID: `yiorietrtfosjnpzznnr`
- Configured in: `supabase/config.toml`
- No references to lpfts.com project ID

✅ **No Cross-Project References**
- No hardcoded project IDs from lpfts.com
- Environment variables are project-specific
- All Supabase clients use environment variables

✅ **Code Isolation**
- All code in `Projects/COLLECTIVE-WINS/` directory
- No imports from LPFTS projects
- Independent codebase

✅ **Database Isolation**
- Separate database schema
- No shared tables with lpfts.com
- Independent migrations

✅ **Edge Functions Isolation**
- Functions deployed to COLLECTIVE-WINS project only
- No cross-project function calls
- Independent function configuration

## Environment Variables Required

The following environment variables must be set for COLLECTIVE-WINS:

```bash
# Frontend (.env or .env.local)
VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable_key_from_project>

# Edge Functions (set in Supabase dashboard)
SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_from_project>
SUPABASE_PUBLISHABLE_KEY=<publishable_key_from_project>
```

## Verification Steps

1. ✅ Check `supabase/config.toml` - Uses correct project ID
2. ✅ Check environment variables - No references to lpfts.com project
3. ✅ Check code imports - No cross-project dependencies
4. ✅ Verify Supabase dashboard - Project is separate

## Important Notes

- **DO NOT** use lpfts.com project credentials
- **DO NOT** reference lpfts.com project ID anywhere
- **DO NOT** share database tables or schemas
- This project is completely independent

## Last Verified

- Date: 2024-12-17
- Project ID: `yiorietrtfosjnpzznnr`
- Status: ✅ Isolated and safe

