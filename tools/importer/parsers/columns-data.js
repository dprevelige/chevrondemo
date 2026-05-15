/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-data variant.
 * Base block: columns
 * Source: https://www.chevron.com/investors
 * Generated: 2026-05-14
 *
 * Two-column layout combining a document links list (left, from .c63)
 * and a financial data grid (right, from .c11b) into a single columns block.
 *
 * Instance selectors:
 *   - .c63.background-color-offwhite (document links list)
 *   - .c11b.background-color-offwhite.column-count-xs-2.column-count-md-2 (financial data grid)
 *
 * The parser is called on both elements. The .c63 element builds the full
 * two-column block and removes the .c11b sibling. The .c11b element, if still
 * present, builds the block from its own perspective.
 *
 * Source DOM (validated against cleaned.html lines 380-487 and live page):
 *   .c63.background-color-offwhite (#mod_09158f7b)
 *     .list-container ul li a.cta-parent-link (5 links)
 *     h2.title.type-eyebrow "Supporting materials"
 *   .c11b.background-color-offwhite.column-count-xs-2.column-count-md-2 (#mod_83973b70)
 *     .c11b-container > .item (x6), each with p.description + p.data-point
 *
 * Both elements share parent .flex-container.column-count-2 inside
 * section.section-module. Parser finds sibling via closest('.section-module').
 *
 * Note: Automated headless validation fails because chevron.com blocks
 * headless Chromium (page body renders empty, no DOM content).
 * This affects all parsers for this site equally. Parser logic confirmed
 * correct via manual Playwright evaluation on the live page:
 *   - Left column: h2 "Supporting materials" + 5 links extracted
 *   - Right column: 6 data items (label + value) extracted
 *   - Parent/sibling traversal verified working
 */
export default function parse(element, { document }) {
  const isLinksList = element.classList.contains('c63');
  const isDataGrid = element.classList.contains('c11b');

  // Locate both source elements regardless of which one we are called on
  let linksElement = null;
  let dataElement = null;

  if (isLinksList) {
    linksElement = element;
    // Search for the companion .c11b in the closest section-module ancestor or document
    const section = element.closest('.section-module') || element.closest('.flex-container') || element.parentElement;
    if (section) {
      dataElement = section.querySelector('.c11b.background-color-offwhite.column-count-xs-2');
    }
    if (!dataElement) {
      dataElement = document.querySelector('.c11b.background-color-offwhite.column-count-xs-2.column-count-md-2');
    }
  } else if (isDataGrid) {
    dataElement = element;
    const section = element.closest('.section-module') || element.closest('.flex-container') || element.parentElement;
    if (section) {
      linksElement = section.querySelector('.c63.background-color-offwhite');
    }
    if (!linksElement) {
      linksElement = document.querySelector('.c63.background-color-offwhite');
    }
  }

  // Build left column: document links list
  const leftContent = [];
  if (linksElement) {
    const heading = linksElement.querySelector('h2, .title');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      leftContent.push(h2);
    }

    const links = linksElement.querySelectorAll('ul li a');
    if (links.length > 0) {
      const ul = document.createElement('ul');
      links.forEach((link) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        const textSpan = link.querySelector('span.truncate, span.type-subhead');
        a.textContent = textSpan ? textSpan.textContent.trim() : link.textContent.trim();
        if (link.target) a.target = link.target;
        li.append(a);
        ul.append(li);
      });
      leftContent.push(ul);
    }
  }

  // Build right column: financial data grid
  const rightContent = [];
  if (dataElement) {
    const items = dataElement.querySelectorAll('.c11b-container .item, .item');
    items.forEach((item) => {
      const desc = item.querySelector('p.description');
      const value = item.querySelector('p.data-point');
      if (desc && value) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = value.textContent.trim();
        p.textContent = desc.textContent.trim() + ': ';
        p.append(strong);
        rightContent.push(p);
      }
    });
  }

  // Build cells: single row with two columns [links, data]
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-data',
    cells,
  });

  // Remove the companion element so the validator does not process it again
  if (isLinksList && dataElement && dataElement !== element) {
    dataElement.remove();
  } else if (isDataGrid && linksElement && linksElement !== element) {
    linksElement.remove();
  }

  element.replaceWith(block);
}
