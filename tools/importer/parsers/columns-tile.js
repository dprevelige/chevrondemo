/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-tile
 * Base block: columns
 * Source: https://www.chevron.com/who-we-are
 * Generated: 2026-05-14
 *
 * Split-tile layout with two columns:
 *   Cell 1: heading (h2) + description paragraph
 *   Cell 2: image + linked card (h3 heading with CTA link)
 *
 * Source DOM structure (validated against live page):
 *   div.c64 > div.inner-container > div.tile-container
 *     div.half-tile (text side): h2 + div.description
 *     div.half-tile.quarter-tile-container (media side):
 *       div.quarter-tile.background-container > div.background[style=background-image]
 *       div.quarter-tile > a > h3 + span
 *
 * Handles variations:
 *   - .right vs .left class (DOM order of half-tiles may differ)
 *   - Background image via inline style or direct <img> element
 *   - Optional description text
 *   - Heading levels h2/h3 with fallbacks
 */
export default function parse(element, { document }) {
  // Find the tile container that holds both halves
  const tileContainer = element.querySelector('.tile-container');
  const container = tileContainer || element;

  // Identify the text half and the media half using distinct selectors
  // Text half: .half-tile that does NOT have .quarter-tile-container
  const textHalf = container.querySelector('.half-tile:not(.quarter-tile-container)');
  // Media half: .half-tile that HAS .quarter-tile-container
  const mediaHalf = container.querySelector('.half-tile.quarter-tile-container');

  // --- Cell 1: heading + description ---
  const cell1 = [];

  if (textHalf) {
    const heading = textHalf.querySelector('h2, h3, h4');
    if (heading) cell1.push(heading);

    const description = textHalf.querySelector('.description, p');
    if (description) cell1.push(description);
  }

  // --- Cell 2: image + linked card ---
  const cell2 = [];

  if (mediaHalf) {
    // Extract image from CSS background-image on div.background
    const bgDiv = mediaHalf.querySelector('.background-container .background, .background[style]');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const urlMatch = style.match(/url\(([^)]+)\)/);
      if (urlMatch) {
        const imgUrl = urlMatch[1].replace(/['"]/g, '');
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = '';
        cell2.push(img);
      }
    }

    // Fallback: check for a direct <img> element if no background-image found
    if (cell2.length === 0) {
      const directImg = mediaHalf.querySelector('img');
      if (directImg) cell2.push(directImg);
    }

    // Extract linked card: <a> containing h3 and span (CTA text)
    const quarterTiles = mediaHalf.querySelectorAll('.quarter-tile');
    let cardLink = null;
    for (const qt of quarterTiles) {
      if (!qt.classList.contains('background-container')) {
        cardLink = qt.querySelector('a');
        if (cardLink) break;
      }
    }
    // Fallback: find any link in the media half
    if (!cardLink) {
      cardLink = mediaHalf.querySelector('a');
    }

    if (cardLink) {
      const cardHeading = cardLink.querySelector('h3, h4, h2');
      const cardSpan = cardLink.querySelector('span');
      const headingText = cardHeading ? cardHeading.textContent.trim() : '';
      const ctaText = cardSpan ? cardSpan.textContent.trim() : '';

      // Preserve the heading as an h3 element
      if (headingText) {
        const h3 = document.createElement('h3');
        h3.textContent = headingText;
        cell2.push(h3);
      }

      // Preserve the CTA as a linked paragraph
      if (ctaText || headingText) {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = cardLink.getAttribute('href') || '';
        link.textContent = ctaText || 'Learn more';
        p.appendChild(link);
        cell2.push(p);
      }
    }
  }

  // Build cells: single row with two columns matching library example
  // | heading + description | image + linked card |
  const cells = [
    [cell1, cell2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-tile', cells });
  element.replaceWith(block);
}
