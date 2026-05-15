/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import embedMapParser from './parsers/embed-map.js';
import cardsTopicParser from './parsers/cards-topic.js';
import carouselArticleParser from './parsers/carousel-article.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'embed-map': embedMapParser,
  'cards-topic': cardsTopicParser,
  'carousel-article': carouselArticleParser,
};

const PAGE_TEMPLATE = {
  name: 'sustainability',
  description: 'Sustainability landing page with environmental and social responsibility content',
  urls: [
    'https://www.chevron.com/sustainability'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['.c74.video-common']
    },
    {
      name: 'embed-map',
      instances: ['#mod_sustainabilitymap.map-2024']
    },
    {
      name: 'cards-topic',
      instances: ['.c75.background-color-offwhite .card-container']
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
      name: 'Around the World Map',
      selector: '#mod_sustainabilitymap.map-2024',
      style: null,
      blocks: ['embed-map'],
      defaultContent: ['.map-2024 .upper-header', '.map-2024 .upper-description p']
    },
    {
      id: 'section-3',
      name: 'ESG Banner',
      selector: '.c60.background-color-offwhite',
      style: 'medium-blue',
      blocks: [],
      defaultContent: ['.c60 h3', '.c60 .cta-underline']
    },
    {
      id: 'section-4',
      name: 'Energy Topics',
      selector: ['.c06r.background-color-offwhite.text-base', '.c75.background-color-offwhite'],
      style: null,
      blocks: ['cards-topic'],
      defaultContent: ['.c06r.background-color-offwhite h2', '.c06r.background-color-offwhite .description']
    },
    {
      id: 'section-5',
      name: 'Additional Resources',
      selector: ['.c06r.background-color-offwhite:last-of-type', '.c63.background-color-offwhite'],
      style: null,
      blocks: [],
      defaultContent: ['.c06r.background-color-offwhite:last-of-type h2', '.c63 .list-container a']
    },
    {
      id: 'section-6',
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
