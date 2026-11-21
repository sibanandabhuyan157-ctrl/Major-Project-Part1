<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if (str_starts_with($path, '/api/')) {
    require __DIR__ . '/api.php';
    return true;
}

if ($path === '/' || $path === '/index.html') {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index1.html');
    return true;
}

if (in_array($path, ['/index1.html', '/styles.css', '/user-app.js'], true)) {
    return false;
}

// Serve connected Major Project Part 1 Admin portal under /admin/*
if ($path === '/admin' || $path === '/admin/') {
    $path = '/admin/index.html';
}
if (str_starts_with($path, '/admin/')) {
    $relative = substr($path, strlen('/admin/'));
    $allowedAdminFiles = [
        'index.html' => 'text/html; charset=utf-8',
        'notifications.html' => 'text/html; charset=utf-8',
        'notifications.js' => 'text/javascript; charset=utf-8',
        'app.js' => 'text/javascript; charset=utf-8',
        'styles.css' => 'text/css; charset=utf-8',
    ];
    if (isset($allowedAdminFiles[$relative])) {
        $filePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Major Project Part 1' . DIRECTORY_SEPARATOR . $relative;
        if (is_file($filePath)) {
            header('Content-Type: ' . $allowedAdminFiles[$relative]);
            readfile($filePath);
            return true;
        }
    }
}

http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Not found';
