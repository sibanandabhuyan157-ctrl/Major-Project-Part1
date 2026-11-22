<?php
declare(strict_types=1);
$p = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (str_starts_with($p, '/api/')) { require __DIR__ . '/api.php'; return true; }
if (in_array($p, ['/', '/index.html', '/notifications.html', '/notifications.js', '/app.js', '/styles.css', '/inventory-check.html'], true)) return false;
if ($p === '/user' || $p === '/user/') $p = '/user/index1.html';
$m = ['index1.html' => 'text/html', 'index.html' => 'text/html', 'styles.css' => 'text/css', 'user-app.js' => 'text/javascript'];
if (str_starts_with($p, '/user/') && isset($m[$f = substr($p, 6)])) {
  $fp = (is_file(__DIR__ . "/user/{$f}") ? __DIR__ . "/user/{$f}" : dirname(__DIR__) . "/User Web/{$f}");
  if (is_file($fp)) { header("Content-Type: {$m[$f]}; charset=utf-8"); readfile($fp); return true; }
}
http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Not found';
