# 🎯 App Mode Configuration Guide

Quick reference for configuring dev vs production modes using environment variables.

---

## 🚀 Quick Start

### Development Mode (No Firebase)
```env
# .env
VITE_APP_MODE=dev
```
Then run:
```bash
npm run build:config
npm start
```

### Production Mode (With Firebase)
```env
# .env
VITE_APP_MODE=production
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```
Then run:
```bash
npm run build:config
npm start
```

---

## 📊 Mode Comparison

| Feature | Dev Mode | Production Mode |
|---------|----------|-----------------|
| **Sudoku Game** | ✅ Full game | ✅ Full game |
| **Timer & Mistakes** | ✅ Yes | ✅ Yes |
| **Theme Toggle** | ✅ Yes | ✅ Yes |
| **Number Pad** | ✅ Yes | ✅ Yes |
| **User Authentication** | ❌ No | ✅ Email + Google |
| **Dashboard** | ❌ No | ✅ Stats & History |
| **Cloud Sync** | ❌ No | ✅ Cross-device |
| **Game History** | ❌ No | ✅ Firestore |
| **Leaderboard** | ❌ No | ✅ Global rankings |
| **Firebase Required** | ❌ No | ✅ Yes |
| **Internet Required** | ❌ No | ✅ Yes |

---

## 🔄 Switching Between Modes

### Method 1: Edit .env (Recommended)

```bash
# 1. Open .env file
nano .env  # or use any editor

# 2. Change VITE_APP_MODE
VITE_APP_MODE=dev    # or "production"

# 3. Rebuild config
npm run build:config

# 4. Restart app
npm start
```

### Method 2: Environment Variables (CI/CD)

Set in your deployment platform:
```
VITE_APP_MODE=production
```

---

## 🎨 Use Cases

### When to Use Dev Mode

✅ **Local development**
- Testing game logic
- UI/UX development
- Quick iterations
- No internet needed
- Privacy-focused usage

✅ **Offline environments**
- Playing without internet
- Demo presentations
- Testing on airplane mode

✅ **Learning & customization**
- Studying the codebase
- Modifying features
- Building similar apps

### When to Use Production Mode

✅ **Public deployment**
- Hosting on Vercel/Netlify
- Production website
- User-facing application

✅ **Multi-user features**
- User accounts
- Statistics tracking
- Leaderboards
- Game history

✅ **Cross-device sync**
- Play on multiple devices
- Cloud-saved progress
- Persistent stats

---

## 🛠️ Configuration Examples

### Local Development (No Firebase)

**.env**
```env
VITE_APP_MODE=dev
```

**Result:**
- Game loads instantly
- No Firebase initialization
- Console: `🎯 App Mode: dev`
- No auth modal or dashboard

---

### Production with Firebase

**.env**
```env
VITE_APP_MODE=production
VITE_FIREBASE_API_KEY=AIzaSyABC123...
VITE_FIREBASE_AUTH_DOMAIN=mini-sudoku.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-sudoku-12345
VITE_FIREBASE_STORAGE_BUCKET=mini-sudoku-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABCD1234
```

**Result:**
- Full authentication features
- Dashboard with stats
- Console: `🎯 App Mode: production`
- Firebase initialized

---

### Staging Environment

**.env.staging**
```env
VITE_APP_MODE=production
VITE_FIREBASE_API_KEY=your_staging_key
VITE_FIREBASE_AUTH_DOMAIN=mini-sudoku-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-sudoku-staging
# ... other staging credentials
```

Use different Firebase project for staging!

---

## 🔍 Verification

After changing mode, verify it's working:

### Check Console Output

**Dev Mode:**
```
🎯 App Mode: dev
🔧 Dev mode: Skipping Firebase initialization
```

**Production Mode:**
```
🎯 App Mode: production
✅ Firebase initialized successfully
```

### Check UI

**Dev Mode:**
- No "Sign In" button
- No dashboard sidebar
- Game centered on screen

**Production Mode:**
- "Sign In to Save Progress" button visible
- Dashboard sidebar (or hamburger menu on mobile)
- User profile section

---

## 🐛 Common Issues

### Mode not changing after editing .env

**Solution:**
```bash
# Regenerate the config
npm run build:config

# Hard refresh browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + F5
```

### Production mode but no Firebase features

**Checklist:**
- [ ] `VITE_APP_MODE=production` in .env
- [ ] All Firebase env vars filled in
- [ ] Ran `npm run build:config`
- [ ] Restarted the server
- [ ] Hard refreshed browser

### Dev mode showing Firebase errors

**This is normal!** The app tries to import firebase-config.js but gracefully skips initialization in dev mode. These warnings can be ignored.

---

## 📱 Deployment Platform Examples

### Vercel

**Environment Variables:**
```
VITE_APP_MODE=production
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... other vars
```

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.`

### Netlify

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "."

[build.environment]
  NODE_VERSION = "18"
```

**Environment Variables:**
Add all `VITE_*` variables in Netlify dashboard

### Render

**Build Command:** `npm run build`
**Environment:**
Add all `VITE_*` variables in Render dashboard

---

## 💡 Tips

1. **Use separate Firebase projects** for dev/staging/production
2. **Never commit .env** - it's already gitignored
3. **Document your env setup** for team members
4. **Use .env.example** as a template
5. **Test both modes** before deploying

---

## 🔗 Related Documentation

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Complete Firebase setup guide
- [README.md](./README.md) - Project overview and features
- [.env.example](./.env.example) - Environment variable template

---

**Need help?** Check the troubleshooting section in FIREBASE_SETUP.md or open an issue on GitHub.
