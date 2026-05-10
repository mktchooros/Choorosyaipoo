# 🎭 Demo Guide - Test System ทันที

**ใช้ Mock Firebase ทดลองระบบได้เลย (ไม่ต้องรอตั้ง Firebase จริง)**

---

## 🚀 Quick Start Demo (2 นาที)

### Step 1: ดาวน์โหลด dependencies
```bash
cd C:\Users\prim\Desktop\สต๊อครวม\ ชูรสยายปู
npm install
```

### Step 2: รัน development server
```bash
npm run dev
```

### Step 3: เปิด browser
```
http://localhost:3000
```

✅ **ตอนนี้ระบบ ready ทั้งหมด!**

---

## 🎮 ทดลองฟีเจอร์

### Dashboard
- ✅ ดูยอดขาย/สต๊อก/ลูกค่า
- ✅ Theme toggle (⚙️)
- ✅ Accent color picker

### รับเข้า (Receive)
1. เลือกสินค้า (SKU001-SKU005)
2. ป้อนจำนวน
3. เลือก location (LOC001-LOC006)
4. Click "บันทึก"
5. ✅ เห็น success message

### เบิกสินค้า (Issue)
1. เลือกสินค้า
2. ป้อนจำนวน (ต้องไม่มากกว่าสต๊อก)
3. เลือก from location
4. เลือก customer (หรือ to location สำหรับ transfer)
5. Click "บันทึก"
6. ✅ เห็น success message

### ดูสต๊อก (Stock)
- ✅ ตาราง stock แบบเรียลไทม์
- ✅ Filter ตามหมวด

### รายงาน (Reports)
- ✅ ยอดขาย/คงเหลือ/เคลื่อนไหว

---

## 📊 Sample Data (พร้อมใช้)

### Products (5 ชิ้น)
| SKU | ชื่อ | ราคา | สต๊อก LOC001 |
|-----|------|------|------------|
| SKU001 | น้ำพริกเผากุ้งสด | ฿99 | 45 |
| SKU002 | น้ำพริกแกงไก่ | ฿110 | 32 |
| SKU003 | น้ำจิ้มไก่ | ฿85 | 28 |
| SKU004 | ต้นหอม | ฿35 | 50 |
| SKU005 | กระเทียม | ฿120 | 15 |

### Locations (6 จุด)
- LOC001: คลัง A
- LOC002: คลัง B
- LOC003: หน้าร้าน
- LOC004: รถส่ง 1
- LOC005: รถส่ง 2
- LOC006: QC

### Customers (5 ลูกค้า)
- CUST001: บริษัท สดใจ (wholesale)
- CUST002: ร้านค้า ชูรสยายปู (retail)
- CUST003: ร้านอาหาร ชีวิต (restaurant)
- CUST004: โรงแรม บ้านสวนแก้ว (hotel)
- CUST005: ร้าน เค้กหวาน (retail)

---

## 🧪 Test Scenarios

### Scenario 1: Receive Stock
```
1. ไป "รับเข้า" page
2. สินค้า: SKU001
3. จำนวน: 20
4. Location: LOC001
5. Click "บันทึก"
✅ Success: RCV-[timestamp]
```

### Scenario 2: Issue to Customer
```
1. ไป "เบิกสินค้า" page
2. สินค้า: SKU001
3. จำนวน: 10
4. From: LOC001
5. Customer: CUST001
6. Click "บันทึก"
✅ Success: ISS-[timestamp]
✅ Stock LOC001 SKU001: 45 → 35
```

### Scenario 3: Transfer Between Locations
```
1. ไป "เบิกสินค้า" page
2. สินค้า: SKU002
3. จำนวน: 15
4. From: LOC001
5. To: LOC003
6. Click "บันทึก"
✅ Success: ISS-[timestamp]
✅ LOC001: 32 → 17
✅ LOC003: 18 → 33
```

### Scenario 4: Insufficient Stock (Test Validation)
```
1. ไป "เบิกสินค้า" page
2. สินค้า: SKU005
3. จำนวน: 100 (more than available 15)
4. Click "บันทึก"
❌ Error: "Insufficient stock"
```

---

## 🔄 Data Flow (Mock vs Real)

### Mock Mode (Current)
```
Browser Input
    ↓
API Endpoint (/api/inventory/receive-mock)
    ↓
In-Memory Database (lib/firebase-mock.ts)
    ↓
Console Logs Only
    ↓
Data Lost on Refresh ❌
```

