/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature
 * Base block: columns
 * Source: https://www.chevron.com/who-we-are
 * Selector: .c69.contained
 * Generated: 2026-05-14
 *
 * Two-column feature layout: large image on one side, colored text panel
 * with heading, description, and CTA on the other.
 *
 * Target structure (from library example):
 *   | Columns |
 *   |---------|
 *   | image | heading + description + CTA |
 *
 * Validated against live DOM (3 instances):
 *   - "Our brands" with image, description, CTA -> /who-we-are/our-brands
 *   - "Leadership" with image, description, CTA -> /who-we-are/leadership
 *   - "Careers" with image, description, CTA -> http://careers.chevron.com
 */
export default function parse(element, { document }) {
  // --- Extract image ---
  // Source uses CSS background-image on a .background div, not an <img> tag.
  // Extract the URL and create a proper <img> element for the block table.
  const bgDiv = element.querySelector('.background-container .background, .background[style*="background-image"]');
  let image = null;
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const urlMatch = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (urlMatch) {
      const imgSrc = urlMatch[1].replace(/['"]/g, '').trim();
      image = document.createElement('img');
      image.setAttribute('src', imgSrc);
      image.setAttribute('alt', '');
    }
  }
  // Fallback: check for an actual <img> tag in the background container
  if (!image) {
    image = element.querySelector('.background-container img, .col img');
  }

  // --- Extract text content ---
  // Text container is a .col sibling with heading, description, and CTA link
  const textContainer = element.querySelector('.text-container, .col:not(.background-container)');

  // Heading: h2 inside text container (validated), with fallbacks for h1/h3
  const heading = textContainer
    ? textContainer.querySelector('h2, h1, h3, [class*="heading"], [class*="title"]')
    : element.querySelector('h2, h1, h3');

  // Description: .description div inside text container (validated), with p fallback
  const description = textContainer
    ? textContainer.querySelector('.description, p, [class*="description"]')
    : element.querySelector('.description, p');

  // CTA link(s): anchor tags in text container (validated: one per instance)
  const ctaLinks = textContainer
    ? Array.from(textContainer.querySelectorAll('a'))
    : Array.from(element.querySelectorAll('.text-container a, a.cta, a.button'));

  // --- Build cells to match library example ---
  // Library structure: single row with | image | heading + description + CTA |
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  const cells = [
    [imageCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
