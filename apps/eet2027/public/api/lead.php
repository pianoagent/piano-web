<?php

declare(strict_types=1);

/**
 * POST /api/lead.php — příjem přihlášení k odběru na eet2027.cz.
 *
 * Primárně zapisuje kontakt do Ecomailu (seznam Piano B2B) se štítkem "eet2027.cz".
 * E-mail slouží jen jako záloha: odešle se, když zápis do Ecomailu selže,
 * aby se žádný kontakt neztratil.
 *
 * API klíč se NEDÁVÁ do gitu. Bere se z prostředí (ECOMAIL_API_KEY), nebo ze
 * souboru ecomail-config.php, který vygeneruje deploy workflow z GitHub secrets.
 *
 * Doručitelnost záložního mailu: SPF eet2027.cz je "v=spf1 a mx include:_spf.webglobe.cz -all",
 * takže odeslání z tohoto hostingu pod envelope senderem web@eet2027.cz projde.
 */

const ECOMAIL_LIST_ID = 8;          // Piano B2B
const ECOMAIL_TAG = 'eet2027.cz';   // štítek pro kontakty z tohoto webu

const LEAD_TO = 'poptavky@piano.cz';
const LEAD_FROM = 'web@eet2027.cz';
const LEAD_FROM_NAME = 'EET 2027 web';

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

// URL stránky bez CR/LF (ochrana proti injection do těla mailu)
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

/** Záložní notifikace e-mailem, když zápis do Ecomailu selže. */
function notify_by_mail(array $lead): bool
{
    $lines = array_filter([
        sprintf('Přihlášení k odběru z webu eet2027.cz (formulář: %s)', $lead['variant']),
        'POZOR: zápis do Ecomailu se nepovedl, kontakt doplňte ručně.',
        '',
        sprintf('Email: %s', $lead['email']),
        $lead['name'] !== '' ? sprintf('Jméno: %s', $lead['name']) : null,
        $lead['phone'] !== '' ? sprintf('Telefon: %s', $lead['phone']) : null,
        $lead['company'] !== '' ? sprintf('Název podniku: %s', $lead['company']) : null,
        $lead['typ_podniku'] !== '' ? sprintf('Typ provozu: %s', $lead['typ_podniku']) : null,
        $lead['chci_vic_z_pos'] !== '' ? 'Zájem: chtěl by od pokladního systému víc' : null,
        $lead['page'] !== '' ? sprintf('URL: %s', $lead['page']) : null,
    ], static fn ($line): bool => $line !== null);

    $subject = 'Odběr EET 2027: ruční doplnění do Ecomailu';
    $headers = [
        sprintf('From: %s <%s>', LEAD_FROM_NAME, LEAD_FROM),
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $lead['email'],
    ];

    return mail(
        LEAD_TO,
        sprintf('=?UTF-8?B?%s?=', base64_encode($subject)),
        implode("\r\n", $lines),
        implode("\r\n", $headers),
        '-f' . LEAD_FROM
    );
}

$apiKey = ecomail_api_key();
$subscribed = $apiKey !== '' && ecomail_subscribe($lead, $apiKey);

if (!$subscribed) {
    notify_by_mail($lead);
}

// Uživateli hlásíme úspěch v obou případech, kontakt máme zachycený.
json(['ok' => true]);
