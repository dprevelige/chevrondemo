/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Chevron site-wide cleanup.
 * Removes non-authorable content (header, footer, nav, cookie banners, overlays)
 * and cleans up elements that interfere with block parsing.
 *
 * Selectors validated against captured DOM (migration-work/cleaned.html)
 * and standard HTML5 semantic elements present on the live site shell.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that may block or interfere with block parsing on the live page.
    // Cookie consent overlays, modals, and widget containers.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '[class*="cookie"]',
      '[id*="cookie"]',
    ]);

    // Fix overflow:hidden on the main element if present (can affect parsing).
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'scroll';
    }
  }

  if (hookName === H.after) {
    // Remove non-authorable site shell elements (present on live page, not in cleaned.html).
    // These are standard HTML5 semantic elements used in site chrome.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'iframe',
      'link',
      'noscript',
      'script',
    ]);
  }
}
