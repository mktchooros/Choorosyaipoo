# 🏪 สต๊อกรวม ชูรสยายปู - Inventory Management System

**ระบบจัดการสต๊อกสินค้าแบบมืออาชีพ พร้อม Real-time Database + Cloud Deploy**

---

## 📸 Screenshots

```
┌─────────────────────────────────────┐
│  ♦ สต๊อกรวม ชูรสยายปู              │
│  Dashboard | Receive | Issue | ...   │
├─────────────────────────────────────┤
│ 📊 Sales Today: ฿12,450            │
│ 📦 Low Stock: 3 items              │
│ 👥 New Customers: 2                │
├─────────────────────────────────────┤
│ Recent Movements:                   │
│ ✓ RCV-1234 +50 units (SKU001)     │
│ ✓ ISS-5678 -30 units (SKU002)     │
└─────────────────────────────────────┘
```

---

## ✨ Features

### 🔥 Core Functionality
- **Dashboard** - ภาพรวมยอดขาย สต๊อก ลูกค้า
- **รับเข้า** - บันทึกการรับสินค้าเข้าคลัง
- **เบิกสินค้า** - เบิกให้ลูกค้า หรือโอนระหว่าง location
- **รายชื่อสินค้า** - ทะเบียนสินค้า 174+ ชิ้น (แก้ไขได้เลย)
- **สต๊อกสินค้า** - ดูสต๊อกทั้งระบบแยกตามจุดเก็บ
- **Locations** - 6 จุดเก็บ (คลัง/ร้าน/รถ/QC)
- **ลูกค้า** - 60+ ลูกค้า VIP/ขายส่ง/ปลีก
- **รายงาน** - ยอดขายรายวัน/เดือน/ปี + คงเหลือ + เคลื่อนไหว
- **Barcode Scan** - สแกนแล้วขึ้นข้อมูลสินค้า
- **Theme** - Light/Dark/5 สี + ความหนาแน่น 3 ระดับ

### 🚀 Technical
- ✅ **Real-time Database** - Firebase Realtime Database
- ✅ **API Backend** - Next.js API Routes (serverless)
- ✅ **Cloud Deploy** - Vercel (auto-deploy จาก GitHub)
- ✅ **Transaction Safe** - Atomic updates สำหรับเบิก/รับ
- ✅ **Offline Support** - Firebase offline caching
- ✅ **Security** - Admin SDK + Security Rules

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Web Browser (Frontend)                │
│  React 19 + Next.js 15 + Firebase SDK           │
│  - Real-time data subscription                  │
│  - Offline caching                              │
└──────────────────┬──────────────────────────────┘
                   │
              HTTPS/WSS
                   │
    ┌──────────────┴──────────────┐
    │                             │
┌───▼──────────────┐  ┌──────────▼────────┐
│  Vercel (Edge)   │  │  Firebase (Cloud) │
│  Next.js Routes  │  │ Realtime Database │
│  - /api/receive  │  │ - /products       │
│  - /api/issue    │  │ - /customers      │
│  - /api/data     │  │ - /stock          │
└──────────────────┘  │ - /movements      │
                      └───────────────────┘
```

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Next.js 15 | UI, routing |
| **Database** | Firebase Realtime | Real-time data sync |
| **Backend** | Next.js API Routes | Transaction processing |
| **Deployment** | Vercel | Cloud hosting |
| **Version Control** | GitHub | Source code |
| **Authentication** | Firebase Auth | (Optional - future) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- Google Account (for Firebase)
- GitHub Account (for Vercel)

### 1. Quick Setup (10 min)

```bash
# Clone or download project
git clone https://github.com/YOUR_USER/sorkroom.git
cd sorkroom

# Install dependencies
npm install
```

### 2. Setup Firebase (10 min)

Read: [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

Create `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_SDK=...
```

### 3. Initialize Data (2 min)

```bash
node scripts/initialize-firebase.js
```

### 4. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Production ready"
git push origin main
```

Then at https://vercel.com:
- Import GitHub repo
- Add environment variables
- Deploy

✅ Live! 🎉

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [QUICK_START.md](./QUICK_START.md) | ⚡ 3-step setup |
| [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) | 🔥 Firebase config details |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | 🔗 API & frontend integration |
| [DESIGN_IMPLEMENTATION.md](./DESIGN_IMPLEMENTATION.md) | 🎨 UI/UX components |

---

## 🎯 Database Structure

