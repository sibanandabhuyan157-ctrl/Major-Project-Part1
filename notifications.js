/**
 * Royal's Canteen — Shared Notifications Engine (Major Project Part 1 Admin)
 * Connects the Admin Notification page & Orders table to User Web orders via
 * the shared PHP/SQLite or Java backend (with automatic localStorage fallback).
 */
(function (global) {
  const NOTIF_STORAGE_KEY = "canteenos-notifications-v1";
  const DEFAULT_API_CANDIDATES = [
    "",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8082"
  ];

  let apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:8081" : "";
  let apiReachable = window.location.protocol !== "file:" && !window.location.hostname.endsWith(".github.io");
  let adminNotifications = [];
  let activeFilter = "All";
  let lastKnownIds = new Set();
  let initialized = false;
  let pollTimer = null;

  function readLocalStore() {
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (!raw) return { adminNotifications: [], userNotifications: [] };
      const parsed = JSON.parse(raw);
      return {
        adminNotifications: Array.isArray(parsed.adminNotifications) ? parsed.adminNotifications : [],
        userNotifications: Array.isArray(parsed.userNotifications) ? parsed.userNotifications : []
      };
    } catch {
      return { adminNotifications: [], userNotifications: [] };
    }
  }

  function writeLocalStore(store) {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.warn("Could not write notifications to localStorage:", error);
    }
  }

  async function detectApiBase() {
    if (window.location.protocol !== "file:") {
      if (window.location.hostname.endsWith(".github.io")) {
        apiReachable = false;
        return;
      }
      apiBase = "";
      apiReachable = true;
      return;
    }
    for (const candidate of DEFAULT_API_CANDIDATES.slice(1)) {
      try {
        const res = await fetch(`${candidate}/api/notifications`, { method: "GET" });
        if (res.ok) {
          apiBase = candidate;
          apiReachable = true;
          return;
        }
      } catch {
        // try next candidate
      }
    }
    apiReachable = false;
  }

  function escapeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 2
    }).format(Number(amount || 0));
  }

  function formatTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    });
  }

  function mergeNotifications(primaryList, fallbackList) {
    const byKey = new Map();
    for (const item of [...fallbackList, ...primaryList]) {
      if (!item || !item.id) continue;
      byKey.set(item.orderId || item.id, item);
    }
    return [...byKey.values()].sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
    );
  }

  async function fetchNotifications(callbacks = {}) {
    const localStore = readLocalStore();
    let remoteAdmin = [];
    let remoteOrders = null;

    if (apiReachable) {
      try {
        const res = await fetch(`${apiBase}/api/notifications`);
        if (res.ok && (res.headers.get("content-type") || "").includes("application/json")) {
          const payload = await res.json();
          if (Array.isArray(payload.adminNotifications)) {
            remoteAdmin = payload.adminNotifications;
          }
          if (Array.isArray(payload.orders)) {
            remoteOrders = payload.orders;
          }
          // Keep local cache mirror updated
          writeLocalStore({
            adminNotifications: remoteAdmin,
            userNotifications: Array.isArray(payload.userNotifications)
              ? payload.userNotifications
              : localStore.userNotifications
          });
        }
      } catch (error) {
        if (window.location.protocol === "file:") {
          apiReachable = false;
        }
      }
    }

    const nextList = apiReachable
      ? remoteAdmin
      : mergeNotifications(localStore.adminNotifications, []);

    const newlyArrived = [];
    if (initialized) {
      for (const notif of nextList) {
        if (!lastKnownIds.has(notif.id)) {
          newlyArrived.push(notif);
        }
      }
    }
    lastKnownIds = new Set(nextList.map((n) => n.id));
    initialized = true;

    const changed = JSON.stringify(adminNotifications) !== JSON.stringify(nextList);
    adminNotifications = nextList;

    if (typeof callbacks.onSync === "function") {
      callbacks.onSync({
        adminNotifications,
        remoteOrders,
        newlyArrived,
        changed
      });
    }

    return { adminNotifications, remoteOrders, newlyArrived, changed };
  }

  async function updateOrderStatus(orderId, status) {
    const nowIso = new Date().toISOString();
    let fullAddress = "your hostel room";
    let studentName = "";

    // Update local mirror immediately so localStorage fallback works seamlessly
    const localStore = readLocalStore();
    for (const n of localStore.adminNotifications) {
      if (String(n.orderId) === String(orderId)) {
        n.status = status;
        n.isRead = true;
        n.updatedAt = nowIso;
        fullAddress = n.fullAddress || fullAddress;
        studentName = (n.receipt && n.receipt.studentAccountName) || n.customerName || "";
      }
    }

    if (studentName && ["Ready", "Completed", "Cancelled"].includes(status)) {
      let title = "Order Update";
      let message = `Order #${orderId} is now ${status}.`;
      if (status === "Ready") {
        title = "Order Ready!";
        message = `Order #${orderId} is Ready at Royal's Canteen kitchen and being packed for ${fullAddress}.`;
      } else if (status === "Completed") {
        title = "The delivery coming near to the user";
        message = `The delivery coming near to the user! Order #${orderId} is completed and arriving near ${fullAddress}.`;
      } else if (status === "Cancelled") {
        title = "Order Cancelled";
        message = `Order #${orderId} was cancelled by Royal's Canteen.`;
      }
      localStore.userNotifications.unshift({
        id: `un-${orderId}-${status.toLowerCase()}-${Date.now()}`,
        orderId,
        studentName,
        status,
        title,
        message,
        isRead: false,
        createdAt: nowIso
      });
    }
    writeLocalStore(localStore);

    for (const n of adminNotifications) {
      if (String(n.orderId) === String(orderId)) {
        n.status = status;
        n.isRead = true;
        n.updatedAt = nowIso;
      }
    }

    if (apiReachable) {
      try {
        const res = await fetch(`${apiBase}/api/orders/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status })
        });
        if (!res.ok) throw new Error(`Status update failed (${res.status})`);
        return await res.json();
      } catch (error) {
        console.error("Could not push status update to server:", error);
      }
    }
    return { ok: true, orderId, status };
  }

  async function markAllRead(singleId = "") {
    const localStore = readLocalStore();
    for (const n of localStore.adminNotifications) {
      if (!singleId || n.id === singleId) n.isRead = true;
    }
    writeLocalStore(localStore);
    for (const n of adminNotifications) {
      if (!singleId || n.id === singleId) n.isRead = true;
    }

    if (apiReachable) {
      try {
        await fetch(`${apiBase}/api/notifications/read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: "admin", id: singleId })
        });
      } catch (error) {
        console.error("Could not mark notifications read on server:", error);
      }
    }
  }

  function getUnreadCount() {
    return adminNotifications.filter((n) => !n.isRead || n.status === "Preparing").length;
  }

  function setFilter(filter) {
    activeFilter = filter;
  }

  function getFilter() {
    return activeFilter;
  }

  function getList() {
    return adminNotifications;
  }

  function renderNotificationsView() {
    const filters = ["All", "Unread", "Preparing", "Ready", "Completed"];
    const filtered = adminNotifications.filter((n) => {
      if (activeFilter === "Unread") return !n.isRead;
      if (activeFilter === "Preparing") return n.status === "Preparing";
      if (activeFilter === "Ready") return n.status === "Ready";
      if (activeFilter === "Completed") return n.status === "Completed";
      return true;
    });

    const unreadTotal = adminNotifications.filter((n) => !n.isRead).length;
    const preparingTotal = adminNotifications.filter((n) => n.status === "Preparing").length;
    const readyTotal = adminNotifications.filter((n) => n.status === "Ready").length;
    const completedTotal = adminNotifications.filter((n) => n.status === "Completed").length;

    const filterTabs = filters.map((f) =>
      `<button class="button ${activeFilter === f ? "" : "secondary"} small" data-action="notif-filter" data-filter="${escapeText(f)}">${escapeText(f)}</button>`
    ).join("");

    const cards = filtered.map((n) => {
      const items = Array.isArray(n.items) ? n.items : [];
      const itemRows = items.map((it) => {
        const qty = Number(it.qty || 1);
        const price = Number(it.price ?? it.unitPrice ?? 0);
        return `<tr>
          <td class="cell-strong">${escapeText(it.name)}</td>
          <td>${qty}</td>
          <td>${formatMoney(price)}</td>
          <td class="cell-strong">${formatMoney(price * qty)}</td>
        </tr>`;
      }).join("");

      const statusLower = String(n.status || "Preparing").toLowerCase();
      let actionHtml = "";
      if (n.status === "Preparing") {
        actionHtml = `
          <button class="button small" data-action="notif-set-status" data-id="${escapeText(n.orderId)}" data-status="Ready">
            ✓ Mark Ready
          </button>`;
      } else if (n.status === "Ready") {
        actionHtml = `
          <button class="button small" data-action="notif-set-status" data-id="${escapeText(n.orderId)}" data-status="Completed">
            🛵 Mark Completed &amp; Notify User
          </button>`;
      } else if (n.status === "Completed") {
        actionHtml = `
          <span class="notif-done-pill">✓ Completed — User notified: "The delivery coming near to the user"</span>`;
      }

      return `
        <article class="panel notif-card ${n.isRead ? "" : "notif-unread"}">
          <div class="panel-header notif-card-head">
            <div class="notif-title-group">
              ${n.isRead ? "" : '<span class="notif-unread-dot" aria-label="Unread"></span>'}
              <div>
                <h2>Order Receipt #${escapeText(n.orderId)}</h2>
                <span class="cell-sub">Received ${escapeText(formatTime(n.createdAt))} · Est. ${escapeText(n.estimatedMinutes || 6)} mins delivery</span>
              </div>
            </div>
            <div class="notif-head-badges">
              <span class="badge ${n.paymentMethod === "UPI" ? "completed" : "preparing"}">${escapeText(n.paymentStatus || n.paymentMethod)}</span>
              <span class="badge ${escapeText(statusLower)}">${escapeText(n.status)}</span>
            </div>
          </div>

          <div class="notif-body">
            <div class="notif-meta-grid">
              <div><span class="notif-meta-label">Student Name</span><strong>${escapeText(n.customerName)}</strong></div>
              <div><span class="notif-meta-label">Registration No.</span><strong>${escapeText(n.regNo || "—")}</strong></div>
              <div><span class="notif-meta-label">Hostel &amp; Room</span><strong>${escapeText(n.hostel || "—")}, Room ${escapeText(n.roomNo || "—")}</strong></div>
              <div><span class="notif-meta-label">Phone No.</span><strong>${escapeText(n.phone || "—")}</strong></div>
              <div class="notif-meta-wide"><span class="notif-meta-label">Campus Delivery Address</span><strong>📍 ${escapeText(n.fullAddress || "—")}</strong></div>
            </div>

            <div class="table-wrap notif-items-wrap">
              <table>
                <thead>
                  <tr><th>Ordered Dish</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
            </div>

            <div class="notif-footer">
              <div class="notif-total">
                <span>Receipt Total</span>
                <strong>${formatMoney(n.total)}</strong>
              </div>
              <div class="notif-actions">
                ${actionHtml}
              </div>
            </div>
          </div>
        </article>`;
    }).join("");

    const userPortalUrl = window.location.protocol === "file:"
      ? "../User Web/index1.html"
      : "user/index1.html";

    return `
      <div class="page-heading">
        <div>
          <div class="eyebrow">Royal's Canteen · Connected to User Web</div>
          <h1>Order Receipt Notifications</h1>
          <p class="page-subtitle">Incoming student order receipts from User Web. Click <strong>Ready</strong> then <strong>Completed</strong> to alert the student's bell icon.</p>
        </div>
        <div class="toolbar">
          <a class="button secondary" href="${escapeText(userPortalUrl)}" target="_blank" rel="noopener">↗ Open Student Portal</a>
          <button class="button secondary" data-action="notif-mark-all-read">✓ Mark all read</button>
        </div>
      </div>

      <div class="stats-grid notif-stats-grid">
        <article class="stat-card"><div class="stat-top"><span>Total Receipts</span><span class="stat-icon">🔔</span></div><div class="stat-value">${adminNotifications.length}</div><div class="stat-note">${unreadTotal} unread alert${unreadTotal === 1 ? "" : "s"}</div></article>
        <article class="stat-card"><div class="stat-top"><span>Preparing</span><span class="stat-icon">🍳</span></div><div class="stat-value">${preparingTotal}</div><div class="stat-note">Waiting to be marked Ready</div></article>
        <article class="stat-card"><div class="stat-top"><span>Ready for Dispatch</span><span class="stat-icon">📦</span></div><div class="stat-value">${readyTotal}</div><div class="stat-note">Click Completed to dispatch</div></article>
        <article class="stat-card"><div class="stat-top"><span>Completed &amp; Notified</span><span class="stat-icon">🛵</span></div><div class="stat-value">${completedTotal}</div><div class="stat-note">Student bell icon alerted</div></article>
      </div>

      <div class="notif-filter-bar">${filterTabs}</div>

      ${filtered.length
        ? `<div class="notif-list">${cards}</div>`
        : `<section class="data-panel"><div class="empty-state"><span>🔔</span><strong>No order receipts yet</strong>When a student confirms an order on the Royal's Canteen Student Portal (User Web), the full receipt will appear here automatically.</div></section>`}
    `;
  }

  function startPolling(callbacks = {}) {
    if (pollTimer) clearInterval(pollTimer);
    detectApiBase().then(() => fetchNotifications(callbacks));
    pollTimer = setInterval(() => {
      fetchNotifications(callbacks);
    }, 2500);

    window.addEventListener("storage", (event) => {
      if (event.key === NOTIF_STORAGE_KEY || event.key === "canteenos-data-v1") {
        fetchNotifications(callbacks);
      }
    });
  }

  global.CanteenNotifications = {
    startPolling,
    fetchNotifications,
    updateOrderStatus,
    markAllRead,
    getUnreadCount,
    getList,
    setFilter,
    getFilter,
    renderNotificationsView
  };
})(window);
