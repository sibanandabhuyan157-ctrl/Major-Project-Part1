const STORAGE_KEY = "canteenos-data-v1";
const PAGE_TITLES = { overview: "Overview", orders: "Orders", notifications: "Notifications", menu: "Menu", inventory: "Inventory", reports: "Sales & reports" };
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

const seedData = {
  menu: [
    ["m1","Masala Dosa","Breakfast",65,24,"🥞","Crispy dosa with potato masala"],["m2","Veg Thali","Meals",120,55,"🍛","Today's wholesome lunch special"],["m3","Paneer Roll","Snacks",85,34,"🌯","Spiced paneer wrapped fresh"],["m4","Filter Coffee","Drinks",30,10,"☕","South Indian filter coffee"],["m5","Samosa (2 pcs)","Snacks",35,18,"🥟","Golden, flaky and satisfying"],["m6","Fresh Lime Soda","Drinks",40,12,"🍋","Fresh lime, sweet or salted"],["m7","Idli Sambar","Breakfast",45,16,"🥣","Soft idlis with warm sambar"],["m8","Aloo Paratha","Breakfast",55,23,"🫓","Stuffed paratha served with curd"],["m9","Chole Bhature","Meals",110,48,"🍲","Spiced chickpeas with fluffy bhature"],["m10","Veg Pulao","Meals",95,39,"🍚","Fragrant rice with seasonal vegetables"],
    ["m11","Masala Chai","Drinks",20,7,"🫖","Freshly brewed spiced tea"],["m12","Gulab Jamun (2 pcs)","Desserts",45,18,"🍡","Warm syrup-soaked Indian sweets"],["m13","Veg Sandwich","Snacks",65,28,"🥪","Toasted sandwich with fresh vegetables"],["m14","Cheese Corn Sandwich","Snacks",85,39,"🥪","Grilled sandwich with cheese and corn"],["m15","Veg Burger","Snacks",90,42,"🍔","Crispy vegetable patty with salad"],["m16","French Fries","Snacks",70,30,"🍟","Crispy salted potato fries"],["m17","Pav Bhaji","Meals",100,44,"🍛","Spiced vegetable mash with buttered pav"],["m18","Vada Pav","Snacks",35,14,"🍔","Mumbai-style potato fritter bun"],["m19","Poha","Breakfast",40,14,"🥣","Light flattened rice with peanuts"],["m20","Upma","Breakfast",40,15,"🥣","Savory semolina with vegetables"],
    ["m21","Plain Dosa","Breakfast",55,20,"🥞","Crispy dosa served with chutney"],["m22","Rava Dosa","Breakfast",75,29,"🥞","Crispy semolina dosa with spices"],["m23","Onion Uttapam","Breakfast",75,28,"🥞","Soft rice pancake topped with onion"],["m24","Paneer Paratha","Breakfast",75,34,"🫓","Stuffed paratha with spiced paneer"],["m25","Rajma Chawal","Meals",100,45,"🍛","Kidney bean curry with steamed rice"],["m26","Dal Tadka Rice","Meals",85,36,"🍚","Yellow lentils with rice and tadka"],["m27","Kadai Paneer","Meals",130,62,"🍲","Paneer and peppers in spiced gravy"],["m28","Jeera Rice","Meals",80,32,"🍚","Basmati rice tempered with cumin"],["m29","Veg Biryani","Meals",120,52,"🍛","Fragrant rice layered with vegetables"],["m30","Curd Rice","Meals",75,30,"🍚","Cooling rice mixed with seasoned curd"],
    ["m31","Lemon Rice","Meals",75,28,"🍋","Tangy rice with lemon and peanuts"],["m32","Hakka Noodles","Meals",100,42,"🍜","Wok-tossed noodles with vegetables"],["m33","Veg Manchurian","Meals",110,50,"🥘","Vegetable dumplings in tangy sauce"],["m34","Chilli Paneer","Meals",130,62,"🥘","Paneer tossed with peppers and chilli"],["m35","Spring Rolls","Snacks",80,35,"🌯","Crispy rolls filled with vegetables"],["m36","Bread Pakora","Snacks",40,18,"🍞","Bread fritter coated in spiced batter"],["m37","Onion Pakora","Snacks",45,19,"🧅","Crispy onion fritters with herbs"],["m38","Dhokla","Snacks",50,21,"🧁","Soft steamed Gujarati savoury cake"],["m39","Kachori (2 pcs)","Snacks",40,17,"🥟","Crispy pastry with spiced filling"],["m40","Corn Chaat","Snacks",65,26,"🌽","Sweet corn tossed with lime and spices"],
    ["m41","Fresh Fruit Bowl","Snacks",70,30,"🍉","Seasonal fresh-cut fruit"],["m42","Mango Lassi","Drinks",55,24,"🥭","Yogurt blended with ripe mango"],["m43","Sweet Lassi","Drinks",45,18,"🥛","Chilled, lightly sweetened yogurt drink"],["m44","Salted Buttermilk","Drinks",25,8,"🥛","Cooling buttermilk with roasted cumin"],["m45","Hot Chocolate","Drinks",65,25,"☕","Rich hot chocolate made fresh"],["m46","Lemon Tea","Drinks",25,8,"🍵","Light tea with fresh lemon"],["m47","Badam Milk","Drinks",50,22,"🥛","Warm milk flavored with almond"],["m48","Chocolate Brownie","Desserts",60,25,"🍫","Fudgy chocolate brownie"],["m49","Ice Cream Cup","Desserts",40,17,"🍨","Chilled scoop of creamy ice cream"],["m50","Vanilla Milkshake","Drinks",60,25,"🥤","Cold, creamy vanilla milkshake"],
    ["m51","Chicken Biryani","Non-Veg",170,85,"🍗","Aromatic rice cooked with spiced chicken"],["m52","Chicken Fried Rice","Non-Veg",140,65,"🍚","Wok-fried rice with chicken and vegetables"],["m53","Chicken Hakka Noodles","Non-Veg",150,68,"🍜","Stir-fried noodles with chicken"],["m54","Chicken Curry","Non-Veg",160,78,"🍛","Chicken simmered in a rich spiced gravy"],["m55","Butter Chicken","Non-Veg",190,95,"🍲","Chicken in a creamy tomato gravy"],["m56","Chicken Tikka","Non-Veg",160,76,"🍗","Yogurt-marinated chicken grilled with spices"],["m57","Tandoori Chicken","Non-Veg",210,110,"🍗","Tandoor-style chicken with smoky spices"],["m58","Chicken 65","Non-Veg",150,70,"🍗","Crispy, spiced South Indian chicken bites"],["m59","Chilli Chicken","Non-Veg",155,72,"🍗","Chicken tossed in a tangy chilli sauce"],["m60","Chicken Manchurian","Non-Veg",160,75,"🥘","Chicken bites in savory Manchurian sauce"],
    ["m61","Chicken Kathi Roll","Non-Veg",110,49,"🌯","Spiced chicken wrapped in a flaky roll"],["m62","Chicken Sandwich","Non-Veg",95,43,"🥪","Toasted sandwich filled with seasoned chicken"],["m63","Chicken Burger","Non-Veg",120,55,"🍔","Chicken patty served in a soft bun"],["m64","Chicken Shawarma Roll","Non-Veg",130,60,"🌯","Spiced chicken with salad in a wrap"],["m65","Chicken Momos (6 pcs)","Non-Veg",100,45,"🥟","Steamed chicken dumplings with chutney"],["m66","Chicken Spring Rolls","Non-Veg",100,46,"🌯","Crispy rolls filled with seasoned chicken"],["m67","Chicken Pakora","Non-Veg",110,51,"🍗","Chicken pieces fried in a spiced batter"],["m68","Chicken Keema Pav","Non-Veg",125,57,"🍞","Spiced minced chicken served with pav"],["m69","Egg Biryani","Non-Veg",125,55,"🍚","Fragrant biryani rice served with boiled eggs"],["m70","Egg Fried Rice","Non-Veg",110,47,"🍚","Wok-fried rice with egg and vegetables"],
    ["m71","Egg Curry","Non-Veg",105,46,"🍛","Boiled eggs in a homestyle curry"],["m72","Egg Bhurji Pav","Non-Veg",85,35,"🍳","Spiced scrambled eggs served with pav"],["m73","Masala Omelette","Non-Veg",65,26,"🍳","Omelette with onion, chilli and herbs"],["m74","Egg Sandwich","Non-Veg",75,32,"🥪","Toasted sandwich with seasoned egg"],["m75","Egg Roll","Non-Veg",70,28,"🌯","Egg wrapped in a soft flatbread"],["m76","Egg Noodles","Non-Veg",115,49,"🍜","Stir-fried noodles with egg and vegetables"],["m77","Boiled Egg (2 pcs)","Non-Veg",35,14,"🥚","Two boiled eggs with seasoning"],["m78","Fish Curry Rice","Non-Veg",175,85,"🐟","Fish curry served with steamed rice"],["m79","Fish Fry","Non-Veg",160,78,"🐟","Crispy pan-fried fish with spices"],["m80","Fish Biryani","Non-Veg",185,90,"🐟","Layered rice with spiced fish"],
    ["m81","Fish Fingers (5 pcs)","Non-Veg",140,64,"🐟","Golden crumb-coated fish fingers"],["m82","Prawn Fried Rice","Non-Veg",180,85,"🍤","Fried rice tossed with seasoned prawns"],["m83","Prawn Curry Rice","Non-Veg",195,96,"🍤","Prawns in a spiced curry with rice"],["m84","Chilli Prawns","Non-Veg",190,90,"🍤","Prawns tossed with peppers and chilli"],["m85","Prawn Biryani","Non-Veg",210,102,"🍤","Aromatic biryani layered with prawns"],["m86","Mutton Biryani","Non-Veg",220,112,"🍖","Slow-cooked spiced mutton with rice"],["m87","Mutton Curry Rice","Non-Veg",210,108,"🍛","Tender mutton curry served with rice"],["m88","Mutton Keema Pav","Non-Veg",160,78,"🍞","Spiced minced mutton served with pav"],["m89","Chicken Pulao","Non-Veg",155,72,"🍚","Fragrant one-pot rice with chicken"],["m90","Chicken Kebab (4 pcs)","Non-Veg",145,68,"🍢","Juicy spiced chicken kebabs"],
    ["m91","Chicken Lollipop (4 pcs)","Non-Veg",160,75,"🍗","Crispy chicken lollipops with sauce"],["m92","Chicken Seekh Kebab","Non-Veg",150,70,"🍢","Minced chicken kebabs grilled on skewers"],["m93","Chicken Clear Soup","Non-Veg",75,30,"🍲","Light chicken soup with herbs"],["m94","Chicken Caesar Sandwich","Non-Veg",125,58,"🥪","Chicken and crisp lettuce in toasted bread"],["m95","Chicken Cheese Wrap","Non-Veg",135,63,"🌯","Grilled chicken and cheese in a wrap"],["m96","Chicken Alfredo Pasta","Non-Veg",165,78,"🍝","Creamy pasta with chicken pieces"],["m97","Chicken Tikka Masala","Non-Veg",185,90,"🍛","Grilled chicken in a spiced tomato gravy"],["m98","Chicken Korma","Non-Veg",180,88,"🍲","Mild chicken curry with a creamy sauce"],["m99","Fish Tikka (4 pcs)","Non-Veg",175,84,"🐟","Marinated fish grilled with spices"],["m100","Egg Paratha","Non-Veg",75,32,"🫓","Flaky flatbread filled with egg"]
  ].map(([id, name, category, price, costPerServing, emoji, description]) => ({ id, name, category, price, costPerServing, emoji, description })),
  orders: [
    ["1042","Aarav Sharma","Veg Thali",2,240,55,"Preparing","12:42 PM","UPI"],["1041","Meera Patel","Masala Dosa",1,65,24,"Ready","12:38 PM","Cash"],["1040","Kabir Singh","Paneer Roll",2,170,34,"Preparing","12:31 PM","UPI"],["1039","Diya Nair","Filter Coffee",1,30,10,"Completed","12:20 PM","Cash"],["1038","Ishaan Rao","Samosa (2 pcs)",2,70,18,"Completed","12:14 PM","UPI"]
  ].map(([id, customer, item, qty, total, unitCost, status, time, payment]) => ({ id, customer, item, qty, total, unitCost, status, time, payment, day: todayKey() })),
  inventory: [
    ["i1","Rice","kg",18,10,60,"Grains"],["i2","Potatoes","kg",6,8,30,"Produce"],["i3","Paneer","kg",4,3,360,"Dairy"],["i4","Cooking oil","L",3,5,150,"Essentials"],["i5","Coffee powder","kg",2,1,420,"Beverages"],["i6","Wheat flour","kg",12,4,40,"Grains"],["i7","All-purpose flour","kg",8,3,45,"Grains"],["i8","Semolina","kg",5,2,55,"Grains"],["i9","Flattened rice","kg",5,2,50,"Grains"],["i10","Dosa batter","kg",6,2,60,"Grains"],
    ["i11","Chickpea flour","kg",4,2,90,"Grains"],["i12","Bread","pack",8,3,35,"Bakery"],["i13","Pav buns","pack",6,2,40,"Bakery"],["i14","Milk","L",12,4,60,"Dairy"],["i15","Curd","kg",5,2,90,"Dairy"],["i16","Butter","kg",2,1,480,"Dairy"],["i17","Cheese","kg",3,1,420,"Dairy"],["i18","Coconut","pcs",12,4,35,"Produce"],["i19","Onions","kg",10,4,35,"Produce"],["i20","Tomatoes","kg",8,3,40,"Produce"],
    ["i21","Ginger","kg",2,1,120,"Produce"],["i22","Garlic","kg",2,1,160,"Produce"],["i23","Green chillies","kg",2,1,80,"Produce"],["i24","Capsicum","kg",4,2,70,"Produce"],["i25","Cabbage","kg",4,2,35,"Produce"],["i26","Carrots","kg",5,2,50,"Produce"],["i27","Green peas","kg",4,2,100,"Produce"],["i28","Sweet corn","kg",3,1,100,"Produce"],["i29","Lemons","pcs",30,10,5,"Produce"],["i30","Coriander leaves","kg",1,0.5,120,"Produce"],
    ["i31","Curry leaves","pack",8,3,10,"Produce"],["i32","Mixed spices","kg",2,1,300,"Essentials"],["i33","Cumin seeds","kg",1,0.5,280,"Essentials"],["i34","Soy sauce","L",3,1,110,"Essentials"],["i35","Chilli sauce","L",3,1,130,"Essentials"],["i36","Noodles","kg",5,2,90,"Grains"],["i37","Pasta","kg",4,2,120,"Grains"],["i38","Tomato puree","L",3,1,100,"Essentials"],["i39","Chicken","kg",8,3,260,"Meat & seafood"],["i40","Eggs","pcs",60,20,7,"Meat & seafood"],
    ["i41","Fish","kg",5,2,320,"Meat & seafood"],["i42","Prawns","kg",3,1,500,"Meat & seafood"],["i43","Mutton","kg",4,2,650,"Meat & seafood"],["i44","Breadcrumbs","kg",2,1,110,"Essentials"],["i45","Mayonnaise","kg",2,1,180,"Dairy"],["i46","Sugar","kg",8,3,45,"Essentials"],["i47","Salt","kg",5,2,20,"Essentials"],["i48","Almonds","kg",1,0.5,900,"Essentials"],["i49","Mangoes","kg",4,2,100,"Produce"],["i50","Bananas","dozen",4,2,60,"Produce"],
    ["i51","Ice cream","L",4,2,180,"Dairy"],["i52","Cocoa powder","kg",1,0.5,450,"Essentials"],["i53","Lettuce","kg",2,1,100,"Produce"],["i54","Tea leaves","kg",2,1,400,"Beverages"],["i55","Fresh cream","L",2,1,220,"Dairy"],["i56","Vinegar","L",2,1,80,"Essentials"],["i57","Black pepper","kg",1,0.5,500,"Essentials"],["i58","Kidney beans","kg",4,2,130,"Grains"],["i59","Lentils","kg",6,2,110,"Grains"],["i60","Chickpeas","kg",5,2,100,"Grains"]
  ].map(([id, name, unit, stock, minimum, unitCost, category]) => ({ id, name, unit, stock, minimum, unitCost, category })),
  purchases: [], menuDefaultsVersion: 4, inventoryDefaultsVersion: 1
};

