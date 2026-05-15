/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import columnsMosaicParser from './parsers/columns-mosaic.js';
import columnsTileParser from './parsers/columns-tile.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import carouselArticleParser from './parsers/carousel-article.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'columns-mosaic': columnsMosaicParser,
  'columns-tile': columnsTileParser,
  'columns-feature': columnsFeatureParser,
  'carousel-article': carouselArticleParser,
};

const PAGE_TEMPLATE = {
  name: 'who-we-are',
  description: 'Corporate about/who we are landing page with company overview content',
  urls: [
    'https://www.chevron.com/who-we-are'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['.c74.video-common']
    },
    {
      name: 'columns-mosaic',
      instances: ['.c72.background-color-dark-blue']
    },
    {
      name: 'columns-tile',
      instances: ['.c64.right.background-color-white:nth-child(5)', '.c64.left.background-color-white', '.c64.right.background-color-white:nth-child(7)']
    },
    {
      name: 'columns-feature',
      instances: ['.c69.contained']
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
      name: 'What We Believe',
      selector: '.c06r.background-color-dark-blue.text-elevated',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['.c06r.background-color-dark-blue.text-elevated h2', '.c06r.background-color-dark-blue.text-elevated .description', '.c06r.background-color-dark-blue.text-elevated a']
    },
    {
      id: 'section-3',
      name: 'Video Montage Grid',
      selector: '.c72.background-color-dark-blue',
      style: 'dark-blue',
      blocks: ['columns-mosaic'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Our Purpose',
      selector: '.c64.right.background-color-white:nth-child(5)',
      style: null,
      blocks: ['columns-tile'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Our Culture',
      selector: '.c64.left.background-color-white',
      style: null,
      blocks: ['columns-tile'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Industry Innovation',
      selector: '.c64.right.background-color-white:nth-child(7)',
      style: null,
      blocks: ['columns-tile'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Human Ingenuity / History',
      selector: ['.c06r.background-color-dark-green.text-reduced', '.c17e.background-color-dark-green'],
      style: 'dark-green',
      blocks: [],
      defaultContent: ['.c06r.background-color-dark-green h2', '.c06r.background-color-dark-green .description', '.c06r.background-color-dark-green a', '.c17e.background-color-dark-green img']
    },
    {
      id: 'section-8',
      name: 'Focus on Quality',
      selector: '.c06r.background-color-white.text-reduced',
      style: null,
      blocks: [],
      defaultContent: ['.c06r.background-color-white.text-reduced h2', '.c06r.background-color-white.text-reduced .description']
    },
    {
      id: 'section-9',
      name: 'Brands / Leadership / Careers',
      selector: '.c69.contained',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: []
    },
    {
      id: 'section-10',
      name: 'Latest in Chevron',
      selector: '.c57.carousel-shared',
      style: null,
      blocks: ['carousel-article'],
      defaultContent: ['.c57 .opening-content .type-eyebrow', '.c57 .opening-content h2']
    },
    {
      id: 'section-11',
      name: 'Email Updates Banner',
      selector: '.c60.background-color-dark-blue',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['.c60 h2', '.c60 a']
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