### `/products` - Master data
```json
{
  "SKU001": {
    "name": "น้ำพริกเผากุ้งสด",
    "category": "น้ำพริก",
    "price": 99,
    "cost": 45
  }
}
```

### `/stock` - Real-time inventory
```json
{
  "LOC001": {
    "SKU001": 45,    // quantity at location
    "SKU002": 32
  }
}
```

### `/movements` - Audit trail
```json
{
  "RCV-1234567890": {
    "type": "receive",
    "location": "LOC001",
    "items": [{ "sku": "SKU001", "quantity": 10 }],
    "timestamp": "2026-05-09T10:30:00Z"
  }
}
```

---

## 🔌 API Endpoints

### POST `/api/inventory/receive`
Record incoming stock
```json
{
  "items": [{ "sku": "SKU001", "quantity": 10 }],
  "location": "LOC001",
  "notes": "From supplier ABC"
}
```

### POST `/api/inventory/issue`
Issue/transfer stock
```json
{
  "items": [{ "sku": "SKU001", "quantity": 5 }],
  "fromLocation": "LOC001",
  "toLocation": "LOC003",  // null = sell
  "customerId": "CUST001"
}
```

### GET/POST `/api/data`
Generic data read/write
```json
GET /?path=/products
POST { "path": "/products/SKU001", "data": {...} }
```

---

## 🧪 Testing

### Manual Testing
1. Open http://localhost:3000
2. Navigate to "รับเข้า" (Receive)
3. Enter: items, location, notes
4. Click submit
5. Check Firebase console for update
6. Refresh page - data persists

### Automated Testing (Optional)
```bash
npm test
```

---

## 🔐 Security

### Production Rules
Set these in Firebase Console → Realtime Database → Rules:

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

### Environment Variables
- ✅ Safe: `NEXT_PUBLIC_*` (frontend, visible to browser)
- 🔒 Secret: `FIREBASE_ADMIN_SDK` (backend only, never expose)

---

## 📈 Scaling

### Current Limits (Firebase Free Plan)
- **Concurrent Connections:** 100
- **Storage:** 1 GB
- **Download:** Unlimited

### Upgrade Path
- **Blaze (Pay as you go):** Start when exceeding free limits
- **Expected cost:** ~$5-50/month depending on usage

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to Firebase"
- Check `.env.local` has all required keys
- Verify Firebase project exists
- Check Security Rules in Firebase Console

### ❌ "Stock update failed"
- Ensure `FIREBASE_ADMIN_SDK` is valid JSON
- Check user has write permission (Security Rules)
- Look at server logs: `npm run dev` output

### ❌ "Vercel build fails"
- Add all environment variables in Vercel dashboard
- Check GitHub Actions logs
- Verify `next build` runs locally: `npm run build`

---

## 📋 Checklist - Going Live

- [ ] Firebase project created
- [ ] Realtime Database initialized with data
- [ ] Security Rules set properly
- [ ] `.env.local` has all credentials
- [ ] Local testing complete (`npm run dev`)
- [ ] GitHub repo created and pushed
- [ ] Vercel project created and deployed
- [ ] Custom domain configured (optional)
- [ ] Backup plan documented

---

## 🚦 Deployment Status

| Environment | URL | Status |
|------------|-----|--------|
| **Local Dev** | `http://localhost:3000` | ✅ Ready |
| **Staging** | `sorkroom-staging.vercel.app` | ⏳ Configure |
| **Production** | `https://sorkroom.yourdomain.com` | ⏳ Deploy |

---

## 📞 Support

- **Firebase Issues:** https://firebase.google.com/support
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 📝 Changelog

### v1.0.0 (May 2026)
- ✅ Initial release
- ✅ Firebase Realtime Database integration
- ✅ API backend for transactions
- ✅ Vercel deployment ready
- ✅ Thai language UI
- ✅ Real-time sync + offline support

### Planned v1.1.0
- 📋 Firebase Authentication
- 📸 Image upload (products, customers)
- 📧 Email notifications
- 📱 Mobile app (React Native)

---

## 📄 License

Proprietary - สต๊อกรวม ชูรสยายปู

---

## 🙏 Credits

Built with:
- React, Next.js, Firebase (Google)
- Vercel (hosting)
- Tailwind CSS (styling)
- Custom design

---

**🎉 Ready for production use!**

For detailed setup: See [QUICK_START.md](./QUICK_START.md)
