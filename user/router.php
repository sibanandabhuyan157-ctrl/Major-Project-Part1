<?php
declare(strict_types=1);
$p = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (str_starts_with($p, '/api/')) { require __DIR__ . '/api.php'; return true; }
if ($p === '/' || $p === '/index.html') { header('Content-Type: text/html; charset=utf-8'); readfile(__DIR__ . '/index1.html'); return true; }
if (in_array($p, ['/index1.html', '/styles.css', '/user-app.js'], true)) return false;
http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Not found';
