/* global React */
const { useState, useMemo } = React;
const {
  LOCATIONS, PRODUCTS, CUSTOMERS,
  fmt, baht, tHHMM, tDateTH, stockTotal, stockLevel,
  Counter, Sparkline, Icon, useToast,
} = window.IM;

/* ====================================================================
   Stock catalog (สต๊อกสินค้า)
   ==================================================================== */
function PageStock({ stock, setStock = () => {}, go, openItem }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ทั้งหมด");
  const [loc, setLoc] = useState("ทั้งหมด");
  const [view, setView] = useState("table"); // table | grid
  const [editOpen, setEditOpen] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  const [editingLoc, setEditingLoc] = useState(null);
  const [editQty, setEditQty] = useState(0);

  const cats = ["ทั้งหมด", ...Array.from(new Set(PRODUCTS.map(p => p.cat)))];

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (cat !== "ทั้งหมด" && p.cat !== cat) return false;
    if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [q, cat]);

  const openEditStock = (sku, locCode, qty) => {
    setEditingSku(sku);
    setEditingLoc(locCode);
    setEditQty(qty);
    setEditOpen(true);
  };

  const getLocName = (code) => {
    const loc = LOCATIONS.find(l => l.code === code);
    return loc ? loc.name : code;
  };

  const saveEditStock = () => {
    if (editQty < 0) { alert("จำนวนต้องมากกว่าหรือเท่ากับ 0"); return; }
    setStock(prev => {
      const next = { ...prev };
      next[editingSku] = { ...next[editingSku], [editingLoc]: editQty };
      return next;
    });
    setEditOpen(false);
    setEditingSku(null);
    setEditingLoc(null);
    setEditQty(0);
  };

  return (
    <>
    {editOpen && (
      <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
        <div className="card" style={{width:"90%", maxWidth:400, padding:24}}>
          <h2 style={{marginBottom:16}}>แก้ไขจำนวนสินค้า</h2>
          <div style={{display:"flex", flexDirection:"column", gap:12}}>
            <div>
              <label style={{fontSize:12, color:"var(--ink-3)"}}>สินค้า (SKU)</label>
              <div style={{background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius:6, padding:10, fontSize:13, color:"var(--ink)"}}>
                <div style={{fontFamily:"var(--font-mono)", color:"var(--ink-3)"}}>{editingSku}</div>
                <div style={{marginTop:4}}>{PRODUCTS.find(p => p.sku === editingSku)?.name}</div>
              </div>
            </div>
            <div>
              <label style={{fontSize:12, color:"var(--ink-3)"}}>Location</label>
              <div style={{background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius:6, padding:10, fontSize:13, color:"var(--ink)"}}>
                <div style={{color:"var(--ink-3)"}}>{editingLoc}</div>
                <div style={{marginTop:4, fontSize:14}}>{getLocName(editingLoc)}</div>
              </div>
            </div>
            <div>
              <label style={{fontSize:12, color:"var(--ink-3)"}}>จำนวน (หน่วย)</label>
              <input className="input" type="number" value={editQty} onChange={e=>setEditQty(Math.max(0, +e.target.value))} autoFocus style={{fontSize:16, fontFamily:"var(--font-mono)"}}/>
            </div>
            <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:16}}>
              <button className="btn" onClick={() => setEditOpen(false)}>ยกเลิก</button>
              <button className="btn btn-accent" onClick={saveEditStock}>บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    )}
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">สต๊อกสินค้า</h1>
          <div className="page-sub">รายการสินค้าทั้งหมด {PRODUCTS.length} รายการ · มูลค่ารวม {baht(PRODUCTS.reduce((s,p)=>s+stockTotal(stock,p.sku)*p.cost,0))}</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={15}/>ส่งออก CSV</button>
          <button className="btn btn-accent"><Icon name="plus" size={15}/>เพิ่มสินค้า</button>
        </div>
      </div>

      <div className="card mb-md" style={{marginBottom:16}}>
        <div className="card-pad" style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <div className="input-prefix" style={{flex:1, minWidth:240}}>
            <span className="prefix-icon"><Icon name="search" size={15}/></span>
            <input className="input" placeholder="ค้นหาชื่อสินค้า หรือ SKU..." value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <select className="select" style={{width:140}} value={cat} onChange={e=>setCat(e.target.value)}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="select" style={{width:160}} value={loc} onChange={e=>setLoc(e.target.value)}>
            <option>ทั้งหมด</option>
            {LOCATIONS.map(l => <option key={l.code}>{l.name}</option>)}
          </select>
          <div className="seg">
            <button className={view==="table"?"on":""} onClick={()=>setView("table")}>ตาราง</button>
            <button className={view==="grid"?"on":""} onClick={()=>setView("grid")}>การ์ด</button>
          </div>
        </div>
      </div>

      {view === "table" ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>ชื่อสินค้า</th>
                <th>หมวด</th>
                <th className="num">ราคาขาย</th>
                <th className="num">ต้นทุน</th>
                <th className="num">คงเหลือรวม</th>
                <th>กระจายตาม Location</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="stagger">
              {filtered.map(p => {
                const total = stockTotal(stock, p.sku);
                const lvl = stockLevel(total, p.reorder);
                const dist = LOCATIONS.map(l => ({ code: l.code, qty: stock[p.sku]?.[l.code] || 0 }));
                const max = Math.max(...dist.map(d => d.qty), 1);
                return (
                  <tr key={p.sku} onClick={()=>openItem(p.sku)} style={{cursor:"pointer"}}>
                    <td className="cell-mono muted">{p.sku}</td>
                    <td className="cell-pri">{p.name}</td>
                    <td><span className="chip">{p.cat}</span></td>
                    <td className="num">{baht(p.price)}</td>
                    <td className="num muted">{baht(p.cost)}</td>
                    <td className="num cell-pri" style={{fontFamily:"var(--font-mono)"}}>{fmt(total)} <span style={{color:"var(--ink-3)", fontWeight:400}}>{p.unit}</span></td>
                    <td>
                      <div style={{display:"flex", gap:3, alignItems:"flex-end", height:24}}>
                        {dist.map(d => (
                          <div
                            key={d.code}
                            title={`${d.code}: ${d.qty} - คลิกเพื่อแก้ไข`}
                            onClick={e => {e.stopPropagation(); openEditStock(p.sku, d.code, d.qty);}}
                            style={{
                              width: 14,
                              height: Math.max(2, (d.qty / max) * 22) + "px",
                              background: d.qty === 0 ? "var(--surface-3)" : "var(--accent)",
                              opacity: 0.4 + (d.qty / max) * 0.6,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "opacity 0.2s",
                            }}
                            onMouseEnter={e => e.target.style.opacity = "1"}
                            onMouseLeave={e => e.target.style.opacity = (0.4 + (d.qty / max) * 0.6)}
                          />
                        ))}
                      </div>
                    </td>
                    <td><span className={`chip stock-pill`} data-level={lvl}>{lvl === "ok" ? "ปกติ" : lvl === "low" ? "ใกล้หมด" : "หมดสต๊อก"}</span></td>
                    <td><button className="icon-btn" onClick={e=>{e.stopPropagation();}}><Icon name="more" size={15}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14}} className="stagger">
          {filtered.map(p => {
            const total = stockTotal(stock, p.sku);
            const lvl = stockLevel(total, p.reorder);
            const pct = Math.min(100, (total / (p.reorder * 3)) * 100);
            return (
              <div key={p.sku} className="card" style={{cursor:"pointer", padding:18, transition:"all 0.22s"}}>
                <div style={{display:"flex", gap:12, alignItems:"flex-start"}}>
                  <div className="item-thumb" style={{width:44, height:44}} onClick={()=>openItem(p.sku)}>
                    <div className="item-thumb-stripe"/>
                    <span className="item-thumb-glyph">{p.sku.slice(-3)}</span>
                  </div>
                  <div style={{flex:1}} onClick={()=>openItem(p.sku)}>
                    <div style={{fontSize:11, fontFamily:"var(--font-mono)", color:"var(--ink-3)"}}>{p.sku}</div>
                    <div style={{fontWeight:600, fontSize:14, marginTop:2}}>{p.name}</div>
                  </div>
                  <span className={`chip stock-pill`} data-level={lvl}>{lvl === "ok" ? "ปกติ" : lvl === "low" ? "ใกล้หมด" : "หมด"}</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:14}}>
                  <div onClick={()=>openItem(p.sku)}>
                    <div style={{fontSize:11, color:"var(--ink-3)"}}>คงเหลือ</div>
                    <div style={{fontSize:24, fontWeight:600, fontFamily:"var(--font-mono)"}}>{fmt(total)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11, color:"var(--ink-3)"}}>ราคา</div>
                    <div style={{fontSize:14, fontWeight:600}}>{baht(p.price)}</div>
                  </div>
                </div>
                <div className="bar-track" style={{marginTop:10}} onClick={()=>openItem(p.sku)}>
                  <div className={`bar-fill ${lvl}`} style={{width: pct+"%"}}/>
                </div>
                <button
                  className="btn btn-sm"
                  style={{width:"100%", marginTop:12}}
                  onClick={e => {e.stopPropagation(); openItem(p.sku);}}
                >
                  <Icon name="edit" size={13}/> ดูรายละเอียด
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}

/* ====================================================================
   Item detail (สต๊อกสินค้าแต่ละตัว)
   ==================================================================== */
function PageItemDetail({ sku, stock, movs, back, setStock = () => {} }) {
  const p = PRODUCTS.find(x => x.sku === sku);
  if (!p) return null;
  const dist = LOCATIONS.map(l => ({ ...l, qty: stock[sku]?.[l.code] || 0 }));
  const total = dist.reduce((s,d) => s + d.qty, 0);
  const value = total * p.cost;
  const lvl = stockLevel(total, p.reorder);
  const myMovs = movs.filter(m => m.sku === sku);

  const [editOpen, setEditOpen] = useState(false);
  const [editQty, setEditQty] = useState(0);
  const [editLocCode, setEditLocCode] = useState(null);

  const openEditStock = (locCode, qty) => {
    setEditLocCode(locCode);
    setEditQty(qty);
    setEditOpen(true);
  };

  const saveEditStock = () => {
    if (editQty < 0) { alert("จำนวนต้องมากกว่าหรือเท่ากับ 0"); return; }
    setStock(prev => {
      const next = { ...prev };
      next[sku] = { ...next[sku], [editLocCode]: editQty };
      return next;
    });
    setEditOpen(false);
    setEditLocCode(null);
    setEditQty(0);
  };

  // 30-day history (mock)
  const history = useMemo(() => {
    const arr = [];
    let v = total + Math.floor(Math.random()*200);
    for (let i = 29; i >= 0; i--) {
      v += Math.floor((Math.random()-0.45) * 30);
      arr.push(Math.max(0, v));
    }
    arr.push(total);
    return arr;
  }, [sku, total]);

  return (
    <>
    {editOpen && (
      <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
        <div className="card" style={{width:"90%", maxWidth:400, padding:24}}>
          <h2 style={{marginBottom:16}}>แก้ไขจำนวนสินค้า</h2>
          <div style={{display:"flex", flexDirection:"column", gap:12}}>
            <div>
              <label style={{fontSize:12, color:"var(--ink-3)"}}>สินค้า (SKU)</label>
              <div style={{background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius:6, padding:10, fontSize:13, color:"var(--ink)"}}>
                <div style={{fontFamily:"var(--font-mono)", color:"var(--ink-3)"}}>{sku}</div>
                <div style={{marginTop:4}}>{p.name}</div>
              </div>
            </div>
            <div>
              <label style={{fontSize:12, color:"var(--ink-3)"}}>Location</label>
              <div style={{background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius:6, padding:10, fontSize:13, color:"var(--ink)"}}>
                <div style={{color:"var(--ink-3)"}}>{editLocCode}</div>
                <div style={{marginTop:4, fontSize:14}}>{LOCATIONS.find(l => l.code === editLocCode)?.name}</div>
              </div>
            </div>
            <div>
              <label style={{fontSize:12, color:"var(--ink-3)"}}>จำนวน (หน่วย)</label>
              <input className="input" type="number" value={editQty} onChange={e=>setEditQty(Math.max(0, +e.target.value))} autoFocus style={{fontSize:16, fontFamily:"var(--font-mono)"}}/>
            </div>
            <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:16}}>
              <button className="btn" onClick={() => setEditOpen(false)}>ยกเลิก</button>
              <button className="btn btn-accent" onClick={saveEditStock}>บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    )}
    <div className="page">
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:14, fontSize:13, color:"var(--ink-3)"}}>
        <span style={{cursor:"pointer"}} onClick={back}>สต๊อกสินค้า</span>
        <span>›</span>
        <span style={{color:"var(--ink)"}}>{p.name}</span>
      </div>

      <div className="page-head">
        <div style={{display:"flex", gap:18, alignItems:"center"}}>
          <div className="item-thumb" style={{width:72, height:72, borderRadius:18}}>
            <div className="item-thumb-stripe"/>
            <span className="item-thumb-glyph" style={{fontSize:13}}>{p.sku.slice(-3)}</span>
          </div>
          <div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}>
              <span className="cell-mono" style={{color:"var(--ink-3)", fontSize:12}}>{p.sku}</span>
              <span className="chip">{p.cat}</span>
              <span className={`chip stock-pill`} data-level={lvl}>{lvl === "ok" ? "ปกติ" : lvl === "low" ? "ใกล้หมด" : "หมดสต๊อก"}</span>
            </div>
            <h1 className="page-title" style={{marginTop:4}}>{p.name}</h1>
            <div className="page-sub">หน่วย: {p.unit} · จุดสั่งซื้อ: {p.reorder} {p.unit}</div>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="edit" size={14}/>แก้ไข</button>
          <button className="btn btn-accent"><Icon name="in" size={15}/>รับเข้าด่วน</button>
        </div>
      </div>

      <div className="kpi-grid stagger">
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon"></span>คงเหลือรวม</div>
          <div className="kpi-value"><Counter value={total}/><span className="unit">{p.unit}</span></div>
          <Sparkline data={history}/>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--success)"}}></span>มูลค่าสต๊อก</div>
          <div className="kpi-value"><Counter value={value} prefix="฿"/></div>
          <div className="kpi-foot"><span className="kpi-meta">@ ต้นทุน {baht(p.cost)}/{p.unit}</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--info)"}}></span>ขายเฉลี่ย / วัน</div>
          <div className="kpi-value"><Counter value={Math.round(p.reorder * 0.18)}/><span className="unit">{p.unit}</span></div>
          <div className="kpi-foot"><span className="kpi-meta">ใน 30 วันล่าสุด</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--warn)"}}></span>วันที่ใช้ได้</div>
          <div className="kpi-value"><Counter value={Math.round(total / Math.max(1, p.reorder * 0.18))}/><span className="unit">วัน</span></div>
          <div className="kpi-foot"><span className="kpi-meta">ที่อัตราขายปัจจุบัน</span></div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <div className="card-title">การกระจายในแต่ละ Location</div>
            <span className="chip"><span className="live-dot"></span>Live</span>
          </div>
          <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
            {dist.map((d, i) => {
              const max = Math.max(...dist.map(x => x.qty), 1);
              const pct = (d.qty / max) * 100;
              const icon = d.type === "warehouse" ? "warehouse" : d.type === "vehicle" ? "truck" : d.type === "retail" ? "shop" : "loc";
              return (
                <div
                  key={d.code}
                  style={{
                    display:"grid",
                    gridTemplateColumns:"30px 1fr auto auto",
                    gap:12,
                    alignItems:"center",
                    padding:10,
                    borderRadius:6,
                    background:"var(--surface-2)",
                    cursor:"pointer",
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface-3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--surface-2)"}
                >
                  <div className="icon-btn" style={{width:30, height:30, color:"var(--ink-3)"}}><Icon name={icon} size={15}/></div>
                  <div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                      <span style={{fontSize:13, fontWeight:500}}>{d.name}</span>
                      <span className="cell-mono" style={{fontSize:13}}>{d.qty} / {d.capacity}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{width: pct+"%", transitionDelay: (i*0.06)+"s"}}/>
                    </div>
                  </div>
                  <span className="chip">{Math.round(d.qty / Math.max(1,total) * 100)}%</span>
                  <button
                    className="btn btn-sm"
                    onClick={e => {e.stopPropagation(); openEditStock(d.code, d.qty);}}
                    title="แก้ไขจำนวน"
                  >
                    <Icon name="edit" size={12}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">ข้อมูลสินค้า</div>
          </div>
          <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
            {[
              ["รหัสสินค้า (SKU)", p.sku, true],
              ["บาร์โค้ด", "8852" + p.sku.replace("-","") + "01", true],
              ["หมวด", p.cat],
              ["หน่วย", p.unit],
              ["ราคาขาย", baht(p.price)],
              ["ต้นทุนต่อหน่วย", baht(p.cost)],
              ["กำไรต่อหน่วย", baht(p.price - p.cost) + " (" + Math.round((p.price-p.cost)/p.price*100) + "%)"],
              ["จุดสั่งซื้อใหม่", p.reorder + " " + p.unit],
              ["น้ำหนักต่อหน่วย", p.sku.includes("050") ? "50 g" : p.sku.includes("100") ? "100 g" : p.sku.includes("250") ? "250 g" : p.sku.includes("500") ? "500 g" : p.sku.includes("1K") ? "1 kg" : "5 kg"],
              ["อายุเก็บ (Shelf life)", "24 เดือน"],
              ["Lot ล่าสุด", "L-2604-08"],
              ["ผู้ผลิต", "โรงงานต้นน้ำ ยายปู"],
            ].map(([k, v, mono]) => (
              <div key={k} style={{display:"flex", justifyContent:"space-between", paddingBottom:10, borderBottom:"1px dashed var(--line)", fontSize:13}}>
                <span style={{color:"var(--ink-3)"}}>{k}</span>
                <span style={{color:"var(--ink)", fontWeight:500, fontFamily: mono ? "var(--font-mono)" : "inherit"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-lg">
        <div className="card-head">
          <div className="card-title">ประวัติการเคลื่อนไหว — {p.name}</div>
          <button className="btn btn-ghost btn-sm">ดูทั้งหมด <Icon name="arrow-r" size={13}/></button>
        </div>
        <div>
          {myMovs.length === 0 && <div className="empty"><div className="empty-icon"><Icon name="shuffle"/></div>ยังไม่มีการเคลื่อนไหว</div>}
          {myMovs.slice(0, 8).map(m => {
            const pos = m.type === "in" ? +m.qty : m.type === "out" ? -m.qty : 0;
            return (
              <div key={m.id} className="mov-row">
                <div className="mov-time">{tDateTH(m.ts)} {tHHMM(m.ts)}</div>
                <div className={`mov-icon ${m.type}`}>{m.type === "in" ? "↓" : m.type === "out" ? "↑" : m.type === "mov" ? "⇄" : "±"}</div>
                <div className="mov-text">
                  <div className="label">{m.type === "in" ? "รับเข้า" : m.type === "out" ? "เบิกออก" : m.type === "mov" ? "ย้ายภายใน" : "ปรับสต๊อก"} · {m.ref}</div>
                  <div className="meta">{m.from} → {m.to} · โดย {m.by}</div>
                </div>
                <div className={`mov-amt ${pos>0?"pos":pos<0?"neg":""}`}>{pos>0?"+":""}{m.qty}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}

/* ====================================================================
   Locations page
   ==================================================================== */
function PageLocations({ stock, movs, locations = [], setLocations = () => {} }) {
  const [sel, setSel] = useState((locations[0] || {}).code || "WH-A");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [newLoc, setNewLoc] = useState({ code: "", name: "", type: "warehouse", capacity: 1000 });

  const locList = locations.length > 0 ? locations : LOCATIONS;
  const cur = locList.find(l => l.code === sel) || locList[0];

  const items = PRODUCTS.map(p => ({ ...p, qty: stock[p.sku]?.[sel] || 0 }))
    .sort((a,b) => b.qty - a.qty);
  const totalItems = items.reduce((s, p) => s + p.qty, 0);
  const totalValue = items.reduce((s, p) => s + p.qty * p.cost, 0);
  const utilization = Math.min(100, (totalItems / (cur?.capacity || 1000)) * 100);

  const flowsIn = movs.filter(m => (m.type === "in" || m.type === "mov") && m.to === sel).length;
  const flowsOut = movs.filter(m => (m.type === "out" || m.type === "mov") && m.from === sel).length;

  const addLocation = () => {
    if (!newLoc.code || !newLoc.name) { alert("Code และ Name ต้องระบุ"); return; }
    if (locList.find(l => l.code === newLoc.code)) { alert("Code ซ้ำกัน"); return; }
    setLocations([...locList, newLoc]);
    setAddOpen(false);
    setNewLoc({ code: "", name: "", type: "warehouse", capacity: 1000 });
  };

  const openEditLocation = (code) => {
    const loc = locList.find(l => l.code === code);
    if (loc) {
      setNewLoc(loc);
      setEditingCode(code);
      setEditOpen(true);
    }
  };

  const updateLocation = () => {
    if (!newLoc.name) { alert("ชื่อต้องระบุ"); return; }
    const updated = locList.map(l =>
      l.code === editingCode ? { ...l, name: newLoc.name, type: newLoc.type, capacity: newLoc.capacity } : l
    );
    setLocations(updated);
    setEditOpen(false);
    setEditingCode(null);
    setNewLoc({ code: "", name: "", type: "warehouse", capacity: 1000 });
  };

  const deleteLocation = (code) => {
    if (locList.length <= 1) { alert("ต้องมี location อย่างน้อย 1 ที่"); return; }
    if (!confirm("ลบ location นี้จริงหรือ?")) return;
    const updated = locList.filter(l => l.code !== code);
    setLocations(updated);
    if (sel === code) setSel(updated[0].code);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Locations</h1>
          <div className="page-sub">ระบบ track สินค้าคงเหลือในแต่ละจุดเก็บ — อัปเดตอัตโนมัติเมื่อมีการรับ/เบิก/ย้าย</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={() => setLocations([...locList])}><Icon name="shuffle" size={15}/>ย้ายสินค้า</button>
          <button className="btn btn-accent" onClick={() => setAddOpen(true)}><Icon name="plus" size={15}/>เพิ่ม Location</button>
        </div>
        {addOpen && (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
            <div className="card" style={{width:"90%", maxWidth:450, padding:24}}>
              <h2 style={{marginBottom:16}}>เพิ่ม Location ใหม่</h2>
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>Code (เช่น WH-C)</label>
                  <input className="input" value={newLoc.code} onChange={e=>setNewLoc({...newLoc, code: e.target.value.toUpperCase()})} placeholder="WH-C"/>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ชื่อ Location</label>
                  <input className="input" value={newLoc.name} onChange={e=>setNewLoc({...newLoc, name: e.target.value})} placeholder="คลัง C"/>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ประเภท</label>
                  <select className="input" value={newLoc.type} onChange={e=>setNewLoc({...newLoc, type: e.target.value})}>
                    <option value="warehouse">คลัง (Warehouse)</option>
                    <option value="retail">หน้าร้าน (Retail)</option>
                    <option value="vehicle">รถส่ง (Vehicle)</option>
                    <option value="staging">Staging (QC)</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ความจุ (หน่วย)</label>
                  <input className="input" type="number" value={newLoc.capacity} onChange={e=>setNewLoc({...newLoc, capacity: +e.target.value})} placeholder="1000"/>
                </div>
                <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:16}}>
                  <button className="btn" onClick={() => {setAddOpen(false); setNewLoc({code:"",name:"",type:"warehouse",capacity:1000});}}>ยกเลิก</button>
                  <button className="btn btn-accent" onClick={addLocation}>บันทึก</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {editOpen && (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000}}>
            <div className="card" style={{width:"90%", maxWidth:450, padding:24}}>
              <h2 style={{marginBottom:16}}>แก้ไข Location: {newLoc.code}</h2>
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>Code</label>
                  <input className="input" value={newLoc.code} disabled style={{background:"var(--surface-2)", cursor:"not-allowed"}}/>
                  <div style={{fontSize:10, color:"var(--ink-3)", marginTop:4}}>ไม่สามารถแก้ไข Code</div>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ชื่อ Location</label>
                  <input className="input" value={newLoc.name} onChange={e=>setNewLoc({...newLoc, name: e.target.value})} placeholder="ชื่อใหม่"/>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ประเภท</label>
                  <select className="input" value={newLoc.type} onChange={e=>setNewLoc({...newLoc, type: e.target.value})}>
                    <option value="warehouse">คลัง (Warehouse)</option>
                    <option value="retail">หน้าร้าน (Retail)</option>
                    <option value="vehicle">รถส่ง (Vehicle)</option>
                    <option value="staging">Staging (QC)</option>
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12, color:"var(--ink-3)"}}>ความจุ (หน่วย)</label>
                  <input className="input" type="number" value={newLoc.capacity} onChange={e=>setNewLoc({...newLoc, capacity: +e.target.value})} placeholder="1000"/>
                </div>
                <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:16}}>
                  <button className="btn" onClick={() => {setEditOpen(false); setEditingCode(null); setNewLoc({code:"",name:"",type:"warehouse",capacity:1000});}}>ยกเลิก</button>
                  <button className="btn btn-danger" onClick={() => deleteLocation(editingCode)} style={{marginRight:"auto"}}>ลบ Location</button>
                  <button className="btn btn-accent" onClick={updateLocation}>บันทึก</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="loc-board mb-md" style={{marginBottom:18}}>
        {locList.map(l => {
          const items = PRODUCTS.reduce((s, p) => s + (stock[p.sku]?.[l.code] || 0), 0);
          const value = PRODUCTS.reduce((s, p) => s + (stock[p.sku]?.[l.code] || 0) * p.cost, 0);
          const util = Math.min(100, (items / l.capacity) * 100);
          const icon = l.type === "warehouse" ? "warehouse" : l.type === "vehicle" ? "truck" : l.type === "retail" ? "shop" : "loc";
          return (
            <div key={l.code} className={`loc-card ${sel === l.code ? "selected" : ""}`} onClick={()=>setSel(l.code)} onDoubleClick={() => openEditLocation(l.code)} onContextMenu={(e) => {e.preventDefault(); deleteLocation(l.code);}} style={{cursor:"pointer", position:"relative"}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
                <div style={{display:"flex", gap:10, alignItems:"center"}}>
                  <div className="icon-btn" style={{width:34, height:34, color: sel===l.code ? "var(--accent)" : "var(--ink-2)"}}><Icon name={icon} size={16}/></div>
                  <div>
                    <div className="loc-name">{l.name}</div>
                    <div className="loc-code">{l.code} · {l.type === "warehouse" ? "คลัง" : l.type === "vehicle" ? "รถ" : l.type === "retail" ? "หน้าร้าน" : "Staging"}</div>
                  </div>
                </div>
                <span className="live-dot" title="online"></span>
              </div>
              <div className="loc-stats">
                <div>
                  <div className="loc-stat-num"><Counter value={items}/></div>
                  <div className="loc-stat-lab">หน่วย</div>
                </div>
                <div>
                  <div className="loc-stat-num">{baht(value)}</div>
                  <div className="loc-stat-lab">มูลค่า</div>
                </div>
              </div>
              <div style={{marginTop:12}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:11, color:"var(--ink-3)"}}>
                  <span>ใช้พื้นที่</span>
                  <span className="cell-mono">{Math.round(util)}%</span>
                </div>
                <div className="bar-track">
                  <div className={`bar-fill ${util > 85 ? "warn" : ""}`} style={{width: util + "%"}}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{cur.name}</div>
              <div className="card-sub">{totalItems} หน่วย · มูลค่า {baht(totalValue)} · ใช้พื้นที่ {Math.round(utilization)}%</div>
            </div>
            <div className="seg">
              <button className="on">รายการ</button>
              <button>Heatmap</button>
            </div>
          </div>
          <div>
            <table className="table">
              <thead><tr>
                <th>SKU</th><th>ชื่อสินค้า</th><th className="num">คงเหลือ</th><th>สัดส่วน</th><th>สถานะ</th>
              </tr></thead>
              <tbody className="stagger">
                {items.filter(i => i.qty > 0).map(p => {
                  const pct = (p.qty / Math.max(1, totalItems)) * 100;
                  const lvl = stockLevel(p.qty, Math.round(p.reorder * 0.3));
                  return (
                    <tr key={p.sku}>
                      <td className="cell-mono muted">{p.sku}</td>
                      <td className="cell-pri">{p.name}</td>
                      <td className="num cell-pri" style={{fontFamily:"var(--font-mono)"}}>{p.qty}</td>
                      <td>
                        <div style={{width:120, display:"flex", alignItems:"center", gap:8}}>
                          <div className="bar-track" style={{flex:1}}>
                            <div className="bar-fill" style={{width: Math.min(100, pct*4) + "%"}}/>
                          </div>
                          <span className="cell-mono muted" style={{fontSize:11, width:40, textAlign:"right"}}>{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td><span className={`chip stock-pill`} data-level={lvl}>{lvl === "ok" ? "ปกติ" : lvl === "low" ? "ใกล้หมด" : "หมด"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card">
            <div className="card-head">
              <div className="card-title">การไหลเข้า-ออก</div>
              <span className="chip">วันนี้</span>
            </div>
            <div className="card-pad" style={{display:"flex", gap:24, justifyContent:"space-around"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>เข้า</div>
                <div style={{fontSize:32, fontWeight:600, color:"var(--success)", fontFamily:"var(--font-mono)"}}>+<Counter value={flowsIn}/></div>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>รายการ</div>
              </div>
              <div style={{width:1, background:"var(--line)"}}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>ออก</div>
                <div style={{fontSize:32, fontWeight:600, color:"var(--danger)", fontFamily:"var(--font-mono)"}}>−<Counter value={flowsOut}/></div>
                <div style={{fontSize:11, color:"var(--ink-3)"}}>รายการ</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">กิจกรรมล่าสุด</div>
            </div>
            <div>
              {movs.filter(m => m.from === sel || m.to === sel).slice(0, 6).map(m => {
                const p = PRODUCTS.find(x => x.sku === m.sku);
                const isIn = m.to === sel;
                return (
                  <div key={m.id} className="mov-row" style={{gridTemplateColumns:"56px 28px 1fr auto", padding:"11px 16px"}}>
                    <div className="mov-time">{tHHMM(m.ts)}</div>
                    <div className={`mov-icon ${isIn ? "in" : "out"}`}>{isIn ? "↓" : "↑"}</div>
                    <div className="mov-text">
                      <div className="label" style={{fontSize:13}}>{p?.name}</div>
                      <div className="meta">{m.ref}</div>
                    </div>
                    <div className={`mov-amt ${isIn ? "pos" : "neg"}`}>{isIn ? "+" : "−"}{m.qty}</div>
                  </div>
                );
              })}
              {movs.filter(m => m.from === sel || m.to === sel).length === 0 && (
                <div className="empty" style={{padding:"24px 16px"}}>ไม่มีกิจกรรม</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.IM_Pages2 = { PageStock, PageItemDetail, PageLocations };
