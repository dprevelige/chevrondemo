/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import heroMarqueeParser from './parsers/hero-marquee.js';
import columnsMosaicParser from './parsers/columns-mosaic.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import carouselArticleParser from './parsers/carousel-article.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'hero-marquee': heroMarqueeParser,
  'columns-mosaic': columnsMosaicParser,
  'columns-feature': columnsFeatureParser,
  'carousel-article': carouselArticleParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Chevron corporate homepage with hero carousel, featured content, and news',
  urls: [
    'https://www.chevron.com/'
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.c70.video-common.carousel-shared']
    },
    {
      name: 'hero-marquee',
      instances: ['.text-marquee.background-color-dark-blue']
    },
    {
      name: 'columns-mosaic',
      instances: ['.c72.background-color-offwhite']
    },
    {
      name: 'columns-feature',
      instances: ['.c73.background-color-offwhite']
    },
    {
      name: 'carousel-article',
      instances: ['.c57.carousel-shared.background-color-offwhite']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.c70.video-common.carousel-shared',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Who We Are Marquee',
      selector: '.text-marquee.background-color-dark-blue',
      style: null,
      blocks: ['hero-marquee'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Mission Statement',
      selector: '.c85.background-color-dark-blue',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['.c85 .text-container', '.c85 a']
    },
    {
      id: 'section-4',
      name: 'What We Do',
      selector: '.c06r.background-color-offwhite',
      style: null,
      blocks: [],
      defaultContent: ['.c06r.background-color-offwhite .type-eyebrow', '.c06r.background-color-offwhite h2', '.c06r.background-color-offwhite .description', '.c06r.background-color-offwhite a']
    },
    {
      id: 'section-5',
      name: 'Operations Mosaic',
      selector: '.c72.background-color-offwhite',
      style: null,
      blocks: ['columns-mosaic'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Lower Carbon Solutions',
      selector: '.c73.background-color-offwhite',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: ['.c73 .heading-container h2']
    },
    {
      id: 'section-7',
      name: 'Latest at Chevron',
      selector: '.c57.carousel-shared.background-color-offwhite',
      style: null,
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

    const originalPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = originalPath === '' ? '/index' : WebImporter.FileUtils.sanitizePath(originalPath);

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
