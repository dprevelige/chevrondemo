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

  // tools/importer/import-investors.js
  var import_investors_exports = {};
  __export(import_investors_exports, {
    default: () => import_investors_default
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

  // tools/importer/parsers/carousel-article.js
  function parse2(element, { document }) {
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

  // tools/importer/parsers/columns-data.js
  function parse3(element, { document }) {
    const isLinksList = element.classList.contains("c63");
    const isDataGrid = element.classList.contains("c11b");
    let linksElement = null;
    let dataElement = null;
    if (isLinksList) {
      linksElement = element;
      const section = element.closest(".section-module") || element.closest(".flex-container") || element.parentElement;
      if (section) {
        dataElement = section.querySelector(".c11b.background-color-offwhite.column-count-xs-2");
      }
      if (!dataElement) {
        dataElement = document.querySelector(".c11b.background-color-offwhite.column-count-xs-2.column-count-md-2");
      }
    } else if (isDataGrid) {
      dataElement = element;
      const section = element.closest(".section-module") || element.closest(".flex-container") || element.parentElement;
      if (section) {
        linksElement = section.querySelector(".c63.background-color-offwhite");
      }
      if (!linksElement) {
        linksElement = document.querySelector(".c63.background-color-offwhite");
      }
    }
    const leftContent = [];
    if (linksElement) {
      const heading = linksElement.querySelector("h2, .title");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        leftContent.push(h2);
      }
      const links = linksElement.querySelectorAll("ul li a");
      if (links.length > 0) {
        const ul = document.createElement("ul");
        links.forEach((link) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link.href;
          const textSpan = link.querySelector("span.truncate, span.type-subhead");
          a.textContent = textSpan ? textSpan.textContent.trim() : link.textContent.trim();
          if (link.target) a.target = link.target;
          li.append(a);
          ul.append(li);
        });
        leftContent.push(ul);
      }
    }
    const rightContent = [];
    if (dataElement) {
      const items = dataElement.querySelectorAll(".c11b-container .item, .item");
      items.forEach((item) => {
        const desc = item.querySelector("p.description");
        const value = item.querySelector("p.data-point");
        if (desc && value) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = value.textContent.trim();
          p.textContent = desc.textContent.trim() + ": ";
          p.append(strong);
          rightContent.push(p);
        }
      });
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-data",
      cells
    });
    if (isLinksList && dataElement && dataElement !== element) {
      dataElement.remove();
    } else if (isDataGrid && linksElement && linksElement !== element) {
      linksElement.remove();
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const cardItems = element.querySelectorAll(".card-container .card-item");
    const cells = [];
    cardItems.forEach((card) => {
      const inner = card.querySelector(".card-inner");
      if (!inner) return;
      const image = inner.querySelector("img.card-image");
      const contentCell = [];
      const linkParent = inner.querySelector("a.cta-link-parent");
      const textContainer = inner.querySelector(".card-text-container");
      if (textContainer) {
        const datePara = textContainer.querySelector("p.date");
        if (datePara) {
          const p = document.createElement("p");
          p.textContent = datePara.textContent.trim();
          contentCell.push(p);
        }
        const descDiv = textContainer.querySelector(".card-description");
        if (descDiv) {
          const h = document.createElement("h3");
          h.textContent = descDiv.textContent.trim();
          contentCell.push(h);
        }
        const ctaHref = linkParent ? linkParent.getAttribute("href") || "" : "";
        const ctaUnderline = textContainer.querySelector(".cta-underline");
        let ctaText = "";
        if (ctaUnderline) {
          ctaText = ctaUnderline.textContent.trim();
        } else if (linkParent) {
          const ctaDiv = textContainer.querySelector(".cta-link");
          ctaText = ctaDiv ? ctaDiv.textContent.trim() : "Read more";
        }
        if (ctaHref) {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = ctaHref;
          link.textContent = ctaText || "Read more";
          p.appendChild(link);
          contentCell.push(p);
        }
      }
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-event.js
  function parse5(element, { document }) {
    const slides = element.querySelectorAll(".splide__slide");
    const cells = [];
    slides.forEach((slide) => {
      const cellContent = [];
      const linkParent = slide.querySelector("a.cta-link-parent, a[href]");
      const href = linkParent ? linkParent.getAttribute("href") : "";
      const heading = slide.querySelector("h3.slide-header, h3, h2");
      if (heading) {
        const h = document.createElement("h3");
        h.textContent = heading.textContent.trim();
        cellContent.push(h);
      }
      const dateSpan = slide.querySelector("p.date span, .date span");
      if (dateSpan) {
        const p = document.createElement("p");
        p.textContent = dateSpan.textContent.trim();
        cellContent.push(p);
      }
      const ctaUnderline = slide.querySelector(".cta-underline");
      if (href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = ctaUnderline ? ctaUnderline.textContent.trim() : "View details";
        if (linkParent && linkParent.getAttribute("target") === "_blank") {
          a.setAttribute("target", "_blank");
        }
        p.appendChild(a);
        cellContent.push(p);
      }
      if (cellContent.length > 0) {
        cells.push([cellContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-event", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse6(element, { document }) {
    const container = element.querySelector(".c11b-container");
    const items = container ? container.querySelectorAll(':scope > .item, :scope > div[class*="c11b-"]') : element.querySelectorAll(".item");
    const cells = [];
    items.forEach((item) => {
      const icon = item.querySelector(".image-container img, img.img-fluid");
      const label = item.querySelector("p.description, .description");
      if (icon || label) {
        const textCell = [];
        if (label) {
          const p = document.createElement("p");
          p.textContent = label.textContent.trim();
          textCell.push(p);
        }
        cells.push([icon || "", textCell.length ? textCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stock.js
  function parse7(element, { document }) {
    const heading = element.querySelector("h2.headline") || element.querySelector(".text-container h2");
    const timestamp = element.querySelector("p.timestamp") || element.querySelector(".text-container p");
    const stockInfoItems = Array.from(
      element.querySelectorAll(".stock-info-container p.stock-info")
    );
    if (stockInfoItems.length === 0) {
      const fallbackItems = Array.from(element.querySelectorAll(".stock-info-container p"));
      stockInfoItems.push(...fallbackItems);
    }
    const ctaLink = element.querySelector(".bottom-container a.cta-button") || element.querySelector(".bottom-container a") || element.querySelector("a.cta-button");
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (timestamp) contentCell.push(timestamp);
    stockInfoItems.forEach((item) => contentCell.push(item));
    if (ctaLink) contentCell.push(ctaLink);
    const cells = [];
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-stock",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse8(element, { document }) {
    function extractContactContent(mod) {
      const container = document.createElement("div");
      const heading = mod.querySelector(".text-container h2") || mod.querySelector("h2");
      if (heading) {
        container.append(heading);
      }
      const description = mod.querySelector(".text-container .description") || mod.querySelector(".description");
      if (description) {
        const paras = Array.from(description.querySelectorAll(":scope > p"));
        paras.forEach((p) => container.append(p));
      }
      return container;
    }
    const leftCell = extractContactContent(element);
    const flexParent = element.closest(".column-count-2") || element.closest(".flex-container") || element.parentElement;
    let siblingMod = null;
    if (flexParent) {
      const allModules = Array.from(flexParent.querySelectorAll(":scope > .c06r"));
      siblingMod = allModules.find((mod) => mod !== element) || null;
    }
    const cells = [];
    if (siblingMod) {
      const rightCell = extractContactContent(siblingMod);
      cells.push([leftCell, rightCell]);
      siblingMod.remove();
    } else {
      cells.push([leftCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-contact",
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

  // tools/importer/import-investors.js
  var parsers = {
    "hero-video": parse,
    "carousel-article": parse2,
    "columns-data": parse3,
    "cards-news": parse4,
    "carousel-event": parse5,
    "cards-icon": parse6,
    "columns-stock": parse7,
    "columns-contact": parse8
  };
  var PAGE_TEMPLATE = {
    name: "investors",
    description: "Investor relations landing page with financial data, news, events, stock info, and contacts",
    urls: [
      "https://www.chevron.com/investors"
    ],
    blocks: [
      { name: "hero-video", instances: [".c01r.video-common"] },
      { name: "carousel-article", instances: ["#mod_3b4b0f65.c57.carousel-shared"] },
      { name: "columns-data", instances: [".c63.background-color-offwhite", ".c11b.background-color-offwhite.column-count-xs-2.column-count-md-2"] },
      { name: "cards-news", instances: [".c75.background-color-dark-purple"] },
      { name: "carousel-event", instances: ["#mod_e8d51090.c57.carousel-shared"] },
      { name: "cards-icon", instances: [".c11b.background-color-dark-blue"] },
      { name: "columns-stock", instances: [".c67a.background-color-offwhite"] },
      { name: "columns-contact", instances: ["#mod_042790f4.c06r", "#mod_22b0d965.c06r"] }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: ".c01r.video-common", style: null, blocks: ["hero-video"], defaultContent: [] },
      { id: "section-2", name: "Featured Content and Earnings", selector: ["#mod_3b4b0f65.c57", "#mod_f0484c0a.c06r", "#mod_5fbb3235.c06r", "#mod_09158f7b.c63", "#mod_83973b70.c11b"], style: null, blocks: ["carousel-article", "columns-data"], defaultContent: ["#mod_f0484c0a h2", "#mod_f0484c0a a", "#mod_5fbb3235 h2"] },
      { id: "section-3", name: "Latest News", selector: ".c75.background-color-dark-purple", style: "dark-purple", blocks: ["cards-news"], defaultContent: [".c75.background-color-dark-purple h2", ".c75.background-color-dark-purple > .inner-container > .text-container > a"] },
      { id: "section-4", name: "Events and Presentations", selector: ["#mod_75adb953.c06r", "#mod_e8d51090.c57"], style: null, blocks: ["carousel-event"], defaultContent: ["#mod_75adb953 h2", "#mod_75adb953 a"] },
      { id: "section-5", name: "Higher Returns Lower Carbon", selector: ["#mod_06db96e3.c06r", "#mod_d51edad7.c11b"], style: "dark-blue", blocks: ["cards-icon"], defaultContent: ["#mod_06db96e3 h2", "#mod_06db96e3 .description", "#mod_06db96e3 a"] },
      { id: "section-6", name: "ESG", selector: ["#mod_bed93461.c06r", "#mod_9bf3988f.c17e", "#mod_623e7612.c63"], style: "dark-teal", blocks: [], defaultContent: ["#mod_bed93461 h2", "#mod_bed93461 .description", "#mod_bed93461 a", "#mod_9bf3988f img", "#mod_623e7612 a"] },
      { id: "section-7", name: "Stock and Dividend", selector: ".c67a.background-color-offwhite", style: null, blocks: ["columns-stock"], defaultContent: [] },
      { id: "section-8", name: "Contacts", selector: ["#mod_4a35a2db.c06r", "#mod_042790f4.c06r", "#mod_22b0d965.c06r"], style: null, blocks: ["columns-contact"], defaultContent: ["#mod_4a35a2db h2"] }
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
  var import_investors_default = {
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
  return __toCommonJS(import_investors_exports);
})();
