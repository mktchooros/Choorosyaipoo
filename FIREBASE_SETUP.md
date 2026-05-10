# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Create Project"**
3. Project name: `sorkroom-inventory`
4. Accept terms and click **"Continue"**
5. Disable Google Analytics (click "Not now")
6. Click **"Create project"** and wait 1-2 minutes

## Step 2: Get Firebase Credentials

Once the project is created:

1. Click the **gear icon** (⚙️) → **Project Settings**
2. Scroll down to "Your apps" section
3. Click **"</>Web"** to create a web app
4. App name: `sorkroom-web`
5. Check "Also set up Firebase Hosting"
6. Click **"Register app"**
7. You'll see your config - **copy all these values**:

```
apiKey: "AIzaSy..."
authDomain: "sorkroom-inventory-xxxxx.firebaseapp.com"
projectId: "sorkroom-inventory-xxxxx"
storageBucket: "sorkroom-inventory-xxxxx.appspot.com"
messagingSenderId: "123456789..."
appId: "1:123456789:web:abcdef..."
```

## Step 3: Update .env.local

Edit: `C:\Users\prim\Desktop\สต๊อครวม ชูรสยายปู\.env.local`

Replace with your actual values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_appId
```

Save the file.

## Step 4: Enable Firebase Services

### A. Enable Firestore Database

1. In Firebase Console, go to **Build** (left menu)
2. Click **"Firestore Database"**
3. Click **"Create Database"**
4. Select: **"Start in test mode"** (for development)
5. Select location: **"asia-southeast1"** (closest to Thailand)
6. Click **"Enable"**
7. Wait for it to initialize

### B. Enable Authentication

1. In left menu, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Email/Password"** provider
4. Toggle **"Enable"** and click **"Save"**

### C. Enable Storage

1. In left menu, click **"Storage"**
2. Click **"Get started"**
3. Click **"Start in test mode"**
4. Select location: **"asia-southeast1"**
5. Click **"Done"**

## Step 5: Restart Dev Server

The dev server needs to restart to pick up the new `.env.local`:

1. In terminal, stop the current dev server (Ctrl+C)
2. Run again:
```bash
npm run dev
```

## Step 6: Test the System

1. Open **http://localhost:3000** in browser
2. You should see login page
3. Click **"Sign up"**
4. Create account:
   - Email: `test@example.com`
   - Password: `password123`
5. Click **"Sign Up"**
6. You'll be redirected to dashboard
7. Click **"Initialize Database with Sample Data"**
8. Wait for seeding to complete (shows ✅ message)
9. Page will auto-refresh

## Step 7: Test Features

### Test Receive Stock
1. From dashboard, click **"📥 รับเข้า"** (Receive)
2. Product: Select **"PG-001 - ผงหมักไก่ทอด 18g"**
3. Quantity: **100**
4. Location: **WH-A**
5. Supplier: **Main Supplier**
6. Reference: **INV-001**
7. Click **"Confirm Receipt"**
8. Should see ✅ success message

### Test Check Stock
1. From dashboard, click **"📦 สต๊อก"** (Stock)
2. Should see **PG-001** with quantities
3. Look for **200 units in WH-A** (100 initial + 100 received)

### Test Issue Stock
1. From dashboard, click **"📤 เบิก"** (Issue)
2. Product: **PG-001**
3. Quantity: **50** (less than available 200)
4. Location: **WH-A**
5. Customer: **Customer A**
6. Reference: **ORD-001**
7. Click **"Confirm Issue"**
8. Should see ✅ success

### Verify Stock Decreased
1. Go to **"📦 สต๊อก"** (Stock)
2. **PG-001** in WH-A should now be **150** (200 - 50)

### Test Reports
1. From dashboard, click **"📋 เคลื่อนไหว"** (Reports)
2. Should see entries for:
   - Receive: 100 units
   - Issue: 50 units

### Test Products Page
1. From dashboard, click **"🏷️ สินค้า"** (Products)
2. See product cards
3. Click on product image → Upload a photo

## Success Checklist

- [ ] Firebase project created
- [ ] .env.local updated with real credentials
- [ ] Dev server restarted
- [ ] Can sign up and login
- [ ] Database initialized with sample data
- [ ] Receive stock works
- [ ] Stock levels update correctly
- [ ] Issue stock works
- [ ] Reports show movements
- [ ] Can view products

---

## Troubleshooting

**Error: "Firebase initialization failed"**
- Check .env.local has correct values with no extra spaces
- Restart dev server after updating .env.local

**Error: "Permission denied" in Firestore**
- Make sure you selected "test mode" when creating Firestore
- Wait a few minutes for permissions to propagate

**Can't receive/issue stock**
- Make sure Firestore database is initialized
- Click "Initialize Database" on dashboard first

**Images won't upload**
- Check Storage bucket exists and is in test mode
- File size must be less than 5MB
- Must be image format (.jpg, .png, etc)
