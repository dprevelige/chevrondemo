/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-video
 * Base block: embed
 * Source: https://www.chevron.com/sustainability/social-investment
 * Selector: .c61 (video lightbox module with YouTube/Vimeo embed)
 * Generated: 2026-05-15
 *
 * Source HTML structure:
 *   div.c61 > .inner-container > .opening-content > .media-wrapper
 *     a.video-lightbox.video-link[href="https://youtu.be/..."]
 *       div.background.vertical-align
 *         img.img-fluid (thumbnail)
 *         div.icon-circle-container (play icon overlay)
 *     iframe (YouTube embed, dynamically loaded)
 *     div.caption-container (optional caption text)
 *
 * Target block structure (from block library):
 *   Single row with video URL link and optional thumbnail image.
 *   The embed-video block JS handles YouTube/Vimeo URL parsing and iframe creation.
 */
export default function parse(element, { document }) {
  // Extract the video link - primary selector for the clickable video lightbox link
  const videoLink = element.querySelector('a.video-lightbox, a.video-link, a[href*="youtu"], a[href*="vimeo"]');

  // Fallback: check for an iframe with a video embed URL
  const iframe = element.querySelector('iframe[data-toggle="youtube"], iframe[src*="youtube"], iframe[src*="vimeo"]');

  // Determine video URL from link or iframe
  let videoUrl = '';
  if (videoLink) {
    videoUrl = videoLink.href;
  } else if (iframe) {
    // Extract video URL from iframe src or data attributes
    const dataId = iframe.getAttribute('data-id');
    if (dataId) {
      videoUrl = `https://youtu.be/${dataId}`;
    } else {
      videoUrl = iframe.src || iframe.getAttribute('src') || '';
    }
  }

  if (!videoUrl) {
    // No video found, skip this element
    return;
  }

  // Extract thumbnail image if present (used as placeholder before video plays)
  const thumbnailImg = element.querySelector('.media-wrapper img.img-fluid, .background img, a.video-lightbox img');

  // Extract optional caption text
  const captionEl = element.querySelector('.caption-container');
  const captionText = captionEl ? captionEl.textContent.trim() : '';

  // Build the cell content
  const contentCell = [];

  // Add thumbnail as a picture element if available (enables click-to-play behavior)
  if (thumbnailImg) {
    const img = document.createElement('img');
    img.src = thumbnailImg.src || thumbnailImg.getAttribute('src');
    img.alt = thumbnailImg.alt || '';
    contentCell.push(img);
  }

  // Add video URL as a link (required - the block JS uses this to create the embed)
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  contentCell.push(link);

  // Add caption if present
  if (captionText) {
    const caption = document.createElement('p');
    caption.textContent = captionText;
    contentCell.push(caption);
  }

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
