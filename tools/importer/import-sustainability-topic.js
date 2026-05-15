/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import videoInfographicParser from './parsers/video-infographic.js';
import columnsStrategyParser from './parsers/columns-strategy.js';
import cardsDataParser from './parsers/cards-data.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import quoteExecutiveParser from './parsers/quote-executive.js';
import carouselArticleParser from './parsers/carousel-article.js';
import cardsTopicParser from './parsers/cards-topic.js';
import cardsIconParser from './parsers/cards-icon.js';
import videoBackgroundParser from './parsers/video-background.js';
import columnsDataParser from './parsers/columns-data.js';
import accordionSocialParser from './parsers/accordion-social.js';
import embedVideoParser from './parsers/embed-video.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'video-infographic': videoInfographicParser,
  'columns-strategy': columnsStrategyParser,
  'cards-data': cardsDataParser,
  'cards-feature': cardsFeatureParser,
  'quote-executive': quoteExecutiveParser,
  'carousel-article': carouselArticleParser,
  'cards-topic': cardsTopicParser,
  'cards-icon': cardsIconParser,
  'video-background': videoBackgroundParser,
  'columns-data': columnsDataParser,
  'accordion-social': accordionSocialParser,
  'embed-video': embedVideoParser,
};

const PAGE_TEMPLATE = {
  name: 'sustainability-topic',
  description: 'Sustainability topic sub-pages covering climate, environment, and social investment',
  urls: [
    'https://www.chevron.com/sustainability/climate',
    'https://www.chevron.com/sustainability/environment',
    'https://www.chevron.com/sustainability/social-investment'
  ],
  blocks: [
    { name: 'hero-video', instances: ['.c74.video-common', '.c01r.video-common'] },
    { name: 'video-infographic', instances: ['section.section-module:has(.c17e video)', 'section.section-module:has(.c74 video):not(:first-child)'] },
    { name: 'columns-strategy', instances: ['.flex-container.column-count-2:has(.c17e)'] },
    { name: 'cards-data', instances: ['.c11b.background-color-dark-blue', '.c11b.background-color-dark-teal'] },
    { name: 'cards-feature', instances: ['.c81'] },
    { name: 'quote-executive', instances: ['.c62'] },
    { name: 'carousel-article', instances: ['.c57.carousel-shared'] },
    { name: 'cards-topic', instances: ['.c75:not(.background-color-dark-purple) .card-container'] },
    { name: 'cards-icon', instances: ['.c11b:not(.background-color-dark-blue):not(.background-color-dark-teal)'] },
    { name: 'video-background', instances: ['.c17e.full'] },
    { name: 'columns-data', instances: ['.c63:has(.list-container)'] },
    { name: 'accordion-social', instances: ['.c66'] },
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
