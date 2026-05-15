/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-topic
 * Base block: cards
 * Source: https://www.chevron.com/sustainability
 * Generated: 2026-05-14
 *
 * 2x2 grid of topic cards with colored backgrounds.
 * Each card has an image on top, H3 heading, description paragraph,
 * and a "Learn more" CTA link.
 *
 * Source DOM structure (validated against live page):
 *   div.card-container > ul.card-list > li.card-item (x4)
 *     div.card-inner.background-color-{color}
 *       img.card-image
 *       div.card-text-container
 *         h3.sub-heading
 *         div.card-description > p + a.cta-link-parent (or div.cta-link > a)
 *
 * Target table (from library example):
 *   | Cards |
 *   | image | heading + description + CTA |  (x4 rows)
 *
 * Handles variations:
 *   - CTA as a.cta-link-parent wrapping div.cta-link (cards 1, 3, 4)
 *   - CTA as div.cta-link > a (card 2 - different markup pattern)
 *   - Missing images (some cards may lack images)
 *   - Heading levels h3/h2/h4 with fallbacks
 *   - Optional description paragraph
 *
 * Validated: Parser extraction verified against live DOM via MCP Playwright.
 * All 4 cards correctly extracted (Climate, Social investment,
 * Diversity and inclusion, Environment) with images, headings,
 * descriptions, and CTA links.
 *
 * Note: Automated headless validation fails because chevron.com blocks
 * headless Chromium (page body renders ~270 bytes, no DOM content).
 * This affects all parsers for this site equally. Parser logic
 * confirmed correct via non-headless MCP Playwright browser.
 */
export default function parse(element, { document }) {
  // Find all card items within the card container
  const cardItems = element.querySelectorAll('.card-item');

  const cells = [];

  cardItems.forEach((card) => {
    const inner = card.querySelector('.card-inner');
    if (!inner) return;

    // --- Cell 1: image ---
    const image = inner.querySelector('img.card-image, img');

    // --- Cell 2: heading + description + CTA ---
    const textContainer = inner.querySelector('.card-text-container');
    const contentCell = [];

    if (textContainer) {
      // Heading: h3.sub-heading with fallbacks
      const heading = textContainer.querySelector('h3, h2, h4');
      if (heading) contentCell.push(heading);

      // Description paragraph inside .card-description
      const descContainer = textContainer.querySelector('.card-description');
      if (descContainer) {
        const descParagraph = descContainer.querySelector('p');
        if (descParagraph) contentCell.push(descParagraph);
      }

      // CTA link - two patterns in source HTML:
      // Pattern 1: a.cta-link-parent wrapping div.cta-link > span.cta-underline
      // Pattern 2: div.cta-link > a > span.cta-underline
      let ctaHref = '';
      let ctaText = '';

      const ctaLinkParent = textContainer.querySelector('a.cta-link-parent');
      if (ctaLinkParent) {
        ctaHref = ctaLinkParent.getAttribute('href') || '';
        const ctaUnderline = ctaLinkParent.querySelector('.cta-underline');
        ctaText = ctaUnderline ? ctaUnderline.textContent.trim() : ctaLinkParent.textContent.trim();
      } else {
        // Fallback: div.cta-link > a
        const ctaDiv = textContainer.querySelector('.cta-link a');
        if (ctaDiv) {
          ctaHref = ctaDiv.getAttribute('href') || '';
          const ctaUnderline = ctaDiv.querySelector('.cta-underline');
          ctaText = ctaUnderline ? ctaUnderline.textContent.trim() : ctaDiv.textContent.trim();
        } else {
          // Final fallback: any link in the text container
          const anyLink = textContainer.querySelector('a[href]');
          if (anyLink) {
            ctaHref = anyLink.getAttribute('href') || '';
            ctaText = anyLink.textContent.trim();
          }
        }
      }

      if (ctaHref) {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = ctaHref;
        link.textContent = ctaText || 'Learn more';
        p.appendChild(link);
        contentCell.push(p);
      }
    }

    // Build row: [ image, heading + description + CTA ]
    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-topic', cells });
  element.replaceWith(block);
}
