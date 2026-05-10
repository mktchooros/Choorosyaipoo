# 🔗 Firebase Integration Guide

วิธีเชื่อม Frontend prototype กับ Firebase Backend

---

## 🎯 Overview

ระบบจะประกอบด้วย 3 ส่วน:

1. **Frontend** (React/JSX in browser)
   - ใช้ Firebase SDK เพื่ออ่าน/เขียน real-time data
   - ไม่ต้องบันทึกเป็น localStorage

2. **Backend APIs** (Next.js `/api` routes)
   - Transaction processing (รับเข้า/เบิก)
   - Data validation
   - Atomic updates

3. **Database** (Firebase Realtime Database)
   - เก็บ products, customers, stock, movements
   - Real-time sync ผ่าน WebSocket

---

## 📦 Installation & Setup

### 1. Install dependencies
```bash
npm install firebase firebase-admin
```

### 2. Setup `.env.local` (ดู FIREBASE_SETUP_GUIDE.md)

---

## 🚀 Integration Steps

### Step 1: แก้ `app.jsx` ให้ใช้ Firebase

ตั้งแต่เดิม:
```javascript
const [stock, setStock] = useState(seedStock);
const [movs, setMovs] = useState(seedMovements);
```

เป็น:
```javascript
import { subscribeToData, getFirebaseData } from '../lib/firebase';

function App() {
  const [stock, setStock] = useState({});
  const [movs, setMovs] = useState({});
  
  useEffect(() => {
    // Subscribe to stock changes in real-time
    const unsubStock = subscribeToData('stock', setStock);
    const unsubMovs = subscribeToData('movements', setMovs);
    
    return () => {
      unsubStock?.();
      unsubMovs?.();
    };
  }, []);
  
  // ... rest of component
}
```

### Step 2: Update Receive Handler

เดิม:
```javascript
const handleReceive = (items, location) => {
  // update localStorage
};
```

เป็น:
```javascript
const handleReceive = async (items, location, notes) => {
  try {
    const response = await fetch('/api/inventory/receive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        location,
        notes,
        date: new Date().toISOString().split('T')[0]
      })
    });
    
    const result = await response.json();
    if (result.success) {
      // Firebase จะอัปเดตอัตโนมัติ (real-time)
      toast.show('รับเข้าสำเร็จ');
    }
  } catch (error) {
    toast.error('เกิดข้อผิดพลาด: ' + error.message);
  }
};
```

### Step 3: Update Issue Handler

```javascript
const handleIssue = async (items, fromLocation, toLocation, customerId) => {
  try {
    const response = await fetch('/api/inventory/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        fromLocation,
        toLocation: toLocation || null,
        customerId: customerId || null,
        type: toLocation ? 'transfer' : 'issue',
        notes: ''
      })
    });
    
    const result = await response.json();
    if (result.success) {
      toast.show('เบิกสำเร็จ');
    } else {
      toast.error(result.error);
    }
  } catch (error) {
    toast.error('เกิดข้อผิดพลาด');
  }
};
```

### Step 4: Load Products & Customers

```javascript
useEffect(() => {
  const loadMasterData = async () => {
    const products = await getFirebaseData('products');
    const customers = await getFirebaseData('customers');
    setProducts(products || {});
    setCustomers(customers || {});
  };
  
  loadMasterData();
}, []);
```

---

## 🔌 API Endpoints

### Receive Stock
```
POST /api/inventory/receive
Body: {
  items: [{ sku, quantity }, ...],
  location: "LOC001",
  date: "2026-05-09",
  notes: "optional"
}
Response: { success: true, receiveId, timestamp }
```

### Issue Stock
```
POST /api/inventory/issue
Body: {
  items: [{ sku, quantity }, ...],
  fromLocation: "LOC001",
  toLocation: "LOC002" (optional),
  customerId: "CUST001" (optional),
  type: "issue|transfer",
  notes: "optional"
}
Response: { success: true, issueId, timestamp }
```

