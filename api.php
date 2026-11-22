<?php
declare(strict_types=1);
const MAX_BYTES = 2 * 1024 * 1024;
const COLS = ['menu', 'orders', 'inventory', 'purchases'];
const JFLAGS = JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

function cors(): void { header('Access-Control-Allow-Origin: *'); header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS'); header('Access-Control-Allow-Headers: Content-Type'); }
function out(int $s, array $b): never { cors(); http_response_code($s); header('Content-Type: application/json; charset=utf-8'); echo json_encode($b, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function body(): array {
  $fp = fopen('php://input', 'rb'); $raw = $fp ? fread($fp, MAX_BYTES + 1) : false; if ($fp) fclose($fp);
  if ($raw === false) out(400, ['error' => 'Could not read body']);
  if (strlen($raw) > MAX_BYTES) out(413, ['error' => 'Request too large']);
  try { $d = json_decode($raw, true, 512, JSON_THROW_ON_ERROR); } catch (JsonException) { out(400, ['error' => 'Invalid JSON']); }
  if (!is_array($d) || array_is_list($d)) out(400, ['error' => 'Expected JSON object']);
  return $d;
}
function openDb(string $file, string $schema): PDO {
  $dir = __DIR__ . DIRECTORY_SEPARATOR . 'database';
  if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) throw new RuntimeException('DB dir error');
  $pdo = new PDO('sqlite:' . $dir . DIRECTORY_SEPARATOR . $file);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec('PRAGMA foreign_keys = ON');
  $pdo->exec((string)file_get_contents($dir . DIRECTORY_SEPARATOR . $schema));
  return $pdo;
}
function db(): PDO { return openDb('canteen.sqlite', 'schema.sql'); }
function usersDb(): PDO {
  $u = openDb('users.sqlite', 'users-schema.sql');
  $c = $u->prepare('SELECT COUNT(*) FROM users WHERE LOWER(name)=LOWER(?)'); $c->execute(['Demo Student']);
  if (!(int)$c->fetchColumn()) $u->prepare('INSERT OR IGNORE INTO users(id,name,email,password_hash,created_at) VALUES(?,?,?,?,?)')->execute(['stu-demo', 'Demo Student', 'demo@campus.edu', password_hash('password123', PASSWORD_DEFAULT), gmdate('c')]);
  return $u;
}
function historyDb(): PDO { return openDb('order-history.sqlite', 'order-history-schema.sql'); }

function readAll(PDO $db): array {
  $d = [];
  foreach (COLS as $c) $d[$c] = array_map(static fn(string $j) => json_decode($j, true, 512, JSON_THROW_ON_ERROR), $db->query("SELECT record_json FROM {$c} ORDER BY position")->fetchAll(PDO::FETCH_COLUMN));
  foreach ($db->query('SELECT key, value_json FROM app_metadata')->fetchAll(PDO::FETCH_ASSOC) as $r) $d[$r['key']] = json_decode($r['value_json'], true, 512, JSON_THROW_ON_ERROR);
  return $d;
}
function saveAll(PDO $db, array $d): void {
  foreach (COLS as $c) {
    if (!isset($d[$c]) || !is_array($d[$c]) || !array_is_list($d[$c])) throw new InvalidArgumentException("Expected {$c} array");
    $seen = [];
    foreach ($d[$c] as $r) {
      if (!is_array($r) || !isset($r['id']) || !is_scalar($r['id']) || (string)$r['id'] === '') throw new InvalidArgumentException("Missing ID in {$c}");
      $id = (string)$r['id']; if (isset($seen[$id])) throw new InvalidArgumentException("Duplicate ID in {$c}"); $seen[$id] = true;
    }
  }
  $inc = array_flip(array_map(static fn($o) => (string)$o['id'], $d['orders']));
  $keep = array_values(array_filter(array_map(static fn($j) => json_decode($j, true, 512, JSON_THROW_ON_ERROR), $db->query('SELECT record_json FROM orders ORDER BY position')->fetchAll(PDO::FETCH_COLUMN)), static fn($o) => ($o['source'] ?? '') === 'user-web' && !isset($inc[(string)($o['id'] ?? '')])));
  if ($keep) $d['orders'] = array_merge($keep, $d['orders']);
  $db->beginTransaction();
  try {
    foreach (COLS as $c) { $db->exec("DELETE FROM {$c}"); $st = $db->prepare("INSERT INTO {$c} VALUES(?,?,?)"); foreach ($d[$c] as $i => $r) $st->execute([(string)$r['id'], $i, json_encode($r, JFLAGS)]); }
    $db->exec('DELETE FROM app_metadata'); $ms = $db->prepare('INSERT INTO app_metadata VALUES(?,?)');
    foreach ($d as $k => $v) if (!in_array($k, COLS, true)) $ms->execute([(string)$k, json_encode($v, JFLAGS)]);
    $db->commit();
  } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
}
function mapAN(array $r): array { return ['id' => $r['id'], 'orderId' => $r['order_id'], 'customerName' => $r['customer_name'], 'regNo' => $r['reg_no'], 'hostel' => $r['hostel'], 'roomNo' => $r['room_no'], 'phone' => $r['phone'], 'fullAddress' => $r['full_address'], 'items' => json_decode($r['items_json'], true, 512, JSON_THROW_ON_ERROR), 'total' => (float)$r['total'], 'paymentMethod' => $r['payment_method'], 'paymentStatus' => $r['payment_status'], 'estimatedMinutes' => (int)$r['estimated_minutes'], 'status' => $r['status'], 'isRead' => (bool)$r['is_read'], 'receipt' => json_decode($r['receipt_json'], true, 512, JSON_THROW_ON_ERROR), 'createdAt' => $r['created_at'], 'updatedAt' => $r['updated_at']]; }
function mapUN(array $r): array { return ['id' => $r['id'], 'orderId' => $r['order_id'], 'studentName' => $r['student_name'], 'status' => $r['status'], 'title' => $r['title'], 'message' => $r['message'], 'isRead' => (bool)$r['is_read'], 'createdAt' => $r['created_at']]; }
function mapHist(array $r): array { return ['orderId' => $r['order_id'], 'studentAccountName' => $r['student_name'], 'student' => ['name' => $r['customer_name'], 'regNo' => $r['reg_no'], 'hostel' => $r['hostel'], 'roomNo' => $r['room_no'], 'phone' => $r['phone'], 'fullAddress' => $r['full_address']], 'items' => json_decode($r['items_json'], true, 512, JSON_THROW_ON_ERROR), 'total' => (float)$r['total'], 'paymentMethod' => $r['payment_method'], 'paymentStatus' => $r['payment_status'], 'estimatedMinutes' => (int)$r['estimated_minutes'], 'status' => $r['status'], 'dateTime' => json_decode($r['receipt_json'], true)['dateTime'] ?? $r['created_at'], 'createdAt' => $r['created_at'], 'updatedAt' => $r['updated_at']]; }

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { cors(); http_response_code(204); exit; }
$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
try {
  $db = db();
  if ($path === '/api/data') {
    if ($method === 'GET') {
      $has = false; foreach (array_merge(['app_metadata'], COLS) as $t) if ($db->query("SELECT EXISTS(SELECT 1 FROM {$t})")->fetchColumn()) { $has = true; break; }
      if (!$has) out(404, ['error' => 'No saved data']);
      out(200, readAll($db));
    }
    if ($method === 'PUT') { try { saveAll($db, body()); } catch (InvalidArgumentException $e) { out(400, ['error' => $e->getMessage()]); } out(200, ['saved' => true]); }
    header('Allow: GET, PUT, OPTIONS'); out(405, ['error' => 'Method not allowed']);
  }
  if ($path === '/api/admin/users' && $method === 'GET') {
    $udb = usersDb(); $hdb = historyDb();
    // Query strictly from admin_users_view (password_hash column is never selected or exposed)
    $rows = $udb->query('SELECT id, name, email, reg_no, hostel, room_no, phone, created_at, last_order_at FROM admin_users_view ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
    $stats = [];
    foreach ($hdb->query('SELECT LOWER(student_name) AS sk, COUNT(*) AS cnt, COALESCE(SUM(total),0) AS spent FROM order_history GROUP BY LOWER(student_name)')->fetchAll(PDO::FETCH_ASSOC) as $s) $stats[$s['sk']] = $s;
    $users = array_map(static function (array $r) use ($stats): array {
      $st = $stats[strtolower($r['name'])] ?? ['cnt' => 0, 'spent' => 0];
      return ['id' => $r['id'], 'name' => $r['name'], 'email' => $r['email'], 'regNo' => $r['reg_no'], 'hostel' => $r['hostel'], 'roomNo' => $r['room_no'], 'phone' => $r['phone'], 'createdAt' => $r['created_at'], 'lastOrderAt' => $r['last_order_at'], 'orderCount' => (int)$st['cnt'], 'totalSpent' => (float)$st['spent']];
    }, $rows);
    out(200, ['users' => $users, 'passwordProtected' => true]);
  }
  if ($path === '/api/order-history' && $method === 'GET') {
    $hdb = historyDb(); $stu = trim((string)($_GET['student'] ?? ''));
    if ($stu !== '') { $st = $hdb->prepare('SELECT * FROM order_history WHERE LOWER(student_name)=LOWER(?) ORDER BY created_at DESC'); $st->execute([$stu]); $rows = $st->fetchAll(PDO::FETCH_ASSOC); }
    else $rows = $hdb->query('SELECT * FROM order_history ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
    out(200, ['history' => array_map('mapHist', $rows)]);
  }
  if ($path === '/api/notifications' && $method === 'GET') {
    $stu = trim((string)($_GET['student'] ?? ''));
    $an = array_map('mapAN', $db->query('SELECT * FROM admin_notifications ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC));
    if ($stu !== '') { $st = $db->prepare('SELECT * FROM user_notifications WHERE LOWER(student_name)=LOWER(?) ORDER BY created_at DESC'); $st->execute([$stu]); $un = array_map('mapUN', $st->fetchAll(PDO::FETCH_ASSOC)); }
    else $un = array_map('mapUN', $db->query('SELECT * FROM user_notifications ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC));
    $orders = array_map(static fn($j) => json_decode($j, true, 512, JSON_THROW_ON_ERROR), $db->query('SELECT record_json FROM orders ORDER BY position')->fetchAll(PDO::FETCH_COLUMN));
    if ($stu !== '') $orders = array_values(array_filter($orders, static fn($o) => strcasecmp((string)($o['studentAccountName'] ?? $o['customer'] ?? ''), $stu) === 0));
    out(200, ['adminNotifications' => $an, 'userNotifications' => $un, 'orders' => $orders]);
  }
  if ($path === '/api/orders/user' && $method === 'POST') {
    $p = body(); $oid = trim((string)($p['orderId'] ?? '')); $s = $p['student'] ?? []; $items = $p['items'] ?? [];
    if ($oid === '' || !is_array($s) || !is_array($items) || !$items) out(400, ['error' => 'Invalid order']);
    $sn = trim((string)($p['studentAccountName'] ?? $s['name'] ?? 'Campus Student')); $cn = trim((string)($s['name'] ?? $sn));
    $reg = trim((string)($s['regNo'] ?? '')); $h = trim((string)($s['hostel'] ?? 'Boys Hostel')); $rm = trim((string)($s['roomNo'] ?? '')); $ph = trim((string)($s['phone'] ?? ''));
    $addr = trim((string)($s['fullAddress'] ?? "{$h}, Room No. {$rm}, College Campus"));
    $pm = trim((string)($p['paymentMethod'] ?? 'UPI')); $ps = trim((string)($p['paymentStatus'] ?? ($pm === 'UPI' ? 'Paid via UPI' : 'Cash on Delivery')));
    $est = (int)($p['estimatedMinutes'] ?? 6); $tot = (float)($p['total'] ?? 0); $now = gmdate('c');
    $costs = []; foreach ($db->query('SELECT record_json FROM menu')->fetchAll(PDO::FETCH_COLUMN) as $j) { $m = json_decode($j, true); if (isset($m['name'], $m['costPerServing'])) $costs[strtolower((string)$m['name'])] = (float)$m['costPerServing']; }
    $aitems = array_map(static fn($it) => ['name' => (string)($it['name'] ?? 'Item'), 'qty' => max(1, (int)($it['qty'] ?? 1)), 'unitPrice' => (float)($it['price'] ?? $it['unitPrice'] ?? 0), 'unitCost' => $costs[strtolower((string)($it['name'] ?? ''))] ?? round((float)($it['price'] ?? 0) * 0.45, 2)], $items);
    $ord = ['id' => $oid, 'customer' => $cn, 'studentAccountName' => $sn, 'items' => $aitems, 'total' => $tot, 'status' => 'Preparing', 'time' => date('h:i A'), 'payment' => strtoupper($pm) === 'UPI' ? 'UPI' : 'Cash', 'paymentMethod' => $pm, 'paymentStatus' => $ps, 'day' => date('Y-m-d'), 'source' => 'user-web', 'student' => ['name' => $cn, 'regNo' => $reg, 'hostel' => $h, 'roomNo' => $rm, 'phone' => $ph, 'fullAddress' => $addr], 'estimatedMinutes' => $est, 'dateTime' => (string)($p['dateTime'] ?? date('d M Y, h:i A')), 'receipt' => $p];
    $anid = 'an-' . $oid . '-' . bin2hex(random_bytes(3)); $unid = 'un-' . $oid . '-' . bin2hex(random_bytes(3));
    $itemsJson = json_encode($items, JFLAGS); $recJson = json_encode($p, JFLAGS);
    $db->beginTransaction();
    try {
      $db->exec('UPDATE orders SET position = position + 1');
      $db->prepare('INSERT OR REPLACE INTO orders VALUES(?,0,?)')->execute([$oid, json_encode($ord, JFLAGS)]);
      $db->prepare('INSERT INTO admin_notifications VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,?,?)')->execute([$anid, $oid, $cn, $reg, $h, $rm, $ph, $addr, $itemsJson, $tot, $pm, $ps, $est, 'Preparing', $recJson, $now, $now]);
      $db->prepare('INSERT INTO user_notifications VALUES(?,?,?,?,?,?,0,?)')->execute([$unid, $oid, $sn, 'Preparing', 'Order Receipt Received', "Order #{$oid} receipt sent to Royal's Canteen kitchen. Preparing your order!", $now]);
      $db->commit();
    } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
    // Save to separate Order History DB + update student profile details in separate Users DB
    historyDb()->prepare('INSERT OR REPLACE INTO order_history VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')->execute([$oid, $sn, $cn, $reg, $h, $rm, $ph, $addr, $itemsJson, $tot, $pm, $ps, $est, 'Preparing', $recJson, $now, $now]);
    usersDb()->prepare('UPDATE users SET reg_no=?, hostel=?, room_no=?, phone=?, last_order_at=? WHERE LOWER(name)=LOWER(?)')->execute([$reg, $h, $rm, $ph, $now, $sn]);
    out(201, ['ok' => true, 'order' => $ord, 'adminNotificationId' => $anid, 'userNotificationId' => $unid]);
  }
  if ($path === '/api/orders/status' && ($method === 'POST' || $method === 'PUT')) {
    $p = body(); $oid = trim((string)($p['orderId'] ?? '')); $st = trim((string)($p['status'] ?? ''));
    if ($oid === '' || !in_array($st, ['Preparing', 'Ready', 'Completed', 'Cancelled'], true)) out(400, ['error' => 'Invalid orderId or status']);
    $now = gmdate('c'); $sn = ''; $addr = 'your hostel room'; $un = null;
    $db->beginTransaction();
    try {
      $q = $db->prepare('SELECT record_json FROM orders WHERE id=?'); $q->execute([$oid]);
      if (($j = $q->fetchColumn()) !== false) {
        $o = json_decode((string)$j, true, 512, JSON_THROW_ON_ERROR); $o['status'] = $st;
        $sn = (string)($o['studentAccountName'] ?? $o['customer'] ?? ''); if (!empty($o['student']['fullAddress'])) $addr = (string)$o['student']['fullAddress'];
        $db->prepare('UPDATE orders SET record_json=? WHERE id=?')->execute([json_encode($o, JFLAGS), $oid]);
      }
      $aq = $db->prepare('SELECT * FROM admin_notifications WHERE order_id=? LIMIT 1'); $aq->execute([$oid]);
      if (($ar = $aq->fetch(PDO::FETCH_ASSOC)) !== false) {
        if ($sn === '') { $rc = json_decode((string)$ar['receipt_json'], true); $sn = (string)($rc['studentAccountName'] ?? $ar['customer_name'] ?? ''); }
        if (!empty($ar['full_address'])) $addr = (string)$ar['full_address'];
        $db->prepare('UPDATE admin_notifications SET status=?, is_read=1, updated_at=? WHERE order_id=?')->execute([$st, $now, $oid]);
      }
      if ($sn !== '' && in_array($st, ['Ready', 'Completed', 'Cancelled'], true)) {
        [$t, $m] = $st === 'Ready' ? ['Order Ready!', "Order #{$oid} is Ready at Royal's Canteen kitchen and being packed for {$addr}."] : ($st === 'Completed' ? ['The delivery coming near to the user', "The delivery coming near to the user! Order #{$oid} is completed and arriving near {$addr}."] : ['Order Cancelled', "Order #{$oid} was cancelled by Royal's Canteen."]);
        $unid = 'un-' . $oid . '-' . strtolower($st) . '-' . bin2hex(random_bytes(3));
        $db->prepare('INSERT INTO user_notifications VALUES(?,?,?,?,?,?,0,?)')->execute([$unid, $oid, $sn, $st, $t, $m, $now]);
        $un = ['id' => $unid, 'orderId' => $oid, 'studentName' => $sn, 'status' => $st, 'title' => $t, 'message' => $m, 'isRead' => false, 'createdAt' => $now];
      }
      $db->commit();
    } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
    historyDb()->prepare('UPDATE order_history SET status=?, updated_at=? WHERE order_id=?')->execute([$st, $now, $oid]);
    out(200, ['ok' => true, 'orderId' => $oid, 'status' => $st, 'userNotification' => $un]);
  }
  if ($path === '/api/notifications/read' && $method === 'POST') {
    $p = body(); $tgt = (string)($p['target'] ?? 'admin'); $id = trim((string)($p['id'] ?? '')); $sn = trim((string)($p['studentName'] ?? ''));
    $tbl = $tgt === 'admin' ? 'admin_notifications' : 'user_notifications';
    if ($id !== '') $db->prepare("UPDATE {$tbl} SET is_read=1 WHERE id=?")->execute([$id]);
    elseif ($tgt === 'user' && $sn !== '') $db->prepare('UPDATE user_notifications SET is_read=1 WHERE LOWER(student_name)=LOWER(?)')->execute([$sn]);
    else $db->exec("UPDATE {$tbl} SET is_read=1");
    out(200, ['ok' => true]);
  }
  if ($path === '/api/students/register' && $method === 'POST') {
    $p = body(); $n = trim((string)($p['name'] ?? '')); $e = strtolower(trim((string)($p['email'] ?? ''))); $pw = (string)($p['password'] ?? '');
    if ($n === '' || $e === '' || strlen($pw) < 4) out(400, ['error' => 'Name, email & password (min 4) required']);
    $udb = usersDb();
    $chk = $udb->prepare('SELECT id FROM users WHERE LOWER(name)=LOWER(?) OR LOWER(email)=LOWER(?)'); $chk->execute([$n, $e]);
    if ($chk->fetchColumn() !== false) out(409, ['error' => 'Student already registered']);
    $id = 'stu-' . bin2hex(random_bytes(4)); $at = gmdate('c');
    $udb->prepare('INSERT INTO users(id,name,email,password_hash,created_at) VALUES(?,?,?,?,?)')->execute([$id, $n, $e, password_hash($pw, PASSWORD_DEFAULT), $at]);
    out(201, ['ok' => true, 'student' => ['id' => $id, 'name' => $n, 'email' => $e, 'createdAt' => $at]]);
  }
  if ($path === '/api/students/login' && $method === 'POST') {
    $p = body(); $st = usersDb()->prepare('SELECT id, name, email, password_hash, reg_no, hostel, room_no, phone, created_at FROM users WHERE LOWER(name)=LOWER(?)');
    $st->execute([trim((string)($p['name'] ?? ''))]); $u = $st->fetch(PDO::FETCH_ASSOC);
    if (!$u || !password_verify((string)($p['password'] ?? ''), $u['password_hash'])) out(401, ['error' => 'Invalid credentials']);
    out(200, ['ok' => true, 'student' => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'regNo' => $u['reg_no'], 'hostel' => $u['hostel'], 'roomNo' => $u['room_no'], 'phone' => $u['phone'], 'createdAt' => $u['created_at']]]);
  }
  out(404, ['error' => 'Not found']);
} catch (Throwable $e) { error_log('Canteen API error: ' . $e->getMessage()); out(500, ['error' => 'Database error']); }
