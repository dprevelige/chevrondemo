/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-mosaic
 * Base block: columns
 * Source selector: .c72.background-color-dark-blue
 * Source: https://www.chevron.com/who-we-are
 * Generated: 2026-05-14
 *
 * Live source structure (5 media items inside .small-layout-container):
 *   1. div.image-cell (#mod_*_1) - background-image via <style> tag (c72-item-1.jpg)
 *   2. div.video-container       - <video> with poster + <source> mp4
 *   3. div.image-cell (#mod_*_3) - background-image via <style> tag (c72-item-4.jpg)
 *   4. div.image-cell (#mod_*_4) - background-image via <style> tag (c72-item-2.jpg)
 *   5. div.image-cell (#mod_*_5) - background-image via <style> tag (c72-item-5.jpg)
 *
 * Library example (target table structure):
 *   Row 1: image1 | image2 | video  (3 columns)
 *   Row 2: image3 | image4           (2 columns)
 *
 * Mapping: image-cell[0] -> R1C1, image-cell[1] -> R1C2, video -> R1C3,
 *          image-cell[2] -> R2C1, image-cell[3] -> R2C2
 */
export default function parse(element, { document }) {
  // Extract background-image URL from inline <style> tags that reference an element by ID.
  // The source uses <style> blocks with background-image for .image-cell divs.
  // Prefers the @media (desktop) variant if present; falls back to the base rule.
  function extractBgImageUrl(cellEl) {
    var id = cellEl.getAttribute('id');
    if (!id) return null;

    var styleTags = element.querySelectorAll('style');
    for (var i = 0; i < styleTags.length; i++) {
      var cssText = styleTags[i].textContent || '';
      if (cssText.indexOf('#' + id) === -1) continue;

      // Try desktop (media query) URL first
      var mediaMatch = cssText.match(/@media[^{]*\{[^}]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      if (mediaMatch && mediaMatch[1]) return mediaMatch[1];

      // Fall back to base rule
      var basePattern = new RegExp('#' + id + '\\s*\\{[^}]*background-image:\\s*url\\([\'"]?([^\'"\\)\\s]+)[\'"]?\\)');
      var baseMatch = cssText.match(basePattern);
      if (baseMatch && baseMatch[1]) return baseMatch[1];
    }
    return null;
  }

  // Collect the 4 image-cell divs (not the video element which also has .image-cell class on video tag)
  var imageCellDivs = [];
  var allImageCells = element.querySelectorAll('div.image-cell');
  for (var j = 0; j < allImageCells.length; j++) {
    // Exclude image-cells that are inside the video-container
    if (!allImageCells[j].closest('.video-container')) {
      imageCellDivs.push(allImageCells[j]);
    }
  }

  // Build <img> elements from background-image URLs
  var images = [];
  for (var k = 0; k < imageCellDivs.length; k++) {
    var bgUrl = extractBgImageUrl(imageCellDivs[k]);
    if (bgUrl) {
      var img = document.createElement('img');
      img.src = bgUrl;
      img.alt = 'Mosaic image ' + (k + 1);
      images.push(img);
    }
  }

  // Extract video: prefer <source> src, fall back to video src or data attribute
  var videoSource = element.querySelector('video source');
  var video = element.querySelector('video');
  var videoSrc = null;
  if (videoSource) videoSrc = videoSource.getAttribute('src');
  if (!videoSrc && video) videoSrc = video.getAttribute('src');
  if (!videoSrc && video) videoSrc = video.getAttribute('data-cvx-media-desktop');

  var videoElement = null;
  if (videoSrc) {
    // Represent video as a link to the mp4 (standard import pattern)
    videoElement = document.createElement('a');
    videoElement.href = videoSrc;
    videoElement.textContent = videoSrc;
  } else if (video) {
    // Fallback: use poster image if no video source
    var posterUrl = video.getAttribute('poster');
    if (posterUrl) {
      videoElement = document.createElement('img');
      videoElement.src = posterUrl;
      videoElement.alt = 'Mosaic video poster';
    }
  }

  // Build cells matching library example:
  // Row 1: image1 | image2 | video  (3 columns)
  // Row 2: image3 | image4           (2 columns)
  var cells = [];

  // Row 1: 3 columns
  var row1 = [];
  row1.push(images[0] || document.createTextNode(''));
  row1.push(images[1] || document.createTextNode(''));
  row1.push(videoElement || document.createTextNode(''));
  cells.push(row1);

  // Row 2: 2 columns
  var row2 = [];
  row2.push(images[2] || document.createTextNode(''));
  row2.push(images[3] || document.createTextNode(''));
  cells.push(row2);

  var block = WebImporter.Blocks.createBlock(document, { name: 'columns-mosaic', cells });
  element.replaceWith(block);
}
