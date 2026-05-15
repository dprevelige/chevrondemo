/* eslint-disable */
/* global WebImporter */

/**
 * Parser: video-background
 * Base block: video
 * Source: https://www.chevron.com/sustainability/social-investment
 * Selector: .c17e.full (containing .media-container.video-container > video)
 * Generated: 2026-05-15
 *
 * Source HTML structure:
 *   div.c17e.full.background-color-dark-purple[data-cvx-module-name="c17e"]
 *     div.inner-container.centered
 *       div.opening-content
 *         div.media-container.video-container
 *           video.video.background[autoplay][muted][loop][playsinline][data-cvx-media-desktop]
 *             source[src="...mp4"]
 *
 * Target table structure (from authoring analysis):
 *   | video-background (autoplay) |
 *   | video-url-link              |
 *
 * This block is a section with a background video that autoplays muted and loops.
 * Extract the video URL and produce a single-cell block with a link to the video file.
 * The "autoplay" variant class instructs the block decorator to autoplay the video.
 */
export default function parse(element, { document }) {
  // --- Extract video URL ---
  // Primary: video > source[src]
  // Fallback: video[data-cvx-media-desktop] or video[src]
  const videoSource = element.querySelector('.media-container.video-container video source[src], video source[src]');
  const videoEl = element.querySelector('.media-container.video-container video, video');

  let videoUrl = '';
  if (videoSource) {
    videoUrl = videoSource.getAttribute('src') || '';
  }
  // Fallback: data-cvx-media-desktop attribute
  if (!videoUrl && videoEl) {
    videoUrl = videoEl.getAttribute('data-cvx-media-desktop') || videoEl.getAttribute('src') || '';
  }

  // --- Extract optional poster image ---
  // The video element may have a poster attribute with a URL
  let posterUrl = '';
  if (videoEl) {
    posterUrl = videoEl.getAttribute('poster') || '';
  }
  // Also check for an img element used as a fallback/poster within the container
  const posterImg = element.querySelector('.media-container img, .video-container img, .opening-content img');

  // --- Build cells array ---
  const cells = [];

  // Row 1: Video URL as a link element
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cells.push([link]);
  }

  // Row 2 (optional): Poster image if present
  if (posterUrl) {
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = '';
    const picture = document.createElement('picture');
    picture.appendChild(img);
    cells.push([picture]);
  } else if (posterImg) {
    cells.push([posterImg]);
  }

  // Use "autoplay" variant since this is a background video with autoplay behavior
  const block = WebImporter.Blocks.createBlock(document, { name: 'video-background (autoplay)', cells });
  element.replaceWith(block);
}
