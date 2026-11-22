const STORAGE_KEY = "canteenos-data-v1";
const PAGE_TITLES = {
  customer: "Customer site",
  overview: "Overview",
  orders: "Orders",
  menu: "Menu",
  inventory: "Inventory",
  reports: "Sales & reports"
};
const seedData = {
  menu: [
    { id: "m1", name: "Masala Dosa", category: "Breakfast", price: 65, costPerServing: 24, emoji: "🥞", description: "Crispy dosa with potato masala" },
    { id: "m2", name: "Veg Thali", category: "Meals", price: 120, costPerServing: 55, emoji: "🍛", description: "Today's wholesome lunch special" },
    { id: "m3", name: "Paneer Roll", category: "Snacks", price: 85, costPerServing: 34, emoji: "🌯", description: "Spiced paneer wrapped fresh" },
    { id: "m4", name: "Filter Coffee", category: "Drinks", price: 30, costPerServing: 10, emoji: "☕", description: "South Indian filter coffee" },
    { id: "m5", name: "Samosa (2 pcs)", category: "Snacks", price: 35, costPerServing: 18, emoji: "🥟", description: "Golden, flaky and satisfying" },
    { id: "m6", name: "Fresh Lime Soda", category: "Drinks", price: 40, costPerServing: 12, emoji: "🍋", description: "Fresh lime, sweet or salted" },
    { id: "m7", name: "Idli Sambar", category: "Breakfast", price: 45, costPerServing: 16, emoji: "🥣", description: "Soft idlis with warm sambar" },
    { id: "m8", name: "Aloo Paratha", category: "Breakfast", price: 55, costPerServing: 23, emoji: "🫓", description: "Stuffed paratha served with curd" },
    { id: "m9", name: "Chole Bhature", category: "Meals", price: 110, costPerServing: 48, emoji: "🍲", description: "Spiced chickpeas with fluffy bhature" },
    { id: "m10", name: "Veg Pulao", category: "Meals", price: 95, costPerServing: 39, emoji: "🍚", description: "Fragrant rice with seasonal vegetables" },
    { id: "m11", name: "Masala Chai", category: "Drinks", price: 20, costPerServing: 7, emoji: "🫖", description: "Freshly brewed spiced tea" },
    { id: "m12", name: "Gulab Jamun (2 pcs)", category: "Desserts", price: 45, costPerServing: 18, emoji: "🍡", description: "Warm syrup-soaked Indian sweets" },
    { id: "m13", name: "Veg Sandwich", category: "Snacks", price: 65, costPerServing: 28, emoji: "🥪", description: "Toasted sandwich with fresh vegetables" },
    { id: "m14", name: "Cheese Corn Sandwich", category: "Snacks", price: 85, costPerServing: 39, emoji: "🥪", description: "Grilled sandwich with cheese and corn" },
    { id: "m15", name: "Veg Burger", category: "Snacks", price: 90, costPerServing: 42, emoji: "🍔", description: "Crispy vegetable patty with salad" },
    { id: "m16", name: "French Fries", category: "Snacks", price: 70, costPerServing: 30, emoji: "🍟", description: "Crispy salted potato fries" },
    { id: "m17", name: "Pav Bhaji", category: "Meals", price: 100, costPerServing: 44, emoji: "🍛", description: "Spiced vegetable mash with buttered pav" },
    { id: "m18", name: "Vada Pav", category: "Snacks", price: 35, costPerServing: 14, emoji: "🍔", description: "Mumbai-style potato fritter bun" },
    { id: "m19", name: "Poha", category: "Breakfast", price: 40, costPerServing: 14, emoji: "🥣", description: "Light flattened rice with peanuts" },
    { id: "m20", name: "Upma", category: "Breakfast", price: 40, costPerServing: 15, emoji: "🥣", description: "Savory semolina with vegetables" },
    { id: "m21", name: "Plain Dosa", category: "Breakfast", price: 55, costPerServing: 20, emoji: "🥞", description: "Crispy dosa served with chutney" },
    { id: "m22", name: "Rava Dosa", category: "Breakfast", price: 75, costPerServing: 29, emoji: "🥞", description: "Crispy semolina dosa with spices" },
    { id: "m23", name: "Onion Uttapam", category: "Breakfast", price: 75, costPerServing: 28, emoji: "🥞", description: "Soft rice pancake topped with onion" },
    { id: "m24", name: "Paneer Paratha", category: "Breakfast", price: 75, costPerServing: 34, emoji: "🫓", description: "Stuffed paratha with spiced paneer" },
    { id: "m25", name: "Rajma Chawal", category: "Meals", price: 100, costPerServing: 45, emoji: "🍛", description: "Kidney bean curry with steamed rice" },
    { id: "m26", name: "Dal Tadka Rice", category: "Meals", price: 85, costPerServing: 36, emoji: "🍚", description: "Yellow lentils with rice and tadka" },
    { id: "m27", name: "Kadai Paneer", category: "Meals", price: 130, costPerServing: 62, emoji: "🍲", description: "Paneer and peppers in spiced gravy" },
    { id: "m28", name: "Jeera Rice", category: "Meals", price: 80, costPerServing: 32, emoji: "🍚", description: "Basmati rice tempered with cumin" },
    { id: "m29", name: "Veg Biryani", category: "Meals", price: 120, costPerServing: 52, emoji: "🍛", description: "Fragrant rice layered with vegetables" },
    { id: "m30", name: "Curd Rice", category: "Meals", price: 75, costPerServing: 30, emoji: "🍚", description: "Cooling rice mixed with seasoned curd" },
    { id: "m31", name: "Lemon Rice", category: "Meals", price: 75, costPerServing: 28, emoji: "🍋", description: "Tangy rice with lemon and peanuts" },
    { id: "m32", name: "Hakka Noodles", category: "Meals", price: 100, costPerServing: 42, emoji: "🍜", description: "Wok-tossed noodles with vegetables" },
    { id: "m33", name: "Veg Manchurian", category: "Meals", price: 110, costPerServing: 50, emoji: "🥘", description: "Vegetable dumplings in tangy sauce" },
    { id: "m34", name: "Chilli Paneer", category: "Meals", price: 130, costPerServing: 62, emoji: "🥘", description: "Paneer tossed with peppers and chilli" },
    { id: "m35", name: "Spring Rolls", category: "Snacks", price: 80, costPerServing: 35, emoji: "🌯", description: "Crispy rolls filled with vegetables" },
    { id: "m36", name: "Bread Pakora", category: "Snacks", price: 40, costPerServing: 18, emoji: "🍞", description: "Bread fritter coated in spiced batter" },
    { id: "m37", name: "Onion Pakora", category: "Snacks", price: 45, costPerServing: 19, emoji: "🧅", description: "Crispy onion fritters with herbs" },
    { id: "m38", name: "Dhokla", category: "Snacks", price: 50, costPerServing: 21, emoji: "🧁", description: "Soft steamed Gujarati savoury cake" },
    { id: "m39", name: "Kachori (2 pcs)", category: "Snacks", price: 40, costPerServing: 17, emoji: "🥟", description: "Crispy pastry with spiced filling" },
    { id: "m40", name: "Corn Chaat", category: "Snacks", price: 65, costPerServing: 26, emoji: "🌽", description: "Sweet corn tossed with lime and spices" },
    { id: "m41", name: "Fresh Fruit Bowl", category: "Snacks", price: 70, costPerServing: 30, emoji: "🍉", description: "Seasonal fresh-cut fruit" },
    { id: "m42", name: "Mango Lassi", category: "Drinks", price: 55, costPerServing: 24, emoji: "🥭", description: "Yogurt blended with ripe mango" },
    { id: "m43", name: "Sweet Lassi", category: "Drinks", price: 45, costPerServing: 18, emoji: "🥛", description: "Chilled, lightly sweetened yogurt drink" },
    { id: "m44", name: "Salted Buttermilk", category: "Drinks", price: 25, costPerServing: 8, emoji: "🥛", description: "Cooling buttermilk with roasted cumin" },
    { id: "m45", name: "Hot Chocolate", category: "Drinks", price: 65, costPerServing: 25, emoji: "☕", description: "Rich hot chocolate made fresh" },
    { id: "m46", name: "Lemon Tea", category: "Drinks", price: 25, costPerServing: 8, emoji: "🍵", description: "Light tea with fresh lemon" },
    { id: "m47", name: "Badam Milk", category: "Drinks", price: 50, costPerServing: 22, emoji: "🥛", description: "Warm milk flavored with almond" },
    { id: "m48", name: "Chocolate Brownie", category: "Desserts", price: 60, costPerServing: 25, emoji: "🍫", description: "Fudgy chocolate brownie" },
    { id: "m49", name: "Ice Cream Cup", category: "Desserts", price: 40, costPerServing: 17, emoji: "🍨", description: "Chilled scoop of creamy ice cream" },
    { id: "m50", name: "Vanilla Milkshake", category: "Drinks", price: 60, costPerServing: 25, emoji: "🥤", description: "Cold, creamy vanilla milkshake" },
    { id: "m51", name: "Chicken Biryani", category: "Non-Veg", price: 170, costPerServing: 85, emoji: "🍗", description: "Aromatic rice cooked with spiced chicken" },
    { id: "m52", name: "Chicken Fried Rice", category: "Non-Veg", price: 140, costPerServing: 65, emoji: "🍚", description: "Wok-fried rice with chicken and vegetables" },
    { id: "m53", name: "Chicken Hakka Noodles", category: "Non-Veg", price: 150, costPerServing: 68, emoji: "🍜", description: "Stir-fried noodles with chicken" },
    { id: "m54", name: "Chicken Curry", category: "Non-Veg", price: 160, costPerServing: 78, emoji: "🍛", description: "Chicken simmered in a rich spiced gravy" },
    { id: "m55", name: "Butter Chicken", category: "Non-Veg", price: 190, costPerServing: 95, emoji: "🍲", description: "Chicken in a creamy tomato gravy" },
    { id: "m56", name: "Chicken Tikka", category: "Non-Veg", price: 160, costPerServing: 76, emoji: "🍗", description: "Yogurt-marinated chicken grilled with spices" },
    { id: "m57", name: "Tandoori Chicken", category: "Non-Veg", price: 210, costPerServing: 110, emoji: "🍗", description: "Tandoor-style chicken with smoky spices" },
    { id: "m58", name: "Chicken 65", category: "Non-Veg", price: 150, costPerServing: 70, emoji: "🍗", description: "Crispy, spiced South Indian chicken bites" },
    { id: "m59", name: "Chilli Chicken", category: "Non-Veg", price: 155, costPerServing: 72, emoji: "🍗", description: "Chicken tossed in a tangy chilli sauce" },
    { id: "m60", name: "Chicken Manchurian", category: "Non-Veg", price: 160, costPerServing: 75, emoji: "🥘", description: "Chicken bites in savory Manchurian sauce" },
    { id: "m61", name: "Chicken Kathi Roll", category: "Non-Veg", price: 110, costPerServing: 49, emoji: "🌯", description: "Spiced chicken wrapped in a flaky roll" },
    { id: "m62", name: "Chicken Sandwich", category: "Non-Veg", price: 95, costPerServing: 43, emoji: "🥪", description: "Toasted sandwich filled with seasoned chicken" },
    { id: "m63", name: "Chicken Burger", category: "Non-Veg", price: 120, costPerServing: 55, emoji: "🍔", description: "Chicken patty served in a soft bun" },
    { id: "m64", name: "Chicken Shawarma Roll", category: "Non-Veg", price: 130, costPerServing: 60, emoji: "🌯", description: "Spiced chicken with salad in a wrap" },
    { id: "m65", name: "Chicken Momos (6 pcs)", category: "Non-Veg", price: 100, costPerServing: 45, emoji: "🥟", description: "Steamed chicken dumplings with chutney" },
    { id: "m66", name: "Chicken Spring Rolls", category: "Non-Veg", price: 100, costPerServing: 46, emoji: "🌯", description: "Crispy rolls filled with seasoned chicken" },
    { id: "m67", name: "Chicken Pakora", category: "Non-Veg", price: 110, costPerServing: 51, emoji: "🍗", description: "Chicken pieces fried in a spiced batter" },
    { id: "m68", name: "Chicken Keema Pav", category: "Non-Veg", price: 125, costPerServing: 57, emoji: "🍞", description: "Spiced minced chicken served with pav" },
    { id: "m69", name: "Egg Biryani", category: "Non-Veg", price: 125, costPerServing: 55, emoji: "🍚", description: "Fragrant biryani rice served with boiled eggs" },
    { id: "m70", name: "Egg Fried Rice", category: "Non-Veg", price: 110, costPerServing: 47, emoji: "🍚", description: "Wok-fried rice with egg and vegetables" },
    { id: "m71", name: "Egg Curry", category: "Non-Veg", price: 105, costPerServing: 46, emoji: "🍛", description: "Boiled eggs in a homestyle curry" },
    { id: "m72", name: "Egg Bhurji Pav", category: "Non-Veg", price: 85, costPerServing: 35, emoji: "🍳", description: "Spiced scrambled eggs served with pav" },
    { id: "m73", name: "Masala Omelette", category: "Non-Veg", price: 65, costPerServing: 26, emoji: "🍳", description: "Omelette with onion, chilli and herbs" },
    { id: "m74", name: "Egg Sandwich", category: "Non-Veg", price: 75, costPerServing: 32, emoji: "🥪", description: "Toasted sandwich with seasoned egg" },
    { id: "m75", name: "Egg Roll", category: "Non-Veg", price: 70, costPerServing: 28, emoji: "🌯", description: "Egg wrapped in a soft flatbread" },
    { id: "m76", name: "Egg Noodles", category: "Non-Veg", price: 115, costPerServing: 49, emoji: "🍜", description: "Stir-fried noodles with egg and vegetables" },
    { id: "m77", name: "Boiled Egg (2 pcs)", category: "Non-Veg", price: 35, costPerServing: 14, emoji: "🥚", description: "Two boiled eggs with seasoning" },
    { id: "m78", name: "Fish Curry Rice", category: "Non-Veg", price: 175, costPerServing: 85, emoji: "🐟", description: "Fish curry served with steamed rice" },
    { id: "m79", name: "Fish Fry", category: "Non-Veg", price: 160, costPerServing: 78, emoji: "🐟", description: "Crispy pan-fried fish with spices" },
    { id: "m80", name: "Fish Biryani", category: "Non-Veg", price: 185, costPerServing: 90, emoji: "🐟", description: "Layered rice with spiced fish" },
    { id: "m81", name: "Fish Fingers (5 pcs)", category: "Non-Veg", price: 140, costPerServing: 64, emoji: "🐟", description: "Golden crumb-coated fish fingers" },
    { id: "m82", name: "Prawn Fried Rice", category: "Non-Veg", price: 180, costPerServing: 85, emoji: "🍤", description: "Fried rice tossed with seasoned prawns" },
    { id: "m83", name: "Prawn Curry Rice", category: "Non-Veg", price: 195, costPerServing: 96, emoji: "🍤", description: "Prawns in a spiced curry with rice" },
    { id: "m84", name: "Chilli Prawns", category: "Non-Veg", price: 190, costPerServing: 90, emoji: "🍤", description: "Prawns tossed with peppers and chilli" },
    { id: "m85", name: "Prawn Biryani", category: "Non-Veg", price: 210, costPerServing: 102, emoji: "🍤", description: "Aromatic biryani layered with prawns" },
    { id: "m86", name: "Mutton Biryani", category: "Non-Veg", price: 220, costPerServing: 112, emoji: "🍖", description: "Slow-cooked spiced mutton with rice" },
    { id: "m87", name: "Mutton Curry Rice", category: "Non-Veg", price: 210, costPerServing: 108, emoji: "🍛", description: "Tender mutton curry served with rice" },
    { id: "m88", name: "Mutton Keema Pav", category: "Non-Veg", price: 160, costPerServing: 78, emoji: "🍞", description: "Spiced minced mutton served with pav" },
    { id: "m89", name: "Chicken Pulao", category: "Non-Veg", price: 155, costPerServing: 72, emoji: "🍚", description: "Fragrant one-pot rice with chicken" },
    { id: "m90", name: "Chicken Kebab (4 pcs)", category: "Non-Veg", price: 145, costPerServing: 68, emoji: "🍢", description: "Juicy spiced chicken kebabs" },
    { id: "m91", name: "Chicken Lollipop (4 pcs)", category: "Non-Veg", price: 160, costPerServing: 75, emoji: "🍗", description: "Crispy chicken lollipops with sauce" },
    { id: "m92", name: "Chicken Seekh Kebab", category: "Non-Veg", price: 150, costPerServing: 70, emoji: "🍢", description: "Minced chicken kebabs grilled on skewers" },
    { id: "m93", name: "Chicken Clear Soup", category: "Non-Veg", price: 75, costPerServing: 30, emoji: "🍲", description: "Light chicken soup with herbs" },
    { id: "m94", name: "Chicken Caesar Sandwich", category: "Non-Veg", price: 125, costPerServing: 58, emoji: "🥪", description: "Chicken and crisp lettuce in toasted bread" },
    { id: "m95", name: "Chicken Cheese Wrap", category: "Non-Veg", price: 135, costPerServing: 63, emoji: "🌯", description: "Grilled chicken and cheese in a wrap" },
    { id: "m96", name: "Chicken Alfredo Pasta", category: "Non-Veg", price: 165, costPerServing: 78, emoji: "🍝", description: "Creamy pasta with chicken pieces" },
    { id: "m97", name: "Chicken Tikka Masala", category: "Non-Veg", price: 185, costPerServing: 90, emoji: "🍛", description: "Grilled chicken in a spiced tomato gravy" },
    { id: "m98", name: "Chicken Korma", category: "Non-Veg", price: 180, costPerServing: 88, emoji: "🍲", description: "Mild chicken curry with a creamy sauce" },
    { id: "m99", name: "Fish Tikka (4 pcs)", category: "Non-Veg", price: 175, costPerServing: 84, emoji: "🐟", description: "Marinated fish grilled with spices" },
    { id: "m100", name: "Egg Paratha", category: "Non-Veg", price: 75, costPerServing: 32, emoji: "🫓", description: "Flaky flatbread filled with egg" },
    { id: "m101", name: "Non-Veg Thali", category: "Non-Veg", price: 180, costPerServing: 92, emoji: "🍛", description: "A hearty meal with rice, curry and sides" }
  ],
  orders: [
    { id: "1042", customer: "Customer 1", item: "Veg Thali", qty: 2, total: 240, unitCost: 55, status: "Preparing", time: "12:42 PM", payment: "UPI", day: todayKey() },
    { id: "1041", customer: "Customer 2", item: "Masala Dosa", qty: 1, total: 65, unitCost: 24, status: "Ready", time: "12:38 PM", payment: "Cash", day: todayKey() },
    { id: "1040", customer: "Customer 3", item: "Paneer Roll", qty: 2, total: 170, unitCost: 34, status: "Preparing", time: "12:31 PM", payment: "UPI", day: todayKey() },
    { id: "1039", customer: "Customer 4", item: "Filter Coffee", qty: 1, total: 30, unitCost: 10, status: "Completed", time: "12:20 PM", payment: "Cash", day: todayKey() },
    { id: "1038", customer: "Customer 5", item: "Samosa (2 pcs)", qty: 2, total: 70, unitCost: 18, status: "Completed", time: "12:14 PM", payment: "UPI", day: todayKey() }
  ],
  inventory: [
    { id: "i1", name: "Rice", unit: "kg", stock: 18, minimum: 10, unitCost: 60, category: "Grains" },
    { id: "i2", name: "Potatoes", unit: "kg", stock: 6, minimum: 8, unitCost: 30, category: "Produce" },
    { id: "i3", name: "Paneer", unit: "kg", stock: 4, minimum: 3, unitCost: 360, category: "Dairy" },
    { id: "i4", name: "Cooking oil", unit: "L", stock: 3, minimum: 5, unitCost: 150, category: "Essentials" },
    { id: "i5", name: "Coffee powder", unit: "kg", stock: 2, minimum: 1, unitCost: 420, category: "Beverages" },
    { id: "i6", name: "Wheat flour", unit: "kg", stock: 12, minimum: 4, unitCost: 40, category: "Grains" },
    { id: "i7", name: "All-purpose flour", unit: "kg", stock: 8, minimum: 3, unitCost: 45, category: "Grains" },
    { id: "i8", name: "Semolina", unit: "kg", stock: 5, minimum: 2, unitCost: 55, category: "Grains" },
    { id: "i9", name: "Flattened rice", unit: "kg", stock: 5, minimum: 2, unitCost: 50, category: "Grains" },
    { id: "i10", name: "Dosa batter", unit: "kg", stock: 6, minimum: 2, unitCost: 60, category: "Grains" },
    { id: "i11", name: "Chickpea flour", unit: "kg", stock: 4, minimum: 2, unitCost: 90, category: "Grains" },
    { id: "i12", name: "Bread", unit: "pack", stock: 8, minimum: 3, unitCost: 35, category: "Bakery" },
    { id: "i13", name: "Pav buns", unit: "pack", stock: 6, minimum: 2, unitCost: 40, category: "Bakery" },
    { id: "i14", name: "Milk", unit: "L", stock: 12, minimum: 4, unitCost: 60, category: "Dairy" },
    { id: "i15", name: "Curd", unit: "kg", stock: 5, minimum: 2, unitCost: 90, category: "Dairy" },
    { id: "i16", name: "Butter", unit: "kg", stock: 2, minimum: 1, unitCost: 480, category: "Dairy" },
    { id: "i17", name: "Cheese", unit: "kg", stock: 3, minimum: 1, unitCost: 420, category: "Dairy" },
    { id: "i18", name: "Coconut", unit: "pcs", stock: 12, minimum: 4, unitCost: 35, category: "Produce" },
    { id: "i19", name: "Onions", unit: "kg", stock: 10, minimum: 4, unitCost: 35, category: "Produce" },
    { id: "i20", name: "Tomatoes", unit: "kg", stock: 8, minimum: 3, unitCost: 40, category: "Produce" },
    { id: "i21", name: "Ginger", unit: "kg", stock: 2, minimum: 1, unitCost: 120, category: "Produce" },
    { id: "i22", name: "Garlic", unit: "kg", stock: 2, minimum: 1, unitCost: 160, category: "Produce" },
    { id: "i23", name: "Green chillies", unit: "kg", stock: 2, minimum: 1, unitCost: 80, category: "Produce" },
    { id: "i24", name: "Capsicum", unit: "kg", stock: 4, minimum: 2, unitCost: 70, category: "Produce" },
    { id: "i25", name: "Cabbage", unit: "kg", stock: 4, minimum: 2, unitCost: 35, category: "Produce" },
    { id: "i26", name: "Carrots", unit: "kg", stock: 5, minimum: 2, unitCost: 50, category: "Produce" },
    { id: "i27", name: "Green peas", unit: "kg", stock: 4, minimum: 2, unitCost: 100, category: "Produce" },
    { id: "i28", name: "Sweet corn", unit: "kg", stock: 3, minimum: 1, unitCost: 100, category: "Produce" },
    { id: "i29", name: "Lemons", unit: "pcs", stock: 30, minimum: 10, unitCost: 5, category: "Produce" },
    { id: "i30", name: "Coriander leaves", unit: "kg", stock: 1, minimum: 0.5, unitCost: 120, category: "Produce" },
    { id: "i31", name: "Curry leaves", unit: "pack", stock: 8, minimum: 3, unitCost: 10, category: "Produce" },
    { id: "i32", name: "Mixed spices", unit: "kg", stock: 2, minimum: 1, unitCost: 300, category: "Essentials" },
    { id: "i33", name: "Cumin seeds", unit: "kg", stock: 1, minimum: 0.5, unitCost: 280, category: "Essentials" },
    { id: "i34", name: "Soy sauce", unit: "L", stock: 3, minimum: 1, unitCost: 110, category: "Essentials" },
    { id: "i35", name: "Chilli sauce", unit: "L", stock: 3, minimum: 1, unitCost: 130, category: "Essentials" },
    { id: "i36", name: "Noodles", unit: "kg", stock: 5, minimum: 2, unitCost: 90, category: "Grains" },
    { id: "i37", name: "Pasta", unit: "kg", stock: 4, minimum: 2, unitCost: 120, category: "Grains" },
    { id: "i38", name: "Tomato puree", unit: "L", stock: 3, minimum: 1, unitCost: 100, category: "Essentials" },
    { id: "i39", name: "Chicken", unit: "kg", stock: 8, minimum: 3, unitCost: 260, category: "Meat & seafood" },
    { id: "i40", name: "Eggs", unit: "pcs", stock: 60, minimum: 20, unitCost: 7, category: "Meat & seafood" },
    { id: "i41", name: "Fish", unit: "kg", stock: 5, minimum: 2, unitCost: 320, category: "Meat & seafood" },
    { id: "i42", name: "Prawns", unit: "kg", stock: 3, minimum: 1, unitCost: 500, category: "Meat & seafood" },
    { id: "i43", name: "Mutton", unit: "kg", stock: 4, minimum: 2, unitCost: 650, category: "Meat & seafood" },
    { id: "i44", name: "Breadcrumbs", unit: "kg", stock: 2, minimum: 1, unitCost: 110, category: "Essentials" },
    { id: "i45", name: "Mayonnaise", unit: "kg", stock: 2, minimum: 1, unitCost: 180, category: "Dairy" },
    { id: "i46", name: "Sugar", unit: "kg", stock: 8, minimum: 3, unitCost: 45, category: "Essentials" },
    { id: "i47", name: "Salt", unit: "kg", stock: 5, minimum: 2, unitCost: 20, category: "Essentials" },
    { id: "i48", name: "Almonds", unit: "kg", stock: 1, minimum: 0.5, unitCost: 900, category: "Essentials" },
    { id: "i49", name: "Mangoes", unit: "kg", stock: 4, minimum: 2, unitCost: 100, category: "Produce" },
    { id: "i50", name: "Bananas", unit: "dozen", stock: 4, minimum: 2, unitCost: 60, category: "Produce" },
    { id: "i51", name: "Ice cream", unit: "L", stock: 4, minimum: 2, unitCost: 180, category: "Dairy" },
    { id: "i52", name: "Cocoa powder", unit: "kg", stock: 1, minimum: 0.5, unitCost: 450, category: "Essentials" },
    { id: "i53", name: "Lettuce", unit: "kg", stock: 2, minimum: 1, unitCost: 100, category: "Produce" },
    { id: "i54", name: "Tea leaves", unit: "kg", stock: 2, minimum: 1, unitCost: 400, category: "Beverages" },
    { id: "i55", name: "Fresh cream", unit: "L", stock: 2, minimum: 1, unitCost: 220, category: "Dairy" },
    { id: "i56", name: "Vinegar", unit: "L", stock: 2, minimum: 1, unitCost: 80, category: "Essentials" },
    { id: "i57", name: "Black pepper", unit: "kg", stock: 1, minimum: 0.5, unitCost: 500, category: "Essentials" },
    { id: "i58", name: "Kidney beans", unit: "kg", stock: 4, minimum: 2, unitCost: 130, category: "Grains" },
    { id: "i59", name: "Lentils", unit: "kg", stock: 6, minimum: 2, unitCost: 110, category: "Grains" },
    { id: "i60", name: "Chickpeas", unit: "kg", stock: 5, minimum: 2, unitCost: 100, category: "Grains" }
  ],
  purchases: [],
  menuDefaultsVersion: 5,
  inventoryDefaultsVersion: 1
};