const hasCost = (v) => v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v));
const escapeHtml = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(a);
const statusBadge = (s) => `<span class="badge ${escapeHtml(s.toLowerCase())}">${escapeHtml(s)}</span>`;
const getTodayOrders = () => data.orders.filter((o) => o.day === todayKey());
const getOrderItems = (o) => Array.isArray(o.items) ? o.items : [{ name: o.item, qty: Number(o.qty), unitPrice: Number(o.total) / Number(o.qty), unitCost: o.unitCost }];
const orderItemsSummary = (o) => getOrderItems(o).map((i) => `${i.name} × ${i.qty}`).join(", ");
const heading = (t, s, a = "") => `<div class="page-heading"><div><div class="eyebrow">Royal's Canteen</div><h1>${t}</h1><p class="page-subtitle">${s}</p></div>${a}</div>`;
const emptyState = (i, t, c) => `<div class="empty-state"><span>${i}</span><strong>${t}</strong>${c}</div>`;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(seedData);
    const p = JSON.parse(raw);
    if (!p || !Array.isArray(p.menu) || !Array.isArray(p.orders) || !Array.isArray(p.inventory)) throw new Error("Invalid format");
    if (Number(p.menuDefaultsVersion || 0) < 4) {
      const ids = new Set(p.menu.map((i) => i.id));
      p.menu.push(...seedData.menu.filter((i) => Number(i.id.slice(1)) >= 7 && !ids.has(i.id)));
      p.menuDefaultsVersion = 4; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
    }
    if (Number(p.inventoryDefaultsVersion || 0) < 1) {
      const ids = new Set(p.inventory.map((i) => i.id));
      p.inventory.push(...seedData.inventory.filter((i) => Number(i.id.slice(1)) >= 6 && !ids.has(i.id)));
      p.inventoryDefaultsVersion = 1; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
    }
    const mCosts = new Map(seedData.menu.map((i) => [i.id, i.costPerServing]));
    p.menu = p.menu.map((i) => ({ ...i, costPerServing: hasCost(i.costPerServing) ? Number(i.costPerServing) : mCosts.get(i.id) ?? null }));
    p.orders = p.orders.map((o) => {
      if (Array.isArray(o.items)) return o;
      const m = p.menu.find((x) => x.name === o.item), uc = o.unitCost !== undefined ? o.unitCost : m ? m.costPerServing : null;
      return { ...o, unitCost: uc, items: [{ name: o.item, qty: Number(o.qty), unitPrice: Number(o.total) / Number(o.qty), unitCost: uc }] };
    });
    const iCosts = new Map(seedData.inventory.map((i) => [i.id, i.unitCost]));
    p.inventory = p.inventory.map((i) => ({ ...i, unitCost: hasCost(i.unitCost) ? Number(i.unitCost) : iCosts.get(i.id) ?? null }));
    if (!Array.isArray(p.purchases)) p.purchases = [];
    return p;
  } catch { return structuredClone(seedData); }
}

