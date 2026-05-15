/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-image
 * Base block: carousel
 * Source: https://www.chevron.com/who-we-are/culture
 * Selector: .c58.carousel-shared
 * Generated: 2026-05-15
 *
 * Source structure: Splide image carousel (.c58.carousel-shared).
 * Each slide is li.splide__slide containing:
 *   - .background div with <img class="img-fluid"> (src + alt)
 *   - .caption-container with <p> caption text
 *
 * Target table (from library Carousel block):
 *   | carousel-image          |
 *   |------------|------------|
 *   | image      | caption    |
 *   | image      | caption    |
 *   ... (one row per slide)
 *
 * Each row = one slide: image in cell 1, caption text in cell 2.
 * Caption is optional per the library spec (text content column is optional).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Select all carousel slides - supports both <li> and <div> slide containers
  const slides = element.querySelectorAll('.splide__slide');

  slides.forEach((slide) => {
    // Image cell: extract img from .background container or directly
    const img = slide.querySelector('.background img, img.img-fluid, img');

    // Caption cell: extract caption text from .caption-container
    const captionContainer = slide.querySelector('.caption-container');
    const captionText = captionContainer
      ? captionContainer.querySelector('p, div, span')
      : null;

    // Build the row: [image, caption]
    // Image is mandatory; caption is optional
    if (img) {
      const contentCell = [];
      if (captionText) {
        contentCell.push(captionText);
      }
      cells.push([img, contentCell.length > 0 ? contentCell : '']);
    }
  });

  // Fallback: if no splide slides found, try direct img elements
  if (cells.length === 0) {
    const fallbackImages = element.querySelectorAll('img');
    fallbackImages.forEach((img) => {
      cells.push([img, '']);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-image',
    cells,
  });

  element.replaceWith(block);
}
