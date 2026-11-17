<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if ($path === '/api/data') {
    require __DIR__ . '/api.php';
    return true;
}

if (in_array($path, ['/', '/index.html', '/app.js', '/styles.css', '/inventory-check.html'], true)) {
    return false;
}

http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Not found';
