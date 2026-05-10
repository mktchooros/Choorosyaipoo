# 🚀 Getting Started — ทำตามนี้เลย!

**3 ทางเลือกตามความพร้อม:**

---

## 🟢 ตัวเลือก A: ทดลองเลย (5 นาที)

**ต้องการ:** ทดลองระบบโดยไม่ต้องรอ Firebase

### Step 1: ลง dependencies
```bash
npm install
```

### Step 2: รัน dev server
```bash
npm run dev
```

### Step 3: เปิด browser
```
http://localhost:3000
```

### Step 4: ทดลอง features
- ✅ ดู Dashboard
- ✅ รับเข้าสินค้า
- ✅ เบิกสินค้า / Transfer
- ✅ เพิ่มลูกค่า
- ✅ ดู Reports

### ❌ ข้อจำกัด:
- ข้อมูลหาย refresh browser (อัพเดทแล้ว localStorage persist!)
- ไม่มี real-time sync (single device)

### ✅ ข้อดี:
- ทันที ไม่ต้องรอ
- ทุกฟีเจอร์ใช้ได้
- เหมาะ test/demo

---

## 🟡 ตัวเลือก B: Setup Firebase (30-45 นาที)

**ต้องการ:** ข้อมูล persist + สามารถใช้จากหลาย devices

### Step 1: Follow Firebase guide
📖 [FIREBASE_SETUP_COMPLETE.md](./FIREBASE_SETUP_COMPLETE.md)

### Step 2: Create `.env.local`
```bash
# Copy ค่า Firebase Config + Admin Key
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_SERVICE_ACCOUNT_KEY=...
# (ดู guide ที่ step 6)
```

### Step 3: Test
```bash
npm run dev
# Test receive/issue/customers
# Refresh → ข้อมูลต้องยังอยู่ ✅
```

### ✅ ข้อดี:
- ข้อมูล persist forever (cloud)
- Real-time sync (หลาย users พร้อมกัน)
- Production-ready

### ⚠️ ขั้นตอน:
- ต้องไป Firebase Console (10-15 นาที)
- Copy API keys (5 นาที)
- Update `.env.local` (5 นาที)

---

## 🔴 ตัวเลือก C: Deploy ไป Vercel Live (1-2 ชม)

**ต้องการ:** ระบบขึ้นเน็ต ใช้จากไหนก็ได้

### Prerequisite:
- Firebase setup ✅ (Option B)
- GitHub account ✅

### Step 1: Push ไป GitHub
📖 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Step 1

### Step 2: Deploy ไป Vercel
📖 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Step 2-4

### Step 3: ทดสอบ
```
https://sorkroom-xxxxx.vercel.app
```

### ✅ ข้อดี:
- Live บนอินเทอร์เน็ต 🌐
- Auto-deploy (git push อัตโนมัติ)
- 99.99% uptime
- ใช้จากที่ไหนก็ได้

---

## 🗺️ Roadmap (ขั้นตอนแนะนำ)

### วันแรก (Now)
```
┌─────────────────────────────┐
│ Start with Option A (Mock)  │  ← 5 min
│ Test all features           │  ← 10 min
│ Understand system           │  ← 10 min
└──────────────┬──────────────┘
               ↓
     (Happy with system? YES)
               ↓
        [Proceed to B]
```

### วันที่ 2-3
```
┌────────────────────────────┐
│ Follow Option B (Firebase) │  ← 45 min
│ Setup Realtime Database    │  ← 15 min
│ Initialize data            │  ← 5 min
│ Test persistence           │  ← 5 min
└──────────────┬─────────────┘
               ↓
        (Ready for live? YES)
               ↓
        [Proceed to C]
```

### วันที่ 4+
```
┌────────────────────────────┐
│ Follow Option C (Vercel)   │  ← 30 min
│ Push GitHub                │  ← 10 min
│ Deploy Vercel              │  ← 15 min
│ Share URL with team        │  ← 5 min
└────────────────────────────┘
               ↓
    🎉 LIVE ON INTERNET 🎉
```

---

## 📋 What's Included

