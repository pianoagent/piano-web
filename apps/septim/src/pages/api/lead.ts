/**
 * POST /api/lead: příjem všech formulářů webu Septim (převzatých ze živého webu).
 * Odešle e-mail přes Resend. Pole formulářů mají názvy ze Solid Pixels,
 * např. "pojdme-to-probrat[vas-e-mail]" → do mailu jde "vas-e-mail".
 * Přílohy (životopis z kariérního formuláře) jdou jako přílohy e-mailu.
 *
 * Cloudflare Pages (adaptér @astrojs/cloudflare): secrets v `locals.runtime.env`.
 * Nastav v projektu septim-web → Settings → Variables:
 *   RESEND_API_KEY  (povinné pro odesílání e-mailu)
 *   LEAD_TO         (volitelné, default poptavky@piano.cz)
 *   LEAD_FROM       (volitelné, default "Septim web <web@piano.cz>": doména musí být v Resend ověřená)
 */
export const prerender = false;

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

const MAX_ATTACHMENTS_BYTES = 8 * 1024 * 1024;
const SKIP = new Set(['website', 'form_variant', 'page']);

/** "form-id[pole]" → "pole" */
const fieldName = (k: string) => k.replace(/^[^[]+\[([^\]]+)\].*$/, '$1');

const toBase64 = (buf: ArrayBuffer) => {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: boti vyplní skryté pole "website" → tváříme se úspěšně, nic neposíláme
  if ((form.get('website') || '').toString().trim()) return json({ ok: true });

  const variant = (form.get('form_variant') || 'formular').toString().slice(0, 80);
  const page = (form.get('page') || '').toString().slice(0, 200);

  const fields: [string, string][] = [];
  const attachments: { filename: string; content: string }[] = [];
  let attachmentBytes = 0;
  for (const [k, v] of form.entries()) {
    if (SKIP.has(k)) continue;
    const name = fieldName(k);
    if (typeof v === 'string') {
      const val = v.trim();
      // tlačítka odesílají value="submit", reCAPTCHA pole už ve formulářích není
      if (!val || val === 'submit' || name.endsWith('_ants')) continue;
      fields.push([name, val.slice(0, 5000)]);
    } else if (v && v.size > 0) {
      attachmentBytes += v.size;
      if (attachmentBytes > MAX_ATTACHMENTS_BYTES) return json({ ok: false, error: 'attachment_too_large' }, 413);
      attachments.push({ filename: v.name || 'priloha', content: toBase64(await v.arrayBuffer()) });
    }
  }

  const email = fields.find(([n, v]) => /mail/i.test(n) && /@/.test(v))?.[1] || '';
  const phone = fields.find(([n]) => /telefon|phone|tel\b/i.test(n))?.[1] || fields.find(([, v]) => /^\+?[\d\s]{9,}$/.test(v))?.[1] || '';

  // Minimální validace: aspoň telefon nebo e-mail
  if (!email && !phone) return json({ ok: false, error: 'missing_contact' }, 422);

  const env = locals?.runtime?.env ?? {};
  const apiKey = env.RESEND_API_KEY;
  const to = env.LEAD_TO || 'poptavky@piano.cz';
  const from = env.LEAD_FROM || 'Septim web <web@piano.cz>';

  const text = [
    `Nová poptávka z webu septim.cz (formulář: ${variant})`,
    page && `Stránka: https://www.septim.cz${page}`,
    '',
    ...fields.map(([n, v]) => `${n}: ${v}`),
    attachments.length ? `\nPřílohy: ${attachments.map((a) => a.filename).join(', ')}` : '',
  ].filter((l) => l !== false && l !== undefined).join('\n');

  if (!apiKey) return json({ ok: false, error: 'mail_not_configured' }, 503);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email || undefined,
      subject: `Nová poptávka z webu Septim (${variant})`,
      text,
      attachments: attachments.length ? attachments : undefined,
    }),
  });
  if (!res.ok) return json({ ok: false, error: 'mail_failed' }, 502);

  return json({ ok: true });
};
