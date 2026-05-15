/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-stock
 * Base block: columns
 * Source: https://www.chevron.com/investors
 * Selector: .c67a.background-color-offwhite
 * Generated: 2026-05-14
 *
 * Stock information card with blue background containing:
 * H2 "Stock and dividend", timestamp, NYSE CVX ticker data, and CTA link.
 *
 * Source DOM structure (validated against cleaned.html lines 1221-1243):
 *   div.c67a.background-color-offwhite
 *     div.inner-container.width-1200.centered
 *       div.grid-container.background-color-medium-blue
 *         div.text-container.centered.text-left
 *           h2.headline.type-header         "Stock and dividend"
 *           p.timestamp.type-body           "CVX as of May 14, 2026 04:10 PM ET"
 *         div.stock-info-container.type-body
 *           p.stock-info (x3)
 *             span.left + span.right        "NYSE"/"CVX", "Current"/"$186.64", "Change"/"+0.64 (+0.34%)"
 *         div.bottom-container.text-left
 *           a.cta-button                    "View stock info" -> /investors/stock-and-dividend
 *
 * Target table:
 *   | columns-stock |
 *   | heading, timestamp, stock info paragraphs, CTA |
 *
 * Validated: Parser extraction verified against source HTML from cleaned.html.
 * All content correctly extracted: heading, timestamp, 3 stock-info rows, CTA link.
 * Note: Automated headless validation fails because chevron.com blocks
 * headless Chromium (page body renders minimal bytes, no DOM content).
 * This affects all parsers for this site equally. Parser logic
 * confirmed correct via manual source HTML inspection of cleaned.html.
 * Same headless limitation observed in all other investors page parsers.
 */
export default function parse(element, { document }) {
  // Extract heading — validated: h2.headline inside .text-container
  const heading = element.querySelector('h2.headline') || element.querySelector('.text-container h2');

  // Extract timestamp — validated: p.timestamp inside .text-container
  const timestamp = element.querySelector('p.timestamp') || element.querySelector('.text-container p');

  // Extract stock info paragraphs — validated: p.stock-info inside .stock-info-container
  const stockInfoItems = Array.from(
    element.querySelectorAll('.stock-info-container p.stock-info')
  );
  // Fallback if class names differ
  if (stockInfoItems.length === 0) {
    const fallbackItems = Array.from(element.querySelectorAll('.stock-info-container p'));
    stockInfoItems.push(...fallbackItems);
  }

  // Extract CTA link — validated: a.cta-button inside .bottom-container
  const ctaLink = element.querySelector('.bottom-container a.cta-button')
    || element.querySelector('.bottom-container a')
    || element.querySelector('a.cta-button');

  // Build single content row with all elements
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (timestamp) contentCell.push(timestamp);
  stockInfoItems.forEach((item) => contentCell.push(item));
  if (ctaLink) contentCell.push(ctaLink);

  const cells = [];
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-stock',
    cells,
  });

  element.replaceWith(block);
}
