/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-social
 * Base block: accordion
 * Source: https://www.chevron.com/sustainability/social-investment
 * Selector: .c66 (expandable list with dialog modals)
 * Generated: 2026-05-15
 *
 * Source structure:
 * - .c66 contains ul.list with li.list-item entries
 * - Each li has an <a> linking to a dialog (OpenDialog('mod_xxx'))
 * - Inside each <a>: .cta-date (category eyebrow) + .cta-text (title)
 * - Associated <dialog> elements contain: eyebrow, h2, description, and image
 *
 * Target: Standard accordion block table
 * - Each row = [title cell, content cell]
 * - Title cell: category + title text
 * - Content cell: description paragraph(s) and optional image
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all list items from the accordion trigger list
  const listItems = element.querySelectorAll('ul.list > li.list-item, ul > li.list-item, li.list-item');

  listItems.forEach((li) => {
    const link = li.querySelector('a.cta-link-parent, a[href*="OpenDialog"]');
    if (!link) return;

    // Extract the title info from the trigger element
    const categoryEl = link.querySelector('.cta-date, .type-eyebrow');
    const titleEl = link.querySelector('.cta-text');

    const category = categoryEl ? categoryEl.textContent.trim() : '';
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Build the title cell: category + title as structured content
    const titleCell = [];
    if (category) {
      const categoryP = document.createElement('p');
      categoryP.textContent = category;
      titleCell.push(categoryP);
    }
    if (title) {
      const titleH = document.createElement('h3');
      titleH.textContent = title;
      titleCell.push(titleH);
    }

    // Extract the dialog ID from the link href
    const href = link.getAttribute('href') || '';
    const dialogIdMatch = href.match(/OpenDialog\('([^']+)'\)/);
    const dialogId = dialogIdMatch ? dialogIdMatch[1] : null;

    // Build the content cell from the associated dialog
    const contentCell = [];

    if (dialogId) {
      // Find the dialog element in the document (it may be outside the current element)
      const dialog = document.querySelector(`#${dialogId}, dialog#${dialogId}`);

      if (dialog) {
        // Extract description from dialog body
        const description = dialog.querySelector('.description, .modal-body .description');
        if (description) {
          const descP = document.createElement('p');
          descP.textContent = description.textContent.trim();
          contentCell.push(descP);
        }

        // Extract image from dialog body
        const img = dialog.querySelector('.c17e img.img-fluid, .modal-body img.img-fluid, .opening-content img');
        if (img) {
          const imgClone = img.cloneNode(true);
          contentCell.push(imgClone);
        }
      }
    }

    // Fallback: if no dialog content found, use the title as content
    if (contentCell.length === 0) {
      const fallbackP = document.createElement('p');
      fallbackP.textContent = title || 'Content not available';
      contentCell.push(fallbackP);
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-social', cells });
  element.replaceWith(block);
}
