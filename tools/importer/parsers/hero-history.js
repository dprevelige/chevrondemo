/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-history
 * Base block: hero
 * Source: https://www.chevron.com/who-we-are/history
 * Selector: .c54.video-common
 * Generated: 2026-05-15
 *
 * Source HTML structure:
 *   div.c54.video-common.background-color-dark-blue.image-below.has-image
 *     div.inner-container.centered
 *       div.background-container
 *         div.background [style="background-image: url(...)"]
 *       div.width-1000.centered.text-center.text-container
 *         h1.type-display.color-dark-blue "A history of enabling human progress"
 *         div.description.width-800.type-body "We've always believed..."
 *         div.buttons-container
 *           a.cta-button.primary "Read the full Chevron history"
 *
 * Target table structure (from authoring analysis):
 *   | hero-history |
 *   | background-image |
 *   | heading + description + CTA |
 */
export default function parse(element, { document }) {
  // --- Row 2: Background image ---
  // Background image is set as inline style on div.background inside .background-container
  const bgDiv = element.querySelector('.background-container .background, .background-container');
  let bgImageEl = null;

  if (bgDiv) {
    const bgStyle = bgDiv.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch && bgMatch[1]) {
      bgImageEl = document.createElement('img');
      bgImageEl.src = bgMatch[1];
      bgImageEl.alt = '';
    }
  }

  // Fallback: check for an actual <img> element in the hero
  if (!bgImageEl) {
    const imgEl = element.querySelector('.background-container img, .inner-container img, img');
    if (imgEl) {
      bgImageEl = imgEl;
    }
  }

  // --- Row 3: Heading + description + CTA ---
  // Heading: h1 inside .text-container or fallback to any h1/h2
  const heading = element.querySelector(
    '.text-container h1, .text-container h2, h1, h2'
  );

  // Description: div.description inside .text-container
  const description = element.querySelector(
    '.text-container .description, .description, .text-container p'
  );

  // CTA: anchor button in .buttons-container or fallback
  const ctaLinks = Array.from(
    element.querySelectorAll('.buttons-container a[href], .text-container a.cta-button, a.cta-button')
  ).filter((a) => {
    // Exclude any anchors that are just icon wrappers without meaningful href
    const href = a.getAttribute('href') || '';
    return href && !href.startsWith('javascript:') && !href.startsWith('#');
  });

  // --- Build cells array matching target table structure ---
  const cells = [];

  // Row 2: background image (single-column row, optional)
  if (bgImageEl) {
    cells.push([bgImageEl]);
  }

  // Row 3: text content (heading + description + CTA) in one cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-history', cells });
  element.replaceWith(block);
}
