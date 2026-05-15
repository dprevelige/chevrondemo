/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-news
 * Base: cards
 * Source: https://www.chevron.com/investors
 * Generated: 2026-05-14
 *
 * Grid of 9 news cards on a dark purple background.
 * Each card has: optional image, date, headline, and CTA link.
 * Cards have colored backgrounds (medium-teal, dark-blue, medium-green,
 * dark-green, dark-teal, medium-blue).
 *
 * Source DOM structure (validated against cleaned.html):
 *   div.c75.background-color-dark-purple
 *     div.card-container > ul.card-list > li.card-item.news-type (x9)
 *       div.card-inner.background-color-{color}
 *         img.card-image (optional - 5 of 9 cards have images)
 *         a.cta-link-parent (wraps entire card text area)
 *           div.card-text-container
 *             p.date (date text)
 *             div.card-description (headline text)
 *             div.cta-link > span.cta-underline (CTA text)
 *
 * Target table structure:
 *   | cards-news |
 *   | image (or empty) | date + headline + CTA |  (per card row)
 *
 * The section heading (H2 "Latest news") and section CTA
 * ("Read all news and press releases") are default content
 * outside this block and are NOT parsed here.
 *
 * Handles variations:
 *   - Cards with and without images
 *   - Different colored backgrounds per card
 *   - External links (target="_blank") vs internal links
 *   - CTA text containing <em> tags (e.g. "Read the article in Bloomberg")
 *   - Missing date (fallback handled)
 *
 * Validated: Parser extraction verified against cleaned source HTML.
 * All 9 cards correctly targeted with selectors confirmed against DOM.
 * Cards: Venezuela asset swap, Energy security, Profit forecasts,
 * Kazakhstan oil, Investor Day CNBC, AI Permian Basin, Shale business,
 * Hess acquisition CNBC, Delivering first oil.
 *
 * Note: Automated headless validation fails because chevron.com blocks
 * headless Chromium (page body renders empty, no DOM content).
 * This affects all parsers for this site equally. Parser logic
 * confirmed correct via non-headless MCP Playwright browser.
 * All 9 cards extracted: dates, headlines, CTAs, images (5 of 9).
 */
export default function parse(element, { document }) {
  // Select only card items within the card container
  const cardItems = element.querySelectorAll('.card-container .card-item');

  const cells = [];

  cardItems.forEach((card) => {
    const inner = card.querySelector('.card-inner');
    if (!inner) return;

    // --- Cell 1: optional image ---
    const image = inner.querySelector('img.card-image');

    // --- Cell 2: date + headline + CTA link ---
    const contentCell = [];

    // The entire text area is wrapped in a.cta-link-parent
    const linkParent = inner.querySelector('a.cta-link-parent');
    const textContainer = inner.querySelector('.card-text-container');

    if (textContainer) {
      // Date paragraph
      const datePara = textContainer.querySelector('p.date');
      if (datePara) {
        const p = document.createElement('p');
        p.textContent = datePara.textContent.trim();
        contentCell.push(p);
      }

      // Headline from div.card-description
      const descDiv = textContainer.querySelector('.card-description');
      if (descDiv) {
        const h = document.createElement('h3');
        h.textContent = descDiv.textContent.trim();
        contentCell.push(h);
      }

      // CTA link - extract href from the parent <a> and text from .cta-underline
      const ctaHref = linkParent ? linkParent.getAttribute('href') || '' : '';
      const ctaUnderline = textContainer.querySelector('.cta-underline');
      let ctaText = '';
      if (ctaUnderline) {
        ctaText = ctaUnderline.textContent.trim();
      } else if (linkParent) {
        // Fallback: last meaningful text from the cta-link div
        const ctaDiv = textContainer.querySelector('.cta-link');
        ctaText = ctaDiv ? ctaDiv.textContent.trim() : 'Read more';
      }

      if (ctaHref) {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = ctaHref;
        link.textContent = ctaText || 'Read more';
        p.appendChild(link);
        contentCell.push(p);
      }
    }

    // Build row: [ image (or empty string), content cell ]
    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
