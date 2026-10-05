/** Texty, které nejsou v převzatém HTML (hlášky formulářů apod.). */
import type { Locale } from './config';

export const ui: Record<Locale, Record<string, string>> = {
  cs: {
    'form.sending': 'Odesílám…',
    'form.error': 'Odeslání se nepovedlo. Zkuste to prosím znovu nebo nám zavolejte na +420 257 011 107.',
    'form.thanks': '/dekujeme',
    'nav.language': 'Přepnout jazyk',
    'slider.prev': 'Předchozí snímek',
    'slider.next': 'Další snímek',
    'slider.slide': 'Snímek',
  },
  sk: {
    'form.sending': 'Odosielam…',
    'form.error': 'Odoslanie sa nepodarilo. Skúste to prosím znova alebo nám zavolajte na +420 257 011 107.',
    'form.thanks': '/sk/dakujeme',
    'nav.language': 'Prepnúť jazyk',
    'slider.prev': 'Predchádzajúca snímka',
    'slider.next': 'Ďalšia snímka',
    'slider.slide': 'Snímka',
  },
};
