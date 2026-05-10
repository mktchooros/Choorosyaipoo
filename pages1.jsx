/* global React */
const { useState, useEffect, useMemo, useRef } = React;
const {
  LOCATIONS, PRODUCTS, CUSTOMERS,
  fmt, baht, tHHMM, tDateTH, stockTotal, stockLevel,
  Counter, Sparkline, BarChart, Icon, useToast,
} = window.IM;

/* ====================================================================
   Dashboard
   ==================================================================== */
function PageDashboard({ stock, orders, movs, go }) {
  const totalUnits = useMemo(() => PRODUCTS.reduce((s, p) => s + stockTotal(stock, p.sku), 0), [stock]);
  const totalValue = useMemo(() => PRODUCTS.reduce((s, p) => s + stockTotal(stock, p.sku) * p.cost, 0), [stock]);
  const lowStock = useMemo(() => PRODUCTS.filter(p => stockTotal(stock, p.sku) <= p.reorder).length, [stock]);
  const todayRevenue = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);

  const last14 = [42,38,55,49,62,71,58,66,80,72,85,78,92,todayRevenue/1000];
  const inSeries = [12,18,9,14,22,28,18,25,30,22,18,28,35,28];
  const movSeries = [22,28,35,40,32,28,38,45,52,48,55,60,52,58];
  const lowSeries = [4,3,5,4,6,5,7,6,8,7,5,6, lowStock-1, lowStock];

  const byCat = useMemo(() => {
    const map = {};
    PRODUCTS.forEach(p => {
      const cat = p.cat;
      map[cat] = (map[cat] || 0) + stockTotal(stock, p.sku);
    });
    return Object.entries(map).map(([k,v]) => ({ label: k, value: v }));
  }, [stock]);

  const dayHours = ["08","09","10","11","12","13","14","15","16","17","18"];
  const hourly = useMemo(() => {
    const buckets = dayHours.map(h => ({ label: h, value: 0 }));
    orders.forEach(o => {
      const hr = new Date(o.ts).getHours();
      const i = hr - 8;
      if (i >= 0 && i < buckets.length) buckets[i].value += o.total / 1000;
    });
    return buckets;
  }, [orders]);

  const lowItems = useMemo(() => PRODUCTS
    .map(p => ({ ...p, qty: stockTotal(stock, p.sku) }))
    .filter(p => p.qty <= p.reorder)
    .sort((a,b) => a.qty/a.reorder - b.qty/b.reorder)
    .slice(0, 5), [stock]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">ภาพรวมร้าน</h1>
          <div className="page-sub">วันนี้ {tDateTH(Date.now())} · อัปเดตล่าสุด {tHHMM(Date.now())}</div>
        </div>
        <div className="page-actions">
          <div className="seg">
            <button className="on">วันนี้</button>
            <button>7 วัน</button>
            <button>30 วัน</button>
          </div>
          <button className="btn"><Icon name="download" size={15}/>ส่งออก</button>
          <button className="btn btn-accent" onClick={() => go("receive")}><Icon name="plus" size={15}/>บันทึกใหม่</button>
        </div>
      </div>

      <div className="kpi-grid stagger">
        <div className="kpi" onClick={() => go("stock")}>
          <div className="kpi-label"><span className="dot-icon"></span>มูลค่าสต๊อกรวม</div>
          <div className="kpi-value"><Counter value={totalValue} prefix="฿"/></div>
          <div className="kpi-foot">
            <span className="kpi-trend up"><Icon name="trend-up" size={11} stroke={2.4}/>+4.2%</span>
            <span className="kpi-meta"><Counter value={totalUnits}/> หน่วยในระบบ</span>
          </div>
          <Sparkline data={[totalValue*0.92, totalValue*0.94, totalValue*0.93, totalValue*0.97, totalValue*0.99, totalValue*1.01, totalValue]}/>
        </div>

        <div className="kpi" onClick={() => go("sales")}>
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--success)"}}></span>ยอดขายวันนี้</div>
          <div className="kpi-value"><Counter value={todayRevenue} prefix="฿"/></div>
          <div className="kpi-foot">
            <span className="kpi-trend up"><Icon name="trend-up" size={11} stroke={2.4}/>+12.8%</span>
            <span className="kpi-meta">{orders.length} รายการ · เฉลี่ย {baht(todayRevenue/Math.max(1,orders.length))}</span>
          </div>
          <Sparkline data={last14} color="var(--success)"/>
        </div>

        <div className="kpi" onClick={() => go("movements")}>
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--info)"}}></span>การเคลื่อนไหววันนี้</div>
          <div className="kpi-value"><Counter value={movs.length}/><span className="unit">รายการ</span></div>
          <div className="kpi-foot">
            <span className="kpi-trend up"><Icon name="trend-up" size={11} stroke={2.4}/>+6</span>
            <span className="kpi-meta">รับเข้า · เบิก · โอนย้าย</span>
          </div>
          <Sparkline data={movSeries} color="var(--info)"/>
        </div>

        <div className="kpi" onClick={() => go("stock")}>
          <div className="kpi-label"><span className="dot-icon" style={{background:"var(--warn)"}}></span>สินค้าใกล้หมด</div>
          <div className="kpi-value"><Counter value={lowStock}/><span className="unit">รายการ</span></div>
          <div className="kpi-foot">
            <span className="kpi-trend down"><Icon name="trend-dn" size={11} stroke={2.4}/>−2</span>
            <span className="kpi-meta">ต้องสั่งเพิ่ม</span>
          </div>
          <Sparkline data={lowSeries} color="var(--warn)"/>
        </div>
      </div>

      <div className="grid-2-1 mb-md" style={{marginBottom: 16}}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">ยอดขายรายชั่วโมง · วันนี้</div>
              <div className="card-sub">หน่วย: พันบาท</div>
            </div>
            <div className="seg">
              <button className="on">บาท</button>
              <button>ชิ้น</button>
            </div>
          </div>
          <div className="card-pad">
            <BarChart data={hourly} height={220} color="var(--accent)"/>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">สต๊อกตามหมวด</div>
            <span className="chip">หน่วย</span>
          </div>
          <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:14}}>
            {byCat.map((c, i) => {
              const max = Math.max(...byCat.map(x => x.value));
              const pct = (c.value / max) * 100;
              const colors = ["var(--accent)", "var(--info)", "var(--success)", "var(--warn)"];
              return (
                <div key={c.label}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13}}>
                    <span style={{fontWeight:500}}>{c.label}</span>
                    <span className="cell-mono">{fmt(c.value)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: pct+"%", background: colors[i % colors.length], transition: "width 0.8s "+(0.1*i)+"s cubic-bezier(0.2,0.8,0.2,1)"}}/>
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
            <div className="card-title">การเคลื่อนไหวล่าสุด</div>
            <button className="btn btn-ghost btn-sm" onClick={() => go("movements")}>ดูทั้งหมด <Icon name="arrow-r" size={13}/></button>
          </div>
          <div>
            {movs.slice(0, 6).map(m => {
              const p = PRODUCTS.find(x => x.sku === m.sku);
              const pos = m.type === "in" ? +m.qty : m.type === "out" ? -m.qty : 0;
              return (
                <div key={m.id} className="mov-row">
                  <div className="mov-time">{tHHMM(m.ts)}</div>
                  <div className={`mov-icon ${m.type}`}>{m.type === "in" ? "↓" : m.type === "out" ? "↑" : m.type === "mov" ? "⇄" : "±"}</div>
                  <div className="mov-text">
                    <div className="label">{p?.name || m.sku}</div>
                    <div className="meta">{m.type === "in" ? "รับจาก" : m.type === "out" ? "ส่งให้" : m.type === "mov" ? "ย้าย" : "ปรับ"} {m.from} → {m.to} · {m.ref}</div>
                  </div>
                  <div className={`mov-amt ${pos > 0 ? "pos" : pos < 0 ? "neg" : ""}`}>{pos > 0 ? "+" : ""}{m.qty}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title"><span className="live-dot"></span> สินค้าใกล้หมด</div>
            <button className="btn btn-ghost btn-sm">สั่งซื้อทั้งหมด</button>
          </div>
          <div className="card-pad" style={{display:"flex", flexDirection:"column", gap:12}}>
            {lowItems.length === 0 && <div className="empty"><div className="empty-icon"><Icon name="check"/></div>สต๊อกครบทุกรายการ</div>}
            {lowItems.map(p => {
              const pct = Math.min(100, (p.qty / p.reorder) * 100);
              const lvl = stockLevel(p.qty, p.reorder);
              return (
                <div key={p.sku} style={{display:"flex", flexDirection:"column", gap:6}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13.5, fontWeight:500}}>{p.name}</div>
                      <div style={{fontSize:11.5, color:"var(--ink-3)", fontFamily:"var(--font-mono)"}}>{p.sku} · ต่ำสุด {p.reorder}</div>
                    </div>
                    <span className={`chip ${lvl === "out" ? "danger" : "warn"}`}>{p.qty} {p.unit}</span>
                  </div>
                  <div className="bar-track">
                    <div className={`bar-fill ${lvl === "out" ? "danger" : "warn"}`} style={{width: pct + "%"}}/>
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
   Receive (รับเข้า)
   ==================================================================== */
function PageReceive({ stock, setStock, addMov, recents }) {
  const toast = useToast();
  const [supplier, setSupplier] = useState("คุณป้าพร โรงงานต้นน้ำ");
  const [poRef, setPoRef] = useState("PO-" + (2400 + Math.floor(Math.random()*120)));
  const [loc, setLoc] = useState("WH-A");
  const [lines, setLines] = useState([
    { sku: PRODUCTS[1].sku, qty: 200 },
    { sku: PRODUCTS[3].sku, qty: 100 },
  ]);

  const addLine = () => setLines(l => [...l, { sku: PRODUCTS[0].sku, qty: 0 }]);
  const updLine = (i, k, v) => setLines(l => l.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const rmLine = (i) => setLines(l => l.filter((_, idx) => idx !== i));

  const totalQty = lines.reduce((s, l) => s + (+l.qty || 0), 0);
  const totalCost = lines.reduce((s, l) => {
    const p = PRODUCTS.find(x => x.sku === l.sku);
    return s + (p ? p.cost * (+l.qty || 0) : 0);
  }, 0);

  const submit = () => {
    if (!totalQty) { toast.push({ kind:"danger", title:"กรุณาระบุจำนวน" }); return; }
    setStock(prev => {
      const next = { ...prev };
      lines.forEach(l => {
        next[l.sku] = { ...next[l.sku], [loc]: (next[l.sku]?.[loc] || 0) + (+l.qty) };
      });
      return next;
    });
    lines.forEach(l => addMov({ type:"in", sku:l.sku, qty:+l.qty, from: supplier, to: loc, ref: poRef }));
    toast.push({ kind:"success", title:"บันทึกการรับเข้าเรียบร้อย", msg: `${lines.length} รายการ · ${totalQty} หน่วย · ${baht(totalCost)}` });
    setPoRef("PO-" + (2400 + Math.floor(Math.random()*120)));
    setLines([{ sku: PRODUCTS[0].sku, qty: 0 }]);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รับเข้าสินค้า</h1>
          <div className="page-sub">บันทึกการรับสินค้าเข้าคลัง — สต๊อกจะอัปเดตในแต่ละ location อัตโนมัติ</div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <div className="card-title">เอกสารรับเข้า</div>
            <span className="chip accent"><span className="chip-dot"></span>ฉบับใหม่</span>
          </div>
          <div className="card-pad">
            <div className="grid-3 mb-md">
              <div className="field">
                <label className="label">เลขที่เอกสาร</label>
                <input className="input cell-mono" value={poRef} onChange={e=>setPoRef(e.target.value)}/>
              </div>
              <div className="field">
                <label className="label">ผู้ส่ง / Supplier</label>
                <input className="input" value={supplier} onChange={e=>setSupplier(e.target.value)}/>
              </div>
              <div className="field">
                <label className="label">รับเข้าที่</label>
                <select className="select" value={loc} onChange={e=>setLoc(e.target.value)}>
                  {LOCATIONS.filter(l=>l.type!=="vehicle").map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{borderTop:"1px dashed var(--line)", paddingTop:14}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
                <div className="card-title" style={{fontSize:13}}>รายการสินค้า</div>
                <button className="btn btn-sm" onClick={addLine}><Icon name="plus" size={13}/>เพิ่มรายการ</button>
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {lines.map((l, i) => {
                  const p = PRODUCTS.find(x => x.sku === l.sku);
                  return (
                    <div key={i} style={{display:"grid", gridTemplateColumns:"1fr 110px 130px 32px", gap:10, alignItems:"center"}}>
                      <select className="select" value={l.sku} onChange={e=>updLine(i, "sku", e.target.value)}>
                        {PRODUCTS.map(p => <option key={p.sku} value={p.sku}>{p.name}</option>)}
                      </select>
                      <input className="input num" type="number" value={l.qty} onChange={e=>updLine(i, "qty", e.target.value)}/>
                      <div className="cell-mono" style={{textAlign:"right", color:"var(--ink-3)"}}>{p ? baht(p.cost * (+l.qty || 0)) : "-"}</div>
                      <button className="icon-btn" onClick={()=>rmLine(i)} style={{width:32, height:32}}><Icon name="x" size={14}/></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:18, paddingTop:14, borderTop:"1px solid var(--line)"}}>
              <div style={{display:"flex", gap:24}}>
                <div>
                  <div style={{fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.08em"}}>จำนวนรวม</div>
                  <div style={{fontSize:22, fontWeight:600, fontFamily:"var(--font-mono)"}}>{fmt(totalQty)}</div>
                </div>
                <div>
                  <div style={{fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.08em"}}>ต้นทุนรวม</div>
                  <div style={{fontSize:22, fontWeight:600, fontFamily:"var(--font-mono)"}}>{baht(totalCost)}</div>
                </div>
              </div>
              <div style={{display:"flex", gap:8}}>
                <button className="btn">บันทึกร่าง</button>
                <button className="btn btn-accent" onClick={submit}><Icon name="check" size={15}/> ยืนยันรับเข้า</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">รับเข้าล่าสุด</div>
          </div>
          <div>
            {recents.filter(m => m.type === "in").slice(0, 8).map(m => {
              const p = PRODUCTS.find(x => x.sku === m.sku);
              return (
                <div key={m.id} className="mov-row" style={{gridTemplateColumns:"56px 28px 1fr auto"}}>
                  <div className="mov-time">{tHHMM(m.ts)}</div>
                  <div className="mov-icon in">↓</div>
                  <div className="mov-text">
                    <div className="label">{p?.name}</div>
                    <div className="meta">{m.from} → {m.to}</div>
                  </div>
                  <div className="mov-amt pos">+{m.qty}</div>
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
   Issue (เบิก)
   ==================================================================== */
function PageIssue({ stock, setStock, addMov, recents }) {
  const toast = useToast();
  const [purpose, setPurpose] = useState("ขายให้ลูกค้า");
  const [cust, setCust] = useState(CUSTOMERS[1].id);
  const [from, setFrom] = useState("WH-A");
  const [ref, setRef] = useState("SO-" + (5800 + Math.floor(Math.random()*200)));
  const [lines, setLines] = useState([{ sku: PRODUCTS[1].sku, qty: 12 }]);

  const updLine = (i, k, v) => setLines(l => l.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addLine = () => setLines(l => [...l, { sku: PRODUCTS[0].sku, qty: 0 }]);
  const rmLine = i => setLines(l => l.filter((_, idx) => idx !== i));

  const totalQty = lines.reduce((s,l) => s + (+l.qty || 0), 0);
  const totalAmt = lines.reduce((s,l) => {
    const p = PRODUCTS.find(x => x.sku === l.sku);
    return s + (p ? p.price * (+l.qty || 0) : 0);
  }, 0);

  const checkAvail = (sku, qty) => (stock[sku]?.[from] || 0) >= qty;

  const submit = () => {
    for (const l of lines) {
      if (!checkAvail(l.sku, +l.qty)) {
        toast.push({ kind:"danger", title:"สต๊อกไม่พอ", msg: `${PRODUCTS.find(p=>p.sku===l.sku).name} ใน ${from} เหลือ ${stock[l.sku]?.[from] || 0}` });
        return;
      }
    }
    setStock(prev => {
      const next = { ...prev };
      lines.forEach(l => {
        next[l.sku] = { ...next[l.sku], [from]: (next[l.sku]?.[from] || 0) - (+l.qty) };
      });
      return next;
    });
    const customer = CUSTOMERS.find(c => c.id === cust);
    lines.forEach(l => addMov({ type:"out", sku:l.sku, qty:+l.qty, from, to: customer.name, ref }));
    toast.push({ kind:"success", title:"บันทึกการเบิกเรียบร้อย", msg: `${lines.length} รายการ · ${baht(totalAmt)} · ${customer.name}` });
    setRef("SO-" + (5800 + Math.floor(Math.random()*200)));
    setLines([{ sku: PRODUCTS[0].sku, qty: 0 }]);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">เบิกสินค้า</h1>
          <div className="page-sub">เบิกออกจาก location — ระบบจะตรวจสอบสต๊อกและตัดอัตโนมัติ</div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <div className="card-title">เอกสารเบิก</div>
            <div className="seg">
              <button className={purpose==="ขายให้ลูกค้า"?"on":""} onClick={()=>setPurpose("ขายให้ลูกค้า")}>ขายให้ลูกค้า</button>
              <button className={purpose==="โอนภายใน"?"on":""} onClick={()=>setPurpose("โอนภายใน")}>โอนภายใน</button>
              <button className={purpose==="ตัวอย่าง/แจก"?"on":""} onClick={()=>setPurpose("ตัวอย่าง/แจก")}>ตัวอย่าง/แจก</button>
            </div>
          </div>
          <div className="card-pad">
            <div className="grid-3 mb-md">
              <div className="field">
                <label className="label">เลขที่เอกสาร</label>
                <input className="input cell-mono" value={ref} onChange={e=>setRef(e.target.value)}/>
              </div>
              <div className="field">
                <label className="label">เบิกจาก</label>
                <select className="select" value={from} onChange={e=>setFrom(e.target.value)}>
                  {LOCATIONS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">{purpose === "ขายให้ลูกค้า" ? "ลูกค้า" : "ปลายทาง"}</label>
                {purpose === "ขายให้ลูกค้า" ? (
                  <select className="select" value={cust} onChange={e=>setCust(e.target.value)}>
                    {CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  <select className="select">
                    {LOCATIONS.filter(l => l.code !== from).map(l => <option key={l.code}>{l.name}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div style={{borderTop:"1px dashed var(--line)", paddingTop:14}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
                <div className="card-title" style={{fontSize:13}}>รายการสินค้า</div>
                <button className="btn btn-sm" onClick={addLine}><Icon name="plus" size={13}/>เพิ่มรายการ</button>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {lines.map((l, i) => {
                  const p = PRODUCTS.find(x => x.sku === l.sku);
                  const avail = stock[l.sku]?.[from] || 0;
                  const ok = +l.qty <= avail;
                  return (
                    <div key={i} style={{display:"grid", gridTemplateColumns:"1fr 110px 100px 130px 32px", gap:10, alignItems:"center"}}>
                      <select className="select" value={l.sku} onChange={e=>updLine(i, "sku", e.target.value)}>
                        {PRODUCTS.map(p => <option key={p.sku} value={p.sku}>{p.name}</option>)}
                      </select>
                      <input className={`input num ${ok ? "" : ""}`} style={!ok ? {borderColor:"var(--danger)"} : {}} type="number" value={l.qty} onChange={e=>updLine(i, "qty", e.target.value)}/>
                      <span className={`chip ${ok ? "" : "danger"}`} style={{justifySelf:"start"}}>คงเหลือ {avail}</span>
                      <div className="cell-mono" style={{textAlign:"right", color:"var(--ink-3)"}}>{p ? baht(p.price * (+l.qty || 0)) : "-"}</div>
                      <button className="icon-btn" onClick={()=>rmLine(i)} style={{width:32, height:32}}><Icon name="x" size={14}/></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:18, paddingTop:14, borderTop:"1px solid var(--line)"}}>
              <div style={{display:"flex", gap:24}}>
                <div>
                  <div style={{fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.08em"}}>จำนวนรวม</div>
                  <div style={{fontSize:22, fontWeight:600, fontFamily:"var(--font-mono)"}}>{fmt(totalQty)}</div>
                </div>
                <div>
                  <div style={{fontSize:11.5, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.08em"}}>มูลค่าขาย</div>
                  <div style={{fontSize:22, fontWeight:600, fontFamily:"var(--font-mono)"}}>{baht(totalAmt)}</div>
                </div>
              </div>
              <div style={{display:"flex", gap:8}}>
                <button className="btn">บันทึกร่าง</button>
                <button className="btn btn-accent" onClick={submit}><Icon name="out" size={15}/> ยืนยันเบิก</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">เบิกล่าสุด</div>
          </div>
          <div>
            {recents.filter(m => m.type === "out").slice(0, 8).map(m => {
              const p = PRODUCTS.find(x => x.sku === m.sku);
              return (
                <div key={m.id} className="mov-row" style={{gridTemplateColumns:"56px 28px 1fr auto"}}>
                  <div className="mov-time">{tHHMM(m.ts)}</div>
                  <div className="mov-icon out">↑</div>
                  <div className="mov-text">
                    <div className="label">{p?.name}</div>
                    <div className="meta">{m.from} → {m.to}</div>
                  </div>
                  <div className="mov-amt neg">−{m.qty}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

window.IM_Pages1 = { PageDashboard, PageReceive, PageIssue };
