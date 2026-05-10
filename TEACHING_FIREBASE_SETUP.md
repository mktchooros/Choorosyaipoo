# 📚 Teaching: Firebase Setup Complete Guide

**บทเรียนละเอียด วิธีตั้ง Firebase ให้ระบบจริง**

---

## 🎓 หัวข้อ:

1. ✅ [Firebase คืออะไร](#-firebase-คืออะไร)
2. ✅ [เตรียมตัว](#-เตรียมตัว)
3. ✅ [สร้าง Google Cloud Project](#-สร้าง-google-cloud-project)
4. ✅ [สร้าง Firebase Project](#-สร้าง-firebase-project)
5. ✅ [สร้าง Realtime Database](#-สร้าง-realtime-database)
6. ✅ [ได้ Web Configuration](#-ได้-web-configuration)
7. ✅ [ได้ Admin Credentials](#-ได้-admin-credentials)
8. ✅ [ตั้ง .env.local](#-ตั้ง-envlocal)
9. ✅ [ทดสอบการเชื่อมต่อ](#-ทดสอบการเชื่อมต่อ)

---

## 📖 Firebase คืออะไร?

### อธิบายง่าย ๆ:
```
Firebase = Cloud Database Service ของ Google
- เก็บข้อมูล ☁️ (ในเมฆ)
- Accessible จากทุกที่
- Real-time sync (อัปเดตทันที)
- ฟรี 1 GB ไม่มีค่าใช้จ่าย
```

### เปรียบเทียบ:
```
Traditional Database:
คอมพิวเตอร์ ← → เซิร์ฟเวอร์ของคุณ → Database
                (ต้องเช่า)

Firebase:
คอมพิวเตอร์ ← → Google Cloud ☁️
              (ฟรี 1GB)
```

### ทำไมต้องใช้ Firebase?
✅ **ฟรี** - ไม่มีค่าเช่าเซิร์ฟเวอร์  
✅ **ง่าย** - Setup ได้ใน 10 นาที  
✅ **Real-time** - ข้อมูลอัปเดตทันที  
✅ **Secure** - Google ดูแลความปลอดภัย  
✅ **Scalable** - ใช้งานได้เยอะขึ้น  

---

## 🔧 เตรียมตัว

### ต้องมี:
- ✅ Google Account (mktchooros@gmail.com)
- ✅ Browser (Chrome, Firefox, Safari)
- ✅ Internet connection
- ✅ 30 นาที

### ไม่ต้องมี:
- ❌ Credit card (ฟรี!)
- ❌ Coding experience
- ❌ Server knowledge

---

## 1️⃣ สร้าง Google Cloud Project

### ขั้นที่ 1: เข้า Google Cloud Console

1. เปิด browser ไป: **https://console.cloud.google.com**

2. ถ้าไม่ได้ login:
   - Click "Sign In" (มุมขวาบน)
   - ใส่ email: **mktchooros@gmail.com**
   - ใส่ password
   - Click "Next"

3. เห็นหน้า Google Cloud Console แล้ว ✅

### ขั้นที่ 2: สร้าง Project

1. ดูมุมขวาบน เห็นปุ่ม **"Select a Project"** (หรือ dropdown)

2. Click เลย

3. Click **"NEW PROJECT"** (ปุ่มสีน้ำเงิน)

4. ในช่อง "Project name" ใส่:
   ```
   sorkroom-inventory
   ```

5. (Optional) ใน "Organization" ปล่อยไว้ว่าง

6. Click **"CREATE"**

7. รอ 1-2 นาที... (หน้าจะโหลด)

✅ **Project สร้างเสร็จ!**

### ขั้นที่ 3: เลือก Project ที่สร้าง

1. ดู notification (มุมขวาบน) เห็น "Creating project..." → ✅ "Project created"

2. Click "SELECT PROJECT" ในช่องข้อความ

3. หรือ click dropdown "Select a Project" เลือก "sorkroom-inventory"

✅ **ตอนนี้อยู่ใน Project แล้ว!**

---

## 2️⃣ สร้าง Firebase Project

### ขั้นที่ 1: ไปที่ Firebase Console

1. เปิด: **https://console.firebase.google.com**

2. ถ้าไม่ได้ login ให้ login ด้วย mktchooros@gmail.com

### ขั้นที่ 2: สร้าง Firebase Project

1. เห็นหน้า Firebase หรือรายการ Projects

2. Click **"Add project"** (หรือ "Create a project")

3. เลือก **"sorkroom-inventory"** (project ที่สร้างไปแล้ว)

4. Click "Continue"

5. **Firebase Blaze Plan?** → ❌ ปล่อยว่าง (ตอนนี้ฟรี) → "Continue"

6. **Enable Google Analytics?** → ❌ ปิด (ไม่ต้องตอนนี้) → "Continue"

7. รอ 2-3 นาที...

✅ **Firebase Project สร้างเสร็จ!**

---

## 3️⃣ สร้าง Realtime Database

### ขั้นที่ 1: เข้า Build Menu

1. ดู sidebar (ด้านซ้าย) หา **"Build"**

2. Click **"Realtime Database"**

### ขั้นที่ 2: สร้าง Database

1. Click **"Create Database"**

2. **Database name**: ปล่อยชื่อเดิมหรือเปลี่ยนเป็น `sorkroom-db`

3. **Location**: เลือก **"asia-southeast1"** (Thailand - เร็วที่สุด)
   - Scroll ลง find Asia Southeast 1

4. **Start mode**: เลือก **"Start in test mode"**
   - (จะแก้เป็น strict rules ทีหลัง)

5. Click **"Enable"**

6. รอ 30 วินาที...

✅ **Database สร้างเสร็จ!**

### ขั้นที่ 3: ได้ Database URL

1. หลังจาก Enable จะเห็นหน้า Database

2. ดู URL bar ด้านบน ดู address เช่น:
   ```
   https://sorkroom-xyz.firebaseio.com
   ```

3. **Copy URL นี้ไว้** (ต้องใช้ใน .env.local)

---

## 4️⃣ ได้ Web Configuration

### ขั้นที่ 1: ไปที่ Project Settings

1. ดู Firebase console → มุมขวาบน ⚙️ (gear icon)

2. Click **"Project Settings"**

### ขั้นที่ 2: สร้าง Web App

1. ดู tab **"General"**

2. Scroll ลง หาส่วน **"Your apps"**

3. Click **Web** icon (`</> `) เพื่อเพิ่ม web app

4. **App nickname**: ใส่ `sorkroom-web` (หรือชื่ออื่น)

5. ✅ Check "Also set up Firebase Hosting for this app" → ❌ ปล่อยว่าง

6. Click **"Register app"**

### ขั้นที่ 3: Copy Firebase Config

1. เห็นหน้า "Add Firebase SDK"

2. ดู code block:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "sorkroom-xyz.firebaseapp.com",
     projectId: "sorkroom-xyz",
     storageBucket: "sorkroom-xyz.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc..."
   };
   ```

3. **Copy ทั้ง block นี้** (Ctrl+C / Cmd+C)

4. **วาง ลง notepad หรือไฟล์ temp**

5. Click "Continue to console"

✅ **ได้ Web Config แล้ว!**

---

## 5️⃣ ได้ Admin Credentials

### ขั้นที่ 1: ไปที่ Service Accounts

1. Firebase Console → ⚙️ **"Project Settings"**

2. Tab **"Service Accounts"**

### ขั้นที่ 2: สร้าง Private Key

1. Click **"Generate New Private Key"**

2. Dialog ขึ้นมา ยืนยัน:
   ```
   "Generate a new private key for this service account?"
   ```

3. Click **"Generate Key"**

4. ไฟล์ `.json` ลงมา (เช่น `sorkroom-xyz-firebase-adminsdk.json`)

5. **Open file ด้วย Notepad**

6. **Copy ทั้ง content** (Ctrl+A → Ctrl+C)

7. **วาง ลง notepad temp**

⚠️ **สำคัญ: เก็บไว้เป็นความลับ! ไม่บอกใครนะครับ**

---

## 6️⃣ ตั้ง .env.local

### ขั้นที่ 1: สร้างไฟล์ .env.local

1. เปิด `C:\Users\prim\Desktop\สต๊อครวม ชูรสยายปู\` folder

2. สร้างไฟล์ใหม่ชื่อ **.env.local** (ใช้ Notepad)

### ขั้นที่ 2: วาง Web Config

จาก step 4 copy ไว้ คุณมี:
```
apiKey: "AIzaSy..."
authDomain: "sorkroom-xyz.firebaseapp.com"
projectId: "sorkroom-xyz"
storageBucket: "sorkroom-xyz.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abc..."
```

ใน .env.local ใส่:
```bash
# Web Config (Public - safe)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sorkroom-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sorkroom-xyz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://sorkroom-xyz.firebaseio.com
```

### ขั้นที่ 3: วาง Admin Credentials

จากไฟล์ `.json` ที่ลงมา (Service Account):

1. Open file ด้วย Notepad
2. Select All (Ctrl+A) → Copy (Ctrl+C)
3. ใน .env.local เพิ่มบรรทัด:

```bash
# Admin Credentials (Secret - backend only!)
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"sorkroom-xyz","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQI...","...":true}
FIREBASE_DATABASE_URL=https://sorkroom-xyz.firebaseio.com
```

### ขั้นที่ 4: ตรวจสอบ

ไฟล์ `.env.local` ควรมี 9 บรรทัด:
```
1. NEXT_PUBLIC_FIREBASE_API_KEY
2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
3. NEXT_PUBLIC_FIREBASE_PROJECT_ID
4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
6. NEXT_PUBLIC_FIREBASE_APP_ID
7. NEXT_PUBLIC_FIREBASE_DATABASE_URL
8. FIREBASE_ADMIN_SDK
9. FIREBASE_DATABASE_URL
```

✅ **บันทึกไฟล์ .env.local**

---

## 7️⃣ ทดสอบการเชื่อมต่อ

### ขั้นที่ 1: ติดตั้ง Dependencies

```bash
cd C:\Users\prim\Desktop\สต๊อครวม\ ชูรสยายปู
npm install
```

รอประมาณ 2-3 นาที

### ขั้นที่ 2: Initialize Database ด้วย Sample Data

```bash
node scripts/initialize-firebase.js
```

ถ้าสำเร็จ จะเห็น:
```
✅ Firebase initialized successfully!
✅ Added 10 products
✅ Added 5 customers
✅ Added 6 locations
✅ Initialized stock for 60 combinations
```

✅ **Data upload เสร็จแล้ว!**

### ขั้นที่ 3: ตรวจสอบใน Firebase Console

1. เปิด Firebase Console
2. ไปที่ **Realtime Database**
3. ดู data tree:
   ```
   / (root)
   ├── products
   │   ├── SKU001
   │   ├── SKU002
   │   └── ...
   ├── customers
   │   ├── CUST001
   │   └── ...
   ├── locations
   │   ├── LOC001
   │   └── ...
   ├── stock
   │   ├── LOC001
   │   │   ├── SKU001: 45
   │   │   └── ...
   │   └── ...
   └── movements (empty yet)
   ```

✅ **ข้อมูลขึ้น Firebase แล้ว!**

---

## 8️⃣ ทดสอบระบบจริง

### ขั้นที่ 1: รัน Dev Server

```bash
npm run dev
```

### ขั้นที่ 2: เปิด Browser

```
http://localhost:3000
```

### ขั้นที่ 3: ทดสอบ Receive

1. ไป "รับเข้า" page
2. เลือกสินค้า SKU001
3. ใส่จำนวน 10
4. เลือก Location LOC001
5. Click "บันทึก"

ถ้าสำเร็จ:
- ✅ เห็น success message
- ✅ ไปที่ Firebase Console ดู `movements/` มี record ใหม่
- ✅ ดู `stock/LOC001/SKU001` เพิ่มขึ้น 10 (45 → 55)

### ขั้นที่ 4: ทดสอบ Issue

1. ไป "เบิกสินค้า" page
2. เลือก SKU001
3. ใส่ 5 units
4. From: LOC001
5. Customer: CUST001
6. Click "บันทึก"

ถ้าสำเร็จ:
- ✅ เห็น success message
- ✅ `stock/LOC001/SKU001` ลดลง 5 (55 → 50)
- ✅ `movements/` มี ISS record ใหม่

✅ **ระบบทำงานจริงแล้ว!**

---

## 📋 ความเข้าใจ (Learnings)

### Firebase คืออะไร
- Database ฝากไว้ในเมฆ (Cloud)
- เชื่อมต่อผ่าน Internet
- Real-time sync (ปรับปรุงทันที)

### Web Config vs Admin Credentials
```
Web Config (NEXT_PUBLIC_*)
├─ ปลอดภัยแสดงใน Frontend
├─ ใช้เพื่อ read/write data
└─ พอสำหรับ test mode

Admin Credentials (FIREBASE_ADMIN_SDK)
├─ ลับ ใช้เฉพาะ Backend
├─ มีสิทธิ์สูง (all operations)
└─ ต้องใช้สำหรับ transaction
```

### Security Rules
- Test mode: ใครสามารถ read/write ได้
- Production: ต้อง authenticate
- ปรับได้ตามความต้องการ

---

## 🎯 สรุป

✅ สร้าง Google Cloud Project  
✅ สร้าง Firebase Project  
✅ สร้าง Realtime Database  
✅ ได้ Web Configuration  
✅ ได้ Admin Credentials  
✅ ตั้ง .env.local  
✅ ทดสอบเชื่อมต่อ  
✅ **ระบบ Live!**

---

## 🚀 ต่อไป

เมื่อเสร็จแล้ว:

1. **Local Testing** ✅ สำเร็จ
2. **Deploy ไป Vercel** → อ่าน [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
3. **Go Live** → ระบบแฟบบบใช้งานจริงได้!

---

**🎉 ยินดีด้วย! คุณสร้าง Firebase database ได้สำเร็จแล้ว!**
