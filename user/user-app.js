const STORAGE_KEYS = { USERS: 'campusbite_users_v1', CURRENT_USER: 'campusbite_current_user_v1', BASKET: 'campusbite_basket_v1', ORDERS: 'campusbite_orders_v1', SHARED_CANTEEN_DATA: 'canteenos-data-v1', SHARED_NOTIFICATIONS: 'canteenos-notifications-v1' };
const API_CANDIDATES = ['', 'http://127.0.0.1:8081', 'http://127.0.0.1:8082', 'http://127.0.0.1:8000', 'http://127.0.0.1:8001'];
let backendApiBase = location.protocol === 'file:' ? 'http://127.0.0.1:8081' : '';
let backendApiReachable = location.protocol !== 'file:' && !location.hostname.endsWith('.github.io');

const $ = (id) => document.getElementById(id);
const U = (p) => `https://images.unsplash.com/photo-${p}?auto=format&fit=crop&w=800&q=80`;
const makeFallbackImg = (label, bg = '245C43') => `https://placehold.co/600x420/${bg}/FFFFFF?text=${encodeURIComponent(label)}`;
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));

const MENU_ITEMS = [
  ['masala-dosa', 'Crispy Masala Dosa', 'Full Meals', ['Trending on Campus', 'Full Meals'], 70, 1, 4.8, 342, 6, 'Golden fermented rice-lentil crepe stuffed with spiced potato masala, served hot with coconut chutney and tangy sambar.', ['Fermented Rice Batter', 'Urad Dal', 'Spiced Potato Masala', 'Mustard Seeds', 'Curry Leaves', 'Green Chillies', 'Fresh Coconut Chutney', 'Toor Dal Sambar', 'Pure Ghee'], [['1668236543090-82eba5ee5976', 'Golden Crispy Dosa'], ['1630383249896-424e482df921', 'Served with Chutney & Sambar'], ['1589301760014-d929f3979dbc', 'Hot Campus Canteen Platter']]],
  ['paneer-tikka-roll', 'Paneer Tikka Kathi Roll', 'Quick Snacks', ['Trending on Campus', 'Quick Snacks'], 95, 1, 4.7, 289, 7, 'Char-grilled smoky cottage cheese cubes tossed with crunchy onions, bell peppers, and mint mayo wrapped in a flaky paratha.', ['Fresh Malai Paneer', 'Whole Wheat Paratha', 'Hung Curd Marinade', 'Kashmiri Red Chilli', 'Capsicum & Red Onion', 'Mint-Coriander Chutney', 'Chaat Masala', 'Lemon Juice'], [['1626700051175-6818013e1d4f', 'Loaded Paneer Kathi Roll'], ['1565557623262-b51c2513a641', 'Tandoori Paneer Filling'], ['1601050690597-df0568f70950', 'Freshly Wrapped & Toasted']]],
  ['veg-dum-biryani', 'Hyderabadi Veg Dum Biryani', 'Full Meals', ['Trending on Campus', 'Full Meals'], 120, 1, 4.6, 410, 9, 'Aromatic long-grain basmati rice slow-cooked on dum with saffron, marinated garden vegetables, paneer, and caramelized onions.', ['Aged Basmati Rice', 'Saffron Milk', 'Caramelized Onions', 'Fresh Mint & Coriander', 'Paneer & Mixed Veggies', 'Whole Garam Masala', 'Yogurt', 'Boondi Raita'], [['1563379091339-03b21ab4a4f8', 'Fragrant Dum Biryani'], ['1589302168068-964664d93dc0', 'Saffron Basmati Layers'], ['1633945274405-b6c8069047b0', 'Served with Cooling Raita']]],
  ['chicken-biryani', 'Royal Chicken Dum Biryani', 'Full Meals', ['Trending on Campus', 'Full Meals'], 160, 0, 4.9, 528, 10, 'Campus bestseller! Tender spiced chicken pieces layered with fragrant saffron basmati rice, fried onions, and served with mirchi salan & raita.', ['Tender Chicken Pieces', 'Long-Grain Basmati Rice', 'Ginger-Garlic Paste', 'Yogurt Marinade', 'Crispy Birista Onions', 'Cardamom, Cloves & Bay Leaf', 'Saffron & Kewra Water', 'Mint Raita'], [['1631515243349-e0cb75fb8d3a', 'Signature Chicken Biryani'], ['1589302168068-964664d93dc0', 'Juicy Spiced Chicken'], ['1563379091339-03b21ab4a4f8', 'Steaming Hot Bowl']]],
  ['chole-bhature', 'Punjabi Chole Bhature', 'Full Meals', ['Full Meals', 'Trending on Campus'], 85, 1, 4.7, 315, 8, 'Two fluffy, puffed golden bhature paired with rich Amritsari spiced chickpea curry, pickled onions, and tangy mango pickle.', ['Kabuli Chickpeas (Chole)', 'Refined Wheat Flour', 'Curd Leavened Dough', 'Anardana & Chole Masala', 'Ginger Juliennes', 'Tomato-Onion Gravy', 'Pickled Onions', 'Green Chilli'], [['1626132647523-66f5bf380027', 'Fluffy Golden Bhature'], ['1585937421612-70a008356fbe', 'Rich Amritsari Chole'], ['1606491956689-2ea866880c84', 'Complete Punjabi Plate']]],
  ['samosa-chaat', 'Crunchy Samosa Chaat', 'Quick Snacks', ['Quick Snacks', 'Trending on Campus'], 50, 1, 4.6, 274, 4, 'Crushed crispy potato samosas topped with hot spiced ragda, chilled sweet curd, tamarind & mint chutneys, and crunchy nylon sev.', ['Crispy Potato Samosa', 'Spiced White Peas (Ragda)', 'Sweet Whipped Curd', 'Tamarind-Date Chutney', 'Spicy Mint Chutney', 'Chopped Onion & Tomato', 'Crunchy Sev', 'Pomegranate Pearls'], [['1601050690597-df0568f70950', 'Crispy Samosa Base'], ['1606491956689-2ea866880c84', 'Chutneys & Sev Topping'], ['1567337710282-00832b415979', 'Evening Canteen Favorite']]],
  ['masala-maggi', 'Double Cheese Masala Maggi', 'Quick Snacks', ['Quick Snacks', 'Trending on Campus'], 45, 1, 4.8, 612, 5, 'Every hostel student’s midnight & study-break lifesaver! Classic masala noodles sautéed with veggies, butter, and melted cheese.', ['Wheat Noodles', 'Signature Tastemaker Masala', 'Amul Butter', 'Melted Cheddar Cheese', 'Green Peas & Sweet Corn', 'Chopped Onion & Tomato', 'Chilli Flakes', 'Fresh Coriander'], [['1612929633738-8fe44f7ec841', 'Steaming Masala Noodles'], ['1569718212165-3a8278d5f624', 'Loaded Veggies & Cheese'], ['1555126634-323283e090fa', 'Hostel Study Fuel']]],
  ['cold-coffee', 'Café Style Cold Coffee', 'Beverages & Combos', ['Beverages & Combos', 'Trending on Campus'], 60, 1, 4.9, 495, 3, 'Rich, frothy chilled Arabica coffee blended with creamy milk, vanilla ice cream scoop, and drizzled with dark chocolate sauce.', ['Roasted Arabica Coffee', 'Chilled Full-Cream Milk', 'Vanilla Ice Cream Scoop', 'Dark Chocolate Syrup', 'Raw Cane Sugar', 'Crushed Ice', 'Cocoa Dusting'], [['1461023058943-07fcbe16d735', 'Frothy Chilled Coffee'], ['1517701550927-30cf4ba1dba5', 'Creamy Chocolate Swirl'], ['1572490122747-3968b75cc699', 'Served Ice Cold in 3 Mins']]],
  ['veg-cheese-sandwich', 'Bombay Veg Cheese Grill', 'Quick Snacks', ['Quick Snacks'], 65, 1, 4.5, 218, 5, 'Triple-layer toasted bread packed with spiced potato, cucumber, tomato, green mint chutney, and generous melted mozzarella cheese.', ['Jumbo Sandwich Bread', 'Mozzarella & Cheddar Cheese', 'Green Mint Chutney', 'Amul Butter', 'Sliced Cucumber & Tomato', 'Boiled Potato & Onion', 'Special Sandwich Masala'], [['1528735602780-2552fd46c7af', 'Crispy Grilled Layers'], ['1550507992-eb63ffee0847', 'Loaded Cheese & Veggies'], ['1539252554453-80ab65ce3586', 'Served with Tomato Ketchup']]],
  ['idli-sambar', 'Soft Steamed Idli Sambar', 'Quick Snacks', ['Quick Snacks', 'Full Meals'], 55, 1, 4.7, 260, 4, 'Four pillowy steamed rice cakes served piping hot with aromatic drumstick sambar and two authentic South Indian chutneys.', ['Steamed Rice & Urad Dal', 'Toor Dal Sambar', 'Drumsticks & Pearl Onions', 'Fresh Coconut Chutney', 'Roasted Tomato Chutney', 'Curry Leaves Tempering', 'Pinch of Hing'], [['1589301760014-d929f3979dbc', 'Soft Steamed Idlis'], ['1630383249896-424e482df921', 'Hot Sambar & Chutney'], ['1668236543090-82eba5ee5976', 'Light & Healthy Breakfast']]],
  ['pav-bhaji', 'Butter Mumbai Pav Bhaji', 'Full Meals', ['Full Meals'], 80, 1, 4.6, 235, 7, 'Rich slow-mashed mixed vegetable bhaji topped with melting butter, served with 2 soft ladi pavs toasted on tawa with lemon & onions.', ['Mashed Potato & Cauliflower', 'Green Peas & Capsicum', 'Tomato Puree', 'Pav Bhaji Masala', 'Generous Amul Butter', 'Soft Ladi Pav (2 pcs)', 'Fresh Lemon Wedge', 'Finely Chopped Onion'], [['1606491956689-2ea866880c84', 'Buttery Tawa Pav Bhaji'], ['1585937421612-70a008356fbe', 'Spiced Mash Bhaji'], ['1626132647523-66f5bf380027', 'Toasted Butter Pav']]],
  ['oreo-shake', 'Oreo Chocolate Thick Shake', 'Beverages & Combos', ['Beverages & Combos'], 75, 1, 4.8, 310, 3, 'Ultra-creamy milkshake blended with crushed Oreo cookies, Belgian chocolate fudge, and chilled vanilla ice cream.', ['Crushed Oreo Cookies', 'Chilled Whole Milk', 'Vanilla & Chocolate Ice Cream', 'Dark Chocolate Fudge', 'Whipped Cream Swirl', 'Choco Chips'], [['1572490122747-3968b75cc699', 'Thick Oreo Cookie Shake'], ['1577805947697-89e18249d767', 'Chocolate Fudge Topping'], ['1563805042-7684c019e1cb', 'Chilled Campus Treat']]],
].map(([id, name, category, carousels, price, veg, rating, reviews, deliveryTime, description, ingredients, imgs]) => ({
  id, name, category, carousels, price, veg: !!veg, rating, reviews, deliveryTime, description, ingredients,
  images: imgs.map(([u, caption], i) => ({ url: U(u), caption, bg: ['245C43', '194733', '2F6E51'][i % 3] })),
}));

