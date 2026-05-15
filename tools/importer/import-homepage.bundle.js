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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    let realSlides = Array.from(
      element.querySelectorAll(".splide__slide:not(.splide__slide--clone)")
    );
    if (realSlides.length === 0) {
      realSlides = Array.from(element.querySelectorAll(".splide__slide"));
    }
    const textItems = Array.from(
      element.querySelectorAll(".content-container .content-list .list-item, .content-container .list-item")
    );
    realSlides.forEach((slide, index) => {
      var _a, _b, _c;
      const video = slide.querySelector("video");
      const videoSource = slide.querySelector("video source[src]");
      const mediaItems = [];
      const videoUrl = video && video.getAttribute("data-cvx-media-desktop") || videoSource && videoSource.getAttribute("src") || video && video.getAttribute("src");
      if (videoUrl) {
        const videoLink = document.createElement("a");
        videoLink.href = videoUrl;
        videoLink.textContent = videoUrl;
        mediaItems.push(videoLink);
      }
      const posterUrl = video && video.getAttribute("poster");
      if (posterUrl) {
        const posterImg = document.createElement("img");
        posterImg.src = posterUrl;
        const fallbackImg = slide.querySelector("video img, .video-inner-container img");
        posterImg.alt = fallbackImg && fallbackImg.getAttribute("alt") || "";
        mediaItems.push(posterImg);
      }
      const contentItems = [];
      const textItem = textItems[index];
      if (textItem) {
        const heading = textItem.querySelector("h2, h1, h3, .heading");
        const description = textItem.querySelector(".description, .text-container-inner p");
        const ctaLink = textItem.querySelector("a.cta-link, a[href], .cta-container a");
        if (heading) contentItems.push(heading);
        if (description) contentItems.push(description);
        if (ctaLink) {
          const cta = document.createElement("a");
          cta.href = ctaLink.getAttribute("href");
          const ctaText = ((_b = (_a = ctaLink.querySelector(".cta-underline")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || ((_c = ctaLink.textContent) == null ? void 0 : _c.trim()) || "Read more";
          cta.textContent = ctaText;
          contentItems.push(cta);
        }
      }
      if (mediaItems.length > 0 || contentItems.length > 0) {
        cells.push([mediaItems, contentItems]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-marquee.js
  function parse2(element, { document }) {
    const eyebrowEl = element.querySelector("p.type-eyebrow, .type-eyebrow");
    const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : "";
    const headingSpans = element.querySelectorAll('h2 .text-animation, h2 span[class*="text-animation"]');
    let headingText = "";
    if (headingSpans.length > 0) {
      const phrases = [];
      headingSpans.forEach(function(span) {
        var text = span.textContent.trim();
        if (text) phrases.push(text);
      });
      headingText = phrases.join(", ");
    } else {
      var h2El = element.querySelector("h2");
      if (h2El) headingText = h2El.textContent.trim();
    }
    var row1 = [];
    if (eyebrowText) {
      var pEyebrow = document.createElement("p");
      pEyebrow.textContent = eyebrowText;
      row1.push(pEyebrow);
    }
    if (headingText) {
      var h2 = document.createElement("h2");
      h2.textContent = headingText;
      row1.push(h2);
    }
    var imgElements = element.querySelectorAll(".images-container img, .images-container .image img");
    var row2 = [];
    imgElements.forEach(function(img) {
      var newImg = document.createElement("img");
      newImg.src = img.getAttribute("src") || img.src;
      if (img.getAttribute("alt")) {
        newImg.alt = img.getAttribute("alt");
      }
      row2.push(newImg);
    });
    var cells = [];
    if (row1.length > 0) {
      cells.push(row1);
    }
    if (row2.length > 0) {
      cells.push(row2);
    }
    var block = WebImporter.Blocks.createBlock(document, { name: "hero-marquee", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-mosaic.js
  function parse3(element, { document }) {
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

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "hero-marquee": parse2,
    "columns-mosaic": parse3,
    "columns-feature": parse4,
    "carousel-article": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Chevron corporate homepage with hero carousel, featured content, and news",
    urls: [
      "https://www.chevron.com/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".c70.video-common.carousel-shared"]
      },
      {
        name: "hero-marquee",
        instances: [".text-marquee.background-color-dark-blue"]
      },
      {
        name: "columns-mosaic",
        instances: [".c72.background-color-offwhite"]
      },
      {
        name: "columns-feature",
        instances: [".c73.background-color-offwhite"]
      },
      {
        name: "carousel-article",
        instances: [".c57.carousel-shared.background-color-offwhite"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".c70.video-common.carousel-shared",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Who We Are Marquee",
        selector: ".text-marquee.background-color-dark-blue",
        style: null,
        blocks: ["hero-marquee"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Mission Statement",
        selector: ".c85.background-color-dark-blue",
        style: "dark-blue",
        blocks: [],
        defaultContent: [".c85 .text-container", ".c85 a"]
      },
      {
        id: "section-4",
        name: "What We Do",
        selector: ".c06r.background-color-offwhite",
        style: null,
        blocks: [],
        defaultContent: [".c06r.background-color-offwhite .type-eyebrow", ".c06r.background-color-offwhite h2", ".c06r.background-color-offwhite .description", ".c06r.background-color-offwhite a"]
      },
      {
        id: "section-5",
        name: "Operations Mosaic",
        selector: ".c72.background-color-offwhite",
        style: null,
        blocks: ["columns-mosaic"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Lower Carbon Solutions",
        selector: ".c73.background-color-offwhite",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: [".c73 .heading-container h2"]
      },
      {
        id: "section-7",
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
  var import_homepage_default = {
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
      const originalPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = originalPath === "" ? "/index" : WebImporter.FileUtils.sanitizePath(originalPath);
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
  return __toCommonJS(import_homepage_exports);
})();
