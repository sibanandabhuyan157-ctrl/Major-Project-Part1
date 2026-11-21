<?php
declare(strict_types=1);

const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const COLLECTIONS = ['menu', 'orders', 'inventory', 'purchases'];

function sendCorsHeaders(): void
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function respond(int $status, array $body): never
{
    sendCorsHeaders();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody(): array
{
    $input = fopen('php://input', 'rb');
    if ($input === false) {
        respond(400, ['error' => 'Could not read request body']);
    }
    $body = fread($input, MAX_REQUEST_BYTES + 1);
    fclose($input);
    if ($body === false) {
        respond(400, ['error' => 'Could not read request body']);
    }
    if (strlen($body) > MAX_REQUEST_BYTES) {
        respond(413, ['error' => 'Request too large']);
    }
    try {
        $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        respond(400, ['error' => 'Invalid JSON']);
    }
    if (!is_array($data) || array_is_list($data)) {
        respond(400, ['error' => 'Expected a JSON object']);
    }
    return $data;
}

function connectDatabase(): PDO
{
    $databaseDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'database';
    if (!is_dir($databaseDirectory) && !mkdir($databaseDirectory, 0775, true) && !is_dir($databaseDirectory)) {
        throw new RuntimeException('Could not create the database directory.');
    }

    $database = new PDO('sqlite:' . $databaseDirectory . DIRECTORY_SEPARATOR . 'canteen.sqlite');
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->exec('PRAGMA foreign_keys = ON');
    $schema = file_get_contents($databaseDirectory . DIRECTORY_SEPARATOR . 'schema.sql');
    if ($schema === false) {
        throw new RuntimeException('Could not read the database schema.');
    }
    $database->exec($schema);

    // Seed Demo Student account if missing
    $stmt = $database->prepare('SELECT COUNT(*) FROM students WHERE LOWER(name) = LOWER(:name)');
    $stmt->execute([':name' => 'Demo Student']);
    if ((int)$stmt->fetchColumn() === 0) {
        $insert = $database->prepare(
            'INSERT OR IGNORE INTO students (id, name, email, password, created_at) VALUES (:id, :name, :email, :password, :created_at)'
        );
        $insert->execute([
            ':id' => 'stu-demo',
            ':name' => 'Demo Student',
            ':email' => 'demo@campus.edu',
            ':password' => 'password123',
            ':created_at' => gmdate('c'),
        ]);
    }

    return $database;
}

function readData(PDO $database): array
{
    $data = [];
    foreach (COLLECTIONS as $collection) {
        $statement = $database->query("SELECT record_json FROM {$collection} ORDER BY position");
        $data[$collection] = array_map(
            static fn(string $json): array => json_decode($json, true, 512, JSON_THROW_ON_ERROR),
            $statement->fetchAll(PDO::FETCH_COLUMN)
        );
    }

    $metadata = $database->query('SELECT key, value_json FROM app_metadata');
    foreach ($metadata->fetchAll(PDO::FETCH_ASSOC) as $entry) {
        $data[$entry['key']] = json_decode($entry['value_json'], true, 512, JSON_THROW_ON_ERROR);
    }

    return $data;
}

function saveData(PDO $database, array $data): void
{
    foreach (COLLECTIONS as $collection) {
        if (!isset($data[$collection]) || !is_array($data[$collection]) || !array_is_list($data[$collection])) {
            throw new InvalidArgumentException("Expected {$collection} to be an array.");
        }
        $ids = [];
        foreach ($data[$collection] as $record) {
            if (!is_array($record) || !isset($record['id']) || !is_scalar($record['id']) || (string)$record['id'] === '') {
                throw new InvalidArgumentException("Every {$collection} record must have an ID.");
            }
            $id = (string)$record['id'];
            if (isset($ids[$id])) {
                throw new InvalidArgumentException("Duplicate ID in {$collection}.");
            }
            $ids[$id] = true;
        }
    }

    // Preserve any newly arrived user-web orders not yet present in the admin snapshot
    $existingOrdersStmt = $database->query('SELECT record_json FROM orders ORDER BY position');
    $existingOrders = array_map(
        static fn(string $json): array => json_decode($json, true, 512, JSON_THROW_ON_ERROR),
        $existingOrdersStmt->fetchAll(PDO::FETCH_COLUMN)
    );
    $incomingIds = [];
    foreach ($data['orders'] as $order) {
        $incomingIds[(string)$order['id']] = true;
    }
    $preservedUserOrders = [];
    foreach ($existingOrders as $existing) {
        $eid = (string)($existing['id'] ?? '');
        if (($existing['source'] ?? '') === 'user-web' && $eid !== '' && !isset($incomingIds[$eid])) {
            $preservedUserOrders[] = $existing;
        }
    }
    if (!empty($preservedUserOrders)) {
        $data['orders'] = array_merge($preservedUserOrders, $data['orders']);
    }

    $database->beginTransaction();
    try {
        foreach (COLLECTIONS as $collection) {
            $database->exec("DELETE FROM {$collection}");
            $statement = $database->prepare(
                "INSERT INTO {$collection} (id, position, record_json) VALUES (:id, :position, :record_json)"
            );
            foreach ($data[$collection] as $position => $record) {
                $statement->execute([
                    ':id' => (string)$record['id'],
                    ':position' => $position,
                    ':record_json' => json_encode(
                        $record,
                        JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                    )
                ]);
            }
        }

        $database->exec('DELETE FROM app_metadata');
        $metadataStatement = $database->prepare(
            'INSERT INTO app_metadata (key, value_json) VALUES (:key, :value_json)'
        );
        foreach ($data as $key => $value) {
            if (in_array($key, COLLECTIONS, true)) {
                continue;
            }
            $metadataStatement->execute([
                ':key' => (string)$key,
                ':value_json' => json_encode(
                    $value,
                    JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                )
            ]);
        }

        $database->commit();
    } catch (Throwable $error) {
        if ($database->inTransaction()) {
            $database->rollBack();
        }
        throw $error;
    }
}

function mapAdminNotificationRow(array $row): array
{
    return [
        'id' => $row['id'],
        'orderId' => $row['order_id'],
        'customerName' => $row['customer_name'],
        'regNo' => $row['reg_no'],
        'hostel' => $row['hostel'],
        'roomNo' => $row['room_no'],
        'phone' => $row['phone'],
        'fullAddress' => $row['full_address'],
        'items' => json_decode($row['items_json'], true, 512, JSON_THROW_ON_ERROR),
        'total' => (float)$row['total'],
        'paymentMethod' => $row['payment_method'],
        'paymentStatus' => $row['payment_status'],
        'estimatedMinutes' => (int)$row['estimated_minutes'],
        'status' => $row['status'],
        'isRead' => (bool)$row['is_read'],
        'receipt' => json_decode($row['receipt_json'], true, 512, JSON_THROW_ON_ERROR),
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function mapUserNotificationRow(array $row): array
{
    return [
        'id' => $row['id'],
        'orderId' => $row['order_id'],
        'studentName' => $row['student_name'],
        'status' => $row['status'],
        'title' => $row['title'],
        'message' => $row['message'],
        'isRead' => (bool)$row['is_read'],
        'createdAt' => $row['created_at'],
    ];
}

function handleGetNotifications(PDO $database): never
{
    $student = trim((string)($_GET['student'] ?? ''));

    $adminStmt = $database->query('SELECT * FROM admin_notifications ORDER BY created_at DESC');
    $adminNotifications = array_map('mapAdminNotificationRow', $adminStmt->fetchAll(PDO::FETCH_ASSOC));

    if ($student !== '') {
        $userStmt = $database->prepare(
            'SELECT * FROM user_notifications WHERE LOWER(student_name) = LOWER(:student) ORDER BY created_at DESC'
        );
        $userStmt->execute([':student' => $student]);
    } else {
        $userStmt = $database->query('SELECT * FROM user_notifications ORDER BY created_at DESC');
    }
    $userNotifications = array_map('mapUserNotificationRow', $userStmt->fetchAll(PDO::FETCH_ASSOC));

    $ordersStmt = $database->query('SELECT record_json FROM orders ORDER BY position');
    $allOrders = array_map(
        static fn(string $json): array => json_decode($json, true, 512, JSON_THROW_ON_ERROR),
        $ordersStmt->fetchAll(PDO::FETCH_COLUMN)
    );

    if ($student !== '') {
        $filteredOrders = array_values(array_filter(
            $allOrders,
            static function (array $order) use ($student): bool {
                $acc = (string)($order['studentAccountName'] ?? $order['customer'] ?? '');
                return strcasecmp($acc, $student) === 0;
            }
        ));
    } else {
        $filteredOrders = $allOrders;
    }

    respond(200, [
        'adminNotifications' => $adminNotifications,
        'userNotifications' => $userNotifications,
        'orders' => $filteredOrders,
    ]);
}

function handleCreateUserOrder(PDO $database): never
{
    $payload = readJsonBody();
    $orderId = trim((string)($payload['orderId'] ?? ''));
    $student = $payload['student'] ?? [];
    $items = $payload['items'] ?? [];
    $total = (float)($payload['total'] ?? 0);

    if ($orderId === '' || !is_array($student) || !is_array($items) || empty($items)) {
        respond(400, ['error' => 'Order ID, student details, and at least one item are required.']);
    }

    $studentName = trim((string)($payload['studentAccountName'] ?? $student['name'] ?? 'Campus Student'));
    $customerName = trim((string)($student['name'] ?? $studentName));
    $regNo = trim((string)($student['regNo'] ?? ''));
    $hostel = trim((string)($student['hostel'] ?? 'Boys Hostel'));
    $roomNo = trim((string)($student['roomNo'] ?? ''));
    $phone = trim((string)($student['phone'] ?? ''));
    $fullAddress = trim((string)($student['fullAddress'] ?? "{$hostel}, Room No. {$roomNo}, College Campus"));
    $paymentMethod = trim((string)($payload['paymentMethod'] ?? 'UPI'));
    $paymentStatus = trim((string)($payload['paymentStatus'] ?? ($paymentMethod === 'UPI' ? 'Paid via UPI' : 'Cash on Delivery')));
    $estimatedMinutes = (int)($payload['estimatedMinutes'] ?? 6);
    $nowIso = gmdate('c');
    $timeDisplay = date('h:i A');
    $dayKey = date('Y-m-d');

    // Look up menu prep costs if available
    $menuStmt = $database->query('SELECT record_json FROM menu');
    $menuCosts = [];
    foreach ($menuStmt->fetchAll(PDO::FETCH_COLUMN) as $json) {
        $m = json_decode($json, true);
        if (is_array($m) && isset($m['name'], $m['costPerServing'])) {
            $menuCosts[strtolower((string)$m['name'])] = (float)$m['costPerServing'];
        }
    }

    $adminItems = [];
    foreach ($items as $item) {
        $name = (string)($item['name'] ?? 'Item');
        $qty = max(1, (int)($item['qty'] ?? 1));
        $unitPrice = (float)($item['price'] ?? $item['unitPrice'] ?? 0);
        $unitCost = $menuCosts[strtolower($name)] ?? round($unitPrice * 0.45, 2);
        $adminItems[] = [
            'name' => $name,
            'qty' => $qty,
            'unitPrice' => $unitPrice,
            'unitCost' => $unitCost,
        ];
    }

    $orderRecord = [
        'id' => $orderId,
        'customer' => $customerName,
        'studentAccountName' => $studentName,
        'items' => $adminItems,
        'total' => $total,
        'status' => 'Preparing',
        'time' => $timeDisplay,
        'payment' => strtoupper($paymentMethod) === 'UPI' ? 'UPI' : 'Cash',
        'paymentMethod' => $paymentMethod,
        'paymentStatus' => $paymentStatus,
        'day' => $dayKey,
        'source' => 'user-web',
        'student' => [
            'name' => $customerName,
            'regNo' => $regNo,
            'hostel' => $hostel,
            'roomNo' => $roomNo,
            'phone' => $phone,
            'fullAddress' => $fullAddress,
        ],
        'estimatedMinutes' => $estimatedMinutes,
        'dateTime' => (string)($payload['dateTime'] ?? date('d M Y, h:i A')),
        'receipt' => $payload,
    ];

    $adminNotifId = 'an-' . $orderId . '-' . bin2hex(random_bytes(3));
    $userNotifId = 'un-' . $orderId . '-' . bin2hex(random_bytes(3));

    $database->beginTransaction();
    try {
        // Shift existing order positions down by 1 so the new order appears at top
        $database->exec('UPDATE orders SET position = position + 1');
        $orderStmt = $database->prepare(
            'INSERT OR REPLACE INTO orders (id, position, record_json) VALUES (:id, 0, :record_json)'
        );
        $orderStmt->execute([
            ':id' => $orderId,
            ':record_json' => json_encode($orderRecord, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

        $adminStmt = $database->prepare(
            'INSERT INTO admin_notifications (
                id, order_id, customer_name, reg_no, hostel, room_no, phone, full_address,
                items_json, total, payment_method, payment_status, estimated_minutes,
                status, is_read, receipt_json, created_at, updated_at
            ) VALUES (
                :id, :order_id, :customer_name, :reg_no, :hostel, :room_no, :phone, :full_address,
                :items_json, :total, :payment_method, :payment_status, :estimated_minutes,
                :status, 0, :receipt_json, :created_at, :updated_at
            )'
        );
        $adminStmt->execute([
            ':id' => $adminNotifId,
            ':order_id' => $orderId,
            ':customer_name' => $customerName,
            ':reg_no' => $regNo,
            ':hostel' => $hostel,
            ':room_no' => $roomNo,
            ':phone' => $phone,
            ':full_address' => $fullAddress,
            ':items_json' => json_encode($items, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':total' => $total,
            ':payment_method' => $paymentMethod,
            ':payment_status' => $paymentStatus,
            ':estimated_minutes' => $estimatedMinutes,
            ':status' => 'Preparing',
            ':receipt_json' => json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':created_at' => $nowIso,
            ':updated_at' => $nowIso,
        ]);

        $userStmt = $database->prepare(
            'INSERT INTO user_notifications (id, order_id, student_name, status, title, message, is_read, created_at)
             VALUES (:id, :order_id, :student_name, :status, :title, :message, 0, :created_at)'
        );
        $userStmt->execute([
            ':id' => $userNotifId,
            ':order_id' => $orderId,
            ':student_name' => $studentName,
            ':status' => 'Preparing',
            ':title' => 'Order Receipt Received',
            ':message' => "Order #{$orderId} receipt sent to Royal's Canteen kitchen. Preparing your order!",
            ':created_at' => $nowIso,
        ]);

        $database->commit();
    } catch (Throwable $error) {
        if ($database->inTransaction()) {
            $database->rollBack();
        }
        throw $error;
    }

    respond(201, [
        'ok' => true,
        'order' => $orderRecord,
        'adminNotificationId' => $adminNotifId,
        'userNotificationId' => $userNotifId,
    ]);
}

function handleUpdateOrderStatus(PDO $database): never
{
    $payload = readJsonBody();
    $orderId = trim((string)($payload['orderId'] ?? ''));
    $status = trim((string)($payload['status'] ?? ''));

    if ($orderId === '' || !in_array($status, ['Preparing', 'Ready', 'Completed', 'Cancelled'], true)) {
        respond(400, ['error' => 'Valid orderId and status (Preparing, Ready, Completed, Cancelled) are required.']);
    }

    $nowIso = gmdate('c');
    $studentName = '';
    $fullAddress = 'your hostel room';

    $database->beginTransaction();
    try {
        $stmt = $database->prepare('SELECT record_json FROM orders WHERE id = :id');
        $stmt->execute([':id' => $orderId]);
        $orderJson = $stmt->fetchColumn();
        if ($orderJson !== false) {
            $order = json_decode((string)$orderJson, true, 512, JSON_THROW_ON_ERROR);
            $order['status'] = $status;
            $studentName = (string)($order['studentAccountName'] ?? $order['customer'] ?? '');
            if (isset($order['student']['fullAddress'])) {
                $fullAddress = (string)$order['student']['fullAddress'];
            }
            $updateOrder = $database->prepare('UPDATE orders SET record_json = :json WHERE id = :id');
            $updateOrder->execute([
                ':json' => json_encode($order, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ':id' => $orderId,
            ]);
        }

        $notifCheck = $database->prepare('SELECT * FROM admin_notifications WHERE order_id = :order_id LIMIT 1');
        $notifCheck->execute([':order_id' => $orderId]);
        $adminNotif = $notifCheck->fetch(PDO::FETCH_ASSOC);
        if ($adminNotif !== false) {
            if ($studentName === '') {
                $receipt = json_decode((string)$adminNotif['receipt_json'], true);
                $studentName = (string)($receipt['studentAccountName'] ?? $adminNotif['customer_name'] ?? '');
            }
            if (!empty($adminNotif['full_address'])) {
                $fullAddress = (string)$adminNotif['full_address'];
            }
            $updateAdminNotif = $database->prepare(
                'UPDATE admin_notifications SET status = :status, is_read = 1, updated_at = :updated_at WHERE order_id = :order_id'
            );
            $updateAdminNotif->execute([
                ':status' => $status,
                ':updated_at' => $nowIso,
                ':order_id' => $orderId,
            ]);
        }

        $userNotification = null;
        if ($studentName !== '' && in_array($status, ['Ready', 'Completed', 'Cancelled'], true)) {
            if ($status === 'Ready') {
                $title = 'Order Ready!';
                $message = "Order #{$orderId} is Ready at Royal's Canteen kitchen and being packed for {$fullAddress}.";
            } elseif ($status === 'Completed') {
                $title = 'The delivery coming near to the user';
                $message = "The delivery coming near to the user! Order #{$orderId} is completed and arriving near {$fullAddress}.";
            } else {
                $title = 'Order Cancelled';
                $message = "Order #{$orderId} was cancelled by Royal's Canteen.";
            }

            $userNotifId = 'un-' . $orderId . '-' . strtolower($status) . '-' . bin2hex(random_bytes(3));
            $insertUserNotif = $database->prepare(
                'INSERT INTO user_notifications (id, order_id, student_name, status, title, message, is_read, created_at)
                 VALUES (:id, :order_id, :student_name, :status, :title, :message, 0, :created_at)'
            );
            $insertUserNotif->execute([
                ':id' => $userNotifId,
                ':order_id' => $orderId,
                ':student_name' => $studentName,
                ':status' => $status,
                ':title' => $title,
                ':message' => $message,
                ':created_at' => $nowIso,
            ]);

            $userNotification = [
                'id' => $userNotifId,
                'orderId' => $orderId,
                'studentName' => $studentName,
                'status' => $status,
                'title' => $title,
                'message' => $message,
                'isRead' => false,
                'createdAt' => $nowIso,
            ];
        }

        $database->commit();
    } catch (Throwable $error) {
        if ($database->inTransaction()) {
            $database->rollBack();
        }
        throw $error;
    }

    respond(200, [
        'ok' => true,
        'orderId' => $orderId,
        'status' => $status,
        'userNotification' => $userNotification,
    ]);
}

function handleMarkNotificationsRead(PDO $database): never
{
    $payload = readJsonBody();
    $target = (string)($payload['target'] ?? 'admin');
    $id = trim((string)($payload['id'] ?? ''));
    $studentName = trim((string)($payload['studentName'] ?? ''));

    if ($target === 'admin') {
        if ($id !== '') {
            $stmt = $database->prepare('UPDATE admin_notifications SET is_read = 1 WHERE id = :id');
            $stmt->execute([':id' => $id]);
        } else {
            $database->exec('UPDATE admin_notifications SET is_read = 1');
        }
    } else {
        if ($id !== '') {
            $stmt = $database->prepare('UPDATE user_notifications SET is_read = 1 WHERE id = :id');
            $stmt->execute([':id' => $id]);
        } elseif ($studentName !== '') {
            $stmt = $database->prepare('UPDATE user_notifications SET is_read = 1 WHERE LOWER(student_name) = LOWER(:student)');
            $stmt->execute([':student' => $studentName]);
        } else {
            $database->exec('UPDATE user_notifications SET is_read = 1');
        }
    }

    respond(200, ['ok' => true]);
}

function handleStudentRegister(PDO $database): never
{
    $payload = readJsonBody();
    $name = trim((string)($payload['name'] ?? ''));
    $email = strtolower(trim((string)($payload['email'] ?? '')));
    $password = (string)($payload['password'] ?? '');

    if ($name === '' || $email === '' || strlen($password) < 4) {
        respond(400, ['error' => 'Name, email, and password (min 4 chars) are required.']);
    }

    $check = $database->prepare('SELECT id FROM students WHERE LOWER(name) = LOWER(:name) OR LOWER(email) = LOWER(:email)');
    $check->execute([':name' => $name, ':email' => $email]);
    if ($check->fetchColumn() !== false) {
        respond(409, ['error' => 'A student with this name or email is already registered.']);
    }

    $id = 'stu-' . bin2hex(random_bytes(4));
    $createdAt = gmdate('c');
    $insert = $database->prepare(
        'INSERT INTO students (id, name, email, password, created_at) VALUES (:id, :name, :email, :password, :created_at)'
    );
    $insert->execute([
        ':id' => $id,
        ':name' => $name,
        ':email' => $email,
        ':password' => $password,
        ':created_at' => $createdAt,
    ]);

    respond(201, ['ok' => true, 'student' => ['id' => $id, 'name' => $name, 'email' => $email, 'createdAt' => $createdAt]]);
}

function handleStudentLogin(PDO $database): never
{
    $payload = readJsonBody();
    $name = trim((string)($payload['name'] ?? ''));
    $password = (string)($payload['password'] ?? '');

    $stmt = $database->prepare('SELECT id, name, email, password, created_at FROM students WHERE LOWER(name) = LOWER(:name)');
    $stmt->execute([':name' => $name]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user === false || $user['password'] !== $password) {
        respond(401, ['error' => 'Invalid Student Name or Password.']);
    }

    respond(200, [
        'ok' => true,
        'student' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'createdAt' => $user['created_at'],
        ],
    ]);
}

// Handle CORS preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    sendCorsHeaders();
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $database = connectDatabase();

    if ($path === '/api/data') {
        if ($method === 'GET') {
            $data = readData($database);
            $hasData = $database->query('SELECT EXISTS(SELECT 1 FROM app_metadata)')->fetchColumn()
                || $database->query('SELECT EXISTS(SELECT 1 FROM menu)')->fetchColumn()
                || $database->query('SELECT EXISTS(SELECT 1 FROM orders)')->fetchColumn()
                || $database->query('SELECT EXISTS(SELECT 1 FROM inventory)')->fetchColumn()
                || $database->query('SELECT EXISTS(SELECT 1 FROM purchases)')->fetchColumn();
            if (!$hasData) {
                respond(404, ['error' => 'No saved data']);
            }
            respond(200, $data);
        }

        if ($method === 'PUT') {
            $data = readJsonBody();
            try {
                saveData($database, $data);
            } catch (InvalidArgumentException $error) {
                respond(400, ['error' => $error->getMessage()]);
            }
            respond(200, ['saved' => true]);
        }

        header('Allow: GET, PUT, OPTIONS');
        respond(405, ['error' => 'Method not allowed']);
    }

    if ($path === '/api/notifications' && $method === 'GET') {
        handleGetNotifications($database);
    }

    if ($path === '/api/orders/user' && $method === 'POST') {
        handleCreateUserOrder($database);
    }

    if ($path === '/api/orders/status' && ($method === 'POST' || $method === 'PUT')) {
        handleUpdateOrderStatus($database);
    }

    if ($path === '/api/notifications/read' && $method === 'POST') {
        handleMarkNotificationsRead($database);
    }

    if ($path === '/api/students/register' && $method === 'POST') {
        handleStudentRegister($database);
    }

    if ($path === '/api/students/login' && $method === 'POST') {
        handleStudentLogin($database);
    }

    respond(404, ['error' => 'Not found']);
} catch (Throwable $error) {
    error_log('Canteen API error: ' . $error->getMessage());
    respond(500, ['error' => 'Database operation failed']);
}
