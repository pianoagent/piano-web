/**
 * Nabídky zaměstnání (GrasonJobs): klient veřejného API grason-api.
 * Inzeráty vznikají denně, web se builduje zřídka, proto se všechno načítá
 * v prohlížeči (stejně jako dřívější SPA jobs.grason.cz).
 * CORS API povoluje grason.cz, www.grason.cz a localhost, ne *.pages.dev.
 */
export const API_URL = 'https://api.grason.cz/flexi/v3/';
export const JOBS_PATH = '/nabidky-zamestnani/';

export interface Ad {
  id: number;
  slug: string;
  title: string | null;
  description: string;
  expiresAt: string;
  cover: string | null;
  type: { name: string };
  category: { id: number; name: string };
  salary: { from: number; to: number; type: 'hourly' | 'daily' | 'task' | 'monthly' };
  business: {
    name: string;
    avatar: string | null;
    bio: string | null;
    rating: number | null;
    address: { name: string; latitude: number; longitude: number };
    country: { currency: { sign: string } };
  };
}

export class ApiError extends Error {}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(API_URL + path, {
    ...init,
    headers: { 'Accept-Language': 'cs', ...init.headers },
  });
  const body = await response.text();
  const data = body === '' ? null : JSON.parse(body);
  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Něco se pokazilo, zkuste to prosím znovu.');
  }
  return data as T;
}

export function adTitle(ad: Ad): string {
  return `${ad.title || ad.category.name} v ${ad.business.name}`;
}

const SALARY_UNIT = { hourly: 'hod', daily: 'den', task: 'úkol', monthly: 'měs' };

export function adSalary(ad: Ad): string {
  const { from, to, type } = ad.salary;
  if (from === 0 && to === 0) return 'dle dohody';
  const format = new Intl.NumberFormat('cs-CZ').format;
  const amount = from === to ? format(from) : `${format(from)} – ${format(to)}`;
  return `${amount} ${ad.business.country.currency.sign}/${SALARY_UNIT[type]}`;
}

export function isExpired(ad: Ad): boolean {
  return new Date(ad.expiresAt) <= new Date();
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
