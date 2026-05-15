/* eslint-disable */
/* global WebImporter */

/**
 * Parser: video-infographic
 * Base block: video
 * Source: https://www.chevron.com/sustainability/climate
 * Selector: section.section-module (containing .c17e with video)
 * Generated: 2026-05-15
 *
 * Source HTML structure:
 *   section.section-module
 *     div.c06r (heading + optional description — captured as context)
 *     div.c17e (media container)
 *       div.media-container.video-container > video[data-cvx-media-desktop] > source[src]
 *     div.c06r (optional citation/source text)
 *
 * Target table structure (from authoring analysis blockStructureNotes):
 *   | video-infographic |
 *   | video link        |
 *   | caption (optional)|
 *
 * This block is an inline animated infographic video. Extract the video URL
 * and create a block with video link and optional caption text.
 */
export default function parse(element, { document }) {
  // --- Extract video URL ---
  // Source: .c17e .media-container.video-container > video > source[src]
  // Also check data-cvx-media-desktop attribute on the video element
  const videoEl = element.querySelector('.media-container.video-container video, .video-container video, video');
  const videoSource = element.querySelector('video source[src], video[src]');

  let videoUrl = '';
  if (videoSource) {
    videoUrl = videoSource.getAttribute('src') || '';
  }
  // Fallback: check data-cvx-media-desktop attribute
  if (!videoUrl && videoEl) {
    videoUrl = videoEl.getAttribute('data-cvx-media-desktop') || videoEl.getAttribute('src') || '';
  }

  // --- Extract optional caption/citation text ---
  // The last .c06r in the section may contain citation/source text (small text)
  const textModules = Array.from(element.querySelectorAll('.c06r'));
  let captionEl = null;

  // If there are multiple .c06r modules, the last one after the video may be citations
  if (textModules.length > 1) {
    const lastModule = textModules[textModules.length - 1];
    // Check if it contains small/citation text (not a heading)
    const hasSmall = lastModule.querySelector('small, .description small');
    const hasHeading = lastModule.querySelector('h1, h2, h3');
    if (hasSmall && !hasHeading) {
      captionEl = lastModule.querySelector('.description, p');
    }
  }

  // --- Build cells array ---
  const cells = [];

  // Row 1 (after block name): video link
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cells.push([link]);
  }

  // Row 2 (optional): caption/citation text
  if (captionEl) {
    cells.push([captionEl]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-infographic', cells });
  element.replaceWith(block);
}