let data = loadData(), activePage = document.body?.dataset.defaultPage || "overview", toastTimer, serverSync = Promise.resolve();
let serverApiEnabled = location.protocol !== "file:" && !location.hostname.endsWith(".github.io");
const pageContent = document.querySelector("#page-content"), modalBackdrop = document.querySelector("#modal-backdrop"), modal = document.querySelector("#modal");

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); if (serverApiEnabled) queueServerSync(JSON.stringify(data)); return true; }
  catch { showToast("Couldn't save changes. Check your browser storage settings."); return false; }
}
function queueServerSync(snap) {
  serverSync = serverSync.then(async () => { const r = await fetch("/api/data", { method: "PUT", headers: { "Content-Type": "application/json" }, body: snap }); if (!r.ok) throw new Error(r.status); })
    .catch(() => showToast("Changes are saved in this browser, but couldn't sync with the server."));
}
async function loadServerData() {
  if (!serverApiEnabled) return;
  try {
    const r = await fetch("/api/data"), isJson = (r.headers.get("content-type") || "").includes("application/json");
    if (r.status === 404) { if (!isJson) { serverApiEnabled = false; return; } queueServerSync(JSON.stringify(data)); return; }
    if (!r.ok || !isJson) { if (!isJson) serverApiEnabled = false; return; }
    const s = await r.json();
    if (!s || !Array.isArray(s.menu) || !Array.isArray(s.orders) || !Array.isArray(s.inventory)) throw new Error("Invalid data");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); data = loadData(); renderPage();
    if (JSON.stringify(data) !== JSON.stringify(s)) queueServerSync(JSON.stringify(data));
  } catch { showToast("Couldn't load data from the server. Browser-saved data is still available."); }
}

