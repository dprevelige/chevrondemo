/**
 * columns-feature block
 * Large image-and-text feature cards with colored background panels.
 * Supports per-instance theming and alternating layout.
 *
 * Theme colors are assigned based on position among sibling
 * columns-feature blocks within the same section, following the
 * Chevron brand pattern: dark-red, dark-teal, dark-orange.
 *
 * Even-indexed instances (0-based: 1st, 3rd) use default row order
 * (text left, image right on source; but in EDS DOM image comes first
 * so we reverse to put text left).
 * Odd-indexed instances (0-based: 2nd, 4th) use reversed layout
 * (image left, text right).
 */

const THEMES = ['dark-red', 'dark-teal', 'dark-orange'];

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-feature-${cols.length}-cols`);

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-feature-img-col');
        }
      }
    });
  });

  // Determine position among sibling columns-feature blocks
  const section = block.closest('.section');
  if (section) {
    const siblings = [...section.querySelectorAll('.columns-feature.block')];
    const index = siblings.indexOf(block);

    // Assign theme color based on position
    if (index >= 0 && index < THEMES.length) {
      block.dataset.theme = THEMES[index];
    } else if (index >= 0) {
      // Cycle through themes for additional instances
      block.dataset.theme = THEMES[index % THEMES.length];
    }

    // Alternating layout: source uses row-reverse for 1st and 3rd (even index),
    // and row for 2nd (odd index). In EDS, the image cell comes first in DOM.
    // Default CSS flex-direction is 'row' which puts image left, text right.
    // For even-indexed blocks (0, 2), source shows text-left/image-right,
    // so we need to reverse the EDS row.
    // For odd-indexed blocks (1), source shows image-left/text-right,
    // which matches EDS default row order.
    if (index % 2 === 0) {
      // Even index: text left, image right (reverse from EDS default)
      block.dataset.layout = 'reversed';
    }
  }
}
