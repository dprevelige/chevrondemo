/**
 * Color theme map — maps heading text keywords to theme classes.
 * Each theme has a dark color (text half) and medium color (card half).
 */
const THEMES = [
  { keywords: ['purpose'], theme: 'theme-purple' },
  { keywords: ['culture'], theme: 'theme-teal', reversed: true },
  { keywords: ['innovation', 'technology'], theme: 'theme-blue' },
];

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-tile-${cols.length}-cols`);

  // Detect theme from heading text
  const h2 = block.querySelector('h2');
  const headingText = h2 ? h2.textContent.toLowerCase() : '';
  const matchedTheme = THEMES.find(
    (t) => t.keywords.some((kw) => headingText.includes(kw)),
  );

  if (matchedTheme) {
    block.classList.add(matchedTheme.theme);
    if (matchedTheme.reversed) {
      block.classList.add('reversed');
    }
  } else {
    // Default to blue theme
    block.classList.add('theme-blue');
  }

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-tile-img-col');
        } else if (picWrapper) {
          picWrapper.classList.add('columns-tile-card-col');
        }
      }
    });
  });
}
