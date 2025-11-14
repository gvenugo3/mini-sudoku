# 🔥 Firebase Setup Guide

This guide explains how to set up Firebase for the Mini Sudoku application using environment variables.

## 📋 Quick Start

### 1. Create Your Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click ⚙️ **Settings** → **Project Settings**
4. Scroll to **"Your apps"** section
5. Click the web icon `</>` (or create a web app if you haven't)
6. Copy your Firebase configuration values

### 3. Fill in Your `.env` File

Open `.env` and replace the placeholder values with your actual Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyABC123def456GHI789jklMNO012pqrSTU
VITE_FIREBASE_AUTH_DOMAIN=mini-sudoku-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-sudoku-12345
VITE_FIREBASE_STORAGE_BUCKET=mini-sudoku-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

### 4. Generate Firebase Config

Run the build script to generate `firebase-config.js` from your `.env` file:

```bash
npm run build:config
```

You should see:
```
✅ Successfully generated firebase-config.js from .env
🔥 Firebase credentials loaded and ready!
```

### 5. Start the Application

```bash
npm start
```

The application will automatically:
- Generate `firebase-config.js` from `.env`
- Start the local server
- Load Firebase in production mode

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run build:config` | Generate firebase-config.js from .env |
| `npm start` | Build config + start server |
| `npm run dev` | Build config + watch CSS changes |
| `npm run build` | Build config + production CSS |

---

## 🔒 Security

### What's Safe to Commit ✅

- `.env.example` - Template with placeholders
- `generate-firebase-config.js` - Build script
- All other project files

### What's Ignored ❌ (Never Commit)

- `.env` - Your actual credentials
- `firebase-config.js` - Auto-generated from .env

Both are already in `.gitignore` for your safety!

---

## 🚀 Deployment

### Deploying to Vercel, Netlify, or Similar

1. **Add Environment Variables in Platform Settings:**

   Go to your deployment platform's dashboard and add these environment variables:

   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Set Build Command:**

   ```bash
   npm run build
   ```

3. **Deploy!**

   Your platform will:
   - Read environment variables
   - Run `npm run build`
   - Generate `firebase-config.js` automatically
   - Build your application

### Example: Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "."

[build.environment]
  NODE_VERSION = "18"
```

Then add your `VITE_FIREBASE_*` variables in:
**Netlify Dashboard** → **Site settings** → **Environment variables**

### Example: Vercel

```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "outputDirectory": "."
}
```

Add environment variables in:
**Vercel Dashboard** → **Settings** → **Environment Variables**

---

## 🔧 Firebase Console Setup

After setting up your credentials, you also need to configure Firebase services:

### 1. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)

### 2. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **production mode**
4. Choose your preferred location

### 3. Set Security Rules

Copy these rules to **Firestore** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data: authenticated users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Game history: users can only access their own games
    match /users/{userId}/games/{gameId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish** to save.

### 4. Configure API Key Restrictions (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Find your API key
5. Click **Edit**
6. Under **Application restrictions**:
   - Select **HTTP referrers**
   - Add your domain (e.g., `yourdomain.com/*`)
7. Save

---

## 🐛 Troubleshooting

### "Firebase not configured" warning

**Problem:** You see a warning that Firebase is not configured.

**Solution:**
1. Make sure `.env` file exists (copy from `.env.example`)
2. Fill in your actual Firebase credentials
3. Run `npm run build:config`
4. Restart the server

### "YOUR_API_KEY" placeholders still showing

**Problem:** `firebase-config.js` still has placeholder values.

**Solution:**
1. Check your `.env` file has actual values (not `your_api_key_here`)
2. Re-run `npm run build:config`
3. Check the console output for any warnings

### Authentication not working

**Problem:** Sign-in fails or shows errors.

**Solution:**
1. Verify Firebase Authentication is enabled in Firebase Console
2. Check your API key is correct
3. Ensure your domain is allowed in Firebase Console:
   - **Authentication** → **Settings** → **Authorized domains**
4. Check browser console for specific error messages

### Environment variables not loading on deployment

**Problem:** Deployed site doesn't connect to Firebase.

**Solution:**
1. Verify environment variables are set in your deployment platform
2. Check variable names match exactly: `VITE_FIREBASE_*`
3. Redeploy after adding variables
4. Check build logs for errors

---

## ℹ️ How It Works

1. **Development:**
   - You edit `.env` with your credentials
   - Run `npm run build:config` to generate `firebase-config.js`
   - The app imports and uses `firebase-config.js`

2. **Deployment:**
   - Platform reads environment variables from settings
   - Build command runs `npm run build:config`
   - Script generates `firebase-config.js` from env vars
   - App is deployed with generated config

3. **Security:**
   - `.env` is gitignored (never committed)
   - `firebase-config.js` is gitignored (generated on-demand)
   - Only `.env.example` with placeholders is committed
   - Actual credentials stay in platform's secure environment variables

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Best Practices](https://firebase.google.com/support/guides/security-checklist)

---

## 💡 Tips

1. **Never commit `.env`** - It's already gitignored, but double-check!
2. **Use different projects** - Create separate Firebase projects for dev/staging/production
3. **Rotate API keys** - If credentials are exposed, rotate them immediately in Firebase Console
4. **Enable App Check** - For additional security in production
5. **Monitor usage** - Check Firebase Console for unusual activity

---

**Need Help?** Open an issue on GitHub or check the main README.md for more information.