function hasCost(value) {
  return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(seedData);
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.menu) || !Array.isArray(parsed.orders) || !Array.isArray(parsed.inventory)) {
      throw new Error("Saved canteen data has an invalid format.");
    }
    const menuDefaultsVersion = 5;
    if (Number(parsed.menuDefaultsVersion || 0) < menuDefaultsVersion) {
      const existingIds = new Set(parsed.menu.map((item) => item.id));
      const addedMenuItems = seedData.menu.filter((item) =>
        Number(item.id.slice(1)) >= 7 && !existingIds.has(item.id)
      );
      parsed.menu.push(...addedMenuItems);
      parsed.menuDefaultsVersion = menuDefaultsVersion;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch (error) {
        console.error("Could not save the updated default menu:", error);
      }
    }
    const inventoryDefaultsVersion = 1;
    if (Number(parsed.inventoryDefaultsVersion || 0) < inventoryDefaultsVersion) {
      const existingIds = new Set(parsed.inventory.map((item) => item.id));
      const addedInventoryItems = seedData.inventory.filter((item) =>
        Number(item.id.slice(1)) >= 6 && !existingIds.has(item.id)
      );
      parsed.inventory.push(...addedInventoryItems);
      parsed.inventoryDefaultsVersion = inventoryDefaultsVersion;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch (error) {
        console.error("Could not save the updated default inventory:", error);
      }
    }
    const defaultCosts = new Map(seedData.menu.map((item) => [item.id, item.costPerServing]));
    parsed.menu = parsed.menu.map((item) => ({
      ...item,
      costPerServing: hasCost(item.costPerServing)
        ? Number(item.costPerServing)
        : defaultCosts.get(item.id) ?? null
    }));
    parsed.orders = parsed.orders.map((order) => {
      if (Array.isArray(order.items)) return order;
      const item = parsed.menu.find((menuItem) => menuItem.name === order.item);
      const unitCost = order.unitCost !== undefined
        ? order.unitCost
        : item ? item.costPerServing : null;
      return {
        ...order,
        unitCost,
        items: [{
          name: order.item,
          qty: Number(order.qty),
          unitPrice: Number(order.total) / Number(order.qty),
          unitCost
        }]
      };
    });
    parsed.inventory = parsed.inventory.map((item) => {
      const seedItem = seedData.inventory.find((seed) => seed.id === item.id);
      return {
        ...item,
        unitCost: hasCost(item.unitCost) ? Number(item.unitCost) : seedItem?.unitCost ?? null
      };
    });
    if (!Array.isArray(parsed.purchases)) parsed.purchases = [];
    return parsed;
  } catch (error) {
    console.error("Could not load saved canteen data:", error);
    return structuredClone(seedData);
  }
}

