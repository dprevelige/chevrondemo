/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import columnsMosaicParser from './parsers/columns-mosaic.js';
import carouselArticleParser from './parsers/carousel-article.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'columns-mosaic': columnsMosaicParser,
  'carousel-article': carouselArticleParser,
};

const PAGE_TEMPLATE = {
  name: 'what-we-do',
  description: 'Corporate what we do landing page with energy solutions and business overview',
  urls: [
    'https://www.chevron.com/what-we-do'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['.c74.video-common']
    },
    {
      name: 'columns-mosaic',
      instances: ['.c72.background-color-dark-blue', '.c75.background-color-dark-purple .card-container']
    },
    {
      name: 'carousel-article',
      instances: ['.c57.carousel-shared']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.c74.video-common',
      style: null,
      blocks: ['hero-video'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Affordable Energy',
      selector: ['.c06r.background-color-dark-blue.text-reduced', '.c72.background-color-dark-blue'],
      style: 'dark-blue',
      blocks: ['columns-mosaic'],
      defaultContent: ['.c06r.background-color-dark-blue h2', '.c06r.background-color-dark-blue .description', '.c06r.background-color-dark-blue a']
    },
    {
      id: 'section-3',
      name: 'Technology & Innovation',
      selector: ['.c06r.background-color-medium-teal.text-reduced', '.c17e.background-color-medium-teal'],
      style: 'teal',
      blocks: [],
      defaultContent: ['.c06r.background-color-medium-teal h2', '.c06r.background-color-medium-teal .description', '.c06r.background-color-medium-teal a', '.c17e.background-color-medium-teal img']
    },
    {
      id: 'section-4',
      name: 'Delivering Energy Globally',
      selector: '.c75.background-color-dark-purple',
      style: 'dark-purple',
      blocks: ['columns-mosaic'],
      defaultContent: ['.c75 h2', '.c75 .description', '.c75 a.cta-button']
    },
    {
      id: 'section-5',
      name: 'Latest at Chevron',
      selector: '.c57.carousel-shared.background-color-offwhite',
      style: 'off-white',
      blocks: ['carousel-article'],
      defaultContent: ['.c57 .opening-content .type-eyebrow', '.c57 .opening-content h3']
    }
  ]
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
