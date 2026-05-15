/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-brand
 * Base block: columns
 * Source: https://www.chevron.com/who-we-are/our-brands
 * Generated: 2026-05-15
 *
 * Side-by-side brand showcase: image on one side, text content
 * (heading, description, CTA links) on the other.
 *
 * Target structure (from library example):
 *   | columns-brand |
 *   |---------------|
 *   | image | heading + description + CTA |
 *
 * Source instances (5 total, 3 module types):
 *
 *   1. .c55.left (mod_3f84a58c) - Chevron brand
 *      DOM: .image-side > .caption-container (h2 + div.type-body with p + a.cta-link)
 *           .image-side > .background-container > .background[style=background-image]
 *
 *   2. .c55.right (mod_c7f72683) - Texaco brand
 *      Same as #1 but DOM order reversed (background first, caption second)
 *
 *   3. .c55.left (mod_8ade89c2) - Caltex brand
 *      Same structure as #1
 *
 *   4. .c69.right (mod_59b8ef14) - Gift and credit cards
 *      DOM: .column-container > .background-container > .background[style=background-image]
 *           .column-container > .text-container (h2 + div.description + a.cta-link)
 *
 *   5. .c63 (mod_6d1238a8) - Brand licensing image + links
 *      DOM: section.list-container > div > img
 *           section.list-container > div.lists > ul > li > a
 *
 * Handles variations:
 *   - CSS background-image (c55, c69) vs direct <img> tag (c63)
 *   - Caption in .caption-container (c55) vs .text-container (c69) vs .lists (c63)
 *   - Multiple CTA links in <p> wrappers (c55) vs direct <a> (c69) vs <ul><li><a> (c63)
 *   - Heading levels h2 with h1/h3 fallback
 */
export default function parse(element, { document }) {
  // --- Extract image ---
  // Strategy 1: CSS background-image on .background div (c55 and c69 modules)
  let image = null;
  const bgDiv = element.querySelector('.background-container .background[style], .background[style*="background-image"]');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const urlMatch = style.match(/url\(([^)]+)\)/);
    if (urlMatch) {
      const imgSrc = urlMatch[1].replace(/['"]/g, '').trim();
      image = document.createElement('img');
      image.setAttribute('src', imgSrc);
      image.setAttribute('alt', '');
    }
  }

  // Strategy 2: Direct <img> tag (c63 module - brand licensing)
  if (!image) {
    const directImg = element.querySelector('.list-container > div > img, .list-container img, img');
    if (directImg) {
      image = directImg;
    }
  }

  // --- Extract text content ---
  // Identify the text container based on module type
  const textContainer = element.querySelector('.caption-container, .text-container, .lists');

  // Heading: h2 inside text container (validated across c55 and c69 instances)
  const heading = textContainer
    ? textContainer.querySelector('h2, h1, h3, [class*="header"]')
    : element.querySelector('h2, h1, h3');

  // Description: paragraph or description div
  // c55: paragraphs directly inside div.type-body (first <p> is description, subsequent <p> contain CTA links)
  // c69: div.description contains the text
  // c63: no description, just links
  let description = null;
  if (textContainer) {
    // c69 pattern: .description div
    const descDiv = textContainer.querySelector('.description');
    if (descDiv) {
      description = descDiv;
    } else {
      // c55 pattern: first <p> inside .type-body that does NOT contain a CTA link
      const typeBody = textContainer.querySelector('.type-body, div.text-base');
      if (typeBody) {
        const firstP = typeBody.querySelector('p');
        if (firstP && !firstP.querySelector('a.cta-link, a.cta-button')) {
          description = firstP;
        }
      }
    }
  }

  // CTA links extraction
  // c55: <a class="cta-link"> inside <p> elements within .type-body
  // c69: <a class="cta-link"> directly in .text-container
  // c63: <a> inside <li> elements within .lists ul
  let ctaLinks = [];
  if (textContainer) {
    // c63 pattern: links inside list items
    const listLinks = textContainer.querySelectorAll('ul li a');
    if (listLinks.length > 0) {
      ctaLinks = Array.from(listLinks);
    } else {
      // c55 pattern: CTA links inside paragraphs within .type-body
      const typeBody = textContainer.querySelector('.type-body, div.text-base');
      if (typeBody) {
        const pLinks = typeBody.querySelectorAll('p a.cta-link, p a.cta-button');
        if (pLinks.length > 0) {
          ctaLinks = Array.from(pLinks);
        }
      }
      // c69 pattern: direct CTA links in text container
      if (ctaLinks.length === 0) {
        const directLinks = textContainer.querySelectorAll(':scope > a.cta-link, :scope > a.cta-button, :scope > a');
        ctaLinks = Array.from(directLinks);
      }
    }
  }

  // If no links found in text container, broaden search
  if (ctaLinks.length === 0) {
    ctaLinks = Array.from(element.querySelectorAll('a.cta-link, a.cta-button'));
  }

  // --- Build cells to match library example ---
  // Target: single row with | image | heading + description + CTA links |
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  // Wrap each CTA link in a paragraph for proper rendering
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.getAttribute('href') || '';
    a.textContent = link.textContent.trim();
    // Preserve target attribute for external links
    const target = link.getAttribute('target');
    if (target) a.setAttribute('target', target);
    p.appendChild(a);
    contentCell.push(p);
  });

  const cells = [
    [imageCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-brand', cells });
  element.replaceWith(block);
}
