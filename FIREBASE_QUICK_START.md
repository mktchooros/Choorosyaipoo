# Firebase Setup - 5 นาที

## ขั้นที่ 1: เปิด Firebase Console (1 นาที)

1. เปิด browser ใหม่
2. ไปที่: **https://console.firebase.google.com**
3. ล็อกอิน Google Account ของคุณ

---

## ขั้นที่ 2: สร้าง Project (2 นาที)

1. คลิก **"Create Project"** (ปุ่มสีน้ำเงิน)
2. ชื่อ project: `sorkroom-inventory`
3. คลิก **"Continue"**
4. **ไม่ต้อง** enable Google Analytics (uncheck)
5. คลิก **"Create project"**
6. **รอ 1-2 นาที** ให้ initialize เสร็จ

---

## ขั้นที่ 3: สร้าง Web App (1 นาที)

หลังจาก project สร้างเสร็จ:

1. หน้า Overview ของ project
2. คลิก **gear icon ⚙️** → **Project Settings**
3. Scroll ลงไป ถึง **"Your apps"** section
4. คลิก **`</>`** (Web icon)
5. App name: `sorkroom-web`
6. **ติ๊ก** "Also set up Firebase Hosting" (ถ้ามี)
7. คลิก **"Register app"**

---

## ขั้นที่ 4: Copy Credentials (1 นาที)

บนหน้า config หลังจากติดตั้ง:

จะเห็นตัวเลขแบบนี้:
```javascript
apiKey: "AIzaSy________________"
authDomain: "sorkroom-inventory-xxxxx.firebaseapp.com"
projectId: "sorkroom-inventory-xxxxx"
storageBucket: "sorkroom-inventory-xxxxx.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abcdef1234567890"
```

**Copy ทั้งหมด** ไว้ที่ไหนสักแห่ง

---

## ขั้นที่ 5: Enable Firestore (30 วินาที)

1. ใน Firebase Console ด้านซ้าย
2. ไปที่ **Build** → **Firestore Database**
3. คลิก **"Create Database"**
4. Mode: **"Start in test mode"** (important!)
5. Location: **"asia-southeast1"** (Thailand)
6. คลิก **"Enable"**

---

## ขั้นที่ 6: Enable Authentication (30 วินาที)

1. ไปที่ **Build** → **Authentication**
2. คลิก **"Get started"**
3. หา **"Email/Password"** provider
4. คลิกเลือก → toggle **"Enable"**
5. คลิก **"Save"**

---

## ขั้นที่ 7: Enable Storage (30 วินาที)

1. ไปที่ **Build** → **Storage**
2. คลิก **"Get started"**
3. Mode: **"Start in test mode"**
4. Location: **"asia-southeast1"**
5. คลิก **"Done"**

---

## ขั้นที่ 8: Update .env.local

แก้ไขไฟล์: `C:\Users\prim\Desktop\สต๊อครวม ชูรสยายปู\.env.local`

ใส่ค่า copy มาจากขั้นที่ 4:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy________________
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sorkroom-inventory-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-inventory-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sorkroom-inventory-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Save ไฟล์**

---

## ขั้นที่ 9: Restart Server

ในเทอร์มินัล (หรอบอกฉัน):

```bash
# ฉันจะทำให้
```

---

## ✅ เสร็จแล้ว!

ทดสอบ: **http://localhost:3008**

- ลงทะเบียน: test@example.com / password123
- คลิก "Initialize Database"
- ใช้ได้เต็มที่ ✨
