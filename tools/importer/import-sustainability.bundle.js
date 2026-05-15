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

  // tools/importer/import-sustainability.js
  var import_sustainability_exports = {};
  __export(import_sustainability_exports, {
    default: () => import_sustainability_default
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

  // tools/importer/parsers/embed-map.js
  function parse2(element, { document }) {
    const heading = element.querySelector(".upper-header, .upper-text-container h2");
    const description = element.querySelector(".upper-description p, .upper-text-container .upper-description p");
    const contentCell = [];
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }
    const link = document.createElement("a");
    link.href = "/fragments/sustainability-map";
    link.textContent = "/fragments/sustainability-map";
    contentCell.push(link);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-map", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-topic.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(".card-item");
    const cells = [];
    cardItems.forEach((card) => {
      const inner = card.querySelector(".card-inner");
      if (!inner) return;
      const image = inner.querySelector("img.card-image, img");
      const textContainer = inner.querySelector(".card-text-container");
      const contentCell = [];
      if (textContainer) {
        const heading = textContainer.querySelector("h3, h2, h4");
        if (heading) contentCell.push(heading);
        const descContainer = textContainer.querySelector(".card-description");
        if (descContainer) {
          const descParagraph = descContainer.querySelector("p");
          if (descParagraph) contentCell.push(descParagraph);
        }
        let ctaHref = "";
        let ctaText = "";
        const ctaLinkParent = textContainer.querySelector("a.cta-link-parent");
        if (ctaLinkParent) {
          ctaHref = ctaLinkParent.getAttribute("href") || "";
          const ctaUnderline = ctaLinkParent.querySelector(".cta-underline");
          ctaText = ctaUnderline ? ctaUnderline.textContent.trim() : ctaLinkParent.textContent.trim();
        } else {
          const ctaDiv = textContainer.querySelector(".cta-link a");
          if (ctaDiv) {
            ctaHref = ctaDiv.getAttribute("href") || "";
            const ctaUnderline = ctaDiv.querySelector(".cta-underline");
            ctaText = ctaUnderline ? ctaUnderline.textContent.trim() : ctaDiv.textContent.trim();
          } else {
            const anyLink = textContainer.querySelector("a[href]");
            if (anyLink) {
              ctaHref = anyLink.getAttribute("href") || "";
              ctaText = anyLink.textContent.trim();
            }
          }
        }
        if (ctaHref) {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = ctaHref;
          link.textContent = ctaText || "Learn more";
          p.appendChild(link);
          contentCell.push(p);
        }
      }
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-topic", cells });
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

  // tools/importer/import-sustainability.js
  var parsers = {
    "hero-video": parse,
    "embed-map": parse2,
    "cards-topic": parse3,
    "carousel-article": parse4
  };
  var PAGE_TEMPLATE = {
    name: "sustainability",
    description: "Sustainability landing page with environmental and social responsibility content",
    urls: [
      "https://www.chevron.com/sustainability"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: [".c74.video-common"]
      },
      {
        name: "embed-map",
        instances: ["#mod_sustainabilitymap.map-2024"]
      },
      {
        name: "cards-topic",
        instances: [".c75.background-color-offwhite .card-container"]
      },
      {
        name: "carousel-article",
        instances: [".c57.carousel-shared"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".c74.video-common",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Around the World Map",
        selector: "#mod_sustainabilitymap.map-2024",
        style: null,
        blocks: ["embed-map"],
        defaultContent: [".map-2024 .upper-header", ".map-2024 .upper-description p"]
      },
      {
        id: "section-3",
        name: "ESG Banner",
        selector: ".c60.background-color-offwhite",
        style: "medium-blue",
        blocks: [],
        defaultContent: [".c60 h3", ".c60 .cta-underline"]
      },
      {
        id: "section-4",
        name: "Energy Topics",
        selector: [".c06r.background-color-offwhite.text-base", ".c75.background-color-offwhite"],
        style: null,
        blocks: ["cards-topic"],
        defaultContent: [".c06r.background-color-offwhite h2", ".c06r.background-color-offwhite .description"]
      },
      {
        id: "section-5",
        name: "Additional Resources",
        selector: [".c06r.background-color-offwhite:last-of-type", ".c63.background-color-offwhite"],
        style: null,
        blocks: [],
        defaultContent: [".c06r.background-color-offwhite:last-of-type h2", ".c63 .list-container a"]
      },
      {
        id: "section-6",
        name: "Latest at Chevron",
        selector: ".c57.carousel-shared.background-color-offwhite",
        style: null,
        blocks: ["carousel-article"],
        defaultContent: [".c57 .opening-content .type-eyebrow", ".c57 .opening-content h3"]
      }
    ]
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
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_sustainability_default = {
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
  return __toCommonJS(import_sustainability_exports);
})();
