/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-feature
 * Base block: carousel
 * Source: https://www.chevron.com/what-we-do/technology-and-innovation
 * Selector: .c56.carousel-shared
 * Generated: 2026-05-15
 *
 * Source HTML structure (c56 split-layout carousel):
 *   div.c56.carousel-shared
 *     section.splide
 *       div.splide__track
 *         div.splide__list
 *           div.splide__slide
 *             a.cta-link-parent[href]
 *               div.text-content-left
 *                 div.content-container.text-left
 *                   p.type-body.text-reduced       — category text (e.g. "Our operations")
 *                   h5.type-subhead.title           — heading
 *                   p.cta-container > span.cta-link > span.cta-underline — CTA text
 *               div.inner-slide-wrapper[style="background-image: url(...)"] — slide image
 *
 * Target table structure:
 *   | carousel-feature |
 *   |------------------|
 *   | image | category + heading + CTA |
 *   | image | category + heading + CTA |
 *   ... (one row per slide)
 *
 * Each slide becomes a row with 2 cells:
 *   Cell 1: image extracted from the background-image CSS
 *   Cell 2: category text + heading + CTA link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Select real slides only (exclude Splide clones)
  const slides = element.querySelectorAll('.splide__slide:not(.splide__slide--clone)');

  slides.forEach((slide) => {
    // The <a> wrapping the entire slide provides the link target
    const link = slide.querySelector('a.cta-link-parent, a[href]');
    const href = link ? link.getAttribute('href') : '';

    // --- Image cell ---
    // c56 uses background-image on .inner-slide-wrapper instead of an <img>
    const bgWrapper = slide.querySelector('.inner-slide-wrapper');
    let imageCell = '';

    if (bgWrapper) {
      const style = bgWrapper.getAttribute('style') || '';
      const bgMatch = style.match(/background-image:\s*url\(([^)]+)\)/);
      if (bgMatch) {
        let bgUrl = bgMatch[1].replace(/['"]/g, '').trim();
        const img = document.createElement('img');
        img.src = bgUrl;
        img.alt = '';
        imageCell = img;
      }
    }

    // Fallback: if an <img> is present instead of background-image
    if (!imageCell) {
      const fallbackImg = slide.querySelector('.image-container img, img');
      if (fallbackImg) {
        imageCell = fallbackImg;
      }
    }

    // --- Content cell ---
    const contentContainer = slide.querySelector('.content-container, .text-content-left');
    const contentItems = [];

    // Category text (e.g. "Our operations")
    const categoryEl = slide.querySelector('.content-container p.type-body, .content-container .type-body:not(.cta-container)');
    if (categoryEl) {
      const category = document.createElement('p');
      category.textContent = categoryEl.textContent.trim();
      contentItems.push(category);
    }

    // Heading (h5 in source, fallback to h4, h3, h2)
    const headingEl = slide.querySelector('.content-container h5, .content-container h4, .content-container h3, .content-container h2');
    if (headingEl) {
      contentItems.push(headingEl);
    }

    // CTA link — build from wrapping <a> href and CTA text
    if (href) {
      const ctaTextEl = slide.querySelector('.cta-underline');
      const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : 'Learn more';
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = ctaText;
      contentItems.push(cta);
    }

    // Only add the row if we have at least some content
    if (imageCell || contentItems.length > 0) {
      cells.push([imageCell || '', contentItems]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-feature',
    cells,
  });

  element.replaceWith(block);
}
