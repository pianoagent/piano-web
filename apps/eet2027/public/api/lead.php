<?php

declare(strict_types=1);

/**
 * POST /api/lead.php — příjem přihlášení k odběru na eet2027.cz.
 *
 * Kontakt se zapisuje VÝHRADNĚ do Ecomailu (seznam Piano B2B) se štítkem "eet2027.cz".
 * Žádný e-mail se neposílá: odběratel newsletteru není poptávka a nemá padat do Odoo.
 * Zájem o víc funkcí z pokladny nese štítek "eet2027: chce od POS víc", takže si ho
 * obchod umí v Ecomailu vysegmentovat sám.
 *
 * Když zápis selže, vrátíme chybu a formulář nabídne opakování. Nic se nezahazuje mlčky,
 * důvod selhání jde do error logu hostingu.
 *
 * API klíč se NEDÁVÁ do gitu. Bere se z prostředí (ECOMAIL_API_KEY), nebo ze
 * souboru ecomail-config.php, který vygeneruje deploy workflow z GitHub secrets.
 */

const ECOMAIL_LIST_ID = 8;          // Piano B2B
const ECOMAIL_TAG = 'eet2027.cz';   // štítek pro kontakty z tohoto webu

function json(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($body);
    exit;
}

/**
 * Diagnostika: GET /api/lead.php?diag=1
 * Neprozrazuje klíč, jen říká, jestli je na serveru k dispozici a co PHP umí.
 * Slouží k dohledání příčiny, když zápis do Ecomailu neprojde.
 */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && isset($_GET['diag'])) {
    $key = ecomail_api_key();
    json([
        'ok' => true,
        'klic_na_serveru' => $key !== '',
        'delka_klice' => strlen($key),
        'config_soubor' => is_file(__DIR__ . '/ecomail-config.php'),
        'curl' => function_exists('curl_init'),
        'allow_url_fopen' => (bool) ini_get('allow_url_fopen'),
        'php' => PHP_VERSION,
        'list_id' => ECOMAIL_LIST_ID,
    ]);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

$value = static fn (string $key): string => trim((string) ($_POST[$key] ?? ''));

// Honeypot — boti vyplní skryté pole "website" → tváříme se úspěšně, nic neposíláme
if ($value('website') !== '') {
    json(['ok' => true]);
}

// URL stránky bez CR/LF (ochrana proti injection)
$page = str_replace(["\r", "\n"], '', $value('page'));

$lead = [
    'variant' => $value('form_variant') ?: 'odber',
    'email' => $value('email'),
    'name' => $value('name'),
    'phone' => $value('phone'),
    'company' => $value('company'),
    'typ_podniku' => $value('typ_podniku'),
    'chci_vic_z_pos' => $value('chci_vic_z_pos'),
    'page' => $page,
];

if ($lead['email'] === '' || !filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    json(['ok' => false, 'error' => 'missing_email'], 422);
}

/** Načte API klíč z prostředí, nebo z vygenerovaného configu. */
function ecomail_api_key(): string
{
    $key = (string) getenv('ECOMAIL_API_KEY');
    if ($key !== '') {
        return $key;
    }
    $config = __DIR__ . '/ecomail-config.php';
    if (is_file($config)) {
        /** @psalm-suppress UnresolvableInclude */
        require_once $config;
        if (defined('ECOMAIL_API_KEY')) {
            return (string) constant('ECOMAIL_API_KEY');
        }
    }
    return '';
}

/**
 * Zapíše kontakt do Ecomailu. Vrací HTTP status odpovědi (0 = spojení selhalo).
 * update_existing = stávajícímu kontaktu jen přidá štítek, nevytvoří duplicitu.
 * resubscribe = false, odhlášené nepřihlašujeme zpět.
 */
function ecomail_subscribe(array $lead, string $apiKey, ?string &$detail = null): int
{
    $tags = [ECOMAIL_TAG];
    if ($lead['typ_podniku'] !== '') {
        $tags[] = $lead['typ_podniku'];
    }
    if ($lead['chci_vic_z_pos'] !== '') {
        $tags[] = 'eet2027: chce od POS víc';
    }

    $subscriber = ['email' => $lead['email'], 'tags' => $tags];
    if ($lead['name'] !== '') {
        $subscriber['name'] = $lead['name'];
    }
    if ($lead['phone'] !== '') {
        $subscriber['phone'] = $lead['phone'];
    }
    if ($lead['company'] !== '') {
        $subscriber['company'] = $lead['company'];
    }

    $payload = json_encode([
        'subscriber_data' => $subscriber,
        'trigger_autoresponders' => true,
        'update_existing' => true,
        'resubscribe' => false,
    ], JSON_UNESCAPED_UNICODE);

    $url = sprintf('https://api2.ecomailapp.cz/lists/%d/subscribe', ECOMAIL_LIST_ID);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'key: ' . $apiKey],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $detail = $status === 0 ? ('curl: ' . curl_error($ch)) : substr((string) $body, 0, 300);
        curl_close($ch);

        return $status;
    }

    // Fallback bez cURL
    $context = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\nkey: " . $apiKey . "\r\n",
        'content' => $payload,
        'timeout' => 10,
        'ignore_errors' => true,
    ]]);
    $response = @file_get_contents($url, false, $context);
    $detail = $response === false ? 'file_get_contents selhalo' : substr((string) $response, 0, 300);
    if ($response === false) {
        return 0;
    }
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('~^HTTP/\S+\s+(\d{3})~', $header, $m)) {
            return (int) $m[1];
        }
    }

    return 0;
}

$apiKey = ecomail_api_key();

if ($apiKey === '') {
    error_log('eet2027: chybí ECOMAIL_API_KEY, kontakt nebyl zapsán: ' . $lead['email']);
    json(['ok' => false, 'error' => 'ecomail_unavailable'], 503);
}

$detail = null;
$status = ecomail_subscribe($lead, $apiKey, $detail);

if ($status < 200 || $status >= 300) {
    error_log(sprintf('eet2027: Ecomail odmítl %s, status %d, odpověď: %s', $lead['email'], $status, (string) $detail));
    json(['ok' => false, 'error' => 'ecomail_failed', 'status' => $status, 'detail' => (string) $detail], 502);
}

json(['ok' => true]);