function getTodayFinancials() {
  const orders = getTodayOrders().filter((o) => o.status !== "Cancelled");
  let revenue = 0, costOfGoods = 0, unknownCostOrders = 0;
  orders.forEach((o) => {
    revenue += Number(o.total); const its = getOrderItems(o);
    if (its.some((i) => !hasCost(i.unitCost))) unknownCostOrders += 1;
    costOfGoods += its.reduce((s, i) => s + (hasCost(i.unitCost) ? Number(i.unitCost) * Number(i.qty) : 0), 0);
  });
  const purchaseSpend = (data.purchases || []).filter((p) => p.day === todayKey()).reduce((s, p) => s + Number(p.total), 0);
  return { revenue, costOfGoods, grossProfit: unknownCostOrders ? null : revenue - costOfGoods, purchaseSpend, unknownCostOrders, orderCount: orders.length };
}
function showToast(msg) { const t = document.querySelector("#toast"); t.textContent = msg; t.classList.add("visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("visible"), 2800); }
function setPage(page) { activePage = page; document.querySelectorAll(".nav-link").forEach((l) => l.classList.toggle("active", l.dataset.page === page)); document.querySelector("#breadcrumb-page").textContent = PAGE_TITLES[page]; document.querySelector("#sidebar").classList.remove("open"); renderPage(); }

function renderOverview() {
  const today = getTodayOrders(), active = today.filter((o) => ["Preparing", "Ready"].includes(o.status)), low = data.inventory.filter((i) => Number(i.stock) <= Number(i.minimum)), f = getTodayFinancials(), h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const top = data.menu.map((i) => ({ ...i, sold: today.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + getOrderItems(o).filter((x) => x.name === i.name).reduce((a, x) => a + Number(x.qty), 0), 0) })).sort((a, b) => b.sold - a.sold).slice(0, 4);
  const recent = data.orders.slice(0, 5);
  return `${heading(`${greet}, Admin 👋`, "Here's what's happening at your canteen today.", `<button class="button" data-action="new-order">＋ New order</button>`)}
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-top"><span>Today's revenue</span><span class="stat-icon">₹</span></div><div class="stat-value">${money(f.revenue)}</div><div class="stat-note"><span class="positive">●</span> From ${today.length} orders today</div></article>
      <article class="stat-card"><div class="stat-top"><span>Total orders</span><span class="stat-icon">▤</span></div><div class="stat-value">${today.length}</div><div class="stat-note">${active.length} orders need attention</div></article>
      <article class="stat-card"><div class="stat-top"><span>Today's gross profit</span><span class="stat-icon">↗</span></div><div class="stat-value">${f.grossProfit === null ? "—" : money(f.grossProfit)}</div><div class="stat-note">${f.unknownCostOrders ? "Add item costs to calculate profit" : "Sales minus food preparation costs"}</div></article>
      <article class="stat-card"><div class="stat-top"><span>Menu items</span><span class="stat-icon">▦</span></div><div class="stat-value">${data.menu.length}</div><div class="stat-note">Across your canteen menu</div></article>
      <article class="stat-card"><div class="stat-top"><span>Low stock items</span><span class="stat-icon">▧</span></div><div class="stat-value">${low.length}</div><div class="stat-note">${low.length ? "Restock needed soon" : "All essentials are stocked"}</div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><h2>Recent orders</h2><button class="panel-link" data-page="orders">View all orders →</button></div>${recent.length ? `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>${recent.map((o) => `<tr><td class="cell-strong">#${escapeHtml(o.id)}</td><td>${escapeHtml(o.customer)}</td><td>${escapeHtml(orderItemsSummary(o))}</td><td class="cell-strong">${money(o.total)}</td><td>${statusBadge(o.status)}</td></tr>`).join("")}</tbody></table></div>` : emptyState("▤", "No orders yet", "New orders will show up here.")}</section>
      <section class="panel"><div class="panel-header"><h2>Popular items today</h2><button class="panel-link" data-page="menu">View menu →</button></div>${top.length ? `<div class="popular-list">${top.map((i) => `<div class="popular-item"><span class="food-emoji">${escapeHtml(i.emoji)}</span><div><div class="popular-name">${escapeHtml(i.name)}</div><div class="popular-meta">${i.sold} sold today</div></div><span class="popular-sales">${money(i.price)}</span></div>`).join("")}</div>` : emptyState("🍽️", "No menu items", "Add items to get started.")}${low.length ? `<div class="inventory-alert">⚠ ${low.length} item${low.length === 1 ? "" : "s"} running low: ${low.map((i) => escapeHtml(i.name)).join(", ")}.</div>` : ""}</section>
    </div>`;
}

function renderOrders() {
  return `${heading("Orders", "Track and manage canteen orders.", `<button class="button" data-action="new-order">＋ New order</button>`)}
    <div class="toolbar" style="margin-bottom:14px"><label class="search-box"><span>⌕</span><input id="order-search" placeholder="Search order or customer" aria-label="Search order or customer"></label><select class="select-control" id="order-status" aria-label="Filter by status">${["All statuses", "Preparing", "Ready", "Completed", "Cancelled"].map((s) => `<option>${s}</option>`).join("")}</select></div>
    <section class="data-panel" id="orders-table"></section>`;
}
function renderOrdersTable() {
  const q = (document.querySelector("#order-search")?.value || "").trim().toLowerCase(), st = document.querySelector("#order-status")?.value || "All statuses";
  const list = data.orders.filter((o) => `${o.id} ${o.customer} ${orderItemsSummary(o)}`.toLowerCase().includes(q) && (st === "All statuses" || o.status === st));
  document.querySelector("#orders-table").innerHTML = list.length ? `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Time</th><th>Payment</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>${list.map((o) => {
    const nx = o.status === "Preparing" ? "Ready" : o.status === "Ready" ? "Completed" : "";
    return `<tr><td class="cell-strong">#${escapeHtml(o.id)}</td><td>${escapeHtml(o.customer)}</td><td>${escapeHtml(orderItemsSummary(o))}</td><td>${escapeHtml(o.time)}</td><td>${escapeHtml(o.payment)}</td><td class="cell-strong">${money(o.total)}</td><td>${statusBadge(o.status)}</td><td>${nx ? `<button class="button secondary small" data-action="advance-order" data-id="${escapeHtml(o.id)}">${nx}</button>` : "—"}</td></tr>`;
  }).join("")}</tbody></table></div>` : emptyState("⌕", "No matching orders", "Try changing your search or status filter.");
}

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`;
const MENU_POOLS = {
  dosa: ["1668236543090-82eba5ee5976","1630383249896-424e482df921","1589301760014-d929f3979dbc"],
  idli: ["1589301760014-d929f3979dbc","1630383249896-424e482df921","1668236543090-82eba5ee5976"],
  paratha: ["1626132647523-66f5bf380027","1565557623262-b51c2513a641","1606491956689-2ea866880c84"],
  biryani: ["1563379091339-03b21ab4a4f8","1589302168068-964664d93dc0","1633945274405-b6c8069047b0"],
  chicken: ["1631515243349-e0cb75fb8d3a","1603894584373-5ac82b2ae398","1599487488170-d11ec9c172f0"],
  egg: ["1525351484163-7529414344d8","1482049016688-2d3e1b311543","1510693206972-df098062cb71"],
  seafood: ["1534422298391-e4f8c172dddb","1559737558-2f5a35f4523b","1565680018434-b513d5e5fd47"],
  paneer: ["1565557623262-b51c2513a641","1631452180519-c014fe946bc7","1585937421612-70a008356fbe"],
  roll: ["1626700051175-6818013e1d4f","1565557623262-b51c2513a641","1601050690597-df0568f70950"],
  samosa: ["1601050690597-df0568f70950","1606491956689-2ea866880c84","1567337710282-00832b415979"],
  sandwich: ["1528735602780-2552fd46c7af","1550507992-eb63ffee0847","1539252554453-80ab65ce3586"],
  burger: ["1568901346375-23c9450c58cd","1550547660-d9450f859349","1551782450-a2132b4ba21d"],
  fries: ["1576107232684-1279f390859f","1541592106381-b31e9677c0e5","1518013431117-eb1465fa5752"],
  noodles: ["1612929633738-8fe44f7ec841","1569718212165-3a8278d5f624","1555126634-323283e090fa"],
  pasta: ["1645112411341-6c4fd023714a","1555949258-eb67b1ef0ceb","1621996346565-e3dbc646d9a9"],
  thali: ["1585937421612-70a008356fbe","1546833999-b9f581a1996d","1606491956689-2ea866880c84"],
  coffee: ["1461023058943-07fcbe16d735","1517701550927-30cf4ba1dba5","1509042239860-f550ce710b93"],
  tea: ["1571934811356-5cc061b6821f","1544787219-7f47ccb76574","1597318181409-cf64d0b5d8a2"],
  drink: ["1572490122747-3968b75cc699","1513558161293-cdaf765ed2fd","1577805947697-89e18249d767"],
  dessert: ["1563805042-7684c019e1cb","1606313564200-e75d5e30476c","1551024601-bec78aea704b"],
  fruit: ["1546069901-ba9599a7e63c","1490474418585-ba9bad8fd0ea","1519996529931-28324d5a630e"]
};
const POOL_RULES = [[/dosa|uttapam/,"dosa"],[/idli|poha|upma/,"idli"],[/paratha|bhature/,"paratha"],[/biryani|pulao/,"biryani"],[/fish|prawn/,"seafood"],[/egg|omelette/,"egg"],[/pasta/,"pasta"],[/noodle|manchurian/,"noodles"],[/burger|vada pav/,"burger"],[/sandwich/,"sandwich"],[/fries/,"fries"],[/roll|wrap|shawarma/,"roll"],[/samosa|kachori|pakora|dhokla|chaat|momos/,"samosa"],[/chicken|mutton|kebab|tandoori|lollipop|keema/,"chicken"],[/paneer/,"paneer"],[/coffee|chocolate/,"coffee"],[/chai|tea/,"tea"],[/lassi|soda|buttermilk|milk|shake|drink/,"drink"],[/brownie|ice cream|gulab|dessert/,"dessert"],[/fruit/,"fruit"]];
const menuPhotoIdx = new Map(), menuSwipeX = new Map();
const menuFallback = (n, i) => `https://placehold.co/600x380/245C43/FFFFFF?text=${encodeURIComponent(`${n} (${i + 1}/3)`)}`;
function getMenuItemImages(it) {
  if (Array.isArray(it.images) && it.images.length) return it.images;
  const txt = `${it.name || ""} ${it.category || ""}`.toLowerCase();
  const key = (/brownie/.test(txt) ? "dessert" : POOL_RULES.find(([re]) => re.test(txt))?.[1]) || "thali";
  const pool = MENU_POOLS[key], off = [...String(it.id || it.name)].reduce((a, c) => a + c.charCodeAt(0), 0) % pool.length;
  return pool.map((_, i) => IMG(pool[(i + off) % pool.length]));
}
function updateMenuCardPhoto(id, next) {
  const it = data.menu.find((e) => e.id === id); if (!it) return;
  const imgs = getMenuItemImages(it), idx = ((next % imgs.length) + imgs.length) % imgs.length;
  menuPhotoIdx.set(id, idx);
  const card = pageContent.querySelector(`.menu-card[data-menu-id="${CSS.escape(id)}"]`); if (!card) return;
  const img = card.querySelector(".menu-card-img");
  if (img) { img.onerror = function () { this.onerror = null; this.src = menuFallback(it.name, idx); }; img.src = imgs[idx]; img.alt = `${it.name} — photo ${idx + 1} of ${imgs.length}`; }
  const cnt = card.querySelector(".menu-photo-counter"); if (cnt) cnt.textContent = `${idx + 1}/${imgs.length}`;
  card.querySelectorAll(".menu-dot").forEach((d, i) => i === idx ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"));
}
function wireMenuCarousels() {
  pageContent.querySelectorAll(".menu-carousel").forEach((car) => {
    const tr = car.querySelector(".menu-carousel-track"), st = car.querySelector(".menu-carousel-status"), pb = car.querySelector('[data-action="menu-carousel-prev"]'), nb = car.querySelector('[data-action="menu-carousel-next"]');
    if (!tr) return;
    let last = 0, db = null;
    const slides = () => [...tr.querySelectorAll(".menu-card")];
    const sync = (ann) => {
      const sl = slides(), trL = tr.getBoundingClientRect().left;
      let best = 0, dist = Infinity;
      sl.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().left - trL); if (d < dist) { dist = d; best = i; } });
      if (pb && nb) {
        const aS = tr.scrollLeft <= 2, aE = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 2, pf = document.activeElement === pb, nf = document.activeElement === nb;
        pb.disabled = aS; nb.disabled = aE;
        if (aS && pf && !nb.disabled) nb.focus();
        if (aE && nf && !pb.disabled) pb.focus();
      }
      if (ann && st && best !== last && sl.length) st.textContent = `Showing dish ${best + 1} of ${sl.length}`;
      last = best;
    };
    const step = (dir) => { const sl = slides(); if (!sl.length) return; tr.scrollBy({ left: dir * Math.max(sl[0].getBoundingClientRect().width + 14, tr.clientWidth * 0.72), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
    pb?.addEventListener("click", () => step(-1)); nb?.addEventListener("click", () => step(1));
    if ("onscrollend" in window) tr.addEventListener("scrollend", () => sync(true));
    else tr.addEventListener("scroll", () => { clearTimeout(db); db = setTimeout(() => sync(true), 120); }, { passive: true });
    sync(false);
  });
  pageContent.querySelectorAll(".menu-card-media").forEach((m) => {
    const id = m.dataset.menuId;
    m.addEventListener("touchstart", (e) => { if (e.touches?.length === 1) menuSwipeX.set(id, e.touches[0].clientX); }, { passive: true });
    m.addEventListener("touchend", (e) => { const sx = menuSwipeX.get(id); menuSwipeX.delete(id); if (sx !== undefined && e.changedTouches) { const df = e.changedTouches[0].clientX - sx; if (Math.abs(df) > 35) updateMenuCardPhoto(id, (menuPhotoIdx.get(id) || 0) + (df < 0 ? 1 : -1)); } }, { passive: true });
  });
}
function renderMenu() {
  const cats = [...new Set(data.menu.map((i) => i.category))]; let gIdx = 0;
  const secs = cats.map((cat) => {
    const items = data.menu.filter((i) => i.category === cat);
    const cards = items.map((i, pos) => {
      const imgs = getMenuItemImages(i), idx = menuPhotoIdx.get(i.id) || 0, pri = gIdx++ < 2 ? 'fetchpriority="high"' : 'loading="lazy"';
      return `<article class="menu-card" role="group" aria-roledescription="slide" aria-label="${pos + 1} of ${items.length}: ${escapeHtml(i.name)}" data-menu-id="${escapeHtml(i.id)}">
        <div class="menu-card-media" data-menu-id="${escapeHtml(i.id)}">
          <img class="menu-card-img" src="${escapeHtml(imgs[idx])}" alt="${escapeHtml(i.name)} — photo ${idx + 1} of ${imgs.length}" ${pri} onerror="this.onerror=null;this.src='${escapeHtml(menuFallback(i.name, idx))}';">
          <span class="menu-emoji-badge" aria-hidden="true">${escapeHtml(i.emoji)}</span><span class="menu-photo-counter">${idx + 1}/${imgs.length}</span>
          <button class="menu-slide-arrow prev" type="button" data-action="menu-slide-img" data-id="${escapeHtml(i.id)}" data-delta="-1" aria-label="Previous photo of ${escapeHtml(i.name)}">‹</button>
          <button class="menu-slide-arrow next" type="button" data-action="menu-slide-img" data-id="${escapeHtml(i.id)}" data-delta="1" aria-label="Next photo of ${escapeHtml(i.name)}">›</button>
          <div class="menu-photo-dots">${imgs.map((_, d) => `<button class="menu-dot" type="button" data-action="menu-dot-img" data-id="${escapeHtml(i.id)}" data-index="${d}" ${d === idx ? 'aria-current="true"' : ""} aria-label="View photo ${d + 1} of ${escapeHtml(i.name)}"></button>`).join("")}</div>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-top"><h3>${escapeHtml(i.name)}</h3><div class="menu-actions"><button class="icon-button" title="Edit ${escapeHtml(i.name)}" aria-label="Edit ${escapeHtml(i.name)}" data-action="edit-menu" data-id="${escapeHtml(i.id)}">✎</button><button class="icon-button" title="Remove ${escapeHtml(i.name)}" aria-label="Remove ${escapeHtml(i.name)}" data-action="delete-menu" data-id="${escapeHtml(i.id)}">×</button></div></div>
          <p>${escapeHtml(i.description || "Freshly prepared")}</p><p class="menu-cost">${hasCost(i.costPerServing) ? `Cost ${money(i.costPerServing)} · Profit ${money(Number(i.price) - Number(i.costPerServing))} / serving` : "Cost not set · profit unavailable"}</p>
          <div class="menu-card-bottom"><span class="menu-price">${money(i.price)}</span><span class="category-tag">${escapeHtml(i.category)}</span></div>
        </div></article>`;
    }).join("");
    return `<section class="menu-carousel" aria-roledescription="carousel" aria-label="${escapeHtml(cat)} menu dishes"><div class="menu-carousel-head"><div><h2>${escapeHtml(cat)}</h2><span>${items.length} dish${items.length === 1 ? "" : "es"} · Slide photos or scroll across</span></div><div class="menu-carousel-controls"><button class="menu-scroll-btn" type="button" data-action="menu-carousel-prev" aria-label="Previous ${escapeHtml(cat)} dishes">‹</button><button class="menu-scroll-btn" type="button" data-action="menu-carousel-next" aria-label="Next ${escapeHtml(cat)} dishes">›</button></div></div><div class="menu-carousel-track" tabindex="0" role="group" aria-label="${escapeHtml(cat)} dishes">${cards}</div><p class="sr-only menu-carousel-status" role="status" aria-live="polite"></p></section>`;
  }).join("");
  return `${heading("Menu", "Manage the dishes and drinks available at your canteen.", `<button class="button" data-action="new-menu-item">＋ Add item</button>`)}${cats.length ? `<div class="menu-sections">${secs}</div>` : emptyState("🍽️", "Your menu is empty", "Add an item to start building your menu.")}`;
}

function renderInventory() {
  const rows = data.inventory.map((i) => `<tr><td class="cell-strong">${escapeHtml(i.name)}<span class="cell-sub">${escapeHtml(i.category)}</span></td><td>${escapeHtml(i.stock)} ${escapeHtml(i.unit)}</td><td>${hasCost(i.unitCost) ? `${money(i.unitCost)} / ${escapeHtml(i.unit)}` : "Not set"}</td><td>${escapeHtml(i.minimum)} ${escapeHtml(i.unit)}</td><td>${Number(i.stock) <= Number(i.minimum) ? `<span class="badge cancelled">Low stock</span>` : `<span class="badge completed">In stock</span>`}</td><td><button class="button secondary small" data-action="restock" data-id="${escapeHtml(i.id)}">＋ Restock</button></td></tr>`).join("");
  return `${heading("Inventory", "Starter ingredients for your menu. Update stock and costs to match your kitchen.", `<button class="button" data-action="new-inventory-item">＋ Add ingredient</button>`)}<section class="data-panel">${rows ? `<div class="table-wrap"><table><thead><tr><th>Ingredient</th><th>Current stock</th><th>Unit purchase cost</th><th>Low-stock alert</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("▧", "No ingredients tracked", "Add ingredients to start tracking stock.")}</section>`;
}

function renderReports() {
  const f = getTodayFinancials(), orders = getTodayOrders().filter((o) => o.status !== "Cancelled"), byItem = new Map();
  let units = 0;
  orders.forEach((o) => getOrderItems(o).forEach((i) => {
    units += Number(i.qty);
    const s = byItem.get(i.name) || { name: i.name, qty: 0, revenue: 0, costOfGoods: 0, costKnown: true };
    s.qty += Number(i.qty); s.revenue += Number(i.unitPrice) * Number(i.qty);
    if (hasCost(i.unitCost)) s.costOfGoods += Number(i.unitCost) * Number(i.qty); else s.costKnown = false;
    byItem.set(i.name, s);
  }));
  const sales = [...byItem.values()].map((s) => ({ ...s, emoji: data.menu.find((m) => m.name === s.name)?.emoji || "🍽️" })).sort((a, b) => b.qty - a.qty);
  const payTot = (m) => orders.filter((o) => o.payment === m).reduce((s, o) => s + Number(o.total), 0);
  const purch = (data.purchases || []).filter((p) => p.day === todayKey());
  const pRows = [...purch].reverse().map((p) => `<tr><td class="cell-strong">${escapeHtml(p.name)}</td><td>${escapeHtml(p.quantity)} ${escapeHtml(p.unit)}</td><td>${money(p.unitCost)} / ${escapeHtml(p.unit)}</td><td>${escapeHtml(p.time)}</td><td class="cell-strong">${money(p.total)}</td></tr>`).join("");
  return `${heading("Sales & reports", "A quick look at today's canteen performance.")}
    <div class="report-summary">
      <article class="report-card"><span>Today's sales</span><strong>${money(f.revenue)}</strong><small>From ${orders.length} completed and active orders</small></article>
      <article class="report-card"><span>Today's stock purchases</span><strong>${money(f.purchaseSpend)}</strong><small>Across ${purch.length} stock purchases</small></article>
      <article class="report-card"><span>Cost of items sold</span><strong>${money(f.costOfGoods)}</strong><small>Based on each menu item's prep cost</small></article>
      <article class="report-card profit-card"><span>Today's gross profit</span><strong>${f.grossProfit === null ? "—" : money(f.grossProfit)}</strong><small>${f.unknownCostOrders ? `Missing cost on ${f.unknownCostOrders} order(s)` : "Sales minus preparation costs"}</small></article>
      <article class="report-card"><span>Sales less stock purchases</span><strong>${money(f.revenue - f.purchaseSpend)}</strong><small>Today's recorded sales minus inventory buys</small></article>
      <article class="report-card"><span>Items sold</span><strong>${units}</strong><small>Across ${sales.length} menu items</small></article>
      <article class="report-card"><span>Average order value</span><strong>${money(orders.length ? Math.round(f.revenue / orders.length) : 0)}</strong><small>Based on today's orders</small></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><h2>Sales by menu item</h2><span class="category-tag">Today</span></div>${sales.length ? `<div class="table-wrap"><table class="report-table"><thead><tr><th>Item</th><th>Units sold</th><th>Sales</th><th>Prep cost</th><th>Profit</th></tr></thead><tbody>${sales.map((s) => `<tr><td class="cell-strong">${escapeHtml(s.emoji)} &nbsp;${escapeHtml(s.name)}</td><td>${s.qty}</td><td>${money(s.revenue)}</td><td>${s.costKnown ? money(s.costOfGoods) : "—"}</td><td class="cell-strong">${s.costKnown ? money(s.revenue - s.costOfGoods) : "—"}</td></tr>`).join("")}</tbody></table></div>` : emptyState("↗", "No sales yet", "Sales will appear once orders are placed.")}</section>
      <section class="panel"><div class="panel-header"><h2>Payment breakdown</h2><span class="category-tag">Today</span></div><div class="popular-list">${[["📱","UPI"],["💵","Cash"],["💳","Card"]].map(([e, m]) => `<div class="popular-item"><span class="food-emoji">${e}</span><div><div class="popular-name">${m}</div><div class="popular-meta">${orders.filter((o) => o.payment === m).length} orders</div></div><span class="popular-sales">${money(payTot(m))}</span></div>`).join("")}</div></section>
    </div>
    <section class="panel purchase-panel"><div class="panel-header"><h2>Stock purchases today</h2><span class="category-tag">Total ${money(f.purchaseSpend)}</span></div>${pRows ? `<div class="table-wrap"><table><thead><tr><th>Ingredient</th><th>Quantity</th><th>Cost per unit</th><th>Time</th><th>Total spent</th></tr></thead><tbody>${pRows}</tbody></table></div>` : emptyState("▧", "No stock purchases today", "Restock inventory to record purchase costs here.")}</section>
    <p class="report-note">Gross profit is sales minus the recorded cost to prepare items sold. Stock purchases are tracked separately and may include ingredients still in inventory.</p>`;
}

const renderNotifications = () => window.CanteenNotifications ? window.CanteenNotifications.renderNotificationsView() : emptyState("🔔", "Notifications unavailable", "Could not load the notifications module.");
function updateNotificationBadge() { const b = document.querySelector("#nav-notif-count"); if (!b || !window.CanteenNotifications) return; const c = window.CanteenNotifications.getUnreadCount(); b.textContent = c; b.classList.toggle("has-unread", c > 0); }

function renderPage() {
  const map = { overview: renderOverview, orders: renderOrders, notifications: renderNotifications, menu: renderMenu, inventory: renderInventory, reports: renderReports };
  pageContent.innerHTML = map[activePage]();
  document.querySelector("#nav-order-count").textContent = data.orders.filter((o) => ["Preparing", "Ready"].includes(o.status)).length;
  updateNotificationBadge();
  if (activePage === "orders") { renderOrdersTable(); document.querySelector("#order-search").addEventListener("input", renderOrdersTable); document.querySelector("#order-status").addEventListener("change", renderOrdersTable); }
  if (activePage === "menu") wireMenuCarousels();
}

function openModal(title, subtitle, fields, submitLabel, onSubmit, cls = "") {
  modal.className = `modal ${cls}`.trim();
  modal.innerHTML = `<div class="modal-header"><div><h2 id="modal-title">${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close dialog">×</button></div><form id="modal-form"><div class="form-grid">${fields}</div><div class="modal-footer"><button class="button secondary" type="button" data-action="close-modal">Cancel</button><button class="button" type="submit">${escapeHtml(submitLabel)}</button></div></form>`;
  modalBackdrop.hidden = false; modal.querySelector("input, select")?.focus();
  modal.querySelector("#modal-form").addEventListener("submit", (e) => { e.preventDefault(); if (onSubmit(new FormData(e.currentTarget))) closeModal(); });
}
function closeModal() { modalBackdrop.hidden = true; modal.innerHTML = ""; modal.className = "modal"; }
function updateOrderEstimate() {
  const el = modal.querySelector("#order-estimate"); if (!el) return;
  el.textContent = money([...modal.querySelectorAll("[data-order-line]")].reduce((s, r) => {
    const it = data.menu.find((e) => e.id === r.querySelector('[name="item"]').value), q = Number(r.querySelector('[name="qty"]').value);
    return it && Number.isFinite(q) && q > 0 ? s + it.price * q : s;
  }, 0));
}
function addPurchase(item, qty, unitCost) { data.purchases.push({ id: `p${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: item.name, quantity: qty, unit: item.unit, unitCost, total: qty * unitCost, day: todayKey(), time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }); }
const orderLineHtml = (idx) => `<div class="order-line" data-order-line><div class="field"><label for="order-item-${idx}">Menu item</label><select id="order-item-${idx}" name="item" required>${data.menu.map((i) => `<option value="${escapeHtml(i.id)}">${escapeHtml(i.name)} — ${money(i.price)}${hasCost(i.costPerServing) ? ` (cost ${money(i.costPerServing)})` : " (cost not set)"}</option>`).join("")}</select></div><div class="field"><label for="order-qty-${idx}">Quantity</label><input id="order-qty-${idx}" name="qty" type="number" min="1" max="99" value="1" required></div><button class="icon-button order-remove" type="button" data-action="remove-order-item" aria-label="Remove item" title="Remove item">×</button></div>`;

function newOrderModal() {
  if (!data.menu.length) return showToast("Add a menu item before creating an order.");
  openModal("Create a new order", "Add multiple dishes and set a quantity for each.",
    `<div class="field"><label for="customer">Customer name</label><input id="customer" name="customer" required maxlength="60" placeholder="e.g. Ananya Shah"></div><div class="order-items" id="order-items">${orderLineHtml(1)}</div><div class="order-controls"><button class="button secondary small" type="button" data-action="add-order-item">＋ Add another item</button><strong>Order total: <span id="order-estimate">${money(data.menu[0].price)}</span></strong></div><div class="field"><label for="payment">Payment method</label><select id="payment" name="payment"><option>UPI</option><option>Cash</option><option>Card</option></select></div>`,
    "Place order", (fd) => {
      const ids = fd.getAll("item"), qtys = fd.getAll("qty");
      const items = ids.map((id, i) => { const m = data.menu.find((x) => x.id === id), q = Number(qtys[i]); return m && Number.isInteger(q) && q >= 1 && q <= 99 ? { name: m.name, qty: q, unitPrice: Number(m.price), unitCost: hasCost(m.costPerServing) ? Number(m.costPerServing) : null } : null; });
      if (!items.length || items.includes(null)) { showToast("Check each selected item and its quantity."); return false; }
      const nextId = String(Math.max(1000, ...data.orders.map((o) => Number(o.id) || 0)) + 1);
      data.orders.unshift({ id: nextId, customer: String(fd.get("customer")).trim(), items, total: items.reduce((s, i) => s + i.unitPrice * i.qty, 0), status: "Preparing", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), payment: String(fd.get("payment")), day: todayKey() });
      if (!saveData()) { data.orders.shift(); return false; }
      renderPage(); showToast(`Order #${nextId} placed successfully.`); return true;
    }, "order-modal");
  modal.addEventListener("input", updateOrderEstimate); modal.addEventListener("change", updateOrderEstimate);
}
function menuModal(item = null) {
  const cats = ["Breakfast", "Meals", "Non-Veg", "Snacks", "Drinks", "Desserts"];
  openModal(item ? "Edit menu item" : "Add a menu item", item ? "Update the selling price and preparation cost." : "Add a dish or drink to your canteen menu.",
    `<div class="field"><label for="item-name">Item name</label><input id="item-name" name="name" required maxlength="50" value="${escapeHtml(item?.name || "")}" placeholder="e.g. Vegetable Pulao"></div><div class="form-row"><div class="field"><label for="item-price">Selling price (₹)</label><input id="item-price" name="price" type="number" min="1" max="100000" required value="${escapeHtml(item?.price ?? "")}" placeholder="80"></div><div class="field"><label for="item-cost">Cost to prepare (₹)</label><input id="item-cost" name="costPerServing" type="number" min="0" max="100000" step="0.01" required value="${hasCost(item?.costPerServing) ? escapeHtml(item.costPerServing) : ""}" placeholder="35"></div></div><div class="field"><label for="item-category">Category</label><select id="item-category" name="category">${cats.map((c) => `<option${item?.category === c ? " selected" : ""}>${c}</option>`).join("")}</select></div><div class="field"><label for="item-description">Description</label><input id="item-description" name="description" maxlength="100" value="${escapeHtml(item?.description || "")}" placeholder="A short description (optional)"></div>`,
    item ? "Save changes" : "Add to menu", (fd) => {
      const name = String(fd.get("name")).trim(); if (!name) return false;
      const fields = { name, price: Number(fd.get("price")), costPerServing: Number(fd.get("costPerServing")), category: String(fd.get("category")), description: String(fd.get("description")).trim() };
      if (item) { const prev = { ...item }; Object.assign(item, fields); if (!saveData()) { Object.assign(item, prev); return false; } renderPage(); showToast(`${item.name} updated.`); return true; }
      data.menu.push({ id: `m${Date.now()}`, emoji: "🍽️", ...fields });
      if (!saveData()) { data.menu.pop(); return false; } renderPage(); showToast(`${name} added to the menu.`); return true;
    });
}
function newInventoryModal() {
  openModal("Add an ingredient", "Start tracking an ingredient in your stock.",
    `<div class="field"><label for="ingredient-name">Ingredient name</label><input id="ingredient-name" name="name" required maxlength="50" placeholder="e.g. Tomatoes"></div><div class="form-row"><div class="field"><label for="ingredient-stock">Starting stock</label><input id="ingredient-stock" name="stock" type="number" min="0" step="0.1" required value="0"></div><div class="field"><label for="ingredient-unit">Unit</label><select id="ingredient-unit" name="unit"><option>kg</option><option>L</option><option>pcs</option><option>pack</option></select></div></div><div class="field"><label for="ingredient-cost">Purchase cost per unit (₹)</label><input id="ingredient-cost" name="unitCost" type="number" min="0.01" max="100000" step="0.01" required placeholder="e.g. 40"></div><div class="form-row"><div class="field"><label for="ingredient-minimum">Low-stock alert at</label><input id="ingredient-minimum" name="minimum" type="number" min="0" step="0.1" required value="5"></div><div class="field"><label for="ingredient-category">Category</label><select id="ingredient-category" name="category"><option>Produce</option><option>Grains</option><option>Dairy</option><option>Meat &amp; seafood</option><option>Bakery</option><option>Essentials</option><option>Beverages</option><option>Other</option></select></div></div>`,
    "Add ingredient", (fd) => {
      const name = String(fd.get("name")).trim(); if (!name) return false;
      const item = { id: `i${Date.now()}`, name, stock: Number(fd.get("stock")), unit: String(fd.get("unit")), minimum: Number(fd.get("minimum")), unitCost: Number(fd.get("unitCost")), category: String(fd.get("category")) };
      data.inventory.push(item); if (item.stock > 0) addPurchase(item, item.stock, item.unitCost);
      if (!saveData()) { data.inventory.pop(); if (item.stock > 0) data.purchases.pop(); return false; }
      renderPage(); showToast(`${name} added to inventory.`); return true;
    });
}
function restockModal(id) {
  const it = data.inventory.find((e) => e.id === id); if (!it) return;
  openModal(`Restock ${it.name}`, `Current stock: ${it.stock} ${it.unit}.`,
    `<div class="field"><label for="restock-quantity">Quantity to add (${escapeHtml(it.unit)})</label><input id="restock-quantity" name="quantity" type="number" min="0.1" step="0.1" required placeholder="Enter quantity"></div><div class="field"><label for="restock-unit-cost">Purchase cost per ${escapeHtml(it.unit)} (₹)</label><input id="restock-unit-cost" name="unitCost" type="number" min="0.01" max="100000" step="0.01" required value="${hasCost(it.unitCost) ? escapeHtml(it.unitCost) : ""}" placeholder="Enter purchase cost"></div>`,
    "Record purchase", (fd) => {
      const q = Number(fd.get("quantity")), uc = Number(fd.get("unitCost")); if (!(q > 0 && uc > 0)) return false;
      const ps = Number(it.stock), pc = it.unitCost; it.stock = ps + q; it.unitCost = uc; addPurchase(it, q, uc);
      if (!saveData()) { it.stock = ps; it.unitCost = pc; data.purchases.pop(); return false; }
      renderPage(); showToast(`${it.name} stock updated.`); return true;
    });
}

document.addEventListener("click", (e) => {
  const pb = e.target.closest("[data-page]"); if (pb) return setPage(pb.dataset.page);
  const ab = e.target.closest("[data-action]"); if (!ab) return;
  const { action, id } = ab.dataset;
  if (action === "new-order") newOrderModal();
  else if (action === "add-order-item") { const c = modal.querySelector("#order-items"); if (c) { c.insertAdjacentHTML("beforeend", orderLineHtml(c.querySelectorAll("[data-order-line]").length + 1)); updateOrderEstimate(); } }
  else if (action === "remove-order-item") { const c = modal.querySelector("#order-items"), r = ab.closest("[data-order-line]"); if (r && c.querySelectorAll("[data-order-line]").length > 1) { r.remove(); updateOrderEstimate(); } else showToast("An order needs at least one item."); }
  else if (action === "new-menu-item") menuModal();
  else if (action === "edit-menu") menuModal(data.menu.find((x) => x.id === id));
  else if (action === "menu-slide-img") updateMenuCardPhoto(id, (menuPhotoIdx.get(id) || 0) + Number(ab.dataset.delta || 1));
  else if (action === "menu-dot-img") updateMenuCardPhoto(id, Number(ab.dataset.index || 0));
  else if (action === "new-inventory-item") newInventoryModal();
  else if (action === "close-modal") closeModal();
  else if (action === "restock") restockModal(id);
  else if (action === "advance-order") {
    const o = data.orders.find((x) => x.id === id); if (!o) return;
    const nx = o.status === "Preparing" ? "Ready" : o.status === "Ready" ? "Completed" : o.status; o.status = nx;
    if (saveData()) { window.CanteenNotifications?.updateOrderStatus(o.id, nx).then(updateNotificationBadge); renderPage(); showToast(`Order #${o.id} marked ${nx.toLowerCase()}.${nx === "Completed" ? ' User notified: "The delivery coming near to the user".' : ""}`); }
  } else if (action === "notif-set-status") {
    const nx = ab.dataset.status; if (!id || !nx) return;
    const o = data.orders.find((x) => String(x.id) === String(id)); if (o) { o.status = nx; localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    window.CanteenNotifications?.updateOrderStatus(id, nx).then(() => { renderPage(); showToast(nx === "Completed" ? `Order #${id} completed! User bell notified: "The delivery coming near to the user".` : `Order #${id} marked ${nx}! Student notified.`); });
  } else if (action === "notif-filter") { window.CanteenNotifications?.setFilter(ab.dataset.filter || "All"); renderPage(); }
  else if (action === "notif-mark-all-read") { window.CanteenNotifications?.markAllRead().then(() => { renderPage(); showToast("All order receipt notifications marked as read."); }); }
  else if (action === "delete-menu") {
    const it = data.menu.find((x) => x.id === id); if (!it) return;
    if (data.orders.some((o) => o.status !== "Cancelled" && getOrderItems(o).some((x) => x.name === it.name))) return showToast("This item has order history and can't be removed.");
    data.menu = data.menu.filter((x) => x.id !== id); if (saveData()) { renderPage(); showToast(`${it.name} removed from the menu.`); }
  }
});
modalBackdrop.addEventListener("click", (e) => { if (e.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modalBackdrop.hidden) closeModal(); });
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date());
document.querySelectorAll(".nav-link").forEach((l) => l.classList.toggle("active", l.dataset.page === activePage));
const bc = document.querySelector("#breadcrumb-page"); if (bc) bc.textContent = PAGE_TITLES[activePage] || "Overview";
renderPage(); loadServerData();

window.CanteenNotifications?.startPolling({
  onSync: ({ adminNotifications, remoteOrders, newlyArrived, changed }) => {
    let oc = false;
    if (Array.isArray(remoteOrders)) {
      if (JSON.stringify(data.orders) !== JSON.stringify(remoteOrders)) { data.orders = remoteOrders; oc = true; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }
    } else {
      try { const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); if (p && Array.isArray(p.orders) && JSON.stringify(p.orders) !== JSON.stringify(data.orders)) { data.orders = p.orders; oc = true; } } catch {}
      const ids = new Set(data.orders.map((o) => String(o.id)));
      (adminNotifications || []).forEach((n) => {
        if (n?.orderId && !ids.has(String(n.orderId))) {
          data.orders.unshift({ id: String(n.orderId), customer: n.customerName || "Campus Student", studentAccountName: n.receipt?.studentAccountName || n.customerName || "Campus Student", items: (n.items || []).map((i) => ({ name: i.name, qty: Number(i.qty || 1), unitPrice: Number(i.price ?? i.unitPrice ?? 0), unitCost: Math.round(Number(i.price ?? i.unitPrice ?? 0) * 45) / 100 })), total: Number(n.total || 0), status: n.status || "Preparing", time: new Date(n.createdAt || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), payment: n.paymentMethod === "UPI" ? "UPI" : "Cash", day: todayKey(), source: "user-web" });
          ids.add(String(n.orderId)); oc = true;
        }
      });
      if (oc) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
    }
    updateNotificationBadge();
    document.querySelector("#nav-order-count").textContent = data.orders.filter((o) => ["Preparing", "Ready"].includes(o.status)).length;
    if (newlyArrived.length) showToast(`🔔 New Order Receipt #${newlyArrived[0].orderId} from ${newlyArrived[0].customerName} (${money(newlyArrived[0].total)})!`);
    if ((changed || oc) && modalBackdrop.hidden) { if (activePage === "notifications" || activePage === "overview") renderPage(); else if (activePage === "orders") renderOrdersTable(); }
  }
});