const CAROUSEL_SECTIONS = [
  { id: 'trending', title: 'Trending on Campus 🔥', subtitle: 'Most ordered dishes by hostel students right now', tag: 'Trending on Campus' },
  { id: 'snacks', title: 'Quick Snacks (3–7 Mins) ⚡', subtitle: 'Fast study-break bites delivered hot to your room', tag: 'Quick Snacks' },
  { id: 'meals', title: 'Full Meals & Combos 🍛', subtitle: "Hearty lunches & dinners straight from Royal's Canteen", tag: 'Full Meals' },
  { id: 'beverages', title: 'Chilled Beverages & Shakes 🧋', subtitle: 'Prepared fresh and delivered in just 3 minutes', tag: 'Beverages & Combos' },
];

let state = { currentUser: null, searchQuery: '', selectedCategory: 'All', vegOnly: false, sortBy: 'featured', pendingAction: null, activeModalItem: null, modalImageIndex: 0, modalQty: 1, cardImageIndices: {}, checkoutItems: [], checkoutSource: 'single', selectedPaymentMethod: 'UPI', studentDetails: null, userNotifications: [], seenNotifIds: new Set(), notifInitialized: false };
let currentDraftOrder = null, lastConfirmedOrder = null, notifPollTimer = null;
const touchStartXMap = {};

const safeReadJSON = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const safeWriteJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const getBasket = () => safeReadJSON(STORAGE_KEYS.BASKET, []);
const saveBasket = (items) => { safeWriteJSON(STORAGE_KEYS.BASKET, items); updateHeaderCounts(); };
const getAllOrders = () => safeReadJSON(STORAGE_KEYS.ORDERS, []);
const getUserOrders = () => state.currentUser ? getAllOrders().filter((o) => (o.studentAccountName || '').toLowerCase() === state.currentUser.name.toLowerCase()) : [];

function seedDemoStudent() {
  const users = safeReadJSON(STORAGE_KEYS.USERS, []);
  if (!users.some((u) => u.name.toLowerCase() === 'demo student')) {
    users.push({ name: 'Demo Student', email: 'demo@campus.edu', password: 'password123', createdAt: new Date().toISOString() });
    safeWriteJSON(STORAGE_KEYS.USERS, users);
  }
}

async function detectBackendApi() {
  if (location.protocol !== 'file:') { backendApiReachable = !location.hostname.endsWith('.github.io'); backendApiBase = ''; return; }
  for (const c of API_CANDIDATES.slice(1)) {
    try { if ((await fetch(`${c}/api/notifications`)).ok) { backendApiBase = c; backendApiReachable = true; return; } } catch {}
  }
  backendApiReachable = false;
}

function pushOrderToLocalSharedStore(order) {
  const now = new Date().toISOString(), sh = safeReadJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, { adminNotifications: [], userNotifications: [] });
  sh.adminNotifications.unshift({ id: `an-${order.orderId}-${Date.now()}`, orderId: order.orderId, customerName: order.student.name, regNo: order.student.regNo, hostel: order.student.hostel, roomNo: order.student.roomNo, phone: order.student.phone, fullAddress: order.student.fullAddress, items: order.items, total: order.total, paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, estimatedMinutes: order.estimatedMinutes, status: 'Preparing', isRead: false, receipt: order, createdAt: now, updatedAt: now });
  sh.userNotifications.unshift({ id: `un-${order.orderId}-${Date.now()}`, orderId: order.orderId, studentName: order.studentAccountName, status: 'Preparing', title: 'Order Receipt Received', message: `Order #${order.orderId} receipt sent to Royal's Canteen kitchen. Preparing your order!`, isRead: false, createdAt: now });
  safeWriteJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, sh);
  const cd = safeReadJSON(STORAGE_KEYS.SHARED_CANTEEN_DATA, null);
  if (cd && Array.isArray(cd.orders)) {
    const d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cd.orders.unshift({ id: order.orderId, customer: order.student.name, studentAccountName: order.studentAccountName, items: order.items.map((it) => ({ name: it.name, qty: it.qty, unitPrice: it.price, unitCost: Math.round(it.price * 45) / 100 })), total: order.total, status: 'Preparing', time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), payment: order.paymentMethod === 'UPI' ? 'UPI' : 'Cash', paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, day, source: 'user-web', student: order.student, estimatedMinutes: order.estimatedMinutes, dateTime: order.dateTime, receipt: order });
    safeWriteJSON(STORAGE_KEYS.SHARED_CANTEEN_DATA, cd);
  }
}

