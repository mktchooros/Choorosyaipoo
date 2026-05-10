/**
 * Mock Firebase Implementation with localStorage Persistence
 * Use this for testing without real Firebase
 * Switch to real Firebase after setup
 */

// Default data
const DEFAULT_DATA = {
  products: {
    SKU001: { sku: 'SKU001', name: 'น้ำพริกเผากุ้งสด', category: 'น้ำพริก', unit: 'ขวด', cost: 45, price: 99, minStock: 10 },
    SKU002: { sku: 'SKU002', name: 'น้ำพริกแกงไก่', category: 'น้ำพริก', unit: 'ขวด', cost: 50, price: 110, minStock: 10 },
    SKU003: { sku: 'SKU003', name: 'น้ำจิ้มไก่', category: 'น้ำจิ้ม', unit: 'ขวด', cost: 40, price: 85, minStock: 15 },
    SKU004: { sku: 'SKU004', name: 'ต้นหอม (สด)', category: 'เครื่องเทศ', unit: 'กำ', cost: 15, price: 35, minStock: 20 },
    SKU005: { sku: 'SKU005', name: 'กระเทียม', category: 'เครื่องเทศ', unit: 'กิโลกรัม', cost: 60, price: 120, minStock: 5 },
  },
  customers: {
    CUST001: { id: 'CUST001', name: 'บริษัท สดใจ', type: 'wholesale', location: 'กาฬสินธุ์', phone: '0812345671', ytd: 45000 },
    CUST002: { id: 'CUST002', name: 'ร้านค้า ชูรสยายปู', type: 'retail', location: 'ขอนแก่น', phone: '0812345672', ytd: 32000 },
    CUST003: { id: 'CUST003', name: 'ร้านอาหาร ชีวิต', type: 'restaurant', location: 'มหาสารคาม', phone: '0812345673', ytd: 58000 },
    CUST004: { id: 'CUST004', name: 'โรงแรม บ้านสวนแก้ว', type: 'hotel', location: 'ร้อยเอ็ด', phone: '0812345674', ytd: 78000 },
    CUST005: { id: 'CUST005', name: 'ร้าน เค้กหวาน', type: 'retail', location: 'ขอนแก่น', phone: '0812345675', ytd: 25000 },
  },
  locations: {
    LOC001: { id: 'LOC001', name: 'คลัง A', type: 'warehouse' },
    LOC002: { id: 'LOC002', name: 'คลัง B', type: 'warehouse' },
    LOC003: { id: 'LOC003', name: 'หน้าร้าน', type: 'retail' },
    LOC004: { id: 'LOC004', name: 'รถส่ง 1', type: 'vehicle' },
    LOC005: { id: 'LOC005', name: 'รถส่ง 2', type: 'vehicle' },
    LOC006: { id: 'LOC006', name: 'QC', type: 'warehouse' },
  },
  stock: {
    LOC001: { SKU001: 45, SKU002: 32, SKU003: 28, SKU004: 50, SKU005: 15 },
    LOC002: { SKU001: 38, SKU002: 42, SKU003: 20, SKU004: 35, SKU005: 22 },
    LOC003: { SKU001: 25, SKU002: 18, SKU003: 12, SKU004: 30, SKU005: 8 },
    LOC004: { SKU001: 10, SKU002: 15, SKU003: 8, SKU004: 12, SKU005: 5 },
    LOC005: { SKU001: 12, SKU002: 20, SKU003: 14, SKU004: 18, SKU005: 7 },
    LOC006: { SKU001: 5, SKU002: 10, SKU003: 3, SKU004: 5, SKU005: 2 },
  },
  movements: {} as Record<string, any>,
};

// In-memory database (simulates Firebase)
let mockDatabase: Record<string, any> = JSON.parse(JSON.stringify(DEFAULT_DATA));

// Initialize from localStorage if available
function initDatabase() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('sorkroom_mock_db');
      if (stored) {
        mockDatabase = JSON.parse(stored);
        console.log('✅ Loaded data from localStorage');
        return;
      }
    }
  } catch (e) {
    console.warn('[MOCK] localStorage error:', e);
  }
  console.log('📦 Using default data');
}

// Save to localStorage
function saveDatabase() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sorkroom_mock_db', JSON.stringify(mockDatabase));
    }
  } catch (e) {
    console.warn('[MOCK] localStorage save error:', e);
  }
}

// Listeners storage
const listeners: Record<string, Set<Function>> = {};

// Initialize on load
initDatabase();

/**
 * Get data from mock database
 */
export async function getFirebaseData(path: string): Promise<any> {
  console.log(`[MOCK] GET: ${path}`);

  const parts = path.split('/').filter(Boolean);
  let current = mockDatabase;

  for (const part of parts) {
    current = current?.[part];
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return current;
}

/**
 * Set data in mock database
 */
export async function setFirebaseData(path: string, data: any): Promise<boolean> {
  console.log(`[MOCK] SET: ${path}`, data);

  const parts = path.split('/').filter(Boolean);
  let current = mockDatabase;

  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }

  current[parts[parts.length - 1]] = data;
  saveDatabase();

  // Trigger listeners
  notifyListeners(path);

  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
}