let data = loadData();
let activePage = document.documentElement.dataset.defaultPage || "overview";
let customerCategory = "All categories";
let customerSearch = "";
const customerCart = new Map();
let activeHeroSlide = 0;
let heroSlideTimer;
let toastTimer;
let serverSync = Promise.resolve();
const serverApiEnabled = window.location.protocol !== "file:" &&
  !window.location.hostname.endsWith("github.io") &&
  document.documentElement.dataset.serverApi !== "disabled";

const pageContent = document.querySelector("#page-content");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modal = document.querySelector("#modal");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (serverApiEnabled) queueServerSync(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Could not save canteen data:", error);
    showToast("Couldn't save changes. Check your browser storage settings.");
    return false;
  }
}

function queueServerSync(snapshot) {
  serverSync = serverSync.then(async () => {
    const response = await fetch("/api/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: snapshot
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}.`);
  }).catch((error) => {
    console.error("Could not sync canteen data with the server:", error);
    showToast("Changes are saved in this browser, but couldn't sync with the server.");
  });
}

async function loadServerData() {
  if (!serverApiEnabled) return;
  try {
    const response = await fetch("/api/data");
    if (response.status === 404) {
      queueServerSync(JSON.stringify(data));
      return;
    }
    if (!response.ok) throw new Error(`Server returned ${response.status}.`);
    const savedData = await response.json();
    if (!savedData || !Array.isArray(savedData.menu) ||
        !Array.isArray(savedData.orders) || !Array.isArray(savedData.inventory)) {
      throw new Error("The server returned invalid canteen data.");
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
    data = loadData();
    renderPage();
    const normalizedData = JSON.stringify(data);
    if (normalizedData !== JSON.stringify(savedData)) queueServerSync(normalizedData);
  } catch (error) {
    console.error("Could not load canteen data from the server:", error);
    showToast("Couldn't load data from the server. Browser-saved data is still available.");
  }
}

function money(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(amount);
}

function statusBadge(status) {
  return `<span class="badge ${escapeHtml(status.toLowerCase())}">${escapeHtml(status)}</span>`;
}

function getTodayOrders() {
  return data.orders.filter((order) => order.day === todayKey());
}

function getOrderItems(order) {
  if (Array.isArray(order.items)) return order.items;
  return [{
    name: order.item,
    qty: Number(order.qty),
    unitPrice: Number(order.total) / Number(order.qty),
    unitCost: order.unitCost
  }];
}

function orderItemsSummary(order) {
  return getOrderItems(order).map((item) =>
    `${item.name} × ${item.qty}`
  ).join(", ");
}

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getTodayFinancials() {
  const orders = getTodayOrders().filter((order) => order.status !== "Cancelled");
  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  let costOfGoods = 0;
  let unknownCostOrders = 0;
  orders.forEach((order) => {
    const items = getOrderItems(order);
    if (items.some((item) => !hasCost(item.unitCost))) {
      unknownCostOrders += 1;
    }
    costOfGoods += items.reduce((sum, item) =>
      sum + (hasCost(item.unitCost) ? Number(item.unitCost) * Number(item.qty) : 0), 0
    );
  });
  const purchases = (data.purchases || []).filter((purchase) => purchase.day === todayKey());
  const purchaseSpend = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
  return {
    revenue,
    costOfGoods,
    grossProfit: unknownCostOrders === 0 ? revenue - costOfGoods : null,
    purchaseSpend,
    unknownCostOrders,
    orderCount: orders.length
  };
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function setPage(page) {
  activePage = page;
  document.querySelector(".app-shell").classList.toggle("customer-mode", page === "customer");
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });
  document.querySelector("#breadcrumb-page").textContent = PAGE_TITLES[page];
  document.querySelector("#sidebar").classList.remove("open");
  renderPage();
}

function heading(title, subtitle, action = "") {
  return `<div class="page-heading"><div><div class="eyebrow">Royal's Canteen</div><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${action}</div>`;
}

function emptyState(icon, title, copy) {
  return `<div class="empty-state"><span>${icon}</span><strong>${title}</strong>${copy}</div>`;
}

function renderOverview() {
  const todayOrders = getTodayOrders();
  const activeOrders = todayOrders.filter((order) => ["Preparing", "Ready"].includes(order.status));
  const lowStock = data.inventory.filter((item) => Number(item.stock) <= Number(item.minimum));
  const financials = getTodayFinancials();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const topItems = data.menu.map((item) => ({
    ...item,
    sold: todayOrders.filter((order) => order.status !== "Cancelled")
      .reduce((sum, order) => sum + getOrderItems(order)
        .filter((orderItem) => orderItem.name === item.name)
        .reduce((itemSum, orderItem) => itemSum + Number(orderItem.qty), 0), 0)
  })).sort((a, b) => b.sold - a.sold).slice(0, 4);
  const recentOrders = [...data.orders].slice(0, 5);
  return `${heading(`${greeting}, Admin 👋`, "Here's what's happening at your canteen today.",
    `<button class="button" data-action="new-order">＋ New order</button>`)}
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-top"><span>Today's revenue</span><span class="stat-icon">₹</span></div><div class="stat-value">${money(financials.revenue)}</div><div class="stat-note"><span class="positive">●</span> From ${todayOrders.length} orders today</div></article>
      <article class="stat-card"><div class="stat-top"><span>Total orders</span><span class="stat-icon">▤</span></div><div class="stat-value">${todayOrders.length}</div><div class="stat-note">${activeOrders.length} orders need attention</div></article>
      <article class="stat-card"><div class="stat-top"><span>Today's gross profit</span><span class="stat-icon">↗</span></div><div class="stat-value">${financials.grossProfit === null ? "—" : money(financials.grossProfit)}</div><div class="stat-note">${financials.unknownCostOrders ? "Add item costs to calculate profit" : "Sales minus food preparation costs"}</div></article>
      <article class="stat-card"><div class="stat-top"><span>Menu items</span><span class="stat-icon">▦</span></div><div class="stat-value">${data.menu.length}</div><div class="stat-note">Across your canteen menu</div></article>
      <article class="stat-card"><div class="stat-top"><span>Low stock items</span><span class="stat-icon">▧</span></div><div class="stat-value">${lowStock.length}</div><div class="stat-note">${lowStock.length ? "Restock needed soon" : "All essentials are stocked"}</div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><h2>Recent orders</h2><button class="panel-link" data-page="orders">View all orders →</button></div>
        ${recentOrders.length ? `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>${recentOrders.map((order) => `<tr><td class="cell-strong">#${escapeHtml(order.id)}</td><td>${escapeHtml(order.customer)}</td><td>${escapeHtml(orderItemsSummary(order))}</td><td class="cell-strong">${money(order.total)}</td><td>${statusBadge(order.status)}</td></tr>`).join("")}</tbody></table></div>` : emptyState("▤", "No orders yet", "New orders will show up here.")}
      </section>
      <section class="panel"><div class="panel-header"><h2>Popular items today</h2><button class="panel-link" data-page="menu">View menu →</button></div>
        ${topItems.length ? `<div class="popular-list">${topItems.map((item) => `<div class="popular-item"><span class="food-emoji">${escapeHtml(item.emoji)}</span><div><div class="popular-name">${escapeHtml(item.name)}</div><div class="popular-meta">${item.sold} sold today</div></div><span class="popular-sales">${money(item.price)}</span></div>`).join("")}</div>` : emptyState("🍽️", "No menu items", "Add items to get started.")}
        ${lowStock.length ? `<div class="inventory-alert">⚠ ${lowStock.length} item${lowStock.length === 1 ? "" : "s"} running low: ${lowStock.map((item) => escapeHtml(item.name)).join(", ")}.</div>` : ""}
      </section>
    </div>`;
}

function renderOrders() {
  const statuses = ["All statuses", "Preparing", "Ready", "Completed", "Cancelled"];
  return `${heading("Orders", "Track and manage canteen orders.", `<button class="button" data-action="new-order">＋ New order</button>`)}
    <div class="toolbar" style="margin-bottom:14px"><label class="search-box"><span>⌕</span><input id="order-search" placeholder="Search order or customer" aria-label="Search order or customer"></label><select class="select-control" id="order-status" aria-label="Filter by status">${statuses.map((status) => `<option>${status}</option>`).join("")}</select></div>
    <section class="data-panel" id="orders-table"></section>`;
}

function renderOrdersTable() {
  const search = (document.querySelector("#order-search")?.value || "").trim().toLowerCase();
  const status = document.querySelector("#order-status")?.value || "All statuses";
  const orders = data.orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customer} ${orderItemsSummary(order)}`.toLowerCase().includes(search);
    return matchesSearch && (status === "All statuses" || order.status === status);
  });
  document.querySelector("#orders-table").innerHTML = orders.length ? `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Time</th><th>Payment</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>${orders.map((order) => {
    const nextStatus = order.status === "Preparing" ? "Ready" : order.status === "Ready" ? "Completed" : "";
    return `<tr><td class="cell-strong">#${escapeHtml(order.id)}</td><td>${escapeHtml(order.customer)}</td><td>${escapeHtml(orderItemsSummary(order))}</td><td>${escapeHtml(order.time)}</td><td>${escapeHtml(order.payment)}</td><td class="cell-strong">${money(order.total)}</td><td>${statusBadge(order.status)}</td><td>${nextStatus ? `<button class="button secondary small" data-action="advance-order" data-id="${escapeHtml(order.id)}">${nextStatus}</button>` : "—"}</td></tr>`;
  }).join("")}</tbody></table></div>` : emptyState("⌕", "No matching orders", "Try changing your search or status filter.");
}

function renderMenu() {
  const categories = [...new Set(data.menu.map((item) => item.category))];
  const imageForItem = (item) => menuImage(item.name);
  const cards = data.menu.map((item) => `<article class="menu-card">
    <div class="menu-card-top">${imageForItem(item) ? `<img class="menu-photo" src="${imageForItem(item)}" alt="${escapeHtml(item.name)}">` : `<span class="menu-emoji">${escapeHtml(item.emoji)}</span>`}<div class="menu-actions"><button class="icon-button" title="Edit ${escapeHtml(item.name)}" aria-label="Edit ${escapeHtml(item.name)}" data-action="edit-menu" data-id="${escapeHtml(item.id)}">✎</button><button class="icon-button" title="Remove ${escapeHtml(item.name)}" aria-label="Remove ${escapeHtml(item.name)}" data-action="delete-menu" data-id="${escapeHtml(item.id)}">×</button></div></div>
    <h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description || "Freshly prepared")}</p><p class="menu-cost">${hasCost(item.costPerServing) ? `Cost ${money(item.costPerServing)} · Profit ${money(Number(item.price) - Number(item.costPerServing))} / serving` : "Cost not set · profit unavailable"}</p>
    <div class="menu-card-bottom"><span class="menu-price">${money(item.price)}</span><span class="category-tag">${escapeHtml(item.category)}</span></div>
  </article>`).join("");
  return `${heading("Menu", "Manage the dishes and drinks available at your canteen.", `<button class="button" data-action="new-menu-item">＋ Add item</button>`)}
    ${categories.length ? `<div class="menu-grid">${cards}</div>` : emptyState("🍽️", "Your menu is empty", "Add an item to start building your menu.")}`;
}

function menuImage(name) {
  const images = {
    alooparatha: "AlooParatha.jpg",
    badammilk: "BadamMilk.jpg",
    boiledegg2pcs: "BoiledEgg.jpg",
    breadpakora: "BreadPakora.jpg",
    butterchicken: "ButterChicken.jpg",
    cheesecornsandwich: "CheeseCornSandwich.jpg",
    chicken65: "Chicken65.jpg",
    chickenburger: "ChickenBurger.jpg",
    chickencaesarsandwich: "ChickenCaesarSandwich.jpg",
    chickencheesewrap: "ChickenCheeseWrap.jpg",
    chickenclearsoup: "ChickenClearSoup.jpg",
    chickencurry: "ChickenCurry.jpg",
    chickenfriedrice: "ChickenFriedRice.jpg",
    chickenhakkanoodles: "ChickenHakkaNoodles.jpg",
    chickenkebab4pcs: "ChickenKebab.jpg",
    chickenkeemapav: "ChickenKeemaPav.jpg",
    chickenkorma: "ChickenKorma.jpg",
    chickenlollipop4pcs: "ChickenLollipop.jpg",
    chickenmanchurian: "ChickenManchurian.jpg",
    chickenmomos6pcs: "ChickenMomos.jpg",
    chickenpakora: "ChickenPakora.jpg",
    chickenpulao: "ChickenPulao.jpg",
    chickensandwich: "ChickenSandwich.jpg",
    chickenseekhkebab: "ChickenSeekhKebab.jpg",
    chickenshawarmaroll: "ChickenShawarmaRoll.jpg",
    chickenspringrolls: "ChickenSpringRolls.jpg",
    chickentikka: "ChickenTikka.jpg",
    chickentikkamasala: "ChickenTikkaMasala.jpg",
    cholebhature: "Chole_Bhature.jpg",
    chilliprawns: "ChilliPrawns.jpg",
    cornchaat: "CornChaat.jpg",
    chocolatebrownie: "ChocolateBrownie.jpg",
    curdrice: "CurdRice.jpg",
    daltadkarice: "DalTadkaRice.jpg",
    dhokla: "Dhokla.jpg",
    eggbhurjipav: "EggBhurjiPav.jpg",
    eggbiryani: "EggBiryani.jpg",
    eggfriedrice: "EggFriedRice.jpg",
    eggnoodles: "EggNoodles.jpg",
    eggparatha: "EggParatha.jpg",
    eggroll: "EggRoll.jpg",
    eggsandwich: "EggSandwich.jpg",
    filtercoffee: "FilterCoffee.jpg",
    fishbiryani: "FishBiryani.jpg",
    fishfingers5pcs: "FishFingers.jpg",
    fishfry: "FishFry.jpg",
    fishtikka4pcs: "FishTikka.jpg",
    freshfruitbowl: "FreshFruitBowl.jpg",
    freshlimesoda: "FreshLimeSoda.jpg",
    hakkanoodles: "HakkaNoodles.jpg",
    hotchocolate: "HotChocolate.jpg",
    icecreamcup: "IceCreamCup.jpg",
    idlisambar: "IdliSambar.jpg",
    jeerarice: "JeeraRice.jpg",
    kachori2pcs: "Kachori.jpg",
    kadaipaneer: "KadaiPaneer.jpg",
    lemonrice: "LemonRice.jpg",
    mangolassi: "MangoLassi.jpg",
    masaladosa: "MasalaDosa.jpg",
    masalachai: "MasalaChai.jpg",
    masalaomelette: "MasalaOmelette.jpg",
    muttonbiryani: "MuttonBiryani.jpg",
    muttoncurryrice: "MuttonCurryRice.jpg",
    muttonkeemapav: "MuttonKeemaPav.jpg",
    onionpakora: "OnionPakora.jpg",
    onionuttapam: "OnionUttapam.jpg",
    paneerparatha: "PaneerParatha.jpg",
    vegthali: "VegThali.jpg",
    paneerroll: "PaneerRoll.jpg",
    nonvegthali: "NonVegThali.jpg",
    pavbhaji: "PavBhaji.jpg",
    plaindosa: "PlainDosa.jpg",
    poha: "Poha.jpg",
    prawnbiryani: "PrawnBiryani.jpg",
    prawncurryrice: "PrawnCurryRice.jpg",
    prawnfriedrice: "PrawnFriedRice.jpg",
    rajmachawal: "RajmaChawal.jpg",
    ravadosa: "RavaDosa.jpg",
    saltedbuttermilk: "SaltedButtermilk.jpg",
    samosa2pcs: "Samosa.jpg",
    springrolls: "SpringRolls.jpg",
    sweetlassi: "SweetLassi.jpg",
    upma: "Upma.jpg",
    vadapav: "VadaPav.jpg",
    tandoorichicken: "TandooriChicken.jpg",
    vegbiryani: "VegBriyani.jpg",
    gulabjamun: "GulabJamun.jpg",
    gulabjamun2pcs: "GulabJamun.jpg",
    vegburger: "VegBurger.jpg",
    vegmanchurian: "VegManchurian.jpg",
    vegpulao: "VegPulao.jpg",
    vegsandwich: "VegSandwich.jpg",
    vanillamilkshake: "VanillaMilkshake.jpg",
    frenchfries: "FrenchFries.jpg",
    fishcurryrice: "FishCurry.jpg",
    fishcurry: "FishCurry.jpg",
    eggcurry: "EggCurry.jpg",
    chillipaneer: "chilli_paneer.jpg",
    chillichicken: "ChilliChicken.jpg",
    chickenkathiroll: "ChickenRoll.jpg",
    chickenroll: "ChickenRoll.jpg",
    chickenbiryani: "ChickenBriyani.jpg",
    chickenalfredopasta: "ChickenAlfredoPasta.jpg"
  };
  const key = String(name).toLowerCase().replace(/[^a-z0-9]/g, "");
  return images[key] || "";
}

function renderCustomerCards() {
  const search = customerSearch.trim().toLowerCase();
  const items = data.menu.filter((item) =>
    (customerCategory === "All categories" || item.category === customerCategory) &&
    `${item.name} ${item.description || ""}`.toLowerCase().includes(search)
  );
  const container = document.querySelector("#customer-menu-grid");
  if (!container) return;
  const categories = customerCategory === "All categories"
    ? [...new Set(items.map((item) => item.category))]
    : [customerCategory];
  const renderItem = (item) => {
    const quantity = customerCart.get(item.id) || 0;
    const image = menuImage(item.name);
    return `<article class="customer-food-card">
      <div class="customer-food-image">${image ? `<img src="${image}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async">` : `<span>${escapeHtml(item.emoji || "🍽️")}</span>`}</div>
      <div class="customer-food-copy"><span class="customer-category">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description || "Freshly prepared at Royal's Canteen.")}</p>
        <div class="customer-food-bottom"><strong>${money(item.price)}</strong>${quantity ? `<div class="quantity-control"><button data-action="customer-remove" data-id="${escapeHtml(item.id)}" aria-label="Remove one ${escapeHtml(item.name)}">−</button><span>${quantity}</span><button data-action="customer-add" data-id="${escapeHtml(item.id)}" aria-label="Add one ${escapeHtml(item.name)}">+</button></div>` : `<button class="button small" data-action="customer-add" data-id="${escapeHtml(item.id)}">＋ Add</button>`}</div>
      </div>
    </article>`;
  };
  const sections = categories.map((category, index) => {
    const categoryItems = items.filter((item) => item.category === category);
    if (!categoryItems.length) return "";
    return `<section class="customer-category-section">
      <div class="category-carousel-heading"><div><span class="customer-category">BROWSE BY TYPE</span><h3>${escapeHtml(category)}</h3></div><div class="carousel-controls"><button data-action="customer-slide" data-direction="-1" aria-label="Previous ${escapeHtml(category)} items">‹</button><button data-action="customer-slide" data-direction="1" aria-label="Next ${escapeHtml(category)} items">›</button></div></div>
      <div class="customer-carousel-track" id="customer-carousel-${index}" role="list" aria-label="${escapeHtml(category)} menu items">${categoryItems.map(renderItem).join("")}</div>
    </section>`;
  }).join("");
  container.innerHTML = sections || emptyState("⌕", "No dishes found", "Try another search or category.");
}

function renderCustomerCart() {
  const container = document.querySelector("#customer-cart");
  if (!container) return;
  const items = [...customerCart.entries()].map(([id, quantity]) => ({
    item: data.menu.find((entry) => entry.id === id),
    quantity
  })).filter((entry) => entry.item);
  const count = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const total = items.reduce((sum, entry) => sum + Number(entry.item.price) * entry.quantity, 0);
  container.innerHTML = `<div class="cart-heading"><div><span class="eyebrow">Your order</span><h2>Cart <span>${count}</span></h2></div><span class="cart-bag">▤</span></div>
    ${items.length ? `<div class="cart-lines">${items.map(({ item, quantity }) => `<div class="cart-line"><div><strong>${escapeHtml(item.name)}</strong><span>${money(item.price)} each</span></div><div class="quantity-control"><button data-action="customer-remove" data-id="${escapeHtml(item.id)}" aria-label="Remove one ${escapeHtml(item.name)}">−</button><span>${quantity}</span><button data-action="customer-add" data-id="${escapeHtml(item.id)}" aria-label="Add one ${escapeHtml(item.name)}">+</button></div></div>`).join("")}</div>
      <div class="cart-total"><span>Total</span><strong>${money(total)}</strong></div><button class="button cart-checkout" data-action="customer-checkout">Continue to checkout <span>→</span></button><p class="cart-note">Pay by UPI, cash or card at checkout.</p>`
      : `<div class="cart-empty"><span>＋</span><strong>Your cart is waiting</strong><p>Add something delicious from the menu.</p></div><button class="button cart-checkout" disabled>Choose your food</button>`}`;
}

function renderCustomer() {
  const categories = ["All categories", ...new Set(data.menu.map((item) => item.category))];
  const heroSlides = [
    { image: "MuttonBiryani.jpg", name: "Mutton Biryani" },
    { image: "ChickenBriyani.jpg", name: "Chicken Biryani" },
    { image: "VegThali.jpg", name: "Veg Thali" },
    { image: "MasalaDosa.jpg", name: "Masala Dosa" },
    { image: "PaneerRoll.jpg", name: "Paneer Roll" },
    { image: "Chole_Bhature.jpg", name: "Chole Bhature" },
    { image: "GulabJamun.jpg", name: "Gulab Jamun" },
    { image: "ChickenAlfredoPasta.jpg", name: "Chicken Alfredo Pasta" },
    { image: "AlooParatha.jpg", name: "Aloo Paratha" },
    { image: "ButterChicken.jpg", name: "Butter Chicken" },
    { image: "VegBriyani.jpg", name: "Veg Biryani" },
    { image: "FishCurry.jpg", name: "Fish Curry Rice" },
    { image: "EggCurry.jpg", name: "Egg Curry" },
    { image: "Chicken65.jpg", name: "Chicken 65" },
    { image: "KadaiPaneer.jpg", name: "Kadai Paneer" },
    { image: "HakkaNoodles.jpg", name: "Hakka Noodles" },
    { image: "FreshFruitBowl.jpg", name: "Fresh Fruit Bowl" },
    { image: "FishBiryani.jpg", name: "Fish Biryani" },
    { image: "ChilliPrawns.jpg", name: "Chilli Prawns" },
    { image: "VegBurger.jpg", name: "Veg Burger" }
  ];
  activeHeroSlide = 0;
  return `<div class="customer-site">
    <header class="customer-header"><a class="brand" href="customer.html" aria-label="Royal's Canteen home"><span class="brand-mark">R<span>.</span></span><span class="brand-name">Royal's<span> Canteen</span></span></a><div class="customer-header-actions"><span class="customer-open"><i></i> Open now</span></div></header>
    <section class="customer-hero"><div><span class="hero-kicker">FRESHLY MADE · READY FOR YOU</span><h1>Your next favorite<br>meal is right here.</h1><p>Good food, made fresh at Royal's Canteen. Pick your favorites and order in a few taps.</p><a href="#customer-menu" class="hero-link">Explore the menu <span>↓</span></a><div class="mobile-hero-controls"><button data-action="hero-slide" data-direction="-1" aria-label="Previous featured dish">‹</button><span id="mobile-hero-slide-name">Mutton Biryani</span><button data-action="hero-slide" data-direction="1" aria-label="Next featured dish">›</button></div></div><div class="hero-art" aria-label="Featured dishes">
      <div class="hero-orbit"></div><div class="hero-slides" aria-live="polite">${heroSlides.map((slide, index) => `<img class="hero-slide${index === 0 ? " active" : ""}" src="${slide.image}" alt="${escapeHtml(slide.name)}" aria-hidden="${index === 0 ? "false" : "true"}">`).join("")}</div>
      <button class="hero-slide-control previous" data-action="hero-slide" data-direction="-1" aria-label="Previous featured dish">‹</button><button class="hero-slide-control next" data-action="hero-slide" data-direction="1" aria-label="Next featured dish">›</button>
      <div class="hero-slide-dots" aria-label="Choose a featured dish">${heroSlides.map((slide, index) => `<button class="hero-slide-dot${index === 0 ? " active" : ""}" data-action="hero-slide-to" data-index="${index}" aria-label="Show ${escapeHtml(slide.name)}" aria-pressed="${index === 0}"></button>`).join("")}</div>
      <small>MADE WITH CARE</small></div></section>
    <main class="customer-main" id="customer-menu"><section class="customer-menu-section"><div class="customer-menu-heading"><div><span class="eyebrow">MADE FRESH TODAY</span><h2>Explore our menu</h2><p>Find something delicious for every craving.</p></div><span class="menu-count">${data.menu.length} items</span></div>
      <div class="customer-toolbar"><label class="search-box"><span>⌕</span><input id="customer-search" value="${escapeHtml(customerSearch)}" placeholder="Search dishes..." aria-label="Search dishes"></label><select class="select-control" id="customer-category" aria-label="Filter menu category">${categories.map((category) => `<option${customerCategory === category ? " selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select></div>
      <div class="customer-menu-grid" id="customer-menu-grid"></div>
    </section><aside class="customer-cart" id="customer-cart" aria-live="polite"></aside></main>
    <footer class="customer-footer"><span>Royal's Canteen</span><span>Fresh food, made with care.</span></footer>
  </div>`;
}

function renderInventory() {
  const rows = data.inventory.map((item) => {
    const low = Number(item.stock) <= Number(item.minimum);
    return `<tr><td class="cell-strong">${escapeHtml(item.name)}<span class="cell-sub">${escapeHtml(item.category)}</span></td><td>${escapeHtml(item.stock)} ${escapeHtml(item.unit)}</td><td>${hasCost(item.unitCost) ? `${money(item.unitCost)} / ${escapeHtml(item.unit)}` : "Not set"}</td><td>${escapeHtml(item.minimum)} ${escapeHtml(item.unit)}</td><td>${low ? `<span class="badge cancelled">Low stock</span>` : `<span class="badge completed">In stock</span>`}</td><td><button class="button secondary small" data-action="restock" data-id="${escapeHtml(item.id)}">＋ Restock</button></td></tr>`;
  }).join("");
  return `${heading("Inventory", "Starter ingredients for your menu. Update stock and costs to match your kitchen.", `<button class="button" data-action="new-inventory-item">＋ Add ingredient</button>`)}
    <section class="data-panel">${rows ? `<div class="table-wrap"><table><thead><tr><th>Ingredient</th><th>Current stock</th><th>Unit purchase cost</th><th>Low-stock alert</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("▧", "No ingredients tracked", "Add ingredients to start tracking stock.")}</section>`;
}

function renderReports() {
  const financials = getTodayFinancials();
  const orders = getTodayOrders().filter((order) => order.status !== "Cancelled");
  const revenue = financials.revenue;
  const unitsSold = orders.reduce((sum, order) => sum + getOrderItems(order)
    .reduce((itemSum, item) => itemSum + Number(item.qty), 0), 0);
  const paymentTotal = (method) => orders.filter((order) => order.payment === method).reduce((sum, order) => sum + Number(order.total), 0);
  const salesByItem = new Map();
  orders.forEach((order) => {
    getOrderItems(order).forEach((orderItem) => {
      const sale = salesByItem.get(orderItem.name) || {
        name: orderItem.name, qty: 0, revenue: 0, costOfGoods: 0, costKnown: true
      };
      sale.qty += Number(orderItem.qty);
      sale.revenue += Number(orderItem.unitPrice) * Number(orderItem.qty);
      if (hasCost(orderItem.unitCost)) {
        sale.costOfGoods += Number(orderItem.unitCost) * Number(orderItem.qty);
      } else {
        sale.costKnown = false;
      }
      salesByItem.set(orderItem.name, sale);
    });
  });
  const sales = [...salesByItem.values()].map((sale) => ({
    ...sale,
    emoji: data.menu.find((item) => item.name === sale.name)?.emoji || "🍽️"
  })).sort((a, b) => b.qty - a.qty);
  const purchases = (data.purchases || []).filter((purchase) => purchase.day === todayKey());
  const purchaseRows = [...purchases].reverse().map((purchase) => `<tr><td class="cell-strong">${escapeHtml(purchase.name)}</td><td>${escapeHtml(purchase.quantity)} ${escapeHtml(purchase.unit)}</td><td>${money(purchase.unitCost)} / ${escapeHtml(purchase.unit)}</td><td>${escapeHtml(purchase.time)}</td><td class="cell-strong">${money(purchase.total)}</td></tr>`).join("");
  return `${heading("Sales & reports", "A quick look at today's canteen performance.")}
    <div class="report-summary">
      <article class="report-card"><span>Today's sales</span><strong>${money(revenue)}</strong><small>From ${orders.length} completed and active orders</small></article>
      <article class="report-card"><span>Today's stock purchases</span><strong>${money(financials.purchaseSpend)}</strong><small>Across ${purchases.length} stock purchases</small></article>
      <article class="report-card"><span>Cost of items sold</span><strong>${money(financials.costOfGoods)}</strong><small>Based on each menu item's prep cost</small></article>
      <article class="report-card profit-card"><span>Today's gross profit</span><strong>${financials.grossProfit === null ? "—" : money(financials.grossProfit)}</strong><small>${financials.unknownCostOrders ? `Missing cost on ${financials.unknownCostOrders} order(s)` : "Sales minus preparation costs"}</small></article>
      <article class="report-card"><span>Sales less stock purchases</span><strong>${money(revenue - financials.purchaseSpend)}</strong><small>Today's recorded sales minus inventory buys</small></article>
      <article class="report-card"><span>Items sold</span><strong>${unitsSold}</strong><small>Across ${sales.length} menu items</small></article>
      <article class="report-card"><span>Average order value</span><strong>${money(orders.length ? Math.round(revenue / orders.length) : 0)}</strong><small>Based on today's orders</small></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><h2>Sales by menu item</h2><span class="category-tag">Today</span></div>
        ${sales.length ? `<div class="table-wrap"><table class="report-table"><thead><tr><th>Item</th><th>Units sold</th><th>Sales</th><th>Prep cost</th><th>Profit</th></tr></thead><tbody>${sales.map((item) => `<tr><td class="cell-strong">${escapeHtml(item.emoji)} &nbsp;${escapeHtml(item.name)}</td><td>${item.qty}</td><td>${money(item.revenue)}</td><td>${item.costKnown ? money(item.costOfGoods) : "—"}</td><td class="cell-strong">${item.costKnown ? money(item.revenue - item.costOfGoods) : "—"}</td></tr>`).join("")}</tbody></table></div>` : emptyState("↗", "No sales yet", "Sales will appear once orders are placed.")}
      </section>
      <section class="panel"><div class="panel-header"><h2>Payment breakdown</h2><span class="category-tag">Today</span></div>
        <div class="popular-list"><div class="popular-item"><span class="food-emoji">📱</span><div><div class="popular-name">UPI</div><div class="popular-meta">${orders.filter((order) => order.payment === "UPI").length} orders</div></div><span class="popular-sales">${money(paymentTotal("UPI"))}</span></div><div class="popular-item"><span class="food-emoji">💵</span><div><div class="popular-name">Cash</div><div class="popular-meta">${orders.filter((order) => order.payment === "Cash").length} orders</div></div><span class="popular-sales">${money(paymentTotal("Cash"))}</span></div><div class="popular-item"><span class="food-emoji">💳</span><div><div class="popular-name">Card</div><div class="popular-meta">${orders.filter((order) => order.payment === "Card").length} orders</div></div><span class="popular-sales">${money(paymentTotal("Card"))}</span></div></div>
      </section>
    </div>
    <section class="panel purchase-panel"><div class="panel-header"><h2>Stock purchases today</h2><span class="category-tag">Total ${money(financials.purchaseSpend)}</span></div>
      ${purchaseRows ? `<div class="table-wrap"><table><thead><tr><th>Ingredient</th><th>Quantity</th><th>Cost per unit</th><th>Time</th><th>Total spent</th></tr></thead><tbody>${purchaseRows}</tbody></table></div>` : emptyState("▧", "No stock purchases today", "Restock inventory to record purchase costs here.")}
    </section>
    <p class="report-note">Gross profit is sales minus the recorded cost to prepare items sold. Stock purchases are tracked separately and may include ingredients still in inventory.</p>`;
}

function renderPage() {
  const renderers = { customer: renderCustomer, overview: renderOverview, orders: renderOrders, menu: renderMenu, inventory: renderInventory, reports: renderReports };
  pageContent.innerHTML = renderers[activePage]();
  document.querySelector(".app-shell").classList.toggle("customer-mode", activePage === "customer");
  document.querySelector("#breadcrumb-page").textContent = PAGE_TITLES[activePage];
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === activePage);
  });
  document.querySelector("#nav-order-count").textContent = data.orders.filter((order) => ["Preparing", "Ready"].includes(order.status)).length;
  if (activePage === "customer") {
    startHeroSlideShow();
    renderCustomerCards();
    renderCustomerCart();
    document.querySelector("#customer-search").addEventListener("input", (event) => {
      customerSearch = event.currentTarget.value;
      renderCustomerCards();
    });
    document.querySelector("#customer-category").addEventListener("change", (event) => {
      customerCategory = event.currentTarget.value;
      renderCustomerCards();
    });
  }
  if (activePage === "orders") {
    renderOrdersTable();
    document.querySelector("#order-search").addEventListener("input", renderOrdersTable);
    document.querySelector("#order-status").addEventListener("change", renderOrdersTable);
  }
  if (activePage !== "customer") clearInterval(heroSlideTimer);
}

function showHeroSlide(index) {
  const slides = [...document.querySelectorAll(".hero-slide")];
  if (!slides.length) return;
  activeHeroSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeHeroSlide;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  document.querySelectorAll(".hero-slide-dot").forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeHeroSlide;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
  const mobileSlideName = document.querySelector("#mobile-hero-slide-name");
  if (mobileSlideName) mobileSlideName.textContent = slides[activeHeroSlide].alt;
}

function startHeroSlideShow() {
  clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => showHeroSlide(activeHeroSlide + 1), 4500);
}

function customerCheckoutModal() {
  if (!customerCart.size) return;
  const items = [...customerCart.entries()].map(([id, qty]) => {
    const item = data.menu.find((entry) => entry.id === id);
    return item ? { name: item.name, qty, unitPrice: Number(item.price), unitCost: hasCost(item.costPerServing) ? Number(item.costPerServing) : null } : null;
  }).filter(Boolean);
  if (!items.length) {
    showToast("Your cart is empty. Add an item before checking out.");
    return;
  }
  openModal("Complete your order", "Enter your name and choose how you'd like to pay.", `
    <div class="field"><label for="customer-name">Your name</label><input id="customer-name" name="customer" required maxlength="60" placeholder="e.g. Ananya Shah"></div>
    <div class="field"><label for="customer-payment">Payment method</label><select id="customer-payment" name="payment"><option>UPI</option><option>Cash</option><option>Card</option></select></div>
    <div class="checkout-summary"><span>${items.reduce((sum, item) => sum + item.qty, 0)} item(s)</span><strong>${money(items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0))}</strong></div>`, "Place order", (formData) => {
      const customer = String(formData.get("customer")).trim();
      if (!customer) return false;
      const now = new Date();
      const nextId = String(Math.max(1000, ...data.orders.map((order) => Number(order.id) || 0)) + 1);
      data.orders.unshift({
        id: nextId, customer, items,
        total: items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
        status: "Preparing", time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        payment: String(formData.get("payment")), day: todayKey()
      });
      if (!saveData()) {
        data.orders.shift();
        return false;
      }
      customerCart.clear();
      renderPage();
      showToast(`Order #${nextId} placed successfully.`);
      return true;
    });
}

