/* global React */
const { useState, useMemo } = React;
const {
  PRODUCTS, MONTH_TH, seedMonthlySales, seedYearlySales,
  fmt, baht, Counter, Sparkline, BarChart, Icon, useToast,
  ProductImage,
} = window.IM;

/* ====================================================================
   Product Master List (รายชื่อสินค้า) — full catalog with edit
   ==================================================================== */
function PageProducts() {
  const toast = useToast();
  const [products, setProducts] = useState(PRODUCTS);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ทั้งหมด");
  const [sort, setSort] = useState("sku");
  const [editing, setEditing] = useState(null);   // sku of row in edit mode
  const [draft, setDraft] = useState(null);

  const cats = ["ทั้งหมด", ...new Set(products.map(p => p.cat))];

  const filtered = useMemo(() => {
    let arr = products.filter(p => {
      if (cat !== "ทั้งหมด" && p.cat !== cat) return false;
      if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
    arr = [...arr].sort((a, b) => {
      if (sort === "sku")    return a.sku.localeCompare(b.sku);
      if (sort === "name")   return a.name.localeCompare(b.name, "th");
      if (sort === "price")  return b.price - a.price;
      if (sort === "margin") return ((b.price - b.cost) / b.price) - ((a.price - a.cost) / a.price);
      return 0;
    });
    return arr;
  }, [products, q, cat, sort]);

  const startEdit = (p) => {
    setEditing(p.sku);
    setDraft({ ...p });
  };
  const saveEdit = () => {
    setProducts(prev => prev.map(p => p.sku === editing ? { ...draft, price: +draft.price, cost: +draft.cost, reorder: +draft.reorder } : p));
    setEditing(null);
    setDraft(null);
    toast("บันทึกข้อมูลสินค้าเรียบร้อย", "success");
  };
  const cancelEdit = () => {
    setEditing(null);
    setDraft(null);
  };

  const stats = {
    total: products.length,
    cats: new Set(products.map(p => p.cat)).size,
    avgMargin: products.reduce((s, p) => s + (p.price - p.cost) / p.price, 0) / products.length,
    totalValue: products.reduce((s, p) => s + p.price, 0),
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายชื่อสินค้า</h1>
          <div className="page-sub">ทะเบียนสินค้าทั้งหมด · แก้ไขราคา ต้นทุน หมวดหมู่ และจุดสั่งซื้อ</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={15}/>ส่งออก CSV</button>
          <button className="btn btn-accent"><Icon name="plus" size={15}/>เพิ่มสินค้าใหม่</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">สินค้าทั้งหมด</div>
          <div className="kpi-value"><Counter value={stats.total}/></div>
          <div className="kpi-meta">{stats.cats} หมวดหมู่</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">มาร์จิ้นเฉลี่ย</div>
          <div className="kpi-value">{(stats.avgMargin * 100).toFixed(1)}%</div>
          <div className="kpi-meta">กำไรขั้นต้นต่อหน่วย</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">ราคาขายรวม</div>
          <div className="kpi-value">{baht(stats.totalValue)}</div>
          <div className="kpi-meta">ผลรวมของ price list</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">สถานะ</div>
          <div className="kpi-value" style={{color:"var(--ok)"}}>Active</div>
          <div className="kpi-meta">ขายได้ทุกรายการ</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head" style={{flexWrap:"wrap", gap:12}}>
          <div className="card-title">ทะเบียนสินค้า ({filtered.length})</div>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            <div className="search-box">
              <Icon name="search" size={14}/>
              <input placeholder="ค้นหา SKU หรือชื่อ..." value={q} onChange={e=>setQ(e.target.value)}/>
            </div>
            <select className="select" value={cat} onChange={e=>setCat(e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="seg">
              {[["sku","SKU"],["name","ชื่อ"],["price","ราคา"],["margin","กำไร"]].map(([v,l]) => (
                <button key={v} className={sort===v?"on":""} onClick={()=>setSort(v)}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table prod-table">
            <thead>
              <tr>
                <th style={{width:60}}>รูป</th>
                <th style={{width:90}}>SKU</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th style={{width:90}}>หน่วย</th>
                <th style={{textAlign:"right", width:110}}>ต้นทุน</th>
                <th style={{textAlign:"right", width:110}}>ราคาขาย</th>
                <th style={{textAlign:"right", width:90}}>กำไร %</th>
                <th style={{textAlign:"right", width:90}}>Reorder</th>
                <th style={{width:120}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const isEdit = editing === p.sku;
                const margin = ((p.price - p.cost) / p.price) * 100;
                const d = isEdit ? draft : p;
                return (
                  <tr key={p.sku} style={{animationDelay: `${i * 18}ms`}} className={isEdit ? "row-editing" : ""}>
                    <td><ProductImage sku={p.sku} size={40} rounded={6}/></td>
                    <td><span className="sku-pill">{p.sku}</span></td>
                    <td>
                      {isEdit
                        ? <input className="cell-input" value={d.name} onChange={e=>setDraft({...d, name:e.target.value})}/>
                        : <div className="prod-name">{p.name}</div>}
                    </td>
                    <td>
                      {isEdit
                        ? <input className="cell-input" value={d.cat} onChange={e=>setDraft({...d, cat:e.target.value})}/>
                        : <span className="cat-tag">{p.cat}</span>}
                    </td>
                    <td>
                      {isEdit
                        ? <input className="cell-input" value={d.unit} onChange={e=>setDraft({...d, unit:e.target.value})}/>
                        : <span className="unit-text">{p.unit}</span>}
                    </td>
                    <td style={{textAlign:"right"}}>
                      {isEdit
                        ? <input className="cell-input num" type="number" value={d.cost} onChange={e=>setDraft({...d, cost:e.target.value})}/>
                        : <span className="num-cell">{baht(p.cost)}</span>}
                    </td>
                    <td style={{textAlign:"right"}}>
                      {isEdit
                        ? <input className="cell-input num" type="number" value={d.price} onChange={e=>setDraft({...d, price:e.target.value})}/>
                        : <span className="num-cell strong">{baht(p.price)}</span>}
                    </td>
                    <td style={{textAlign:"right"}}>
                      <span className={`margin-pill ${margin >= 50 ? "high" : margin >= 25 ? "mid" : "low"}`}>
                        {isFinite(margin) ? margin.toFixed(0) : 0}%
                      </span>
                    </td>
                    <td style={{textAlign:"right"}}>
                      {isEdit
                        ? <input className="cell-input num" type="number" value={d.reorder} onChange={e=>setDraft({...d, reorder:e.target.value})}/>
                        : <span className="num-cell muted">{fmt(p.reorder)}</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        {isEdit ? (
                          <>
                            <button className="btn-mini btn-mini-accent" onClick={saveEdit}>บันทึก</button>
                            <button className="btn-mini" onClick={cancelEdit}>ยกเลิก</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-mini" onClick={()=>startEdit(p)}><Icon name="edit" size={12}/>แก้ไข</button>
                            <button className="btn-mini btn-mini-ghost" title="ลบ"><Icon name="x" size={12}/></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   Monthly Sales Report (รายงานยอดขายรายเดือน)
   ==================================================================== */
function PageMonthlySales() {
  const rows = seedMonthlySales;
  const [year, setYear] = useState(2026);
  const [view, setView] = useState("chart"); // chart | table

  const years = [...new Set(rows.map(r => r.year))].sort((a,b)=>b-a);
  const yearRows = rows.filter(r => r.year === year);
  const prevYearRows = rows.filter(r => r.year === year - 1);

  const ytd = {
    revenue: yearRows.reduce((s, r) => s + r.revenue, 0),
    cost:    yearRows.reduce((s, r) => s + r.cost, 0),
    profit:  yearRows.reduce((s, r) => s + r.profit, 0),
    orders:  yearRows.reduce((s, r) => s + r.orders, 0),
  };
  const prevYtd = {
    revenue: prevYearRows.slice(0, yearRows.length).reduce((s, r) => s + r.revenue, 0),
  };
  const yoy = prevYtd.revenue ? ((ytd.revenue - prevYtd.revenue) / prevYtd.revenue) * 100 : 0;

  const maxRev = Math.max(...yearRows.map(r => r.revenue));
  const bestMonth = yearRows.find(r => r.revenue === maxRev);

  // bar chart data — current year vs previous year
  const chartData = MONTH_TH.map((label, i) => {
    const cur = yearRows.find(r => r.month === i);
    const prev = prevYearRows.find(r => r.month === i);
    return { label, cur: cur ? cur.revenue : 0, prev: prev ? prev.revenue : 0 };
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานยอดขายรายเดือน</h1>
          <div className="page-sub">ยอดขายแยกตามเดือน · เปรียบเทียบกับปีก่อนหน้า</div>
        </div>
        <div className="page-actions">
          <select className="select" value={year} onChange={e=>setYear(+e.target.value)}>
            {years.map(y => <option key={y} value={y}>ปี {y + 543}</option>)}
          </select>
          <button className="btn"><Icon name="download" size={15}/>PDF</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">ยอดขายรวม</div>
          <div className="kpi-value">{baht(ytd.revenue)}</div>
          <div className={`kpi-meta ${yoy >= 0 ? "up" : "down"}`}>
            {yoy >= 0 ? "▲" : "▼"} {Math.abs(yoy).toFixed(1)}% YoY
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">กำไรขั้นต้น</div>
          <div className="kpi-value">{baht(ytd.profit)}</div>
          <div className="kpi-meta">{((ytd.profit / ytd.revenue) * 100).toFixed(1)}% margin</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">จำนวนออเดอร์</div>
          <div className="kpi-value"><Counter value={ytd.orders}/></div>
          <div className="kpi-meta">เฉลี่ย {Math.round(ytd.orders/yearRows.length)} ออเดอร์/เดือน</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">เดือนที่ขายดีที่สุด</div>
          <div className="kpi-value" style={{fontSize:24}}>{bestMonth?.label}</div>
          <div className="kpi-meta">{baht(bestMonth?.revenue || 0)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">ยอดขายรายเดือน — ปี {year + 543}</div>
          <div className="seg">
            <button className={view==="chart"?"on":""} onClick={()=>setView("chart")}>กราฟ</button>
            <button className={view==="table"?"on":""} onClick={()=>setView("table")}>ตาราง</button>
          </div>
        </div>

        {view === "chart" ? (
          <div className="card-pad">
            <div className="legend-row">
              <span className="legend-dot" style={{background:"var(--accent)"}}></span> ปี {year + 543}
              <span className="legend-dot" style={{background:"var(--line-2)", marginLeft:18}}></span> ปี {year + 543 - 1}
            </div>
            <div className="dual-bars">
              {chartData.map((d, i) => {
                const max = Math.max(...chartData.flatMap(x => [x.cur, x.prev])) || 1;
                const hCur = (d.cur / max) * 100;
                const hPrev = (d.prev / max) * 100;
                return (
                  <div key={i} className="dual-bar-col">
                    <div className="dual-bar-stack">
                      <div className="dual-bar-bg" style={{height: `${hPrev}%`}} title={`ปีก่อน: ${baht(d.prev)}`}>
                        {d.prev > 0 && <span className="dual-bar-prev-label">{(d.prev/1000).toFixed(0)}k</span>}
                      </div>
                      <div className="dual-bar-fg" style={{height: `${hCur}%`, animationDelay: `${i*60}ms`}} title={`${d.label}: ${baht(d.cur)}`}>
                        {d.cur > 0 && <span className="dual-bar-cur-label">{(d.cur/1000).toFixed(0)}k</span>}
                      </div>
                    </div>
                    <div className="dual-bar-label">{d.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>เดือน</th>
                  <th style={{textAlign:"right"}}>ยอดขาย</th>
                  <th style={{textAlign:"right"}}>ต้นทุน</th>
                  <th style={{textAlign:"right"}}>กำไร</th>
                  <th style={{textAlign:"right"}}>มาร์จิ้น %</th>
                  <th style={{textAlign:"right"}}>ออเดอร์</th>
                  <th style={{textAlign:"right"}}>หน่วย</th>
                  <th style={{textAlign:"right", width:160}}>เทียบปีก่อน</th>
                </tr>
              </thead>
              <tbody>
                {yearRows.map((r, i) => {
                  const prev = prevYearRows.find(p => p.month === r.month);
                  const yoyM = prev ? ((r.revenue - prev.revenue) / prev.revenue) * 100 : null;
                  return (
                    <tr key={r.ym} style={{animationDelay: `${i*30}ms`}}>
                      <td><strong>{r.label}</strong></td>
                      <td style={{textAlign:"right"}} className="num-cell strong">{baht(r.revenue)}</td>
                      <td style={{textAlign:"right"}} className="num-cell">{baht(r.cost)}</td>
                      <td style={{textAlign:"right"}} className="num-cell" style={{color:"var(--ok)", textAlign:"right"}}>{baht(r.profit)}</td>
                      <td style={{textAlign:"right"}}>{((r.profit/r.revenue)*100).toFixed(1)}%</td>
                      <td style={{textAlign:"right"}} className="num-cell muted">{fmt(r.orders)}</td>
                      <td style={{textAlign:"right"}} className="num-cell muted">{fmt(r.units)}</td>
                      <td style={{textAlign:"right"}}>
                        {yoyM !== null ? (
                          <span className={`yoy-pill ${yoyM >= 0 ? "up" : "down"}`}>
                            {yoyM >= 0 ? "▲" : "▼"} {Math.abs(yoyM).toFixed(1)}%
                          </span>
                        ) : <span className="muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>รวม</strong></td>
                  <td style={{textAlign:"right"}}><strong>{baht(ytd.revenue)}</strong></td>
                  <td style={{textAlign:"right"}}>{baht(ytd.cost)}</td>
                  <td style={{textAlign:"right", color:"var(--ok)"}}><strong>{baht(ytd.profit)}</strong></td>
                  <td style={{textAlign:"right"}}>{((ytd.profit/ytd.revenue)*100).toFixed(1)}%</td>
                  <td style={{textAlign:"right"}}>{fmt(ytd.orders)}</td>
                  <td></td>
                  <td style={{textAlign:"right"}}>
                    <span className={`yoy-pill ${yoy >= 0 ? "up" : "down"}`}>
                      {yoy >= 0 ? "▲" : "▼"} {Math.abs(yoy).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================================================================
   Yearly Sales Report (รายงานยอดขายรายปี)
   ==================================================================== */
function PageYearlySales() {
  const rows = seedYearlySales; // descending by year
  const [view, setView] = useState("overview"); // overview | category

  // Sort ascending for chart
  const chartRows = [...rows].sort((a,b)=>a.year - b.year);
  const maxRev = Math.max(...chartRows.map(r => r.revenue));
  const totalAll = rows.reduce((s, r) => s + r.revenue, 0);
  const profitAll = rows.reduce((s, r) => s + r.profit, 0);

  // Latest year vs previous
  const latest = rows[0];
  const prev = rows[1];
  const yoy = prev ? ((latest.revenue - prev.revenue) / prev.revenue) * 100 : 0;

  // All categories present across all years
  const allCats = [...new Set(rows.flatMap(r => Object.keys(r.byCat)))];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">รายงานยอดขายรายปี</h1>
          <div className="page-sub">ภาพรวมหลายปี · แนวโน้มและการเติบโต</div>
        </div>
        <div className="page-actions">
          <button className="btn"><Icon name="download" size={15}/>ส่งออก</button>
          <button className="btn"><Icon name="settings" size={15}/>ตั้งเป้าหมาย</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">ยอดขายปีปัจจุบัน</div>
          <div className="kpi-value">{baht(latest.revenue)}</div>
          <div className={`kpi-meta ${yoy >= 0 ? "up" : "down"}`}>
            {yoy >= 0 ? "▲" : "▼"} {Math.abs(yoy).toFixed(1)}% เทียบปีก่อน
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">รวมทุกปี</div>
          <div className="kpi-value">{baht(totalAll)}</div>
          <div className="kpi-meta">{rows.length} ปี · {(profitAll/totalAll*100).toFixed(1)}% margin</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">เฉลี่ยต่อเดือน (ปี {latest.label})</div>
          <div className="kpi-value">{baht(latest.avgMonth)}</div>
          <div className="kpi-meta">จาก {latest.months} เดือน</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">เดือนที่ดีที่สุด</div>
          <div className="kpi-value" style={{fontSize:24}}>{MONTH_TH[latest.bestMonth]} {latest.label.slice(-2)}</div>
          <div className="kpi-meta">{baht(latest.byMonth[latest.bestMonth])}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">แนวโน้มยอดขายต่อปี</div>
            <div className="seg">
              <button className={view==="overview"?"on":""} onClick={()=>setView("overview")}>ภาพรวม</button>
              <button className={view==="category"?"on":""} onClick={()=>setView("category")}>ตามหมวด</button>
            </div>
          </div>
          <div className="card-pad">
            {view === "overview" ? (
              <div className="year-bars">
                {chartRows.map((r, i) => {
                  const h = (r.revenue / maxRev) * 100;
                  const hP = (r.profit / maxRev) * 100;
                  return (
                    <div key={r.year} className="year-bar-col">
                      <div className="year-bar-stack">
                        <div className="year-bar-rev" style={{height: `${h}%`, animationDelay: `${i*120}ms`}}>
                          <span className="year-bar-val">{baht(r.revenue)}</span>
                        </div>
                        <div className="year-bar-profit" style={{height: `${hP}%`, animationDelay: `${i*120 + 60}ms`}}/>
                      </div>
                      <div className="year-bar-label">
                        <strong>{r.label}</strong>
                        <span>{r.months < 12 ? `${r.months} เดือน` : "เต็มปี"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cat-stacks">
                {chartRows.map((r, i) => {
                  const total = r.revenue;
                  let acc = 0;
                  return (
                    <div key={r.year} className="cat-stack-row">
                      <div className="cat-stack-year">
                        <strong>{r.label}</strong>
                        <span>{baht(r.revenue)}</span>
                      </div>
                      <div className="cat-stack-bar">
                        {allCats.map((c, ci) => {
                          const v = r.byCat[c] || 0;
                          if (!v) return null;
                          const w = (v / total) * 100;
                          const left = (acc / total) * 100;
                          acc += v;
                          return (
                            <div key={c} className="cat-stack-seg"
                              style={{
                                left: `${left}%`,
                                width: `${w}%`,
                                background: `oklch(${0.55 + (ci*0.06)%0.3} ${0.13 - (ci*0.01)} ${(38 + ci*48) % 360})`,
                                animationDelay: `${i*100 + ci*40}ms`,
                              }}
                              title={`${c}: ${baht(v)} (${w.toFixed(1)}%)`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="cat-legend">
                  {allCats.slice(0, 6).map((c, ci) => (
                    <span key={c} className="cat-legend-item">
                      <span className="legend-dot" style={{background: `oklch(${0.55 + (ci*0.06)%0.3} ${0.13 - (ci*0.01)} ${(38 + ci*48) % 360})`}}></span>
                      {c.length > 28 ? c.slice(0, 28) + "…" : c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">สรุปรายปี</div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ปี</th>
                  <th style={{textAlign:"right"}}>ยอดขาย</th>
                  <th style={{textAlign:"right"}}>กำไร</th>
                  <th style={{textAlign:"right"}}>ออเดอร์</th>
                  <th style={{textAlign:"right"}}>เติบโต</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const prevR = rows[i + 1];
                  const g = prevR ? ((r.revenue - prevR.revenue) / prevR.revenue) * 100 : null;
                  return (
                    <tr key={r.year}>
                      <td>
                        <div style={{display:"flex", alignItems:"center", gap:8}}>
                          <strong>{r.label}</strong>
                          {r.months < 12 && <span className="cat-tag" style={{fontSize:10}}>{r.months}ด.</span>}
                        </div>
                      </td>
                      <td style={{textAlign:"right"}} className="num-cell strong">{baht(r.revenue)}</td>
                      <td style={{textAlign:"right"}} className="num-cell" style={{color:"var(--ok)", textAlign:"right"}}>{baht(r.profit)}</td>
                      <td style={{textAlign:"right"}} className="num-cell muted">{fmt(r.orders)}</td>
                      <td style={{textAlign:"right"}}>
                        {g !== null ? (
                          <span className={`yoy-pill ${g >= 0 ? "up" : "down"}`}>
                            {g >= 0 ? "▲" : "▼"} {Math.abs(g).toFixed(1)}%
                          </span>
                        ) : <span className="muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

window.IM_Pages4 = { PageProducts, PageMonthlySales, PageYearlySales };