async function sendOrderToCanteenBackend(order) {
  pushOrderToLocalSharedStore(order);
  if (!backendApiReachable) await detectBackendApi();
  if (backendApiReachable) {
    try { await fetch(`${backendApiBase}/api/orders/user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }); } catch {}
  }
  await pollUserNotifications();
}

async function pollUserNotifications() {
  if (!state.currentUser) { state.userNotifications = []; renderBellNotifications(); return; }
  const stu = state.currentUser.name;
  let notifs = null, ords = null;
  if (backendApiReachable) {
    try {
      const r = await fetch(`${backendApiBase}/api/notifications?target=user&student=${encodeURIComponent(stu)}`);
      if (r.ok && (r.headers.get('content-type') || '').includes('application/json')) { const d = await r.json(); if (Array.isArray(d.userNotifications)) notifs = d.userNotifications; if (Array.isArray(d.orders)) ords = d.orders; }
    } catch {}
  }
  if (notifs === null) notifs = (safeReadJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, { userNotifications: [] }).userNotifications || []).filter((n) => (n.studentName || '').toLowerCase() === stu.toLowerCase());
  const localOrders = getAllOrders(); let changed = false;
  if (Array.isArray(ords) && ords.length) {
    const map = new Map(ords.map((o) => [String(o.id), o.status]));
    localOrders.forEach((o) => { const s = map.get(String(o.orderId)); if (s && o.status !== s) { o.status = s; changed = true; } });
  } else [...notifs].reverse().forEach((n) => { const o = localOrders.find((x) => String(x.orderId) === String(n.orderId)); if (o && n.status && o.status !== n.status) { o.status = n.status; changed = true; } });
  if (changed) safeWriteJSON(STORAGE_KEYS.ORDERS, localOrders);

  const newly = state.notifInitialized ? notifs.filter((n) => !state.seenNotifIds.has(n.id)) : [];
  state.seenNotifIds = new Set(notifs.map((n) => n.id)); state.notifInitialized = true; state.userNotifications = notifs;
  renderBellNotifications();
  if (newly.length) {
    const n = newly[0];
    if (n.status === 'Completed' || n.status === 'Ready') {
      $('activeBannerTitle').textContent = n.status === 'Completed' ? `🛵 The delivery coming near to the user — Order #${n.orderId}` : `✅ Order #${n.orderId} is Ready at Royal's Canteen!`;
      $('activeBannerSub').textContent = n.message; $('activeOrderBanner').classList.remove('hidden');
      showToast(`${n.status === 'Completed' ? '🛵' : '✅'} ${n.message}`, n.status === 'Completed' ? 'success' : 'info');
    }
  }
  if (changed && !$('ordersModal').classList.contains('hidden')) openOrdersModal();
}

function renderBellNotifications() {
  const unread = state.userNotifications.filter((n) => !n.isRead).length;
  const b = $('bellUnreadBadge'), sb = $('sidebarNotifCount'), list = $('userNotifList');
  if (b) { b.textContent = unread; b.classList.toggle('hidden', !unread); }
  $('bellNotifBtn')?.classList.toggle('has-alert', unread > 0);
  if (sb) { sb.textContent = unread; sb.classList.toggle('has-unread', unread > 0); }
  if (!list) return;
  if (!state.currentUser) {
    list.innerHTML = `<div class="text-center py-6 px-3"><div class="text-3xl mb-2">🔔</div><p class="font-bold text-sm text-[#202b25]">Sign in to receive live alerts</p><p class="text-xs text-[#5f6a61] mt-1">Order updates &amp; delivery notifications from Royal's Canteen will appear here.</p><button type="button" onclick="closeBellPopover(); openAuthModal('signin');" class="mt-3 px-4 py-2 rounded-lg bg-[#245c43] text-white text-xs font-bold hover:bg-[#194733]">Sign In</button></div>`;
    return;
  }
  list.innerHTML = state.userNotifications.length ? state.userNotifications.map((n) => {
    const done = n.status === 'Completed', rdy = n.status === 'Ready';
    const st = done ? 'background:#eaf3ec;color:#245c43;' : rdy ? 'background:#e9f2fb;color:#2e6091;' : 'background:#fff3e6;color:#9b6220;';
    const tm = n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
    return `<div class="user-notif-item ${n.isRead ? '' : 'unread'} ${done ? 'delivery-near' : ''}"><div class="flex items-center justify-between gap-2"><span class="font-bold text-xs text-[#202b25] flex items-center gap-1.5"><span aria-hidden="true">${done ? '🛵' : rdy ? '✅' : '🧾'}</span><span>${escapeHtml(n.title)}</span></span><span class="px-2 py-0.5 rounded-full text-[10px] font-bold" style="${st}">${escapeHtml(n.status)}</span></div><p class="text-xs text-[#3b473f] leading-relaxed m-0">${escapeHtml(n.message)}</p><div class="flex items-center justify-between text-[10px] text-[#6b756d] pt-1"><span>Order #${escapeHtml(n.orderId)}</span><span>${escapeHtml(tm)}</span></div></div>`;
  }).join('') : `<div class="text-center py-6 px-3"><div class="text-3xl mb-2">🔔</div><p class="font-bold text-sm text-[#202b25]">No notifications yet</p><p class="text-xs text-[#5f6a61] mt-1">You'll be alerted here as Royal's Canteen marks your order Ready &amp; Completed.</p></div>`;
}

async function markAllUserNotificationsRead() {
  if (!state.currentUser) return;
  const sn = state.currentUser.name;
  state.userNotifications.forEach((n) => { n.isRead = true; });
  const sh = safeReadJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, { adminNotifications: [], userNotifications: [] });
  (sh.userNotifications || []).forEach((n) => { if ((n.studentName || '').toLowerCase() === sn.toLowerCase()) n.isRead = true; });
  safeWriteJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, sh);
  renderBellNotifications();
  if (backendApiReachable) try { await fetch(`${backendApiBase}/api/notifications/read`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'user', studentName: sn }) }); } catch {}
}

function toggleBellPopoverFromSidebar() { closeMobileSidebar(); const p = $('userNotifPopover'); if (!p) return; try { p.togglePopover ? p.togglePopover() : p.classList.toggle(':popover-open'); } catch { p.classList.toggle(':popover-open'); } }
function closeBellPopover() { const p = $('userNotifPopover'); if (!p) return; try { p.hidePopover?.(); } catch {} p.classList.remove(':popover-open'); }

function showToast(message, type = 'success') {
  const c = $('toastContainer'), t = document.createElement('div');
  t.className = `toast-item ${type === 'error' ? 'bg-[#c7584b]' : type === 'info' ? 'bg-[#202b25]' : 'bg-[#245c43]'} text-white`;
  t.innerHTML = `<div class="flex items-start gap-2"><span aria-hidden="true">${type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✓'}</span><span>${escapeHtml(message)}</span></div><button type="button" class="toast-close-btn" aria-label="Dismiss notification">✕</button>`;
  const rm = () => { t.classList.remove('visible'); setTimeout(() => t.remove(), 220); };
  t.querySelector('.toast-close-btn').addEventListener('click', rm);
  c.appendChild(t);
  if (typeof document.ariaNotify === 'function') try { document.ariaNotify(message); } catch {}
  else { const lr = $('srLiveRegion'); if (lr) { lr.textContent = ''; requestAnimationFrame(() => { lr.textContent = message; }); } }
  requestAnimationFrame(() => t.classList.add('visible'));
  let tm = setTimeout(() => { if (!t.contains(document.activeElement)) rm(); }, 4200);
  t.addEventListener('focusin', () => clearTimeout(tm));
  t.addEventListener('focusout', () => { tm = setTimeout(rm, 2500); });
}

