# ⚡ Quick Start - สต๊อกรวม ชูรสยายปู

**3 ขั้นเพื่อเริ่มใช้งานระบบจริง**

---

## 📋 Checklist

- [ ] มี Google Account
- [ ] มี GitHub Account
- [ ] ติดตั้ง Node.js (https://nodejs.org)

---

## 🚀 3 ขั้นอย่างรวดเร็ว

### ขั้น 1️⃣: Setup Firebase (10 นาที)

อ่าน: [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

**สรุป:**
1. สร้าง Firebase Project → https://console.firebase.google.com
2. สร้าง Realtime Database
3. สร้าง Web App Config
4. สร้าง Service Account Key (`.json`)
5. วาง credentials ลง `.env.local`

```bash
# Example .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-xyz
FIREBASE_ADMIN_SDK={"type":"service_account",...}
```

---

### ขั้น 2️⃣: Initialize Database (5 นาที)

```bash
# ติดตั้ง dependencies
npm install

# นำเข้าข้อมูล (สินค้า 10 ชิ้น + ลูกค้า 5 ราย)
node scripts/initialize-firebase.js
```

✅ ข้อมูลขึ้น Firebase แล้ว!

---

### ขั้น 3️⃣: Deploy ไป Vercel (5 นาที)

1. **Push ขึ้น GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USER/sorkroom.git
   git push -u origin main
   ```

2. **Deploy ที่ Vercel**
   - ไปที่ https://vercel.com
   - Click "New Project"
   - Import GitHub repo
   - Add Environment Variables จาก `.env.local`
   - Click "Deploy"

✅ Live ที่ https://your-app.vercel.app แล้ว!

---

## 🧪 Testing

### ทดสอบ Local
```bash
npm run dev
# เข้า http://localhost:3000
# ทดลองรับเข้า/เบิก/ดูสต๊อก
```

### ทดสอบ Production
- เข้า https://your-app.vercel.app
- ทำการทดสอบเหมือน local

---

## 📱 Features พร้อมใช้

✅ **Dashboard** - ภาพรวมยอดขาย/สต๊อก  
✅ **รับเข้า** - บันทึกการรับสินค้า  
✅ **เบิกสินค้า** - เบิกให้ลูกค่า/โอนระหว่างจุดเก็บ  
✅ **รายชื่อสินค้า** - ทะเบียน 174 ชิ้น  
✅ **สต๊อกสินค้า** - ดูสต๊อกทั้งระบบ  
✅ **Locations** - 6 จุดเก็บ  
✅ **ลูกค้า** - 60 ลูกค้า  
✅ **รายงาน** - ขาย/คงเหลือ/เคลื่อนไหว  
✅ **Barcode Scan** - สแกนแล้วขึ้นข้อมูล  

---

## 📖 Documentation

- **Setup:** [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
- **Integration:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Troubleshooting:** [FIREBASE_SETUP_GUIDE.md#-troubleshooting](./FIREBASE_SETUP_GUIDE.md#-troubleshooting)

---

## 💡 Pro Tips

1. **ทดสอบ offline:** Firebase cache data อัตโนมัติ
2. **เพิ่มสินค้า:** ผ่าน Firebase Console หรือ API
3. **เปลี่ยนสีเน้น:** ⚙️ มุมขวาล่าง
4. **Backup:** Firebase Console → Rules → Export JSON

---

## ❌ ติดขัด?

- ❌ "API Key not found" → ดู `.env.local` มี credentials ทั้งหมดไหม
- ❌ "Permission denied" → ไปแก้ Security Rules เป็น test mode
- ❌ "Cannot find node" → ติดตั้ง Node.js ก่อน

ดู [FIREBASE_SETUP_GUIDE.md#-troubleshooting](./FIREBASE_SETUP_GUIDE.md#-troubleshooting) สำหรับคำตอบเพิ่มเติม

---

## 📞 ติดต่อ

มีคำถาม? ดูไฟล์ guide เพิ่มเติมหรือตรวจสอบ Firebase console logs

---

**🎉 ยินดีต้อนรับสู่ สต๊อกรวม ชูรสยายปู - Inventory Management System**

Happy inventory tracking! 📊
