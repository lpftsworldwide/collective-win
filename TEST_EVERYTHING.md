# 🧪 TEST EVERYTHING - GAMES, AUTH, ADMIN

## 🎮 Game Testing Checklist

### 1. Database Games ✅
- **Status**: 53 games in database
- **All have**: Correct `thumbnail_url` values
- **All have**: Status = 'active'

### 2. Game Mechanics Test

**Run test script:**
```bash
export SUPABASE_SERVICE_ROLE_KEY='your-key'
python3 test-game-mechanics.py
```

**Or test manually:**
1. Sign up or log in
2. Go to a game (e.g., Gates of Olympus)
3. Place a bet ($1.00)
4. Click "Spin"
5. Verify:
   - ✅ Reels spin
   - ✅ Win/loss calculated
   - ✅ Balance updates
   - ✅ No errors in console

### 3. Games Match Website

**Verify:**
- Games in database match games displayed on landing page
- All 53 games show with correct names
- Images load correctly (not placeholders)

---

## 🔐 Auth Testing

### Signup Flow

1. **Go to**: https://collective-win.vercel.app/auth
2. **Click**: "Register" tab
3. **Fill in**:
   - Name
   - Email (new email)
   - Password
   - Date of Birth (18+)
   - Payment details
   - Accept terms
4. **Click**: "JOIN & CLAIM $111 BONUS"
5. **Expected**:
   - ✅ No "Unregistered API key" error
   - ✅ Success message
   - ✅ Email confirmation sent (if enabled)
   - ✅ Bonus claimed automatically

### Login Flow

1. **Go to**: https://collective-win.vercel.app/auth
2. **Click**: "Login" tab
3. **Enter**:
   - Email: `advsions@proton.me`
   - Password: `Fuckingdogs2025`
4. **Click**: "ENTER THE REALM"
5. **Expected**:
   - ✅ Login successful
   - ✅ Redirected to home page
   - ✅ User balance displayed
   - ✅ Can access games

### Admin Account

**Create admin account:**
1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/auth/users
2. Click "Add User" → "Create new user"
3. Email: `advsions@proton.me`
4. Password: `Fuckingdogs2025`
5. Auto Confirm: ✅ Yes
6. Click "Create User"

**Then run SQL:**
```sql
INSERT INTO public.admin_users (user_id, is_master)
SELECT id, true
FROM auth.users
WHERE email = 'advsions@proton.me'
ON CONFLICT (user_id) DO UPDATE
SET is_master = true;
```

**Test admin access:**
- Login with admin account
- Should have access to admin features
- Can test games with master mode (if implemented)

---

## 🎰 Game Mechanics Test

### Test Each Game Type

1. **Slots** (e.g., Gates of Olympus):
   - ✅ Reels spin correctly
   - ✅ Win calculation works
   - ✅ Multiplier displayed
   - ✅ Balance updates

2. **Table Games** (e.g., Blackjack):
   - ✅ Game loads
   - ✅ Betting works
   - ✅ Outcomes calculated

3. **Live Games** (e.g., Roulette):
   - ✅ Game interface loads
   - ✅ Can place bets

### Algorithm Verification

**Test RNG:**
- Same seed → Same outcome (provably fair)
- Different seeds → Different outcomes
- Win rates match RTP

**Test Features:**
- Bonus rounds trigger correctly
- Free spins work
- Multipliers apply correctly

---

## ✅ Pre-Deployment Checklist

- [ ] RLS policies run (fixes 401 errors)
- [ ] Admin account created
- [ ] Signup tested (no API key errors)
- [ ] Login tested (admin account works)
- [ ] Games load from database
- [ ] Images display correctly
- [ ] Spin function works
- [ ] Balance updates correctly
- [ ] No console errors

---

## 🚀 After SQL Fix

Once you run `FIX_RLS_PUBLIC_ACCESS.sql`:

1. **Games will load** from database (no 401 errors)
2. **Images will display** (not placeholders)
3. **Signup will work** (no API key errors)
4. **Login will work** (admin account accessible)
5. **Games will be playable** (spin function works)

---

**Run the SQL fix and test everything!** 🎮

