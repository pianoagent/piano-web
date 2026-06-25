/**
 * POST /api/lead — příjem poptávky z <LeadForm>.
 * Teď: odešle e-mail přes Resend na obchod@piano.cz.
 * Později: dolepit Odoo crm.lead (viz TODO níže).
 *
 * Cloudflare Pages (adaptér @astrojs/cloudflare) — secrets čteme z
 * `locals.runtime.env`. Nastav v projektu piano → Settings → Variables:
 *   RESEND_API_KEY  (povinné pro odesílání e-mailu)
 *   LEAD_TO         (volitelné, default obchod@piano.cz)
 *   LEAD_FROM       (volitelné, default "Piano web <web@piano.cz>" — doména musí být v Resend ověřená)
 */
export const prerender = false;

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot — boti vyplní skryté pole "website" → tváříme se úspěšně, nic neposíláme
  if ((form.get('website') || '').toString().trim()) return json({ ok: true });

  const v = (k: string) => (form.get(k) || '').toString().trim();
  const lead = {
    variant: v('form_variant') || 'full',
    name: v('name'),
    email: v('email'),
    phone: v('phone'),
    company: v('company'),
    city: v('city'),
  };

  // Minimální validace — aspoň telefon nebo e-mail
  if (!lead.phone && !lead.email) return json({ ok: false, error: 'missing_contact' }, 422);

  const env = locals?.runtime?.env ?? {};
  const apiKey = env.RESEND_API_KEY;
  const to = env.LEAD_TO || 'obchod@piano.cz';
  const from = env.LEAD_FROM || 'Piano web <web@piano.cz>';

  const text = [
    `Nová poptávka z webu piano.cz (formulář: ${lead.variant})`,
    '',
    lead.name && `Jméno: ${lead.name}`,
    lead.email && `E-mail: ${lead.email}`,
    lead.phone && `Telefon: ${lead.phone}`,
    lead.company && `Podnik: ${lead.company}`,
    lead.city && `Město: ${lead.city}`,
  ].filter(Boolean).join('\n');

  // ----- E-mail přes Resend -----
  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email || undefined,
        subject: `Nová poptávka z webu (${lead.variant})`,
        text,
      }),
    });
    if (!res.ok) return json({ ok: false, error: 'mail_failed' }, 502);
  }

  // ----- TODO: Odoo crm.lead -----
  // Až budou creds (ODOO_URL, ODOO_DB, ODOO_USER, ODOO_KEY z env), sem přidat
  // JSON-RPC volání na create crm.lead. E-mail nahoře zůstane jako notifikace.

  return json({ ok: true });
};
