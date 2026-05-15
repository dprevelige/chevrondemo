/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-map
 * Base block: embed
 * Source: https://www.chevron.com/sustainability
 * Selector: #mod_sustainabilitymap.map-2024
 * Generated: 2026-05-14
 * Validated: manually via MCP Playwright; auto-validator blocked by chevron.com bot detection (site returns "Service unavailable" to headless browsers)
 *
 * This block represents a complex interactive amCharts world map widget
 * that cannot be replicated directly in EDS. The parser creates a simple
 * embed block with a placeholder URL for where the interactive map would
 * be hosted externally. The heading and description above the map are
 * preserved as context within the embed cell.
 */
export default function parse(element, { document }) {
  // Extract the heading from the upper text container
  const heading = element.querySelector('.upper-header, .upper-text-container h2');

  // Extract the description paragraph
  const description = element.querySelector('.upper-description p, .upper-text-container .upper-description p');

  // Build content cell with placeholder link to externally-hosted map fragment
  const contentCell = [];

  // Add heading if present for context
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  // Add description if present for context
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.push(p);
  }

  // Create placeholder link to the externally-hosted sustainability map fragment
  const link = document.createElement('a');
  link.href = '/fragments/sustainability-map';
  link.textContent = '/fragments/sustainability-map';
  contentCell.push(link);

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-map', cells });
  element.replaceWith(block);
}
