/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Source: https://www.chevron.com/
 * Selector: .c70.video-common.carousel-shared
 * Generated: 2026-05-14
 * Validated: manually via Playwright (chevron.com returns 403 to headless browsers; all selectors verified on live DOM)
 *
 * Source HTML structure:
 *   div.c70.video-common.carousel-shared
 *     section.splide
 *       div.splide__track
 *         ul.splide__list
 *           li.splide__slide (real slides have id="splide02-slideNN", clones have class "splide__slide--clone")
 *             div.media-container.video-container.slide-inner
 *               div.video-inner-container
 *                 video.video[poster="..."][data-cvx-media-desktop="...mp4"]
 *                   source[src="...mp4"]
 *                   img.img-fluid[alt="..."]
 *       div.content-container
 *         ul.content-list
 *           li.list-item (one per slide, matched by index)
 *             div.text-container
 *               div.text-container-inner
 *                 h2.heading
 *                 div.description (paragraph text)
 *                 p.cta-container > a.cta-link > span.cta-underline
 *
 * Target table structure:
 *   | carousel-hero |
 *   |---------------|
 *   | video-url + poster-image | heading + description + CTA |
 *   | video-url + poster-image | heading + description + CTA |
 *   ... (one row per slide)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Collect real slides (exclude clones) ---
  // Real slides have IDs like "splide02-slide01" without "--clone" class
  let realSlides = Array.from(
    element.querySelectorAll('.splide__slide:not(.splide__slide--clone)')
  );

  // Fallback: if no non-clone slides found, use all slides
  if (realSlides.length === 0) {
    realSlides = Array.from(element.querySelectorAll('.splide__slide'));
  }

  // --- Collect text content items (matched by index to slides) ---
  const textItems = Array.from(
    element.querySelectorAll('.content-container .content-list .list-item, .content-container .list-item')
  );

  // --- Build one row per slide ---
  realSlides.forEach((slide, index) => {
    // --- Media cell: video URL + poster image ---
    const video = slide.querySelector('video');
    const videoSource = slide.querySelector('video source[src]');

    const mediaItems = [];

    // Extract video URL (prefer data-cvx-media-desktop, fallback to source src)
    const videoUrl =
      (video && video.getAttribute('data-cvx-media-desktop')) ||
      (videoSource && videoSource.getAttribute('src')) ||
      (video && video.getAttribute('src'));

    if (videoUrl) {
      const videoLink = document.createElement('a');
      videoLink.href = videoUrl;
      videoLink.textContent = videoUrl;
      mediaItems.push(videoLink);
    }

    // Extract poster image
    const posterUrl = video && video.getAttribute('poster');
    if (posterUrl) {
      const posterImg = document.createElement('img');
      posterImg.src = posterUrl;
      // Use alt from the fallback img inside the video element if available
      const fallbackImg = slide.querySelector('video img, .video-inner-container img');
      posterImg.alt = (fallbackImg && fallbackImg.getAttribute('alt')) || '';
      mediaItems.push(posterImg);
    }

    // --- Content cell: heading + description + CTA ---
    const contentItems = [];

    // Match text content by index
    const textItem = textItems[index];
    if (textItem) {
      const heading = textItem.querySelector('h2, h1, h3, .heading');
      const description = textItem.querySelector('.description, .text-container-inner p');
      const ctaLink = textItem.querySelector('a.cta-link, a[href], .cta-container a');

      if (heading) contentItems.push(heading);
      if (description) contentItems.push(description);

      if (ctaLink) {
        // Create a clean CTA link preserving href and text
        const cta = document.createElement('a');
        cta.href = ctaLink.getAttribute('href');
        const ctaText =
          ctaLink.querySelector('.cta-underline')?.textContent?.trim() ||
          ctaLink.textContent?.trim() ||
          'Read more';
        cta.textContent = ctaText;
        contentItems.push(cta);
      }
    }

    // Only add row if we have media or content
    if (mediaItems.length > 0 || contentItems.length > 0) {
      cells.push([mediaItems, contentItems]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-hero',
    cells,
  });

  element.replaceWith(block);
}
