/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-article
 * Base block: carousel
 * Source: https://www.chevron.com/who-we-are
 * Selector: .c57.carousel-shared
 * Generated: 2026-05-14
 *
 * Source structure: Splide carousel with article slides. Each slide is
 * .splide__slide > a > .inner-slide-wrapper containing .image-container (img)
 * and .content-container (p.date, h3, span "read article").
 *
 * Target table (from library example):
 *   | carousel-article |
 *   |------------------|
 *   | image | date + headline + CTA |
 *   | image | date + headline + CTA |
 *   ... (one row per slide)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Select all carousel slides
  const slides = element.querySelectorAll('.splide__slide');

  slides.forEach((slide) => {
    // The <a> wraps the entire slide content
    const link = slide.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : '';

    // Image cell: extract the img from the image container
    const img = slide.querySelector('.image-container img, img');

    // Content cell: date, headline, and CTA link
    const dateEl = slide.querySelector('.date, .content-container p');
    const headingEl = slide.querySelector('h3, h2, h4');

    const contentItems = [];
    if (dateEl) contentItems.push(dateEl);
    if (headingEl) contentItems.push(headingEl);

    // Build CTA link from the wrapping <a> href and the "read article" text
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = 'read article';
      contentItems.push(cta);
    }

    // Each slide becomes one row: [image, content]
    cells.push([img || '', contentItems]);
  });

  // Fallback: if no splide slides found, try article link containers
  if (cells.length === 0) {
    const fallbackLinks = element.querySelectorAll('.articles a[href], a[href]');
    fallbackLinks.forEach((link) => {
      const img = link.querySelector('img');
      const dateEl = link.querySelector('.date, p');
      const headingEl = link.querySelector('h3, h2, h4');

      const contentItems = [];
      if (dateEl) contentItems.push(dateEl);
      if (headingEl) contentItems.push(headingEl);

      const cta = document.createElement('a');
      cta.href = link.getAttribute('href');
      cta.textContent = 'read article';
      contentItems.push(cta);

      cells.push([img || '', contentItems]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-article',
    cells,
  });

  element.replaceWith(block);
}
