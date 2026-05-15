/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote-executive
 * Base block: quote
 * Source: https://www.chevron.com/sustainability/environment
 * Generated: 2026-05-15
 *
 * Executive testimonial quote with headshot photo.
 * Structure: 3 rows
 *   Row 1: Headshot image
 *   Row 2: Quote text
 *   Row 3: Attribution (name, em-wrapped title)
 */
export default function parse(element, { document }) {
  // Extract headshot image from .img-container
  const image = element.querySelector('.img-container img');

  // Extract quote text from blockquote
  // The full quote is in the aria-label attribute of the <p> inside blockquote.quote
  const quoteParagraph = element.querySelector('blockquote.quote p, blockquote p');
  let quoteText = '';
  if (quoteParagraph) {
    // The aria-label contains the clean quote text without the animation divs
    quoteText = quoteParagraph.getAttribute('aria-label') || '';
    // Fallback: extract text from the divs inside the paragraph
    if (!quoteText) {
      const divs = quoteParagraph.querySelectorAll('div');
      if (divs.length > 0) {
        quoteText = Array.from(divs).map((d) => d.textContent.trim()).join(' ');
      } else {
        quoteText = quoteParagraph.textContent.trim();
      }
    }
  }

  // Extract attribution name and title from .name-position
  const namePosition = element.querySelector('.name-position p, figcaption p');
  let authorName = '';
  let authorTitle = '';
  if (namePosition) {
    const spans = namePosition.querySelectorAll('span:not(.pipe)');
    if (spans.length >= 2) {
      authorName = spans[0].textContent.trim();
      authorTitle = spans[1].textContent.trim();
    } else if (spans.length === 1) {
      authorName = spans[0].textContent.trim();
    } else {
      // Fallback: split on pipe character
      const text = namePosition.textContent.trim();
      const parts = text.split('|').map((p) => p.trim());
      authorName = parts[0] || '';
      authorTitle = parts[1] || '';
    }
  }

  // Build cells array matching block library structure
  const cells = [];

  // Row 1: Headshot image
  if (image) {
    const imgEl = document.createElement('img');
    imgEl.src = image.src;
    imgEl.alt = image.alt || '';
    cells.push([imgEl]);
  }

  // Row 2: Quote text as a paragraph
  const quoteP = document.createElement('p');
  quoteP.textContent = quoteText;
  cells.push([quoteP]);

  // Row 3: Attribution with name and em-wrapped title
  const attributionContainer = document.createElement('p');
  if (authorName) {
    attributionContainer.textContent = authorName;
  }
  if (authorTitle) {
    const comma = document.createTextNode(', ');
    const em = document.createElement('em');
    em.textContent = authorTitle;
    attributionContainer.appendChild(comma);
    attributionContainer.appendChild(em);
  }
  cells.push([attributionContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-executive', cells });
  element.replaceWith(block);
}
