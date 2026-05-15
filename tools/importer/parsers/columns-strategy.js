/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-strategy
 * Base block: columns
 * Source: https://www.chevron.com/sustainability/climate
 * Description: Two-column strategy pillar layout showing key climate strategy items.
 *   Each column contains an image above a heading.
 * Generated: 2026-05-15
 */
export default function parse(element, { document }) {
  // The source element is a section.section-module containing a div.flex-container.column-count-2
  // with child section.section-module elements, each having a .c17e (image) and .c06r (heading).
  const flexContainer = element.querySelector('.flex-container.column-count-2, [class*="flex-container"][class*="column-count"]');
  const columnSections = flexContainer
    ? Array.from(flexContainer.querySelectorAll(':scope > section.section-module, :scope > .section-module'))
    : Array.from(element.querySelectorAll(':scope > section.section-module, :scope > .section-module'));

  // Build one row with N cells (one per column). Each cell contains image + heading.
  const row = [];

  columnSections.forEach((colSection) => {
    const img = colSection.querySelector('.c17e img.img-fluid, .c17e img, img');
    const heading = colSection.querySelector('.c06r h2, .c06r h3, h2, h3');

    const cellContent = [];
    if (img) {
      cellContent.push(img);
    }
    if (heading) {
      cellContent.push(heading);
    }
    row.push(cellContent);
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-strategy', cells });
  element.replaceWith(block);
}