function scrollToSection(id) { closeMobileSidebar(); $(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.querySelectorAll('.sidebar .nav-link[data-section]').forEach((b) => b.classList.toggle('active', b.dataset.section === id)); }
function toggleMobileSidebar() { $('sidebar')?.classList.toggle('open'); $('sidebarBackdrop')?.classList.toggle('open'); }
function closeMobileSidebar() { $('sidebar')?.classList.remove('open'); $('sidebarBackdrop')?.classList.remove('open'); }

function renderHeaderAuth() {
  const c = $('headerAuthArea'), hb = $('heroAuthBtn'), av = $('sidebarProfileAvatar'), sn = $('sidebarProfileName'), sr = $('sidebarProfileRole');
  if (state.currentUser) {
    const ini = state.currentUser.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    c.innerHTML = `<div class="flex items-center gap-2 pl-2 border-l border-[#e9ece6]"><div class="flex items-center gap-2 bg-[#f5f6f2] border border-[#e9ece6] px-2.5 py-1.5 rounded-xl"><span class="w-7 h-7 rounded-lg bg-[#245c43] text-white text-xs font-extrabold flex items-center justify-center">${escapeHtml(ini)}</span><div class="hidden lg:block leading-tight"><p class="text-xs font-bold text-[#202b25] max-w-[110px] truncate">${escapeHtml(state.currentUser.name)}</p><p class="text-[10px] font-semibold text-[#245c43]">Verified Student</p></div></div><button onclick="handleLogout()" class="px-2.5 py-2 rounded-lg text-xs font-bold text-[#5f6a61] hover:text-[#c7584b] hover:bg-[#fff5f3] transition-colors" title="Sign Out">Sign Out</button></div>`;
    if (hb) { hb.textContent = `Welcome, ${state.currentUser.name} • My Orders`; hb.onclick = handleOpenOrders; }
    if (av) av.textContent = ini; if (sn) sn.textContent = state.currentUser.name; if (sr) sr.textContent = 'Verified Campus Student';
  } else {
    c.innerHTML = `<button onclick="openAuthModal('signin')" class="px-3.5 sm:px-4 py-2 rounded-lg bg-[#245c43] hover:bg-[#194733] text-white text-xs font-bold transition-colors shadow-sm">Sign In / Register</button>`;
    if (hb) { hb.textContent = 'Student Register / Sign In'; hb.onclick = () => openAuthModal('register'); }
    if (av) av.textContent = 'RC'; if (sn) sn.textContent = "Royal's Canteen"; if (sr) sr.textContent = 'Sign in to order';
  }
  updateHeaderCounts();
}

function updateHeaderCounts() {
  const n = getBasket().reduce((a, b) => a + b.qty, 0), oc = getUserOrders().length;
  if ($('basketCountBadge')) $('basketCountBadge').textContent = n;
  if ($('sidebarBasketCount')) { $('sidebarBasketCount').textContent = n; $('sidebarBasketCount').classList.toggle('has-unread', n > 0); }
  if ($('ordersCountBadge')) { $('ordersCountBadge').textContent = oc; $('ordersCountBadge').classList.toggle('hidden', !(state.currentUser && oc > 0)); }
  if ($('sidebarOrdersCount')) $('sidebarOrdersCount').textContent = state.currentUser ? oc : 0;
}

function requireStudentAuth(cb, msg = 'Please Sign In or Register as a Campus Student to continue.') { if (state.currentUser) cb(); else { state.pendingAction = cb; openAuthModal('signin', msg); } }
function toggleModal(id, show) { const m = $(id); m.classList.toggle('hidden', !show); m.classList.toggle('flex', show); }
function openAuthModal(tab = 'signin', info = '') { toggleModal('authModal', true); switchAuthTab(tab); info ? showAuthFeedback(info, 'info') : hideAuthFeedback(); }
function closeAuthModal() { toggleModal('authModal', false); state.pendingAction = null; hideAuthFeedback(); }
function switchAuthTab(tab) {
  hideAuthFeedback(); const s = tab === 'signin';
  $('signInForm').classList.toggle('hidden', !s); $('registerForm').classList.toggle('hidden', s);
  $('tabSignIn').className = `py-2.5 rounded-lg text-sm font-bold transition-all ${s ? 'bg-white text-[#245c43] shadow-sm' : 'text-[#6b756d] hover:text-[#202b25]'}`;
  $('tabRegister').className = `py-2.5 rounded-lg text-sm font-bold transition-all ${!s ? 'bg-white text-[#245c43] shadow-sm' : 'text-[#6b756d] hover:text-[#202b25]'}`;
  $('authModalTitle').textContent = s ? 'Student Sign In' : 'Campus Student Registration';
  $('authModalSub').textContent = s ? 'Enter your registered Name and Password to order.' : 'Register with Name, Email address & Password.';
}
function showAuthFeedback(msg, type = 'error') { const b = $('authMessageBox'); b.className = `mx-6 mt-4 px-4 py-3 rounded-xl text-xs font-semibold ${type === 'error' ? 'bg-red-50 text-red-700' : type === 'success' ? 'bg-[#eaf3ec] text-[#245c43]' : 'bg-amber-50 text-amber-800'}`; b.textContent = msg; }
function hideAuthFeedback() { $('authMessageBox').classList.add('hidden'); }
function fillDemoCredentials() { $('loginName').value = 'Demo Student'; $('loginPassword').value = 'password123'; showAuthFeedback('Demo credentials filled! Click "Sign In as Campus Student".', 'success'); }

async function handleRegister(e) {
  e.preventDefault();
  const name = $('regName').value.trim(), email = $('regEmail').value.trim().toLowerCase(), password = $('regPassword').value;
  if (!name || !email || !password) return showAuthFeedback('Please fill in Name, Email address, and Password.', 'error');
  const users = safeReadJSON(STORAGE_KEYS.USERS, []);
  if (users.some((u) => u.name.toLowerCase() === name.toLowerCase())) return showAuthFeedback('A student with this Name is already registered. Please Sign In.', 'error');
  if (users.some((u) => u.email.toLowerCase() === email)) return showAuthFeedback('This Email address is already registered. Please Sign In.', 'error');
  users.push({ name, email, password, createdAt: new Date().toISOString() }); safeWriteJSON(STORAGE_KEYS.USERS, users);
  if (backendApiReachable) try { await fetch(`${backendApiBase}/api/students/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) }); } catch {}
  $('registerForm').reset(); switchAuthTab('signin'); $('loginName').value = name; $('loginPassword').focus();
  showAuthFeedback(`Registration successful for ${name}! Now Sign In with your Name & Password.`, 'success'); showToast('Campus account registered! Please sign in.', 'success');
}

async function handleSignIn(e) {
  e.preventDefault();
  const name = $('loginName').value.trim(), password = $('loginPassword').value, users = safeReadJSON(STORAGE_KEYS.USERS, []);
  let matched = users.find((u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
  if (!matched && backendApiReachable) {
    try {
      const r = await fetch(`${backendApiBase}/api/students/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) });
      if (r.ok) { const d = await r.json(); if (d?.student) { matched = { name: d.student.name, email: d.student.email, password }; users.push(matched); safeWriteJSON(STORAGE_KEYS.USERS, users); } }
    } catch {}
  }
  if (!matched) return showAuthFeedback('Invalid Student Name or Password. Please check or Register first.', 'error');
  state.currentUser = { name: matched.name, email: matched.email }; state.notifInitialized = false;
  safeWriteJSON(STORAGE_KEYS.CURRENT_USER, state.currentUser); renderHeaderAuth(); $('signInForm').reset();
  const pending = state.pendingAction; closeAuthModal(); showToast(`Welcome back, ${matched.name}!`, 'success'); pollUserNotifications();
  if (typeof pending === 'function') setTimeout(() => pending(), 120);
}

function handleLogout() { state.currentUser = null; state.userNotifications = []; state.notifInitialized = false; try { localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); } catch {} renderHeaderAuth(); renderBellNotifications(); showToast("Signed out from Royal's Canteen.", 'info'); }

const getVegBadgeHtml = (veg) => veg
  ? `<span title="Vegetarian" class="inline-flex items-center justify-center w-4 h-4 rounded-[4px] border-2 border-[#245c43] bg-white shrink-0"><span class="w-2 h-2 rounded-full bg-[#245c43]"></span></span>`
  : `<span title="Non-Vegetarian" class="inline-flex items-center justify-center w-4 h-4 rounded-[4px] border-2 border-[#c7584b] bg-white shrink-0"><span class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-[#c7584b]"></span></span>`;

