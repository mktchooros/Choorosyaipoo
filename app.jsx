/* global React, ReactDOM */
const { useState, useEffect, useCallback, useMemo } = React;
const { Icon, ToastHost, seedStock, seedMovements, seedTodayOrders } = window.IM;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakToggle } = window;
const { PageDashboard, PageReceive, PageIssue } = window.IM_Pages1;
const { PageStock, PageItemDetail, PageLocations } = window.IM_Pages2;
const { PageCustomers, PageSales, PageInventoryReport, PageMovementReport } = window.IM_Pages3;
const { PageProducts, PageMonthlySales, PageYearlySales } = window.IM_Pages4;
const { ScannerModal } = window.IM_Scanner;

const NAV = [
  { id: "dashboard",   label: "ภาพรวม",          icon: "dashboard", section: "หลัก" },
  { id: "receive",     label: "รับเข้า",          icon: "in",        section: "ดำเนินการ" },
  { id: "issue",       label: "เบิกสินค้า",       icon: "out",       section: "ดำเนินการ" },
  { id: "products",    label: "รายชื่อสินค้า",      icon: "stack",     section: "คลัง" },
  { id: "stock",       label: "สต๊อกสินค้า",      icon: "box",       section: "คลัง" },
  { id: "locations",   label: "Locations",        icon: "loc",       section: "คลัง" },
  { id: "customers",   label: "ลูกค้า",            icon: "users",     section: "ข้อมูล" },
  { id: "sales",       label: "ยอดขาย-วัน",      icon: "chart",     section: "รายงาน" },
  { id: "monthly",     label: "ยอดขาย-เดือน",    icon: "chart",     section: "รายงาน" },
  { id: "yearly",      label: "ยอดขาย-ปี",         icon: "chart",     section: "รายงาน" },
  { id: "inventory",   label: "สินค้าคงเหลือ",    icon: "stack",     section: "รายงาน" },
  { id: "movements",   label: "การเคลื่อนไหว",    icon: "shuffle",   section: "รายงาน" },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#D85C36",
  "density": "comfortable",
  "showLiveDots": true
}/*EDITMODE-END*/;

