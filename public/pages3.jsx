/* global React */
const { useState, useMemo } = React;
const {
  LOCATIONS, PRODUCTS, CUSTOMERS,
  fmt, baht, tHHMM, tDateTH, stockTotal, stockLevel,
  Counter, Sparkline, BarChart, Icon,
} = window.IM;

/* ====================================================================
   Customers (รายชื่อลูกค้า)
   ==================================================================== */
function PageCustomers({ customers = [], setCustomers = () => {} }) {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("ทั้งหมด");
  const [sel, setSel] = useState((customers[1] || {}).id || "");
  const [addOpen, setAddOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: "", phone: "", tier: "ปลีก", area: "กรุงเทพ" });

  const filtered = customers.filter(c => {
    if (tier !== "ทั้งหมด" && c.tier !== tier) return false;
    if (q && !(c.name.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const cur = customers.find(c => c.id === sel);

  const addCustomer = () => {
    if (!newCust.name || !newCust.phone) { alert("กรุณากรอกชื่อและโทรศัพท์"); return; }
    const id = "C-" + String(customers.length + 1).padStart(3, "0");
    const c = { id, ...newCust, ytd: 0, last: "ใหม่" };
    setCustomers([...customers, c]);
    setSel(id);
    setAddOpen(false);
    setNewCust({ name: "", phone: "", tier: "ปลีก", area: "กรุงเทพ" });
  };

  const tierColor = (t) => t === "VIP" ? "accent" : t === "ขายส่ง" ? "info" : "";

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายชื่อลูกค้า</h1>
          <div className="page-sub">ลูกค้าทั้งหมด {customers.length} ราย · ยอดสะสมปีนี้ {baht(customers.reduce((s,c)=>s+c.ytd,0))}</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={15}/>ส่งออก</button>
          <button className="btn btn-accent" onClick={() => setAddOpen(true)}><Icon name="plus" size={15}/>เพิ่มลูกค้า</button>
        </div>
        {addOpen && (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
            <div className="card" style={{width:"90%", maxWidth:400, padding:20}}>
              <h2 style={{marginBottom:16}}>เพิ่มลูกค้าใหม่</h2>
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ชื่อลูกค้า</label>
                  <input className="input" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} placeholder="ชื่อร้าน"/>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>โทรศัพท์</label>
                  <input className="input" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} placeholder="08X-XXX-XXXX"/>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ระดับ</label>
                  <select className="input" value={newCust.tier} onChange={e => setNewCust({...newCust, tier: e.target.value})}>
                    <option>ปลีก</option>
                    <option>ขายส่ง</option>
                    <option>VIP</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>พื้นที่</label>
                  <input className="input" value={newCust.area} onChange={e => setNewCust({...newCust, area: e.target.value})} placeholder="จังหวัด"/>
                </div>
                <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:16}}>
                  <button className="btn" onClick={() => {setAddOpen(false); setNewCust({name:"",phone:"",tier:"ปลีก",area:"กรุงเทพ"});}}>ยกเลิก</button>
                  <button className="btn btn-accent" onClick={addCustomer}>บันทึก</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head" style={{flexDirection:"column", alignItems:"stretch", gap:12}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div className="card-title">ลูกค้าทั้งหมด</div>
              <div className="seg">
                {["ทั้งหมด","VIP","ขายส่ง","ปลีก"].map(t => (
                  <button key={t} className={tier===t?"on":""} onClick={()=>setTier(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="input-prefix">
              <span className="prefix-icon"><Icon name="search" size={15}/></span>
              <input className="input" placeholder="ค้นหาชื่อร้าน หรือเบอร์โทร..." value={q} onChange={e=>setQ(e.target.value)}/>
            </div>
          </div>
          <table className="table">
            <thead><tr>
              <th>รหัส</th><th>ชื่อ</th><th>โซน</th><th>ระดับ</th><th className="num">ยอด YTD</th><th>ครั้งล่าสุด</th>
            </tr></thead>
            <tbody className="stagger">
              {filtered.length > 0 ? filtered.map(c => (
                <tr key={c.id} onClick={()=>setSel(c.id)} style={{cursor:"pointer", background: sel===c.id ? "var(--surface)" : ""}}>
                  <td className="cell-mono muted">{c.id}</td>
                  <td>
                    <div style={{display:"flex", alignItems:"center", gap:10}}>
                      <div className="user-avatar" style={{width:30, height:30, fontSize:11}}>{c.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                      <div>
                        <div className="cell-pri">{c.name}</div>
                        <div style={{fontSize:11.5, color:"var(--ink-3)", fontFamily:"var(--font-mono)"}}>{c.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{c.area}</td>
                  <td><span className={`chip ${tierColor(c.tier)}`}>{c.tier}</span></td>
                  <td className="num cell-pri" style={{fontFamily:"var(--font-mono)"}}>{baht(c.ytd)}</td>
                  <td className="muted cell-mono" style={{fontSize:12}}>{c.last}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{textAlign:"center", color:"var(--ink-3)", padding:16}}>ไม่พบลูกค้า</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card">
            <div className="card-pad">
              <div style={{display:"flex", alignItems:"center", gap:14, marginBottom:14}}>
                <div className="user-avatar" style={{width:56, height:56, fontSize:18}}>{cur.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                <div>
                  <div style={{fontSize:11, fontFamily:"var(--font-mono)", color:"var(--ink-3)"}}>{cur.id}</div>
                  <div style={{fontSize:18, fontWeight:600}}>{cur.name}</div>
                  <div style={{display:"flex", gap:6, marginTop:4}}>
                    <span className={`chip ${tierColor(cur.tier)}`}>{cur.tier}</span>
                    <span className="chip">{cur.area}</span>
                  </div>
                </div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:8, fontSize:13}}>
                <div style={{display:"flex", justifyContent:"space-between", color:"var(--ink-3)"}}>
                  <span>โทรศัพท์</span>
                  <span style={{color:"var(--ink)", fontFamily:"var(--font-mono)"}}>{cur.phone}</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", color:"var(--ink-3)"}}>
                  <span>เครดิต</span>
                  <span style={{color:"var(--ink)"}}>{cur.tier === "VIP" ? "30 วัน" : cur.tier === "ขายส่ง" ? "7 วัน" : "เงินสด"}</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", color:"var(--ink-3)"}}>
                  <span>ครั้งล่าสุด</span>
                  <span style={{color:"var(--ink)", fontFamily:"var(--font-mono)"}}>{cur.last}</span>
                </div>
              </div>
              <div style={{display:"flex", gap:8, marginTop:14}}>
                <button className="btn" style={{flex:1}}><Icon name="phone" size={14}/>โทร</button>
                <button className="btn btn-accent" style={{flex:1}}><Icon name="out" size={14}/>เปิดบิล</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-pad">
              <div className="card-title" style={{fontSize:13, marginBottom:10}}>ยอดซื้อ 6 เดือนล่าสุด</div>
              <BarChart
                data={["ธ.ค.","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค."].map((m, i) => ({
                  label: m,
                  value: Math.round(cur.ytd / 6 * (0.6 + Math.random() * 0.8) / 1000),
                }))}
                height={140}
                color="var(--accent)"
              />
              <div style={{textAlign:"center", fontSize:11, color:"var(--ink-3)", marginTop:6}}>(พันบาท)</div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">สินค้าที่ซื้อบ่อย</div>
            </div>
            <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:10}}>
              {PRODUCTS.slice(0, 4).map((p, i) => {
                const pct = [85, 62, 41, 28][i];
                return (
                  <div key={p.sku}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13}}>
                      <span>{p.name}</span>
                      <span className="cell-mono muted">{Math.round(pct * 1.2)}×</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{width: pct + "%", transitionDelay: (i*0.08)+"s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   Daily Sales Report (รายงานขาย-วัน)
   ==================================================================== */
function PageSales({ orders }) {
  const [daysAgo, setDaysAgo] = useState(0); // 0 = today, 1 = yesterday, etc.
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const selectedDate = new Date(today);
  selectedDate.setDate(selectedDate.getDate() - daysAgo);

  const dateStr = () => {
    if (daysAgo === 0) return "วันนี้";
    if (daysAgo === 1) return "เมื่อวาน";
    return selectedDate.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
  };

  // Generate mock historical data based on today's orders
  const getOrdersForDate = (daysOffset) => {
    const seed = Date.now() - (daysOffset * 86400000);
    const pseudoRandom = (i) => {
      const x = Math.sin(seed / 1000 + i) * 10000;
      return x - Math.floor(x);
    };

    if (daysOffset === 0) {
      return orders; // Return actual today's orders
    }

    // Generate realistic mock data for past dates
    const count = Math.floor(3 + pseudoRandom(daysOffset) * 8);
    const result = [];
    for (let i = 0; i < count; i++) {
      const hr = 8 + Math.floor(pseudoRandom(daysOffset * 100 + i) * 12);
      const min = Math.floor(pseudoRandom(daysOffset * 200 + i) * 60);
      const ts = new Date(selectedDate);
      ts.setHours(hr, min, 0);

      const itemCount = 1 + Math.floor(pseudoRandom(daysOffset * 300 + i) * 5);
      const items = [];
      const usedSkus = new Set();
      for (let j = 0; j < itemCount; j++) {
        let idx = Math.floor(pseudoRandom(daysOffset * 400 + i * 10 + j) * PRODUCTS.length);
        while (usedSkus.has(idx)) idx = (idx + 1) % PRODUCTS.length;
        usedSkus.add(idx);
        const qty = 1 + Math.floor(pseudoRandom(daysOffset * 500 + i * 10 + j) * 4);
        items.push([PRODUCTS[idx].sku, qty]);
      }

      const cust = CUSTOMERS[Math.floor(pseudoRandom(daysOffset * 600 + i) * CUSTOMERS.length)];
      const total = items.reduce((s, [sku, q]) => {
        const p = PRODUCTS.find(x => x.sku === sku);
        return s + (p?.price || 0) * q;
      }, 0);
      const pays = ["เงินสด", "บัตรเครดิต", "โอนธนาคาร"];

      result.push({
        id: `INV-${selectedDate.toISOString().slice(0,10).replace(/-/g,'')}-${String(i+1).padStart(3,'0')}`,
        ts: ts.getTime(),
        cust: cust.id,
        items,
        total: Math.round(total),
        pay: pays[Math.floor(pseudoRandom(daysOffset * 700 + i) * 3)],
      });
    }
    return result;
  };

  const filteredOrders = getOrdersForDate(daysAgo);
  const totalRev = filteredOrders.reduce((s,o) => s + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avg = totalRev / Math.max(1, totalOrders);
  const totalItems = filteredOrders.reduce((s,o) => s + o.items.reduce((s2,[,q]) => s2+q, 0), 0);

  // top products
  const productSales = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => o.items.forEach(([sku, q]) => {
      const key = sku === "YP-50" ? "YP-050" : sku;
      const p = PRODUCTS.find(x => x.sku === key);
      if (!p) return;
      map[key] = map[key] || { sku: key, name: p.name, qty: 0, rev: 0 };
      map[key].qty += q;
      map[key].rev += p.price * q;
    }));
    return Object.values(map).sort((a,b) => b.rev - a.rev);
  }, [filteredOrders]);

  const hourlyData = useMemo(() => {
    const buckets = {};
    for (let h = 8; h <= 19; h++) buckets[h] = 0;
    filteredOrders.forEach(o => {
      const h = new Date(o.ts).getHours();
      if (buckets[h] !== undefined) buckets[h] += o.total;
    });
    return Object.entries(buckets).map(([h, v]) => ({ label: String(h).padStart(2,"0"), value: Math.round(v/1000) }));
  }, [filteredOrders]);

  // payment breakdown
  const payments = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => { map[o.pay] = (map[o.pay] || 0) + o.total; });
    return Object.entries(map).map(([k,v]) => ({ label: k, value: v }));
  }, [filteredOrders]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานขาย — {dateStr()} · {selectedDate.toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: '2-digit' })}</h1>
          <div className="page-sub">สรุปยอดขายและรายการที่เกิดขึ้น</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button className={daysAgo === 0 ? "on" : ""} onClick={() => setDaysAgo(0)}>วันนี้</button>
            <button className={daysAgo === 1 ? "on" : ""} onClick={() => setDaysAgo(1)}>เมื่อวาน</button>
            <button className={daysAgo > 1 ? "on" : ""} onClick={() => setShowDatePicker(!showDatePicker)}>เลือกวัน</button>
          </div>
          {showDatePicker && (
            <div style={{position:"absolute", top:"100%", right:0, background:"var(--surface-0)", border:"1px solid var(--line)", borderRadius:8, padding:16, marginTop:8, zIndex:100, minWidth:280}}>
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                <div style={{fontSize:13, fontWeight:600}}>เลือกวันที่</div>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={e => {
                    const d = new Date(e.target.value);
                    const diff = Math.floor((today - d) / 86400000);
                    setDaysAgo(diff);
                    setShowDatePicker(false);
                  }}
                  style={{padding:"8px 12px", border:"1px solid var(--line)", borderRadius:6, fontSize:13}}
                />
              </div>
            </div>
          )}
          <button className="btn btn-primary"><Icon name="download" size={15}/>ปิดยอดวัน</button>
        </div>
      </div>

      <div className="kpi-grid stagger">
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon"></span>ยอดขายรวม</div>
          <div className="kpi-value"><Counter value={totalRev} prefix="฿"/></div>
          <div className="kpi-foot">
            <span className="kpi-trend up"><Icon name="trend-up" size={11} stroke={2.4}/>+18.2%</span>
            <span className="kpi-meta">vs. เมื่อวาน</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--success)"}}></span>จำนวนบิล</div>
          <div className="kpi-value"><Counter value={totalOrders}/><span className="unit">บิล</span></div>
          <div className="kpi-foot">
            <span className="kpi-trend up"><Icon name="trend-up" size={11} stroke={2.4}/>+3</span>
            <span className="kpi-meta">บิลล่าสุด {tHHMM(orders[0]?.ts || Date.now())}</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--info)"}}></span>ค่าเฉลี่ย/บิล</div>
          <div className="kpi-value"><Counter value={avg} prefix="฿"/></div>
          <div className="kpi-foot">
            <span className="kpi-trend up"><Icon name="trend-up" size={11} stroke={2.4}/>+12%</span>
            <span className="kpi-meta">บิลใหญ่สุด {baht(Math.max(...orders.map(o=>o.total)))}</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--warn)"}}></span>หน่วยที่ขายได้</div>
          <div className="kpi-value"><Counter value={totalItems}/><span className="unit">หน่วย</span></div>
          <div className="kpi-foot">
            <span className="kpi-meta">ใน {productSales.length} SKU</span>
          </div>
        </div>
      </div>

      <div className="grid-2-1 mb-md" style={{marginBottom:16}}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">ยอดขายตามชั่วโมง</div>
              <div className="card-sub">หน่วย: พันบาท</div>
            </div>
          </div>
          <div className="card-pad">
            <BarChart data={hourlyData} height={220} color="var(--accent)"/>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="card-title">ช่องทางชำระเงิน</div>
          </div>
          <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
            {payments.map((p, i) => {
              const pct = (p.value / totalRev) * 100;
              const colors = ["var(--accent)","var(--info)","var(--success)"];
              return (
                <div key={p.label}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                    <span style={{fontSize:13, fontWeight:500}}>{p.label}</span>
                    <span className="cell-mono">{baht(p.value)} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width:pct+"%", background: colors[i%3], transitionDelay: (i*0.08)+"s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <div className="card-title">รายการบิลวันนี้</div>
            <button className="btn btn-ghost btn-sm">พิมพ์รายงาน</button>
          </div>
          <table className="table">
            <thead><tr>
              <th>เวลา</th><th>เลขที่</th><th>ลูกค้า</th><th>รายการ</th><th>ชำระ</th><th className="num">ยอด</th>
            </tr></thead>
            <tbody className="stagger">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:"center", padding:"24px", color:"var(--ink-3)"}}>ไม่มีข้อมูลขายในวันนี้</td></tr>
              ) : (
                filteredOrders.map(o => {
                  const c = CUSTOMERS.find(x => x.id === o.cust);
                  const items = o.items.reduce((s,[,q])=>s+q, 0);
                  return (
                    <tr key={o.id}>
                      <td className="cell-mono muted">{tHHMM(o.ts)}</td>
                      <td className="cell-mono">{o.id}</td>
                      <td className="cell-pri">{c?.name}</td>
                      <td className="muted">{o.items.length} SKU · {items} หน่วย</td>
                      <td><span className="chip">{o.pay}</span></td>
                      <td className="num cell-pri" style={{fontFamily:"var(--font-mono)"}}>{baht(o.total)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="card-title">สินค้าขายดี</div>
            <span className="chip accent">Top 5</span>
          </div>
          <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
            {productSales.slice(0, 5).map((p, i) => {
              const pct = (p.rev / productSales[0].rev) * 100;
              return (
                <div key={p.sku} style={{display:"grid", gridTemplateColumns:"24px 1fr auto", gap:10, alignItems:"center"}}>
                  <div style={{
                    width:22, height:22, borderRadius:6,
                    background: i === 0 ? "var(--accent)" : "var(--surface-3)",
                    color: i === 0 ? "white" : "var(--ink-2)",
                    display:"grid", placeItems:"center", fontSize:11, fontWeight:700, fontFamily:"var(--font-mono)"
                  }}>{i+1}</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:13, fontWeight:500, whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden"}}>{p.name}</div>
                    <div className="bar-track" style={{marginTop:5}}>
                      <div className="bar-fill" style={{width:pct+"%", transitionDelay:(i*0.08)+"s"}}/>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="cell-mono cell-pri">{baht(p.rev)}</div>
                    <div className="cell-mono muted" style={{fontSize:11}}>{p.qty} ชิ้น</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   Inventory Report (รายงานสินค้าคงเหลือ)
   ==================================================================== */
function PageInventoryReport({ stock }) {
  const [view, setView] = useState("matrix"); // matrix | summary

  const rows = PRODUCTS.map(p => {
    const total = stockTotal(stock, p.sku);
    return {
      ...p,
      total,
      lvl: stockLevel(total, p.reorder),
      value: total * p.cost,
      byLoc: LOCATIONS.reduce((m, l) => ({ ...m, [l.code]: stock[p.sku]?.[l.code] || 0 }), {}),
    };
  });

  const totalUnits = rows.reduce((s,r)=>s+r.total, 0);
  const totalValue = rows.reduce((s,r)=>s+r.value, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานสินค้าคงเหลือ</h1>
          <div className="page-sub">รวม {PRODUCTS.length} SKU · {fmt(totalUnits)} หน่วย · มูลค่า {baht(totalValue)} · ณ {tDateTH(Date.now())} {tHHMM(Date.now())}</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button className={view==="matrix"?"on":""} onClick={()=>setView("matrix")}>Matrix</button>
            <button className={view==="summary"?"on":""} onClick={()=>setView("summary")}>สรุป</button>
          </div>
          <button className="btn"><Icon name="filter" size={15}/>กรอง</button>
          <button className="btn btn-primary"><Icon name="download" size={15}/>ส่งออก</button>
        </div>
      </div>

      <div className="kpi-grid stagger">
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon"></span>SKU ทั้งหมด</div>
          <div className="kpi-value"><Counter value={PRODUCTS.length}/></div>
          <div className="kpi-foot"><span className="kpi-meta">ใน {LOCATIONS.length} location</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--success)"}}></span>หน่วยรวม</div>
          <div className="kpi-value"><Counter value={totalUnits}/></div>
          <div className="kpi-foot"><span className="kpi-meta">หน่วยในระบบ</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--info)"}}></span>มูลค่ารวม (ต้นทุน)</div>
          <div className="kpi-value"><Counter value={totalValue} prefix="฿"/></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--warn)"}}></span>ใกล้หมด / หมด</div>
          <div className="kpi-value">
            <Counter value={rows.filter(r=>r.lvl==="low").length}/>
            <span style={{color:"var(--ink-3)", margin:"0 6px"}}>/</span>
            <Counter value={rows.filter(r=>r.lvl==="out").length}/>
          </div>
          <div className="kpi-foot"><span className="kpi-meta">ใกล้หมด / หมดสต๊อก</span></div>
        </div>
      </div>

      {view === "matrix" ? (
        <div className="card" style={{overflow:"auto"}}>
          <table className="table" style={{minWidth:900}}>
            <thead>
              <tr>
                <th style={{position:"sticky", left:0, background:"var(--surface)", zIndex:1}}>SKU</th>
                <th style={{position:"sticky", left:80, background:"var(--surface)", zIndex:1}}>สินค้า</th>
                {LOCATIONS.map(l => <th key={l.code} className="num" title={l.name}>{l.code}</th>)}
                <th className="num">รวม</th>
                <th className="num">มูลค่า</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody className="stagger">
              {rows.map(r => (
                <tr key={r.sku}>
                  <td className="cell-mono muted" style={{position:"sticky", left:0, background:"var(--bg-elevated)"}}>{r.sku}</td>
                  <td className="cell-pri" style={{position:"sticky", left:80, background:"var(--bg-elevated)"}}>{r.name}</td>
                  {LOCATIONS.map(l => {
                    const q = r.byLoc[l.code];
                    const max = Math.max(...LOCATIONS.map(x => r.byLoc[x.code]), 1);
                    const intensity = q / max;
                    return (
                      <td key={l.code} className="num" style={{
                        background: q > 0 ? `oklch(0.62 ${0.04 + intensity * 0.13} 38 / ${0.08 + intensity * 0.18})` : "transparent",
                        fontFamily:"var(--font-mono)",
                        color: q === 0 ? "var(--ink-4)" : "var(--ink)",
                        fontWeight: q > 0 ? 600 : 400,
                      }}>{q}</td>
                    );
                  })}
                  <td className="num cell-pri" style={{fontFamily:"var(--font-mono)"}}>{r.total}</td>
                  <td className="num muted">{baht(r.value)}</td>
                  <td><span className={`chip stock-pill`} data-level={r.lvl}>{r.lvl === "ok" ? "ปกติ" : r.lvl === "low" ? "ใกล้หมด" : "หมด"}</span></td>
                </tr>
              ))}
              <tr style={{background:"var(--surface)", fontWeight:600}}>
                <td colSpan="2" className="cell-pri" style={{position:"sticky", left:0, background:"var(--surface)"}}>รวมทั้งหมด</td>
                {LOCATIONS.map(l => (
                  <td key={l.code} className="num" style={{fontFamily:"var(--font-mono)"}}>
                    {fmt(rows.reduce((s,r)=>s+r.byLoc[l.code],0))}
                  </td>
                ))}
                <td className="num" style={{fontFamily:"var(--font-mono)"}}>{fmt(totalUnits)}</td>
                <td className="num">{baht(totalValue)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid-2">
          <div className="card">
            <div className="card-head"><div className="card-title">สรุปตามหมวดสินค้า</div></div>
            <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
              {Array.from(new Set(PRODUCTS.map(p => p.cat))).map((cat, i) => {
                const inCat = rows.filter(r => r.cat === cat);
                const units = inCat.reduce((s,r)=>s+r.total,0);
                const value = inCat.reduce((s,r)=>s+r.value,0);
                const pct = (value / totalValue) * 100;
                return (
                  <div key={cat}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13}}>
                      <span style={{fontWeight:500}}>{cat} <span style={{color:"var(--ink-3)", fontWeight:400}}>· {inCat.length} SKU</span></span>
                      <span className="cell-mono">{fmt(units)} · {baht(value)}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{width:pct+"%", transitionDelay:(i*0.08)+"s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title">สรุปตาม Location</div></div>
            <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
              {LOCATIONS.map((l, i) => {
                const units = rows.reduce((s,r)=>s+r.byLoc[l.code], 0);
                const value = rows.reduce((s,r)=>s+r.byLoc[l.code]*r.cost, 0);
                const util = Math.min(100, units / l.capacity * 100);
                return (
                  <div key={l.code}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13}}>
                      <span style={{fontWeight:500}}>{l.name}</span>
                      <span className="cell-mono">{fmt(units)} หน่วย · {baht(value)}</span>
                    </div>
                    <div className="bar-track">
                      <div className={`bar-fill ${util > 85 ? "warn" : ""}`} style={{width:util+"%", transitionDelay:(i*0.07)+"s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================
   Movement Report (รายงานเคลื่อนไหว)
   ==================================================================== */
function PageMovementReport({ movs }) {
  const [type, setType] = useState("ทั้งหมด");
  const [q, setQ] = useState("");

  const filtered = movs.filter(m => {
    if (type !== "ทั้งหมด") {
      const map = { "รับเข้า":"in","เบิกออก":"out","ย้าย":"mov","ปรับ":"adj" };
      if (m.type !== map[type]) return false;
    }
    if (q) {
      const p = PRODUCTS.find(x => x.sku === m.sku);
      const blob = (m.ref + " " + (p?.name||"") + " " + m.from + " " + m.to + " " + m.sku).toLowerCase();
      if (!blob.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const summary = useMemo(() => {
    const ins = movs.filter(m=>m.type==="in").reduce((s,m)=>s+m.qty,0);
    const outs = movs.filter(m=>m.type==="out").reduce((s,m)=>s+m.qty,0);
    const movsCount = movs.filter(m=>m.type==="mov").length;
    const adj = movs.filter(m=>m.type==="adj").length;
    return { ins, outs, movsCount, adj };
  }, [movs]);

  // group by date
  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(m => {
      const d = new Date(m.ts);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      g[key] = g[key] || { label: tDateTH(m.ts), items: [] };
      g[key].items.push(m);
    });
    return Object.values(g);
  }, [filtered]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานการเคลื่อนไหว</h1>
          <div className="page-sub">บันทึกทุกการเคลื่อนไหวของสินค้า — รับ, เบิก, ย้าย, ปรับ</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={15}/>7 วันล่าสุด</button>
          <button className="btn btn-primary"><Icon name="download" size={15}/>ส่งออก</button>
        </div>
      </div>

      <div className="grid-4 mb-md stagger" style={{marginBottom:18}}>
        <div className="kpi" style={{cursor:"default"}}>
          <div className="kpi-label" style={{color:"var(--success)"}}>รับเข้า</div>
          <div className="kpi-value" style={{color:"var(--success)"}}>+<Counter value={summary.ins}/></div>
          <div className="kpi-foot"><span className="kpi-meta">{movs.filter(m=>m.type==="in").length} รายการ</span></div>
        </div>
        <div className="kpi" style={{cursor:"default"}}>
          <div className="kpi-label" style={{color:"var(--danger)"}}>เบิกออก</div>
          <div className="kpi-value" style={{color:"var(--danger)"}}>−<Counter value={summary.outs}/></div>
          <div className="kpi-foot"><span className="kpi-meta">{movs.filter(m=>m.type==="out").length} รายการ</span></div>
        </div>
        <div className="kpi" style={{cursor:"default"}}>
          <div className="kpi-label" style={{color:"oklch(0.45 0.13 70)"}}>ย้ายภายใน</div>
          <div className="kpi-value"><Counter value={summary.movsCount}/></div>
          <div className="kpi-foot"><span className="kpi-meta">โอนระหว่าง location</span></div>
        </div>
        <div className="kpi" style={{cursor:"default"}}>
          <div className="kpi-label" style={{color:"var(--info)"}}>ปรับสต๊อก</div>
          <div className="kpi-value"><Counter value={summary.adj}/></div>
          <div className="kpi-foot"><span className="kpi-meta">นับ/แก้ไข</span></div>
        </div>
      </div>

      <div className="card mb-md" style={{marginBottom:14}}>
        <div className="card-pad" style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <div className="input-prefix" style={{flex:1, minWidth:240}}>
            <span className="prefix-icon"><Icon name="search" size={15}/></span>
            <input className="input" placeholder="ค้นหา SKU, ชื่อสินค้า, เลขที่เอกสาร, location..." value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div className="seg">
            {["ทั้งหมด","รับเข้า","เบิกออก","ย้าย","ปรับ"].map(t => (
              <button key={t} className={type===t?"on":""} onClick={()=>setType(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        {grouped.map((g, gi) => (
          <div key={gi}>
            <div style={{
              padding: "10px 16px",
              background: "var(--surface)",
              borderBottom: "1px solid var(--line)",
              borderTop: gi > 0 ? "1px solid var(--line)" : "none",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink-3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "var(--font-mono)",
              display: "flex",
              justifyContent: "space-between",
            }}>
              <span>{g.label}</span>
              <span>{g.items.length} รายการ</span>
            </div>
            {g.items.map(m => {
              const p = PRODUCTS.find(x => x.sku === m.sku);
              const pos = m.type === "in" ? +m.qty : m.type === "out" ? -m.qty : 0;
              return (
                <div key={m.id} className="mov-row" style={{gridTemplateColumns:"60px 28px 100px 1fr 200px auto"}}>
                  <div className="mov-time">{tHHMM(m.ts)}</div>
                  <div className={`mov-icon ${m.type}`}>{m.type === "in" ? "↓" : m.type === "out" ? "↑" : m.type === "mov" ? "⇄" : "±"}</div>
                  <div><span className="cell-mono" style={{fontSize:11.5, color:"var(--ink-3)"}}>{m.ref}</span></div>
                  <div className="mov-text">
                    <div className="label">{p?.name}</div>
                    <div className="meta cell-mono" style={{fontSize:11}}>{m.sku}</div>
                  </div>
                  <div style={{fontSize:12.5, color:"var(--ink-3)"}}>
                    <span style={{color:"var(--ink)"}}>{m.from}</span>
                    <span style={{margin:"0 6px"}}>→</span>
                    <span style={{color:"var(--ink)"}}>{m.to}</span>
                    <div style={{fontSize:11, marginTop:2}}>โดย {m.by}</div>
                  </div>
                  <div className={`mov-amt ${pos>0?"pos":pos<0?"neg":""}`} style={{minWidth:60}}>{pos>0?"+":""}{m.qty}</div>
                </div>
              );
            })}
          </div>
        ))}
        {grouped.length === 0 && <div className="empty"><div className="empty-icon"><Icon name="shuffle"/></div>ไม่พบรายการที่ตรงกับเงื่อนไข</div>}
      </div>
    </div>
  );
}

window.IM_Pages3 = { PageCustomers, PageSales, PageInventoryReport, PageMovementReport };
