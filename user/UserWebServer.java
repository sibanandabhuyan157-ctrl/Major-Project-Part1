import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * UserWebServer — Java HTTP Server for the Royal's Canteen Student Ordering Portal (User Web).
 * Shares the exact same data files inside ../Major Project Part 1/ so orders placed here
 * appear instantly in the Admin Dashboard & Notifications page, and status updates
 * (Ready -> Completed -> "The delivery coming near to the user") sync back to the bell icon.
 */
public class UserWebServer {
    private static final int DEFAULT_PORT = 8082;
    private static final int MAX_BODY_BYTES = 2 * 1024 * 1024;
    private static final Object LOCK = new Object();

    private static Path userWebDir;
    private static Path adminDir;
    private static Path dataFile;
    private static Path notifStoreFile;

    public static void main(String[] args) throws IOException {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {
                port = DEFAULT_PORT;
            }
        }

        Path cwd = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        if (Files.isRegularFile(cwd.resolve("index1.html"))) {
            userWebDir = cwd;
            adminDir = cwd.getParent().resolve("Major Project Part 1").normalize();
        } else if (Files.isDirectory(cwd.resolve("User Web"))) {
            userWebDir = cwd.resolve("User Web").normalize();
            adminDir = cwd.resolve("Major Project Part 1").normalize();
        } else {
            userWebDir = cwd;
            adminDir = cwd.getParent().resolve("Major Project Part 1").normalize();
        }

        dataFile = adminDir.resolve("canteen-data.json");
        notifStoreFile = adminDir.resolve("database").resolve("notifications-store.json");
        ensureNotifStoreInitialized();

        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.createContext("/api/", UserWebServer::handleApi);
        server.createContext("/", UserWebServer::serveStaticFile);
        server.start();

