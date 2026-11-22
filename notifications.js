(function (global) {
  const KEY = "canteenos-notifications-v1";
  const CANDIDATES = ["", "http://127.0.0.1:8081", "http://127.0.0.1:8000", "http://127.0.0.1:8082"];
  let apiBase = location.protocol === "file:" ? "http://127.0.0.1:8081" : "";
  let apiOk = location.protocol !== "file:" && !location.hostname.endsWith(".github.io");
  let list = [], filter = "All", seen = new Set(), ready = false, timer = null;

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(n || 0));
  const fmt = (iso) => { const d = new Date(iso); return iso && !isNaN(d) ? d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : String(iso || ""); };
  const readL = () => { try { const p = JSON.parse(localStorage.getItem(KEY) || "{}"); return { adminNotifications: Array.isArray(p.adminNotifications) ? p.adminNotifications : [], userNotifications: Array.isArray(p.userNotifications) ? p.userNotifications : [] }; } catch { return { adminNotifications: [], userNotifications: [] }; } };
  const writeL = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

  async function detectApi() {
    if (location.protocol !== "file:") { apiOk = !location.hostname.endsWith(".github.io"); apiBase = ""; return; }
    for (const c of CANDIDATES.slice(1)) {
      try { if ((await fetch(`${c}/api/notifications`)).ok) { apiBase = c; apiOk = true; return; } } catch {}
    }
    apiOk = false;
  }

  async function fetchNotifications(cb = {}) {
    const loc = readL();
    let remote = [], remoteOrders = null;
    if (apiOk) {
      try {
        const r = await fetch(`${apiBase}/api/notifications`);
        if (r.ok && (r.headers.get("content-type") || "").includes("application/json")) {
          const p = await r.json();
          if (Array.isArray(p.adminNotifications)) remote = p.adminNotifications;
          if (Array.isArray(p.orders)) remoteOrders = p.orders;
          writeL({ adminNotifications: remote, userNotifications: Array.isArray(p.userNotifications) ? p.userNotifications : loc.userNotifications });
        }
      } catch { if (location.protocol === "file:") apiOk = false; }
    }
    const next = apiOk ? remote : [...new Map(loc.adminNotifications.filter((n) => n && n.id).map((n) => [n.orderId || n.id, n])).values()].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    const newlyArrived = ready ? next.filter((n) => !seen.has(n.id)) : [];
    seen = new Set(next.map((n) => n.id)); ready = true;
    const changed = JSON.stringify(list) !== JSON.stringify(next);
    list = next;
    cb.onSync?.({ adminNotifications: list, remoteOrders, newlyArrived, changed });
    return { adminNotifications: list, remoteOrders, newlyArrived, changed };
  }

  async function updateOrderStatus(orderId, status) {
    const now = new Date().toISOString();
    let addr = "your hostel room", stu = "";
    const loc = readL();
    for (const n of loc.adminNotifications) if (String(n.orderId) === String(orderId)) {
      n.status = status; n.isRead = true; n.updatedAt = now;
      addr = n.fullAddress || addr; stu = (n.receipt && n.receipt.studentAccountName) || n.customerName || "";
    }
    if (stu && ["Ready", "Completed", "Cancelled"].includes(status)) {
      const [title, message] = status === "Ready"
        ? ["Order Ready!", `Order #${orderId} is Ready at Royal's Canteen kitchen and being packed for ${addr}.`]
        : status === "Completed"
        ? ["The delivery coming near to the user", `The delivery coming near to the user! Order #${orderId} is completed and arriving near ${addr}.`]
        : ["Order Cancelled", `Order #${orderId} was cancelled by Royal's Canteen.`];
      loc.userNotifications.unshift({ id: `un-${orderId}-${status.toLowerCase()}-${Date.now()}`, orderId, studentName: stu, status, title, message, isRead: false, createdAt: now });
    }
    writeL(loc);
    list.forEach((n) => { if (String(n.orderId) === String(orderId)) { n.status = status; n.isRead = true; n.updatedAt = now; } });
    if (apiOk) {
      try {
        const r = await fetch(`${apiBase}/api/orders/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, status }) });
        if (r.ok) return await r.json();
      } catch {}
    }
    return { ok: true, orderId, status };
  }

  async function markAllRead(id = "") {
    const loc = readL();
    loc.adminNotifications.forEach((n) => { if (!id || n.id === id) n.isRead = true; });
    writeL(loc);
    list.forEach((n) => { if (!id || n.id === id) n.isRead = true; });
    if (apiOk) try { await fetch(`${apiBase}/api/notifications/read`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target: "admin", id }) }); } catch {}
  }

  function renderNotificationsView() {
    const tabs = ["All", "Unread", "Preparing", "Ready", "Completed"];
    const shown = list.filter((n) => filter === "All" || (filter === "Unread" ? !n.isRead : n.status === filter));
    const cnt = (fn) => list.filter(fn).length;
    const portal = "user/index1.html";
    const cards = shown.map((n) => {
      const rows = (n.items || []).map((it) => { const q = Number(it.qty || 1), p = Number(it.price ?? it.unitPrice ?? 0); return `<tr><td class="cell-strong">${esc(it.name)}</td><td>${q}</td><td>${inr(p)}</td><td class="cell-strong">${inr(p * q)}</td></tr>`; }).join("");
      const act = n.status === "Preparing"
        ? `<button class="button small" data-action="notif-set-status" data-id="${esc(n.orderId)}" data-status="Ready">✓ Mark Ready</button>`
        : n.status === "Ready"
        ? `<button class="button small" data-action="notif-set-status" data-id="${esc(n.orderId)}" data-status="Completed">🛵 Mark Completed &amp; Notify User</button>`
        : n.status === "Completed"
        ? `<span class="notif-done-pill">✓ Completed — User notified: "The delivery coming near to the user"</span>` : "";
      return `<article class="panel notif-card ${n.isRead ? "" : "notif-unread"}"><div class="panel-header notif-card-head"><div class="notif-title-group">${n.isRead ? "" : '<span class="notif-unread-dot" aria-label="Unread"></span>'}<div><h2>Order Receipt #${esc(n.orderId)}</h2><span class="cell-sub">Received ${esc(fmt(n.createdAt))} · Est. ${esc(n.estimatedMinutes || 6)} mins delivery</span></div></div><div class="notif-head-badges"><span class="badge ${n.paymentMethod === "UPI" ? "completed" : "preparing"}">${esc(n.paymentStatus || n.paymentMethod)}</span><span class="badge ${esc(String(n.status || "Preparing").toLowerCase())}">${esc(n.status)}</span></div></div><div class="notif-body"><div class="notif-meta-grid"><div><span class="notif-meta-label">Student Name</span><strong>${esc(n.customerName)}</strong></div><div><span class="notif-meta-label">Registration No.</span><strong>${esc(n.regNo || "—")}</strong></div><div><span class="notif-meta-label">Hostel &amp; Room</span><strong>${esc(n.hostel || "—")}, Room ${esc(n.roomNo || "—")}</strong></div><div><span class="notif-meta-label">Phone No.</span><strong>${esc(n.phone || "—")}</strong></div><div class="notif-meta-wide"><span class="notif-meta-label">Campus Delivery Address</span><strong>📍 ${esc(n.fullAddress || "—")}</strong></div></div><div class="table-wrap notif-items-wrap"><table><thead><tr><th>Ordered Dish</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead><tbody>${rows}</tbody></table></div><div class="notif-footer"><div class="notif-total"><span>Receipt Total</span><strong>${inr(n.total)}</strong></div><div class="notif-actions">${act}</div></div></div></article>`;
    }).join("");
    return `<div class="page-heading"><div><div class="eyebrow">Royal's Canteen · Connected to User Web</div><h1>Order Receipt Notifications</h1><p class="page-subtitle">Incoming student order receipts from User Web. Click <strong>Ready</strong> then <strong>Completed</strong> to alert the student's bell icon.</p></div><div class="toolbar"><a class="button secondary" href="${esc(portal)}" target="_blank" rel="noopener">↗ Open Student Portal</a><button class="button secondary" data-action="notif-mark-all-read">✓ Mark all read</button></div></div>
      <div class="stats-grid notif-stats-grid">
        <article class="stat-card"><div class="stat-top"><span>Total Receipts</span><span class="stat-icon">🔔</span></div><div class="stat-value">${list.length}</div><div class="stat-note">${cnt((n) => !n.isRead)} unread alert(s)</div></article>
        <article class="stat-card"><div class="stat-top"><span>Preparing</span><span class="stat-icon">🍳</span></div><div class="stat-value">${cnt((n) => n.status === "Preparing")}</div><div class="stat-note">Waiting to be marked Ready</div></article>
        <article class="stat-card"><div class="stat-top"><span>Ready for Dispatch</span><span class="stat-icon">📦</span></div><div class="stat-value">${cnt((n) => n.status === "Ready")}</div><div class="stat-note">Click Completed to dispatch</div></article>
        <article class="stat-card"><div class="stat-top"><span>Completed &amp; Notified</span><span class="stat-icon">🛵</span></div><div class="stat-value">${cnt((n) => n.status === "Completed")}</div><div class="stat-note">Student bell icon alerted</div></article>
      </div>
      <div class="notif-filter-bar">${tabs.map((f) => `<button class="button ${filter === f ? "" : "secondary"} small" data-action="notif-filter" data-filter="${esc(f)}">${esc(f)}</button>`).join("")}</div>
      ${shown.length ? `<div class="notif-list">${cards}</div>` : `<section class="data-panel"><div class="empty-state"><span>🔔</span><strong>No order receipts yet</strong>When a student confirms an order on the Royal's Canteen Student Portal (User Web), the full receipt will appear here automatically.</div></section>`}`;
  }

  global.CanteenNotifications = {
    startPolling(cb = {}) {
      if (timer) clearInterval(timer);
      detectApi().then(() => fetchNotifications(cb));
      timer = setInterval(() => fetchNotifications(cb), 2500);
      addEventListener("storage", (e) => { if (e.key === KEY || e.key === "canteenos-data-v1") fetchNotifications(cb); });
    },
    fetchNotifications, updateOrderStatus, markAllRead, renderNotificationsView,
    getUnreadCount: () => list.filter((n) => !n.isRead || n.status === "Preparing").length,
    getList: () => list, setFilter: (f) => { filter = f; }, getFilter: () => filter
  };
})(window);
