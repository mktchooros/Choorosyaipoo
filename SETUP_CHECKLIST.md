# ✅ Complete Setup Checklist - สต๊อกรวม ชูรสยายปู

**ระบบการตรวจสอบครบถ้วนสำหรับเปิดใช้งานจริง**

---

## 📋 Phase 1: Preparation (Before you start)

- [ ] **Google Account** - มีบัญชี Google สำหรับ Firebase
- [ ] **GitHub Account** - มีบัญชี GitHub สำหรับ version control
- [ ] **Node.js** - ติดตั้ง Node.js 18+ จาก https://nodejs.org
- [ ] **Text Editor** - VS Code หรือ editor อื่น (แนะนำ VS Code)
- [ ] **Project Folder** - มีโฟลเดอร์ project พร้อม
- [ ] **Internet Connection** - เชื่อมต่อ internet เสถียร

---

## 🔥 Phase 2: Firebase Setup (20 minutes)

### 2.1 สร้าง Firebase Project
- [ ] เข้า https://console.firebase.google.com
- [ ] Click "Create a project"
- [ ] ชื่อ project: `sorkroom-inventory`
- [ ] ยืนยัน terms
- [ ] ❌ Disable Google Analytics
- [ ] Click "Create" และรอ 2-3 นาที

### 2.2 สร้าง Realtime Database
- [ ] ที่ sidebar ไป **Build → Realtime Database**
- [ ] Click "Create Database"
- [ ] **Location:** `asia-southeast1` (Thailand)
- [ ] **Mode:** Start in test mode
- [ ] Click "Enable" และรอ 1 นาที
- [ ] ✅ ดู Database URL (จะใช้ทีหลัง)

### 2.3 สร้าง Web App Configuration
- [ ] **Project Settings** (⚙️) → **General** tab
- [ ] Scroll ลง **"Your apps"** section
- [ ] Click **Web** icon (`</>`)
- [ ] App name: `sorkroom-web`
- [ ] ✅ Copy Firebase config (ทั้งหมด)

### 2.4 สร้าง Service Account
- [ ] **Project Settings** → **Service Accounts** tab
- [ ] Click "Generate New Private Key"
- [ ] ✅ ยืนยัน
- [ ] ✅ Copy JSON file
- [ ] ⚠️ เก็บไว้เป็นความลับ (ไม่แชร์ใคร)

### 2.5 อัปเดต Environment Variables
ที่โฟลเดอร์ project สร้างไฟล์ `.env.local`:

```bash
# Web Config (จาก 2.3)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sorkroom-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sorkroom-xyz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://sorkroom-xyz.firebaseio.com

# Service Account (จาก 2.4 - วาง as single line)
FIREBASE_ADMIN_SDK={"type":"service_account",...}
FIREBASE_DATABASE_URL=https://sorkroom-xyz.firebaseio.com
```

- [ ] ✅ ทั้งหมด 9 lines
- [ ] ✅ ไม่มีช่องว่าง
- [ ] ✅ บันทึกไฟล์

---

## 💻 Phase 3: Local Development Setup (10 minutes)

### 3.1 ติดตั้ง Dependencies
```bash
cd C:\Users\prim\Desktop\สต๊อครวม\ ชูรสยายปู
npm install
```
- [ ] ✅ รอให้ติดตั้งเสร็จ (อาจใช้เวลา 2-3 นาที)

### 3.2 Initialize Firebase Database
```bash
node scripts/initialize-firebase.js
```
- [ ] ✅ เห็นข้อความ "✅ Firebase initialized successfully"
- [ ] ✅ Added 10 products
- [ ] ✅ Added 5 customers
- [ ] ✅ Added 6 locations
- [ ] ✅ Initialized stock for 60 combinations

### 3.3 ทดสอบ Local Development
```bash
npm run dev
```
- [ ] ✅ เห็น "▲ Next.js 15.0.0"
- [ ] ✅ Server running on `http://localhost:3000`
- [ ] ✅ เปิด browser ไป http://localhost:3000
- [ ] ✅ เห็นหน้า Dashboard กับ logo ชูรสยายปู

### 3.4 ทดสอบฟีเจอร์พื้นฐาน
- [ ] ✅ Dashboard แสดงยอดขาย/สต๊อก
- [ ] ✅ Sidebar navigation แสดง menu ทั้งหมด
- [ ] ✅ สามารถเลือก page อื่น ๆ ได้
- [ ] ✅ Theme toggle (⚙️) ทำงาน
- [ ] ✅ Barcode scan ประชด

---

## 🌐 Phase 4: GitHub Setup (10 minutes)

