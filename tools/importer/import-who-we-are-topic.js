/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import heroBrandParser from './parsers/hero-brand.js';
import heroHistoryParser from './parsers/hero-history.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsBrandParser from './parsers/columns-brand.js';
import columnsMosaicParser from './parsers/columns-mosaic.js';
import carouselArticleParser from './parsers/carousel-article.js';
import carouselImageParser from './parsers/carousel-image.js';
import carouselFeatureParser from './parsers/carousel-feature.js';
import cardsDataParser from './parsers/cards-data.js';
import cardsLeadershipParser from './parsers/cards-leadership.js';
import tabsTimelineParser from './parsers/tabs-timeline.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'hero-brand': heroBrandParser,
  'hero-history': heroHistoryParser,
  'columns-feature': columnsFeatureParser,
  'columns-brand': columnsBrandParser,
  'columns-mosaic': columnsMosaicParser,
  'carousel-article': carouselArticleParser,
  'carousel-image': carouselImageParser,
  'carousel-feature': carouselFeatureParser,
  'cards-data': cardsDataParser,
  'cards-leadership': cardsLeadershipParser,
  'tabs-timeline': tabsTimelineParser,
};

const PAGE_TEMPLATE = {
  name: 'who-we-are-topic',
  description: 'Who we are topic sub-pages covering culture, brands, leadership, and history',
  urls: [
    'https://www.chevron.com/who-we-are/culture',
    'https://www.chevron.com/who-we-are/our-brands',
    'https://www.chevron.com/who-we-are/leadership',
    'https://www.chevron.com/who-we-are/history'
  ],
  blocks: [
    { name: 'hero-video', instances: ['.c74.video-common'] },
    { name: 'hero-brand', instances: ['.c74:not(.video-common)'] },
    { name: 'hero-history', instances: ['.c01r.video-common'] },
    { name: 'columns-feature', instances: ['.c69.contained'] },
    { name: 'columns-brand', instances: ['.c55', '.c69:not(.contained)', '.c63:not(.background-color-offwhite)'] },
    { name: 'columns-mosaic', instances: ['.c72'] },
    { name: 'carousel-article', instances: ['.c57.carousel-shared'] },
    { name: 'carousel-image', instances: ['.c58.carousel-shared'] },
    { name: 'carousel-feature', instances: ['.c56.carousel-shared'] },
    { name: 'cards-data', instances: ['.c11b'] },
    { name: 'cards-leadership', instances: ['.c75:has(.officers-grid)', '.c75:has(.officer-featured)'] },
    { name: 'tabs-timeline', instances: ['.c71-container'] }
  ],
  sections: []
};

const transformers = [
  chevronCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [chevronSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for "${blockDef.name}": ${selector}`);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
