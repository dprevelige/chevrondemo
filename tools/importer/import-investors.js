/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import carouselArticleParser from './parsers/carousel-article.js';
import columnsDataParser from './parsers/columns-data.js';
import cardsNewsParser from './parsers/cards-news.js';
import carouselEventParser from './parsers/carousel-event.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsStockParser from './parsers/columns-stock.js';
import columnsContactParser from './parsers/columns-contact.js';

import chevronCleanupTransformer from './transformers/chevron-cleanup.js';
import chevronSectionsTransformer from './transformers/chevron-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'carousel-article': carouselArticleParser,
  'columns-data': columnsDataParser,
  'cards-news': cardsNewsParser,
  'carousel-event': carouselEventParser,
  'cards-icon': cardsIconParser,
  'columns-stock': columnsStockParser,
  'columns-contact': columnsContactParser,
};

const PAGE_TEMPLATE = {
  name: 'investors',
  description: 'Investor relations landing page with financial data, news, events, stock info, and contacts',
  urls: [
    'https://www.chevron.com/investors'
  ],
  blocks: [
    { name: 'hero-video', instances: ['.c01r.video-common'] },
    { name: 'carousel-article', instances: ['#mod_3b4b0f65.c57.carousel-shared'] },
    { name: 'columns-data', instances: ['.c63.background-color-offwhite', '.c11b.background-color-offwhite.column-count-xs-2.column-count-md-2'] },
    { name: 'cards-news', instances: ['.c75.background-color-dark-purple'] },
    { name: 'carousel-event', instances: ['#mod_e8d51090.c57.carousel-shared'] },
    { name: 'cards-icon', instances: ['.c11b.background-color-dark-blue'] },
    { name: 'columns-stock', instances: ['.c67a.background-color-offwhite'] },
    { name: 'columns-contact', instances: ['#mod_042790f4.c06r', '#mod_22b0d965.c06r'] }
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.c01r.video-common', style: null, blocks: ['hero-video'], defaultContent: [] },
    { id: 'section-2', name: 'Featured Content and Earnings', selector: ['#mod_3b4b0f65.c57', '#mod_f0484c0a.c06r', '#mod_5fbb3235.c06r', '#mod_09158f7b.c63', '#mod_83973b70.c11b'], style: null, blocks: ['carousel-article', 'columns-data'], defaultContent: ['#mod_f0484c0a h2', '#mod_f0484c0a a', '#mod_5fbb3235 h2'] },
    { id: 'section-3', name: 'Latest News', selector: '.c75.background-color-dark-purple', style: 'dark-purple', blocks: ['cards-news'], defaultContent: ['.c75.background-color-dark-purple h2', '.c75.background-color-dark-purple > .inner-container > .text-container > a'] },
    { id: 'section-4', name: 'Events and Presentations', selector: ['#mod_75adb953.c06r', '#mod_e8d51090.c57'], style: null, blocks: ['carousel-event'], defaultContent: ['#mod_75adb953 h2', '#mod_75adb953 a'] },
    { id: 'section-5', name: 'Higher Returns Lower Carbon', selector: ['#mod_06db96e3.c06r', '#mod_d51edad7.c11b'], style: 'dark-blue', blocks: ['cards-icon'], defaultContent: ['#mod_06db96e3 h2', '#mod_06db96e3 .description', '#mod_06db96e3 a'] },
    { id: 'section-6', name: 'ESG', selector: ['#mod_bed93461.c06r', '#mod_9bf3988f.c17e', '#mod_623e7612.c63'], style: 'dark-teal', blocks: [], defaultContent: ['#mod_bed93461 h2', '#mod_bed93461 .description', '#mod_bed93461 a', '#mod_9bf3988f img', '#mod_623e7612 a'] },
    { id: 'section-7', name: 'Stock and Dividend', selector: '.c67a.background-color-offwhite', style: null, blocks: ['columns-stock'], defaultContent: [] },
    { id: 'section-8', name: 'Contacts', selector: ['#mod_4a35a2db.c06r', '#mod_042790f4.c06r', '#mod_22b0d965.c06r'], style: null, blocks: ['columns-contact'], defaultContent: ['#mod_4a35a2db h2'] }
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