### Get Data
```
GET /api/data?path=/products
Response: { success: true, path, data }
```

### Set Data
```
POST /api/data
Body: { path: "/products/SKU001", data: {...} }
Response: { success: true, path }
```

---

## 🔄 Data Flow Example

### Receiving Stock

```
User fills form (รับเข้า)
         ↓
Client: fetch POST /api/inventory/receive
         ↓
Server: validate & check stock
         ↓
Server: update Firebase
  - movements/RCV-xxx: { items, location, ... }
  - stock/LOC001/SKU001: 45 → 55
         ↓
Firebase triggers real-time listeners
         ↓
Frontend: subscribeToData('stock') gets update
         ↓
UI re-renders with new stock
```

---

## 📊 Component Updates Needed

### PageReceive.jsx
```javascript
// Add Firebase integration
const handleReceive = (items, location) => {
  return fetch('/api/inventory/receive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, location })
  });
};
```

### PageIssue.jsx
```javascript
// Add stock validation
if (currentStock < quantity) {
  alert(`Insufficient stock. Available: ${currentStock}`);
  return;
}

const handleIssue = (items, fromLocation, toLocation) => {
  return fetch('/api/inventory/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items, fromLocation, toLocation: toLocation || null
    })
  });
};
```

### PageStock.jsx
```javascript
// Subscribe to real-time stock updates
useEffect(() => {
  const unsub = subscribeToData('stock', setStock);
  return unsub;
}, []);
```

---

## 🧪 Testing

### Local Development
```bash
npm run dev
# Open http://localhost:3000
# Test receive/issue operations
# Check Firebase console for data
```

### Production (Vercel)
```bash
# After deploy
# https://your-app.vercel.app
# Same testing as local
```

---

## 📝 Database Schema Reference

### Products
```json
{
  "products": {
    "SKU001": {
      "sku": "SKU001",
      "name": "น้ำพริกเผากุ้งสด",
      "category": "น้ำพริก",
      "unit": "ขวด",
      "cost": 45,
      "price": 99,
      "minStock": 10
    }
  }
}
```

### Customers
```json
{
  "customers": {
    "CUST001": {
      "id": "CUST001",
      "name": "บริษัท สดใจ",
      "type": "wholesale",
      "location": "กาฬสินธุ์",
      "phone": "08xxxx",
      "ytd": 45000
    }
  }
}
```

### Stock
```json
{
  "stock": {
    "LOC001": {
      "SKU001": 45,
      "SKU002": 32
    },
    "LOC002": {
      "SKU001": 28
    }
  }
}
```

### Movements
```json
{
  "movements": {
    "RCV-1234567890": {
      "type": "receive",
      "location": "LOC001",
      "items": [{ "sku": "SKU001", "quantity": 10 }],
      "timestamp": "2026-05-09T10:30:00Z"
    },
    "ISS-1234567891": {
      "type": "issue",
      "fromLocation": "LOC001",
      "toLocation": null,
      "customerId": "CUST001",
      "items": [{ "sku": "SKU001", "quantity": 5 }],
      "timestamp": "2026-05-09T10:35:00Z"
    }
  }
}
```

---

## ⚠️ Important Notes

1. **Real-time Sync**: Firebase sync ช้า 1-2 วินาที หากต้องการ instant UI update ให้ update state locally ก่อน
2. **Offline**: Firebase รองรับ offline mode (cached data) ตามค่าเริ่มต้น
3. **Security**: ด้าน production ต้องตั้ง Security Rules อย่างเข้มงวด
4. **Costs**: Firebase ฟรี 100 connections พร้อมกัน ตอนนี้พอสำหรับ prototype

---

## 📚 Resources

- Firebase Docs: https://firebase.google.com/docs
- Realtime Database Guide: https://firebase.google.com/docs/database
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction

---

**Status:** ✅ Ready to integrate!
