/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-brand
 * Base block: hero
 * Source: https://www.chevron.com/who-we-are/our-brands
 * Selector: .c74.video-common
 * Generated: 2026-05-15
 *
 * Source HTML structure:
 *   div.c74.video-common.text-center.background-color-dark-gray
 *     div.inner-container
 *       div.gradient-container
 *       div.background-container [style="background-image: url(...)"]
 *       div.parent-container
 *         div.text-window-container > h1.type-display "Our brands"
 *         div.description-container > div.description "Whether we're fueling cars..."
 *
 * Target table structure (from authoring analysis):
 *   | hero-brand |
 *   | background-image |
 *   | heading + description |
 */
export default function parse(element, { document }) {
  // --- Row 2: Background image ---
  // The background image is set as inline style on div.background-container
  // Extract the URL from background-image CSS property
  const bgContainer = element.querySelector('.background-container');
  let bgImageEl = null;

  if (bgContainer) {
    const bgStyle = bgContainer.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch && bgMatch[1]) {
      bgImageEl = document.createElement('img');
      bgImageEl.src = bgMatch[1];
      bgImageEl.alt = '';
    }
  }

  // Fallback: check for an actual <img> element anywhere in the hero
  if (!bgImageEl) {
    const imgEl = element.querySelector('.background-container img, .inner-container img, img');
    if (imgEl) {
      bgImageEl = imgEl;
    }
  }

  // --- Row 3: Heading + description text ---
  // Heading: h1 inside .text-window-container or .parent-container
  const heading = element.querySelector(
    '.text-window-container h1, .parent-container h1, .parent-container h2, h1, h2'
  );

  // Description: div.description inside .description-container or .parent-container
  const description = element.querySelector(
    '.description-container .description, .parent-container .description, .description, .parent-container p'
  );

  // Optional CTA links (hero-brand may not have CTAs, but handle if present)
  const ctaLinks = Array.from(
    element.querySelectorAll('.parent-container a[href], .description-container a[href], .inner-container > a[href]')
  ).filter((a) => !a.closest('button'));

  // --- Build cells array matching target table structure ---
  const cells = [];

  // Row 2: background image (single-column row)
  if (bgImageEl) {
    cells.push([bgImageEl]);
  }

  // Row 3: text content (heading + description + optional CTAs) in one cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-brand', cells });
  element.replaceWith(block);
}