function createFoodCardHtml(item, key, isCarousel = false) {
  const idx = (state.cardImageIndices[key] ??= 0), ph = item.images[idx], fb = makeFallbackImg(`${item.name} (${idx + 1}/3)`, ph.bg);
  const dots = item.images.map((_, i) => `<button type="button" onclick="event.stopPropagation(); setCardImage('${key}','${item.id}',${i})" class="h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'}" aria-label="View photo ${i + 1}"></button>`).join('');
  return `<article onclick="handleFoodItemClick('${item.id}')" class="${isCarousel ? 'w-[272px] sm:w-[295px] shrink-0 snap-start' : 'w-full'} group bg-white rounded-2xl border border-[#e9ece6] shadow-card hover:shadow-card-hover hover:border-[#cfe0d2] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col">
    <div class="relative aspect-[16/11] bg-[#f5f6f2] overflow-hidden select-none" ontouchstart="handleCardTouchStart(event,'${key}')" ontouchend="handleCardTouchEnd(event,'${key}','${item.id}')">
      <img id="img-${key}" src="${ph.url}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fb}';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
      <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none"></div>
      <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 text-[#202b25] text-[11px] font-extrabold shadow-sm flex items-center gap-1"><span>⚡</span> ${item.deliveryTime} mins</span>
      <span id="counter-${key}" class="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-[#202b25]/80 text-white text-[10px] font-bold">${idx + 1}/${item.images.length}</span>
      <button type="button" onclick="event.stopPropagation(); slideCardImage('${key}','${item.id}',-1)" class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#202b25] shadow-md flex items-center justify-center font-bold text-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" aria-label="Previous photo">‹</button>
      <button type="button" onclick="event.stopPropagation(); slideCardImage('${key}','${item.id}',1)" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#202b25] shadow-md flex items-center justify-center font-bold text-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" aria-label="Next photo">›</button>
      <div class="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-2"><span id="caption-${key}" class="text-[11px] font-semibold text-white truncate drop-shadow">${escapeHtml(ph.caption)}</span><div id="dots-${key}" class="flex items-center gap-1 shrink-0">${dots}</div></div>
    </div>
    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
      <div><div class="flex items-start justify-between gap-2"><div class="flex items-center gap-1.5 min-w-0">${getVegBadgeHtml(item.veg)}<h3 class="font-extrabold text-[#202b25] text-base truncate group-hover:text-[#245c43] transition-colors">${escapeHtml(item.name)}</h3></div><span class="shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#245c43] text-white text-xs font-bold">${item.rating} ★</span></div><p class="text-xs text-[#667168] mt-1.5 line-clamp-2 leading-relaxed">${escapeHtml(item.ingredients.slice(0, 4).join(', '))} &amp; more</p></div>
      <div class="pt-2.5 border-t border-[#f0f1ee] flex items-center justify-between gap-2"><span class="text-lg font-extrabold text-[#245c43]">₹${item.price}</span><div class="flex items-center gap-1.5"><button type="button" onclick="event.stopPropagation(); handleQuickAdd('${item.id}')" class="px-3 py-2 rounded-lg border border-[#245c43] text-[#245c43] hover:bg-[#eaf3ec] text-xs font-bold transition-colors">+ Basket</button><button type="button" onclick="event.stopPropagation(); handleFoodItemClick('${item.id}')" class="px-3 py-2 rounded-lg bg-[#245c43] hover:bg-[#194733] text-white text-xs font-bold transition-colors shadow-sm">View &amp; Buy</button></div></div>
    </div>
  </article>`;
}

function setCardImage(key, itemId, newIdx) {
  const item = MENU_ITEMS.find((i) => i.id === itemId); if (!item) return;
  const total = item.images.length, idx = ((newIdx % total) + total) % total, ph = item.images[idx];
  state.cardImageIndices[key] = idx;
  const img = $(`img-${key}`);
  if (img) { img.onerror = function () { this.onerror = null; this.src = makeFallbackImg(`${item.name} (${idx + 1}/${total})`, ph.bg); }; img.src = ph.url; }
  if ($(`caption-${key}`)) $(`caption-${key}`).textContent = ph.caption;
  if ($(`counter-${key}`)) $(`counter-${key}`).textContent = `${idx + 1}/${total}`;
  if ($(`dots-${key}`)) $(`dots-${key}`).innerHTML = item.images.map((_, i) => `<button type="button" onclick="event.stopPropagation(); setCardImage('${key}','${item.id}',${i})" class="h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'}" aria-label="View photo ${i + 1}"></button>`).join('');
}
const slideCardImage = (key, id, d) => setCardImage(key, id, (state.cardImageIndices[key] || 0) + d);
const handleCardTouchStart = (e, k) => { if (e.touches?.length === 1) touchStartXMap[k] = e.touches[0].clientX; };
function handleCardTouchEnd(e, k, id) { const sx = touchStartXMap[k]; delete touchStartXMap[k]; if (sx !== undefined && e.changedTouches) { const df = e.changedTouches[0].clientX - sx; if (Math.abs(df) > 35) { e.stopPropagation(); slideCardImage(k, id, df < 0 ? 1 : -1); } } }

function renderCarousels() {
  $('carouselsSection').innerHTML = CAROUSEL_SECTIONS.map((s) => `<div class="space-y-4"><div class="flex items-end justify-between gap-4"><div><h2 class="text-xl sm:text-2xl font-extrabold text-[#202b25]">${escapeHtml(s.title)}</h2><p class="text-xs sm:text-sm text-[#667168] mt-0.5">${escapeHtml(s.subtitle)}</p></div><div class="flex items-center gap-2 shrink-0"><button onclick="scrollCarousel('track-${s.id}',-320)" class="w-9 h-9 rounded-full bg-white border border-[#e9ece6] hover:border-[#245c43] hover:text-[#245c43] shadow-sm flex items-center justify-center font-bold text-lg" aria-label="Slide left">‹</button><button onclick="scrollCarousel('track-${s.id}',320)" class="w-9 h-9 rounded-full bg-white border border-[#e9ece6] hover:border-[#245c43] hover:text-[#245c43] shadow-sm flex items-center justify-center font-bold text-lg" aria-label="Slide right">›</button></div></div><div id="track-${s.id}" class="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">${MENU_ITEMS.filter((i) => i.carousels.includes(s.tag)).map((i) => createFoodCardHtml(i, `car-${s.id}-${i.id}`, true)).join('')}</div></div>`).join('');
}
const scrollCarousel = (id, off) => $(id)?.scrollBy({ left: off, behavior: 'smooth' });