function openModal(title, subtitle, fields, submitLabel, onSubmit, modalClass = "") {
  modal.className = `modal ${modalClass}`.trim();
  modal.innerHTML = `<div class="modal-header"><div><h2 id="modal-title">${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close dialog">×</button></div><form id="modal-form"><div class="form-grid">${fields}</div><div class="modal-footer"><button class="button secondary" type="button" data-action="close-modal">Cancel</button><button class="button" type="submit">${escapeHtml(submitLabel)}</button></div></form>`;
  modalBackdrop.hidden = false;
  const firstInput = modal.querySelector("input, select");
  if (firstInput) firstInput.focus();
  modal.querySelector("#modal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (onSubmit(formData)) closeModal();
  });
}

function closeModal() {
  modalBackdrop.hidden = true;
  modal.innerHTML = "";
  modal.className = "modal";
}

function updateOrderEstimate() {
  const estimate = modal.querySelector("#order-estimate");
  if (!estimate) return;
  const total = [...modal.querySelectorAll("[data-order-line]")].reduce((sum, row) => {
    const item = data.menu.find((entry) => entry.id === row.querySelector('[name="item"]').value);
    const quantity = Number(row.querySelector('[name="qty"]').value);
    return item && Number.isFinite(quantity) && quantity > 0
      ? sum + item.price * quantity
      : sum;
  }, 0);
  estimate.textContent = money(total);
}

