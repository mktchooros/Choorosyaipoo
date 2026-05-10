# 🔥 Firebase Realtime Database Setup — Complete Guide

**ทำตามขั้นตอน 1-10 ใต้นี้เพื่อ setup Firebase จริง**

---

## ✅ Step 1: เตรียมของ

### สิ่งที่คุณต้อง:
- ✅ Google Account (มีอยู่แล้ว: mktchooros@gmail.com)
- ✅ Browser (Chrome/Firefox/Safari)
- ✅ Project ID: `project-71f95cfd-e0d0-49d3-9b1`

---

## 🚀 Step 2: เปิด Firebase Console

1. **ไป:** https://console.firebase.google.com
2. **เลือก Project:** `project-71f95cfd-e0d0-49d3-9b1`
3. **คลิก Realtime Database** (ซ้ายมือ → Build → Realtime Database)

---

## 💾 Step 3: สร้าง Realtime Database

### ขั้น A: Click "Create Database"
- ปุ่มสีฟ้า "Create Database" ตรงกลาง

### ขั้น B: เลือกตำแหน่ง
```
Regional Location: asia-southeast1 (Singapore)
เหตุผล: ใกล้ประเทศไทย ⚡ ดีที่สุด
```

### ขั้น C: เลือก Mode
```
Security Rules: Start in test mode (for development)
⚠️ หลังจากลองแล้ว ให้เปลี่ยนเป็น production rules
```

### ขั้น D: Enable
- Click "Enable" 
- ⏳ รอ 1-2 นาที database สร้างเสร็จ

✅ **ตอนนี้ Database URL:** `https://project-xxxxx-default.firebaseio.com/` (จำไว้ แล้วจะได้ใช้)

---

## 🔑 Step 4: ได้รับ Firebase Web Config

### ขั้น A: ไป Project Settings
1. **คลิก⚙️ icon** (มุมบนซ้าย)
2. **เลือก "Project settings"**

### ขั้น B: ไปที่ "General" tab
- ต้อง scroll ลงมา ดูในส่วน "Your apps"
- หากยังไม่มี web app: คลิก **"Add app"** → เลือก **"</>"** (Web)
- ใส่ชื่อ: `sorkroom` → คลิก "Register app"

### ขั้น C: Copy Web Config
```javascript
// ต้อง copy อันนี้ (firebaseConfig object):

const firebaseConfig = {
  apiKey: "AIzaSy...", // ← long string
  authDomain: "project-xxxxx.firebaseapp.com",
  projectId: "project-71f95cfd-e0d0-49d3-9b1",
  storageBucket: "project-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  databaseURL: "https://project-xxxxx-default.firebaseio.com"
};
```

**ก็อปทั้ง object นี้ให้ครบ!**

---

## 👤 Step 5: สร้าง Service Account

### ขั้น A: ไป Service Accounts tab
1. ยังอยู่หน้า "Project settings"
2. **คลิก "Service Accounts"** tab
3. ต้อง click "Go to Firebase Admin SDK" ด้านล่าง

### ขั้น B: สร้าง Key
1. **เลือก Service Account:** `firebase-admin@project-xxxxx.iam.gserviceaccount.com`
2. **ไป "Keys" tab**
3. **Click "Add key" → "Create new key"**
4. **เลือก "JSON"** → **"Create"**
5. ✅ ไฟล์ JSON ลงมาอัตโนมัติ (ชื่อ `project-xxxxx-firebase-adminsdk-xxxxx.json`)

**⚠️ Important:** เก็บไฟล์นี้ไว้อย่างปลอดภัย! ห้ามแชร์ให้ใครอื่น

---

## 📄 Step 6: ที่บ้านของคุณ - สร้าง `.env.local`

### ไฟล์ตำแหน่ง:
```
C:\Users\prim\Desktop\สต๊อครวม ชูรสยายปู\.env.local
```