### 4.1 สร้าง GitHub Repository
- [ ] เข้า https://github.com/new
- [ ] **Repository name:** `sorkroom-inventory`
- [ ] **Description:** Inventory Management System สต๊อกรวม ชูรสยายปู
- [ ] ❌ ไม่ต้อง initialize README
- [ ] Click "Create repository"

### 4.2 Push Code ขึ้น GitHub
```bash
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
git remote add origin https://github.com/YOUR_USERNAME/sorkroom-inventory.git
git branch -M main
git add .
git commit -m "Initial commit: Firebase setup + inventory system"
git push -u origin main
```

- [ ] ✅ Code push สำเร็จ
- [ ] ✅ เห็นไฟล์ทั้งหมดใน GitHub

### 4.3 ตรวจสอบ .env.local ไม่ได้ push
```bash
git log -p | grep "FIREBASE_ADMIN_SDK" | wc -l
```
- [ ] ✅ Output เป็น 0 (ไม่เห็น secret)
- [ ] ✅ `.env.local` ใน `.gitignore`

---

## ☁️ Phase 5: Vercel Deployment (15 minutes)

### 5.1 Connect GitHub to Vercel
- [ ] เข้า https://vercel.com
- [ ] Click "Sign Up" → เลือก "Continue with GitHub"
- [ ] ✅ Authorize Vercel
- [ ] ✅ Email verification

### 5.2 Create Vercel Project
- [ ] Click "New Project"
- [ ] Select repo **sorkroom-inventory**
- [ ] Click "Import"

