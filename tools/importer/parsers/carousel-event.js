/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-event
 * Base block: carousel
 * Source: https://www.chevron.com/investors
 * Selector: #mod_e8d51090.c57.carousel-shared
 * Generated: 2026-05-14
 *
 * Source DOM structure (validated against cleaned.html lines 722-1069):
 *   div#mod_e8d51090.c57.carousel-shared
 *     section.splide > .events > .splide-wrapper > .splide__track > .splide__list
 *       div.splide__slide (x15, text-only, no images)
 *         a.cta-link-parent[href] (wraps entire slide)
 *           div.inner-slide-wrapper.background-color-{color}
 *             div.content-container.text-left
 *               h3.type-subhead.slide-header.text-base (event name)
 *               p.type-body.text-reduced.date > span (date text)
 *               p.cta-container > span.cta-link > span.cta-underline (CTA text)
 *
 * Target table structure:
 *   | carousel-event |
 *   | heading + date + CTA |  (one row per slide, single cell)
 *   | heading + date + CTA |
 *   ... (15 slides)
 *
 * Text-only carousel with 15 event slides showing earnings calls,
 * presentations, and investor events. Each slide has: event name
 * (h3 heading), date, and CTA link. No images in any slide.
 * Each slide = one row with 1 cell containing heading + date + CTA.
 *
 * Handles variations:
 *   - Slides with and without date (some may omit date)
 *   - Different CTA text (View event details, View document, View presentation, etc.)
 *   - External links (target="_blank") vs internal links
 *   - Different background colors per slide (medium-blue, white)
 *
 * Note: Automated headless validation fails because chevron.com blocks
 * headless Chromium (page body renders empty, no DOM content).
 * This affects all parsers for this site equally. Parser logic
 * confirmed correct via source HTML analysis (cleaned.html lines 722-1069).
 * All 15 slides verified against cleaned.html: selectors .splide__slide,
 * a.cta-link-parent, h3.slide-header, p.date>span, .cta-underline — all verified in source DOM.
 */
export default function parse(element, { document }) {
  // Select all slides from the splide carousel list
  const slides = element.querySelectorAll('.splide__slide');
  const cells = [];

  slides.forEach((slide) => {
    const cellContent = [];

    // Extract the wrapping link (provides href and target)
    const linkParent = slide.querySelector('a.cta-link-parent, a[href]');
    const href = linkParent ? linkParent.getAttribute('href') : '';

    // Extract heading (event name) - h3.slide-header inside .content-container
    const heading = slide.querySelector('h3.slide-header, h3, h2');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      cellContent.push(h);
    }

    // Extract date - p.date > span inside .content-container
    const dateSpan = slide.querySelector('p.date span, .date span');
    if (dateSpan) {
      const p = document.createElement('p');
      p.textContent = dateSpan.textContent.trim();
      cellContent.push(p);
    }

    // Build CTA link using href from wrapping <a> and text from .cta-underline
    const ctaUnderline = slide.querySelector('.cta-underline');
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = ctaUnderline ? ctaUnderline.textContent.trim() : 'View details';
      if (linkParent && linkParent.getAttribute('target') === '_blank') {
        a.setAttribute('target', '_blank');
      }
      p.appendChild(a);
      cellContent.push(p);
    }

    // Only add row if we have content
    if (cellContent.length > 0) {
      cells.push([cellContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-event', cells });
  element.replaceWith(block);
}
