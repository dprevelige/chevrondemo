/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-leadership
 * Base block: cards
 * Source: https://www.chevron.com/who-we-are/leadership
 * Generated: 2026-05-15
 *
 * Leadership card grid showing corporate officers. Each card has a
 * headshot photo, officer name, and job title. The CEO card may be
 * featured (larger format) in a separate container, while the rest
 * appear in a 3-column grid.
 *
 * Source DOM structure (validated against cleaned.html):
 *
 *   Featured CEO card:
 *     a.officer-featured[href]
 *       img[alt]
 *       div.officer-info
 *         span.name   (e.g. "Mike Wirth*^")
 *         span.title  (e.g. "Chairman of the Board and Chief Executive Officer")
 *
 *   Officers grid:
 *     div.officers-grid
 *       a[href] (x15+)
 *         img[alt]
 *         div.officer-info
 *           span.name   (e.g. "Mark A. Nelson*^")
 *           span.title  (e.g. "Vice Chairman")
 *
 * Target table (from cards library example):
 *   | cards-leadership |
 *   | image | name (linked) + title |  (per officer row)
 *
 * Handles variations:
 *   - Featured single officer card (a.officer-featured)
 *   - Officer grid cards (div.officers-grid > a)
 *   - Missing images (fallback to empty string)
 *   - Missing name or title spans (defensive checks)
 *   - Different officer-info markup (fallback to any child elements)
 *
 * Note: This parser handles two DOM contexts:
 *   1. When called on a.officer-featured — produces a single-row cards block
 *   2. When called on div.officers-grid — produces a multi-row cards block
 *   Both produce the same row format: [image, name + title]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which officer link elements to process.
  // If the element itself is an anchor (featured officer card),
  // treat it as the sole card. Otherwise, find all anchor children
  // within the officers grid container.
  let officerLinks;
  if (element.tagName === 'A' || element.matches('a.officer-featured')) {
    officerLinks = [element];
  } else {
    officerLinks = Array.from(element.querySelectorAll(':scope > a'));
    // Fallback: if no direct child anchors, try any descendant anchors
    if (officerLinks.length === 0) {
      officerLinks = Array.from(element.querySelectorAll('a[href]'));
    }
  }

  officerLinks.forEach((link) => {
    // --- Cell 1: headshot image ---
    const image = link.querySelector('img');

    // --- Cell 2: name (as link) + title ---
    const contentCell = [];
    const infoDiv = link.querySelector('.officer-info');

    if (infoDiv) {
      const nameSpan = infoDiv.querySelector('span.name, .name');
      const titleSpan = infoDiv.querySelector('span.title, .title');

      // Create a linked name element (preserves the officer bio link)
      if (nameSpan) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || '';
        const strong = document.createElement('strong');
        strong.textContent = nameSpan.textContent.trim();
        a.appendChild(strong);
        p.appendChild(a);
        contentCell.push(p);
      }

      // Add the title as a separate paragraph
      if (titleSpan) {
        const p = document.createElement('p');
        p.textContent = titleSpan.textContent.trim();
        contentCell.push(p);
      }
    } else {
      // Fallback: extract text content directly from the link
      const textContent = link.textContent.trim();
      if (textContent) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || '';
        a.textContent = textContent;
        p.appendChild(a);
        contentCell.push(p);
      }
    }

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-leadership', cells });
  element.replaceWith(block);
}
