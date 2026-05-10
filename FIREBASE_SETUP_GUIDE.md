# 🔥 Firebase Setup Guide - สต๊อกรวม ชูรสยายปู

วิธีตั้งค่า Firebase สำหรับระบบจริง พร้อม Deploy ไป Vercel

---

## 📋 ขั้นตอนการตั้งค่า

### ขั้นที่ 1: สร้าง Firebase Project

1. ไปที่ **https://console.firebase.google.com**
2. Click **"Create a project"** (หรือ "Add project" ถ้ามี project อื่น)
3. **Project name:** `sorkroom-inventory` (หรือชื่ออื่นที่ชอบ)
4. ✅ Accept terms and continue
5. ❌ Disable Google Analytics (ไม่จำเป็น)
6. Click **"Create"** และรอประมาณ 2-3 นาที

---

### ขั้นที่ 2: สร้าง Realtime Database

หลังจาก Project สร้างเสร็จ:

1. ไปที่ **Build** (เมนูด้านซ้าย)
2. Click **"Realtime Database"**
3. Click **"Create Database"**
4. **Location:** เลือก `asia-southeast1` (Thailand ใกล้ที่สุด)
5. **Security Rules:** เลือก **"Start in test mode"** (จะแก้ไขทีหลัง)
6. Click **"Enable"**
7. รอประมาณ 1 นาที

✅ ตอนนี้คุณมี Database URL แล้ว (ดูตรง URL bar)

---

### ขั้นที่ 3: สร้าง Web App Configuration

1. ไปที่ **Project Settings** (⚙️ มุมขวาบน)
2. Tab **"General"**
3. Scroll ลง หาส่วน **"Your apps"**
4. Click **Web** icon (`</> `) เพื่อเพิ่ม web app
5. **App nickname:** `sorkroom-web` (หรือชื่ออื่น)
6. ✅ ถัดไป
7. **Copy Firebase config** (วาง `.env.local` หลังจาก)
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     ...
   }
   ```

---

### ขั้นที่ 4: สร้าง Service Account (Backend Admin)

1. ไปที่ **Project Settings** (⚙️)
2. Tab **"Service Accounts"**
3. Click **"Generate New Private Key"**
4. ✅ ยืนยัน
5. ไฟล์ `.json` ลงมาให้
6. **Open file.json** → Copy ทั้งหมด

---

### ขั้นที่ 5: อัปเดต `.env.local`

ใน project root สร้างไฟล์ `.env.local` แล้ววาง:

```bash
# จากขั้นที่ 3 (Web Config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sorkroom-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sorkroom-xyz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://sorkroom-xyz.firebaseio.com

# จากขั้นที่ 4 (Service Account JSON - วาง as single line)
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"sorkroom-xyz","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQI...","...":true}
FIREBASE_DATABASE_URL=https://sorkroom-xyz.firebaseio.com
```

**⚠️ สำคัญ:** เก็บ `.env.local` ไว้เป็นความลับ (ไม่ push ขึ้น GitHub)

---

### ขั้นที่ 6: Initialize Database ด้วย Sample Data

ต้องมี Node.js ติดตั้ง:

```bash
# Install dependencies
npm install

# Initialize Firebase with sample products, customers, stock
node scripts/initialize-firebase.js
```

ถ้าสำเร็จ จะเห็น:
```
✅ Added 10 products
✅ Added 5 customers
✅ Added 6 locations
✅ Initialized stock for 60 combinations
```

---

### ขั้นที่ 7: ตั้งค่า Security Rules (Optional)

ในการ production ควรตั้ง rules เพื่อ restrict การเข้าถึง:

1. ไปที่ **Realtime Database → Rules** tab
2. แทนที่ด้วย:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "public": {
      ".read": true
    }
  }
}
```

3. Click **"Publish"**

---

## 🚀 Deploy ไป Vercel

### ขั้นที่ 1: Push ขึ้น GitHub

```bash
# Initialize git (ถ้ายัง)
git init
git add .
git commit -m "Initial commit with Firebase setup"

# Create repo บน GitHub และ push
git remote add origin https://github.com/YOUR_USERNAME/sorkroom-inventory.git
git branch -M main
git push -u origin main
```

### ขั้นที่ 2: Deploy บน Vercel

1. ไปที่ **https://vercel.com**
2. Click **"New Project"**
3. Import จาก GitHub
4. Select repo **sorkroom-inventory**
5. **Framework:** Next.js (detect automatically)
6. Environment Variables:
   - Copy ทั้งหมดจาก `.env.local`
   - วาง ใน **Environment Variables** section
7. Click **"Deploy"**
8. รอประมาณ 2-3 นาที

✅ ตอนนี้มี production URL แล้ว!

---

## 🧪 Test

### Local Testing
```bash
npm run dev
# เข้า http://localhost:3000
```

### Production Testing
```bash
npm run build
npm run start
```

---

## 📊 Database Structure

Firebase Realtime Database ของคุณจะมี structure นี้:

```
/
├── products/
│   ├── SKU001: { name, category, cost, price, ... }
│   ├── SKU002: { ... }
│   └── ...
├── customers/
│   ├── CUST001: { name, type, location, ytd, ... }
│   └── ...
├── locations/
│   ├── LOC001: { name, type, ... }
│   └── ...
├── stock/
│   ├── LOC001/
│   │   ├── SKU001: 45
│   │   ├── SKU002: 32
│   │   └── ...
│   ├── LOC002/
│   └── ...
└── movements/
    ├── RCV-1234567890: { type, items, location, timestamp, ... }
    ├── ISS-1234567891: { ... }
    └── ...
```

---

## 🔧 Troubleshooting

### ❌ "FIREBASE_ADMIN_SDK environment variable not set"
**ปัญหา:** ไม่มี Admin SDK credentials
**แก้:** เก็บไฟล์ service account JSON ลง `.env.local` เป็น `FIREBASE_ADMIN_SDK`

### ❌ "Permission denied" เมื่อ write data
**ปัญหา:** Security Rules ไม่อนุญาต
**แก้:** ในขณะ dev ใช้ "test mode" หรือแก้ rules เป็น `".write": true`

### ❌ "NEXT_PUBLIC_FIREBASE_DATABASE_URL is not set"
**ปัญหา:** ลืมเพิ่ม database URL ใน `.env.local`
**แก้:** ดู Firebase console → Realtime Database → URL bar

---

## 📝 Next Steps

1. ✅ Setup Firebase Project
2. ✅ Get credentials
3. ✅ Initialize data
4. ✅ Deploy ไป Vercel
5. 🔄 Update frontend components ให้ใช้ Firebase API
6. 🔄 เพิ่มฟีเจอร์เพิ่มเติม (Auth, Upload รูป, ฯลฯ)

---

## 📞 Support

ถ้ามีปัญหา:
- Check Firebase console logs
- ดู browser console (F12)
- ดู Vercel deployment logs

---

**Status:** ✅ Ready for production!
