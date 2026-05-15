/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Base block: cards
 * Source: https://www.chevron.com/sustainability/climate
 * Description: Feature showcase cards with illustrations/images and CTAs.
 *   Each card has an image, heading, description, and learn more link.
 *   Cards displayed in a scroll-triggered panel layout.
 * Structure: Row per card with col1=illustration, col2=heading + description + CTA
 * Generated: 2026-05-15
 */
export default function parse(element, { document }) {
  // Each card is inside .card-container > .card
  const cards = element.querySelectorAll('.card-container > .card');

  const cells = [];

  cards.forEach((card) => {
    // Extract illustration/image from .image-container
    const image = card.querySelector('.image-container img.img-fluid');

    // Extract heading from h3.sub-header - use the visible desktop span text
    const heading = card.querySelector('h3.sub-header');

    // Extract description from .text-container .description
    const description = card.querySelector('.text-container .description.type-body');

    // Extract CTA link from .cta-container a
    const ctaLink = card.querySelector('.cta-container a.cta-button');

    // Build the content cell (heading + description + CTA)
    const contentCell = [];

    if (heading) {
      // Create a clean h3 with just the text content (avoid duplicate button text)
      const cleanHeading = document.createElement('h3');
      // Prefer the desktop-visible span text, fallback to full heading textContent
      const desktopSpan = heading.querySelector('span.d-none.d-lg-inline');
      cleanHeading.textContent = desktopSpan
        ? desktopSpan.textContent.trim()
        : heading.textContent.trim();
      contentCell.push(cleanHeading);
    }

    if (description) {
      contentCell.push(description);
    }

    if (ctaLink) {
      // Create a clean link preserving href and text
      const cleanLink = document.createElement('a');
      cleanLink.href = ctaLink.href;
      cleanLink.textContent = ctaLink.textContent.trim();
      if (ctaLink.target) cleanLink.target = ctaLink.target;
      if (ctaLink.rel) cleanLink.rel = ctaLink.rel;
      contentCell.push(cleanLink);
    }

    // Row: [image, content (heading + description + CTA)]
    const imageCell = image ? [image] : [];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
