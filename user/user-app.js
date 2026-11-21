/**
 * ============================================================================
 * ROYAL'S CANTEEN (canteenROYAL) — STUDENT ORDERING PORTAL LOGIC
 * Preserves 100% of User Web features while connecting to the shared
 * Major Project Part 1 Database / PHP / Java backend for live order receipts
 * and Bell Icon delivery notifications.
 * ============================================================================
 */

// Storage Keys (preserved + shared sync keys)
const STORAGE_KEYS = {
  USERS: 'campusbite_users_v1',
  CURRENT_USER: 'campusbite_current_user_v1',
  BASKET: 'campusbite_basket_v1',
  ORDERS: 'campusbite_orders_v1',
  SHARED_CANTEEN_DATA: 'canteenos-data-v1',
  SHARED_NOTIFICATIONS: 'canteenos-notifications-v1',
};

const API_CANDIDATES = [
  '',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:8082',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:8001',
];

let backendApiBase = window.location.protocol === 'file:' ? 'http://127.0.0.1:8081' : '';
let backendApiReachable = window.location.protocol !== 'file:' && !window.location.hostname.endsWith('.github.io');

/**
 * Helper to generate a styled placeholder fallback image URL if any external photo fails to load.
 */
function makeFallbackImg(label, bgHex = '245C43') {
  return `https://placehold.co/600x420/${bgHex}/FFFFFF?text=${encodeURIComponent(label)}`;
}

/**
 * Rich Indian Campus Canteen Menu (12 Popular Items)
 * Every item has:
 * - 3 distinct food photos (multi-image sliding & scrolling)
 * - Delivery time strictly between 3 minutes and 10 minutes
 * - Full transparent Ingredients list
 */
