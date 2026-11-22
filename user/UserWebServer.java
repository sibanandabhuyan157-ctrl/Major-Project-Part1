import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class UserWebServer {
    private static final int MAX = 2 * 1024 * 1024;
    private static final Object LOCK = new Object();
    private static Path userDir, adminDir, dataFile, storeFile, usersDbFile, historyDbFile;

    public static void main(String[] args) throws IOException {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 8082;
        Path cwd = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        userDir = Files.isRegularFile(cwd.resolve("index1.html")) ? cwd : cwd.resolve("User Web").normalize();
        adminDir = Files.isRegularFile(userDir.getParent().resolve("index.html")) ? userDir.getParent() : userDir.getParent().resolve("Major Project Part 1").normalize();
        dataFile = adminDir.resolve("canteen-data.json");
        Path dbDir = adminDir.resolve("database");
        storeFile = dbDir.resolve("notifications-store.json");
        usersDbFile = dbDir.resolve("users-db.json");
        historyDbFile = dbDir.resolve("order-history-db.json");
        initDbs();
        HttpServer s = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        s.createContext("/api/", UserWebServer::api);
        s.createContext("/", UserWebServer::serve);
        s.start();
        System.out.println("User Web running: http://127.0.0.1:" + port + "/index1.html  |  Admin: http://127.0.0.1:" + port + "/admin/");
    }

    @SuppressWarnings("unchecked")
    private static void api(HttpExchange ex) throws IOException {
        Headers h = ex.getResponseHeaders();
        h.set("Access-Control-Allow-Origin", "*"); h.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS"); h.set("Access-Control-Allow-Headers", "Content-Type");
        if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); ex.close(); return; }
        String p = ex.getRequestURI().getPath(), m = ex.getRequestMethod();
        try {
            if ("/api/data".equals(p) && "GET".equals(m)) synchronized (LOCK) { if (!Files.exists(dataFile)) json(ex, 404, mp("error", "No saved data")); else send(ex, 200, "application/json; charset=utf-8", Files.readAllBytes(dataFile)); return; }
            if ("/api/admin/users".equals(p) && "GET".equals(m)) {
                synchronized (LOCK) {
                    List<Object> hist = ls(readHist().get("history")); Map<String, double[]> stats = new HashMap<>();
                    for (Object x : hist) { Map<String, Object> o = mpOf(x); String k = s(o.get("studentAccountName")).toLowerCase(Locale.ROOT); double[] st = stats.computeIfAbsent(k, __ -> new double[2]); st[0]++; st[1] += num(o.get("total"), 0); }
                    List<Object> safeUsers = new ArrayList<>();
                    for (Object x : ls(readUsers().get("users"))) {
                        Map<String, Object> u = mpOf(x); double[] st = stats.getOrDefault(s(u.get("name")).toLowerCase(Locale.ROOT), new double[2]);
                        safeUsers.add(mp("id", u.get("id"), "name", s(u.get("name")), "email", s(u.get("email")), "regNo", s(u.get("regNo")), "hostel", s(u.get("hostel")), "roomNo", s(u.get("roomNo")), "phone", s(u.get("phone")), "createdAt", s(u.get("createdAt")), "lastOrderAt", s(u.get("lastOrderAt")), "orderCount", (int) st[0], "totalSpent", st[1]));
                    }
                    json(ex, 200, mp("users", safeUsers, "passwordProtected", true)); return;
                }
            }
            if ("/api/order-history".equals(p) && "GET".equals(m)) {
                String stu = qparam(ex.getRequestURI().getRawQuery(), "student");
                synchronized (LOCK) { List<Object> hist = ls(readHist().get("history")); if (!stu.isEmpty()) hist = filter(hist, o -> stu.equalsIgnoreCase(s(o.get("studentAccountName")))); json(ex, 200, mp("history", hist)); return; }
            }
            if ("/api/notifications".equals(p) && "GET".equals(m)) {
                String stu = qparam(ex.getRequestURI().getRawQuery(), "student");
                synchronized (LOCK) {
                    Map<String, Object> st = readStore(), cd = readData();
                    List<Object> un = ls(st.get("userNotifications")), ords = ls(cd.get("orders"));
                    if (!stu.isEmpty()) {
                        un = filter(un, n -> stu.equalsIgnoreCase(s(n.get("studentName"))));
                        ords = filter(ords, o -> stu.equalsIgnoreCase(s(o.get("studentAccountName")).isEmpty() ? s(o.get("customer")) : s(o.get("studentAccountName"))));
                    }
                    json(ex, 200, mp("adminNotifications", ls(st.get("adminNotifications")), "userNotifications", un, "orders", ords)); return;
                }
            }
            if ("/api/orders/user".equals(p) && "POST".equals(m)) {
                Map<String, Object> b = reqObj(ex), st = mpOf(b.get("student")); List<Object> its = ls(b.get("items"));
                String oid = s(b.get("orderId")).trim(); if (oid.isEmpty() || its.isEmpty()) { json(ex, 400, mp("error", "Invalid order")); return; }
                String sn = nonEmpty(s(b.get("studentAccountName")), s(st.get("name")), "Campus Student"), cn = nonEmpty(s(st.get("name")), sn, sn);
                String reg = s(st.get("regNo")).trim(), hst = nonEmpty(s(st.get("hostel")), "Boys Hostel", "Boys Hostel"), rm = s(st.get("roomNo")).trim(), ph = s(st.get("phone")).trim();
                String addr = nonEmpty(s(st.get("fullAddress")), hst + ", Room No. " + rm + ", College Campus", "");
                String pm = nonEmpty(s(b.get("paymentMethod")), "UPI", "UPI"), ps = nonEmpty(s(b.get("paymentStatus")), "UPI".equalsIgnoreCase(pm) ? "Paid via UPI" : "Cash on Delivery", "");
                double tot = num(b.get("total"), 0); int est = (int) Math.round(num(b.get("estimatedMinutes"), 6));
                String now = Instant.now().toString(), tm = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
                synchronized (LOCK) {
                    Map<String, Object> cd = readData(); Map<String, Double> costs = new HashMap<>();
                    for (Object x : ls(cd.get("menu"))) { Map<String, Object> mi = mpOf(x); if (mi.get("costPerServing") instanceof Number) costs.put(s(mi.get("name")).toLowerCase(Locale.ROOT), ((Number) mi.get("costPerServing")).doubleValue()); }
                    List<Object> aits = new ArrayList<>();
                    for (Object x : its) { Map<String, Object> i = mpOf(x); double pr = num(i.get("price"), num(i.get("unitPrice"), 0)); aits.add(mp("name", s(i.get("name")), "qty", Math.max(1, (int) Math.round(num(i.get("qty"), 1))), "unitPrice", pr, "unitCost", costs.getOrDefault(s(i.get("name")).toLowerCase(Locale.ROOT), Math.round(pr * 45.0) / 100.0))); }
                    Map<String, Object> stuInfo = mp("name", cn, "regNo", reg, "hostel", hst, "roomNo", rm, "phone", ph, "fullAddress", addr);
                    Map<String, Object> ord = mp("id", oid, "customer", cn, "studentAccountName", sn, "items", aits, "total", tot, "status", "Preparing", "time", tm, "payment", "UPI".equalsIgnoreCase(pm) ? "UPI" : "Cash", "paymentMethod", pm, "paymentStatus", ps, "day", LocalDate.now().toString(), "source", "user-web", "student", stuInfo, "estimatedMinutes", est, "dateTime", nonEmpty(s(b.get("dateTime")), tm, tm), "receipt", b);
                    List<Object> ords = new ArrayList<>(ls(cd.get("orders"))); ords.removeIf(o -> oid.equals(s(mpOf(o).get("id")))); ords.add(0, ord); cd.put("orders", ords); writeJson(dataFile, cd);
                    Map<String, Object> ns = readStore();
                    Map<String, Object> an = mp("id", "an-" + oid + "-" + uid(), "orderId", oid, "customerName", cn, "regNo", reg, "hostel", hst, "roomNo", rm, "phone", ph, "fullAddress", addr, "items", its, "total", tot, "paymentMethod", pm, "paymentStatus", ps, "estimatedMinutes", est, "status", "Preparing", "isRead", false, "receipt", b, "createdAt", now, "updatedAt", now);
                    Map<String, Object> un = mp("id", "un-" + oid + "-" + uid(), "orderId", oid, "studentName", sn, "status", "Preparing", "title", "Order Receipt Received", "message", "Order #" + oid + " receipt sent to Royal's Canteen kitchen. Preparing your order!", "isRead", false, "createdAt", now);
                    prepend(ns, "adminNotifications", an); prepend(ns, "userNotifications", un); writeJson(storeFile, ns);
                    Map<String, Object> hdb = readHist();
                    Map<String, Object> hRec = mp("orderId", oid, "studentAccountName", sn, "student", stuInfo, "items", its, "total", tot, "paymentMethod", pm, "paymentStatus", ps, "estimatedMinutes", est, "status", "Preparing", "dateTime", nonEmpty(s(b.get("dateTime")), tm, tm), "createdAt", now, "updatedAt", now);
                    List<Object> hl = new ArrayList<>(ls(hdb.get("history"))); hl.removeIf(x -> oid.equals(s(mpOf(x).get("orderId")))); hl.add(0, hRec); hdb.put("history", hl); writeJson(historyDbFile, hdb);
                    Map<String, Object> udb = readUsers();
                    for (Object x : ls(udb.get("users"))) { Map<String, Object> u = mpOf(x); if (sn.equalsIgnoreCase(s(u.get("name")))) { u.put("regNo", reg); u.put("hostel", hst); u.put("roomNo", rm); u.put("phone", ph); u.put("lastOrderAt", now); } }
                    writeJson(usersDbFile, udb);
                    json(ex, 201, mp("ok", true, "order", ord, "adminNotification", an, "userNotification", un)); return;
                }
            }
            if ("/api/orders/status".equals(p) && ("POST".equals(m) || "PUT".equals(m))) {
                Map<String, Object> b = reqObj(ex); String oid = s(b.get("orderId")).trim(), st = s(b.get("status")).trim();
                if (oid.isEmpty() || !List.of("Preparing", "Ready", "Completed", "Cancelled").contains(st)) { json(ex, 400, mp("error", "Invalid status")); return; }
                String now = Instant.now().toString();
                synchronized (LOCK) {
                    Map<String, Object> cd = readData(), ns = readStore(), hdb = readHist(); String sn = "", addr = "your hostel room";
                    for (Object x : ls(cd.get("orders"))) { Map<String, Object> o = mpOf(x); if (oid.equals(s(o.get("id")))) { o.put("status", st); sn = nonEmpty(s(o.get("studentAccountName")), s(o.get("customer")), ""); addr = nonEmpty(s(mpOf(o.get("student")).get("fullAddress")), addr, addr); } }
                    writeJson(dataFile, cd);
                    for (Object x : ls(hdb.get("history"))) { Map<String, Object> o = mpOf(x); if (oid.equals(s(o.get("orderId")))) { o.put("status", st); o.put("updatedAt", now); } }
                    writeJson(historyDbFile, hdb);
                    for (Object x : ls(ns.get("adminNotifications"))) { Map<String, Object> n = mpOf(x); if (oid.equals(s(n.get("orderId")))) { n.put("status", st); n.put("isRead", true); n.put("updatedAt", now); if (sn.isEmpty()) sn = nonEmpty(s(mpOf(n.get("receipt")).get("studentAccountName")), s(n.get("customerName")), ""); addr = nonEmpty(s(n.get("fullAddress")), addr, addr); } }
                    Map<String, Object> un = null;
                    if (!sn.isEmpty() && !"Preparing".equals(st)) {
                        String t = "Ready".equals(st) ? "Order Ready!" : "Completed".equals(st) ? "The delivery coming near to the user" : "Order Cancelled";
                        String msg = "Ready".equals(st) ? "Order #" + oid + " is Ready at Royal's Canteen kitchen and being packed for " + addr + "." : "Completed".equals(st) ? "The delivery coming near to the user! Order #" + oid + " is completed and arriving near " + addr + "." : "Order #" + oid + " was cancelled by Royal's Canteen.";
                        un = mp("id", "un-" + oid + "-" + st.toLowerCase(Locale.ROOT) + "-" + uid(), "orderId", oid, "studentName", sn, "status", st, "title", t, "message", msg, "isRead", false, "createdAt", now);
                        prepend(ns, "userNotifications", un);
                    }
                    writeJson(storeFile, ns); json(ex, 200, mp("ok", true, "orderId", oid, "status", st, "userNotification", un)); return;
                }
            }
            if ("/api/notifications/read".equals(p) && "POST".equals(m)) {
                Map<String, Object> b = reqObj(ex); String tgt = nonEmpty(s(b.get("target")), "user", "user"), id = s(b.get("id")).trim(), sn = s(b.get("studentName")).trim();
                synchronized (LOCK) {
                    Map<String, Object> ns = readStore();
                    for (Object x : ls(ns.get("admin".equals(tgt) ? "adminNotifications" : "userNotifications"))) {
                        Map<String, Object> n = mpOf(x);
                        if ((!id.isEmpty() && id.equals(s(n.get("id")))) || (id.isEmpty() && (!"user".equals(tgt) || sn.isEmpty() || sn.equalsIgnoreCase(s(n.get("studentName")))))) n.put("isRead", true);
                    }
                    writeJson(storeFile, ns);
                }
                json(ex, 200, mp("ok", true)); return;
            }
            if ("/api/students/register".equals(p) && "POST".equals(m)) {
                Map<String, Object> b = reqObj(ex); String n = s(b.get("name")).trim(), e = s(b.get("email")).trim().toLowerCase(Locale.ROOT), pw = s(b.get("password"));
                if (n.isEmpty() || e.isEmpty() || pw.length() < 4) { json(ex, 400, mp("error", "Invalid fields")); return; }
                synchronized (LOCK) {
                    Map<String, Object> udb = readUsers(); List<Object> us = new ArrayList<>(ls(udb.get("users")));
                    for (Object x : us) { Map<String, Object> u = mpOf(x); if (n.equalsIgnoreCase(s(u.get("name"))) || e.equalsIgnoreCase(s(u.get("email")))) { json(ex, 409, mp("error", "Already registered")); return; } }
                    Map<String, Object> rec = mp("id", "stu-" + uid(), "name", n, "email", e, "passwordHash", hashPw(pw), "regNo", "", "hostel", "", "roomNo", "", "phone", "", "createdAt", Instant.now().toString(), "lastOrderAt", "");
                    us.add(rec); udb.put("users", us); writeJson(usersDbFile, udb);
                    json(ex, 201, mp("ok", true, "student", mp("id", rec.get("id"), "name", n, "email", e, "createdAt", rec.get("createdAt")))); return;
                }
            }
            if ("/api/students/login".equals(p) && "POST".equals(m)) {
                Map<String, Object> b = reqObj(ex); String n = s(b.get("name")).trim(), pw = s(b.get("password"));
                synchronized (LOCK) {
                    for (Object x : ls(readUsers().get("users"))) { Map<String, Object> u = mpOf(x); if (n.equalsIgnoreCase(s(u.get("name"))) && verifyPw(pw, s(u.get("passwordHash")))) { json(ex, 200, mp("ok", true, "student", mp("id", u.get("id"), "name", u.get("name"), "email", u.get("email"), "regNo", s(u.get("regNo")), "hostel", s(u.get("hostel")), "roomNo", s(u.get("roomNo")), "phone", s(u.get("phone")), "createdAt", u.get("createdAt")))); return; } }
                }
                json(ex, 401, mp("error", "Invalid credentials")); return;
            }
            json(ex, 404, mp("error", "Not found"));
        } catch (IllegalArgumentException e) { json(ex, 400, mp("error", e.getMessage())); }
        catch (Exception e) { json(ex, 500, mp("error", e.getMessage())); }
    }

    private static void serve(HttpExchange ex) throws IOException {
        if (!"GET".equals(ex.getRequestMethod())) { ex.getResponseHeaders().set("Allow", "GET"); send(ex, 405, "text/plain", "Method not allowed".getBytes()); return; }
        String p = ex.getRequestURI().getPath();
        Map<String, Path> routes = Map.of("/", userDir.resolve("index1.html"), "/index.html", userDir.resolve("index1.html"), "/index1.html", userDir.resolve("index1.html"), "/styles.css", userDir.resolve("styles.css"), "/user-app.js", userDir.resolve("user-app.js"), "/admin", adminDir.resolve("index.html"), "/admin/", adminDir.resolve("index.html"), "/admin/index.html", adminDir.resolve("index.html"), "/admin/notifications.html", adminDir.resolve("notifications.html"), "/admin/notifications.js", adminDir.resolve("notifications.js"));
        Path f = routes.get(p);
        if (f == null && "/admin/app.js".equals(p)) f = adminDir.resolve("app.js");
        if (f == null && "/admin/styles.css".equals(p)) f = adminDir.resolve("styles.css");
        if (f == null || !Files.isRegularFile(f)) { send(ex, 404, "text/plain", "Not found".getBytes()); return; }
        String fn = f.getFileName().toString(), ct = fn.endsWith(".css") ? "text/css" : fn.endsWith(".js") ? "text/javascript" : "text/html";
        send(ex, 200, ct + "; charset=utf-8", Files.readAllBytes(f));
    }

    private static void initDbs() throws IOException {
        synchronized (LOCK) {
            Files.createDirectories(storeFile.getParent());
            writeIfMissing(storeFile, mp("adminNotifications", new ArrayList<>(), "userNotifications", new ArrayList<>()));
            writeIfMissing(usersDbFile, mp("users", List.of(mp("id", "stu-demo", "name", "Demo Student", "email", "demo@campus.edu", "passwordHash", hashPw("password123"), "regNo", "", "hostel", "", "roomNo", "", "phone", "", "createdAt", Instant.now().toString(), "lastOrderAt", ""))));
            writeIfMissing(historyDbFile, mp("history", new ArrayList<>()));
        }
    }
    private static void writeIfMissing(Path f, Object v) throws IOException { try { Files.writeString(f, Json.dump(v), StandardOpenOption.CREATE_NEW); } catch (FileAlreadyExistsException ignored) {} }
    private static String hashPw(String pw) {
        try { byte[] salt = new byte[12]; new SecureRandom().nextBytes(salt); String sh = hex(salt); MessageDigest md = MessageDigest.getInstance("SHA-256"); return sh + ":" + hex(md.digest((sh + ":" + pw).getBytes(StandardCharsets.UTF_8))); }
        catch (Exception e) { throw new RuntimeException(e); }
    }
    private static boolean verifyPw(String pw, String stored) {
        int i = stored.indexOf(':'); if (i < 1) return false;
        try { MessageDigest md = MessageDigest.getInstance("SHA-256"); return MessageDigest.isEqual(stored.substring(i + 1).getBytes(StandardCharsets.UTF_8), hex(md.digest((stored.substring(0, i) + ":" + pw).getBytes(StandardCharsets.UTF_8))).getBytes(StandardCharsets.UTF_8)); }
        catch (Exception e) { return false; }
    }
    private static String hex(byte[] b) { StringBuilder sb = new StringBuilder(); for (byte x : b) sb.append(String.format("%02x", x)); return sb.toString(); }
    private static Map<String, Object> readData() throws IOException { return Files.exists(dataFile) ? mpOf(Json.parse(Files.readString(dataFile))) : mp("menu", new ArrayList<>(), "orders", new ArrayList<>(), "inventory", new ArrayList<>(), "purchases", new ArrayList<>()); }
    private static Map<String, Object> readStore() throws IOException { initDbs(); return mpOf(Json.parse(Files.readString(storeFile))); }
    private static Map<String, Object> readUsers() throws IOException { initDbs(); return mpOf(Json.parse(Files.readString(usersDbFile))); }
    private static Map<String, Object> readHist() throws IOException { initDbs(); return mpOf(Json.parse(Files.readString(historyDbFile))); }
    private static void writeJson(Path f, Object v) throws IOException { Files.createDirectories(f.getParent()); Path t = f.resolveSibling(f.getFileName() + "." + uid() + ".tmp"); Files.writeString(t, Json.dump(v)); try { Files.move(t, f, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE); } catch (AtomicMoveNotSupportedException e) { Files.move(t, f, StandardCopyOption.REPLACE_EXISTING); } }
    private static Map<String, Object> reqObj(HttpExchange ex) throws IOException { byte[] b = ex.getRequestBody().readNBytes(MAX + 1); if (b.length > MAX) throw new IllegalArgumentException("Too large"); return mpOf(Json.parse(new String(b, StandardCharsets.UTF_8))); }
    private static void prepend(Map<String, Object> m, String k, Object v) { List<Object> l = new ArrayList<>(ls(m.get(k))); l.add(0, v); m.put(k, l); }
    private static List<Object> filter(List<Object> l, java.util.function.Predicate<Map<String, Object>> fn) { List<Object> r = new ArrayList<>(); for (Object x : l) if (fn.test(mpOf(x))) r.add(x); return r; }
    private static String qparam(String q, String k) { if (q == null) return ""; for (String p : q.split("&")) { int i = p.indexOf('='); if (i > 0 && k.equals(URLDecoder.decode(p.substring(0, i), StandardCharsets.UTF_8))) return URLDecoder.decode(p.substring(i + 1), StandardCharsets.UTF_8).trim(); } return ""; }
    private static String uid() { return UUID.randomUUID().toString().substring(0, 6); }
    private static String s(Object o) { return o == null ? "" : String.valueOf(o); }
    private static String nonEmpty(String a, String b, String c) { return !a.isBlank() ? a.trim() : !b.isBlank() ? b.trim() : c; }
    private static double num(Object o, double fb) { if (o instanceof Number) return ((Number) o).doubleValue(); try { return Double.parseDouble(s(o)); } catch (Exception e) { return fb; } }
    @SuppressWarnings("unchecked") private static List<Object> ls(Object o) { return o instanceof List ? (List<Object>) o : new ArrayList<>(); }
    @SuppressWarnings("unchecked") private static Map<String, Object> mpOf(Object o) { return o instanceof Map ? (Map<String, Object>) o : new LinkedHashMap<>(); }
    private static Map<String, Object> mp(Object... kv) { Map<String, Object> m = new LinkedHashMap<>(); for (int i = 0; i + 1 < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]); return m; }
    private static void json(HttpExchange ex, int c, Object b) throws IOException { send(ex, c, "application/json; charset=utf-8", Json.dump(b).getBytes(StandardCharsets.UTF_8)); }
    private static void send(HttpExchange ex, int c, String ct, byte[] b) throws IOException { ex.getResponseHeaders().set("Content-Type", ct); ex.sendResponseHeaders(c, b.length); try (OutputStream o = ex.getResponseBody()) { o.write(b); } }

    static final class Json {
        private final String t; private int i;
        private Json(String t) { this.t = t; }
        static Object parse(String s) { Json j = new Json(s); Object v = j.val(); j.ws(); if (j.i != j.t.length()) throw new IllegalArgumentException("Bad JSON"); return v; }
        private Object val() {
            ws(); if (i >= t.length()) throw new IllegalArgumentException("EOF");
            char c = t.charAt(i);
            if (c == '{') { i++; Map<String, Object> m = new LinkedHashMap<>(); ws(); if (eat('}')) return m; do { ws(); String k = str(); ws(); if (!eat(':')) throw new IllegalArgumentException(":"); m.put(k, val()); ws(); } while (eat(',')); if (!eat('}')) throw new IllegalArgumentException("}"); return m; }
            if (c == '[') { i++; List<Object> l = new ArrayList<>(); ws(); if (eat(']')) return l; do { l.add(val()); ws(); } while (eat(',')); if (!eat(']')) throw new IllegalArgumentException("]"); return l; }
            if (c == '"') return str();
            if (t.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
            if (t.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
            if (t.startsWith("null", i)) { i += 4; return null; }
            int st = i; eat('-'); while (i < t.length() && "0123456789.eE+-".indexOf(t.charAt(i)) >= 0) i++;
            String n = t.substring(st, i); return n.contains(".") || n.contains("e") || n.contains("E") ? Double.parseDouble(n) : Long.parseLong(n);
        }
        private String str() {
            if (!eat('"')) throw new IllegalArgumentException("\"");
            StringBuilder b = new StringBuilder();
            while (i < t.length()) {
                char c = t.charAt(i++); if (c == '"') return b.toString();
                if (c == '\\') { char e = t.charAt(i++); if (e == 'u') { b.append((char) Integer.parseInt(t.substring(i, i + 4), 16)); i += 4; } else b.append(e == 'n' ? '\n' : e == 'r' ? '\r' : e == 't' ? '\t' : e == 'b' ? '\b' : e == 'f' ? '\f' : e); } else b.append(c);
            }
            throw new IllegalArgumentException("Unterminated string");
        }
        private boolean eat(char c) { if (i < t.length() && t.charAt(i) == c) { i++; return true; } return false; }
        private void ws() { while (i < t.length() && Character.isWhitespace(t.charAt(i))) i++; }
        static String dump(Object v) { StringBuilder b = new StringBuilder(); w(b, v); return b.toString(); }
        @SuppressWarnings("unchecked")
        private static void w(StringBuilder b, Object v) {
            if (v == null) b.append("null");
            else if (v instanceof Boolean) b.append(v);
            else if (v instanceof Number) { double d = ((Number) v).doubleValue(); b.append(Double.isFinite(d) ? (v instanceof Integer || v instanceof Long ? v.toString() : d == Math.rint(d) && Math.abs(d) < 1e15 ? String.valueOf((long) d) : v.toString()) : "0"); }
            else if (v instanceof String) { b.append('"'); for (char c : ((String) v).toCharArray()) b.append(c == '"' ? "\\\"" : c == '\\' ? "\\\\" : c == '\n' ? "\\n" : c == '\r' ? "\\r" : c == '\t' ? "\\t" : c < 32 ? String.format("\\u%04x", (int) c) : String.valueOf(c)); b.append('"'); }
            else if (v instanceof List) { b.append('['); List<Object> l = (List<Object>) v; for (int k = 0; k < l.size(); k++) { if (k > 0) b.append(','); w(b, l.get(k)); } b.append(']'); }
            else if (v instanceof Map) { b.append('{'); boolean f = true; for (Map.Entry<Object, Object> e : ((Map<Object, Object>) v).entrySet()) { if (!f) b.append(','); f = false; w(b, String.valueOf(e.getKey())); b.append(':'); w(b, e.getValue()); } b.append('}'); }
            else w(b, String.valueOf(v));
        }
    }
}