### Real Mode (After Firebase Setup)
```
Browser Input
    ↓
API Endpoint (/api/inventory/receive)
    ↓
Firebase Admin SDK
    ↓
Firebase Realtime Database ☁️
    ↓
Persistent + Real-time ✅
```

---

## 🎛️ UI Controls (ทดลองได้)

### Settings (⚙️ มุมขวาล่าง)
- **Dark/Light Mode** - ลอง toggle
- **Accent Color** - เปลี่ยนสี
- **Density** - Compact/Comfortable/Spacious
- **Live Indicator** - Enable/Disable pulse dots

### Navigation (Sidebar)
- Click menu items ลองทั้งหมด
- ส่วนใหญ่ยังใช้ mock data

---

## 💾 Data Persistence

### Mock Mode ❌
- ✅ Works ในตา dev server
- ❌ Resets on browser refresh
- ❌ Lost on server restart
- ✅ ดีสำหรับ testing UI

### Real Firebase ✅
- ✅ Persistent forever
- ✅ Real-time sync
- ✅ Multi-device support
- ✅ Production-ready

---

## 🔄 Switch to Real Firebase

เมื่อคุณ setup Firebase แล้ว:

### 1. Update .env.local
```bash
# From:
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-test

# To:
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sorkroom-xyz
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
# ... (add all other keys)
```

### 2. Run initialization
```bash
node scripts/initialize-firebase.js
```

### 3. Restart dev server
```bash
npm run dev
```

✅ ตอนนี้ใช้ real Firebase แล้ว!

---

## 🧰 Browser DevTools

### Check Console
```
F12 → Console tab
- ดู [MOCK] logs
- ดู [MOCK API] logs
- Check for errors
```

### Check LocalStorage
```
F12 → Application → LocalStorage → localhost:3000
- useMockFirebase: true/false
- tweaks: {...}
```

---

## 📝 Mock Data Files

### lib/firebase-mock.ts
- In-memory database
- Mock API implementations
- Listener system

### app/api/inventory/receive-mock/route.ts
- Mock receive endpoint
- Validation
- Success response

### app/api/inventory/issue-mock/route.ts
- Mock issue endpoint
- Stock validation
- Error handling

---

## ⚠️ Known Limitations (Mock)

❌ **Data doesn't persist** - Reset on refresh  
❌ **Not real-time** - Manual refresh needed  
❌ **Single device only** - No sync across browsers  
❌ **Limited validation** - Basic checks only  

✅ **UI works perfectly** - All features testable  
✅ **Fast** - No network latency  
✅ **No setup needed** - Works out of the box  

---

## 🎯 Next: Switch to Real Firebase

เมื่อพร้อม:

1. **Read:** [QUICK_START.md](./QUICK_START.md)
2. **Setup Firebase** (10 min)
3. **Update .env.local**
4. **Run initialize script**
5. **✅ Live with persistent data!**

---

## 🆘 Troubleshooting

### ❌ "Cannot find module"
```bash
npm install
npm run dev
```

### ❌ "Port 3000 in use"
```bash
# Kill process or use different port
npm run dev -- -p 3001
```

### ❌ "Data disappeared"
- That's normal in mock mode ✅
- Refresh causes data reset
- Switch to real Firebase to persist

### ❌ "API errors"
- Check browser console (F12)
- Check server console (terminal)
- All mock APIs log to console

---

## 📊 Testing Checklist

- [ ] Dashboard loads
- [ ] Sidebar navigation works
- [ ] Theme toggle works (⚙️)
- [ ] Color picker works
- [ ] Receive page loads
- [ ] Can submit receive
- [ ] Issue page loads
- [ ] Can submit issue
- [ ] Stock page loads
- [ ] Reports display
- [ ] Barcode scanner opens
- [ ] No console errors

---

## 💡 Pro Tips

1. **Keep browser console open** (F12) to see mock logs
2. **Test on mobile size** (F12 responsive) for UI testing
3. **Try extreme values** (9999, -10) to test validation
4. **Refresh often** to test with clean data
5. **Test theme switching** to verify CSS works

---

## 🎉 Ready?

```bash
npm run dev
```

Then:
- Open http://localhost:3000
- Click around
- Try all features
- See it work!

**No Firebase setup needed right now** ✅

When you're ready for real data:
→ [QUICK_START.md](./QUICK_START.md)

---

**Happy testing! 🎭**