### 5.3 Add Environment Variables
- [ ] Click "Environment Variables"
- [ ] เพิ่ม **9 variables** จาก `.env.local`:
  - [ ] NEXT_PUBLIC_FIREBASE_API_KEY
  - [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - [ ] NEXT_PUBLIC_FIREBASE_APP_ID
  - [ ] NEXT_PUBLIC_FIREBASE_DATABASE_URL
  - [ ] FIREBASE_ADMIN_SDK
  - [ ] FIREBASE_DATABASE_URL

### 5.4 Deploy
- [ ] Click "Deploy"
- [ ] รอ 2-5 นาที
- [ ] ✅ เห็น "Congratulations! Your project has been deployed"
- [ ] ✅ Copy production URL (เช่น `https://sorkroom-xyz.vercel.app`)

### 5.5 ทดสอบ Production
- [ ] เปิด production URL
- [ ] ✅ เห็น Dashboard
- [ ] ✅ Test: รับเข้า/เบิก/ดูสต๊อก
- [ ] ✅ ดูข้อมูลใน Firebase console

---

## 🔐 Phase 6: Security Hardening (10 minutes)

### 6.1 Firebase Security Rules
ที่ Firebase Console → Realtime Database → Rules:
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
- [ ] ✅ Copy & paste rules
- [ ] ✅ Click "Publish"

### 6.2 Vercel Protection
- [ ] ✅ Vercel dashboard → Settings → Security
- [ ] ✅ Enable "Firewall" (optional)

### 6.3 Backup Credentials
- [ ] ✅ เก็บ Firebase config ไว้ปลอดภัย
- [ ] ✅ เก็บ Service Account JSON ไว้ปลอดภัย
- [ ] ✅ ไม่ commit `.env.local` ขึ้น GitHub

---

## 📊 Phase 7: Data Verification (5 minutes)

### 7.1 ตรวจสอบข้อมูลใน Firebase Console
- [ ] ไปที่ Firebase Console → Realtime Database
- [ ] ✅ มี folder: `products`, `customers`, `locations`, `stock`
- [ ] ✅ `products` มี 10 items
- [ ] ✅ `customers` มี 5 items
- [ ] ✅ `locations` มี 6 items
- [ ] ✅ `stock` มี data สำหรับทุก location × product

### 7.2 ทดสอบ Receive Flow
- [ ] ที่ production: เปิด "รับเข้า" page
- [ ] ทำการรับเข้า: 10 units ของ SKU001 ที่ LOC001
- [ ] ✅ เห็น success message
- [ ] ✅ Check Firebase: `stock/LOC001/SKU001` เพิ่มขึ้น 10

### 7.3 ทดสอบ Issue Flow
- [ ] เปิด "เบิกสินค้า" page
- [ ] ทำการเบิก: 5 units ของ SKU001 จาก LOC001
- [ ] ✅ เห็น success message
- [ ] ✅ Check Firebase: `stock/LOC001/SKU001` ลดลง 5
- [ ] ✅ `movements` มี record ใหม่

---

## 📱 Phase 8: Testing All Features (20 minutes)

### 8.1 Dashboard Page
- [ ] ✅ ข้อมูลยอดขาย/สต๊อก/ลูกค้าแสดงถูกต้อง
- [ ] ✅ KPI counters animate ได้
- [ ] ✅ Charts แสดง data

### 8.2 Receive Page
- [ ] ✅ เลือกสินค้า/location ได้
- [ ] ✅ เพิ่ม/ลบ items ได้
- [ ] ✅ Submit รับเข้า สำเร็จ
- [ ] ✅ Data update ใน Firebase

### 8.3 Issue Page
- [ ] ✅ Stock validation ทำงาน (ไม่ให้เบิกมากกว่าสต๊อก)
- [ ] ✅ เลือก customer/location ได้
- [ ] ✅ Submit เบิก สำเร็จ

### 8.4 Stock Page
- [ ] ✅ แสดงสต๊อกทั้งระบบ
- [ ] ✅ สามารถ filter ตามหมวด ได้
- [ ] ✅ Mini-bar แสดง distribution

### 8.5 Reports
- [ ] ✅ รายงานขาย-วัน แสดง data
- [ ] ✅ รายงานคงเหลือ แสดง matrix
- [ ] ✅ รายงานเคลื่อนไหว แสดง movement log

### 8.6 Barcode Scan (Optional)
- [ ] ✅ ปุ่ม scan ทำงาน
- [ ] ✅ สามารถเลือกโหมด camera/input
- [ ] ✅ Demo scan แสดง product

### 8.7 Theme & Settings
- [ ] ✅ ⚙️ tweaks panel เปิด/ปิด
- [ ] ✅ Dark/Light mode toggle ทำงาน
- [ ] ✅ Accent color picker เปลี่ยนสี
- [ ] ✅ Density control เปลี่ยน spacing

---

## 🚀 Phase 9: Production Optimization (15 minutes)

### 9.1 Performance
- [ ] ✅ `npm run build` สำเร็จ
- [ ] ✅ No TypeScript errors
- [ ] ✅ No console warnings
- [ ] ✅ Vercel build time < 2 minutes

### 9.2 SEO & Metadata
- [ ] ✅ Page title: "สต๊อกรวม ชูรสยายปู"
- [ ] ✅ Favicon ปรากฏ
- [ ] ✅ Meta description เหมาะสม

### 9.3 Monitoring
- [ ] ✅ Vercel Analytics enabled
- [ ] ✅ Firebase Console ดูได้
- [ ] ✅ Error logs setup (optional)

---

## 📝 Phase 10: Documentation & Handoff

### 10.1 Document Everything
- [ ] ✅ บันทึก Firebase Project ID
- [ ] ✅ บันทึก Vercel project URL
- [ ] ✅ บันทึก GitHub repo URL
- [ ] ✅ บันทึก Admin contact

### 10.2 Create User Guide (Optional)
- [ ] ✅ How to use dashboard
- [ ] ✅ How to receive stock
- [ ] ✅ How to issue stock
- [ ] ✅ How to view reports

### 10.3 Backup & Recovery Plan
- [ ] ✅ Firebase backup setup
- [ ] ✅ GitHub backup (automatic)
- [ ] ✅ Recovery procedure documented

---

## 🎉 Final Verification Checklist

### ✅ All Systems Go?

- [ ] ✅ Firebase Project created and working
- [ ] ✅ Realtime Database initialized with data
- [ ] ✅ Security Rules set
- [ ] ✅ `.env.local` configured (local only)
- [ ] ✅ Local development working (`npm run dev`)
- [ ] ✅ GitHub repo pushed
- [ ] ✅ Vercel deployment successful
- [ ] ✅ Production URL accessible
- [ ] ✅ All features tested
- [ ] ✅ Data persists in Firebase
- [ ] ✅ Real-time updates working
- [ ] ✅ No sensitive data exposed
- [ ] ✅ Documentation complete

---

## 🎊 🎉 READY FOR PRODUCTION! 🎉 🎊

**System Status: ✅ LIVE**

**URLs:**
- 🌐 Production: `https://sorkroom-xyz.vercel.app`
- 🔥 Firebase: `https://sorkroom-xyz.firebaseio.com`
- 💻 GitHub: `https://github.com/YOUR_USERNAME/sorkroom-inventory`

**Next Steps:**
1. Share URLs with team
2. Train users on system
3. Monitor usage in first week
4. Plan feature additions

---

**Created:** May 2026  
**Status:** Production Ready  
**Last Updated:** [Date]

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| **Firebase Project ID** | `sorkroom-xyz` |
| **Vercel URL** | `https://sorkroom-xyz.vercel.app` |
| **GitHub Repo** | `YOUR_USERNAME/sorkroom-inventory` |
| **Admin Email** | `your.email@gmail.com` |
| **Support Contact** | _______________ |

---

**Congratulations on completing the setup! 🎉**
