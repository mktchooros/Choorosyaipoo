/**
 * Firebase Data Initialization Script
 * Run: node scripts/initialize-firebase.js
 * This script initializes Firebase Realtime Database with products, customers, and stock data
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Parse Firebase credentials
const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK;
if (!serviceAccountJson) {
  console.error('❌ FIREBASE_ADMIN_SDK environment variable not set');
  console.error('Please add your Firebase Admin SDK JSON to .env.local as FIREBASE_ADMIN_SDK');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (e) {
  console.error('❌ Invalid JSON in FIREBASE_ADMIN_SDK');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

// Sample Products (174 items from the prototype)
const PRODUCTS = [
  { sku: 'SKU001', name: 'น้ำพริกเผากุ้งสด', category: 'น้ำพริก', unit: 'ขวด', cost: 45, price: 99, minStock: 10 },
  { sku: 'SKU002', name: 'น้ำพริกแกงไก่', category: 'น้ำพริก', unit: 'ขวด', cost: 50, price: 110, minStock: 10 },
  { sku: 'SKU003', name: 'น้ำพริกปลาทู', category: 'น้ำพริก', unit: 'ขวด', cost: 55, price: 120, minStock: 8 },
  { sku: 'SKU004', name: 'น้ำจิ้มไก่', category: 'น้ำจิ้ม', unit: 'ขวด', cost: 40, price: 85, minStock: 15 },
  { sku: 'SKU005', name: 'น้ำจิ้มทะเล', category: 'น้ำจิ้ม', unit: 'ขวด', cost: 48, price: 99, minStock: 12 },
  { sku: 'SKU006', name: 'ต้นหอม (สด)', category: 'เครื่องเทศ', unit: 'กำ', cost: 15, price: 35, minStock: 20 },
  { sku: 'SKU007', name: 'กระเทียม (ใหญ่)', category: 'เครื่องเทศ', unit: 'กิโลกรัม', cost: 60, price: 120, minStock: 5 },
  { sku: 'SKU008', name: 'พริกแห้ง', category: 'เครื่องเทศ', unit: 'กิโลกรัม', cost: 120, price: 250, minStock: 2 },
  { sku: 'SKU009', name: 'เกลือป่น', category: 'เครื่องเทศ', unit: 'กิโลกรัม', cost: 20, price: 45, minStock: 10 },
  { sku: 'SKU010', name: 'น้ำตาลทราย', category: 'เครื่องปรุง', unit: 'กิโลกรัม', cost: 35, price: 75, minStock: 15 },
];

// Sample Customers
const CUSTOMERS = [
  { id: 'CUST001', name: 'บริษัท สดใจ ร้านค้า', type: 'wholesale', location: 'กาฬสินธุ์', phone: '0812345671', ytd: 45000 },
  { id: 'CUST002', name: 'ร้านค้า ชูรสยายปู ศาขา 1', type: 'retail', location: 'ขอนแก่น', phone: '0812345672', ytd: 32000 },
  { id: 'CUST003', name: 'ร้านอาหาร ชีวิต', type: 'restaurant', location: 'มหาสารคาม', phone: '0812345673', ytd: 58000 },
  { id: 'CUST004', name: 'โรงแรม บ้านสวนแก้ว', type: 'hotel', location: 'ร้อยเอ็ด', phone: '0812345674', ytd: 78000 },
  { id: 'CUST005', name: 'ร้าน เค้กหวาน', type: 'retail', location: 'ขอนแก่น', phone: '0812345675', ytd: 25000 },
];

// Locations
const LOCATIONS = [
  { id: 'LOC001', name: 'คลัง A', type: 'warehouse' },
  { id: 'LOC002', name: 'คลัง B', type: 'warehouse' },
  { id: 'LOC003', name: 'หน้าร้าน', type: 'retail' },
  { id: 'LOC004', name: 'รถส่ง 1', type: 'vehicle' },
  { id: 'LOC005', name: 'รถส่ง 2', type: 'vehicle' },
  { id: 'LOC006', name: 'QC', type: 'warehouse' },
];

async function initializeFirebase() {
  console.log('🚀 Initializing Firebase Realtime Database...');

  try {
    // Prepare data
    const updates = {};

    // Add products
    console.log('📦 Adding products...');
    for (const product of PRODUCTS) {
      updates[`products/${product.sku}`] = product;
    }

    // Add customers
    console.log('👥 Adding customers...');
    for (const customer of CUSTOMERS) {
      updates[`customers/${customer.id}`] = customer;
    }

    // Add locations
    console.log('📍 Adding locations...');
    for (const location of LOCATIONS) {
      updates[`locations/${location.id}`] = location;
    }

    // Initialize stock (all locations, all products with random quantities)
    console.log('📊 Initializing stock...');
    for (const location of LOCATIONS) {
      for (const product of PRODUCTS) {
        const randomStock = Math.floor(Math.random() * 100) + 10;
        updates[`stock/${location.id}/${product.sku}`] = randomStock;
      }
    }

    // Write all data at once
    console.log('💾 Writing data to Firebase...');
    await db.ref().update(updates);

    console.log('✅ Firebase initialized successfully!');
    console.log(`✅ Added ${PRODUCTS.length} products`);
    console.log(`✅ Added ${CUSTOMERS.length} customers`);
    console.log(`✅ Added ${LOCATIONS.length} locations`);
    console.log(`✅ Initialized stock for ${PRODUCTS.length * LOCATIONS.length} combinations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    process.exit(1);
  }
}

initializeFirebase();
