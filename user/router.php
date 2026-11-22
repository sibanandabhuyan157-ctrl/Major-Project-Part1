<?php
declare(strict_types=1);
$p = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (str_starts_with($p, '/api/')) { require __DIR__ . '/api.php'; return true; }
if ($p === '/' || $p === '/index.html') { header('Content-Type: text/html; charset=utf-8'); readfile(__DIR__ . '/index1.html'); return true; }
if (in_array($p, ['/index1.html', '/styles.css', '/user-app.js'], true)) return false;
if ($p === '/admin' || $p === '/admin/') $p = '/admin/index.html';
$m = ['index.html' => 'text/html', 'notifications.html' => 'text/html', 'notifications.js' => 'text/javascript', 'app.js' => 'text/javascript', 'styles.css' => 'text/css'];
if (str_starts_with($p, '/admin/') && isset($m[$f = substr($p, 7)])) {
  $fp = (is_file(dirname(__DIR__) . "/{$f}") ? dirname(__DIR__) . "/{$f}" : dirname(__DIR__) . "/Major Project Part 1/{$f}");
  if (is_file($fp)) { header("Content-Type: {$m[$f]}; charset=utf-8"); readfile($fp); return true; }
}
http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Not found';
