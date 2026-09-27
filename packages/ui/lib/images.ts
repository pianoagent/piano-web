import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/* The leading slash makes Vite resolve the pattern against the root of the site
   being built, so every app gets its own src/assets/images. */
const assets = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{webp,jpg,jpeg,png}', { eager: true });

/**
 * Finds the optimizable counterpart of a public-style path ('/images/x.webp' →
 * src/assets/images/x.webp). Undefined when the site still serves it from public/.
 */
export function findImage(path: string): ImageMetadata | undefined {
  return assets[`/src/assets${path}`]?.default;
}

/**
 * srcset widths for an image rendered at most `width` CSS px wide: half, 1× and 2×.
 * Astro drops the ones above the source width and adds the source width instead.
 * Never read properties of the ImageMetadata here: any access makes Astro copy
 * the unoptimized original into the build as well.
 */
export function responsiveWidths(width: number): number[] {
  return [Math.round(width / 2), width, width * 2];
}

export function defaultSizes(width: number): string {
  return `(min-width: ${width}px) ${width}px, 100vw`;
}

/**
 * Rewrites every <img src="/images/…"> in rendered HTML (Markdown articles) to a
 * <picture> with AVIF + WebP srcset, same output as the Img component.
 * Images without an asset in src/assets stay untouched.
 */
export async function optimizeHtmlImages(html: string, width: number): Promise<string> {
  const tags = [...html.matchAll(/<img\b[^>]*\bsrc="(\/images\/[^"]+)"[^>]*>/g)];
  const pictures = await Promise.all(tags.map(async ([tag, src]) => {
    const image = findImage(src);
    if (!image) return tag;
    const alt = tag.match(/\balt="([^"]*)"/)?.[1] ?? '';
    const sizes = defaultSizes(width);
    const options = { src: image, width, widths: responsiveWidths(width), sizes };
    const [avif, webp] = await Promise.all([
      getImage({ ...options, format: 'avif' }),
      getImage({ ...options, format: 'webp' }),
    ]);
    return `<picture><source srcset="${avif.srcSet.attribute}" type="image/avif" sizes="${sizes}">`
      + `<img src="${webp.src}" srcset="${webp.srcSet.attribute}" sizes="${sizes}" alt="${alt}"`
      + ` width="${webp.attributes.width}" height="${webp.attributes.height}" loading="lazy" decoding="async"></picture>`;
  }));
  return tags.reduce((result, [tag], index) => result.replace(tag, pictures[index]), html);
}
