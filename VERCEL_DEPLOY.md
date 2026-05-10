# 🚀 Deploy ไป Vercel — Live on Internet!

**ในขั้นตอน 5 ขั้น ระบบของคุณจะขึ้นเน็ตแล้ว**

---

## ✅ Step 1: Push ไป GitHub

### ขั้น A: สร้าง Repository
1. ไป https://github.com/new
2. ชื่อ: `sorkroom` (หรือชื่ออะไรก็ได้)
3. Description: `Inventory Management System - สต๊อกรวม ชูรสยายปู`
4. Private (ห้ามให้ใครเห็นพลาน)
5. **Click "Create repository"**

### ขั้น B: Push Code ขึ้น GitHub
```bash
cd C:\Users\prim\Desktop\สต๊อครวม\ ชูรสยายปู

git init
git add .
git commit -m "Initial commit: Full inventory system with Firebase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sorkroom.git
git push -u origin main
```

---

## 🔗 Step 2: เชื่อมต่อ Vercel

### ขั้น A: ไป Vercel
1. ไป https://vercel.com
2. **Sign in ด้วย GitHub** (ง่ายสุด)
3. **Authorize Vercel**

### ขั้น B: Import Project
1. Click **"Add New..." → "Project"**
2. **เลือก repository:** `sorkroom`
3. Click **"Import"**

---

## ⚙️ Step 3: ตั้ง Environment Variables

### ในหน้า "Configure Project":

**ก็อปค่าเหล่านี้ from `.env.local`:**

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = project-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = project-71f95cfd-e0d0-49d3-9b1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = project-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_DATABASE_URL = https://project-xxxxx-default.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY = {"type":"service_account",...entire JSON...}
```

**ก็อป one by one:**
1. ค่า name
2. ค่า value (paste จาก `.env.local`)
3. Click "Add"
4. ทำซ้ำทั้งหมด

---

## 🎯 Step 4: Deploy!

### Click "Deploy"
- ⏳ รอ 3-5 นาที Vercel build + deploy
- 🎉 ตอนจบ จะได้ URL แบบ: `https://sorkroom-xxxxx.vercel.app`

### ทดสอบ URL:
```
https://sorkroom-xxxxx.vercel.app
```

✅ ต้อง load ได้ (อาจช้านิดหน่อยครั้งแรก)

---

## 🔄 Step 5: Auto-Deploy ทุกครั้ง Push

### Vercel ทำให้อัตโนมัติแล้ว!

ทุกครั้งที่คุณ:
```bash
git push origin main
```

→ Vercel จะ build + deploy อัตโนมัติ ⚡

---

## 📊 ประเมินผล

### เช็ค Deployment Status:
1. ไป https://vercel.com/dashboard
2. เลือก project `sorkroom`
3. ดู "Deployments" history

### Check Logs:
- Click deployment → "View Logs"
- ต้อง build success 🟢

---

## 🔐 ความปลอดภัย

### Tips:
- ✅ Service Account Key = Server-side only
- ✅ Public API Key = Frontend OK (ใช้ได้)
- ✅ Firebase Security Rules = ป้องกัน unauthorized access
- ✅ GitHub Repo = Private เท่านั้น

---

## 📱 ใช้งานจากที่ไหนก็ได้

**ตอนนี้สามารถ:**
- 💻 Desktop: https://sorkroom-xxxxx.vercel.app
- 📱 Mobile: ใช้ URL เดียวกัน
- 🌐 Thailand/World: ที่ไหนก็ได้มีเน็ต

---

## 🚀 Production Checklist

ก่อน go live ให้ verify:

- [ ] ✅ Firebase Security Rules set
- [ ] ✅ Database backup (Firebase Console → Backups)
- [ ] ✅ Test receive/issue/transfer ได้
- [ ] ✅ Customer add feature ทำงาน
- [ ] ✅ Reports display ถูก
- [ ] ✅ Mobile responsive ดี (F12 test)
- [ ] ✅ Browser console ไม่มี errors
- [ ] ✅ Performance OK (< 3 seconds load)

---

## 🆘 Issues?

### ❌ Build failed
- ดู Vercel logs (Deployments → Failed → View Logs)
- ตรวจสอบ `.env.local` keys

### ❌ "Permission denied" after deploy
- Check Firebase Security Rules
- Database rules ต้อง allow auth users

### ❌ Slow loading
- Check Network tab (DevTools F12)
- Firebase might be cold start (wait 10 sec)

---

## 🎉 ทำเสร็จแล้ว!

**ระบบของคุณขึ้นเน็ตแล้ว!**

Share URL กับลูกค้า/ทีม:
```
https://sorkroom-xxxxx.vercel.app
```

---

## 📚 ถัดไป?

1. **Monitor Analytics** → Firebase Console
2. **Add Authentication** → Google Sign-In
3. **Custom Domain** → vercel.com/docs
4. **Backup Strategy** → Firebase Backups

---

**Live! 🎊**
