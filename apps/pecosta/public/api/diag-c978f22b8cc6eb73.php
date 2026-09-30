<?php

declare(strict_types=1);

// Temporary mail() delivery diagnostic, remove after the test.

if (($_GET['t'] ?? '') !== 'edb7baf673070dfb39d5aa16') {
    http_response_code(404);
    exit;
}

header('Content-Type: text/plain; charset=UTF-8');

$headers = [
    'From: Pecosta web <web@pecosta.cz>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];

$sent = mail(
    'test-b1bc833379@srv1.mail-tester.com',
    sprintf('=?UTF-8?B?%s?=', base64_encode('Nová poptávka z webu pecosta.cz (diag)')),
    "Nová poptávka z webu pecosta.cz (formulář: diag)\r\n\r\nJméno: Diagnostika doručení\r\nTelefon: +420 123 456 789\r\nURL: https://pecosta.cz/",
    implode("\r\n", $headers),
    '-fweb@pecosta.cz',
);

echo sprintf("mail(): %s\n", var_export($sent, true));
echo sprintf("sendmail_path: %s\n", ini_get('sendmail_path'));
echo sprintf("server: %s\n", php_uname('n'));