### ✅ Features
- Dashboard (ยอดขาย/สต๊อก/ลูกค่า)
- Receive Stock (บันทึกรับเข้า)
- Issue Stock (เบิกให้ลูกค่า)
- Transfer (โอนระหว่าง locations)
- Customer Management (เพิ่ม/แก้/ดู)
- Reports (Sales/Stock/Movements)
- Theme Switching (Dark/Light)
- Mobile Responsive

### ✅ Data
- 50+ สินค้า (Products)
- 60+ ลูกค่า (Customers)
- 6 Locations (Warehouses/Retail/Vehicles)
- Sample movements

### ✅ Documentation
- Firebase Setup Guide (10 steps)
- Vercel Deploy Guide (5 steps)
- API Documentation
- Troubleshooting Guide

### ✅ Technology
- Next.js 14
- Firebase Realtime Database
- Mock Database with localStorage
- Modern React
- Responsive CSS

---

## 🎯 Recommendation

### Pick Based on Your Situation:

| Scenario | Option | Time |
|----------|--------|------|
| "ผมอยาก test ก่อน" | A (Mock) | 5 min |
| "ผมพร้อม setup Firebase" | B (Firebase) | 45 min |
| "ผมต้องขึ้นเน็ต" | C (Vercel) | 1-2 ชม |
| "ผมทำให้เสร็จทั้งหมด" | A → B → C | 2-3 ชม |

---

## 📚 Document Index

| File | Purpose |
|------|---------|
| **[README_FINAL.md](./README_FINAL.md)** | Full documentation (features, structure, config) |
| **[FIREBASE_SETUP_COMPLETE.md](./FIREBASE_SETUP_COMPLETE.md)** | Step-by-step Firebase Realtime DB setup |
| **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** | Step-by-step Vercel deployment |
| **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** | How to test mock system |
| **GETTING_STARTED.md** | This file |

---

## ✅ Checklist

### Before Starting
- [ ] Node.js installed (`node -v` → v18+)
- [ ] npm works (`npm -v` → v9+)
- [ ] Browser ready (Chrome/Firefox/Safari)

### Option A (Mock - 5 min)
- [ ] `npm install` ✅
- [ ] `npm run dev` ✅
- [ ] Open http://localhost:3000 ✅
- [ ] Test 1-2 features ✅

### Option B (Firebase - 45 min)
- [ ] Google Account + Project ID ready
- [ ] Read FIREBASE_SETUP_COMPLETE.md ✅
- [ ] Create Realtime Database ✅
- [ ] Get Web Config + Service Account ✅
- [ ] Create `.env.local` ✅
- [ ] Test with real Firebase ✅

### Option C (Vercel - 1 hour)
- [ ] Firebase setup complete ✅
- [ ] GitHub account ready ✅
- [ ] GitHub repo created ✅
- [ ] Push code to GitHub ✅
- [ ] Connect Vercel ✅
- [ ] Deploy successful ✅
- [ ] Share URL ✅

---

## 🆘 Help

### Questions?

**For Option A (Mock):**
- See [DEMO_GUIDE.md](./DEMO_GUIDE.md)
- Check browser console (F12)

**For Option B (Firebase):**
- See [FIREBASE_SETUP_COMPLETE.md](./FIREBASE_SETUP_COMPLETE.md)
- Check `.env.local` values
- Check Firebase Console

**For Option C (Vercel):**
- See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- Check Vercel Deployments
- Check Environment Variables

---

## 🎬 Let's Go!

### Start Now:

```bash
# Clone/Open project
cd C:\Users\prim\Desktop\สต๊อครวม\ ชูรสยายปู

# Option A: Quick Test
npm install && npm run dev
# → http://localhost:3000

# Or read guides for B/C...
```

---

## 📞 Next

1. Pick your option (A/B/C)
2. Follow the steps
3. Test the system
4. Proceed to next option (if desired)

---

**Good luck! 🚀**

You've got a complete, production-ready inventory system.
Everything works. Everything is documented.
Time to use it! 💪

---

**Last Updated:** May 2026
