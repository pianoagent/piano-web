/** Texty, které nejsou v převzatém HTML (hlášky formulářů apod.). */
import type { Locale } from './config';

export const ui: Record<Locale, Record<string, string>> = {
  cs: {
    'form.sending': 'Odesílám…',
    'form.error': 'Odeslání se nepovedlo. Zkuste to prosím znovu, nebo nám zavolejte na +420 257 011 100.',
    'form.thanks': '/dekujeme',
    'nav.language': 'Přepnout jazyk',
  },
  en: {
    'form.sending': 'Sending…',
    'form.error': 'Sending failed. Please try again or call us at +420 257 011 100.',
    'form.thanks': '/en/thank-you',
    'nav.language': 'Switch language',
  },
  sk: {
    'form.sending': 'Odosielam…',
    'form.error': 'Odoslanie sa nepodarilo. Skúste to prosím znova.',
    'form.thanks': '/sk/dakujeme',
    'nav.language': 'Prepnúť jazyk',
  },
};