/**
 * Update data in mock database
 */
export async function updateFirebaseData(path: string, data: any): Promise<boolean> {
  console.log(`[MOCK] UPDATE: ${path}`, data);

  const parts = path.split('/').filter(Boolean);
  let current = mockDatabase;

  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }

  const lastKey = parts[parts.length - 1];
  current[lastKey] = { ...current[lastKey], ...data };
  saveDatabase();

  // Trigger listeners
  notifyListeners(path);

  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
}

/**
 * Subscribe to data changes
 */
export function subscribeToData(path: string, callback: (data: any) => void): (() => void) {
  console.log(`[MOCK] SUBSCRIBE: ${path}`);

  if (!listeners[path]) {
    listeners[path] = new Set();
  }

  listeners[path].add(callback);

  // Immediately call with current data
  getFirebaseData(path).then(callback);

  // Return unsubscribe function
  return () => {
    listeners[path].delete(callback);
    console.log(`[MOCK] UNSUBSCRIBE: ${path}`);
  };
}

/**
 * Notify all listeners of path changes
 */
function notifyListeners(path: string) {
  if (listeners[path]) {
    getFirebaseData(path).then(data => {
      listeners[path].forEach(callback => callback(data));
    });
  }

  // Also notify parent paths
  const parentPath = path.substring(0, path.lastIndexOf('/'));
  if (parentPath && listeners[parentPath]) {
    getFirebaseData(parentPath).then(data => {
      listeners[parentPath].forEach(callback => callback(data));
    });
  }
}

/**
 * Receive Stock API
 */
export async function receiveStock(items: any[], location: string, notes?: string) {
  const receiveId = `RCV-${Date.now()}`;
  const timestamp = new Date().toISOString();

  console.log(`[MOCK] RECEIVE: ${receiveId}`, { items, location });

  // Update stock
  const updates: Record<string, any> = {};

  for (const item of items) {
    const { sku, quantity } = item;
    const currentStock = mockDatabase.stock?.[location]?.[sku] || 0;
    updates[`stock/${location}/${sku}`] = currentStock + quantity;
  }

  // Log movement
  updates[`movements/${receiveId}`] = {
    id: receiveId,
    type: 'receive',
    location,
    items,
    timestamp,
    notes: notes || '',
  };

  // Apply updates
  for (const [path, data] of Object.entries(updates)) {
    await setFirebaseData(path, data);
  }

  return { success: true, receiveId, timestamp };
}

/**
 * Issue Stock API
 */
export async function issueStock(items: any[], fromLocation: string, toLocation?: string, customerId?: string) {
  const issueId = `ISS-${Date.now()}`;
  const timestamp = new Date().toISOString();

  console.log(`[MOCK] ISSUE: ${issueId}`, { items, fromLocation, toLocation, customerId });

  // Validate stock
  for (const item of items) {
    const { sku, quantity } = item;
    const currentStock = mockDatabase.stock?.[fromLocation]?.[sku] || 0;

    if (currentStock < quantity) {
      throw new Error(`Insufficient stock for ${sku}. Available: ${currentStock}, Requested: ${quantity}`);
    }
  }

  // Update stock
  const updates: Record<string, any> = {};

  for (const item of items) {
    const { sku, quantity } = item;

    // Decrease from location
    const fromStock = mockDatabase.stock?.[fromLocation]?.[sku] || 0;
    updates[`stock/${fromLocation}/${sku}`] = fromStock - quantity;

    // Increase to location if transfer
    if (toLocation) {
      const toStock = mockDatabase.stock?.[toLocation]?.[sku] || 0;
      updates[`stock/${toLocation}/${sku}`] = toStock + quantity;
    }
  }

  // Log movement
  updates[`movements/${issueId}`] = {
    id: issueId,
    type: toLocation ? 'transfer' : 'issue',
    fromLocation,
    toLocation: toLocation || null,
    customerId: customerId || null,
    items,
    timestamp,
  };

  // Apply updates
  for (const [path, data] of Object.entries(updates)) {
    await setFirebaseData(path, data);
  }

  return { success: true, issueId, timestamp };
}

/**
 * Reset to sample data (for testing)
 */
export function resetMockDatabase() {
  console.log('[MOCK] RESET: Resetting to sample data');
  mockDatabase = JSON.parse(JSON.stringify(DEFAULT_DATA));
  saveDatabase();
  Object.keys(listeners).forEach(path => notifyListeners(path));
}

/**
 * Clear all data from localStorage
 */
export function clearMockDatabase() {
  console.log('[MOCK] CLEAR: Clearing all data');
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('sorkroom_mock_db');
    }
  } catch (e) {
    console.warn('[MOCK] localStorage clear error:', e);
  }
  resetMockDatabase();
}

console.log('🎭 Mock Firebase with localStorage persistence loaded');
