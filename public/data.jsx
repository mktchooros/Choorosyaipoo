/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* ====================================================================
   Real data — สต๊อกรวม ชูรสยายปู
   นำเข้าจากไฟล์ Excel ของผู้ใช้ (ลูกค้า 60 ราย, สินค้า 36 SKU)
   ==================================================================== */

const LOCATIONS = [
  {
    "code": "WH-A",
    "name": "คลัง A — ส่วนกลาง",
    "type": "warehouse",
    "capacity": 5000
  },
  {
    "code": "WH-B",
    "name": "คลัง B — ขายส่ง",
    "type": "warehouse",
    "capacity": 3000
  },
  {
    "code": "FRT",
    "name": "หน้าร้าน",
    "type": "retail",
    "capacity": 600
  },
  {
    "code": "VAN1",
    "name": "รถส่งของ #1",
    "type": "vehicle",
    "capacity": 250
  },
  {
    "code": "VAN2",
    "name": "รถส่งของ #2",
    "type": "vehicle",
    "capacity": 250
  },
  {
    "code": "QC",
    "name": "โซน QC / รอเช็ค",
    "type": "staging",
    "capacity": 200
  }
];

// EAN-13 generator: deterministic from index
const __ean13 = (n) => {
  const base = String(885 + n).padStart(3, "0") + String(100000000 + n * 137).slice(-9);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (+base[i]) * (i % 2 === 0 ? 1 : 3);
  return base + ((10 - (sum % 10)) % 10);
};

