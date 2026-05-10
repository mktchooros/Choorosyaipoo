/* global React */
const { useState, useEffect, useRef, useMemo } = React;
const { PRODUCTS, baht, Icon, useToast, stockTotal } = window.IM;

/* ====================================================================
   Barcode Scanner — camera (BarcodeDetector) + manual entry + recents
   ==================================================================== */

const SCAN_HISTORY_KEY = "yp.scan.history";

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(SCAN_HISTORY_KEY) || "[]"); }
  catch { return []; }
}
function pushHistory(entry) {
  const arr = [entry, ...loadHistory().filter(e => e.code !== entry.code)].slice(0, 20);
  try { localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(arr)); } catch {}
  return arr;
}

function findByBarcode(code) {
  const c = String(code).trim();
  return PRODUCTS.find(p => p.barcode === c)
      || PRODUCTS.find(p => p.sku.toLowerCase() === c.toLowerCase())
      || PRODUCTS.find(p => p.barcode && p.barcode.endsWith(c) && c.length >= 6);
}

/* SVG renderer for an EAN-13 barcode (visual only — for product detail/print) */
function BarcodeSVG({ code, height = 60, showText = true }) {
  // Compact "Code-128-style" rendering: pseudo-stripes from digits.
  // Not a true EAN encoding, but visually plausible and deterministic per code.
  const c = String(code || "");
  const bars = useMemo(() => {
    const out = [];
    let x = 6;
    for (let i = 0; i < c.length; i++) {
      const d = +c[i] || 0;
      // Pattern of 2-4 stripes per digit, widths 1-3 px
      const widths = [
        [1, 2, 1, 3], [2, 1, 2, 1], [1, 1, 3, 1], [2, 2, 1, 2],
        [1, 3, 1, 1], [3, 1, 2, 1], [2, 1, 1, 3], [1, 2, 2, 2],
        [3, 2, 1, 1], [1, 1, 2, 3],
      ][d];
      const gaps = [1, 1, 1, 1];
      for (let k = 0; k < widths.length; k++) {
        out.push({ x, w: widths[k] });
        x += widths[k] + gaps[k];
      }
    }
    return { bars: out, total: x + 6 };
  }, [c]);

  return (
    <svg className="barcode-svg" viewBox={`0 0 ${bars.total} ${height}`}
         preserveAspectRatio="none" style={{height, width:"100%"}}>
      <rect x="0" y="0" width={bars.total} height={height} fill="white"/>
      {bars.bars.map((b, i) => (
        <rect key={i} x={b.x} y="4" width={b.w} height={height - (showText ? 18 : 8)} fill="#0f0f0f"/>
      ))}
      {showText && (
        <text x={bars.total/2} y={height - 4} textAnchor="middle"
              fontFamily="ui-monospace, monospace" fontSize="11" fill="#0f0f0f"
              letterSpacing="2">{c}</text>
      )}
    </svg>
  );
}

/* ====================================================================
   Scanner Modal — opens from topbar
   ==================================================================== */
