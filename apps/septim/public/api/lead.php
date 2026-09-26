<?php

declare(strict_types=1);

/**
 * POST /api/lead.php: příjem všech formulářů webu Septim (převzatých ze živého webu).
 * Odeslání e-mailu na poptavky@piano.cz přes nativní PHP mail() (FTP/PHP hosting),
 * stejný mechanismus jako apps/piano.
 *
 * Pole formulářů mají názvy ze Solid Pixels, např. "pojdme-to-probrat[vas-e-mail]".
 * PHP je rozparsuje do vnořených polí, do mailu jde poslední klíč ("vas-e-mail").
 * Přílohy (životopis z kariérního formuláře) jdou jako přílohy e-mailu.
 *
 * Doručitelnost stojí na SPF: From je na doméně piano.cz a envelope sender (-f)
 * je web@piano.cz, takže pokud DNS piano.cz autorizuje tenhle hosting, projde to.
 */

const LEAD_TO = 'poptavky@piano.cz';
const LEAD_FROM = 'web@piano.cz';
const LEAD_FROM_NAME = 'Septim web';
const MAX_ATTACHMENTS_BYTES = 8 * 1024 * 1024;
const SKIP = ['website', 'form_variant', 'page'];

function json(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($body);
    exit;
}

/**
 * @param array<int|string, mixed> $values
 * @param list<array{string, string}> $fields
 */
function collectFields(array $values, string $name, array &$fields): void
{
    foreach ($values as $key => $value) {
        $fieldName = is_int($key) ? $name : (string) $key;
        if (is_array($value)) {
            collectFields($value, $fieldName, $fields);
            continue;
        }
        $value = trim((string) $value);
        // tlačítka odesílají value="submit", reCAPTCHA pole už ve formulářích není
        if ($value === '' || $value === 'submit' || str_ends_with($fieldName, '_ants')) {
            continue;
        }
        $fields[] = [$fieldName, mb_substr($value, 0, 5000)];
    }
}

/**
 * @param array<int|string, mixed> $names
 * @param array<int|string, mixed> $tmpNames
 * @param array<int|string, mixed> $errors
 * @param list<array{string, string}> $attachments
 */
function collectAttachments(array $names, array $tmpNames, array $errors, array &$attachments): void
{
    foreach ($names as $key => $name) {
        if (is_array($name)) {
            collectAttachments($name, $tmpNames[$key], $errors[$key], $attachments);
            continue;
        }
        if ($errors[$key] === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($errors[$key] === UPLOAD_ERR_INI_SIZE || $errors[$key] === UPLOAD_ERR_FORM_SIZE) {
            json(['ok' => false, 'error' => 'attachment_too_large'], 413);
        }
        if ($errors[$key] !== UPLOAD_ERR_OK || !is_uploaded_file($tmpNames[$key])) {
            json(['ok' => false, 'error' => 'attachment_failed'], 400);
        }
        $attachments[] = [$name !== '' ? $name : 'priloha', $tmpNames[$key]];
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

$value = static fn (string $key): string => is_string($_POST[$key] ?? null) ? trim($_POST[$key]) : '';

// Honeypot: boti vyplní skryté pole "website" → tváříme se úspěšně, nic neposíláme
if ($value('website') !== '') {
    json(['ok' => true]);
}

// Bez CR/LF (ochrana proti injection do hlaviček a těla)
$variant = str_replace(["\r", "\n"], '', mb_substr($value('form_variant') ?: 'formular', 0, 80));
$page = str_replace(["\r", "\n"], '', mb_substr($value('page'), 0, 200));

$fields = [];
collectFields(array_diff_key($_POST, array_flip(SKIP)), '', $fields);

$attachments = [];
foreach ($_FILES as $file) {
    collectAttachments((array) $file['name'], (array) $file['tmp_name'], (array) $file['error'], $attachments);
}
$attachmentBytes = array_sum(array_map(static fn (array $attachment): int => (int) filesize($attachment[1]), $attachments));
if ($attachmentBytes > MAX_ATTACHMENTS_BYTES) {
    json(['ok' => false, 'error' => 'attachment_too_large'], 413);
}

$email = '';
$phone = '';
foreach ($fields as [$name, $fieldValue]) {
    if ($email === '' && preg_match('/mail/i', $name) === 1 && str_contains($fieldValue, '@')) {
        $email = $fieldValue;
    }
    if ($phone === '' && preg_match('/telefon|phone|tel\b/i', $name) === 1) {
        $phone = $fieldValue;
    }
}
if ($phone === '') {
    foreach ($fields as [, $fieldValue]) {
        if (preg_match('/^\+?[\d\s]{9,}$/', $fieldValue) === 1) {
            $phone = $fieldValue;
            break;
        }
    }
}

// Minimální validace: aspoň telefon nebo e-mail
if ($email === '' && $phone === '') {
    json(['ok' => false, 'error' => 'missing_contact'], 422);
}

$lines = [
    sprintf('Nová poptávka z webu septim.cz (formulář: %s)', $variant),
    ...($page !== '' ? [sprintf('Stránka: https://www.septim.cz%s', $page)] : []),
    '',
    ...array_map(static fn (array $field): string => sprintf('%s: %s', $field[0], $field[1]), $fields),
    ...($attachments !== [] ? ['', sprintf('Přílohy: %s', implode(', ', array_column($attachments, 0)))] : []),
];
$text = implode("\r\n", $lines);

$subject = sprintf('Nová poptávka z webu Septim (%s)', $variant);
$encodedSubject = sprintf('=?UTF-8?B?%s?=', base64_encode($subject));

$headers = [
    sprintf('From: %s <%s>', LEAD_FROM_NAME, LEAD_FROM),
    'MIME-Version: 1.0',
];
// Reply-To na zákazníka: odpověď z e-mailu jde rovnou jemu (jen platný e-mail)
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) !== false) {
    $headers[] = sprintf('Reply-To: %s', $email);
}

if ($attachments === []) {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    // quoted-printable: dlouhý odstavec z textarey by jako 8bit překročil limit 998 bajtů na řádek
    $headers[] = 'Content-Transfer-Encoding: quoted-printable';
    $body = quoted_printable_encode($text);
} else {
    $boundary = sprintf('septim-%s', bin2hex(random_bytes(12)));
    $headers[] = sprintf('Content-Type: multipart/mixed; boundary="%s"', $boundary);
    $parts = [
        implode("\r\n", [
            sprintf('--%s', $boundary),
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: quoted-printable',
            '',
            quoted_printable_encode($text),
        ]),
    ];
    foreach ($attachments as [$filename, $path]) {
        $encodedFilename = sprintf('=?UTF-8?B?%s?=', base64_encode(str_replace(["\r", "\n", '"'], '', $filename)));
        $parts[] = implode("\r\n", [
            sprintf('--%s', $boundary),
            sprintf('Content-Type: application/octet-stream; name="%s"', $encodedFilename),
            'Content-Transfer-Encoding: base64',
            sprintf('Content-Disposition: attachment; filename="%s"', $encodedFilename),
            '',
            chunk_split(base64_encode((string) file_get_contents($path))),
        ]);
    }
    $body = sprintf("%s\r\n--%s--", implode("\r\n", $parts), $boundary);
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

// ----- TODO: Odoo crm.lead -----
// Až budou creds, sem přidat založení crm.lead přes Odoo API.
// E-mail výše zůstane jako notifikace.

json(['ok' => true]);