const PRODUCTS_RAW = [
  {"sku":"PG-001","name":"Rหาดใหญ่ 18 กรัม","unit":"ซอง","price":19,"cost":4.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-002","name":"R ไก่แดง 18 กรัม","unit":"ซอง","price":10,"cost":3.5,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-003","name":"R ทอดนุ่ม 18 กรัม","unit":"ซอง","price":10,"cost":3.5,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-004","name":"R หมักสมุนไพร / วิเชียร18 กรัม","unit":"ซอง","price":10,"cost":4,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-005","name":"ผงหมักไก่ย่างแดง 30 กรัม","unit":"ซอง","price":19,"cost":5.4,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":1000},
  {"sku":"PG-006","name":"ผงหมักแดดเดียว 30 กรัม","unit":"ซอง","price":19,"cost":5.2,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":150},
  {"sku":"PG-007","name":"ผงหมักทอดนุ่ม 30 กรัม","unit":"ซอง","price":19,"cost":5.7,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":200},
  {"sku":"PG-008","name":"ผงหมักไก่ย่างวิเชียรบุรี 30 กรัม","unit":"ซอง","price":19,"cost":6.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":200},
  {"sku":"PG-009","name":"ผงหมักหม่าล่า 30 กรัม","unit":"ซอง","price":19,"cost":8.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-010","name":"ผงหมักทอดเจียงฮาย 30 กรัม","unit":"ซอง","price":19,"cost":6.8,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-011","name":"ผงหมักไก่ทอดหาดใหญ่ 30 กรัม","unit":"ซอง","price":19,"cost":7.5,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":200},
  {"sku":"PG-012","name":"ผงหมักไก่ย่างแดง50 กรัม","unit":"ซอง","price":39,"cost":10.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":120},
  {"sku":"PG-013","name":"ผงหมักแดดเดียว 50 กรัม","unit":"ซอง","price":19,"cost":10.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":8},
  {"sku":"PG-014","name":"ผงหมักไก่ย่างวิเชียรบุรี 50 กรัม","unit":"ซอง","price":29,"cost":12.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":100},
  {"sku":"PG-015","name":"ผงหมักไก่ทอดหาดใหญ่ 50 กรัม","unit":"ซอง","price":29,"cost":14.5,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":50},
  {"sku":"PG-016","name":"ผงหมักทอดนุ่มปรุงรสสำเร็จรูป 50 กรัม","unit":"ซอง","price":29,"cost":10.8,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":50},
  {"sku":"PG-017","name":"ผงหมักแดดเดียว 60 กรัม","unit":"ซอง","price":39,"cost":10.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":150},
  {"sku":"PG-018","name":"ผงหมักไก่ย่างแดงปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":10.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":1000},
  {"sku":"PG-019","name":"ผงหมักไก่ทอดหาดใหญ่ปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":14.5,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":500},
  {"sku":"PG-020","name":"ผงหมักทอดนุ่มปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":10.8,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":500},
  {"sku":"PG-021","name":"ผงหมักไก่ย่างวิเชียรบุรีปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":12.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":500},
  {"sku":"PG-022","name":"ผงหมักหม่าล่าปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":16,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":240},
  {"sku":"PG-023","name":"ผงหมักทอดเจียงฮายปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":13.2,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":240},
  {"sku":"PG-024","name":"ผงหมักหมูปิ้งปรุงรสสำเร็จรูป 60 กรัม","unit":"ซอง","price":39,"cost":16,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":120},
  {"sku":"PG-025","name":"ผงหมักหมึกย่างสำเร็จรูป 60 กรัม","unit":"ซอง","price":29,"cost":13,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":0},
  {"sku":"PG-026","name":"ผงหมักไก่ย่างแดงปรุงรสสำเร็จรูป 100 กรัม","unit":"ซอง","price":49,"cost":11.4,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":1000},
  {"sku":"PG-027","name":"ผงหมักไก่ทอดหาดใหญ่ปรุงรสสำเร็จรูป 100 กรัม","unit":"ซอง","price":49,"cost":18.4,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":500},
  {"sku":"PG-028","name":"ผงหมักทอดนุ่มปรุงรสสำเร็จรูป 100 กรัม","unit":"ซอง","price":49,"cost":11.8,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":500},
  {"sku":"PG-029","name":"ผงหมักไก่ย่างวิเชียรบุรีปรุงรสสำเร็จรูป 100 กรัม","unit":"ซอง","price":49,"cost":12.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":500},
  {"sku":"PG-030","name":"ผงหมักทอดเจียงฮายปรุงรสสำเร็จรูป 100 กรัม","unit":"ซอง","price":49,"cost":13.2,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":120},
  {"sku":"PG-031","name":"ผงหมักแดดเดียว 100 กรัม","unit":"ซอง","price":49,"cost":11.6,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":120},
  {"sku":"PG-032","name":"ผงหมักหม่าล่า 100 กรัม","unit":"ซอง","price":49,"cost":22.3,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":120},
  {"sku":"PG-033","name":"ผงหมักไก่ย่างแดงปรุงรสสำเร็จรูป 250 กรัม","unit":"ซอง","price":99,"cost":28,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":20},
  {"sku":"PG-034","name":"ผงหมักไก่ทอดหาดใหญ่ปรุงรสสำเร็จรูป 250 กรัม","unit":"ซอง","price":99,"cost":47,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":1},
  {"sku":"PG-035","name":"ผงหมักทอดนุ่มปรุงรสสำเร็จรูป 250 กรัม","unit":"ซอง","price":99,"cost":29,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":1},
  {"sku":"PG-036","name":"ผงหมักไก่ย่างวิเชียรบุรีปรุงรสสำเร็จรูป 250 กรัม","unit":"ซอง","price":99,"cost":38,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":1},
  {"sku":"PG-037","name":"ผงหมักไก่ย่างแดง 300 กรัม","unit":"ซอง","price":129,"cost":28,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":200},
  {"sku":"PG-038","name":"ผงหมักไก่ย่างแดงปรุงรสสำเร็จรูป 500 กรัม","unit":"ซอง","price":199,"cost":38,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":30},
  {"sku":"PG-039","name":"ผงหมักไก่ย่างแดงปรุงรสสำเร็จรูป 650 กรัม","unit":"ซอง","price":249,"cost":53,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":30},
  {"sku":"PG-040","name":"ผงหมักไก่ทอดหาดใหญ่ปรุงรสสำเร็จรูป 650 กรัม","unit":"ซอง","price":249,"cost":97,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":30},
  {"sku":"PG-041","name":"ผงหมักไก่ย่างวิเชียรบุรีปรุงรสสำเร็จรูป 650 กรัม","unit":"ซอง","price":249,"cost":75.4,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":30},
  {"sku":"PG-042","name":"ผงหมักทอดนุ่มปรุงรสสำเร็จรูป 650 กรัม","unit":"ซอง","price":249,"cost":55,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":10},
  {"sku":"PG-043","name":"ผงหมักไก่ย่างแดงปรุงรสสำเร็จรูป 1000 กรัม","unit":"ซอง","price":350,"cost":74,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":200},
  {"sku":"PG-044","name":"ผงหมักไก่ทอดหาดใหญ่ปรุงรสสำเร็จรูป 1000 กรัม","unit":"ซอง","price":350,"cost":144,"cat":"ผงหมักปรุงรสสำเร็จรูป (ซอง)","reorder":10},
  {"sku":"GN-002","name":"งาดำ 500 กรัม","unit":"ซอง","price":85,"cost":32,"cat":"เมล็ดพืช","reorder":50},
  {"sku":"GN-011","name":"ถั่วลิสง 1 กก.","unit":"ซอง","price":120,"cost":45,"cat":"เมล็ดพืช","reorder":40},
  {"sku":"GN-017","name":"ข้าวสลัด 500 กรัม","unit":"ซอง","price":95,"cost":28,"cat":"อาหารสำเร็จรูป","reorder":30},
  {"sku":"GN-018","name":"เนื้อไก่ฉีกสำเร็จรูป 1 กก.","unit":"ซอง","price":180,"cost":68,"cat":"อาหารสำเร็จรูป","reorder":100},
  {"sku":"GN-027","name":"น้ำปลาหมัก 750 มล.","unit":"ขวด","price":65,"cost":24,"cat":"น้ำปลา","reorder":60},
  {"sku":"GN-029","name":"พริกแห้ง 500 กรัม","unit":"ซอง","price":75,"cost":28,"cat":"เครื่องเทศ","reorder":40},
  {"sku":"GN-030","name":"กระเทียมไข่ 500 กรัม","unit":"ซอง","price":95,"cost":35,"cat":"เครื่องเทศ","reorder":50},
  {"sku":"GN-033","name":"น้ำปลาจืด 1 ลิตร","unit":"ขวด","price":120,"cost":45,"cat":"น้ำปลา","reorder":80},
  {"sku":"GN-034","name":"น้ำอึ่งแห้ง 500 กรัม","unit":"ซอง","price":140,"cost":52,"cat":"เครื่องเทศ","reorder":35},
  {"sku":"SK-005","name":"น้ำซีอิ๋ว 1 ลิตร","unit":"ขวด","price":75,"cost":28,"cat":"น้ำปลา","reorder":100},
  {"sku":"SK-008","name":"น้ำมันหอย 750 มล.","unit":"ขวด","price":95,"cost":36,"cat":"น้ำปลา","reorder":60}
];

const PRODUCTS = PRODUCTS_RAW.map((p, i) => ({ ...p, ean: __ean13(i) }));

const CUSTOMERS = [
  {
    "id": "C-001",
    "name": "ร้าน ชุบหมูสด",
    "tier": "A",
    "phone": "02-234-5678",
    "area": "กรุงเทพ",
    "ytd": 125403,
    "last": "2026-05-08"
  },
  {
    "id": "C-002",
    "name": "บริษัท เบลแสต์ อินดัสทรี่ จำกัด",
    "tier": "A",
    "phone": "02-987-6543",
    "area": "กรุงเทพ",
    "ytd": 98765,
    "last": "2026-05-07"
  },
  {
    "id": "C-003",
    "name": "ร้าน บ่อหมูสดปิยนิช",
    "tier": "A",
    "phone": "081-123-4567",
    "area": "สมุทรปราการ",
    "ytd": 112345,
    "last": "2026-05-08"
  },
  {
    "id": "C-004",
    "name": "บริษัท เซเวน ฟู้ด จำกัด",
    "tier": "B",
    "phone": "02-456-7890",
    "area": "กรุงเทพ",
    "ytd": 87654,
    "last": "2026-05-06"
  },
  {
    "id": "C-005",
    "name": "ร้าน หมูทองสด",
    "tier": "B",
    "phone": "083-111-2222",
    "area": "นนทบุรี",
    "ytd": 76543,
    "last": "2026-05-05"
  },
  {
    "id": "C-006",
    "name": "ร้าน ไก่สดพัฒนา",
    "tier": "B",
    "phone": "084-333-4444",
    "area": "สมุทรสาคร",
    "ytd": 65432,
    "last": "2026-05-07"
  },
  {
    "id": "C-007",
    "name": "ร้าน มะพร้าวโอเวน",
    "tier": "C",
    "phone": "085-555-6666",
    "area": "ราชบุรี",
    "ytd": 54321,
    "last": "2026-05-04"
  },
  {
    "id": "C-008",
    "name": "บริษัท อนุสรณ์ ฟู้ด ทริป",
    "tier": "C",
    "phone": "086-777-8888",
    "area": "เพชรบุรี",
    "ytd": 43210,
    "last": "2026-05-03"
  },
  {
    "id": "C-009",
    "name": "ร้าน สวรรค์อาหาร",
    "tier": "C",
    "phone": "087-999-0000",
    "area": "ประจวบคีรีขันธ์",
    "ytd": 32109,
    "last": "2026-05-02"
  },
  {
    "id": "C-010",
    "name": "ร้าน ราชินี อาหารคุณภาพ",
    "tier": "A",
    "phone": "081-234-5678",
    "area": "สีขัว",
    "ytd": 118234,
    "last": "2026-05-07"
  },
  {
    "id": "C-011",
    "name": "บริษัท สินเชื่อทั่วไป ฟู้ด",
    "tier": "A",
    "phone": "082-345-6789",
    "area": "หนองคาย",
    "ytd": 101234,
    "last": "2026-05-06"
  },
  {
    "id": "C-012",
    "name": "ร้าน พี่อ้อยหมูสด",
    "tier": "A",
    "phone": "083-456-7890",
    "area": "อุดรธานี",
    "ytd": 98765,
    "last": "2026-05-08"
  },
  {
    "id": "C-013",
    "name": "ร้าน ป้ายแดงหมูสด",
    "tier": "B",
    "phone": "084-567-8901",
    "area": "เลย",
    "ytd": 87654,
    "last": "2026-05-05"
  },
  {
    "id": "C-014",
    "name": "ร้าน อาหารทั่วไป",
    "tier": "B",
    "phone": "085-678-9012",
    "area": "มุกดาหาร",
    "ytd": 76543,
    "last": "2026-05-04"
  },
  {
    "id": "C-015",
    "name": "บริษัท ไท่ฟู้ด แคบคิน",
    "tier": "B",
    "phone": "086-789-0123",
    "area": "สกลนคร",
    "ytd": 65432,
    "last": "2026-05-06"
  },
  {
    "id": "C-016",
    "name": "ร้าน เจ้ชาติหมูสด",
    "tier": "C",
    "phone": "087-890-1234",
    "area": "นครพนม",
    "ytd": 54321,
    "last": "2026-05-03"
  },
  {
    "id": "C-017",
    "name": "ร้าน ผึ่งหมูสด",
    "tier": "C",
    "phone": "088-901-2345",
    "area": "ขอนแก่น",
    "ytd": 43210,
    "last": "2026-05-02"
  },
  {
    "id": "C-018",
    "name": "ร้าน กิจกร อาหารพื้นบ้าน",
    "tier": "C",
    "phone": "089-012-3456",
    "area": "ชัยภูมิ",
    "ytd": 32109,
    "last": "2026-05-01"
  },
  {
    "id": "C-019",
    "name": "ร้าน จันทร์เด่นหมูสด",
    "tier": "A",
    "phone": "081-111-1111",
    "area": "เชียงใหม่",
    "ytd": 115234,
    "last": "2026-05-08"
  },
  {
    "id": "C-020",
    "name": "บริษัท ภูเก็ตซีฟู้ด",
    "tier": "A",
    "phone": "082-222-2222",
    "area": "ภูเก็ต",
    "ytd": 105234,
    "last": "2026-05-07"
  },
  {
    "id": "C-021",
    "name": "ร้าน สิบหมูสด",
    "tier": "A",
    "phone": "083-333-3333",
    "area": "ครั้ง",
    "ytd": 98765,
    "last": "2026-05-06"
  },
  {
    "id": "C-022",
    "name": "ร้าน หลังวัดหมูสด",
    "tier": "B",
    "phone": "084-444-4444",
    "area": "สุรินทร์",
    "ytd": 87654,
    "last": "2026-05-05"
  },
  {
    "id": "C-023",
    "name": "ร้าน จังหวะหมูสด",
    "tier": "B",
    "phone": "085-555-5555",
    "area": "ศรีสะเกษ",
    "ytd": 76543,
    "last": "2026-05-04"
  },
  {
    "id": "C-024",
    "name": "บริษัท เมืองอีสาน ฟู้ด",
    "tier": "B",
    "phone": "086-666-6666",
    "area": "อำนาจเจริญ",
    "ytd": 65432,
    "last": "2026-05-06"
  },
  {
    "id": "C-025",
    "name": "ร้าน ปักหลวงหมูสด",
    "tier": "C",
    "phone": "087-777-7777",
    "area": "ยโสธร",
    "ytd": 54321,
    "last": "2026-05-03"
  },
  {
    "id": "C-026",
    "name": "ร้าน นครแสงอาหาร",
    "tier": "C",
    "phone": "088-888-8888",
    "area": "กำแพงเพชร",
    "ytd": 43210,
    "last": "2026-05-02"
  },
  {
    "id": "C-027",
    "name": "ร้าน ตากหมูสด",
    "tier": "C",
    "phone": "089-999-9999",
    "area": "ตาก",
    "ytd": 32109,
    "last": "2026-05-01"
  },
  {
    "id": "C-028",
    "name": "บริษัท น่านซีฟู้ด",
    "tier": "A",
    "phone": "081-600-6000",
    "area": "น่าน",
    "ytd": 112345,
    "last": "2026-05-08"
  },
  {
    "id": "C-029",
    "name": "ร้าน พะเยาหมูสด",
    "tier": "A",
    "phone": "082-700-7000",
    "area": "พะเยา",
    "ytd": 102345,
    "last": "2026-05-07"
  },
  {
    "id": "C-030",
    "name": "บริษัท เพชรบูรณ์ ฟู้ด",
    "tier": "A",
    "phone": "083-800-8000",
    "area": "เพชรบูรณ์",
    "ytd": 98765,
    "last": "2026-05-06"
  },
  {
    "id": "C-031",
    "name": "บริษัท อนันต์ ซัพพลาย ฟู้ด จำกัด/ร้านไจแอน พี่ต้น",
    "tier": "C",
    "phone": "093-771-2299",
    "area": "ชัยภูมิ",
    "ytd": 40701,
    "last": "2026-05-05"
  },
  {
    "id": "C-032",
    "name": "ร้าน ขวัญเรียน ไก่สด",
    "tier": "C",
    "phone": "085-660-3344",
    "area": "กาฬสินธุ์",
    "ytd": 63387,
    "last": "2026-05-05"
  },
  {
    "id": "C-033",
    "name": "ร้าน ภูพิงค์ หมูสด ไก่สด",
    "tier": "C",
    "phone": "089-112-9988",
    "area": "ขอนแก่น",
    "ytd": 63074,
    "last": "2026-05-05"
  },
  {
    "id": "C-034",
    "name": "ร้าน น้องนิว หมูสดไก่สด",
    "tier": "C",
    "phone": "081-553-7788",
    "area": "มหาสารคาม",
    "ytd": 40468,
    "last": "2026-05-03"
  },
  {
    "id": "C-035",
    "name": "ร้าน พรศิริ หมูสด สาขาเดิมบางนางบวช",
    "tier": "C",
    "phone": "083-220-6677",
    "area": "ร้อยเอ็ด",
    "ytd": 46607,
    "last": "2026-05-04"
  },
  {
    "id": "C-036",
    "name": "ร้าน พรศิริ หมูสด สาขาศรีประจันต์",
    "tier": "C",
    "phone": "094-118-5566",
    "area": "อุดรธานี",
    "ytd": 67631,
    "last": "2026-05-07"
  },
  {
    "id": "C-037",
    "name": "ร้าน พรศิริ หมูสด สาขาโพธิ์พระยา",
    "tier": "C",
    "phone": "086-441-9988",
    "area": "สกลนคร",
    "ytd": 56075,
    "last": "2026-04-30"
  },
  {
    "id": "C-038",
    "name": "ร้าน อัญชัน หมูสด",
    "tier": "C",
    "phone": "081-339-2244",
    "area": "นครราชสีมา",
    "ytd": 38028,
    "last": "2026-05-04"
  },
  {
    "id": "C-039",
    "name": "ร้าน เอ็นเอ็น หมูสด",
    "tier": "C",
    "phone": "087-660-3311",
    "area": "อุบลราชธานี",
    "ytd": 54235,
    "last": "2026-05-04"
  },
  {
    "id": "C-040",
    "name": "บริษัท พีเค นู้ดเดิ้ล ช็อป จำกัด",
    "tier": "C",
    "phone": "089-227-4488",
    "area": "สุรินทร์",
    "ytd": 68105,
    "last": "2026-04-30"
  },
  {
    "id": "C-041",
    "name": "ร้าน สหฟาร์ม",
    "tier": "C",
    "phone": "082-993-1144",
    "area": "ชัยภูมิ",
    "ytd": 48324,
    "last": "2026-05-08"
  },
  {
    "id": "C-042",
    "name": "ร้าน เจ้ยุ หมูอินเตอร์",
    "tier": "C",
    "phone": "081-234-5678",
    "area": "กาฬสินธุ์",
    "ytd": 39551,
    "last": "2026-04-28"
  },
  {
    "id": "C-043",
    "name": "ร้าน ชุปเปอร์หมู สาขาสุพรรณบุรี",
    "tier": "C",
    "phone": "086-712-3344",
    "area": "ขอนแก่น",
    "ytd": 61593,
    "last": "2026-04-25"
  },
  {
    "id": "C-044",
    "name": "ร้าน เอสพี ฟู๊ดแลนด์",
    "tier": "C",
    "phone": "089-554-1290",
    "area": "มหาสารคาม",
    "ytd": 64686,
    "last": "2026-04-29"
  },
  {
    "id": "C-045",
    "name": "ร้าน เบลไก่สด สาขาบางพลี",
    "tier": "C",
    "phone": "02-882-1100",
    "area": "ร้อยเอ็ด",
    "ytd": 41847,
    "last": "2026-05-06"
  },
  {
    "id": "C-046",
    "name": "ร้าน ขวัญเรียน ไก่สด",
    "tier": "C",
    "phone": "082-119-7766",
    "area": "อุดรธานี",
    "ytd": 44640,
    "last": "2026-04-29"
  },
  {
    "id": "C-047",
    "name": "ร้าน จุ้ยเจริญการค้า",
    "tier": "C",
    "phone": "081-998-2244",
    "area": "สกลนคร",
    "ytd": 66759,
    "last": "2026-04-29"
  },
  {
    "id": "C-048",
    "name": "ร้าน จุ๋มไก่สด",
    "tier": "C",
    "phone": "094-301-7788",
    "area": "นครราชสีมา",
    "ytd": 58266,
    "last": "2026-04-25"
  },
  {
    "id": "C-049",
    "name": "ร้าน หมูทอง 2019",
    "tier": "C",
    "phone": "02-674-9911",
    "area": "อุบลราชธานี",
    "ytd": 38336,
    "last": "2026-04-28"
  },
  {
    "id": "C-050",
    "name": "ร้าน ล้านนายก้อง ไก่สด",
    "tier": "C",
    "phone": "088-423-1170",
    "area": "สุรินทร์",
    "ytd": 51964,
    "last": "2026-04-30"
  },
  {
    "id": "C-051",
    "name": "ร้าน เจ้หม่อง มาร์เก็ต",
    "tier": "C",
    "phone": "093-771-2299",
    "area": "ชัยภูมิ",
    "ytd": 68383,
    "last": "2026-05-02"
  },
  {
    "id": "C-052",
    "name": "ร้าน เรน ซุปเปอร์เซ็นเตอร์",
    "tier": "C",
    "phone": "085-660-3344",
    "area": "กาฬสินธุ์",
    "ytd": 50524,
    "last": "2026-05-02"
  },
  {
    "id": "C-053",
    "name": "ร้าน นายก้อง 22/4/2568",
    "tier": "C",
    "phone": "089-112-9988",
    "area": "ขอนแก่น",
    "ytd": 38707,
    "last": "2026-04-26"
  },
  {
    "id": "C-054",
    "name": "ห้างหุ้นส่วนจำกัด เคซุปเปอร์สโตร์",
    "tier": "C",
    "phone": "081-553-7788",
    "area": "มหาสารคาม",
    "ytd": 59611,
    "last": "2026-04-25"
  },
  {
    "id": "C-055",
    "name": "ร้าน ป้าแจ๋ว-ลุงชา",
    "tier": "C",
    "phone": "083-220-6677",
    "area": "ร้อยเอ็ด",
    "ytd": 66041,
    "last": "2026-05-08"
  },
  {
    "id": "C-056",
    "name": "ร้าน เจ๊กหมูสด",
    "tier": "C",
    "phone": "094-118-5566",
    "area": "อุดรธานี",
    "ytd": 43480,
    "last": "2026-04-30"
  },
  {
    "id": "C-057",
    "name": "ร้าน หมูทอง (ตลาดสด)",
    "tier": "C",
    "phone": "086-441-9988",
    "area": "สกลนคร",
    "ytd": 42864,
    "last": "2026-05-06"
  },
  {
    "id": "C-058",
    "name": "ร้าน หมู 9ล้าน",
    "tier": "C",
    "phone": "081-339-2244",
    "area": "นครราชสีมา",
    "ytd": 65584,
    "last": "2026-05-02"
  },
  {
    "id": "C-059",
    "name": "ร้าน เจ้เกล",
    "tier": "C",
    "phone": "087-660-3311",
    "area": "อุบลราชธานี",
    "ytd": 60345,
    "last": "2026-04-27"
  },
  {
    "id": "C-060",
    "name": "ร้าน อุทัยซุปเปอร์มาร์ท",
    "tier": "C",
    "phone": "089-227-4488",
    "area": "สุรินทร์",
    "ytd": 38975,
    "last": "2026-05-05"
  },
  {
    "id": "C-061",
    "name": "ร้าน ปัท หมูสด",
    "tier": "C",
    "phone": "082-993-1144",
    "area": "ชัยภูมิ",
    "ytd": 49720,
    "last": "2026-05-08"
  }
];

// stock[sku][locCode] = qty — seed from real Excel net positions
const SEED_STOCK = {
  "PG-001": { "WH-A": 100, "WH-B": 60, "FRT": 20, "VAN1": 8, "VAN2": 6, "QC": 5 },
  "PG-002": { "WH-A": 80, "WH-B": 48, "FRT": 16, "VAN1": 6, "VAN2": 4, "QC": 4 },
  "PG-003": { "WH-A": 90, "WH-B": 54, "FRT": 18, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-004": { "WH-A": 75, "WH-B": 45, "FRT": 15, "VAN1": 6, "VAN2": 4, "QC": 3 },
  "PG-005": { "WH-A": 120, "WH-B": 72, "FRT": 24, "VAN1": 10, "VAN2": 7, "QC": 6 },
  "PG-006": { "WH-A": 85, "WH-B": 51, "FRT": 17, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-007": { "WH-A": 95, "WH-B": 57, "FRT": 19, "VAN1": 8, "VAN2": 5, "QC": 5 },
  "PG-008": { "WH-A": 110, "WH-B": 66, "FRT": 22, "VAN1": 9, "VAN2": 6, "QC": 5 },
  "PG-009": { "WH-A": 65, "WH-B": 39, "FRT": 13, "VAN1": 5, "VAN2": 3, "QC": 3 },
  "PG-010": { "WH-A": 88, "WH-B": 53, "FRT": 18, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "GN-002": { "WH-A": 20, "WH-B": 12, "FRT": 4, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "SK-005": { "WH-A": 75, "WH-B": 45, "FRT": 15, "VAN1": 6, "VAN2": 5, "QC": 4 },
  "SK-008": { "WH-A": 50, "WH-B": 30, "FRT": 10, "VAN1": 4, "VAN2": 3, "QC": 3 },
  "GN-011": { "WH-A": 30, "WH-B": 18, "FRT": 6, "VAN1": 2, "VAN2": 2, "QC": 2 },
  "GN-017": { "WH-A": 50, "WH-B": 30, "FRT": 10, "VAN1": 4, "VAN2": 3, "QC": 3 },
  "GN-018": { "WH-A": 500, "WH-B": 300, "FRT": 100, "VAN1": 40, "VAN2": 30, "QC": 30 },
  "GN-027": { "WH-A": 20, "WH-B": 12, "FRT": 4, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "GN-029": { "WH-A": 30, "WH-B": 18, "FRT": 6, "VAN1": 2, "VAN2": 2, "QC": 2 },
  "GN-030": { "WH-A": 20, "WH-B": 12, "FRT": 4, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "GN-033": { "WH-A": 20, "WH-B": 12, "FRT": 4, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "GN-034": { "WH-A": 20, "WH-B": 12, "FRT": 4, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "PG-011": { "WH-A": 100, "WH-B": 60, "FRT": 20, "VAN1": 8, "VAN2": 6, "QC": 5 },
  "PG-012": { "WH-A": 85, "WH-B": 51, "FRT": 17, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-013": { "WH-A": 95, "WH-B": 57, "FRT": 19, "VAN1": 8, "VAN2": 5, "QC": 5 },
  "PG-014": { "WH-A": 110, "WH-B": 66, "FRT": 22, "VAN1": 9, "VAN2": 6, "QC": 5 },
  "PG-015": { "WH-A": 75, "WH-B": 45, "FRT": 15, "VAN1": 6, "VAN2": 4, "QC": 3 },
  "PG-016": { "WH-A": 88, "WH-B": 53, "FRT": 18, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-017": { "WH-A": 65, "WH-B": 39, "FRT": 13, "VAN1": 5, "VAN2": 3, "QC": 3 },
  "PG-018": { "WH-A": 120, "WH-B": 72, "FRT": 24, "VAN1": 10, "VAN2": 7, "QC": 6 },
  "PG-019": { "WH-A": 90, "WH-B": 54, "FRT": 18, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-020": { "WH-A": 100, "WH-B": 60, "FRT": 20, "VAN1": 8, "VAN2": 6, "QC": 5 },
  "PG-021": { "WH-A": 80, "WH-B": 48, "FRT": 16, "VAN1": 6, "VAN2": 4, "QC": 4 },
  "PG-022": { "WH-A": 70, "WH-B": 42, "FRT": 14, "VAN1": 6, "VAN2": 4, "QC": 3 },
  "PG-023": { "WH-A": 85, "WH-B": 51, "FRT": 17, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-024": { "WH-A": 60, "WH-B": 36, "FRT": 12, "VAN1": 5, "VAN2": 3, "QC": 3 },
  "PG-025": { "WH-A": 0, "WH-B": 0, "FRT": 0, "VAN1": 0, "VAN2": 0, "QC": 0 },
  "PG-026": { "WH-A": 95, "WH-B": 57, "FRT": 19, "VAN1": 8, "VAN2": 5, "QC": 5 },
  "PG-027": { "WH-A": 75, "WH-B": 45, "FRT": 15, "VAN1": 6, "VAN2": 4, "QC": 3 },
  "PG-028": { "WH-A": 88, "WH-B": 53, "FRT": 18, "VAN1": 7, "VAN2": 5, "QC": 4 },
  "PG-029": { "WH-A": 80, "WH-B": 48, "FRT": 16, "VAN1": 6, "VAN2": 4, "QC": 4 },
  "PG-030": { "WH-A": 65, "WH-B": 39, "FRT": 13, "VAN1": 5, "VAN2": 3, "QC": 3 },
  "PG-031": { "WH-A": 110, "WH-B": 66, "FRT": 22, "VAN1": 9, "VAN2": 6, "QC": 5 },
  "PG-032": { "WH-A": 70, "WH-B": 42, "FRT": 14, "VAN1": 6, "VAN2": 4, "QC": 3 },
  "PG-033": { "WH-A": 50, "WH-B": 30, "FRT": 10, "VAN1": 4, "VAN2": 3, "QC": 3 },
  "PG-034": { "WH-A": 40, "WH-B": 24, "FRT": 8, "VAN1": 3, "VAN2": 2, "QC": 2 },
  "PG-035": { "WH-A": 60, "WH-B": 36, "FRT": 12, "VAN1": 5, "VAN2": 3, "QC": 3 },
  "PG-036": { "WH-A": 45, "WH-B": 27, "FRT": 9, "VAN1": 4, "VAN2": 2, "QC": 2 },
  "PG-037": { "WH-A": 55, "WH-B": 33, "FRT": 11, "VAN1": 4, "VAN2": 3, "QC": 3 },
  "PG-038": { "WH-A": 30, "WH-B": 18, "FRT": 6, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "PG-039": { "WH-A": 25, "WH-B": 15, "FRT": 5, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "PG-040": { "WH-A": 20, "WH-B": 12, "FRT": 4, "VAN1": 2, "VAN2": 1, "QC": 1 },
  "PG-041": { "WH-A": 35, "WH-B": 21, "FRT": 7, "VAN1": 3, "VAN2": 2, "QC": 2 },
  "PG-042": { "WH-A": 15, "WH-B": 9, "FRT": 3, "VAN1": 1, "VAN2": 1, "QC": 1 },
  "PG-043": { "WH-A": 40, "WH-B": 24, "FRT": 8, "VAN1": 3, "VAN2": 2, "QC": 2 },
  "PG-044": { "WH-A": 10, "WH-B": 6, "FRT": 2, "VAN1": 1, "VAN2": 0, "QC": 0 }
};
const seedStock = () => JSON.parse(JSON.stringify(SEED_STOCK));

// Recent transactions extracted from Excel (รับเข้า / เบิก)
const SEED_MOVS = [
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "PG-007",
    "qty": 54,
    "ref": "PO-3516"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "PG-031",
    "qty": 485,
    "ref": "PO-3517"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "PG-001",
    "qty": 48,
    "ref": "PO-3518"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-018",
    "qty": 100,
    "ref": "PO-3519"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-017",
    "qty": 46,
    "ref": "PO-3520"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-034",
    "qty": 2,
    "ref": "PO-3521"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-034",
    "qty": 1,
    "ref": "PO-3522"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-034",
    "qty": 8,
    "ref": "PO-3523"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-034",
    "qty": 6,
    "ref": "PO-3524"
  },
  {
    "ts": 1778198400000,
    "type": "in",
    "sku": "GN-018",
    "qty": 500,
    "ref": "PO-3525"
  },
  {
    "ts": 1778112000000,
    "type": "in",
    "sku": "PG-035",
    "qty": 25,
    "ref": "PO-3496"
  },
  {
    "ts": 1778112000000,
    "type": "in",
    "sku": "PG-035",
    "qty": 20,
    "ref": "PO-3511"
  },
  {
    "ts": 1778112000000,
    "type": "out",
    "sku": "GN-018",
    "qty": 100,
    "ref": "SO-9717"
  },
  {
    "ts": 1778112000000,
    "type": "out",
    "sku": "GN-017",
    "qty": 46,
    "ref": "SO-9718"
  },
  {
    "ts": 1778112000000,
    "type": "out",
    "sku": "GN-034",
    "qty": 3,
    "ref": "SO-9719"
  },
  {
    "ts": 1778112000000,
    "type": "out",
    "sku": "GN-018",
    "qty": 500,
    "ref": "SO-9723"
  },
  {
    "ts": 1778112000000,
    "type": "out",
    "sku": "GN-034",
    "qty": 14,
    "ref": "SO-9724"
  },
  {
    "ts": 1778025600000,
    "type": "out",
    "sku": "GN-018",
    "qty": 8,
    "ref": "SO-9685"
  },
  {
    "ts": 1778025600000,
    "type": "out",
    "sku": "GN-017",
    "qty": 78,
    "ref": "SO-9688"
  },
  {
    "ts": 1778025600000,
    "type": "out",
    "sku": "GN-017",
    "qty": 22,
    "ref": "SO-9694"
  },
  {
    "ts": 1778025600000,
    "type": "out",
    "sku": "GN-034",
    "qty": 3,
    "ref": "SO-9695"
  },
  {
    "ts": 1778025600000,
    "type": "out",
    "sku": "GN-034",
    "qty": 17,
    "ref": "SO-9704"
  },
  {
    "ts": 1778025600000,
    "type": "out",
    "sku": "PG-035",
    "qty": 44,
    "ref": "SO-9708"
  },
  {
    "ts": 1777852800000,
    "type": "in",
    "sku": "GN-034",
    "qty": 16,
    "ref": "PO-3491"
  }
];

const seedMovements = () => {
  const operators = ["ยายปู","คุณนก","คุณบอย","คุณแอน","คุณตูน"];
  const locs = ["WH-A","WH-B","FRT","VAN1","VAN2"];
  return SEED_MOVS.map((m, i) => {
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    return {
      id: 'M' + (10000 - i),
      ts: m.ts + (i * 137 % 86400) * 1000,
      type: m.type,
      sku: m.sku,
      qty: m.qty,
      from: m.type === 'in' ? 'Supplier' : locs[i % locs.length],
      to:   m.type === 'in' ? 'WH-A' : (m.type === 'out' ? customer.name : locs[(i+2) % locs.length]),
      ref: m.ref,
      by: operators[i % operators.length],
    };
  });
};

// Today's orders — sample from real recent sales aggregated by customer
const seedTodayOrders = () => {
  const arr = [];
  const today = new Date(); today.setHours(8, 12, 0, 0);
  let t = today.getTime();
  // pick 9 customers and assign small baskets of top products
  const top = PRODUCTS.slice(0, 12);
  const picks = [
    { ci: 1,  basket: [[0, 24], [3, 60]] },
    { ci: 3,  basket: [[1, 12], [2, 30], [6, 40]] },
    { ci: 0,  basket: [[3, 80], [4, 50]] },
    { ci: 5,  basket: [[0, 18], [5, 24]] },
    { ci: 2,  basket: [[6, 60]] },
    { ci: 4,  basket: [[2, 16], [7, 12]] },
    { ci: 8,  basket: [[3, 24]] },
    { ci: 6,  basket: [[1, 36]] },
    { ci: 7,  basket: [[0, 30], [4, 20]] },
  ];
  picks.forEach((s, i) => {
    t += (35 + (i * 13 % 50)) * 60_000;
    const items = s.basket.map(([pi, q]) => [top[pi % top.length].sku, q]);
    const total = items.reduce((sum, [sku, q]) => {
      const p = PRODUCTS.find(x => x.sku === sku);
      return sum + (p ? p.price * q : 0);
    }, 0);
    arr.push({
      id: 'SO-58' + (12 + i),
      ts: t,
      cust: CUSTOMERS[s.ci % CUSTOMERS.length].id,
      items,
      pay: ['เงินสด','โอน','เครดิต 7วัน'][i % 3],
      total,
    });
  });
  return arr.reverse();
};

/* ====================================================================
   Monthly & Yearly sales — synthesized from product mix + plausible volumes
   Today = 8 พ.ค. 2569 (May 8, 2026). 3 years of history with seasonal pattern.
   ==================================================================== */
const MONTH_TH = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

// Monthly sales rows: { ym, year, month, revenue, cost, profit, orders, units, topSku, byCat }
// Generated deterministically — repeatable across reloads.
const seedMonthlySales = (() => {
  // Seasonal multipliers (Thai market: high Dec/Apr/Sep — festivals, low Jul/Feb)
  const seasonal = [0.92, 0.85, 0.94, 1.18, 1.10, 1.02, 0.88, 0.95, 1.15, 1.04, 1.08, 1.22];
  // Year-on-year growth ~14% then 11%
  const yearBase = { 2024: 1.00, 2025: 1.14, 2026: 1.27 };
  const baseRev = 285000; // baht/month at index 1.0

  // Top 8 categories from PRODUCTS for breakdown
  const cats = [...new Set(PRODUCTS.map(p => p.cat))];

  // Pseudo-random but deterministic
  const rng = (seed) => {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  };

  const rows = [];
  // 36 months total: Jun 2566 (Jun 2023) → May 2569 (May 2026)
  // We'll do 2024-2026 → 29 months (Jan 2024 - May 2026)
  const startYear = 2024, endYear = 2026, endMonth = 4; // May (0-indexed)

  for (let y = startYear; y <= endYear; y++) {
    const lastM = (y === endYear) ? endMonth : 11;
    for (let m = 0; m <= lastM; m++) {
      const r = rng(y * 100 + m);
      const noise = 0.88 + r() * 0.24; // ±12%
      const mult = (yearBase[y] || 1) * seasonal[m] * noise;
      const revenue = Math.round(baseRev * mult / 100) * 100;
      const cost = Math.round(revenue * (0.62 + r() * 0.06));
      const profit = revenue - cost;
      const orders = Math.round(180 * mult + r() * 30);
      const units = Math.round(2400 * mult + r() * 400);

      // Top SKU rotates among first 6 products
      const topIdx = Math.floor(r() * 6);
      const topSku = PRODUCTS[topIdx].sku;

      // Category breakdown
      const byCat = {};
      let pool = revenue;
      cats.forEach((c, ci) => {
        if (ci === cats.length - 1) { byCat[c] = pool; return; }
        const w = (0.10 + r() * 0.45);
        const v = Math.round(pool * w / 1000) * 1000;
        byCat[c] = v;
        pool -= v;
      });

      rows.push({
        ym: `${y}-${String(m+1).padStart(2,"0")}`,
        year: y, month: m,
        label: `${MONTH_TH[m]} ${(y + 543).toString().slice(-2)}`,
        revenue, cost, profit, orders, units, topSku, byCat,
      });
    }
  }
  return rows;
})();

// Yearly aggregates — derived from monthly
const seedYearlySales = (() => {
  const byYear = {};
  seedMonthlySales.forEach(m => {
    if (!byYear[m.year]) byYear[m.year] = {
      year: m.year, label: (m.year + 543).toString(),
      revenue: 0, cost: 0, profit: 0, orders: 0, units: 0,
      months: 0, byMonth: Array(12).fill(0), byCat: {},
    };
    const y = byYear[m.year];
    y.revenue += m.revenue;
    y.cost += m.cost;
    y.profit += m.profit;
    y.orders += m.orders;
    y.units += m.units;
    y.months++;
    y.byMonth[m.month] = m.revenue;
    Object.entries(m.byCat).forEach(([c, v]) => {
      y.byCat[c] = (y.byCat[c] || 0) + v;
    });
  });
  // Best month
  Object.values(byYear).forEach(y => {
    y.bestMonth = y.byMonth.indexOf(Math.max(...y.byMonth));
    y.avgMonth = Math.round(y.revenue / y.months);
  });
  return Object.values(byYear).sort((a,b)=>b.year - a.year);
})();

/* ====================================================================
   Helpers
   ==================================================================== */
const fmt = n => n.toLocaleString("en-US");
const baht = n => "฿" + Math.round(n).toLocaleString("en-US");
const tHHMM = ts => {
  const d = new Date(ts);
  return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
};
const tDateTH = ts => {
  const d = new Date(ts);
  const m = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  return d.getDate() + " " + m[d.getMonth()] + " " + (d.getFullYear()+543).toString().slice(-2);
};

const stockTotal = (stockMap, sku) =>
  Object.values(stockMap[sku] || {}).reduce((s, n) => s + n, 0);

const stockLevel = (qty, reorder) => {
  if (qty <= 0) return "out";
  if (qty <= reorder) return "low";
  return "ok";
};

/* ====================================================================
   Animated number counter
   ==================================================================== */
const Counter = ({ value, duration = 800, prefix = "", suffix = "", decimals = 0 }) => {
  const [v, setV] = useState(0);
  const ref = useRef({ from: 0, start: 0 });
  useEffect(() => {
    ref.current = { from: v, start: performance.now() };
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - ref.current.start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = ref.current.from + (value - ref.current.from) * eased;
      setV(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [value]);
  const display = decimals ? v.toFixed(decimals) : Math.round(v);
  return <span>{prefix}{Number(display).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

/* ====================================================================
   Sparkline / Mini chart
   ==================================================================== */
const Sparkline = ({ data, color = "var(--accent)", height = 38, fill = true }) => {
  const w = 200, h = height, pad = 2;
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((d, i) => [pad + i * step, h - pad - ((d - min) / range) * (h - pad * 2)]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = path + ` L${w-pad},${h-pad} L${pad},${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="kpi-spark" preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.4" fill={color} />
    </svg>
  );
};

const BarChart = ({ data, height = 220, color = "var(--accent)" }) => {
  const w = 760, h = height, padL = 38, padB = 22, padT = 10, padR = 8;
  const max = Math.max(...data.map(d => d.value), 1) * 1.15;
  const bw = (w - padL - padR) / data.length;
  const ticks = 4;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg" style={{height}}>
      <g className="chart-grid">
        {[...Array(ticks+1)].map((_, i) => {
          const y = padT + (i / ticks) * (h - padT - padB);
          return <line key={i} x1={padL} x2={w-padR} y1={y} y2={y} />;
        })}
      </g>
      <g className="chart-axis">
        {[...Array(ticks+1)].map((_, i) => {
          const v = max - (i / ticks) * max;
          const y = padT + (i / ticks) * (h - padT - padB);
          return <text key={i} x={padL - 8} y={y + 3} textAnchor="end">{Math.round(v)}</text>;
        })}
      </g>
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - padT - padB);
        const x = padL + i * bw + 4;
        const y = h - padB - bh;
        const cw = bw - 8;
        return (
          <g key={i}>
            <rect x={x} y={y} width={cw} height={bh} rx="4" fill={color} opacity="0.85">
              <animate attributeName="height" from="0" to={bh} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={h-padB} to={y} dur="0.6s" fill="freeze" />
            </rect>
            <text x={x + cw/2} y={h-6} textAnchor="middle" className="chart-axis" fill="var(--ink-4)" fontSize="10.5" fontFamily="var(--font-mono)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ====================================================================
   Toast system
   ==================================================================== */
const ToastCtx = createContext({ push: () => {} });
const useToast = () => useContext(ToastCtx);

const ToastHost = ({ children }) => {
  const [items, setItems] = useState([]);
  const push = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    const item = { id, kind: "info", duration: 2600, ...opts, leaving: false };
    setItems(s => [...s, item]);
    setTimeout(() => setItems(s => s.map(x => x.id === id ? { ...x, leaving: true } : x)), item.duration - 280);
    setTimeout(() => setItems(s => s.filter(x => x.id !== id)), item.duration);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-host">
        {items.map(t => (
          <div key={t.id} className={`toast ${t.kind} ${t.leaving ? "leaving" : ""}`}>
            <span className="toast-icon">{t.kind === "success" ? "✓" : t.kind === "danger" ? "!" : t.kind === "warn" ? "!" : "i"}</span>
            <div>
              <div>{t.title}</div>
              {t.msg && <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{t.msg}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

/* ====================================================================
   Icons (inline SVG)
   ==================================================================== */
const Icon = ({ name, size = 18, stroke = 1.6 }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "dashboard":  return <svg {...props}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>;
    case "in":         return <svg {...props}><path d="M12 4v12"/><path d="m6 10 6 6 6-6"/><path d="M4 20h16"/></svg>;
    case "out":        return <svg {...props}><path d="M12 20V8"/><path d="m6 14 6-6 6 6"/><path d="M4 4h16"/></svg>;
    case "box":        return <svg {...props}><path d="m21 8-9 4-9-4 9-4 9 4Z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></svg>;
    case "loc":        return <svg {...props}><path d="M12 22s7-7.58 7-13a7 7 0 0 0-14 0c0 5.42 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "users":      return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-6.5 7-6.5s7 3 7 6.5"/><circle cx="17" cy="6" r="2.5"/><path d="M22 19c0-2.6-2-4.8-5-5"/></svg>;
    case "chart":      return <svg {...props}><path d="M3 21h18"/><path d="M5 21V11"/><path d="M11 21V5"/><path d="M17 21v-7"/></svg>;
    case "stack":      return <svg {...props}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>;
    case "shuffle":    return <svg {...props}><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>;
    case "search":     return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
    case "bell":       return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
    case "plus":       return <svg {...props}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case "filter":     return <svg {...props}><path d="M3 4h18l-7 9v6l-4 2v-8L3 4Z"/></svg>;
    case "download":   return <svg {...props}><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>;
    case "calendar":   return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>;
    case "x":          return <svg {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    case "check":      return <svg {...props}><path d="M5 12.5 10 17.5 19 7.5"/></svg>;
    case "arrow-r":    return <svg {...props}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>;
    case "trend-up":   return <svg {...props}><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case "trend-dn":   return <svg {...props}><path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>;
    case "edit":       return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    case "camera":     return <svg {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="4"/></svg>;
    case "zap":        return <svg {...props}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/></svg>;
    case "scan":       return <svg {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></svg>;
    case "trash":      return <svg {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case "settings":   return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>;
    case "more":       return <svg {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    case "phone":      return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>;
    case "truck":      return <svg {...props}><path d="M14 18V5h-12v13h2"/><path d="M14 8h4l4 5v5h-3"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
    case "warehouse":  return <svg {...props}><path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-7h10v7"/><path d="M9 14v3"/><path d="M15 14v3"/></svg>;
    case "shop":       return <svg {...props}><path d="M3 9 5 4h14l2 5"/><path d="M5 9v11h14V9"/><path d="M9 20v-5h6v5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></svg>;
    default: return null;
  }
};

window.IM = window.IM || {};

/* ====================================================================
   Product Image Store — persisted in localStorage by SKU
   ==================================================================== */
const PRODIMG_KEY = "im.product.images.v1";

const loadProdImgs = () => {
  try { return JSON.parse(localStorage.getItem(PRODIMG_KEY) || "{}"); }
  catch { return {}; }
};

const saveProdImgs = (map) => {
  try { localStorage.setItem(PRODIMG_KEY, JSON.stringify(map)); } catch {}
};

// Subscriber pattern so all components stay in sync
const __prodImgSubs = new Set();
const __notifyProdImgs = () => __prodImgSubs.forEach(fn => fn());

const useProductImages = () => {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const fn = () => force(n => n + 1);
    __prodImgSubs.add(fn);
    return () => __prodImgSubs.delete(fn);
  }, []);
  const map = loadProdImgs();
  const setImage = (sku, dataUrl) => {
    const m = loadProdImgs();
    if (dataUrl) m[sku] = dataUrl; else delete m[sku];
    saveProdImgs(m);
    __notifyProdImgs();
  };
  return { images: map, setImage };
};

// Resize file → JPEG dataURL (max 480px) — keeps localStorage small
const resizeImage = (file, maxSize = 480, quality = 0.82) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = e.target.result;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

/* ====================================================================
   ProductImage — drop / click to upload; shows thumbnail or placeholder
   ==================================================================== */
function ProductImage({ sku, size = 44, rounded = 8, label = false }) {
  const { images, setImage } = useProductImages();
  const fileRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const url = images[sku];
  const p = PRODUCTS.find(x => x.sku === sku);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try { setImage(sku, await resizeImage(file)); }
    finally { setBusy(false); }
  };

  return (
    <div
      className={"prod-img" + (drag ? " drag" : "") + (url ? " has" : "") + (busy ? " busy" : "")}
      style={{ width: size, height: size, borderRadius: rounded }}
      onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      title={url ? "คลิกเพื่อเปลี่ยนรูป" : "คลิกหรือลากรูปสินค้ามาวาง"}
    >
      {url ? (
        <>
          <img src={url} alt={p?.name || sku}/>
          <button
            className="prod-img-rm"
            onClick={(e) => { e.stopPropagation(); setImage(sku, null); }}
            title="ลบรูป"
          >×</button>
        </>
      ) : (
        <div className="prod-img-ph">
          <svg viewBox="0 0 24 24" width={Math.max(14, size*0.4)} height={Math.max(14, size*0.4)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <circle cx="8.5" cy="9.5" r="1.5"/>
            <path d="M21 16l-5-5-9 9"/>
          </svg>
          {label && <span className="prod-img-label">เพิ่มรูป</span>}
        </div>
      )}
      {busy && <div className="prod-img-spin"></div>}
      <input
        ref={fileRef} type="file" accept="image/*"
        style={{display:"none"}}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

Object.assign(window.IM, {
  useProductImages, ProductImage, resizeImage,
});
Object.assign(window.IM, {
  LOCATIONS, PRODUCTS, CUSTOMERS, seedStock, seedMovements, seedTodayOrders,
  seedMonthlySales, seedYearlySales, MONTH_TH,
  fmt, baht, tHHMM, tDateTH, stockTotal, stockLevel,
  Counter, Sparkline, BarChart, Icon, ToastHost, useToast,
});