function ScannerModal({ open, onClose, onScan }) {
  const toast = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const [mode, setMode] = useState("camera");          // camera | manual
  const [status, setStatus] = useState("init");        // init | ready | scanning | error | nocam
  const [manual, setManual] = useState("");
  const [history, setHistory] = useState([]);
  const [last, setLast] = useState(null);              // { code, product, ts }
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    if (open) setHistory(loadHistory());
  }, [open]);

  // Start / stop camera
  useEffect(() => {
    if (!open || mode !== "camera") {
      stopCamera();
      return;
    }
    startCamera();
    return stopCamera;
    // eslint-disable-next-line
  }, [open, mode]);

  const startCamera = async () => {
    setStatus("init");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("nocam");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      // Try BarcodeDetector
      if ("BarcodeDetector" in window) {
        try {
          detRef.current = new window.BarcodeDetector({
            formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e"],
          });
        } catch { detRef.current = null; }
      }
      setStatus("scanning");
      tickScan();
    } catch (e) {
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const tickScan = async () => {
    if (!videoRef.current || !detRef.current) {
      // No real detector — keep idle camera; user can use manual or recents
      return;
    }
    try {
      const codes = await detRef.current.detect(videoRef.current);
      if (codes && codes.length) {
        handleScanned(codes[0].rawValue);
        return;
      }
    } catch {}
    rafRef.current = requestAnimationFrame(tickScan);
  };

  const handleScanned = (code) => {
    const p = findByBarcode(code);
    const entry = {
      code: String(code),
      sku: p?.sku || null,
      name: p?.name || "ไม่พบในระบบ",
      ts: Date.now(),
    };
    setLast({ code: entry.code, product: p, ts: entry.ts });
    setHistory(pushHistory(entry));
    setFlashKey(k => k + 1);
    if (p) toast(`สแกนพบ: ${p.name}`, "success");
    else   toast(`ไม่พบสินค้า: ${entry.code}`, "warn");
    // small pause then resume scanning
    setTimeout(() => {
      if (open && mode === "camera") {
        rafRef.current = requestAnimationFrame(tickScan);
      }
    }, 1400);
  };

  const submitManual = (e) => {
    e?.preventDefault?.();
    if (!manual.trim()) return;
    handleScanned(manual.trim());
    setManual("");
  };

  // Demo: simulate a scan from one of the seed products
  const simulate = () => {
    const p = PRODUCTS[Math.floor(Math.random() * Math.min(8, PRODUCTS.length))];
    handleScanned(p.barcode);
  };

  if (!open) return null;

  return (
    <div className="scan-overlay" onClick={onClose}>
      <div className="scan-modal" onClick={e => e.stopPropagation()}>
        <div className="scan-head">
          <div>
            <div className="scan-title">
              <span className="scan-pulse"></span>
              สแกนบาร์โค้ด
            </div>
            <div className="scan-sub">ส่องกล้องไปที่บาร์โค้ดบนสินค้า หรือพิมพ์รหัสด้วยตนเอง</div>
          </div>
          <div className="scan-tabs">
            <button className={`scan-tab ${mode==="camera"?"on":""}`} onClick={()=>setMode("camera")}>
              <Icon name="camera" size={14}/> กล้อง
            </button>
            <button className={`scan-tab ${mode==="manual"?"on":""}`} onClick={()=>setMode("manual")}>
              <Icon name="edit" size={14}/> พิมพ์รหัส
            </button>
            <button className="scan-close" onClick={onClose} aria-label="ปิด">
              <Icon name="x" size={16}/>
            </button>
          </div>
        </div>

        <div className="scan-body">
          <div className="scan-stage">
            {mode === "camera" ? (
              <div className="scan-cam">
                <video ref={videoRef} playsInline muted className="scan-video"/>
                <canvas ref={canvasRef} className="scan-canvas"/>
                <div className="scan-frame">
                  <span className="c tl"></span><span className="c tr"></span>
                  <span className="c bl"></span><span className="c br"></span>
                  <div className="scan-line"></div>
                </div>
                {flashKey > 0 && <div key={flashKey} className="scan-flash"/>}
                <div className="scan-status">
                  {status === "init"     && <><span className="dot pulsing"/> กำลังเปิดกล้อง...</>}
                  {status === "scanning" && <><span className="dot live"/> {detRef.current ? "พร้อมสแกน — เล็งบาร์โค้ดให้อยู่ในกรอบ" : "กล้องพร้อม (อุปกรณ์นี้ไม่รองรับการสแกนอัตโนมัติ — ใช้ \"พิมพ์รหัส\" หรือกด Demo)"}</>}
                  {status === "error"    && <><span className="dot err"/> ไม่สามารถเข้าถึงกล้องได้ — โปรดอนุญาตการใช้กล้อง</>}
                  {status === "nocam"    && <><span className="dot err"/> เบราว์เซอร์ไม่รองรับกล้อง — โปรดใช้ "พิมพ์รหัส"</>}
                </div>
                <button className="scan-demo-btn" onClick={simulate} title="จำลองการสแกน">
                  <Icon name="zap" size={13}/> Demo Scan
                </button>
              </div>
            ) : (
              <div className="scan-manual">
                <form onSubmit={submitManual} className="scan-manual-form">
                  <div className="scan-manual-label">รหัสบาร์โค้ดหรือ SKU</div>
                  <div className="scan-manual-input">
                    <Icon name="search" size={16}/>
                    <input
                      autoFocus
                      placeholder="เช่น 8850000000017 หรือ PG-001"
                      value={manual}
                      onChange={e=>setManual(e.target.value)}
                    />
                    <button type="submit" className="btn btn-accent btn-sm" disabled={!manual.trim()}>
                      ค้นหา
                    </button>
                  </div>
                  <div className="scan-manual-hint">
                    💡 ใช้เครื่องสแกน USB หรือคีย์บอร์ดได้ — เครื่องจะส่งรหัสตามด้วย Enter โดยอัตโนมัติ
                  </div>
                </form>

                <div className="scan-quick">
                  <div className="scan-quick-title">ลองด่วน — สินค้าตัวอย่าง</div>
                  <div className="scan-quick-grid">
                    {PRODUCTS.slice(0, 6).map(p => (
                      <button key={p.sku} className="scan-quick-chip"
                              onClick={()=>handleScanned(p.barcode)}>
                        <span className="scan-quick-sku">{p.sku}</span>
                        <span className="scan-quick-name">{p.name.length > 28 ? p.name.slice(0,28)+"…" : p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="scan-side">
            {last ? (
              <div className="scan-result">
                <div className="scan-result-head">
                  <span className={`scan-result-badge ${last.product ? "ok" : "warn"}`}>
                    {last.product ? "พบสินค้า" : "ไม่พบในระบบ"}
                  </span>
                  <span className="scan-result-time">เมื่อสักครู่</span>
                </div>
                {last.product ? (
                  <>
                    <div className="scan-result-name">{last.product.name}</div>
                    <div className="scan-result-meta">
                      <span className="sku-pill">{last.product.sku}</span>
                      <span className="scan-result-cat">{last.product.cat}</span>
                    </div>
                    <div className="scan-result-numrow">
                      <div>
                        <div className="scan-result-num-label">ราคาขาย</div>
                        <div className="scan-result-num">{baht(last.product.price)}</div>
                      </div>
                      <div>
                        <div className="scan-result-num-label">หน่วย</div>
                        <div className="scan-result-num small">{last.product.unit}</div>
                      </div>
                      <div>
                        <div className="scan-result-num-label">Reorder</div>
                        <div className="scan-result-num small">{last.product.reorder}</div>
                      </div>
                    </div>
                    <div className="scan-result-barcode">
                      <BarcodeSVG code={last.code} height={50}/>
                    </div>
                    <div className="scan-result-actions">
                      <button className="btn btn-accent btn-sm"
                              onClick={()=>{ onScan?.({ action:"receive", product:last.product }); onClose(); }}>
                        <Icon name="in" size={14}/> รับเข้า
                      </button>
                      <button className="btn btn-sm"
                              onClick={()=>{ onScan?.({ action:"issue", product:last.product }); onClose(); }}>
                        <Icon name="out" size={14}/> เบิก
                      </button>
                      <button className="btn btn-sm btn-ghost"
                              onClick={()=>{ onScan?.({ action:"detail", product:last.product }); onClose(); }}>
                        <Icon name="search" size={14}/> ดูรายละเอียด
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="scan-result-name">{last.code}</div>
                    <div className="scan-result-meta-warn">
                      ไม่มีสินค้านี้ในระบบ — สามารถเพิ่มเป็นสินค้าใหม่ได้
                    </div>
                    <div className="scan-result-actions">
                      <button className="btn btn-accent btn-sm">
                        <Icon name="plus" size={14}/> เพิ่มสินค้าใหม่
                      </button>
                      <button className="btn btn-sm" onClick={()=>setLast(null)}>ลองสแกนใหม่</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="scan-result scan-result-idle">
                <div className="scan-idle-icon"><Icon name="box" size={28}/></div>
                <div className="scan-idle-title">ยังไม่มีรายการ</div>
                <div className="scan-idle-sub">ผลลัพธ์จะแสดงที่นี่หลังจากสแกน</div>
              </div>
            )}

            <div className="scan-history">
              <div className="scan-history-head">
                <span>ประวัติล่าสุด</span>
                {history.length > 0 && (
                  <button className="btn-mini btn-mini-ghost" onClick={()=>{
                    localStorage.removeItem(SCAN_HISTORY_KEY);
                    setHistory([]);
                  }}>ล้าง</button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="scan-history-empty">ยังไม่เคยสแกน</div>
              ) : (
                <div className="scan-history-list">
                  {history.slice(0, 8).map((h, i) => (
                    <button key={i} className="scan-history-item"
                            onClick={()=>handleScanned(h.code)}>
                      <span className="scan-history-code">{h.code}</span>
                      <span className="scan-history-name">{h.name}</span>
                      <Icon name="search" size={12}/>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.IM_Scanner = { ScannerModal, BarcodeSVG, findByBarcode };
