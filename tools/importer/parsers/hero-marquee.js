/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-marquee
 * Base block: hero
 * Source: https://www.chevron.com/
 * Selector: .text-marquee.background-color-dark-blue
 * Generated: 2026-05-14
 *
 * Extracts:
 *   Row 1: Eyebrow paragraph + heading (three animated phrases combined into one heading)
 *   Row 2: Three employee photos
 *
 * Source HTML structure (validated against live DOM):
 *   div.text-marquee.background-color-dark-blue
 *     div.inner-container
 *       div.heading-container
 *         p.type-eyebrow ("Who we are")
 *         h2.heading > span.text-animation x3
 *       div.content-container
 *         div.images-container
 *           div.first-image > img.img-fluid
 *           div.second-image > img.img-fluid
 *           div.third-image > img.img-fluid
 */
export default function parse(element, { document }) {
  // --- Extract eyebrow text ---
  const eyebrowEl = element.querySelector('p.type-eyebrow, .type-eyebrow');
  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';

  // --- Extract heading: combine animated spans into a single heading ---
  const headingSpans = element.querySelectorAll('h2 .text-animation, h2 span[class*="text-animation"]');
  let headingText = '';
  if (headingSpans.length > 0) {
    const phrases = [];
    headingSpans.forEach(function(span) {
      var text = span.textContent.trim();
      if (text) phrases.push(text);
    });
    headingText = phrases.join(', ');
  } else {
    // Fallback: use the h2 directly
    var h2El = element.querySelector('h2');
    if (h2El) headingText = h2El.textContent.trim();
  }

  // --- Build Row 1 content: eyebrow paragraph + heading in a container ---
  var row1 = [];
  if (eyebrowText) {
    var pEyebrow = document.createElement('p');
    pEyebrow.textContent = eyebrowText;
    row1.push(pEyebrow);
  }
  if (headingText) {
    var h2 = document.createElement('h2');
    h2.textContent = headingText;
    row1.push(h2);
  }

  // --- Extract the three images from source ---
  var imgElements = element.querySelectorAll('.images-container img, .images-container .image img');
  var row2 = [];
  imgElements.forEach(function(img) {
    var newImg = document.createElement('img');
    newImg.src = img.getAttribute('src') || img.src;
    if (img.getAttribute('alt')) {
      newImg.alt = img.getAttribute('alt');
    }
    row2.push(newImg);
  });

  // --- Build cells: each entry is one row ---
  var cells = [];
  if (row1.length > 0) {
    cells.push(row1);
  }
  if (row2.length > 0) {
    cells.push(row2);
  }

  var block = WebImporter.Blocks.createBlock(document, { name: 'hero-marquee', cells: cells });
  element.replaceWith(block);
}
