/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-what-we-do-topic.js
  var import_what_we_do_topic_exports = {};
  __export(import_what_we_do_topic_exports, {
    default: () => import_what_we_do_topic_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    var _a;
    const videoSource = element.querySelector("video source[src], video[src]");
    const bgImage = element.querySelector(".media-container img, .video-container img, .inner-container img");
    let mediaCell;
    if (videoSource) {
      const videoUrl = videoSource.getAttribute("src") || ((_a = videoSource.closest("video")) == null ? void 0 : _a.getAttribute("src"));
      if (videoUrl) {
        const link = document.createElement("a");
        link.href = videoUrl;
        link.textContent = videoUrl;
        mediaCell = [link];
      }
    }
    if (!mediaCell && bgImage) {
      mediaCell = [bgImage];
    }
    const heading = element.querySelector(".parent-container h1, .parent-container h2, h1, h2");
    const description = element.querySelector(".parent-container .description, .parent-container p, .description");
    const ctaLinks = Array.from(
      element.querySelectorAll(".parent-container a[href], .inner-container > a[href]")
    ).filter((a) => !a.closest("button"));
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    const cells = [];
    if (mediaCell) {
      cells.push(mediaCell);
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-tile.js
  function parse2(element, { document }) {
    const tileContainer = element.querySelector(".tile-container");
    const container = tileContainer || element;
    const textHalf = container.querySelector(".half-tile:not(.quarter-tile-container)");
    const mediaHalf = container.querySelector(".half-tile.quarter-tile-container");
    const cell1 = [];
    if (textHalf) {
      const heading = textHalf.querySelector("h2, h3, h4");
      if (heading) cell1.push(heading);
      const description = textHalf.querySelector(".description, p");
      if (description) cell1.push(description);
    }
    const cell2 = [];
    if (mediaHalf) {
      const bgDiv = mediaHalf.querySelector(".background-container .background, .background[style]");
      if (bgDiv) {
        const style = bgDiv.getAttribute("style") || "";
        const urlMatch = style.match(/url\(([^)]+)\)/);
        if (urlMatch) {
          const imgUrl = urlMatch[1].replace(/['"]/g, "");
          const img = document.createElement("img");
          img.src = imgUrl;
          img.alt = "";
          cell2.push(img);
        }
      }
      if (cell2.length === 0) {
        const directImg = mediaHalf.querySelector("img");
        if (directImg) cell2.push(directImg);
      }
      const quarterTiles = mediaHalf.querySelectorAll(".quarter-tile");
      let cardLink = null;
      for (const qt of quarterTiles) {
        if (!qt.classList.contains("background-container")) {
          cardLink = qt.querySelector("a");
          if (cardLink) break;
        }
      }
      if (!cardLink) {
        cardLink = mediaHalf.querySelector("a");
      }
      if (cardLink) {
        const cardHeading = cardLink.querySelector("h3, h4, h2");
        const cardSpan = cardLink.querySelector("span");
        const headingText = cardHeading ? cardHeading.textContent.trim() : "";
        const ctaText = cardSpan ? cardSpan.textContent.trim() : "";
        if (headingText) {
          const h3 = document.createElement("h3");
          h3.textContent = headingText;
          cell2.push(h3);
        }
        if (ctaText || headingText) {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = cardLink.getAttribute("href") || "";
          link.textContent = ctaText || "Learn more";
          p.appendChild(link);
          cell2.push(p);
        }
      }
    }
    const cells = [
      [cell1, cell2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse3(element, { document }) {
    const bgDiv = element.querySelector('.background-container .background, .background[style*="background-image"]');
    let image = null;
    if (bgDiv) {
      const style = bgDiv.getAttribute("style") || "";
      const urlMatch = style.match(/background-image:\s*url\(([^)]+)\)/);
      if (urlMatch) {
        const imgSrc = urlMatch[1].replace(/['"]/g, "").trim();
        image = document.createElement("img");
        image.setAttribute("src", imgSrc);
        image.setAttribute("alt", "");
      }
    }
    if (!image) {
      image = element.querySelector(".background-container img, .col img");
    }
    const textContainer = element.querySelector(".text-container, .col:not(.background-container)");
    const heading = textContainer ? textContainer.querySelector('h2, h1, h3, [class*="heading"], [class*="title"]') : element.querySelector("h2, h1, h3");
    const description = textContainer ? textContainer.querySelector('.description, p, [class*="description"]') : element.querySelector(".description, p");
    const ctaLinks = textContainer ? Array.from(textContainer.querySelectorAll("a")) : Array.from(element.querySelectorAll(".text-container a, a.cta, a.button"));
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    const cells = [
      [imageCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-article.js
  function parse4(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".splide__slide");
    slides.forEach((slide) => {
      const link = slide.querySelector("a[href]");
      const href = link ? link.getAttribute("href") : "";
      const img = slide.querySelector(".image-container img, img");
      const dateEl = slide.querySelector(".date, .content-container p");
      const headingEl = slide.querySelector("h3, h2, h4");
      const contentItems = [];
      if (dateEl) contentItems.push(dateEl);
      if (headingEl) contentItems.push(headingEl);
      if (href) {
        const cta = document.createElement("a");
        cta.href = href;
        cta.textContent = "read article";
        contentItems.push(cta);
      }
      cells.push([img || "", contentItems]);
    });
    if (cells.length === 0) {
      const fallbackLinks = element.querySelectorAll(".articles a[href], a[href]");
      fallbackLinks.forEach((link) => {
        const img = link.querySelector("img");
        const dateEl = link.querySelector(".date, p");
        const headingEl = link.querySelector("h3, h2, h4");
        const contentItems = [];
        if (dateEl) contentItems.push(dateEl);
        if (headingEl) contentItems.push(headingEl);
        const cta = document.createElement("a");
        cta.href = link.getAttribute("href");
        cta.textContent = "read article";
        contentItems.push(cta);
        cells.push([img || "", contentItems]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-feature.js
  function parse5(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".splide__slide:not(.splide__slide--clone)");
    slides.forEach((slide) => {
      const link = slide.querySelector("a.cta-link-parent, a[href]");
      const href = link ? link.getAttribute("href") : "";
      const bgWrapper = slide.querySelector(".inner-slide-wrapper");
      let imageCell = "";
      if (bgWrapper) {
        const style = bgWrapper.getAttribute("style") || "";
        const bgMatch = style.match(/background-image:\s*url\(([^)]+)\)/);
        if (bgMatch) {
          let bgUrl = bgMatch[1].replace(/['"]/g, "").trim();
          const img = document.createElement("img");
          img.src = bgUrl;
          img.alt = "";
          imageCell = img;
        }
      }
      if (!imageCell) {
        const fallbackImg = slide.querySelector(".image-container img, img");
        if (fallbackImg) {
          imageCell = fallbackImg;
        }
      }
      const contentContainer = slide.querySelector(".content-container, .text-content-left");
      const contentItems = [];
      const categoryEl = slide.querySelector(".content-container p.type-body, .content-container .type-body:not(.cta-container)");
      if (categoryEl) {
        const category = document.createElement("p");
        category.textContent = categoryEl.textContent.trim();
        contentItems.push(category);
      }
      const headingEl = slide.querySelector(".content-container h5, .content-container h4, .content-container h3, .content-container h2");
      if (headingEl) {
        contentItems.push(headingEl);
      }
      if (href) {
        const ctaTextEl = slide.querySelector(".cta-underline");
        const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : "Learn more";
        const cta = document.createElement("a");
        cta.href = href;
        cta.textContent = ctaText;
        contentItems.push(cta);
      }
      if (imageCell || contentItems.length > 0) {
        cells.push([imageCell || "", contentItems]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-feature",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse6(element, { document }) {
    const videoLink = element.querySelector('a.video-lightbox, a.video-link, a[href*="youtu"], a[href*="vimeo"]');
    const iframe = element.querySelector('iframe[data-toggle="youtube"], iframe[src*="youtube"], iframe[src*="vimeo"]');
    let videoUrl = "";
    if (videoLink) {
      videoUrl = videoLink.href;
    } else if (iframe) {
      const dataId = iframe.getAttribute("data-id");
      if (dataId) {
        videoUrl = `https://youtu.be/${dataId}`;
      } else {
        videoUrl = iframe.src || iframe.getAttribute("src") || "";
      }
    }
    if (!videoUrl) {
      return;
    }
    const thumbnailImg = element.querySelector(".media-wrapper img.img-fluid, .background img, a.video-lightbox img");
    const captionEl = element.querySelector(".caption-container");
    const captionText = captionEl ? captionEl.textContent.trim() : "";
    const contentCell = [];
    if (thumbnailImg) {
      const img = document.createElement("img");
      img.src = thumbnailImg.src || thumbnailImg.getAttribute("src");
      img.alt = thumbnailImg.alt || "";
      contentCell.push(img);
    }
    const link = document.createElement("a");
    link.href = videoUrl;
    link.textContent = videoUrl;
    contentCell.push(link);
    if (captionText) {
      const caption = document.createElement("p");
      caption.textContent = captionText;
      contentCell.push(caption);
    }
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/chevron-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        '[class*="cookie"]',
        '[id*="cookie"]'
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "scroll";
      }
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/chevron-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function resolveSelector(root, selector) {
    const nthMatch = selector.match(/:nth-of-type\((\d+)\)$/);
    if (nthMatch) {
      const baseSelector = selector.replace(/:nth-of-type\(\d+\)$/, "");
      const index = parseInt(nthMatch[1], 10) - 1;
      const allMatches = root.querySelectorAll(baseSelector);
      return allMatches[index] || null;
    }
    return root.querySelector(selector);
  }
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let firstEl = null;
        for (const sel of selectors) {
          const found = resolveSelector(element, sel);
          if (found) {
            firstEl = found;
            break;
          }
        }
        if (!firstEl) continue;
        if (section.style) {
          let lastEl = firstEl;
          if (selectors.length > 1) {
            for (let s = selectors.length - 1; s >= 0; s--) {
              const found = resolveSelector(element, selectors[s]);
              if (found) {
                lastEl = found;
                break;
              }
            }
          }
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (lastEl.nextSibling) {
            lastEl.parentNode.insertBefore(metadataBlock, lastEl.nextSibling);
          } else {
            lastEl.parentNode.appendChild(metadataBlock);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          firstEl.parentNode.insertBefore(hr, firstEl);
        }
      }
    }
  }

  // tools/importer/import-what-we-do-topic.js
  var parsers = {
    "hero-video": parse,
    "columns-tile": parse2,
    "columns-feature": parse3,
    "carousel-article": parse4,
    "carousel-feature": parse5,
    "embed-video": parse6
  };
  var PAGE_TEMPLATE = {
    name: "what-we-do-topic",
    description: "What we do topic sub-pages covering energy and technology/innovation",
    urls: [
      "https://www.chevron.com/what-we-do/energy",
      "https://www.chevron.com/what-we-do/technology-and-innovation"
    ],
    blocks: [
      { name: "hero-video", instances: [".c74.video-common", ".c01r.video-common"] },
      { name: "columns-tile", instances: [".c64.animated", ".c64.right", ".c64.left"] },
      { name: "columns-feature", instances: [".c69.contained"] },
      { name: "carousel-article", instances: [".c57.carousel-shared"] },
      { name: "carousel-feature", instances: [".c56.carousel-shared"] },
      { name: "embed-video", instances: [".c61"] }
    ],
    sections: []
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
              section: blockDef.section || null
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
  var import_what_we_do_topic_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_what_we_do_topic_exports);
})();
