/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-video
 * Base block: hero
 * Source: https://www.chevron.com/who-we-are
 * Selector: .c74.video-common
 * Generated: 2026-05-14
 * Validated: manually via Playwright (chevron.com requires user-agent for full page render)
 *
 * Source HTML structure:
 *   div.c74.video-common
 *     div.inner-container
 *       div.media-container.video-container > video > source[src="...mp4"]
 *       div.parent-container
 *         h1 "Who we are"
 *         div.description "Energy drives human progress..."
 *
 * Target table structure (from block library):
 *   | hero-video |
 *   | video-url  |
 *   | heading + description + CTA |
 */
export default function parse(element, { document }) {
  // --- Row 2: Background video URL or fallback image ---
  // Live source: div.media-container.video-container > video > source[src]
  // Video src may be relative (e.g. /-/media/...) or absolute
  const videoSource = element.querySelector('video source[src], video[src]');
  const bgImage = element.querySelector('.media-container img, .video-container img, .inner-container img');

  let mediaCell;
  if (videoSource) {
    const videoUrl = videoSource.getAttribute('src') || videoSource.closest('video')?.getAttribute('src');
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.textContent = videoUrl;
      mediaCell = [link];
    }
  }
  // Fallback: use background image if no video source found
  if (!mediaCell && bgImage) {
    mediaCell = [bgImage];
  }

  // --- Row 3: Heading + description + optional CTA links ---
  // Live source: div.parent-container > h1, div.parent-container > div.description
  const heading = element.querySelector('.parent-container h1, .parent-container h2, h1, h2');
  const description = element.querySelector('.parent-container .description, .parent-container p, .description');
  // CTA links (not buttons): only actual <a> tags that are navigation CTAs
  const ctaLinks = Array.from(
    element.querySelectorAll('.parent-container a[href], .inner-container > a[href]')
  ).filter((a) => !a.closest('button'));

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  // --- Build cells array matching library example ---
  // Each entry in cells is one row; each row entry is one column.
  // Wrap in an extra array so the row has a single column (not N columns).
  const cells = [];

  // Row 2: background video/image (single-column row)
  if (mediaCell) {
    cells.push(mediaCell);
  }

  // Row 3: text content in one cell (heading + description + CTAs)
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