function App() {
  const [page, setPage] = useState("dashboard");
  const [itemSku, setItemSku] = useState(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [stock, setStock] = useState(seedStock);
  const [movs, setMovs] = useState(seedMovements);
  const [orders] = useState(seedTodayOrders);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
  }, [t.theme]);

  useEffect(() => {
    if (t.accent) document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.density]);

  useEffect(() => {
    document.documentElement.setAttribute("data-live-dots", t.showLiveDots ? "on" : "off");
  }, [t.showLiveDots]);

  const addMov = useCallback((m) => {
    setMovs(prev => [{
      id: "M" + Date.now(),
      ts: Date.now(),
      by: "ยายปู",
      ...m,
    }, ...prev]);
  }, []);

  const go = useCallback((p) => {
    setPage(p);
    setItemSku(null);
  }, []);

  const openItem = useCallback((sku) => {
    setItemSku(sku);
    setPage("itemDetail");
  }, []);

  const lowCount = useMemo(() => {
    let n = 0;
    window.IM.PRODUCTS.forEach(p => {
      const total = Object.values(stock[p.sku] || {}).reduce((s, v) => s + v, 0);
      if (total <= p.reorder) n++;
    });
    return n;
  }, [stock]);

  const sections = [...new Set(NAV.map(n => n.section))];

  let pageEl = null;
  switch (page) {
    case "dashboard":  pageEl = <PageDashboard stock={stock} orders={orders} movs={movs} go={go}/>; break;
    case "receive":    pageEl = <PageReceive stock={stock} setStock={setStock} addMov={addMov} recents={movs}/>; break;
    case "issue":      pageEl = <PageIssue stock={stock} setStock={setStock} addMov={addMov} recents={movs}/>; break;
    case "stock":      pageEl = <PageStock stock={stock} go={go} openItem={openItem}/>; break;
    case "itemDetail": pageEl = <PageItemDetail sku={itemSku} stock={stock} movs={movs} back={() => go("stock")}/>; break;
    case "locations":  pageEl = <PageLocations stock={stock} movs={movs}/>; break;
    case "customers":  pageEl = <PageCustomers/>; break;
    case "products":   pageEl = <PageProducts/>; break;
    case "sales":      pageEl = <PageSales orders={orders}/>; break;
    case "monthly":    pageEl = <PageMonthlySales/>; break;
    case "yearly":     pageEl = <PageYearlySales/>; break;
    case "inventory":  pageEl = <PageInventoryReport stock={stock}/>; break;
    case "movements":  pageEl = <PageMovementReport movs={movs}/>; break;
    default:           pageEl = <PageDashboard stock={stock} orders={orders} movs={movs} go={go}/>;
  }

  const breadcrumb = page === "itemDetail"
    ? "สต๊อกสินค้า · รายละเอียด"
    : (NAV.find(n => n.id === page)?.label || "ภาพรวม");

  return (
    <ToastHost>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"><img src="assets/logo.png" alt="ชูรสยายปู"/></div>
            <div className="brand-text">
              <div className="brand-name">ชูรสยายปู</div>
              <div className="brand-sub">Stock Suite</div>
            </div>
          </div>

          {sections.map(sec => (
            <React.Fragment key={sec}>
              <div className="nav-section">{sec}</div>
              {NAV.filter(n => n.section === sec).map(n => (
                <div
                  key={n.id}
                  className={`nav-item ${page === n.id || (page === "itemDetail" && n.id === "stock") ? "active" : ""}`}
                  onClick={() => go(n.id)}
                  data-screen-label={n.label}
                >
                  <span className="icon"><Icon name={n.icon} size={17}/></span>
                  <span>{n.label}</span>
                  {n.id === "stock" && lowCount > 0 && (
                    <span className="badge-count">{lowCount}</span>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}

          <div className="sidebar-footer">
            <div className="user-pill">
              <div className="user-avatar" style={{padding:0, overflow:"hidden", background:"oklch(0.96 0.02 70)"}}>
                <img src="assets/logo.png" alt="" style={{width:"140%", height:"140%", objectFit:"cover", objectPosition:"center 30%"}}/>
              </div>
              <div className="user-meta">
                <div className="user-name">ยายปู (เจ้าของ)</div>
                <div className="user-role">ผู้ดูแลระบบ</div>
              </div>
              <div className="spacer"></div>
              <Icon name="settings" size={15}/>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="crumb">
              <Icon name="dashboard" size={14}/>
              <span>ระบบสต๊อก</span>
              <span className="crumb-sep">/</span>
              <span className="here">{breadcrumb}</span>
            </div>
            <div className="topbar-search">
              <Icon name="search" size={15}/>
              <input placeholder="ค้นหาสินค้า, ลูกค้า, เลขที่เอกสาร..."/>
              <kbd>⌘K</kbd>
            </div>
            <div className="topbar-actions">
              <button className="icon-btn" title="แจ้งเตือน">
                <Icon name="bell" size={16}/>
                <span className="dot"></span>
              </button>
              <button
                className="icon-btn"
                onClick={() => setTweak("theme", t.theme === "light" ? "dark" : "light")}
                title="สลับธีม"
                style={{fontSize: 14}}
              >
                {t.theme === "light" ? "🌙" : "☀"}
              </button>
              <button className="btn btn-sm" onClick={()=>setScanOpen(true)} title="สแกนบาร์โค้ด">
                <Icon name="scan" size={14}/> สแกน
              </button>
              <button className="btn btn-accent btn-sm" onClick={() => go("receive")}>
                <Icon name="plus" size={14}/> บันทึกใหม่
              </button>
            </div>
          </div>

          <div key={page + (itemSku || "")}>
            {pageEl}
          </div>
        </main>

        <ScannerModal
          open={scanOpen}
          onClose={()=>setScanOpen(false)}
          onScan={({ action, product }) => {
            if (action === "detail") { openItem(product.sku); }
            else if (action === "receive") { go("receive"); }
            else if (action === "issue") { go("issue"); }
          }}
        />

        <TweaksPanel title="Tweaks">
          <TweakSection label="ธีม">
            <TweakRadio
              label="โหมดสี"
              value={t.theme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark",  label: "Dark"  },
              ]}
              onChange={v => setTweak("theme", v)}
            />
            <TweakColor
              label="สีเน้น"
              value={t.accent}
              options={["#D85C36", "#2A6FDB", "#16A34A", "#7C3AED", "#0891B2"]}
              onChange={v => setTweak("accent", v)}
            />
          </TweakSection>

          <TweakSection label="การแสดงผล">
            <TweakRadio
              label="ความหนาแน่น"
              value={t.density}
              options={[
                { value: "compact",     label: "Compact"  },
                { value: "comfortable", label: "ปกติ"     },
                { value: "spacious",    label: "โปร่ง"    },
              ]}
              onChange={v => setTweak("density", v)}
            />
            <TweakToggle
              label="Live indicator dots"
              value={t.showLiveDots}
              onChange={v => setTweak("showLiveDots", v)}
            />
          </TweakSection>
        </TweaksPanel>
      </div>
    </ToastHost>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