function renderCategoryFilters() {
  $('categoryFilterBar').innerHTML = ['All', 'Quick Snacks', 'Full Meals', 'Beverages & Combos'].map((c) => `<button onclick="selectCategory('${c}')" class="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${state.selectedCategory === c ? 'bg-[#245c43] text-white shadow-sm' : 'bg-white border border-[#e9ece6] text-[#526056] hover:border-[#245c43] hover:text-[#245c43]'}">${escapeHtml(c)}</button>`).join('');
}
function renderFullMenuGrid() {
  const q = state.searchQuery.trim().toLowerCase();
  const list = MENU_ITEMS.filter((i) => (state.selectedCategory === 'All' || i.category === state.selectedCategory) && (!state.vegOnly || i.veg) && (!q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.ingredients.some((g) => g.toLowerCase().includes(q))));
  const sorters = { 'time-asc': (a, b) => a.deliveryTime - b.deliveryTime, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, 'rating-desc': (a, b) => b.rating - a.rating };
  if (sorters[state.sortBy]) list.sort(sorters[state.sortBy]);
  $('emptyMenuState').classList.toggle('hidden', list.length > 0);
  $('fullMenuGrid').innerHTML = list.map((i) => createFoodCardHtml(i, `grid-${i.id}`, false)).join('');
}
function handleSearch(v) { state.searchQuery = v; if ($('headerSearchInput') && $('headerSearchInput').value !== v) $('headerSearchInput').value = v; if ($('mobileSearchInput') && $('mobileSearchInput').value !== v) $('mobileSearchInput').value = v; renderFullMenuGrid(); }
function selectCategory(c) { state.selectedCategory = c; renderCategoryFilters(); renderFullMenuGrid(); }
function toggleVegOnly() { state.vegOnly = !state.vegOnly; $('vegToggleBtn').className = state.vegOnly ? 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-[#245c43] bg-[#eaf3ec] text-sm font-bold text-[#245c43] transition-all' : 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#e9ece6] bg-white text-sm font-semibold text-[#526056] hover:border-[#245c43] transition-all'; renderFullMenuGrid(); }
function handleSort(v) { state.sortBy = v; renderFullMenuGrid(); }
function resetFilters() { state.searchQuery = ''; state.selectedCategory = 'All'; state.vegOnly = false; state.sortBy = 'featured'; if ($('headerSearchInput')) $('headerSearchInput').value = ''; if ($('mobileSearchInput')) $('mobileSearchInput').value = ''; $('sortSelect').value = 'featured'; $('vegToggleBtn').className = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#e9ece6] bg-white text-sm font-semibold text-[#526056] hover:border-[#245c43] transition-all'; renderCategoryFilters(); renderFullMenuGrid(); }

const handleFoodItemClick = (id) => requireStudentAuth(() => openItemDetailsModal(id), 'Only registered Campus Students can view full dish details & order. Please Sign In or Register.');
const handleQuickAdd = (id) => requireStudentAuth(() => { addItemToBasket(id, 1); showToast(`Added ${MENU_ITEMS.find((i) => i.id === id).name} to Basket!`, 'success'); }, 'Sign in with your Campus Student account to add items to your Basket.');

function openItemDetailsModal(id) {
  const item = MENU_ITEMS.find((i) => i.id === id); if (!item) return;
  state.activeModalItem = item; state.modalImageIndex = 0; state.modalQty = 1;
  $('modalVegBadge').innerHTML = getVegBadgeHtml(item.veg); $('modalCategoryPill').textContent = item.category;
  $('modalItemName').textContent = item.name; $('modalItemRating').textContent = `${item.rating} ★ (${item.reviews})`;
  $('modalItemPrice').textContent = `₹${item.price}`; $('modalDeliveryTime').textContent = `Delivered to your Hostel Room in ${item.deliveryTime} mins (Range: 3–10 mins)`;
  $('modalItemDesc').textContent = item.description;
  $('modalIngredientsList').innerHTML = item.ingredients.map((g) => `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f6f2] border border-[#e9ece6] text-xs font-semibold text-[#354139]"><span class="w-1.5 h-1.5 rounded-full bg-[#245c43]"></span>${escapeHtml(g)}</span>`).join('');
  updateModalGallery(); updateModalQtyDisplay(); toggleModal('itemModal', true);
}
function closeItemModal() { toggleModal('itemModal', false); state.activeModalItem = null; }
function updateModalGallery() {
  const it = state.activeModalItem; if (!it) return;
  const idx = state.modalImageIndex, ph = it.images[idx], img = $('modalMainImage');
  img.onerror = function () { this.onerror = null; this.src = makeFallbackImg(`${it.name} (${idx + 1}/3)`, ph.bg); };
  img.src = ph.url; img.alt = `${it.name} - ${ph.caption}`;
  $('modalImageCaption').textContent = ph.caption; $('modalImageCounter').textContent = `${idx + 1} / ${it.images.length}`;
  $('modalThumbnails').innerHTML = it.images.map((im, i) => `<button type="button" onclick="selectModalImage(${i})" class="rounded-xl overflow-hidden aspect-[4/3] bg-[#f5f6f2] transition-all ${i === idx ? 'ring-2 ring-[#245c43] ring-offset-2 opacity-100' : 'opacity-65 hover:opacity-100'}"><img src="${im.url}" alt="${escapeHtml(im.caption)}" onerror="this.onerror=null;this.src='${makeFallbackImg(String(i + 1), im.bg)}';" class="w-full h-full object-cover"/></button>`).join('');
}
const slideModalImage = (d) => { if (!state.activeModalItem) return; const t = state.activeModalItem.images.length; state.modalImageIndex = (state.modalImageIndex + d + t) % t; updateModalGallery(); };
const selectModalImage = (i) => { state.modalImageIndex = i; updateModalGallery(); };
const changeModalQty = (d) => { state.modalQty = Math.max(1, Math.min(20, state.modalQty + d)); updateModalQtyDisplay(); };
const updateModalQtyDisplay = () => { if (!state.activeModalItem) return; $('modalQtyValue').textContent = state.modalQty; $('modalBuyTotal').textContent = `₹${state.activeModalItem.price * state.modalQty}`; };
function handleModalAddToBasket() { if (!state.activeModalItem) return; addItemToBasket(state.activeModalItem.id, state.modalQty); showToast(`Added ${state.modalQty} × ${state.activeModalItem.name} to Basket!`, 'success'); closeItemModal(); }
function handleModalBuyNow() { const it = state.activeModalItem; if (!it) return; const line = [{ id: it.id, name: it.name, price: it.price, deliveryTime: it.deliveryTime, qty: state.modalQty }]; closeItemModal(); startCheckout(line, 'single'); }

function addItemToBasket(id, qty = 1) { const b = getBasket(), ex = b.find((x) => x.id === id); ex ? (ex.qty = Math.min(20, ex.qty + qty)) : b.push({ id, qty }); saveBasket(b); }
const handleOpenBasket = () => { closeMobileSidebar(); requireStudentAuth(openBasketDrawer, 'Please Sign In as a Campus Student to open your Food Basket.'); };
function openBasketDrawer() { renderBasketDrawer(); $('basketOverlay').classList.remove('hidden'); }
function closeBasket() { $('basketOverlay').classList.add('hidden'); }
function renderBasketDrawer() {
  const b = getBasket(), cnt = b.reduce((s, x) => s + x.qty, 0);
  $('drawerBasketCount').textContent = `${cnt} ${cnt === 1 ? 'item' : 'items'}`;
  if (!b.length) {
    $('basketItemsContainer').innerHTML = `<div class="h-full flex flex-col items-center justify-center text-center py-12 px-4"><div class="w-16 h-16 rounded-2xl bg-[#f5f6f2] flex items-center justify-center text-3xl mb-3">🧺</div><h4 class="font-extrabold text-[#202b25] text-lg">Your Basket is Empty</h4><p class="text-xs text-[#667168] mt-1 max-w-xs">Explore Royal's Canteen menu and add your favorite dishes to order them together.</p><button onclick="closeBasket(); scrollToSection('carouselsSection');" class="mt-4 px-5 py-2.5 rounded-lg bg-[#245c43] text-white text-xs font-bold hover:bg-[#194733]">Browse Dishes</button></div>`;
    $('basketFooter').classList.add('hidden'); return;
  }
  $('basketFooter').classList.remove('hidden'); let sub = 0, maxD = 3;
  $('basketItemsContainer').innerHTML = b.map((e) => {
    const it = MENU_ITEMS.find((i) => i.id === e.id); if (!it) return '';
    const lt = it.price * e.qty; sub += lt; maxD = Math.max(maxD, it.deliveryTime);
    return `<div class="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-[#e9ece6] shadow-sm"><img src="${it.images[0].url}" alt="${escapeHtml(it.name)}" onerror="this.onerror=null;this.src='${makeFallbackImg(it.name, it.images[0].bg)}';" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#f5f6f2]"/><div class="flex-1 min-w-0"><div class="flex items-center gap-1.5">${getVegBadgeHtml(it.veg)}<h4 class="font-bold text-sm text-[#202b25] truncate">${escapeHtml(it.name)}</h4></div><p class="text-xs text-[#667168] mt-0.5">₹${it.price} each • ⚡ ${it.deliveryTime} mins</p><div class="flex items-center justify-between mt-2"><div class="inline-flex items-center rounded-lg border border-[#e9ece6] bg-[#f8faf6]"><button onclick="updateBasketItemQty('${it.id}',-1)" class="w-7 h-7 font-bold text-[#202b25] hover:bg-[#eaf3ec] rounded-l-lg">−</button><span class="w-7 text-center text-xs font-extrabold">${e.qty}</span><button onclick="updateBasketItemQty('${it.id}',1)" class="w-7 h-7 font-bold text-[#245c43] hover:bg-[#eaf3ec] rounded-r-lg">+</button></div><div class="flex items-center gap-2.5"><span class="font-extrabold text-sm text-[#202b25]">₹${lt}</span><button onclick="removeBasketItem('${it.id}')" class="text-xs text-[#667168] hover:text-[#c7584b] font-bold" title="Remove item">✕</button></div></div></div></div>`;
  }).join('');
  $('basketSubtotal').textContent = `₹${sub}`; $('basketEstTime').textContent = `${Math.min(10, Math.max(3, maxD))} mins`; $('basketTotal').textContent = `₹${sub}`;
}
function updateBasketItemQty(id, d) { const b = getBasket(), i = b.findIndex((x) => x.id === id); if (i < 0) return; b[i].qty += d; if (b[i].qty <= 0) b.splice(i, 1); saveBasket(b); renderBasketDrawer(); }
function removeBasketItem(id) { saveBasket(getBasket().filter((x) => x.id !== id)); renderBasketDrawer(); }
function handleBasketBuy() { const items = getBasket().map((e) => { const i = MENU_ITEMS.find((m) => m.id === e.id); return i && { id: i.id, name: i.name, price: i.price, deliveryTime: i.deliveryTime, qty: e.qty }; }).filter(Boolean); if (items.length) { closeBasket(); startCheckout(items, 'basket'); } }

const getCheckoutTotal = () => state.checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);
const getCheckoutEstMinutes = () => Math.min(10, Math.max(3, state.checkoutItems.reduce((m, i) => Math.max(m, i.deliveryTime), 3)));
const getSelectedHostel = () => document.querySelector('input[name="hostelOption"]:checked')?.value || 'Boys Hostel';
const updateComputedAddress = () => { $('computedAddressText').textContent = `${getSelectedHostel()}, Room No. ${$('chkRoomNo').value.trim() || '___'}, College Campus`; };
const closeCheckoutModal = () => toggleModal('checkoutModal', false);
const backToDetailsStep = () => showCheckoutStep(1);

function startCheckout(items, source) {
  if (!state.currentUser) return requireStudentAuth(() => startCheckout(items, source));
  state.checkoutItems = items; state.checkoutSource = source; state.selectedPaymentMethod = 'UPI';
  $('chkName').value = state.currentUser.name; $('step1ErrorBox').classList.add('hidden');
  $('step1EstDelivery').textContent = `⚡ Est. ${getCheckoutEstMinutes()} mins`; $('step1TotalAmount').textContent = `₹${getCheckoutTotal()}`;
  $('step1ItemsList').innerHTML = items.map((i) => `<div class="flex justify-between text-[#354139]"><span><strong>${i.qty} ×</strong> ${escapeHtml(i.name)}</span><span class="font-semibold">₹${i.price * i.qty}</span></div>`).join('');
  updateComputedAddress(); showCheckoutStep(1); toggleModal('checkoutModal', true);
}
function showCheckoutStep(n) {
  [1, 2, 3, 4].forEach((i) => $(`checkoutStep${i}`).classList.toggle('hidden', i !== n));
  [1, 2, 3].forEach((s) => { $(`stepPill${s}`).className = n === 4 || s < n ? 'px-3 py-1.5 rounded-lg bg-[#b8db9c] text-[#194733] text-center font-extrabold' : s === n ? 'px-3 py-1.5 rounded-lg bg-white text-[#194733] text-center shadow-sm font-extrabold' : 'px-3 py-1.5 rounded-lg bg-white/15 text-white/80 text-center'; });
}
function goToPaymentStep(e) {
  e.preventDefault();
  const name = $('chkName').value.trim(), regNo = $('chkRegNo').value.trim(), hostel = getSelectedHostel(), roomNo = $('chkRoomNo').value.trim(), phone = $('chkPhone').value.trim(), err = $('step1ErrorBox');
  if (!regNo || !roomNo) { err.textContent = 'Please enter both your College Registration No. and Hostel Room No.'; return err.classList.remove('hidden'); }
  if (!/^\d{10}$/.test(phone)) { err.textContent = 'Please enter a valid 10-digit mobile Phone No.'; return err.classList.remove('hidden'); }
  err.classList.add('hidden'); const fullAddress = `${hostel}, Room No. ${roomNo}, College Campus`, total = getCheckoutTotal();
  state.studentDetails = { name, regNo, hostel, roomNo, phone, fullAddress };
  $('step2AddressSummary').textContent = fullAddress; $('step2TotalAmount').textContent = `₹${total}`;
  $('upiScanHeadline').textContent = `Scan & Pay ₹${total} via any UPI App`; $('codAmountText').textContent = `₹${total}`;
  selectPaymentMethod('UPI'); showCheckoutStep(2);
}
function selectPaymentMethod(method) {
  state.selectedPaymentMethod = method; const upi = method === 'UPI';
  const on = 'p-4 rounded-xl border-2 border-[#245c43] bg-[#eaf3ec]/70 text-left transition-all flex items-center gap-3.5 shadow-sm';
  const off = 'p-4 rounded-xl border-2 border-[#e9ece6] bg-white hover:border-[#b8c9bc] text-left transition-all flex items-center gap-3.5';
  $('payBtnUPI').className = upi ? on : off; $('payBtnCOD').className = upi ? off : on;
  $('upiQrPanel').classList.toggle('hidden', !upi); $('codPanel').classList.toggle('hidden', upi);
  $('getReceiptBtn').textContent = upi ? 'Payment Completed — Get Receipt' : 'Get Receipt';
  if (upi) renderUpiQrCode(getCheckoutTotal());
}
function renderUpiQrCode(amount) {
  const c = $('upiQrContainer'); c.innerHTML = '';
  const uri = `upi://pay?pa=royalscanteen@upi&pn=Royals%20Canteen&am=${amount}.00&cu=INR&tn=RoyalsCanteenOrder`;
  try { if (typeof QRCode !== 'undefined') { new QRCode(c, { text: uri, width: 184, height: 184, colorDark: '#194733', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); return; } } catch {}
  let h = 2166136261, rects = '';
  for (let i = 0; i < uri.length; i++) { h ^= uri.charCodeAt(i); h = Math.imul(h, 16777619); }
  const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#194733"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#194733"/>`;
  rects += f(0, 0) + f(14, 0) + f(0, 14);
  for (let r = 0; r < 21; r++) for (let col = 0; col < 21; col++) if (!((r < 7 && col < 7) || (r < 7 && col >= 14) || (r >= 14 && col < 7)) && (((h >>> ((r * 3 + col * 7) % 24)) ^ (r * 13 + col * 17)) & 1)) rects += `<rect x="${col}" y="${r}" width="1" height="1" fill="#194733"/>`;
  c.innerHTML = `<svg viewBox="-1 -1 23 23" class="w-48 h-48 bg-white">${rects}</svg>`;
}
function copyUpiId() {
  const u = 'royalscanteen@upi';
  navigator.clipboard?.writeText(u).then(() => showToast(`UPI ID copied: ${u}`, 'info'), () => { const i = document.createElement('input'); i.value = u; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); } catch {} i.remove(); showToast(`UPI ID copied: ${u}`, 'info'); });
}

function generateReceiptStep() {
  const isUpi = state.selectedPaymentMethod === 'UPI';
  currentDraftOrder = {
    orderId: `RC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    dateTime: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    studentAccountName: state.currentUser.name, student: { ...state.studentDetails }, items: state.checkoutItems.map((i) => ({ ...i })),
    paymentMethod: state.selectedPaymentMethod, paymentStatus: isUpi ? 'Paid via UPI' : 'Cash on Delivery',
    estimatedMinutes: getCheckoutEstMinutes(), total: getCheckoutTotal(), status: 'Preparing',
  };
  $('recOrderId').textContent = `Receipt #${currentDraftOrder.orderId}`; $('recDateTime').textContent = currentDraftOrder.dateTime;
  const b = $('recPaymentBadge'); b.textContent = currentDraftOrder.paymentStatus;
  b.className = `inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isUpi ? 'bg-[#eaf3ec] text-[#245c43]' : 'bg-[#fff3e6] text-[#9b6220]'}`;
  $('recStudentName').textContent = currentDraftOrder.student.name; $('recRegNo').textContent = currentDraftOrder.student.regNo;
  $('recHostelRoom').textContent = `${currentDraftOrder.student.hostel}, Room ${currentDraftOrder.student.roomNo}`;
  $('recPhone').textContent = currentDraftOrder.student.phone; $('recFullAddress').textContent = currentDraftOrder.student.fullAddress;
  $('recItemsBody').innerHTML = currentDraftOrder.items.map((i) => `<tr><td class="py-2.5 font-semibold text-[#202b25]">${escapeHtml(i.name)}</td><td class="py-2.5 text-center font-bold text-[#526056]">${i.qty}</td><td class="py-2.5 text-right text-[#667168]">₹${i.price}</td><td class="py-2.5 text-right font-bold text-[#202b25]">₹${i.price * i.qty}</td></tr>`).join('');
  $('recDeliveryTime').textContent = `${currentDraftOrder.estimatedMinutes} mins (Express Campus Delivery)`; $('recGrandTotal').textContent = `₹${currentDraftOrder.total}`;
  showCheckoutStep(3); showToast('Receipt generated! You can download the PDF and confirm your order.', 'success');
}

function downloadReceiptPDF(order) {
  if (!order) return;
  try {
    if (window.jspdf?.jsPDF) {
      const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' }); let y = 115;
      doc.setFillColor(36, 92, 67); doc.rect(0, 0, 595, 86, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text("canteenROYAL — Royal's Canteen", 40, 42);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.text('Official Food Order Receipt • Express Hostel Delivery (3–10 Mins)', 40, 64);
      doc.setTextColor(32, 43, 37); doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(`Receipt / Order No: ${order.orderId}`, 40, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(82, 96, 86); doc.text(`Date & Time: ${order.dateTime}`, 40, y + 18);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(order.paymentMethod === 'UPI' ? 36 : 180, order.paymentMethod === 'UPI' ? 92 : 112, order.paymentMethod === 'UPI' ? 67 : 38); doc.text(`Payment Status: ${order.paymentStatus}`, 360, y);
      y += 38; doc.setFillColor(245, 246, 242); doc.setDrawColor(233, 236, 230); doc.roundedRect(40, y, 515, 108, 8, 8, 'FD');
      doc.setTextColor(32, 43, 37); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('STUDENT & HOSTEL DELIVERY DETAILS', 55, y + 22);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text(`Student Name: ${order.student.name}`, 55, y + 42); doc.text(`Registration No.: ${order.student.regNo}`, 310, y + 42);
      doc.text(`Hostel: ${order.student.hostel}`, 55, y + 62); doc.text(`Room No.: ${order.student.roomNo}`, 310, y + 62);
      doc.text(`Phone No.: ${order.student.phone}`, 55, y + 82); doc.setFont('helvetica', 'bold'); doc.text(`Delivery Address: ${order.student.fullAddress}`, 55, y + 98);
      y += 135; doc.setFillColor(25, 71, 51); doc.rect(40, y, 515, 26, 'F'); doc.setTextColor(255, 255, 255); doc.setFontSize(10);
      doc.text('Food Item', 52, y + 17); doc.text('Qty', 340, y + 17); doc.text('Unit Price', 405, y + 17); doc.text('Subtotal', 485, y + 17);
      y += 42; doc.setTextColor(32, 43, 37); doc.setFont('helvetica', 'normal');
      order.items.forEach((i) => { doc.text(i.name, 52, y); doc.text(String(i.qty), 345, y); doc.text(`Rs. ${i.price}`, 405, y); doc.setFont('helvetica', 'bold'); doc.text(`Rs. ${i.price * i.qty}`, 485, y); doc.setFont('helvetica', 'normal'); doc.setDrawColor(233, 236, 230); doc.line(40, y + 8, 555, y + 8); y += 26; });
      y += 12; doc.setFontSize(10); doc.setTextColor(82, 96, 86); doc.text(`Estimated Delivery Time: ${order.estimatedMinutes} mins (3–10 min Campus Promise)`, 40, y); doc.text('Campus Hostel Delivery Fee: FREE', 40, y + 18);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(36, 92, 67); doc.text(`Grand Total: Rs. ${order.total}`, 390, y + 16);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(129, 138, 131); doc.text("Thank you for ordering from canteenROYAL — Royal's Canteen Student Portal.", 40, 780);
      doc.save(`RoyalsCanteen_Receipt_${order.orderId}.pdf`); return showToast(`Downloaded RoyalsCanteen_Receipt_${order.orderId}.pdf`, 'success');
    }
  } catch {}
  window.print(); showToast('Opened print dialog to save Receipt as PDF.', 'info');
}

async function confirmFinalOrder() {
  if (!currentDraftOrder) return;
  const confirmed = { ...currentDraftOrder, status: 'Preparing' }, all = getAllOrders();
  all.unshift(confirmed); safeWriteJSON(STORAGE_KEYS.ORDERS, all);
  if (state.checkoutSource === 'basket') saveBasket([]);
  lastConfirmedOrder = confirmed; currentDraftOrder = null; updateHeaderCounts();
  await sendOrderToCanteenBackend(lastConfirmedOrder);
  $('confirmedSummaryText').textContent = `Order #${lastConfirmedOrder.orderId} (${lastConfirmedOrder.paymentStatus} • ₹${lastConfirmedOrder.total}) receipt has been sent to Royal's Canteen Administrator.`;
  $('confirmedDeliveryETA').textContent = `Delivering to ${lastConfirmedOrder.student.fullAddress} in ~${lastConfirmedOrder.estimatedMinutes} mins`;
  $('activeBannerTitle').textContent = `Order #${lastConfirmedOrder.orderId} Confirmed! Receipt sent to Royal's Canteen...`;
  $('activeBannerSub').textContent = `Delivering to ${lastConfirmedOrder.student.fullAddress} • Est. ${lastConfirmedOrder.estimatedMinutes} mins • ${lastConfirmedOrder.paymentStatus}`;
  $('activeOrderBanner').classList.remove('hidden'); showCheckoutStep(4);
  showToast("Order Confirmed! Receipt sent to Royal's Canteen — watch the bell icon for delivery alerts.", 'success');
}

const handleOpenOrders = () => { closeMobileSidebar(); requireStudentAuth(openOrdersModal, 'Sign in with your Campus Student account to view your Order History.'); };
function openOrdersModal() {
  const orders = getUserOrders(); $('ordersStudentSub').textContent = `Showing confirmed orders for ${state.currentUser.name}`;
  $('ordersListContainer').innerHTML = orders.length ? orders.map((o, idx) => {
    const st = o.status === 'Completed' ? 'Completed · Delivery Coming Near' : o.status === 'Ready' ? 'Ready at Kitchen' : o.status || 'Preparing';
    const bg = o.status === 'Completed' ? 'bg-[#eaf3ec] text-[#245c43]' : o.status === 'Ready' ? 'bg-[#e9f2fb] text-[#2e6091]' : 'bg-[#fff3e6] text-[#9b6220]';
    return `<div class="rounded-xl border border-[#e9ece6] bg-[#f8faf6] p-4 space-y-3"><div class="flex flex-wrap items-start justify-between gap-2"><div><div class="flex items-center gap-2 flex-wrap"><span class="font-extrabold text-sm text-[#202b25]">#${escapeHtml(o.orderId)}</span><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${bg}">${escapeHtml(st)}</span></div><p class="text-[11px] text-[#667168] mt-0.5">${escapeHtml(o.dateTime)} • ⚡ Est. ${o.estimatedMinutes} mins</p></div><div class="text-right"><p class="font-extrabold text-base text-[#245c43]">₹${o.total}</p><span class="text-[10px] font-bold ${o.paymentMethod === 'UPI' ? 'text-[#245c43]' : 'text-[#9b6220]'}">${escapeHtml(o.paymentStatus)}</span></div></div><p class="text-xs font-semibold text-[#202b25] bg-white rounded-lg p-2.5 border border-[#e9ece6]">${escapeHtml(o.items.map((i) => `${i.qty} × ${i.name}`).join(', '))}</p><div class="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526056]"><div><span class="font-bold text-[#202b25]">${escapeHtml(o.student.name)}</span> (${escapeHtml(o.student.regNo)}) • ${escapeHtml(o.student.fullAddress)}</div><button onclick="downloadOrderByIndex(${idx})" class="px-3 py-1.5 rounded-lg bg-[#245c43] hover:bg-[#194733] text-white font-bold text-[11px]">Download PDF</button></div></div>`;
  }).join('') : `<div class="text-center py-12"><div class="text-4xl mb-3">📦</div><h4 class="font-extrabold text-[#202b25] text-lg">No Orders Yet</h4><p class="text-xs text-[#667168] mt-1">Once you confirm a canteen order, your receipt and live delivery status will appear here.</p></div>`;
  toggleModal('ordersModal', true);
}
const downloadOrderByIndex = (i) => { const o = getUserOrders()[i]; if (o) downloadReceiptPDF(o); };
const closeOrdersModal = () => toggleModal('ordersModal', false);

async function initApp() {
  seedDemoStudent(); state.currentUser = safeReadJSON(STORAGE_KEYS.CURRENT_USER, null);
  renderHeaderAuth(); renderCarousels(); renderCategoryFilters(); renderFullMenuGrid(); renderBellNotifications();
  await detectBackendApi(); await pollUserNotifications();
  if (notifPollTimer) clearInterval(notifPollTimer);
  notifPollTimer = setInterval(pollUserNotifications, 2500);
  addEventListener('storage', (e) => { if (e.key === STORAGE_KEYS.SHARED_NOTIFICATIONS || e.key === STORAGE_KEYS.SHARED_CANTEEN_DATA) pollUserNotifications(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAuthModal(); closeItemModal(); closeBasket(); closeOrdersModal(); closeMobileSidebar(); } });
}
window.addEventListener('DOMContentLoaded', initApp);