        System.out.println("Royal's Canteen Student Portal (User Web) Java Server is running:");
        System.out.println("  Student Portal    : http://127.0.0.1:" + port + "/index1.html");
        System.out.println("  Connected Admin   : http://127.0.0.1:" + port + "/admin/index.html");
        System.out.println("  Admin Alerts Page : http://127.0.0.1:" + port + "/admin/notifications.html");
        System.out.println("  Shared Data File  : " + dataFile);
        System.out.println("  Notifications DB  : " + notifStoreFile);
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void handleApi(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if ("/api/notifications".equals(path) && "GET".equals(method)) {
                handleGetNotifications(exchange);
                return;
            }
            if ("/api/orders/user".equals(path) && "POST".equals(method)) {
                handleCreateUserOrder(exchange);
                return;
            }
            if ("/api/orders/status".equals(path) && ("POST".equals(method) || "PUT".equals(method))) {
                handleUpdateOrderStatus(exchange);
                return;
            }
            if ("/api/notifications/read".equals(path) && "POST".equals(method)) {
                handleMarkNotificationsRead(exchange);
                return;
            }
            if ("/api/students/register".equals(path) && "POST".equals(method)) {
                handleStudentRegister(exchange);
                return;
            }
            if ("/api/students/login".equals(path) && "POST".equals(method)) {
                handleStudentLogin(exchange);
                return;
            }
            if ("/api/data".equals(path) && "GET".equals(method)) {
                synchronized (LOCK) {
                    if (!Files.exists(dataFile)) {
                        sendJson(exchange, 404, mapOf("error", "No saved data"));
                        return;
                    }
                    send(exchange, 200, "application/json; charset=utf-8", Files.readAllBytes(dataFile));
                    return;
                }
            }
            sendJson(exchange, 404, mapOf("error", "Not found"));
        } catch (IllegalArgumentException error) {
            sendJson(exchange, 400, mapOf("error", error.getMessage()));
        } catch (Exception error) {
            error.printStackTrace();
            sendJson(exchange, 500, mapOf("error", "Server error: " + error.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private static void handleGetNotifications(HttpExchange exchange) throws IOException {
        Map<String, String> query = parseQuery(exchange.getRequestURI().getRawQuery());
        String studentFilter = query.getOrDefault("student", "").trim();

        synchronized (LOCK) {
            Map<String, Object> store = readNotifStoreLocked();
            Map<String, Object> canteenData = readCanteenDataLocked();

            List<Object> adminNotifications = asList(store.get("adminNotifications"));
            List<Object> allUserNotifications = asList(store.get("userNotifications"));
            List<Object> allOrders = asList(canteenData.get("orders"));

            List<Object> filteredUserNotifs = new ArrayList<>();
            List<Object> filteredOrders = new ArrayList<>();

            if (!studentFilter.isEmpty()) {
                for (Object obj : allUserNotifications) {
                    if (obj instanceof Map) {
                        Map<String, Object> n = (Map<String, Object>) obj;
                        if (studentFilter.equalsIgnoreCase(str(n.get("studentName")))) {
                            filteredUserNotifs.add(n);
                        }
                    }
                }
                for (Object obj : allOrders) {
                    if (obj instanceof Map) {
                        Map<String, Object> o = (Map<String, Object>) obj;
                        String acc = str(o.get("studentAccountName"));
                        if (acc.isEmpty()) acc = str(o.get("customer"));
                        if (studentFilter.equalsIgnoreCase(acc)) {
                            filteredOrders.add(o);
                        }
                    }
                }
            } else {
                filteredUserNotifs = allUserNotifications;
                filteredOrders = allOrders;
            }

            Map<String, Object> res = new LinkedHashMap<>();
            res.put("adminNotifications", adminNotifications);
            res.put("userNotifications", filteredUserNotifs);
            res.put("orders", filteredOrders);
            sendJson(exchange, 200, res);
        }
    }

    @SuppressWarnings("unchecked")
    private static void handleCreateUserOrder(HttpExchange exchange) throws IOException {
        Map<String, Object> payload = readJsonObject(exchange);
        String orderId = str(payload.get("orderId")).trim();
        Map<String, Object> student = asMap(payload.get("student"));
        List<Object> items = asList(payload.get("items"));
        double total = asDouble(payload.get("total"), 0.0);

        if (orderId.isEmpty() || items.isEmpty()) {
            sendJson(exchange, 400, mapOf("error", "orderId and items are required."));
            return;
        }

        String studentName = str(payload.get("studentAccountName")).trim();
        String customerName = str(student.get("name")).trim();
        if (studentName.isEmpty()) studentName = customerName.isEmpty() ? "Campus Student" : customerName;
        if (customerName.isEmpty()) customerName = studentName;

        String regNo = str(student.get("regNo")).trim();
        String hostel = str(student.get("hostel")).trim();
        if (hostel.isEmpty()) hostel = "Boys Hostel";
        String roomNo = str(student.get("roomNo")).trim();
        String phone = str(student.get("phone")).trim();
        String fullAddress = str(student.get("fullAddress")).trim();
        if (fullAddress.isEmpty()) fullAddress = hostel + ", Room No. " + roomNo + ", College Campus";

        String paymentMethod = str(payload.get("paymentMethod")).trim();
        if (paymentMethod.isEmpty()) paymentMethod = "UPI";
        String paymentStatus = str(payload.get("paymentStatus")).trim();
        if (paymentStatus.isEmpty()) {
            paymentStatus = "UPI".equalsIgnoreCase(paymentMethod) ? "Paid via UPI" : "Cash on Delivery";
        }
        int estimatedMinutes = (int) Math.round(asDouble(payload.get("estimatedMinutes"), 6));
        String dateTime = str(payload.get("dateTime")).trim();
        String nowIso = Instant.now().toString();
        String timeStr = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
        String dayKey = LocalDate.now().toString();

        synchronized (LOCK) {
            Map<String, Object> canteenData = readCanteenDataLocked();
            Map<String, Double> menuCosts = new HashMap<>();
            for (Object mObj : asList(canteenData.get("menu"))) {
                if (mObj instanceof Map) {
                    Map<String, Object> m = (Map<String, Object>) mObj;
                    String mName = str(m.get("name")).toLowerCase(Locale.ROOT);
                    if (!mName.isEmpty() && m.get("costPerServing") instanceof Number) {
                        menuCosts.put(mName, ((Number) m.get("costPerServing")).doubleValue());
                    }
                }
            }

            List<Object> adminItems = new ArrayList<>();
            for (Object iObj : items) {
                if (iObj instanceof Map) {
                    Map<String, Object> it = (Map<String, Object>) iObj;
                    String name = str(it.get("name"));
                    int qty = Math.max(1, (int) Math.round(asDouble(it.get("qty"), 1)));
                    double unitPrice = asDouble(it.get("price"), asDouble(it.get("unitPrice"), 0));
                    double unitCost = menuCosts.getOrDefault(name.toLowerCase(Locale.ROOT), Math.round(unitPrice * 45.0) / 100.0);
                    Map<String, Object> line = new LinkedHashMap<>();
                    line.put("name", name);
                    line.put("qty", qty);
                    line.put("unitPrice", unitPrice);
                    line.put("unitCost", unitCost);
                    adminItems.add(line);
                }
            }

            Map<String, Object> studentInfo = new LinkedHashMap<>();
            studentInfo.put("name", customerName);
            studentInfo.put("regNo", regNo);
            studentInfo.put("hostel", hostel);
            studentInfo.put("roomNo", roomNo);
            studentInfo.put("phone", phone);
            studentInfo.put("fullAddress", fullAddress);

            Map<String, Object> orderRecord = new LinkedHashMap<>();
            orderRecord.put("id", orderId);
            orderRecord.put("customer", customerName);
            orderRecord.put("studentAccountName", studentName);
            orderRecord.put("items", adminItems);
            orderRecord.put("total", total);
            orderRecord.put("status", "Preparing");
            orderRecord.put("time", timeStr);
            orderRecord.put("payment", "UPI".equalsIgnoreCase(paymentMethod) ? "UPI" : "Cash");
            orderRecord.put("paymentMethod", paymentMethod);
            orderRecord.put("paymentStatus", paymentStatus);
            orderRecord.put("day", dayKey);
            orderRecord.put("source", "user-web");
            orderRecord.put("student", studentInfo);
            orderRecord.put("estimatedMinutes", estimatedMinutes);
            orderRecord.put("dateTime", dateTime.isEmpty() ? timeStr : dateTime);
            orderRecord.put("receipt", payload);

            List<Object> orders = new ArrayList<>(asList(canteenData.get("orders")));
            orders.removeIf(o -> o instanceof Map && orderId.equals(str(((Map<String, Object>) o).get("id"))));
            orders.add(0, orderRecord);
            canteenData.put("orders", orders);
            writeJsonAtomic(dataFile, canteenData);

            Map<String, Object> store = readNotifStoreLocked();
            Map<String, Object> adminNotif = new LinkedHashMap<>();
            adminNotif.put("id", "an-" + orderId + "-" + shortId());
            adminNotif.put("orderId", orderId);
            adminNotif.put("customerName", customerName);
            adminNotif.put("regNo", regNo);
            adminNotif.put("hostel", hostel);
            adminNotif.put("roomNo", roomNo);
            adminNotif.put("phone", phone);
            adminNotif.put("fullAddress", fullAddress);
            adminNotif.put("items", items);
            adminNotif.put("total", total);
            adminNotif.put("paymentMethod", paymentMethod);
            adminNotif.put("paymentStatus", paymentStatus);
            adminNotif.put("estimatedMinutes", estimatedMinutes);
            adminNotif.put("status", "Preparing");
            adminNotif.put("isRead", Boolean.FALSE);
            adminNotif.put("receipt", payload);
            adminNotif.put("createdAt", nowIso);
            adminNotif.put("updatedAt", nowIso);

            List<Object> adminNotifications = new ArrayList<>(asList(store.get("adminNotifications")));
            adminNotifications.add(0, adminNotif);
            store.put("adminNotifications", adminNotifications);

            Map<String, Object> userNotif = new LinkedHashMap<>();
            userNotif.put("id", "un-" + orderId + "-" + shortId());
            userNotif.put("orderId", orderId);
            userNotif.put("studentName", studentName);
            userNotif.put("status", "Preparing");
            userNotif.put("title", "Order Receipt Received");
            userNotif.put("message", "Order #" + orderId + " receipt sent to Royal's Canteen kitchen. Preparing your order!");
            userNotif.put("isRead", Boolean.FALSE);
            userNotif.put("createdAt", nowIso);

            List<Object> userNotifications = new ArrayList<>(asList(store.get("userNotifications")));
            userNotifications.add(0, userNotif);
            store.put("userNotifications", userNotifications);

            writeJsonAtomic(notifStoreFile, store);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("ok", Boolean.TRUE);
            response.put("order", orderRecord);
            response.put("adminNotification", adminNotif);
            response.put("userNotification", userNotif);
            sendJson(exchange, 201, response);
        }
    }

    @SuppressWarnings("unchecked")
    private static void handleUpdateOrderStatus(HttpExchange exchange) throws IOException {
        Map<String, Object> payload = readJsonObject(exchange);
        String orderId = str(payload.get("orderId")).trim();
        String status = str(payload.get("status")).trim();

        if (orderId.isEmpty() || !("Preparing".equals(status) || "Ready".equals(status)
                || "Completed".equals(status) || "Cancelled".equals(status))) {
            sendJson(exchange, 400, mapOf("error", "Valid orderId and status are required."));
            return;
        }

        String nowIso = Instant.now().toString();
        synchronized (LOCK) {
            Map<String, Object> canteenData = readCanteenDataLocked();
            String studentName = "";
            String fullAddress = "your hostel room";

            for (Object oObj : asList(canteenData.get("orders"))) {
                if (oObj instanceof Map) {
                    Map<String, Object> ord = (Map<String, Object>) oObj;
                    if (orderId.equals(str(ord.get("id")))) {
                        ord.put("status", status);
                        studentName = str(ord.get("studentAccountName"));
                        if (studentName.isEmpty()) studentName = str(ord.get("customer"));
                        Map<String, Object> st = asMap(ord.get("student"));
                        if (!str(st.get("fullAddress")).isEmpty()) fullAddress = str(st.get("fullAddress"));
                    }
                }
            }
            writeJsonAtomic(dataFile, canteenData);

            Map<String, Object> store = readNotifStoreLocked();
            for (Object nObj : asList(store.get("adminNotifications"))) {
                if (nObj instanceof Map) {
                    Map<String, Object> n = (Map<String, Object>) nObj;
                    if (orderId.equals(str(n.get("orderId")))) {
                        n.put("status", status);
                        n.put("isRead", Boolean.TRUE);
                        n.put("updatedAt", nowIso);
                        if (studentName.isEmpty()) {
                            Map<String, Object> rec = asMap(n.get("receipt"));
                            studentName = str(rec.get("studentAccountName"));
                            if (studentName.isEmpty()) studentName = str(n.get("customerName"));
                        }
                        if (!str(n.get("fullAddress")).isEmpty()) fullAddress = str(n.get("fullAddress"));
                    }
                }
            }

            Map<String, Object> userNotif = null;
            if (!studentName.isEmpty() && ("Ready".equals(status) || "Completed".equals(status) || "Cancelled".equals(status))) {
                String title;
                String message;
                if ("Ready".equals(status)) {
                    title = "Order Ready!";
                    message = "Order #" + orderId + " is Ready at Royal's Canteen kitchen and being packed for " + fullAddress + ".";
                } else if ("Completed".equals(status)) {
                    title = "The delivery coming near to the user";
                    message = "The delivery coming near to the user! Order #" + orderId + " is completed and arriving near " + fullAddress + ".";
                } else {
                    title = "Order Cancelled";
                    message = "Order #" + orderId + " was cancelled by Royal's Canteen.";
                }

                userNotif = new LinkedHashMap<>();
                userNotif.put("id", "un-" + orderId + "-" + status.toLowerCase(Locale.ROOT) + "-" + shortId());
                userNotif.put("orderId", orderId);
                userNotif.put("studentName", studentName);
                userNotif.put("status", status);
                userNotif.put("title", title);
                userNotif.put("message", message);
                userNotif.put("isRead", Boolean.FALSE);
                userNotif.put("createdAt", nowIso);

                List<Object> userNotifications = new ArrayList<>(asList(store.get("userNotifications")));
                userNotifications.add(0, userNotif);
                store.put("userNotifications", userNotifications);
            }

            writeJsonAtomic(notifStoreFile, store);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("ok", Boolean.TRUE);
            response.put("orderId", orderId);
            response.put("status", status);
            response.put("userNotification", userNotif);
            sendJson(exchange, 200, response);
        }
    }

    @SuppressWarnings("unchecked")
    private static void handleMarkNotificationsRead(HttpExchange exchange) throws IOException {
        Map<String, Object> payload = readJsonObject(exchange);
        String target = str(payload.get("target"));
        if (target.isEmpty()) target = "user";
        String id = str(payload.get("id")).trim();
        String studentName = str(payload.get("studentName")).trim();

        synchronized (LOCK) {
            Map<String, Object> store = readNotifStoreLocked();
            String key = "admin".equals(target) ? "adminNotifications" : "userNotifications";
            for (Object obj : asList(store.get(key))) {
                if (obj instanceof Map) {
                    Map<String, Object> n = (Map<String, Object>) obj;
                    if (!id.isEmpty()) {
                        if (id.equals(str(n.get("id")))) n.put("isRead", Boolean.TRUE);
                    } else if ("user".equals(target) && !studentName.isEmpty()) {
                        if (studentName.equalsIgnoreCase(str(n.get("studentName")))) n.put("isRead", Boolean.TRUE);
                    } else {
                        n.put("isRead", Boolean.TRUE);
                    }
                }
            }
            writeJsonAtomic(notifStoreFile, store);
        }
        sendJson(exchange, 200, mapOf("ok", Boolean.TRUE));
    }

    @SuppressWarnings("unchecked")
    private static void handleStudentRegister(HttpExchange exchange) throws IOException {
        Map<String, Object> payload = readJsonObject(exchange);
        String name = str(payload.get("name")).trim();
        String email = str(payload.get("email")).trim().toLowerCase(Locale.ROOT);
        String password = str(payload.get("password"));

        if (name.isEmpty() || email.isEmpty() || password.length() < 4) {
            sendJson(exchange, 400, mapOf("error", "Name, email, and password (min 4 chars) are required."));
            return;
        }

        synchronized (LOCK) {
            Map<String, Object> store = readNotifStoreLocked();
            List<Object> students = new ArrayList<>(asList(store.get("students")));
            for (Object obj : students) {
                if (obj instanceof Map) {
                    Map<String, Object> st = (Map<String, Object>) obj;
                    if (name.equalsIgnoreCase(str(st.get("name"))) || email.equalsIgnoreCase(str(st.get("email")))) {
                        sendJson(exchange, 409, mapOf("error", "A student with this name or email is already registered."));
                        return;
                    }
                }
            }
            Map<String, Object> record = new LinkedHashMap<>();
            record.put("id", "stu-" + shortId());
            record.put("name", name);
            record.put("email", email);
            record.put("password", password);
            record.put("createdAt", Instant.now().toString());
            students.add(record);
            store.put("students", students);
            writeJsonAtomic(notifStoreFile, store);

            Map<String, Object> safeStudent = new LinkedHashMap<>();
            safeStudent.put("id", record.get("id"));
            safeStudent.put("name", name);
            safeStudent.put("email", email);
            safeStudent.put("createdAt", record.get("createdAt"));
            sendJson(exchange, 201, mapOf("ok", Boolean.TRUE, "student", safeStudent));
        }
    }

    @SuppressWarnings("unchecked")
    private static void handleStudentLogin(HttpExchange exchange) throws IOException {
        Map<String, Object> payload = readJsonObject(exchange);
        String name = str(payload.get("name")).trim();
        String password = str(payload.get("password"));

        synchronized (LOCK) {
            Map<String, Object> store = readNotifStoreLocked();
            for (Object obj : asList(store.get("students"))) {
                if (obj instanceof Map) {
                    Map<String, Object> st = (Map<String, Object>) obj;
                    if (name.equalsIgnoreCase(str(st.get("name"))) && password.equals(str(st.get("password")))) {
                        Map<String, Object> safeStudent = new LinkedHashMap<>();
                        safeStudent.put("id", st.get("id"));
                        safeStudent.put("name", st.get("name"));
                        safeStudent.put("email", st.get("email"));
                        safeStudent.put("createdAt", st.get("createdAt"));
                        sendJson(exchange, 200, mapOf("ok", Boolean.TRUE, "student", safeStudent));
                        return;
                    }
                }
            }
        }
        sendJson(exchange, 401, mapOf("error", "Invalid Student Name or Password."));
    }

    private static void serveStaticFile(HttpExchange exchange) throws IOException {
        if (!"GET".equals(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Allow", "GET");
            sendText(exchange, 405, "text/plain; charset=utf-8", "Method not allowed");
            return;
        }

        String path = exchange.getRequestURI().getPath();
        Path file = null;
        String contentType = "text/plain; charset=utf-8";

        if ("/".equals(path) || "/index.html".equals(path) || "/index1.html".equals(path)) {
            file = userWebDir.resolve("index1.html");
            contentType = "text/html; charset=utf-8";
        } else if ("/styles.css".equals(path)) {
            file = userWebDir.resolve("styles.css");
            contentType = "text/css; charset=utf-8";
        } else if ("/user-app.js".equals(path)) {
            file = userWebDir.resolve("user-app.js");
            contentType = "text/javascript; charset=utf-8";
        } else if ("/admin".equals(path) || "/admin/".equals(path) || "/admin/index.html".equals(path)) {
            file = adminDir.resolve("index.html");
            contentType = "text/html; charset=utf-8";
        } else if ("/admin/notifications.html".equals(path)) {
            file = adminDir.resolve("notifications.html");
            contentType = "text/html; charset=utf-8";
        } else if ("/admin/notifications.js".equals(path)) {
            file = adminDir.resolve("notifications.js");
            contentType = "text/javascript; charset=utf-8";
        } else if ("/admin/app.js".equals(path)) {
            file = adminDir.resolve("app.js");
            contentType = "text/javascript; charset=utf-8";
        } else if ("/admin/styles.css".equals(path)) {
            file = adminDir.resolve("styles.css");
            contentType = "text/css; charset=utf-8";
        }

        if (file == null || !Files.isRegularFile(file)) {
            sendText(exchange, 404, "text/plain; charset=utf-8", "Not found");
            return;
        }
        send(exchange, 200, contentType, Files.readAllBytes(file));
    }

    private static void ensureNotifStoreInitialized() throws IOException {
        synchronized (LOCK) {
            Files.createDirectories(notifStoreFile.getParent());
            if (!Files.exists(notifStoreFile)) {
                Map<String, Object> init = new LinkedHashMap<>();
                init.put("adminNotifications", new ArrayList<>());
                init.put("userNotifications", new ArrayList<>());
                List<Object> students = new ArrayList<>();
                Map<String, Object> demo = new LinkedHashMap<>();
                demo.put("id", "stu-demo");
                demo.put("name", "Demo Student");
                demo.put("email", "demo@campus.edu");
                demo.put("password", "password123");
                demo.put("createdAt", Instant.now().toString());
                students.add(demo);
                init.put("students", students);
                writeJsonAtomic(notifStoreFile, init);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> readCanteenDataLocked() throws IOException {
        if (!Files.exists(dataFile)) {
            Map<String, Object> empty = new LinkedHashMap<>();
            empty.put("menu", new ArrayList<>());
            empty.put("orders", new ArrayList<>());
            empty.put("inventory", new ArrayList<>());
            empty.put("purchases", new ArrayList<>());
            return empty;
        }
        String raw = Files.readString(dataFile, StandardCharsets.UTF_8);
        Object parsed = JsonCodec.parse(raw);
        return parsed instanceof Map ? (Map<String, Object>) parsed : new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> readNotifStoreLocked() throws IOException {
        ensureNotifStoreInitialized();
        String raw = Files.readString(notifStoreFile, StandardCharsets.UTF_8);
        Object parsed = JsonCodec.parse(raw);
        Map<String, Object> store = parsed instanceof Map ? (Map<String, Object>) parsed : new LinkedHashMap<>();
        if (!(store.get("adminNotifications") instanceof List)) store.put("adminNotifications", new ArrayList<>());
        if (!(store.get("userNotifications") instanceof List)) store.put("userNotifications", new ArrayList<>());
        if (!(store.get("students") instanceof List)) store.put("students", new ArrayList<>());
        return store;
    }

    private static void writeJsonAtomic(Path target, Object value) throws IOException {
        Files.createDirectories(target.getParent());
        Path tmp = target.resolveSibling(target.getFileName().toString() + ".tmp");
        Files.writeString(tmp, JsonCodec.stringify(value), StandardCharsets.UTF_8);
        try {
            Files.move(tmp, target, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (AtomicMoveNotSupportedException error) {
            Files.move(tmp, target, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        byte[] body = exchange.getRequestBody().readNBytes(MAX_BODY_BYTES + 1);
        if (body.length > MAX_BODY_BYTES) {
            throw new IllegalArgumentException("Request too large");
        }
        return new String(body, StandardCharsets.UTF_8).trim();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> readJsonObject(HttpExchange exchange) throws IOException {
        String body = readRequestBody(exchange);
        Object parsed = JsonCodec.parse(body);
        if (!(parsed instanceof Map)) {
            throw new IllegalArgumentException("Expected a JSON object");
        }
        return (Map<String, Object>) parsed;
    }

    private static Map<String, String> parseQuery(String rawQuery) {
        if (rawQuery == null || rawQuery.isEmpty()) return Collections.emptyMap();
        Map<String, String> params = new HashMap<>();
        for (String pair : rawQuery.split("&")) {
            int eq = pair.indexOf('=');
            if (eq > 0) {
                String k = URLDecoder.decode(pair.substring(0, eq), StandardCharsets.UTF_8);
                String v = URLDecoder.decode(pair.substring(eq + 1), StandardCharsets.UTF_8);
                params.put(k, v);
            }
        }
        return params;
    }

    private static String shortId() {
        return UUID.randomUUID().toString().substring(0, 6);
    }

    private static String str(Object obj) {
        return obj == null ? "" : String.valueOf(obj);
    }

    private static double asDouble(Object obj, double fallback) {
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        if (obj instanceof String) {
            try {
                return Double.parseDouble(((String) obj).trim());
            } catch (NumberFormatException ignored) {
                return fallback;
            }
        }
        return fallback;
    }

    @SuppressWarnings("unchecked")
    private static List<Object> asList(Object obj) {
        return obj instanceof List ? (List<Object>) obj : new ArrayList<>();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object obj) {
        return obj instanceof Map ? (Map<String, Object>) obj : new LinkedHashMap<>();
    }

    private static Map<String, Object> mapOf(Object... kv) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i + 1 < kv.length; i += 2) {
            map.put(String.valueOf(kv[i]), kv[i + 1]);
        }
        return map;
    }

    private static void sendJson(HttpExchange exchange, int status, Object body) throws IOException {
        sendText(exchange, status, "application/json; charset=utf-8", JsonCodec.stringify(body));
    }

    private static void sendText(HttpExchange exchange, int status, String contentType, String text)
            throws IOException {
        send(exchange, status, contentType, text.getBytes(StandardCharsets.UTF_8));
    }

    private static void send(HttpExchange exchange, int status, String contentType, byte[] body)
            throws IOException {
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(status, body.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(body);
        }
    }

    static final class JsonCodec {
        private final String src;
        private int pos;

        private JsonCodec(String src) {
            this.src = src;
        }

        static Object parse(String json) {
            if (json == null || json.isBlank()) {
                throw new IllegalArgumentException("Empty JSON body");
            }
            JsonCodec parser = new JsonCodec(json);
            Object val = parser.readValue();
            parser.skipWhitespace();
            if (parser.pos != parser.src.length()) {
                throw new IllegalArgumentException("Unexpected trailing JSON characters");
            }
            return val;
        }

        private Object readValue() {
            skipWhitespace();
            if (pos >= src.length()) throw new IllegalArgumentException("Unexpected end of JSON");
            char c = src.charAt(pos);
            if (c == '{') return readObject();
            if (c == '[') return readArray();
            if (c == '"') return readString();
            if (c == 't') { expect("true"); return Boolean.TRUE; }
            if (c == 'f') { expect("false"); return Boolean.FALSE; }
            if (c == 'n') { expect("null"); return null; }
            if (c == '-' || (c >= '0' && c <= '9')) return readNumber();
            throw new IllegalArgumentException("Unexpected JSON token at " + pos);
        }

        private Map<String, Object> readObject() {
            pos++;
            Map<String, Object> map = new LinkedHashMap<>();
            skipWhitespace();
            if (peek('}')) {
                pos++;
                return map;
            }
            while (true) {
                skipWhitespace();
                if (!peek('"')) throw new IllegalArgumentException("Expected string key at " + pos);
                String key = readString();
                skipWhitespace();
                if (!peek(':')) throw new IllegalArgumentException("Expected ':' at " + pos);
                pos++;
                Object value = readValue();
                map.put(key, value);
                skipWhitespace();
                if (peek('}')) {
                    pos++;
                    return map;
                }
                if (!peek(',')) throw new IllegalArgumentException("Expected ',' or '}' at " + pos);
                pos++;
            }
        }

        private List<Object> readArray() {
            pos++;
            List<Object> list = new ArrayList<>();
            skipWhitespace();
            if (peek(']')) {
                pos++;
                return list;
            }
            while (true) {
                list.add(readValue());
                skipWhitespace();
                if (peek(']')) {
                    pos++;
                    return list;
                }
                if (!peek(',')) throw new IllegalArgumentException("Expected ',' or ']' at " + pos);
                pos++;
            }
        }

        private String readString() {
            pos++;
            StringBuilder sb = new StringBuilder();
            while (pos < src.length()) {
                char c = src.charAt(pos++);
                if (c == '"') return sb.toString();
                if (c == '\\') {
                    if (pos >= src.length()) throw new IllegalArgumentException("Unterminated escape");
                    char esc = src.charAt(pos++);
                    switch (esc) {
                        case '"': sb.append('"'); break;
                        case '\\': sb.append('\\'); break;
                        case '/': sb.append('/'); break;
                        case 'b': sb.append('\b'); break;
                        case 'f': sb.append('\f'); break;
                        case 'n': sb.append('\n'); break;
                        case 'r': sb.append('\r'); break;
                        case 't': sb.append('\t'); break;
                        case 'u':
                            if (pos + 4 > src.length()) throw new IllegalArgumentException("Invalid unicode escape");
                            String hex = src.substring(pos, pos + 4);
                            sb.append((char) Integer.parseInt(hex, 16));
                            pos += 4;
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid escape char: " + esc);
                    }
                } else {
                    sb.append(c);
                }
            }
            throw new IllegalArgumentException("Unterminated string");
        }

        private Number readNumber() {
            int start = pos;
            if (peek('-')) pos++;
            while (pos < src.length() && Character.isDigit(src.charAt(pos))) pos++;
            boolean isFloat = false;
            if (peek('.')) {
                isFloat = true;
                pos++;
                while (pos < src.length() && Character.isDigit(src.charAt(pos))) pos++;
            }
            if (peek('e') || peek('E')) {
                isFloat = true;
                pos++;
                if (peek('+') || peek('-')) pos++;
                while (pos < src.length() && Character.isDigit(src.charAt(pos))) pos++;
            }
            String numStr = src.substring(start, pos);
            if (isFloat) return Double.parseDouble(numStr);
            long l = Long.parseLong(numStr);
            if (l >= Integer.MIN_VALUE && l <= Integer.MAX_VALUE) return (int) l;
            return l;
        }

        private void expect(String literal) {
            if (!src.startsWith(literal, pos)) {
                throw new IllegalArgumentException("Expected " + literal + " at " + pos);
            }
            pos += literal.length();
        }

        private boolean peek(char c) {
            return pos < src.length() && src.charAt(pos) == c;
        }

        private void skipWhitespace() {
            while (pos < src.length()) {
                char c = src.charAt(pos);
                if (c == ' ' || c == '\t' || c == '\r' || c == '\n') pos++;
                else break;
            }
        }

        static String stringify(Object value) {
            StringBuilder sb = new StringBuilder();
            writeValue(sb, value);
            return sb.toString();
        }

        @SuppressWarnings("unchecked")
        private static void writeValue(StringBuilder sb, Object value) {
            if (value == null) {
                sb.append("null");
            } else if (value instanceof Boolean) {
                sb.append(((Boolean) value) ? "true" : "false");
            } else if (value instanceof Number) {
                double d = ((Number) value).doubleValue();
                if (Double.isNaN(d) || Double.isInfinite(d)) {
                    sb.append("0");
                } else if (value instanceof Integer || value instanceof Long) {
                    sb.append(value.toString());
                } else if (d == Math.rint(d) && Math.abs(d) < 1e15) {
                    sb.append((long) d);
                } else {
                    sb.append(value.toString());
                }
            } else if (value instanceof String) {
                writeString(sb, (String) value);
            } else if (value instanceof List) {
                sb.append('[');
                List<Object> list = (List<Object>) value;
                for (int i = 0; i < list.size(); i++) {
                    if (i > 0) sb.append(',');
                    writeValue(sb, list.get(i));
                }
                sb.append(']');
            } else if (value instanceof Map) {
                sb.append('{');
                Map<Object, Object> map = (Map<Object, Object>) value;
                boolean first = true;
                for (Map.Entry<Object, Object> entry : map.entrySet()) {
                    if (!first) sb.append(',');
                    first = false;
                    writeString(sb, String.valueOf(entry.getKey()));
                    sb.append(':');
                    writeValue(sb, entry.getValue());
                }
                sb.append('}');
            } else {
                writeString(sb, String.valueOf(value));
            }
        }

        private static void writeString(StringBuilder sb, String s) {
            sb.append('"');
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);
                switch (c) {
                    case '"': sb.append("\\\""); break;
                    case '\\': sb.append("\\\\"); break;
                    case '\b': sb.append("\\b"); break;
                    case '\f': sb.append("\\f"); break;
                    case '\n': sb.append("\\n"); break;
                    case '\r': sb.append("\\r"); break;
                    case '\t': sb.append("\\t"); break;
                    default:
                        if (c < 0x20) {
                            sb.append(String.format("\\u%04x", (int) c));
                        } else {
                            sb.append(c);
                        }
                }
            }
            sb.append('"');
        }
    }
}
