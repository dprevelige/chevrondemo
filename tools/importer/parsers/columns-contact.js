/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-contact
 * Base block: columns
 * Source: https://www.chevron.com/investors
 * Selectors: #mod_042790f4.c06r, #mod_22b0d965.c06r
 * Generated: 2026-05-14
 *
 * Two contact sections displayed side by side in a columns layout:
 *   Left column  = Transfer agent (Computershare) with address, phones, links
 *   Right column = Investor relations with phone, email link, contact names
 *
 * Source DOM structure (validated against cleaned.html lines 1258-1310):
 *   section.section-module.width-1200.centered
 *     div.flex-container.column-count-2.centered
 *       div#mod_042790f4.c06r (Transfer agent)
 *         div.inner-container
 *           div.width-600.centered.text-left.text-container
 *             h2.type-subhead     "Transfer agent"
 *             div.description     contains <p> with address, phone, links
 *       div#mod_22b0d965.c06r (Investor relations)
 *         div.inner-container
 *           div.width-600.centered.text-left.text-container
 *             h2.type-subhead     "Investor relations"
 *             div.description     contains <p> with phone, email link, names
 *
 * Target table:
 *   | columns-contact                      |                               |
 *   | h2 + address/phone/links (transfer)  | h2 + phone/email/names (IR)   |
 *
 * One row with two cells, each cell containing the heading and description
 * paragraphs from a contact module.
 *
 * Validated: Parser extraction verified via non-headless MCP Playwright browser.
 * All selectors confirmed on live page: closest('.column-count-2') finds the
 * flex-container parent, ':scope > .c06r' finds both modules, sibling detection
 * works correctly. Transfer agent extracts h2 + 4 paragraphs (correspondence,
 * address, phones, links). Investor relations extracts h2 + 2 paragraphs
 * (phone/email, contact names).
 *
 * Note: Automated headless hook validation fails because chevron.com blocks
 * headless Chromium (page body renders empty, no DOM content).
 * This affects all parsers for this site equally.
 */
export default function parse(element, { document }) {
  // Helper: extract heading + description paragraphs from a .c06r contact module
  function extractContactContent(mod) {
    const container = document.createElement('div');

    // Heading (h2) — e.g. "Transfer agent" or "Investor relations"
    const heading = mod.querySelector('.text-container h2') || mod.querySelector('h2');
    if (heading) {
      container.append(heading);
    }

    // Description div contains <p> elements with address, phone, links, contact names
    const description = mod.querySelector('.text-container .description') || mod.querySelector('.description');
    if (description) {
      const paras = Array.from(description.querySelectorAll(':scope > p'));
      paras.forEach((p) => container.append(p));
    }

    return container;
  }

  // Build the left cell from the current element
  const leftCell = extractContactContent(element);

  // Attempt to find the sibling contact module in the shared flex-container parent
  const flexParent = element.closest('.column-count-2') || element.closest('.flex-container') || element.parentElement;
  let siblingMod = null;
  if (flexParent) {
    const allModules = Array.from(flexParent.querySelectorAll(':scope > .c06r'));
    siblingMod = allModules.find((mod) => mod !== element) || null;
  }

  // Build cells: one row with left and right columns
  const cells = [];
  if (siblingMod) {
    const rightCell = extractContactContent(siblingMod);
    cells.push([leftCell, rightCell]);
    // Remove sibling so it is not processed again as a separate block
    siblingMod.remove();
  } else {
    // Fallback: single column if sibling not found or already consumed
    cells.push([leftCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-contact',
    cells,
  });

  element.replaceWith(block);
}
