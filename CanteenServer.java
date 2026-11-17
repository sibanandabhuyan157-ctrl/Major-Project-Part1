import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class CanteenServer {
    private static final int PORT = 8081;
    private static final int MAX_BODY_BYTES = 2 * 1024 * 1024;
    private static final Path PROJECT_DIR = Path.of(System.getProperty("user.dir")).toAbsolutePath();
    private static final Path DATA_FILE = PROJECT_DIR.resolve("canteen-data.json");

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
        server.createContext("/api/data", CanteenServer::handleData);
        server.createContext("/", CanteenServer::serveStaticFile);
        server.start();
        System.out.println("CanteenOS is running at http://127.0.0.1:" + PORT);
        System.out.println("Data is stored in " + DATA_FILE);
    }

    private static void handleData(HttpExchange exchange) throws IOException {
        if (!"/api/data".equals(exchange.getRequestURI().getPath())) {
            sendText(exchange, 404, "application/json; charset=utf-8", "{\"error\":\"Not found\"}");
            return;
        }

        if ("GET".equals(exchange.getRequestMethod())) {
            if (!Files.exists(DATA_FILE)) {
                sendText(exchange, 404, "application/json; charset=utf-8", "{\"error\":\"No saved data\"}");
                return;
            }
            send(exchange, 200, "application/json; charset=utf-8", Files.readAllBytes(DATA_FILE));
            return;
        }

        if ("PUT".equals(exchange.getRequestMethod())) {
            byte[] body = exchange.getRequestBody().readNBytes(MAX_BODY_BYTES + 1);
            if (body.length > MAX_BODY_BYTES) {
                sendText(exchange, 413, "application/json; charset=utf-8", "{\"error\":\"Request too large\"}");
                return;
            }
            String json = new String(body, StandardCharsets.UTF_8).trim();
            if (!json.startsWith("{") || !json.endsWith("}")) {
                sendText(exchange, 400, "application/json; charset=utf-8", "{\"error\":\"Expected a JSON object\"}");
                return;
            }

            Path temporaryFile = DATA_FILE.resolveSibling("canteen-data.json.tmp");
            Files.writeString(temporaryFile, json, StandardCharsets.UTF_8);
            try {
                Files.move(temporaryFile, DATA_FILE, StandardCopyOption.REPLACE_EXISTING,
                        StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException error) {
                Files.move(temporaryFile, DATA_FILE, StandardCopyOption.REPLACE_EXISTING);
            }
            sendText(exchange, 200, "application/json; charset=utf-8", "{\"saved\":true}");
            return;
        }

        exchange.getResponseHeaders().set("Allow", "GET, PUT");
        sendText(exchange, 405, "application/json; charset=utf-8", "{\"error\":\"Method not allowed\"}");
    }

    private static void serveStaticFile(HttpExchange exchange) throws IOException {
        if (!"GET".equals(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Allow", "GET");
            sendText(exchange, 405, "text/plain; charset=utf-8", "Method not allowed");
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String fileName;
        String contentType;
        if ("/".equals(path) || "/index.html".equals(path)) {
            fileName = "index.html";
            contentType = "text/html; charset=utf-8";
        } else if ("/app.js".equals(path)) {
            fileName = "app.js";
            contentType = "text/javascript; charset=utf-8";
        } else if ("/styles.css".equals(path)) {
            fileName = "styles.css";
            contentType = "text/css; charset=utf-8";
        } else if ("/inventory-check.html".equals(path)) {
            fileName = "inventory-check.html";
            contentType = "text/html; charset=utf-8";
        } else {
            sendText(exchange, 404, "text/plain; charset=utf-8", "Not found");
            return;
        }

        Path file = PROJECT_DIR.resolve(fileName);
        if (!Files.isRegularFile(file)) {
            sendText(exchange, 404, "text/plain; charset=utf-8", "File not found");
            return;
        }
        send(exchange, 200, contentType, Files.readAllBytes(file));
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
}
