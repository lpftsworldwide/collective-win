# GitHub Authentication Setup

## ⚠️ Important: GitHub No Longer Accepts Passwords

GitHub requires a **Personal Access Token (PAT)** instead of your password for git operations.

## 🔑 Create a Personal Access Token

1. **Go to:** https://github.com/settings/tokens
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Name it:** `collective-wins-deploy` (or any name)
4. **Select scopes:**
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (if you plan to use GitHub Actions)
5. **Click:** "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

## 📤 Push Using Token

When git asks for password, use your **Personal Access Token** instead:

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Push (will prompt for username and password)
git push -u origin main

# Username: lpftsworldwide
# Password: [PASTE YOUR PERSONAL ACCESS TOKEN HERE]
```

## 🔐 Alternative: Use SSH (Recommended)

### 1. Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter for no passphrase (or set one)
```

### 2. Add SSH Key to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Paste your public key
4. Click "Add SSH key"

### 3. Change Remote to SSH
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
git remote set-url origin git@github.com:lpftsworldwide/collective-win.git
git push -u origin main
```

## ✅ Quick Push (Using Token)

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Method 1: Push with token in URL (one-time)
git push https://YOUR_TOKEN@github.com/lpftsworldwide/collective-win.git main

# Method 2: Use credential helper (saves token)
git config --global credential.helper store
git push -u origin main
# Enter: lpftsworldwide
# Enter: YOUR_TOKEN
```

---

**Choose one method above and push!** 🚀

