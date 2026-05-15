/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-timeline
 * Base block: tabs
 * Source: https://www.chevron.com/who-we-are/history
 * Selector: .x09r.x09r-custom (sticky tab nav + c71-container with era sections)
 * Generated: 2026-05-15
 *
 * Source structure:
 * - .x09r.x09r-custom contains:
 *   - ul.nav.nav-tabs with li.nav-item > a.nav-link > span.cta-underline (tab labels)
 *   - .c71-container with section.section-module.chapter-N elements (tab panels)
 *     - Each section contains:
 *       - .c06r with .type-eyebrow (era range), h2 (era heading), .description (era desc)
 *       - .c71 with .panels > section entries (timeline slides)
 *         - First section in .panels has .dialog with .dialog-item entries
 *           - Each .dialog-item has h3.title (year) and .description (entry text)
 *         - Remaining sections have .bg divs with background-image urls (slide images)
 *
 * Target: Tabs block table (2-column: tab label | tab content)
 * - Each row = one era tab
 * - Tab label = era range (e.g. "1879 - 1911")
 * - Tab content = era heading + description + timeline entries (year + text) + images
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract tab labels from the navigation
  const tabLinks = Array.from(
    element.querySelectorAll('ul.nav-tabs .nav-item a.nav-link, ul.nav-tabs li a.cta-link')
  );

  // Extract tab panel sections from the c71-container
  const tabPanels = Array.from(
    element.querySelectorAll('.c71-container > section.section-module, .c71-container > section[class*="chapter"]')
  );

  // Process each tab panel
  tabPanels.forEach((panel, index) => {
    // --- Tab Label Cell ---
    // Get the label from the corresponding nav link
    let tabLabel = '';
    if (tabLinks[index]) {
      const labelSpan = tabLinks[index].querySelector('.cta-underline');
      tabLabel = labelSpan ? labelSpan.textContent.trim() : tabLinks[index].textContent.trim();
    }

    // Fallback: get the eyebrow from the panel header if no nav link found
    if (!tabLabel) {
      const eyebrow = panel.querySelector('.c06r .type-eyebrow, .type-eyebrow');
      tabLabel = eyebrow ? eyebrow.textContent.trim() : `Tab ${index + 1}`;
    }

    const labelCell = document.createElement('p');
    labelCell.textContent = tabLabel;

    // --- Tab Content Cell ---
    const contentCell = [];

    // Era heading (h2)
    const eraHeading = panel.querySelector('.c06r h2, h2.type-display');
    if (eraHeading) {
      const h2 = document.createElement('h2');
      h2.textContent = eraHeading.textContent.trim();
      contentCell.push(h2);
    }

    // Era description
    const eraDesc = panel.querySelector('.c06r .description, .c06r .type-body');
    if (eraDesc) {
      const descP = document.createElement('p');
      descP.textContent = eraDesc.textContent.trim();
      contentCell.push(descP);
    }

    // Timeline entries from dialog items
    const dialogItems = Array.from(
      panel.querySelectorAll('.c71 .dialog-item, .dialog-text .dialog-item')
    );

    // Timeline slide media: each .panels > section has one .bg element
    // that is either a background-image (still image) or a video-container
    const panelSections = Array.from(
      panel.querySelectorAll('.c71 .panels > section')
    );

    // Collect one media URL per panel section (image or video), preserving order
    const mediaUrls = [];
    panelSections.forEach((sec) => {
      // Find the .bg element (may be nested inside .pin-spacer)
      const bg = sec.querySelector('.bg');
      if (!bg) {
        mediaUrls.push('');
        return;
      }

      // Check for video first (bg.video-container or bg.media-container)
      const videoEl = bg.querySelector('video');
      if (videoEl) {
        const videoSrc = videoEl.getAttribute('data-cvx-media-desktop')
          || (videoEl.querySelector('source') && videoEl.querySelector('source').getAttribute('src'));
        mediaUrls.push(videoSrc || '');
        return;
      }

      // Otherwise extract background-image URL from inline style
      const style = bg.getAttribute('style') || '';
      const urlMatch = style.match(/background-image:\s*url\(\s*['"]?([^'")\s]+)['"]?\s*\)/);
      if (urlMatch) {
        let imgUrl = urlMatch[1];
        // Strip query params for cleaner URL
        const qIndex = imgUrl.indexOf('?');
        if (qIndex > -1) {
          imgUrl = imgUrl.substring(0, qIndex);
        }
        mediaUrls.push(imgUrl);
      } else {
        mediaUrls.push('');
      }
    });

    // Build timeline entries as structured content
    dialogItems.forEach((item, itemIndex) => {
      const yearEl = item.querySelector('h3.title, h3');
      const descEl = item.querySelector('.description, .type-body');

      if (yearEl) {
        const yearH3 = document.createElement('h3');
        yearH3.textContent = yearEl.textContent.trim();
        contentCell.push(yearH3);
      }

      if (descEl) {
        const entryP = document.createElement('p');
        // Preserve inner HTML for <em> and other inline formatting
        entryP.innerHTML = descEl.innerHTML.trim();
        contentCell.push(entryP);
      }

      // Add the corresponding media for this entry (image or video link)
      if (mediaUrls[itemIndex]) {
        const mediaUrl = mediaUrls[itemIndex];
        if (mediaUrl.endsWith('.mp4') || mediaUrl.includes('/videos/')) {
          // Video: create a link element
          const videoLink = document.createElement('a');
          videoLink.href = mediaUrl;
          videoLink.textContent = mediaUrl;
          contentCell.push(videoLink);
        } else {
          // Image: create an img element
          const img = document.createElement('img');
          img.src = mediaUrl;
          img.alt = yearEl ? yearEl.textContent.trim() : '';
          contentCell.push(img);
        }
      }
    });

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-timeline', cells });
  element.replaceWith(block);
}