function addPurchase(item, quantity, unitCost) {
  const now = new Date();
  data.purchases.push({
    id: `p${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: item.name,
    quantity,
    unit: item.unit,
    unitCost,
    total: quantity * unitCost,
    day: todayKey(),
    time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  });
}

function newOrderModal() {
  if (!data.menu.length) {
    showToast("Add a menu item before creating an order.");
    return;
  }
  const options = data.menu.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} — ${money(item.price)}${hasCost(item.costPerServing) ? ` (cost ${money(item.costPerServing)})` : " (cost not set)"}</option>`).join("");
  const lineRow = (index) => `<div class="order-line" data-order-line><div class="field"><label for="order-item-${index}">Menu item</label><select id="order-item-${index}" name="item" required>${options}</select></div><div class="field"><label for="order-qty-${index}">Quantity</label><input id="order-qty-${index}" name="qty" type="number" min="1" max="99" value="1" required></div><button class="icon-button order-remove" type="button" data-action="remove-order-item" aria-label="Remove item" title="Remove item">×</button></div>`;
  openModal("Create a new order", "Add multiple dishes and set a quantity for each.", `
    <div class="field"><label for="customer">Customer name</label><input id="customer" name="customer" required maxlength="60" placeholder="e.g. Ananya Shah"></div>
    <div class="order-items" id="order-items">${lineRow(1)}</div>
    <div class="order-controls"><button class="button secondary small" type="button" data-action="add-order-item">＋ Add another item</button><strong>Order total: <span id="order-estimate">${money(data.menu[0].price)}</span></strong></div>
    <div class="field"><label for="payment">Payment method</label><select id="payment" name="payment"><option>UPI</option><option>Cash</option><option>Card</option></select></div>`, "Place order", (formData) => {
      const itemIds = formData.getAll("item");
      const quantities = formData.getAll("qty");
      const items = itemIds.map((itemId, index) => {
        const menuItem = data.menu.find((entry) => entry.id === itemId);
        const quantity = Number(quantities[index]);
        if (!menuItem || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;
        return {
          name: menuItem.name,
          qty: quantity,
          unitPrice: Number(menuItem.price),
          unitCost: hasCost(menuItem.costPerServing) ? Number(menuItem.costPerServing) : null
        };
      });
      if (!items.length || items.some((item) => item === null)) {
        showToast("Check each selected item and its quantity.");
        return false;
      }
      const now = new Date();
      const nextId = String(Math.max(1000, ...data.orders.map((order) => Number(order.id) || 0)) + 1);
      data.orders.unshift({
        id: nextId,
        customer: String(formData.get("customer")).trim(),
        items,
        total: items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
        status: "Preparing", time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        payment: String(formData.get("payment")), day: todayKey()
      });
      if (!saveData()) {
        data.orders.shift();
        return false;
      }
      renderPage();
      showToast(`Order #${nextId} placed successfully.`);
      return true;
    }, "order-modal");
  modal.addEventListener("input", updateOrderEstimate);
  modal.addEventListener("change", updateOrderEstimate);
}

function addOrderItemRow() {
  const container = modal.querySelector("#order-items");
  if (!container) return;
  const index = container.querySelectorAll("[data-order-line]").length + 1;
  const options = data.menu.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} — ${money(item.price)}${hasCost(item.costPerServing) ? ` (cost ${money(item.costPerServing)})` : " (cost not set)"}</option>`).join("");
  container.insertAdjacentHTML("beforeend", `<div class="order-line" data-order-line><div class="field"><label for="order-item-${index}">Menu item</label><select id="order-item-${index}" name="item" required>${options}</select></div><div class="field"><label for="order-qty-${index}">Quantity</label><input id="order-qty-${index}" name="qty" type="number" min="1" max="99" value="1" required></div><button class="icon-button order-remove" type="button" data-action="remove-order-item" aria-label="Remove item" title="Remove item">×</button></div>`);
  updateOrderEstimate();
}

function newMenuItemModal() {
  openModal("Add a menu item", "Add a dish or drink to your canteen menu.", `
    <div class="field"><label for="item-name">Item name</label><input id="item-name" name="name" required maxlength="50" placeholder="e.g. Vegetable Pulao"></div>
    <div class="form-row"><div class="field"><label for="item-price">Selling price (₹)</label><input id="item-price" name="price" type="number" min="1" max="100000" required placeholder="80"></div><div class="field"><label for="item-cost">Cost to prepare (₹)</label><input id="item-cost" name="costPerServing" type="number" min="0" max="100000" step="0.01" required placeholder="35"></div></div>
    <div class="field"><label for="item-category">Category</label><select id="item-category" name="category"><option>Breakfast</option><option>Meals</option><option>Non-Veg</option><option>Snacks</option><option>Drinks</option><option>Desserts</option></select></div>
    <div class="field"><label for="item-description">Description</label><input id="item-description" name="description" maxlength="100" placeholder="A short description (optional)"></div>`, "Add to menu", (formData) => {
      const name = String(formData.get("name")).trim();
      if (!name) return false;
      data.menu.push({
        id: `m${Date.now()}`, name, price: Number(formData.get("price")),
        costPerServing: Number(formData.get("costPerServing")),
        category: String(formData.get("category")), emoji: "🍽️",
        description: String(formData.get("description")).trim()
      });
      if (!saveData()) {
        data.menu.pop();
        return false;
      }
      renderPage();
      showToast(`${name} added to the menu.`);
      return true;
    });
}

function editMenuItemModal(id) {
  const item = data.menu.find((entry) => entry.id === id);
  if (!item) return;
  const categories = ["Breakfast", "Meals", "Non-Veg", "Snacks", "Drinks", "Desserts"];
  openModal("Edit menu item", "Update the selling price and preparation cost.", `
    <div class="field"><label for="item-name">Item name</label><input id="item-name" name="name" required maxlength="50" value="${escapeHtml(item.name)}"></div>
    <div class="form-row"><div class="field"><label for="item-price">Selling price (₹)</label><input id="item-price" name="price" type="number" min="1" max="100000" required value="${escapeHtml(item.price)}"></div><div class="field"><label for="item-cost">Cost to prepare (₹)</label><input id="item-cost" name="costPerServing" type="number" min="0" max="100000" step="0.01" required value="${hasCost(item.costPerServing) ? escapeHtml(item.costPerServing) : ""}" placeholder="Enter cost"></div></div>
    <div class="field"><label for="item-category">Category</label><select id="item-category" name="category">${categories.map((category) => `<option${item.category === category ? " selected" : ""}>${category}</option>`).join("")}</select></div>
    <div class="field"><label for="item-description">Description</label><input id="item-description" name="description" maxlength="100" value="${escapeHtml(item.description || "")}"></div>`, "Save changes", (formData) => {
      const previous = { ...item };
      item.name = String(formData.get("name")).trim();
      item.price = Number(formData.get("price"));
      item.costPerServing = Number(formData.get("costPerServing"));
      item.category = String(formData.get("category"));
      item.description = String(formData.get("description")).trim();
      if (!saveData()) {
        Object.assign(item, previous);
        return false;
      }
      renderPage();
      showToast(`${item.name} updated.`);
      return true;
    });
}

function newInventoryModal() {
  openModal("Add an ingredient", "Start tracking an ingredient in your stock.", `
    <div class="field"><label for="ingredient-name">Ingredient name</label><input id="ingredient-name" name="name" required maxlength="50" placeholder="e.g. Tomatoes"></div>
    <div class="form-row"><div class="field"><label for="ingredient-stock">Starting stock</label><input id="ingredient-stock" name="stock" type="number" min="0" step="0.1" required value="0"></div><div class="field"><label for="ingredient-unit">Unit</label><select id="ingredient-unit" name="unit"><option>kg</option><option>L</option><option>pcs</option><option>pack</option></select></div></div>
    <div class="field"><label for="ingredient-cost">Purchase cost per unit (₹)</label><input id="ingredient-cost" name="unitCost" type="number" min="0.01" max="100000" step="0.01" required placeholder="e.g. 40"></div>
    <div class="form-row"><div class="field"><label for="ingredient-minimum">Low-stock alert at</label><input id="ingredient-minimum" name="minimum" type="number" min="0" step="0.1" required value="5"></div><div class="field"><label for="ingredient-category">Category</label><select id="ingredient-category" name="category"><option>Produce</option><option>Grains</option><option>Dairy</option><option>Meat &amp; seafood</option><option>Bakery</option><option>Essentials</option><option>Beverages</option><option>Other</option></select></div></div>`, "Add ingredient", (formData) => {
      const name = String(formData.get("name")).trim();
      if (!name) return false;
      const item = {
        id: `i${Date.now()}`, name, stock: Number(formData.get("stock")),
        unit: String(formData.get("unit")), minimum: Number(formData.get("minimum")),
        unitCost: Number(formData.get("unitCost")),
        category: String(formData.get("category"))
      };
      data.inventory.push(item);
      if (item.stock > 0) addPurchase(item, item.stock, item.unitCost);
      if (!saveData()) {
        data.inventory.pop();
        if (item.stock > 0) data.purchases.pop();
        return false;
      }
      renderPage();
      showToast(`${name} added to inventory.`);
      return true;
    });
}

function restockModal(id) {
  const item = data.inventory.find((entry) => entry.id === id);
  if (!item) return;
  openModal(`Restock ${item.name}`, `Current stock: ${item.stock} ${item.unit}.`, `
    <div class="field"><label for="restock-quantity">Quantity to add (${escapeHtml(item.unit)})</label><input id="restock-quantity" name="quantity" type="number" min="0.1" step="0.1" required placeholder="Enter quantity"></div>
    <div class="field"><label for="restock-unit-cost">Purchase cost per ${escapeHtml(item.unit)} (₹)</label><input id="restock-unit-cost" name="unitCost" type="number" min="0.01" max="100000" step="0.01" required value="${hasCost(item.unitCost) ? escapeHtml(item.unitCost) : ""}" placeholder="Enter purchase cost"></div>`, "Record purchase", (formData) => {
      const quantity = Number(formData.get("quantity"));
      const unitCost = Number(formData.get("unitCost"));
      if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitCost) || unitCost <= 0) return false;
      const previousStock = Number(item.stock);
      const previousCost = item.unitCost;
      item.stock = Number(item.stock) + quantity;
      item.unitCost = unitCost;
      addPurchase(item, quantity, unitCost);
      if (!saveData()) {
        item.stock = previousStock;
        item.unitCost = previousCost;
        data.purchases.pop();
        return false;
      }
      renderPage();
      showToast(`${item.name} stock updated.`);
      return true;
    });
}

document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    setPage(pageButton.dataset.page);
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  if (action === "hero-slide") {
    showHeroSlide(activeHeroSlide + Number(actionButton.dataset.direction));
    startHeroSlideShow();
  }
  if (action === "hero-slide-to") {
    showHeroSlide(Number(actionButton.dataset.index));
    startHeroSlideShow();
  }
  if (action === "customer-slide") {
    const track = actionButton.closest(".customer-category-section")?.querySelector(".customer-carousel-track");
    if (track) track.scrollBy({
      left: track.clientWidth * Number(actionButton.dataset.direction),
      behavior: "smooth"
    });
  }
  if (action === "customer-add") {
    const quantity = customerCart.get(id) || 0;
    if (quantity >= 99) {
      showToast("You can add up to 99 of each item.");
      return;
    }
    customerCart.set(id, quantity + 1);
    renderCustomerCards();
    renderCustomerCart();
  }
  if (action === "customer-remove") {
    const quantity = customerCart.get(id) || 0;
    if (quantity <= 1) customerCart.delete(id);
    else customerCart.set(id, quantity - 1);
    renderCustomerCards();
    renderCustomerCart();
  }
  if (action === "customer-checkout") customerCheckoutModal();
  if (action === "new-order") newOrderModal();
  if (action === "add-order-item") addOrderItemRow();
  if (action === "remove-order-item") {
    const row = actionButton.closest("[data-order-line]");
    const container = modal.querySelector("#order-items");
    if (row && container.querySelectorAll("[data-order-line]").length > 1) {
      row.remove();
      updateOrderEstimate();
    } else {
      showToast("An order needs at least one item.");
    }
  }
  if (action === "new-menu-item") newMenuItemModal();
  if (action === "edit-menu") editMenuItemModal(id);
  if (action === "new-inventory-item") newInventoryModal();
  if (action === "close-modal") closeModal();
  if (action === "restock") restockModal(id);
  if (action === "advance-order") {
    const order = data.orders.find((entry) => entry.id === id);
    if (!order) return;
    order.status = order.status === "Preparing" ? "Ready" : order.status === "Ready" ? "Completed" : order.status;
    if (saveData()) {
      renderPage();
      showToast(`Order #${order.id} marked ${order.status.toLowerCase()}.`);
    }
  }
  if (action === "delete-menu") {
    const item = data.menu.find((entry) => entry.id === id);
    if (!item) return;
    if (data.orders.some((order) =>
      order.status !== "Cancelled" && getOrderItems(order).some((orderItem) => orderItem.name === item.name)
    )) {
      showToast("This item has order history and can't be removed.");
      return;
    }
    data.menu = data.menu.filter((entry) => entry.id !== id);
    if (saveData()) {
      renderPage();
      showToast(`${item.name} removed from the menu.`);
    }
  }
});

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeModal();
});
document.querySelector("#mobile-menu").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.toggle("open");
});
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en-IN", {
  weekday: "short", day: "numeric", month: "short", year: "numeric"
}).format(new Date());

renderPage();
loadServerData();