const MENU_ITEMS = [
  {
    id: 'masala-dosa',
    name: 'Crispy Masala Dosa',
    category: 'Full Meals',
    carousels: ['Trending on Campus', 'Full Meals'],
    price: 70,
    veg: true,
    rating: 4.8,
    reviews: 342,
    deliveryTime: 6,
    description: 'Golden fermented rice-lentil crepe stuffed with spiced potato masala, served hot with coconut chutney and tangy sambar.',
    ingredients: ['Fermented Rice Batter', 'Urad Dal', 'Spiced Potato Masala', 'Mustard Seeds', 'Curry Leaves', 'Green Chillies', 'Fresh Coconut Chutney', 'Toor Dal Sambar', 'Pure Ghee'],
    images: [
      { url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', caption: 'Golden Crispy Dosa', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80', caption: 'Served with Chutney & Sambar', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', caption: 'Hot Campus Canteen Platter', bg: '2F6E51' },
    ],
  },
  {
    id: 'paneer-tikka-roll',
    name: 'Paneer Tikka Kathi Roll',
    category: 'Quick Snacks',
    carousels: ['Trending on Campus', 'Quick Snacks'],
    price: 95,
    veg: true,
    rating: 4.7,
    reviews: 289,
    deliveryTime: 7,
    description: 'Char-grilled smoky cottage cheese cubes tossed with crunchy onions, bell peppers, and mint mayo wrapped in a flaky paratha.',
    ingredients: ['Fresh Malai Paneer', 'Whole Wheat Paratha', 'Hung Curd Marinade', 'Kashmiri Red Chilli', 'Capsicum & Red Onion', 'Mint-Coriander Chutney', 'Chaat Masala', 'Lemon Juice'],
    images: [
      { url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', caption: 'Loaded Paneer Kathi Roll', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', caption: 'Tandoori Paneer Filling', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', caption: 'Freshly Wrapped & Toasted', bg: '2F6E51' },
    ],
  },
  {
    id: 'veg-dum-biryani',
    name: 'Hyderabadi Veg Dum Biryani',
    category: 'Full Meals',
    carousels: ['Trending on Campus', 'Full Meals'],
    price: 120,
    veg: true,
    rating: 4.6,
    reviews: 410,
    deliveryTime: 9,
    description: 'Aromatic long-grain basmati rice slow-cooked on dum with saffron, marinated garden vegetables, paneer, and caramelized onions.',
    ingredients: ['Aged Basmati Rice', 'Saffron Milk', 'Caramelized Onions', 'Fresh Mint & Coriander', 'Paneer & Mixed Veggies', 'Whole Garam Masala', 'Yogurt', 'Boondi Raita'],
    images: [
      { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', caption: 'Fragrant Dum Biryani', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', caption: 'Saffron Basmati Layers', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', caption: 'Served with Cooling Raita', bg: '2F6E51' },
    ],
  },
  {
    id: 'chicken-biryani',
    name: 'Royal Chicken Dum Biryani',
    category: 'Full Meals',
    carousels: ['Trending on Campus', 'Full Meals'],
    price: 160,
    veg: false,
    rating: 4.9,
    reviews: 528,
    deliveryTime: 10,
    description: 'Campus bestseller! Tender spiced chicken pieces layered with fragrant saffron basmati rice, fried onions, and served with mirchi salan & raita.',
    ingredients: ['Tender Chicken Pieces', 'Long-Grain Basmati Rice', 'Ginger-Garlic Paste', 'Yogurt Marinade', 'Crispy Birista Onions', 'Cardamom, Cloves & Bay Leaf', 'Saffron & Kewra Water', 'Mint Raita'],
    images: [
      { url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80', caption: 'Signature Chicken Biryani', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', caption: 'Juicy Spiced Chicken', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', caption: 'Steaming Hot Bowl', bg: '2F6E51' },
    ],
  },
  {
    id: 'chole-bhature',
    name: 'Punjabi Chole Bhature',
    category: 'Full Meals',
    carousels: ['Full Meals', 'Trending on Campus'],
    price: 85,
    veg: true,
    rating: 4.7,
    reviews: 315,
    deliveryTime: 8,
    description: 'Two fluffy, puffed golden bhature paired with rich Amritsari spiced chickpea curry, pickled onions, and tangy mango pickle.',
    ingredients: ['Kabuli Chickpeas (Chole)', 'Refined Wheat Flour', 'Curd Leavened Dough', 'Anardana & Chole Masala', 'Ginger Juliennes', 'Tomato-Onion Gravy', 'Pickled Onions', 'Green Chilli'],
    images: [
      { url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', caption: 'Fluffy Golden Bhature', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', caption: 'Rich Amritsari Chole', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', caption: 'Complete Punjabi Plate', bg: '2F6E51' },
    ],
  },
  {
    id: 'samosa-chaat',
    name: 'Crunchy Samosa Chaat',
    category: 'Quick Snacks',
    carousels: ['Quick Snacks', 'Trending on Campus'],
    price: 50,
    veg: true,
    rating: 4.6,
    reviews: 274,
    deliveryTime: 4,
    description: 'Crushed crispy potato samosas topped with hot spiced ragda, chilled sweet curd, tamarind & mint chutneys, and crunchy nylon sev.',
    ingredients: ['Crispy Potato Samosa', 'Spiced White Peas (Ragda)', 'Sweet Whipped Curd', 'Tamarind-Date Chutney', 'Spicy Mint Chutney', 'Chopped Onion & Tomato', 'Crunchy Sev', 'Pomegranate Pearls'],
    images: [
      { url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', caption: 'Crispy Samosa Base', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', caption: 'Chutneys & Sev Topping', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80', caption: 'Evening Canteen Favorite', bg: '2F6E51' },
    ],
  },
  {
    id: 'masala-maggi',
    name: 'Double Cheese Masala Maggi',
    category: 'Quick Snacks',
    carousels: ['Quick Snacks', 'Trending on Campus'],
    price: 45,
    veg: true,
    rating: 4.8,
    reviews: 612,
    deliveryTime: 5,
    description: 'Every hostel student’s midnight & study-break lifesaver! Classic masala noodles sautéed with veggies, butter, and melted cheese.',
    ingredients: ['Wheat Noodles', 'Signature Tastemaker Masala', 'Amul Butter', 'Melted Cheddar Cheese', 'Green Peas & Sweet Corn', 'Chopped Onion & Tomato', 'Chilli Flakes', 'Fresh Coriander'],
    images: [
      { url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80', caption: 'Steaming Masala Noodles', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', caption: 'Loaded Veggies & Cheese', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80', caption: 'Hostel Study Fuel', bg: '2F6E51' },
    ],
  },
  {
    id: 'cold-coffee',
    name: 'Café Style Cold Coffee',
    category: 'Beverages & Combos',
    carousels: ['Beverages & Combos', 'Trending on Campus'],
    price: 60,
    veg: true,
    rating: 4.9,
    reviews: 495,
    deliveryTime: 3,
    description: 'Rich, frothy chilled Arabica coffee blended with creamy milk, vanilla ice cream scoop, and drizzled with dark chocolate sauce.',
    ingredients: ['Roasted Arabica Coffee', 'Chilled Full-Cream Milk', 'Vanilla Ice Cream Scoop', 'Dark Chocolate Syrup', 'Raw Cane Sugar', 'Crushed Ice', 'Cocoa Dusting'],
    images: [
      { url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', caption: 'Frothy Chilled Coffee', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', caption: 'Creamy Chocolate Swirl', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', caption: 'Served Ice Cold in 3 Mins', bg: '2F6E51' },
    ],
  },
  {
    id: 'veg-cheese-sandwich',
    name: 'Bombay Veg Cheese Grill',
    category: 'Quick Snacks',
    carousels: ['Quick Snacks'],
    price: 65,
    veg: true,
    rating: 4.5,
    reviews: 218,
    deliveryTime: 5,
    description: 'Triple-layer toasted bread packed with spiced potato, cucumber, tomato, green mint chutney, and generous melted mozzarella cheese.',
    ingredients: ['Jumbo Sandwich Bread', 'Mozzarella & Cheddar Cheese', 'Green Mint Chutney', 'Amul Butter', 'Sliced Cucumber & Tomato', 'Boiled Potato & Onion', 'Special Sandwich Masala'],
    images: [
      { url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', caption: 'Crispy Grilled Layers', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=800&q=80', caption: 'Loaded Cheese & Veggies', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80', caption: 'Served with Tomato Ketchup', bg: '2F6E51' },
    ],
  },
  {
    id: 'idli-sambar',
    name: 'Soft Steamed Idli Sambar',
    category: 'Quick Snacks',
    carousels: ['Quick Snacks', 'Full Meals'],
    price: 55,
    veg: true,
    rating: 4.7,
    reviews: 260,
    deliveryTime: 4,
    description: 'Four pillowy steamed rice cakes served piping hot with aromatic drumstick sambar and two authentic South Indian chutneys.',
    ingredients: ['Steamed Rice & Urad Dal', 'Toor Dal Sambar', 'Drumsticks & Pearl Onions', 'Fresh Coconut Chutney', 'Roasted Tomato Chutney', 'Curry Leaves Tempering', 'Pinch of Hing'],
    images: [
      { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', caption: 'Soft Steamed Idlis', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80', caption: 'Hot Sambar & Chutney', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', caption: 'Light & Healthy Breakfast', bg: '2F6E51' },
    ],
  },
  {
    id: 'pav-bhaji',
    name: 'Butter Mumbai Pav Bhaji',
    category: 'Full Meals',
    carousels: ['Full Meals'],
    price: 80,
    veg: true,
    rating: 4.6,
    reviews: 235,
    deliveryTime: 7,
    description: 'Rich slow-mashed mixed vegetable bhaji topped with melting butter, served with 2 soft ladi pavs toasted on tawa with lemon & onions.',
    ingredients: ['Mashed Potato & Cauliflower', 'Green Peas & Capsicum', 'Tomato Puree', 'Pav Bhaji Masala', 'Generous Amul Butter', 'Soft Ladi Pav (2 pcs)', 'Fresh Lemon Wedge', 'Finely Chopped Onion'],
    images: [
      { url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', caption: 'Buttery Tawa Pav Bhaji', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', caption: 'Spiced Mash Bhaji', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', caption: 'Toasted Butter Pav', bg: '2F6E51' },
    ],
  },
  {
    id: 'oreo-shake',
    name: 'Oreo Chocolate Thick Shake',
    category: 'Beverages & Combos',
    carousels: ['Beverages & Combos'],
    price: 75,
    veg: true,
    rating: 4.8,
    reviews: 310,
    deliveryTime: 3,
    description: 'Ultra-creamy milkshake blended with crushed Oreo cookies, Belgian chocolate fudge, and chilled vanilla ice cream.',
    ingredients: ['Crushed Oreo Cookies', 'Chilled Whole Milk', 'Vanilla & Chocolate Ice Cream', 'Dark Chocolate Fudge', 'Whipped Cream Swirl', 'Choco Chips'],
    images: [
      { url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', caption: 'Thick Oreo Cookie Shake', bg: '245C43' },
      { url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80', caption: 'Chocolate Fudge Topping', bg: '194733' },
      { url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', caption: 'Chilled Campus Treat', bg: '2F6E51' },
    ],
  },
];

const CAROUSEL_SECTIONS = [
  { id: 'trending', title: 'Trending on Campus 🔥', subtitle: 'Most ordered dishes by hostel students right now', tag: 'Trending on Campus' },
  { id: 'snacks', title: 'Quick Snacks (3–7 Mins) ⚡', subtitle: 'Fast study-break bites delivered hot to your room', tag: 'Quick Snacks' },
  { id: 'meals', title: 'Full Meals & Combos 🍛', subtitle: 'Hearty lunches & dinners straight from Royal\'s Canteen', tag: 'Full Meals' },
  { id: 'beverages', title: 'Chilled Beverages & Shakes 🧋', subtitle: 'Prepared fresh and delivered in just 3 minutes', tag: 'Beverages & Combos' },
];

// ==================== APPLICATION STATE ====================
let state = {
  currentUser: null,
  searchQuery: '',
  selectedCategory: 'All',
  vegOnly: false,
  sortBy: 'featured',
  pendingAction: null,
  activeModalItem: null,
  modalImageIndex: 0,
  modalQty: 1,
  cardImageIndices: {},
  checkoutItems: [],
  checkoutSource: 'single',
  selectedPaymentMethod: 'UPI',
  studentDetails: null,
  userNotifications: [],
  seenNotifIds: new Set(),
  notifInitialized: false,
};

let currentDraftOrder = null;
let lastConfirmedOrder = null;
let notifPollTimer = null;

// ==================== STORAGE HELPERS ====================
function safeReadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn('LocalStorage read error:', err);
    return fallback;
  }
}

function safeWriteJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage write error:', err);
  }
}

function seedDemoStudent() {
  const users = safeReadJSON(STORAGE_KEYS.USERS, []);
  const demoExists = users.some((u) => u.name.toLowerCase() === 'demo student');
  if (!demoExists) {
    users.push({
      name: 'Demo Student',
      email: 'demo@campus.edu',
      password: 'password123',
      createdAt: new Date().toISOString(),
    });
    safeWriteJSON(STORAGE_KEYS.USERS, users);
  }
}

function getBasket() {
  return safeReadJSON(STORAGE_KEYS.BASKET, []);
}

function saveBasket(items) {
  safeWriteJSON(STORAGE_KEYS.BASKET, items);
  updateHeaderCounts();
}

function getAllOrders() {
  return safeReadJSON(STORAGE_KEYS.ORDERS, []);
}

function getUserOrders() {
  if (!state.currentUser) return [];
  return getAllOrders().filter(
    (o) => (o.studentAccountName || '').toLowerCase() === state.currentUser.name.toLowerCase()
  );
}

// ==================== BACKEND API CONNECTION ====================
async function detectBackendApi() {
  if (window.location.protocol !== 'file:') {
    if (window.location.hostname.endsWith('.github.io')) {
      backendApiReachable = false;
      return;
    }
    backendApiBase = '';
    backendApiReachable = true;
    return;
  }
  for (const candidate of API_CANDIDATES.slice(1)) {
    try {
      const res = await fetch(`${candidate}/api/notifications`, { method: 'GET' });
      if (res.ok) {
        backendApiBase = candidate;
        backendApiReachable = true;
        return;
      }
    } catch {
      // try next port
    }
  }
  backendApiReachable = false;
}

function pushOrderToLocalSharedStore(order) {
  const nowIso = new Date().toISOString();
  const sharedNotifs = safeReadJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, {
    adminNotifications: [],
    userNotifications: [],
  });

  sharedNotifs.adminNotifications.unshift({
    id: `an-${order.orderId}-${Date.now()}`,
    orderId: order.orderId,
    customerName: order.student.name,
    regNo: order.student.regNo,
    hostel: order.student.hostel,
    roomNo: order.student.roomNo,
    phone: order.student.phone,
    fullAddress: order.student.fullAddress,
    items: order.items,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    estimatedMinutes: order.estimatedMinutes,
    status: 'Preparing',
    isRead: false,
    receipt: order,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  sharedNotifs.userNotifications.unshift({
    id: `un-${order.orderId}-${Date.now()}`,
    orderId: order.orderId,
    studentName: order.studentAccountName,
    status: 'Preparing',
    title: 'Order Receipt Received',
    message: `Order #${order.orderId} receipt sent to Royal's Canteen kitchen. Preparing your order!`,
    isRead: false,
    createdAt: nowIso,
  });

  safeWriteJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, sharedNotifs);

  // Also add to shared canteenos-data-v1 orders list if present in same-origin localStorage
  const sharedCanteen = safeReadJSON(STORAGE_KEYS.SHARED_CANTEEN_DATA, null);
  if (sharedCanteen && Array.isArray(sharedCanteen.orders)) {
    const today = new Date();
    const dayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    sharedCanteen.orders.unshift({
      id: order.orderId,
      customer: order.student.name,
      studentAccountName: order.studentAccountName,
      items: order.items.map((it) => ({
        name: it.name,
        qty: it.qty,
        unitPrice: it.price,
        unitCost: Math.round(it.price * 45) / 100,
      })),
      total: order.total,
      status: 'Preparing',
      time: today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      payment: order.paymentMethod === 'UPI' ? 'UPI' : 'Cash',
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      day: dayKey,
      source: 'user-web',
      student: order.student,
      estimatedMinutes: order.estimatedMinutes,
      dateTime: order.dateTime,
      receipt: order,
    });
    safeWriteJSON(STORAGE_KEYS.SHARED_CANTEEN_DATA, sharedCanteen);
  }
}

async function sendOrderToCanteenBackend(order) {
  pushOrderToLocalSharedStore(order);
  if (!backendApiReachable) {
    await detectBackendApi();
  }
  if (backendApiReachable) {
    try {
      const res = await fetch(`${backendApiBase}/api/orders/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (res.ok) {
        await pollUserNotifications();
        return true;
      }
    } catch (err) {
      console.warn('Order backend sync fallback to localStorage:', err);
    }
  }
  await pollUserNotifications();
  return false;
}

async function pollUserNotifications() {
  if (!state.currentUser) {
    state.userNotifications = [];
    renderBellNotifications();
    return;
  }

  const studentName = state.currentUser.name;
  let fetchedNotifs = null;
  let fetchedOrders = null;

  if (backendApiReachable) {
    try {
      const res = await fetch(
        `${backendApiBase}/api/notifications?target=user&student=${encodeURIComponent(studentName)}`
      );
      if (res.ok && (res.headers.get('content-type') || '').includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.userNotifications)) fetchedNotifs = data.userNotifications;
        if (Array.isArray(data.orders)) fetchedOrders = data.orders;
      }
    } catch {
      // fall back to localStorage
    }
  }

  if (fetchedNotifs === null) {
    const localShared = safeReadJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, {
      adminNotifications: [],
      userNotifications: [],
    });
    fetchedNotifs = (localShared.userNotifications || []).filter(
      (n) => (n.studentName || '').toLowerCase() === studentName.toLowerCase()
    );
  }

  // Sync live statuses back into local orders list so My Orders & Delivery Banner stay current
  const localOrders = getAllOrders();
  let ordersUpdated = false;
  if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
    const statusById = new Map(fetchedOrders.map((o) => [String(o.id), o.status]));
    for (const ord of localOrders) {
      const latestStatus = statusById.get(String(ord.orderId));
      if (latestStatus && ord.status !== latestStatus) {
        ord.status = latestStatus;
        ordersUpdated = true;
      }
    }
  } else {
    // Also infer from notifications if running purely via localStorage
    for (const n of [...fetchedNotifs].reverse()) {
      const ord = localOrders.find((o) => String(o.orderId) === String(n.orderId));
      if (ord && n.status && ord.status !== n.status) {
        ord.status = n.status;
        ordersUpdated = true;
      }
    }
  }
  if (ordersUpdated) {
    safeWriteJSON(STORAGE_KEYS.ORDERS, localOrders);
  }

  // Detect brand new notifications to announce via toast + banner
  const newlyArrived = [];
  if (state.notifInitialized) {
    for (const n of fetchedNotifs) {
      if (!state.seenNotifIds.has(n.id)) {
        newlyArrived.push(n);
      }
    }
  }
  state.seenNotifIds = new Set(fetchedNotifs.map((n) => n.id));
  state.notifInitialized = true;
  state.userNotifications = fetchedNotifs;

  renderBellNotifications();

  if (newlyArrived.length > 0) {
    const newest = newlyArrived[0];
    updateActiveDeliveryBannerFromNotification(newest);
    if (newest.status === 'Completed') {
      showToast(`🛵 ${newest.message}`, 'success');
    } else if (newest.status === 'Ready') {
      showToast(`✅ ${newest.message}`, 'info');
    }
  }

  // If My Orders modal is currently open, refresh its live status badges
  const ordersModal = document.getElementById('ordersModal');
  if (ordersUpdated && ordersModal && !ordersModal.classList.contains('hidden')) {
    openOrdersModal();
  }
}

function updateActiveDeliveryBannerFromNotification(notif) {
  const banner = document.getElementById('activeOrderBanner');
  const titleEl = document.getElementById('activeBannerTitle');
  const subEl = document.getElementById('activeBannerSub');
  if (!banner || !titleEl || !subEl) return;

  if (notif.status === 'Completed') {
    titleEl.textContent = `🛵 The delivery coming near to the user — Order #${notif.orderId}`;
    subEl.textContent = notif.message;
    banner.classList.remove('hidden');
  } else if (notif.status === 'Ready') {
    titleEl.textContent = `✅ Order #${notif.orderId} is Ready at Royal's Canteen!`;
    subEl.textContent = notif.message;
    banner.classList.remove('hidden');
  }
}

function renderBellNotifications() {
  const unreadCount = state.userNotifications.filter((n) => !n.isRead).length;
  const bellBtn = document.getElementById('bellNotifBtn');
  const bellBadge = document.getElementById('bellUnreadBadge');
  const sidebarNotifCount = document.getElementById('sidebarNotifCount');
  const listEl = document.getElementById('userNotifList');

  if (bellBadge) {
    if (unreadCount > 0) {
      bellBadge.textContent = unreadCount;
      bellBadge.classList.remove('hidden');
    } else {
      bellBadge.classList.add('hidden');
    }
  }
  if (bellBtn) {
    bellBtn.classList.toggle('has-alert', unreadCount > 0);
  }
  if (sidebarNotifCount) {
    sidebarNotifCount.textContent = unreadCount;
    sidebarNotifCount.classList.toggle('has-unread', unreadCount > 0);
  }

  if (!listEl) return;

  if (!state.currentUser) {
    listEl.innerHTML = `
      <div class="text-center py-6 px-3">
        <div class="text-3xl mb-2">🔔</div>
        <p class="font-bold text-sm text-[#202b25]">Sign in to receive live alerts</p>
        <p class="text-xs text-[#5f6a61] mt-1">Order updates &amp; delivery notifications from Royal's Canteen will appear here.</p>
        <button type="button" onclick="closeBellPopover(); openAuthModal('signin');" class="mt-3 px-4 py-2 rounded-lg bg-[#245c43] text-white text-xs font-bold hover:bg-[#194733]">
          Sign In
        </button>
      </div>
    `;
    return;
  }

  if (state.userNotifications.length === 0) {
    listEl.innerHTML = `
      <div class="text-center py-6 px-3">
        <div class="text-3xl mb-2">🔔</div>
        <p class="font-bold text-sm text-[#202b25]">No notifications yet</p>
        <p class="text-xs text-[#5f6a61] mt-1">When you place an order, you'll be alerted here as Royal's Canteen marks it Ready &amp; Completed.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = state.userNotifications
    .map((n) => {
      const isCompleted = n.status === 'Completed';
      const isReady = n.status === 'Ready';
      const icon = isCompleted ? '🛵' : isReady ? '✅' : '🧾';
      const badgeStyle = isCompleted
        ? 'background:#eaf3ec;color:#245c43;'
        : isReady
        ? 'background:#e9f2fb;color:#2e6091;'
        : 'background:#fff3e6;color:#9b6220;';
      const timeLabel = n.createdAt
        ? new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : '';

      return `
        <div class="user-notif-item ${n.isRead ? '' : 'unread'} ${isCompleted ? 'delivery-near' : ''}">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-xs text-[#202b25] flex items-center gap-1.5">
              <span aria-hidden="true">${icon}</span>
              <span>${escapeHtml(n.title)}</span>
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" style="${badgeStyle}">${escapeHtml(n.status)}</span>
          </div>
          <p class="text-xs text-[#3b473f] leading-relaxed m-0">${escapeHtml(n.message)}</p>
          <div class="flex items-center justify-between text-[10px] text-[#6b756d] pt-1">
            <span>Order #${escapeHtml(n.orderId)}</span>
            <span>${escapeHtml(timeLabel)}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

async function markAllUserNotificationsRead() {
  if (!state.currentUser) return;
  const studentName = state.currentUser.name;

  for (const n of state.userNotifications) {
    n.isRead = true;
  }
  const localShared = safeReadJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, {
    adminNotifications: [],
    userNotifications: [],
  });
  for (const n of localShared.userNotifications || []) {
    if ((n.studentName || '').toLowerCase() === studentName.toLowerCase()) {
      n.isRead = true;
    }
  }
  safeWriteJSON(STORAGE_KEYS.SHARED_NOTIFICATIONS, localShared);
  renderBellNotifications();

  if (backendApiReachable) {
    try {
      await fetch(`${backendApiBase}/api/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'user', studentName }),
      });
    } catch {
      // ignore network error
    }
  }
}

function toggleBellPopoverFromSidebar() {
  closeMobileSidebar();
  const popover = document.getElementById('userNotifPopover');
  if (!popover) return;
  try {
    if (typeof popover.togglePopover === 'function') {
      popover.togglePopover();
    } else {
      popover.classList.toggle(':popover-open');
    }
  } catch {
    popover.classList.toggle(':popover-open');
  }
}

function closeBellPopover() {
  const popover = document.getElementById('userNotifPopover');
  if (!popover) return;
  try {
    if (typeof popover.hidePopover === 'function') popover.hidePopover();
  } catch {}
  popover.classList.remove(':popover-open');
}

// ==================== ACCESSIBLE TOAST NOTIFICATIONS ====================
function announceForScreenReaders(message) {
  if (typeof document.ariaNotify === 'function') {
    try {
      document.ariaNotify(message);
      return;
    } catch {}
  }
  const live = document.getElementById('srLiveRegion');
  if (live) {
    live.textContent = '';
    requestAnimationFrame(() => {
      live.textContent = message;
    });
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const colorClasses =
    type === 'error'
      ? 'bg-[#c7584b] text-white'
      : type === 'info'
      ? 'bg-[#202b25] text-white'
      : 'bg-[#245c43] text-white';

  toast.className = `toast-item ${colorClasses}`;
  const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✓';
  toast.innerHTML = `
    <div class="flex items-start gap-2">
      <span aria-hidden="true">${icon}</span>
      <span>${escapeHtml(message)}</span>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Dismiss notification">✕</button>
  `;

  const removeToast = () => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 220);
  };

  toast.querySelector('.toast-close-btn').addEventListener('click', removeToast);
  container.appendChild(toast);
  announceForScreenReaders(message);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  let dismissTimer = setTimeout(() => {
    if (!toast.contains(document.activeElement)) {
      removeToast();
    }
  }, 4200);

  toast.addEventListener('focusin', () => clearTimeout(dismissTimer));
  toast.addEventListener('focusout', () => {
    dismissTimer = setTimeout(removeToast, 2500);
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function scrollToSection(id) {
  closeMobileSidebar();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.sidebar .nav-link[data-section]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.section === id);
  });
}

function toggleMobileSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebarBackdrop')?.classList.toggle('open');
}

function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarBackdrop')?.classList.remove('open');
}

// ==================== AUTHENTICATION FLOW (STUDENTS ONLY) ====================
function renderHeaderAuth() {
  const container = document.getElementById('headerAuthArea');
  const heroBtn = document.getElementById('heroAuthBtn');
  const sidebarAvatar = document.getElementById('sidebarProfileAvatar');
  const sidebarName = document.getElementById('sidebarProfileName');
  const sidebarRole = document.getElementById('sidebarProfileRole');

  if (state.currentUser) {
    const initials = state.currentUser.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    container.innerHTML = `
      <div class="flex items-center gap-2 pl-2 border-l border-[#e9ece6]">
        <div class="flex items-center gap-2 bg-[#f5f6f2] border border-[#e9ece6] px-2.5 py-1.5 rounded-xl">
          <span class="w-7 h-7 rounded-lg bg-[#245c43] text-white text-xs font-extrabold flex items-center justify-center">${escapeHtml(initials)}</span>
          <div class="hidden lg:block leading-tight">
            <p class="text-xs font-bold text-[#202b25] max-w-[110px] truncate">${escapeHtml(state.currentUser.name)}</p>
            <p class="text-[10px] font-semibold text-[#245c43]">Verified Student</p>
          </div>
        </div>
        <button
          onclick="handleLogout()"
          class="px-2.5 py-2 rounded-lg text-xs font-bold text-[#5f6a61] hover:text-[#c7584b] hover:bg-[#fff5f3] transition-colors"
          title="Sign Out"
        >
          Sign Out
        </button>
      </div>
    `;
    if (heroBtn) {
      heroBtn.textContent = `Welcome, ${state.currentUser.name} • My Orders`;
      heroBtn.onclick = () => handleOpenOrders();
    }
    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    if (sidebarName) sidebarName.textContent = state.currentUser.name;
    if (sidebarRole) sidebarRole.textContent = 'Verified Campus Student';
  } else {
    container.innerHTML = `
      <button
        onclick="openAuthModal('signin')"
        class="px-3.5 sm:px-4 py-2 rounded-lg bg-[#245c43] hover:bg-[#194733] text-white text-xs font-bold transition-colors shadow-sm"
      >
        Sign In / Register
      </button>
    `;
    if (heroBtn) {
      heroBtn.textContent = 'Student Register / Sign In';
      heroBtn.onclick = () => openAuthModal('register');
    }
    if (sidebarAvatar) sidebarAvatar.textContent = 'RC';
    if (sidebarName) sidebarName.textContent = "Royal's Canteen";
    if (sidebarRole) sidebarRole.textContent = 'Sign in to order';
  }
  updateHeaderCounts();
}

function updateHeaderCounts() {
  const basket = getBasket();
  const totalItems = basket.reduce((acc, item) => acc + item.qty, 0);
  const basketBadge = document.getElementById('basketCountBadge');
  const sidebarBasketCount = document.getElementById('sidebarBasketCount');
  if (basketBadge) basketBadge.textContent = totalItems;
  if (sidebarBasketCount) {
    sidebarBasketCount.textContent = totalItems;
    sidebarBasketCount.classList.toggle('has-unread', totalItems > 0);
  }

  const ordersBadge = document.getElementById('ordersCountBadge');
  const sidebarOrdersCount = document.getElementById('sidebarOrdersCount');
  const userOrders = getUserOrders();
  if (ordersBadge) {
    if (state.currentUser && userOrders.length > 0) {
      ordersBadge.textContent = userOrders.length;
      ordersBadge.classList.remove('hidden');
    } else {
      ordersBadge.classList.add('hidden');
    }
  }
  if (sidebarOrdersCount) {
    sidebarOrdersCount.textContent = state.currentUser ? userOrders.length : 0;
  }
}

function requireStudentAuth(callback, promptMsg = 'Please Sign In or Register as a Campus Student to continue.') {
  if (state.currentUser) {
    callback();
    return;
  }
  state.pendingAction = callback;
  openAuthModal('signin', promptMsg);
}

function openAuthModal(tab = 'signin', infoMessage = '') {
  const modal = document.getElementById('authModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  switchAuthTab(tab);
  if (infoMessage) {
    showAuthFeedback(infoMessage, 'info');
  } else {
    hideAuthFeedback();
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  state.pendingAction = null;
  hideAuthFeedback();
}

function switchAuthTab(tab) {
  const signInForm = document.getElementById('signInForm');
  const registerForm = document.getElementById('registerForm');
  const tabSignIn = document.getElementById('tabSignIn');
  const tabRegister = document.getElementById('tabRegister');
  const title = document.getElementById('authModalTitle');
  const sub = document.getElementById('authModalSub');

  hideAuthFeedback();

  if (tab === 'signin') {
    signInForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabSignIn.className = 'py-2.5 rounded-xl text-sm font-bold bg-white text-[#245c43] shadow-sm transition-all';
    tabRegister.className = 'py-2.5 rounded-xl text-sm font-bold text-[#6b756d] hover:text-[#202b25] transition-all';
    title.textContent = 'Student Sign In';
    sub.textContent = 'Enter your registered Name and Password to order.';
  } else {
    signInForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabRegister.className = 'py-2.5 rounded-xl text-sm font-bold bg-white text-[#245c43] shadow-sm transition-all';
    tabSignIn.className = 'py-2.5 rounded-xl text-sm font-bold text-[#6b756d] hover:text-[#202b25] transition-all';
    title.textContent = 'Campus Student Registration';
    sub.textContent = 'Register with Name, Email address & Password.';
  }
}

function showAuthFeedback(msg, type = 'error') {
  const box = document.getElementById('authMessageBox');
  box.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-[#eaf3ec]', 'text-[#245c43]', 'bg-amber-50', 'text-amber-800');
  if (type === 'error') box.classList.add('bg-red-50', 'text-red-700');
  else if (type === 'success') box.classList.add('bg-[#eaf3ec]', 'text-[#245c43]');
  else box.classList.add('bg-amber-50', 'text-amber-800');
  box.textContent = msg;
}

function hideAuthFeedback() {
  document.getElementById('authMessageBox').classList.add('hidden');
}

function fillDemoCredentials() {
  document.getElementById('loginName').value = 'Demo Student';
  document.getElementById('loginPassword').value = 'password123';
  showAuthFeedback('Demo credentials filled! Click "Sign In as Campus Student".', 'success');
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) {
    showAuthFeedback('Please fill in Name, Email address, and Password.', 'error');
    return;
  }

  const users = safeReadJSON(STORAGE_KEYS.USERS, []);
  if (users.some((u) => u.name.toLowerCase() === name.toLowerCase())) {
    showAuthFeedback('A student with this Name is already registered. Please Sign In.', 'error');
    return;
  }
  if (users.some((u) => u.email.toLowerCase() === email)) {
    showAuthFeedback('This Email address is already registered. Please Sign In.', 'error');
    return;
  }

  const newUser = { name, email, password, createdAt: new Date().toISOString() };
  users.push(newUser);
  safeWriteJSON(STORAGE_KEYS.USERS, users);

  // Sync registration to shared backend DB when available
  if (backendApiReachable) {
    try {
      await fetch(`${backendApiBase}/api/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
    } catch {}
  }

  document.getElementById('registerForm').reset();
  switchAuthTab('signin');
  document.getElementById('loginName').value = name;
  document.getElementById('loginPassword').focus();
  showAuthFeedback(`Registration successful for ${name}! Now Sign In with your Name & Password.`, 'success');
  showToast('Campus account registered! Please sign in.', 'success');
}

async function handleSignIn(e) {
  e.preventDefault();
  const name = document.getElementById('loginName').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = safeReadJSON(STORAGE_KEYS.USERS, []);
  let matched = users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
  );

  // Also check shared backend DB if not in localStorage yet
  if (!matched && backendApiReachable) {
    try {
      const res = await fetch(`${backendApiBase}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.student) {
          matched = { name: data.student.name, email: data.student.email, password };
          users.push(matched);
          safeWriteJSON(STORAGE_KEYS.USERS, users);
        }
      }
    } catch {}
  }

  if (!matched) {
    showAuthFeedback('Invalid Student Name or Password. Please check or Register first.', 'error');
    return;
  }

  state.currentUser = { name: matched.name, email: matched.email };
  state.notifInitialized = false;
  safeWriteJSON(STORAGE_KEYS.CURRENT_USER, state.currentUser);
  renderHeaderAuth();
  document.getElementById('signInForm').reset();

  const pending = state.pendingAction;
  closeAuthModal();
  showToast(`Welcome back, ${matched.name}!`, 'success');
  pollUserNotifications();

  if (typeof pending === 'function') {
    setTimeout(() => pending(), 120);
  }
}

function handleLogout() {
  state.currentUser = null;
  state.userNotifications = [];
  state.notifInitialized = false;
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (e) {}
  renderHeaderAuth();
  renderBellNotifications();
  showToast("Signed out from Royal's Canteen.", 'info');
}

// ==================== FOOD CARD COMPONENT (MULTI-IMAGE SLIDER) ====================
function getVegBadgeHtml(isVeg) {
  if (isVeg) {
    return `<span title="Vegetarian" class="inline-flex items-center justify-center w-4 h-4 rounded-[4px] border-2 border-[#245c43] bg-white shrink-0"><span class="w-2 h-2 rounded-full bg-[#245c43]"></span></span>`;
  }
  return `<span title="Non-Vegetarian" class="inline-flex items-center justify-center w-4 h-4 rounded-[4px] border-2 border-[#c7584b] bg-white shrink-0"><span class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-[#c7584b]"></span></span>`;
}

function createFoodCardHtml(item, cardKey, isCarouselCard = false) {
  if (state.cardImageIndices[cardKey] === undefined) {
    state.cardImageIndices[cardKey] = 0;
  }
  const activeIdx = state.cardImageIndices[cardKey];
  const activePhoto = item.images[activeIdx];
  const fallbackUrl = makeFallbackImg(`${item.name} (${activeIdx + 1}/3)`, activePhoto.bg);

  const widthClass = isCarouselCard
    ? 'w-[272px] sm:w-[295px] shrink-0 snap-start'
    : 'w-full';

  const dotsHtml = item.images
    .map(
      (_, idx) => `
      <button
        type="button"
        onclick="event.stopPropagation(); setCardImage('${cardKey}', '${item.id}', ${idx})"
        class="h-1.5 rounded-full transition-all ${idx === activeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'}"
        aria-label="View photo ${idx + 1}"
      ></button>`
    )
    .join('');

  return `
    <article
      onclick="handleFoodItemClick('${item.id}')"
      class="${widthClass} group bg-white rounded-2xl border border-[#e9ece6] shadow-card hover:shadow-card-hover hover:border-[#cfe0d2] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      <!-- Multi-Image Slider Area -->
      <div
        class="relative aspect-[16/11] bg-[#f5f6f2] overflow-hidden select-none"
        ontouchstart="handleCardTouchStart(event, '${cardKey}')"
        ontouchend="handleCardTouchEnd(event, '${cardKey}', '${item.id}')"
      >
        <img
          id="img-${cardKey}"
          src="${activePhoto.url}"
          alt="${escapeHtml(item.name)}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackUrl}';"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <!-- Gradient Scrim for Legibility -->
        <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none"></div>

        <!-- Delivery Time Badge (3–10 mins) -->
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[#202b25] text-[11px] font-extrabold shadow-sm flex items-center gap-1">
          <span>⚡</span> ${item.deliveryTime} mins
        </span>

        <!-- Photo Counter Badge -->
        <span id="counter-${cardKey}" class="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-[#202b25]/80 text-white text-[10px] font-bold backdrop-blur-sm">
          ${activeIdx + 1}/${item.images.length}
        </span>

        <!-- Mini Left/Right Image Slide Arrows -->
        <button
          type="button"
          onclick="event.stopPropagation(); slideCardImage('${cardKey}', '${item.id}', -1)"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#202b25] shadow-md flex items-center justify-center font-bold text-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          type="button"
          onclick="event.stopPropagation(); slideCardImage('${cardKey}', '${item.id}', 1)"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#202b25] shadow-md flex items-center justify-center font-bold text-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          aria-label="Next photo"
        >
          ›
        </button>

        <!-- Photo Caption & Dot Indicators -->
        <div class="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-2">
          <span id="caption-${cardKey}" class="text-[11px] font-semibold text-white truncate drop-shadow">${escapeHtml(activePhoto.caption)}</span>
          <div id="dots-${cardKey}" class="flex items-center gap-1 shrink-0">${dotsHtml}</div>
        </div>
      </div>

      <!-- Card Content -->
      <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              ${getVegBadgeHtml(item.veg)}
              <h3 class="font-extrabold text-[#202b25] text-base truncate group-hover:text-[#245c43] transition-colors">${escapeHtml(item.name)}</h3>
            </div>
            <span class="shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#245c43] text-white text-xs font-bold">
              ${item.rating} ★
            </span>
          </div>

          <p class="text-xs text-[#667168] mt-1.5 line-clamp-2 leading-relaxed">
            ${escapeHtml(item.ingredients.slice(0, 4).join(', '))} &amp; more
          </p>
        </div>

        <div class="pt-2.5 border-t border-[#f0f1ee] flex items-center justify-between gap-2">
          <div>
            <span class="text-lg font-extrabold text-[#245c43]">₹${item.price}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              onclick="event.stopPropagation(); handleQuickAdd('${item.id}')"
              class="px-3 py-2 rounded-lg border border-[#245c43] text-[#245c43] hover:bg-[#eaf3ec] text-xs font-bold transition-colors"
            >
              + Basket
            </button>
            <button
              type="button"
              onclick="event.stopPropagation(); handleFoodItemClick('${item.id}')"
              class="px-3 py-2 rounded-lg bg-[#245c43] hover:bg-[#194733] text-white text-xs font-bold transition-colors shadow-sm"
            >
              View &amp; Buy
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function setCardImage(cardKey, itemId, newIndex) {
  const item = MENU_ITEMS.find((i) => i.id === itemId);
  if (!item) return;

  const total = item.images.length;
  const normalizedIdx = ((newIndex % total) + total) % total;
  state.cardImageIndices[cardKey] = normalizedIdx;

  const photo = item.images[normalizedIdx];
  const fallbackUrl = makeFallbackImg(`${item.name} (${normalizedIdx + 1}/${total})`, photo.bg);

  const imgEl = document.getElementById(`img-${cardKey}`);
  const capEl = document.getElementById(`caption-${cardKey}`);
  const cntEl = document.getElementById(`counter-${cardKey}`);
  const dotsEl = document.getElementById(`dots-${cardKey}`);

  if (imgEl) {
    imgEl.onerror = function () {
      this.onerror = null;
      this.src = fallbackUrl;
    };
    imgEl.src = photo.url;
  }
  if (capEl) capEl.textContent = photo.caption;
  if (cntEl) cntEl.textContent = `${normalizedIdx + 1}/${total}`;
  if (dotsEl) {
    dotsEl.innerHTML = item.images
      .map(
        (_, idx) => `
        <button
          type="button"
          onclick="event.stopPropagation(); setCardImage('${cardKey}', '${item.id}', ${idx})"
          class="h-1.5 rounded-full transition-all ${idx === normalizedIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'}"
          aria-label="View photo ${idx + 1}"
        ></button>`
      )
      .join('');
  }
}

function slideCardImage(cardKey, itemId, delta) {
  const current = state.cardImageIndices[cardKey] || 0;
  setCardImage(cardKey, itemId, current + delta);
}

// Touch swipe support on card photos
const touchStartXMap = {};
function handleCardTouchStart(e, cardKey) {
  if (e.touches && e.touches.length === 1) {
    touchStartXMap[cardKey] = e.touches[0].clientX;
  }
}
function handleCardTouchEnd(e, cardKey, itemId) {
  const startX = touchStartXMap[cardKey];
  if (startX === undefined || !e.changedTouches) return;
  const diff = e.changedTouches[0].clientX - startX;
  delete touchStartXMap[cardKey];
  if (Math.abs(diff) > 35) {
    e.stopPropagation();
    slideCardImage(cardKey, itemId, diff < 0 ? 1 : -1);
  }
}

// ==================== RENDER HORIZONTAL SLIDABLE CAROUSELS ====================
function renderCarousels() {
  const container = document.getElementById('carouselsSection');
  container.innerHTML = CAROUSEL_SECTIONS.map((sec) => {
    const items = MENU_ITEMS.filter((i) => i.carousels.includes(sec.tag));
    const cardsHtml = items
      .map((item) => createFoodCardHtml(item, `car-${sec.id}-${item.id}`, true))
      .join('');

    return `
      <div class="space-y-4">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-[#202b25]">${escapeHtml(sec.title)}</h2>
            <p class="text-xs sm:text-sm text-[#667168] mt-0.5">${escapeHtml(sec.subtitle)}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              onclick="scrollCarousel('track-${sec.id}', -320)"
              class="w-9 h-9 rounded-full bg-white border border-[#e9ece6] hover:border-[#245c43] hover:text-[#245c43] shadow-sm flex items-center justify-center font-bold text-lg transition-all active:scale-95"
              aria-label="Slide left"
            >
              ‹
            </button>
            <button
              onclick="scrollCarousel('track-${sec.id}', 320)"
              class="w-9 h-9 rounded-full bg-white border border-[#e9ece6] hover:border-[#245c43] hover:text-[#245c43] shadow-sm flex items-center justify-center font-bold text-lg transition-all active:scale-95"
              aria-label="Slide right"
            >
              ›
            </button>
          </div>
        </div>

        <div
          id="track-${sec.id}"
          class="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          ${cardsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function scrollCarousel(trackId, offset) {
  const track = document.getElementById(trackId);
  if (track) {
    track.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

// ==================== RENDER FULL FILTERABLE MENU GRID ====================
function renderCategoryFilters() {
  const categories = ['All', 'Quick Snacks', 'Full Meals', 'Beverages & Combos'];
  const bar = document.getElementById('categoryFilterBar');
  bar.innerHTML = categories
    .map((cat) => {
      const active = state.selectedCategory === cat;
      return `
        <button
          onclick="selectCategory('${cat}')"
          class="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
            active
              ? 'bg-[#245c43] text-white shadow-sm'
              : 'bg-white border border-[#e9ece6] text-[#526056] hover:border-[#245c43] hover:text-[#245c43]'
          }"
        >
          ${escapeHtml(cat)}
        </button>
      `;
    })
    .join('');
}

function renderFullMenuGrid() {
  const grid = document.getElementById('fullMenuGrid');
  const empty = document.getElementById('emptyMenuState');
  const q = state.searchQuery.trim().toLowerCase();

  let filtered = MENU_ITEMS.filter((item) => {
    if (state.selectedCategory !== 'All' && item.category !== state.selectedCategory) return false;
    if (state.vegOnly && !item.veg) return false;
    if (q) {
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchIng = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchIng) return false;
    }
    return true;
  });

  if (state.sortBy === 'time-asc') {
    filtered.sort((a, b) => a.deliveryTime - b.deliveryTime);
  } else if (state.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    grid.innerHTML = filtered
      .map((item) => createFoodCardHtml(item, `grid-${item.id}`, false))
      .join('');
  }
}

function handleSearch(val) {
  state.searchQuery = val;
  const d = document.getElementById('headerSearchInput');
  const m = document.getElementById('mobileSearchInput');
  if (d && d.value !== val) d.value = val;
  if (m && m.value !== val) m.value = val;
  renderFullMenuGrid();
}

function selectCategory(cat) {
  state.selectedCategory = cat;
  renderCategoryFilters();
  renderFullMenuGrid();
}

function toggleVegOnly() {
  state.vegOnly = !state.vegOnly;
  const btn = document.getElementById('vegToggleBtn');
  if (state.vegOnly) {
    btn.className = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-[#245c43] bg-[#eaf3ec] text-sm font-bold text-[#245c43] transition-all';
  } else {
    btn.className = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#e9ece6] bg-white text-sm font-semibold text-[#526056] hover:border-[#245c43] transition-all';
  }
  renderFullMenuGrid();
}

function handleSort(val) {
  state.sortBy = val;
  renderFullMenuGrid();
}

function resetFilters() {
  state.searchQuery = '';
  state.selectedCategory = 'All';
  state.vegOnly = false;
  state.sortBy = 'featured';
  const d = document.getElementById('headerSearchInput');
  const m = document.getElementById('mobileSearchInput');
  if (d) d.value = '';
  if (m) m.value = '';
  document.getElementById('sortSelect').value = 'featured';
  const btn = document.getElementById('vegToggleBtn');
  btn.className = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#e9ece6] bg-white text-sm font-semibold text-[#526056] hover:border-[#245c43] transition-all';
  renderCategoryFilters();
  renderFullMenuGrid();
}

// ==================== FOOD ITEM DETAILS MODAL (AUTH GATED) ====================
function handleFoodItemClick(itemId) {
  requireStudentAuth(
    () => openItemDetailsModal(itemId),
    'Only registered Campus Students can view full dish details & order. Please Sign In or Register.'
  );
}

function handleQuickAdd(itemId) {
  requireStudentAuth(
    () => {
      addItemToBasket(itemId, 1);
      const item = MENU_ITEMS.find((i) => i.id === itemId);
      showToast(`Added ${item.name} to Basket!`, 'success');
    },
    'Sign in with your Campus Student account to add items to your Basket.'
  );
}

function openItemDetailsModal(itemId) {
  const item = MENU_ITEMS.find((i) => i.id === itemId);
  if (!item) return;

  state.activeModalItem = item;
  state.modalImageIndex = 0;
  state.modalQty = 1;

  document.getElementById('modalVegBadge').innerHTML = getVegBadgeHtml(item.veg);
  document.getElementById('modalCategoryPill').textContent = item.category;
  document.getElementById('modalItemName').textContent = item.name;
  document.getElementById('modalItemRating').textContent = `${item.rating} ★ (${item.reviews})`;
  document.getElementById('modalItemPrice').textContent = `₹${item.price}`;
  document.getElementById('modalDeliveryTime').textContent = `Delivered to your Hostel Room in ${item.deliveryTime} mins (Range: 3–10 mins)`;
  document.getElementById('modalItemDesc').textContent = item.description;

  document.getElementById('modalIngredientsList').innerHTML = item.ingredients
    .map(
      (ing) => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f6f2] border border-[#e9ece6] text-xs font-semibold text-[#354139]">
        <span class="w-1.5 h-1.5 rounded-full bg-[#245c43]"></span>
        ${escapeHtml(ing)}
      </span>`
    )
    .join('');

  updateModalGallery();
  updateModalQtyDisplay();

  const modal = document.getElementById('itemModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeItemModal() {
  const modal = document.getElementById('itemModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  state.activeModalItem = null;
}

function updateModalGallery() {
  const item = state.activeModalItem;
  if (!item) return;
  const idx = state.modalImageIndex;
  const photo = item.images[idx];
  const fallbackUrl = makeFallbackImg(`${item.name} (${idx + 1}/3)`, photo.bg);

  const mainImg = document.getElementById('modalMainImage');
  mainImg.onerror = function () {
    this.onerror = null;
    this.src = fallbackUrl;
  };
  mainImg.src = photo.url;
  mainImg.alt = `${item.name} - ${photo.caption}`;

  document.getElementById('modalImageCaption').textContent = photo.caption;
  document.getElementById('modalImageCounter').textContent = `${idx + 1} / ${item.images.length}`;

  document.getElementById('modalThumbnails').innerHTML = item.images
    .map((img, i) => {
      const thumbFallback = makeFallbackImg(`${i + 1}`, img.bg);
      const activeClass =
        i === idx
          ? 'ring-2 ring-[#245c43] ring-offset-2 opacity-100'
          : 'opacity-65 hover:opacity-100';
      return `
        <button
          type="button"
          onclick="selectModalImage(${i})"
          class="rounded-xl overflow-hidden aspect-[4/3] bg-[#f5f6f2] transition-all ${activeClass}"
        >
          <img
            src="${img.url}"
            alt="${escapeHtml(img.caption)}"
            onerror="this.onerror=null; this.src='${thumbFallback}';"
            class="w-full h-full object-cover"
          />
        </button>
      `;
    })
    .join('');
}

function slideModalImage(delta) {
  if (!state.activeModalItem) return;
  const total = state.activeModalItem.images.length;
  state.modalImageIndex = (state.modalImageIndex + delta + total) % total;
  updateModalGallery();
}

function selectModalImage(idx) {
  state.modalImageIndex = idx;
  updateModalGallery();
}

function changeModalQty(delta) {
  state.modalQty = Math.max(1, Math.min(20, state.modalQty + delta));
  updateModalQtyDisplay();
}

function updateModalQtyDisplay() {
  if (!state.activeModalItem) return;
  document.getElementById('modalQtyValue').textContent = state.modalQty;
  document.getElementById('modalBuyTotal').textContent = `₹${state.activeModalItem.price * state.modalQty}`;
}

function handleModalAddToBasket() {
  if (!state.activeModalItem) return;
  addItemToBasket(state.activeModalItem.id, state.modalQty);
  showToast(`Added ${state.modalQty} × ${state.activeModalItem.name} to Basket!`, 'success');
  closeItemModal();
}

function handleModalBuyNow() {
  if (!state.activeModalItem) return;
  const orderLine = [
    {
      id: state.activeModalItem.id,
      name: state.activeModalItem.name,
      price: state.activeModalItem.price,
      deliveryTime: state.activeModalItem.deliveryTime,
      qty: state.modalQty,
    },
  ];
  closeItemModal();
  startCheckout(orderLine, 'single');
}

// ==================== BASKET (CART) FOR MULTIPLE ORDERS ====================
function addItemToBasket(itemId, qty = 1) {
  const basket = getBasket();
  const existing = basket.find((b) => b.id === itemId);
  if (existing) {
    existing.qty = Math.min(20, existing.qty + qty);
  } else {
    basket.push({ id: itemId, qty });
  }
  saveBasket(basket);
}

function handleOpenBasket() {
  closeMobileSidebar();
  requireStudentAuth(
    () => openBasketDrawer(),
    'Please Sign In as a Campus Student to open your Food Basket.'
  );
}

function openBasketDrawer() {
  renderBasketDrawer();
  document.getElementById('basketOverlay').classList.remove('hidden');
}

function closeBasket() {
  document.getElementById('basketOverlay').classList.add('hidden');
}

function renderBasketDrawer() {
  const basket = getBasket();
  const container = document.getElementById('basketItemsContainer');
  const footer = document.getElementById('basketFooter');
  const totalCount = basket.reduce((sum, b) => sum + b.qty, 0);

  document.getElementById('drawerBasketCount').textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;

  if (basket.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-12 px-4">
        <div class="w-16 h-16 rounded-2xl bg-[#f5f6f2] flex items-center justify-center text-3xl mb-3">🧺</div>
        <h4 class="font-extrabold text-[#202b25] text-lg">Your Basket is Empty</h4>
        <p class="text-xs text-[#667168] mt-1 max-w-xs">Explore Royal's Canteen menu and add your favorite dishes to order them together.</p>
        <button onclick="closeBasket(); scrollToSection('carouselsSection');" class="mt-4 px-5 py-2.5 rounded-lg bg-[#245c43] text-white text-xs font-bold hover:bg-[#194733]">
          Browse Dishes
        </button>
      </div>
    `;
    footer.classList.add('hidden');
    return;
  }

  footer.classList.remove('hidden');
  let subtotal = 0;
  let maxDelivery = 3;

  container.innerHTML = basket
    .map((entry) => {
      const item = MENU_ITEMS.find((i) => i.id === entry.id);
      if (!item) return '';
      const lineTotal = item.price * entry.qty;
      subtotal += lineTotal;
      maxDelivery = Math.max(maxDelivery, item.deliveryTime);
      const fallbackUrl = makeFallbackImg(item.name, item.images[0].bg);

      return `
        <div class="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-[#e9ece6] shadow-sm">
          <img
            src="${item.images[0].url}"
            alt="${escapeHtml(item.name)}"
            onerror="this.onerror=null; this.src='${fallbackUrl}';"
            class="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#f5f6f2]"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              ${getVegBadgeHtml(item.veg)}
              <h4 class="font-bold text-sm text-[#202b25] truncate">${escapeHtml(item.name)}</h4>
            </div>
            <p class="text-xs text-[#667168] mt-0.5">₹${item.price} each • ⚡ ${item.deliveryTime} mins</p>
            <div class="flex items-center justify-between mt-2">
              <div class="inline-flex items-center rounded-lg border border-[#e9ece6] bg-[#f8faf6]">
                <button onclick="updateBasketItemQty('${item.id}', -1)" class="w-7 h-7 font-bold text-[#202b25] hover:bg-[#eaf3ec] rounded-l-lg">−</button>
                <span class="w-7 text-center text-xs font-extrabold">${entry.qty}</span>
                <button onclick="updateBasketItemQty('${item.id}', 1)" class="w-7 h-7 font-bold text-[#245c43] hover:bg-[#eaf3ec] rounded-r-lg">+</button>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="font-extrabold text-sm text-[#202b25]">₹${lineTotal}</span>
                <button onclick="removeBasketItem('${item.id}')" class="text-xs text-[#667168] hover:text-[#c7584b] font-bold" title="Remove item">✕</button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  document.getElementById('basketSubtotal').textContent = `₹${subtotal}`;
  document.getElementById('basketEstTime').textContent = `${Math.min(10, Math.max(3, maxDelivery))} mins`;
  document.getElementById('basketTotal').textContent = `₹${subtotal}`;
}

function updateBasketItemQty(itemId, delta) {
  const basket = getBasket();
  const idx = basket.findIndex((b) => b.id === itemId);
  if (idx === -1) return;
  basket[idx].qty += delta;
  if (basket[idx].qty <= 0) {
    basket.splice(idx, 1);
  }
  saveBasket(basket);
  renderBasketDrawer();
}

function removeBasketItem(itemId) {
  const basket = getBasket().filter((b) => b.id !== itemId);
  saveBasket(basket);
  renderBasketDrawer();
}

function handleBasketBuy() {
  const basket = getBasket();
  if (basket.length === 0) return;

  const itemsToBuy = basket
    .map((entry) => {
      const item = MENU_ITEMS.find((i) => i.id === entry.id);
      if (!item) return null;
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        deliveryTime: item.deliveryTime,
        qty: entry.qty,
      };
    })
    .filter(Boolean);

  closeBasket();
  startCheckout(itemsToBuy, 'basket');
}

// ==================== CHECKOUT WORKFLOW ====================
function startCheckout(items, source) {
  if (!state.currentUser) {
    requireStudentAuth(() => startCheckout(items, source));
    return;
  }

  state.checkoutItems = items;
  state.checkoutSource = source;
  state.selectedPaymentMethod = 'UPI';

  document.getElementById('chkName').value = state.currentUser.name;
  document.getElementById('step1ErrorBox').classList.add('hidden');

  const total = getCheckoutTotal();
  const estMins = getCheckoutEstMinutes();
  document.getElementById('step1EstDelivery').textContent = `⚡ Est. ${estMins} mins`;
  document.getElementById('step1TotalAmount').textContent = `₹${total}`;
  document.getElementById('step1ItemsList').innerHTML = items
    .map(
      (i) => `
      <div class="flex justify-between text-[#354139]">
        <span><strong>${i.qty} ×</strong> ${escapeHtml(i.name)}</span>
        <span class="font-semibold">₹${i.price * i.qty}</span>
      </div>`
    )
    .join('');

  updateComputedAddress();
  showCheckoutStep(1);

  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function getCheckoutTotal() {
  return state.checkoutItems.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCheckoutEstMinutes() {
  const maxMin = state.checkoutItems.reduce((m, i) => Math.max(m, i.deliveryTime), 3);
  return Math.min(10, Math.max(3, maxMin));
}

function getSelectedHostel() {
  const radio = document.querySelector('input[name="hostelOption"]:checked');
  return radio ? radio.value : 'Boys Hostel';
}

function updateComputedAddress() {
  const hostel = getSelectedHostel();
  const room = document.getElementById('chkRoomNo').value.trim() || '___';
  const fullAddr = `${hostel}, Room No. ${room}, College Campus`;
  document.getElementById('computedAddressText').textContent = fullAddr;
}

function showCheckoutStep(stepNum) {
  ['checkoutStep1', 'checkoutStep2', 'checkoutStep3', 'checkoutStep4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (i + 1 === stepNum) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  for (let s = 1; s <= 3; s++) {
    const pill = document.getElementById(`stepPill${s}`);
    if (stepNum === 4 || s < stepNum) {
      pill.className = 'px-3 py-1.5 rounded-lg bg-[#b8db9c] text-[#194733] text-center font-extrabold';
    } else if (s === stepNum) {
      pill.className = 'px-3 py-1.5 rounded-lg bg-white text-[#194733] text-center shadow-sm font-extrabold';
    } else {
      pill.className = 'px-3 py-1.5 rounded-lg bg-white/15 text-white/80 text-center';
    }
  }
}

function goToPaymentStep(e) {
  e.preventDefault();
  const name = document.getElementById('chkName').value.trim();
  const regNo = document.getElementById('chkRegNo').value.trim();
  const hostel = getSelectedHostel();
  const roomNo = document.getElementById('chkRoomNo').value.trim();
  const phone = document.getElementById('chkPhone').value.trim();
  const errBox = document.getElementById('step1ErrorBox');

  if (!regNo || !roomNo) {
    errBox.textContent = 'Please enter both your College Registration No. and Hostel Room No.';
    errBox.classList.remove('hidden');
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    errBox.textContent = 'Please enter a valid 10-digit mobile Phone No.';
    errBox.classList.remove('hidden');
    return;
  }

  errBox.classList.add('hidden');
  const fullAddress = `${hostel}, Room No. ${roomNo}, College Campus`;

  state.studentDetails = { name, regNo, hostel, roomNo, phone, fullAddress };

  const total = getCheckoutTotal();
  document.getElementById('step2AddressSummary').textContent = fullAddress;
  document.getElementById('step2TotalAmount').textContent = `₹${total}`;
  document.getElementById('upiScanHeadline').textContent = `Scan & Pay ₹${total} via any UPI App`;
  document.getElementById('codAmountText').textContent = `₹${total}`;

  selectPaymentMethod('UPI');
  showCheckoutStep(2);
}

function backToDetailsStep() {
  showCheckoutStep(1);
}

function selectPaymentMethod(method) {
  state.selectedPaymentMethod = method;
  const btnUpi = document.getElementById('payBtnUPI');
  const btnCod = document.getElementById('payBtnCOD');
  const upiPanel = document.getElementById('upiQrPanel');
  const codPanel = document.getElementById('codPanel');
  const receiptBtn = document.getElementById('getReceiptBtn');

  if (method === 'UPI') {
    btnUpi.className = 'p-4 rounded-xl border-2 border-[#245c43] bg-[#eaf3ec]/70 text-left transition-all flex items-center gap-3.5 shadow-sm';
    btnCod.className = 'p-4 rounded-xl border-2 border-[#e9ece6] bg-white hover:border-[#b8c9bc] text-left transition-all flex items-center gap-3.5';
    upiPanel.classList.remove('hidden');
    codPanel.classList.add('hidden');
    receiptBtn.textContent = 'Payment Completed — Get Receipt';
    renderUpiQrCode(getCheckoutTotal());
  } else {
    btnCod.className = 'p-4 rounded-xl border-2 border-[#245c43] bg-[#eaf3ec]/70 text-left transition-all flex items-center gap-3.5 shadow-sm';
    btnUpi.className = 'p-4 rounded-xl border-2 border-[#e9ece6] bg-white hover:border-[#b8c9bc] text-left transition-all flex items-center gap-3.5';
    upiPanel.classList.add('hidden');
    codPanel.classList.remove('hidden');
    receiptBtn.textContent = 'Get Receipt';
  }
}

function renderUpiQrCode(amount) {
  const container = document.getElementById('upiQrContainer');
  container.innerHTML = '';
  const upiUri = `upi://pay?pa=royalscanteen@upi&pn=Royals%20Canteen&am=${amount}.00&cu=INR&tn=RoyalsCanteenOrder`;

  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(container, {
        text: upiUri,
        width: 184,
        height: 184,
        colorDark: '#194733',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
      return;
    }
  } catch (err) {
    console.warn('QRCodeJS fallback triggered:', err);
  }

  container.innerHTML = generateFallbackQrSvg(upiUri);
}

function generateFallbackQrSvg(seedStr) {
  const size = 21;
  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let rects = '';
  const isFinder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

  const drawFinder = (ox, oy) => {
    let s = `<rect x="${ox}" y="${oy}" width="7" height="7" fill="#194733"/>`;
    s += `<rect x="${ox + 1}" y="${oy + 1}" width="5" height="5" fill="#ffffff"/>`;
    s += `<rect x="${ox + 2}" y="${oy + 2}" width="3" height="3" fill="#194733"/>`;
    return s;
  };

  rects += drawFinder(0, 0);
  rects += drawFinder(size - 7, 0);
  rects += drawFinder(0, size - 7);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c)) continue;
      const bit = ((hash >>> ((r * 3 + c * 7) % 24)) ^ (r * 13 + c * 17)) & 1;
      if (bit) {
        rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#194733"/>`;
      }
    }
  }

  return `<svg viewBox="-1 -1 ${size + 2} ${size + 2}" class="w-48 h-48 bg-white">${rects}</svg>`;
}

function copyUpiId() {
  const upiText = 'royalscanteen@upi';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(upiText).then(
      () => showToast(`UPI ID copied: ${upiText}`, 'info'),
      () => fallbackCopy(upiText)
    );
  } else {
    fallbackCopy(upiText);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(`UPI ID copied: ${text}`, 'info');
  } catch {
    showToast(`UPI ID: ${text}`, 'info');
  }
  document.body.removeChild(tempInput);
}

function generateReceiptStep() {
  const orderId = `RC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowStr = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUpi = state.selectedPaymentMethod === 'UPI';
  const total = getCheckoutTotal();
  const estMins = getCheckoutEstMinutes();

  currentDraftOrder = {
    orderId,
    dateTime: nowStr,
    studentAccountName: state.currentUser.name,
    student: { ...state.studentDetails },
    items: state.checkoutItems.map((i) => ({ ...i })),
    paymentMethod: state.selectedPaymentMethod,
    paymentStatus: isUpi ? 'Paid via UPI' : 'Cash on Delivery',
    estimatedMinutes: estMins,
    total,
    status: 'Preparing',
  };

  document.getElementById('recOrderId').textContent = `Receipt #${currentDraftOrder.orderId}`;
  document.getElementById('recDateTime').textContent = currentDraftOrder.dateTime;

  const badge = document.getElementById('recPaymentBadge');
  badge.textContent = currentDraftOrder.paymentStatus;
  badge.className = isUpi
    ? 'inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eaf3ec] text-[#245c43]'
    : 'inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff3e6] text-[#9b6220]';

  document.getElementById('recStudentName').textContent = currentDraftOrder.student.name;
  document.getElementById('recRegNo').textContent = currentDraftOrder.student.regNo;
  document.getElementById('recHostelRoom').textContent = `${currentDraftOrder.student.hostel}, Room ${currentDraftOrder.student.roomNo}`;
  document.getElementById('recPhone').textContent = currentDraftOrder.student.phone;
  document.getElementById('recFullAddress').textContent = currentDraftOrder.student.fullAddress;

  document.getElementById('recItemsBody').innerHTML = currentDraftOrder.items
    .map(
      (i) => `
      <tr>
        <td class="py-2.5 font-semibold text-[#202b25]">${escapeHtml(i.name)}</td>
        <td class="py-2.5 text-center font-bold text-[#526056]">${i.qty}</td>
        <td class="py-2.5 text-right text-[#667168]">₹${i.price}</td>
        <td class="py-2.5 text-right font-bold text-[#202b25]">₹${i.price * i.qty}</td>
      </tr>`
    )
    .join('');

  document.getElementById('recDeliveryTime').textContent = `${currentDraftOrder.estimatedMinutes} mins (Express Campus Delivery)`;
  document.getElementById('recGrandTotal').textContent = `₹${currentDraftOrder.total}`;

  showCheckoutStep(3);
  showToast('Receipt generated! You can download the PDF and confirm your order.', 'success');
}

function downloadReceiptPDF(order) {
  if (!order) return;

  try {
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let y = 50;

      // Royal Green Header Bar (matching Major Project Part 1)
      doc.setFillColor(36, 92, 67);
      doc.rect(0, 0, 595, 86, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("canteenROYAL — Royal's Canteen", 40, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Official Food Order Receipt • Express Hostel Delivery (3–10 Mins)', 40, 64);

      y = 115;
      doc.setTextColor(32, 43, 37);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`Receipt / Order No: ${order.orderId}`, 40, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(82, 96, 86);
      doc.text(`Date & Time: ${order.dateTime}`, 40, y + 18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(order.paymentMethod === 'UPI' ? 36 : 180, order.paymentMethod === 'UPI' ? 92 : 112, order.paymentMethod === 'UPI' ? 67 : 38);
      doc.text(`Payment Status: ${order.paymentStatus}`, 360, y);

      y += 38;
      doc.setFillColor(245, 246, 242);
      doc.setDrawColor(233, 236, 230);
      doc.roundedRect(40, y, 515, 108, 8, 8, 'FD');

      doc.setTextColor(32, 43, 37);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('STUDENT & HOSTEL DELIVERY DETAILS', 55, y + 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Student Name: ${order.student.name}`, 55, y + 42);
      doc.text(`Registration No.: ${order.student.regNo}`, 310, y + 42);
      doc.text(`Hostel: ${order.student.hostel}`, 55, y + 62);
      doc.text(`Room No.: ${order.student.roomNo}`, 310, y + 62);
      doc.text(`Phone No.: ${order.student.phone}`, 55, y + 82);
      doc.setFont('helvetica', 'bold');
      doc.text(`Delivery Address: ${order.student.fullAddress}`, 55, y + 98);

      y += 135;
      doc.setFillColor(25, 71, 51);
      doc.rect(40, y, 515, 26, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Food Item', 52, y + 17);
      doc.text('Qty', 340, y + 17);
      doc.text('Unit Price', 405, y + 17);
      doc.text('Subtotal', 485, y + 17);

      y += 42;
      doc.setTextColor(32, 43, 37);
      doc.setFont('helvetica', 'normal');
      order.items.forEach((item) => {
        doc.text(item.name, 52, y);
        doc.text(String(item.qty), 345, y);
        doc.text(`Rs. ${item.price}`, 405, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs. ${item.price * item.qty}`, 485, y);
        doc.setFont('helvetica', 'normal');
        doc.setDrawColor(233, 236, 230);
        doc.line(40, y + 8, 555, y + 8);
        y += 26;
      });

      y += 12;
      doc.setFontSize(10);
      doc.setTextColor(82, 96, 86);
      doc.text(`Estimated Delivery Time: ${order.estimatedMinutes} mins (3–10 min Campus Promise)`, 40, y);
      doc.text('Campus Hostel Delivery Fee: FREE', 40, y + 18);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(36, 92, 67);
      doc.text(`Grand Total: Rs. ${order.total}`, 390, y + 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(129, 138, 131);
      doc.text("Thank you for ordering from canteenROYAL — Royal's Canteen Student Portal.", 40, 780);

      doc.save(`RoyalsCanteen_Receipt_${order.orderId}.pdf`);
      showToast(`Downloaded RoyalsCanteen_Receipt_${order.orderId}.pdf`, 'success');
      return;
    }
  } catch (err) {
    console.warn('jsPDF failed, falling back to print:', err);
  }

  window.print();
  showToast('Opened print dialog to save Receipt as PDF.', 'info');
}

async function confirmFinalOrder() {
  if (!currentDraftOrder) return;

  const confirmedOrder = { ...currentDraftOrder, status: 'Preparing' };
  const allOrders = getAllOrders();
  allOrders.unshift(confirmedOrder);
  safeWriteJSON(STORAGE_KEYS.ORDERS, allOrders);

  if (state.checkoutSource === 'basket') {
    saveBasket([]);
  }

  lastConfirmedOrder = confirmedOrder;
  currentDraftOrder = null;
  updateHeaderCounts();

  // Send receipt notification to Major Project Part 1 Admin (via PHP/SQLite or Java backend + localStorage)
  await sendOrderToCanteenBackend(lastConfirmedOrder);

  document.getElementById('confirmedSummaryText').textContent =
    `Order #${lastConfirmedOrder.orderId} (${lastConfirmedOrder.paymentStatus} • ₹${lastConfirmedOrder.total}) receipt has been sent to Royal's Canteen Administrator.`;
  document.getElementById('confirmedDeliveryETA').textContent =
    `Delivering to ${lastConfirmedOrder.student.fullAddress} in ~${lastConfirmedOrder.estimatedMinutes} mins`;

  const banner = document.getElementById('activeOrderBanner');
  document.getElementById('activeBannerTitle').textContent = `Order #${lastConfirmedOrder.orderId} Confirmed! Receipt sent to Royal's Canteen...`;
  document.getElementById('activeBannerSub').textContent = `Delivering to ${lastConfirmedOrder.student.fullAddress} • Est. ${lastConfirmedOrder.estimatedMinutes} mins • ${lastConfirmedOrder.paymentStatus}`;
  banner.classList.remove('hidden');

  showCheckoutStep(4);
  showToast("Order Confirmed! Receipt sent to Royal's Canteen — watch the bell icon for delivery alerts.", 'success');
}

// ==================== MY ORDERS MODAL ====================
function handleOpenOrders() {
  closeMobileSidebar();
  requireStudentAuth(
    () => openOrdersModal(),
    'Sign in with your Campus Student account to view your Order History.'
  );
}

function openOrdersModal() {
  const orders = getUserOrders();
  const container = document.getElementById('ordersListContainer');
  document.getElementById('ordersStudentSub').textContent = `Showing confirmed orders for ${state.currentUser.name}`;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-4xl mb-3">📦</div>
        <h4 class="font-extrabold text-[#202b25] text-lg">No Orders Yet</h4>
        <p class="text-xs text-[#667168] mt-1">Once you confirm a canteen order, your receipt and live delivery status will appear here.</p>
      </div>
    `;
  } else {
    container.innerHTML = orders
      .map((ord, idx) => {
        const isUpi = ord.paymentMethod === 'UPI';
        const itemsSummary = ord.items.map((i) => `${i.qty} × ${i.name}`).join(', ');
        const statusText = ord.status === 'Completed'
          ? 'Completed · Delivery Coming Near'
          : ord.status === 'Ready'
          ? 'Ready at Kitchen'
          : ord.status || 'Preparing';
        const statusBg = ord.status === 'Completed'
          ? 'bg-[#eaf3ec] text-[#245c43]'
          : ord.status === 'Ready'
          ? 'bg-[#e9f2fb] text-[#2e6091]'
          : 'bg-[#fff3e6] text-[#9b6220]';

        return `
          <div class="rounded-xl border border-[#e9ece6] bg-[#f8faf6] p-4 space-y-3">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-extrabold text-sm text-[#202b25]">#${escapeHtml(ord.orderId)}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}">${escapeHtml(statusText)}</span>
                </div>
                <p class="text-[11px] text-[#667168] mt-0.5">${escapeHtml(ord.dateTime)} • ⚡ Est. ${ord.estimatedMinutes} mins</p>
              </div>
              <div class="text-right">
                <p class="font-extrabold text-base text-[#245c43]">₹${ord.total}</p>
                <span class="text-[10px] font-bold ${isUpi ? 'text-[#245c43]' : 'text-[#9b6220]'}">${escapeHtml(ord.paymentStatus)}</span>
              </div>
            </div>

            <p class="text-xs font-semibold text-[#202b25] bg-white rounded-lg p-2.5 border border-[#e9ece6]">
              ${escapeHtml(itemsSummary)}
            </p>

            <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526056]">
              <div>
                <span class="font-bold text-[#202b25]">${escapeHtml(ord.student.name)}</span> (${escapeHtml(ord.student.regNo)}) • ${escapeHtml(ord.student.fullAddress)}
              </div>
              <button
                onclick="downloadOrderByIndex(${idx})"
                class="px-3 py-1.5 rounded-lg bg-[#245c43] hover:bg-[#194733] text-white font-bold text-[11px] transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  const modal = document.getElementById('ordersModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function downloadOrderByIndex(idx) {
  const orders = getUserOrders();
  if (orders[idx]) {
    downloadReceiptPDF(orders[idx]);
  }
}

function closeOrdersModal() {
  const modal = document.getElementById('ordersModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ==================== INITIALIZATION ====================
async function initApp() {
  seedDemoStudent();
  state.currentUser = safeReadJSON(STORAGE_KEYS.CURRENT_USER, null);

  renderHeaderAuth();
  renderCarousels();
  renderCategoryFilters();
  renderFullMenuGrid();
  renderBellNotifications();

  await detectBackendApi();
  await pollUserNotifications();

  // Poll every 2.5 seconds for Admin status updates (Ready -> Completed -> "The delivery coming near to the user")
  if (notifPollTimer) clearInterval(notifPollTimer);
  notifPollTimer = setInterval(pollUserNotifications, 2500);

  // Instant cross-tab sync when opened on same origin
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.SHARED_NOTIFICATIONS || event.key === STORAGE_KEYS.SHARED_CANTEEN_DATA) {
      pollUserNotifications();
    }
  });

  // Mark notifications read when popover opens? Keep unread badge until user clicks "Mark all read" or views them
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      closeItemModal();
      closeBasket();
      closeOrdersModal();
      closeMobileSidebar();
    }
  });
}

window.addEventListener('DOMContentLoaded', initApp);
