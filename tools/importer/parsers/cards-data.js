/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-data
 * Base block: cards
 * Source: https://www.chevron.com/sustainability/climate
 * Description: Data metric cards with no images — large numerical values with labels.
 *   Each card has a title (metric name + unit), scope info, and a large data-point value.
 * Generated: 2026-05-15
 */
export default function parse(element, { document }) {
  // Each card item is a .c11b-2.item or .item within the c11b container
  const cards = element.querySelectorAll(':scope .c11b-container .item, :scope .c11b-2.item');

  const cells = [];

  cards.forEach((card) => {
    // Extract the description text (metric title, unit, scope)
    // The description contains <strong> with title+unit and <p> with scope info
    const descriptionEl = card.querySelector('.description');
    const dataPointEl = card.querySelector('.data-point');

    const cardContent = [];

    if (descriptionEl) {
      cardContent.push(descriptionEl);
    }
    if (dataPointEl) {
      cardContent.push(dataPointEl);
    }

    if (cardContent.length > 0) {
      cells.push(cardContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-data', cells });
  element.replaceWith(block);
}
