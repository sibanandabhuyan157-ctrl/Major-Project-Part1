<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if (str_starts_with($path, '/api/')) {
    require __DIR__ . '/api.php';
    return true;
}

if (in_array($path, ['/', '/index.html', '/notifications.html', '/notifications.js', '/app.js', '/styles.css', '/inventory-check.html'], true)) {
    return false;
}

// Serve connected User Web portal under /user/*
if ($path === '/user' || $path === '/user/') {
    $path = '/user/index1.html';
}
if (str_starts_with($path, '/user/')) {
    $relative = substr($path, strlen('/user/'));
    $allowedUserFiles = [
        'index1.html' => 'text/html; charset=utf-8',
        'styles.css' => 'text/css; charset=utf-8',
        'user-app.js' => 'text/javascript; charset=utf-8',
    ];
    if (isset($allowedUserFiles[$relative])) {
        $filePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'User Web' . DIRECTORY_SEPARATOR . $relative;
        if (is_file($filePath)) {
            header('Content-Type: ' . $allowedUserFiles[$relative]);
            readfile($filePath);
            return true;
        }
    }
}

http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Not found';
