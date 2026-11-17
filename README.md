# CanteenOS

## Run with the PHP and SQLite backend

Install PHP 8.1 or later with the PDO SQLite extension enabled, open a terminal in this project folder, and run:

```powershell
php -S 127.0.0.1:8000 router.php
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser. Keep the terminal open while using the app; press `Ctrl+C` to stop the server.

The PHP API stores menu items, orders, inventory, purchases, and app settings in `database/canteen.sqlite`, using the schema in `database/schema.sql`. The database and tables are created automatically when the app is first used.

## Run with the Java backend

Install a JDK, open a terminal in this project folder, and run:

```powershell
javac -d out CanteenServer.java
java -cp out CanteenServer
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser. Keep the terminal open while using the app; press `Ctrl+C` to stop the server.

The Java server serves the existing HTML, CSS, and JavaScript files. The app continues to use browser storage and also syncs its data with the server, which saves it in `canteen-data.json` in this folder.

Use either backend at a time. Opening `index.html` directly still works, but server persistence is only available when the app is opened through a backend.
