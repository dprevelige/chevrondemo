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

  // tools/importer/import-who-we-are.js
  var import_who_we_are_exports = {};
  __export(import_who_we_are_exports, {
    default: () => import_who_we_are_default
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

  // tools/importer/parsers/columns-mosaic.js
  function parse2(element, { document }) {
    function extractBgImageUrl(cellEl) {
      var id = cellEl.getAttribute("id");
      if (!id) return null;
      var styleTags = element.querySelectorAll("style");
      for (var i = 0; i < styleTags.length; i++) {
        var cssText = styleTags[i].textContent || "";
        if (cssText.indexOf("#" + id) === -1) continue;
        var mediaMatch = cssText.match(/@media[^{]*\{[^}]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        if (mediaMatch && mediaMatch[1]) return mediaMatch[1];
        var basePattern = new RegExp("#" + id + `\\s*\\{[^}]*background-image:\\s*url\\(['"]?([^'"\\)\\s]+)['"]?\\)`);
        var baseMatch = cssText.match(basePattern);
        if (baseMatch && baseMatch[1]) return baseMatch[1];
      }
      return null;
    }
    var imageCellDivs = [];
    var allImageCells = element.querySelectorAll("div.image-cell");
    for (var j = 0; j < allImageCells.length; j++) {
      if (!allImageCells[j].closest(".video-container")) {
        imageCellDivs.push(allImageCells[j]);
      }
    }
    var images = [];
    for (var k = 0; k < imageCellDivs.length; k++) {
      var bgUrl = extractBgImageUrl(imageCellDivs[k]);
      if (bgUrl) {
        var img = document.createElement("img");
        img.src = bgUrl;
        img.alt = "Mosaic image " + (k + 1);
        images.push(img);
      }
    }
    var videoSource = element.querySelector("video source");
    var video = element.querySelector("video");
    var videoSrc = null;
    if (videoSource) videoSrc = videoSource.getAttribute("src");
    if (!videoSrc && video) videoSrc = video.getAttribute("src");
    if (!videoSrc && video) videoSrc = video.getAttribute("data-cvx-media-desktop");
    var videoElement = null;
    if (videoSrc) {
      videoElement = document.createElement("a");
      videoElement.href = videoSrc;
      videoElement.textContent = videoSrc;
    } else if (video) {
      var posterUrl = video.getAttribute("poster");
      if (posterUrl) {
        videoElement = document.createElement("img");
        videoElement.src = posterUrl;
        videoElement.alt = "Mosaic video poster";
      }
    }
    var cells = [];
    var row1 = [];
    row1.push(images[0] || document.createTextNode(""));
    row1.push(images[1] || document.createTextNode(""));
    row1.push(videoElement || document.createTextNode(""));
    cells.push(row1);
    var row2 = [];
    row2.push(images[2] || document.createTextNode(""));
    row2.push(images[3] || document.createTextNode(""));
    cells.push(row2);
    var block = WebImporter.Blocks.createBlock(document, { name: "columns-mosaic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-tile.js
  function parse3(element, { document }) {
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
  function parse4(element, { document }) {
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
  function parse5(element, { document }) {
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

  // tools/importer/import-who-we-are.js
  var parsers = {
    "hero-video": parse,
    "columns-mosaic": parse2,
    "columns-tile": parse3,
    "columns-feature": parse4,
    "carousel-article": parse5
  };
  var PAGE_TEMPLATE = {
    name: "who-we-are",
    description: "Corporate about/who we are landing page with company overview content",
    urls: [
      "https://www.chevron.com/who-we-are"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: [".c74.video-common"]
      },
      {
        name: "columns-mosaic",
        instances: [".c72.background-color-dark-blue"]
      },
      {
        name: "columns-tile",
        instances: [".c64.right.background-color-white:nth-child(5)", ".c64.left.background-color-white", ".c64.right.background-color-white:nth-child(7)"]
      },
      {
        name: "columns-feature",
        instances: [".c69.contained"]
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
        name: "What We Believe",
        selector: ".c06r.background-color-dark-blue.text-elevated",
        style: "dark-blue",
        blocks: [],
        defaultContent: [".c06r.background-color-dark-blue.text-elevated h2", ".c06r.background-color-dark-blue.text-elevated .description", ".c06r.background-color-dark-blue.text-elevated a"]
      },
      {
        id: "section-3",
        name: "Video Montage Grid",
        selector: ".c72.background-color-dark-blue",
        style: "dark-blue",
        blocks: ["columns-mosaic"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Our Purpose",
        selector: ".c64.right.background-color-white:nth-child(5)",
        style: null,
        blocks: ["columns-tile"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Our Culture",
        selector: ".c64.left.background-color-white",
        style: null,
        blocks: ["columns-tile"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Industry Innovation",
        selector: ".c64.right.background-color-white:nth-child(7)",
        style: null,
        blocks: ["columns-tile"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Human Ingenuity / History",
        selector: [".c06r.background-color-dark-green.text-reduced", ".c17e.background-color-dark-green"],
        style: "dark-green",
        blocks: [],
        defaultContent: [".c06r.background-color-dark-green h2", ".c06r.background-color-dark-green .description", ".c06r.background-color-dark-green a", ".c17e.background-color-dark-green img"]
      },
      {
        id: "section-8",
        name: "Focus on Quality",
        selector: ".c06r.background-color-white.text-reduced",
        style: null,
        blocks: [],
        defaultContent: [".c06r.background-color-white.text-reduced h2", ".c06r.background-color-white.text-reduced .description"]
      },
      {
        id: "section-9",
        name: "Brands / Leadership / Careers",
        selector: ".c69.contained",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Latest in Chevron",
        selector: ".c57.carousel-shared",
        style: null,
        blocks: ["carousel-article"],
        defaultContent: [".c57 .opening-content .type-eyebrow", ".c57 .opening-content h2"]
      },
      {
        id: "section-11",
        name: "Email Updates Banner",
        selector: ".c60.background-color-dark-blue",
        style: "dark-blue",
        blocks: [],
        defaultContent: [".c60 h2", ".c60 a"]
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
  var import_who_we_are_default = {
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
  return __toCommonJS(import_who_we_are_exports);
})();
