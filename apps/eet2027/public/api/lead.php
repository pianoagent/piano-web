<?php

declare(strict_types=1);

/**
 * POST /api/lead.php — příjem poptávky z <LeadForm> na eet2027.cz.
 * Odeslání e-mailu přes nativní PHP mail() (Webglobe FTP/PHP hosting).
 *
 * Doručitelnost: SPF eet2027.cz je "v=spf1 a mx include:_spf.webglobe.cz -all",
 * takže odeslání z tohoto hostingu pod envelope senderem web@eet2027.cz projde.
 * Leady chodí do stejné schránky jako z piano.cz, ať jsou na jednom místě.
 */

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

// URL stránky bez CR/LF (ochrana proti injection do těla)
$page = str_replace(["\r", "\n"], '', $value('page'));

$lead = [
    'variant' => $value('form_variant') ?: 'full',
    'name' => $value('name'),
    'email' => $value('email'),
    'phone' => $value('phone'),
    'company' => $value('company'),
    'city' => $value('city'),
    'page' => $page,
];

// Minimální validace — aspoň telefon nebo e-mail
if ($lead['phone'] === '' && $lead['email'] === '') {
    json(['ok' => false, 'error' => 'missing_contact'], 422);
}

$lines = array_filter([
    sprintf('Nová poptávka z webu eet2027.cz (formulář: %s)', $lead['variant']),
    '',
    $lead['name'] !== '' ? sprintf('Jméno: %s', $lead['name']) : null,
    $lead['email'] !== '' ? sprintf('Email: %s', $lead['email']) : null,
    $lead['phone'] !== '' ? sprintf('Telefon: %s', $lead['phone']) : null,
    $lead['company'] !== '' ? sprintf('Název podniku: %s', $lead['company']) : null,
    $lead['city'] !== '' ? sprintf('Město: %s', $lead['city']) : null,
    $lead['page'] !== '' ? sprintf('URL: %s', $lead['page']) : null,
], static fn ($line): bool => $line !== null);
$body = implode("\r\n", $lines);

$subject = sprintf('Nová poptávka z eet2027.cz (%s)', $lead['variant']);
$encodedSubject = sprintf('=?UTF-8?B?%s?=', base64_encode($subject));

$headers = [
    sprintf('From: %s <%s>', LEAD_FROM_NAME, LEAD_FROM),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];
// Reply-To na zákazníka — odpověď z e-mailu jde rovnou jemu (jen platný e-mail)
if ($lead['email'] !== '' && filter_var($lead['email'], FILTER_VALIDATE_EMAIL) !== false) {
    $headers[] = sprintf('Reply-To: %s', $lead['email']);
}

$sent = mail(
    LEAD_TO,
    $encodedSubject,
    $body,
    implode("\r\n", $headers),
    sprintf('-f%s', LEAD_FROM),
);

if (!$sent) {
    json(['ok' => false, 'error' => 'mail_failed'], 502);
}

json(['ok' => true]);
