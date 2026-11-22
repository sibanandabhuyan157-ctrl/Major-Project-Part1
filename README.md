# CanteenOS â€” Royal's Canteen (Major Project Part 1 + Connected User Web)

**Live Public Websites (GitHub Pages):**
- **Admin Dashboard:** [https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/](https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/)
- **Admin Notifications Page:** [https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/notifications.html](https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/notifications.html)
- **User Web (Student Ordering Portal):** [https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/user/](https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/user/) (also `/user/index1.html`)
- **Royal Canteen (Admin & Customer Site):** [https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/royal-canteen/](https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/royal-canteen/) · [Customer Site](https://sibanandabhuyan157-ctrl.github.io/Major-Project-Part1/royal-canteen/customer.html)

## Connected Architecture (Database + Java + PHP + JS)

`Major Project Part 1` (Admin Dashboard & Notifications Page) and `User Web` (Student Ordering Portal) share the same backend API and database:

- **Separate Databases (SQLite / Java JSON):**
  - `database/schema.sql` (`canteen.sqlite`) â€” Menu, active orders, inventory, purchases, notifications
  - `database/users-schema.sql` (`users.sqlite` / `users-db.json`) â€” Separate **User Details Database** with hashed passwords + `admin_users_view` so the Administrator can view student details **without password access**
  - `database/order-history-schema.sql` (`order-history.sqlite` / `order-history-db.json`) â€” Separate **Order History Database** saving every confirmed order and its status history
- **PHP + SQLite Backend:** `api.php` & `router.php` (plus `../User Web/api.php` & `../User Web/router.php`)
- **Java Backend:** `CanteenServer.java` (plus `../User Web/UserWebServer.java`)
- **Frontend JS:** `app.js`, `notifications.js`, and `../User Web/user-app.js`

### End-to-End Order & Notification Flow
1. A student places and confirms an order in **User Web** (`index1.html`).
2. The full **Order Receipt** is saved to the shared database and appears immediately in **Major Project Part 1 â†’ Notifications** (`notifications.html` or the **Notifications** sidebar tab in `index.html`) and **Orders**.
3. When the Administrator clicks **Ready**, then **Completed**, the student's **Bell Icon** in `User Web/index1.html` lights up with the alert: **"The delivery coming near to the user"**.

---

## Run with the Java Backend (Recommended â€” Zero Extra Dependencies)

Open a terminal in `Major Project Part 1` and run:

```powershell
javac CanteenServer.java
java CanteenServer
```

Then open in your browser:
- **Admin Dashboard:** [http://127.0.0.1:8081/](http://127.0.0.1:8081/)
- **Admin Notifications Page:** [http://127.0.0.1:8081/notifications.html](http://127.0.0.1:8081/notifications.html)
- **Connected User Web (Student Portal):** [http://127.0.0.1:8081/user/index1.html](http://127.0.0.1:8081/user/index1.html)

*(Optional: you can also run `UserWebServer.java` inside `User Web` on port `8082`; both Java servers share the same data files on disk.)*

---

## Run with the PHP and SQLite Backend

Install PHP 8.1+ with PDO SQLite enabled, open a terminal in `Major Project Part 1`, and run:

```powershell
php -S 127.0.0.1:8000 router.php
```

Then open in your browser:
- **Admin Dashboard:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Admin Notifications Page:** [http://127.0.0.1:8000/notifications.html](http://127.0.0.1:8000/notifications.html)
- **Connected User Web (Student Portal):** [http://127.0.0.1:8000/user/index1.html](http://127.0.0.1:8000/user/index1.html)

The PHP API stores menu items, orders, inventory, purchases, students, admin receipt notifications, and user bell notifications in `database/canteen.sqlite` using `database/schema.sql`.
