# CanteenOS-Canteen-Management

The project aims to improve the canteen ordering experience, organize daily management tasks, and help staff keep track of orders, stock, and sales in one system.

## Run with the PHP and SQLite backend

Install PHP 8.1 or later with the PDO SQLite extension enabled, open a terminal in this project folder, and run:

```powershell
php -S 127.0.0.1:8000 router.php
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser. Keep the terminal open while using the app; press `Ctrl+C` to stop the server.

The PHP API stores menu items, orders, inventory, purchases, and app settings in `database/canteen.sqlite`, using the schema in `database/schema.sql`. The database and tables are created automatically when the app is first used.

The administrator dashboard opens at `index.html`. In **Menu → Category availability**, enable or disable Breakfast, Meals, Snacks, and Desserts and set each category's daily service hours. The customer menu hides categories outside their enabled time windows; overnight hours are supported, and identical start/end times mean all-day availability. When customers choose UPI at checkout, the canteen's QR code is displayed.

The separate customer ordering site is available at `customer.html` (or `https://<username>.github.io/<repository>/customer.html` on GitHub Pages). The **Customer site** dashboard link opens it in a new tab. Customers can browse category-based, horizontally sliding menu rows, filter the menu, add dishes to their cart, and place orders. The customer site does not display a link to the admin dashboard. Menu photos are matched to the provided JPG files by dish name.

## Run with the Java backend

Install a JDK, open a terminal in this project folder, and run:

```powershell
javac -d out CanteenServer.java
java -cp out CanteenServer
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser. Keep the terminal open while using the app; press `Ctrl+C` to stop the server.

The Java server serves the existing HTML, CSS, and JavaScript files. The app continues to use browser storage and also syncs its data with the server, which saves it in `canteen-data.json` in this folder.

Use either backend at a time. Opening `index.html` directly still works, but server persistence is only available when the app is opened through a backend.

## Publish a public demo with GitHub Pages

The GitHub Actions workflow publishes `index.html`, `app.js`, `styles.css`, and the JPG menu photos. The Pages demo is static: each visitor's changes are saved in that visitor's browser and are not shared with other visitors. The sample order names are anonymized, and the saved `canteen-data.json` file is excluded from Git.

To publish, push this project to a GitHub repository, then open **Settings → Pages** and set the build and deployment source to **GitHub Actions**. The workflow deploys the site on pushes to `main` or `master`; its public URL will appear in the Pages settings when deployment finishes.