### ก็อปทั้งหมดนี้ลงไป:
```bash
# Firebase Web Config (จาก Step 4)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your-api-key...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-71f95cfd-e0d0-49d3-9b1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://project-xxxxx-default.firebaseio.com

# Firebase Admin SDK (จาก Step 5 - ไฟล์ JSON)
# ก็อป JSON content ตรงนี้ (entire file):
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"project-71f95cfd-e0d0-49d3-9b1",...}
```

---

## 🧪 Step 7: ทดสอบการเชื่อมต่อ

### ขั้น A: ย้อนไปหน้าแรก
```bash
cd C:\Users\prim\Desktop\สต๊อครวม\ ชูรสยายปู
```

### ขั้น B: รัน Dev Server
```bash
npm run dev
```

### ขั้น C: เปิด Browser
```
http://localhost:3000
```

### ขั้น D: ทดสอบ Feature
1. **ไป "รับเข้า" page**
2. **เพิ่มสินค้า 20 units SKU001 → LOC001**
3. **Click "บันทึก"**
4. **ต้อง success ✅**
5. **Refresh browser — ข้อมูลต้องยังอยู่ (persist)** 

✅ ถ้าเห็นข้อมูลอยู่ = Firebase ทำงานแล้ว!

---

## 📊 Step 8: Initialize Data (Optional)

หากต้องการเริ่มต้นด้วยข้อมูลตัวอย่างจากไฟล์:

```bash
node scripts/initialize-firebase.js
```

สคริปต์นี้จะ:
- ✅ สร้าง 40+ สินค้า
- ✅ สร้าง 60+ ลูกค้า
- ✅ สร้าง 6 locations
- ✅ เริ่มต้นสต๊อก

---

## 🔒 Step 9: Set Security Rules (Important!)

**⚠️ Test Mode ปลอดภัยสำหรับ development แต่ไม่สำหรับ production**

### เมื่อพร้อม Production:

1. ไป **Realtime Database**
2. **Click "Rules" tab**
3. **ก็อปและ paste:**

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "products": {
      ".read": true,
      ".write": false
    },
    "locations": {
      ".read": true,
      ".write": false
    },
    "stock": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "movements": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "customers": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

4. **Click "Publish"**

---

## ✅ Step 10: ตรวจสอบสุดท้าย

### Checklist:
- [ ] `.env.local` สร้างแล้ว
- [ ] Firebase Config เต็ม (API Key, Project ID, etc.)
- [ ] Service Account Key เต็ม
- [ ] Database สร้างแล้ว (asia-southeast1)
- [ ] `npm run dev` ทำงาน
- [ ] ทดสอบ feature ได้ success
- [ ] ข้อมูล persist หลัง refresh

---

## 🚀 ทั้งหมด Complete!

**ระบบ ready สำหรับ:**
- ✅ Development (mock or real Firebase)
- ✅ Testing (มีข้อมูลตัวอย่าง)
- ✅ Deployment (ไป Vercel)

---

## 🆘 Troubleshooting

### ❌ "apiKey is not valid"
- Check `.env.local` มีค่า apiKey ถูกต้อง
- ต้อง `NEXT_PUBLIC_` prefix

### ❌ "Permission denied" writing to /stock
- Check security rules ให้ auth != null
- หรือ ยังในส่วน test mode ดีกว่า

### ❌ "Database not found"
- Check databaseURL ตรง (ลงท้าย `.firebaseio.com`)
- Project ID ต้องตรง

### ❌ Data ไม่ persist
- Check localStorage ตรง (F12 → Application → localStorage)
- หรือ ยังใช้ mock database อยู่

---

## 💡 ถัดไป?

1. **Deploy ไป Vercel** (VERCEL_DEPLOY.md)
2. **Set up CI/CD** (GitHub Actions)
3. **Monitor with Firebase Console** (Analytics, Logs)

---

**Good luck! 🎉**
