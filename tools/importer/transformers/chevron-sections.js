/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Chevron section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks
 * for sections with style properties (dark-blue, dark-green).
 *
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 *
 * Section selectors validated against live DOM (https://www.chevron.com/who-we-are):
 *   section-1:  .c74.video-common
 *   section-2:  .c06r.background-color-dark-blue.text-elevated
 *   section-3:  .c72.background-color-dark-blue
 *   section-4:  .c64.animated.right.background-color-white:nth-of-type(1)  -> 1st of 2 matches
 *   section-5:  .c64.animated.left.background-color-white
 *   section-6:  .c64.animated.right.background-color-white:nth-of-type(2)  -> 2nd of 2 matches
 *   section-7:  [".c06r.background-color-dark-green.text-reduced", ".c17e.background-color-dark-green"]
 *   section-8:  .c06r.background-color-white.text-reduced
 *   section-9:  [".c69.left.background-color-white.contained:nth-of-type(1)", ".c69.right.background-color-white.contained", ".c69.left.background-color-white.contained:nth-of-type(2)"]
 *   section-10: .c57.carousel-shared
 *   section-11: .c60.background-color-dark-blue
 *
 * Note: :nth-of-type(N) does not work reliably on the live page because all sections
 * are <div> elements (same type). We parse :nth-of-type(N) from the selector string
 * and use querySelectorAll + index to find the correct match.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

/**
 * Resolves a selector that may contain :nth-of-type(N) by using querySelectorAll
 * on the base selector and returning the Nth match (1-indexed from the pseudo-selector).
 * For selectors without :nth-of-type, falls back to querySelector.
 */
function resolveSelector(root, selector) {
  const nthMatch = selector.match(/:nth-of-type\((\d+)\)$/);
  if (nthMatch) {
    const baseSelector = selector.replace(/:nth-of-type\(\d+\)$/, '');
    const index = parseInt(nthMatch[1], 10) - 1; // Convert 1-based to 0-based
    const allMatches = root.querySelectorAll(baseSelector);
    return allMatches[index] || null;
  }
  return root.querySelector(selector);
}

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to preserve DOM positions.
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first element matching any of the section's selectors.
      let firstEl = null;
      for (const sel of selectors) {
        const found = resolveSelector(element, sel);
        if (found) {
          firstEl = found;
          break;
        }
      }

      if (!firstEl) continue;

      // Add Section Metadata block after the last element of this section if style is set.
      if (section.style) {
        // Find the last element belonging to this section (for multi-selector sections).
        let lastEl = firstEl;
        if (selectors.length > 1) {
          for (let s = selectors.length - 1; s >= 0; s--) {
            const found = resolveSelector(element, selectors[s]);
            if (found) {
              lastEl = found;
              break;
            }
          }
        }

        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert Section Metadata after the last element of this section.
        if (lastEl.nextSibling) {
          lastEl.parentNode.insertBefore(metadataBlock, lastEl.nextSibling);
        } else {
          lastEl.parentNode.appendChild(metadataBlock);
        }
      }

      // Insert <hr> before the first element of non-first sections.
      if (i > 0) {
        const hr = document.createElement('hr');
        firstEl.parentNode.insertBefore(hr, firstEl);
      }
    }
  }
}
