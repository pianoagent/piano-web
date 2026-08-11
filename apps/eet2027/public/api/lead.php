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
 * Zapíše kontakt do Ecomailu. Vrací true při úspěchu.
 * update_existing = stávajícímu kontaktu jen přidá štítek, nevytvoří duplicitu.
 * resubscribe = false, odhlášené nepřihlašujeme zpět.
 */
function ecomail_subscribe(array $lead, string $apiKey): bool
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
        curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        return $status >= 200 && $status < 300;
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
    if ($response === false) {
        return false;
    }
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('~^HTTP/\S+\s+(\d{3})~', $header, $m)) {
            $code = (int) $m[1];

            return $code >= 200 && $code < 300;
        }
    }

    return false;
}

$apiKey = ecomail_api_key();

if ($apiKey === '') {
    error_log('eet2027: chybí ECOMAIL_API_KEY, kontakt nebyl zapsán: ' . $lead['email']);
    json(['ok' => false, 'error' => 'ecomail_unavailable'], 503);
}

if (!ecomail_subscribe($lead, $apiKey)) {
    error_log('eet2027: zápis do Ecomailu selhal pro ' . $lead['email']);
    json(['ok' => false, 'error' => 'ecomail_failed'], 502);
}

json(['ok' => true]);
