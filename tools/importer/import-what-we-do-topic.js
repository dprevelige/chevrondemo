/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import columnsTileParser from './parsers/columns-tile.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import carouselArticleParser from './parsers/carousel-article.js';
import carouselFeatureParser from './parsers/carousel-feature.js';
import embedVideoParser from './parsers/embed-video.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'columns-tile': columnsTileParser,
  'columns-feature': columnsFeatureParser,
  'carousel-article': carouselArticleParser,
  'carousel-feature': carouselFeatureParser,
  'embed-video': embedVideoParser,
};

const PAGE_TEMPLATE = {
  name: 'what-we-do-topic',
  description: 'What we do topic sub-pages covering energy and technology/innovation',
  urls: [
    'https://www.chevron.com/what-we-do/energy',
    'https://www.chevron.com/what-we-do/technology-and-innovation'
  ],
  blocks: [
    { name: 'hero-video', instances: ['.c74.video-common', '.c01r.video-common'] },
    { name: 'columns-tile', instances: ['.c64.animated', '.c64.right', '.c64.left'] },
    { name: 'columns-feature', instances: ['.c69.contained'] },
    { name: 'carousel-article', instances: ['.c57.carousel-shared'] },
    { name: 'carousel-feature', instances: ['.c56.carousel-shared'] },
    { name: 'embed-video', instances: ['.c61'] }
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
