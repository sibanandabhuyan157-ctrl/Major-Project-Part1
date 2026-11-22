<?php
declare(strict_types=1);

const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const COLLECTIONS = ['menu', 'orders', 'inventory', 'purchases'];

function respond(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
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

if (parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) !== '/api/data') {
    respond(404, ['error' => 'Not found']);
}

try {
    $database = connectDatabase();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
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
        try {
            saveData($database, $data);
        } catch (InvalidArgumentException $error) {
            respond(400, ['error' => $error->getMessage()]);
        }
        respond(200, ['saved' => true]);
    }

    header('Allow: GET, PUT');
    respond(405, ['error' => 'Method not allowed']);
} catch (Throwable $error) {
    error_log('Canteen API error: ' . $error->getMessage());
    respond(500, ['error' => 'Database operation failed']);
}
