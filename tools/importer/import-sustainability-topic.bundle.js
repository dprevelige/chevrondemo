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

  // tools/importer/import-sustainability-topic.js
  var import_sustainability_topic_exports = {};
  __export(import_sustainability_topic_exports, {
    default: () => import_sustainability_topic_default
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

  // tools/importer/parsers/video-infographic.js
  function parse2(element, { document }) {
    const videoEl = element.querySelector(".media-container.video-container video, .video-container video, video");
    const videoSource = element.querySelector("video source[src], video[src]");
    let videoUrl = "";
    if (videoSource) {
      videoUrl = videoSource.getAttribute("src") || "";
    }
    if (!videoUrl && videoEl) {
      videoUrl = videoEl.getAttribute("data-cvx-media-desktop") || videoEl.getAttribute("src") || "";
    }
    const textModules = Array.from(element.querySelectorAll(".c06r"));
    let captionEl = null;
    if (textModules.length > 1) {
      const lastModule = textModules[textModules.length - 1];
      const hasSmall = lastModule.querySelector("small, .description small");
      const hasHeading = lastModule.querySelector("h1, h2, h3");
      if (hasSmall && !hasHeading) {
        captionEl = lastModule.querySelector(".description, p");
      }
    }
    const cells = [];
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.textContent = videoUrl;
      cells.push([link]);
    }
    if (captionEl) {
      cells.push([captionEl]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-infographic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-strategy.js
  function parse3(element, { document }) {
    const flexContainer = element.querySelector('.flex-container.column-count-2, [class*="flex-container"][class*="column-count"]');
    const columnSections = flexContainer ? Array.from(flexContainer.querySelectorAll(":scope > section.section-module, :scope > .section-module")) : Array.from(element.querySelectorAll(":scope > section.section-module, :scope > .section-module"));
    const row = [];
    columnSections.forEach((colSection) => {
      const img = colSection.querySelector(".c17e img.img-fluid, .c17e img, img");
      const heading = colSection.querySelector(".c06r h2, .c06r h3, h2, h3");
      const cellContent = [];
      if (img) {
        cellContent.push(img);
      }
      if (heading) {
        cellContent.push(heading);
      }
      row.push(cellContent);
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-strategy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-data.js
  function parse4(element, { document }) {
    const cards = element.querySelectorAll(":scope .c11b-container .item, :scope .c11b-2.item");
    const cells = [];
    cards.forEach((card) => {
      const descriptionEl = card.querySelector(".description");
      const dataPointEl = card.querySelector(".data-point");
      const cardContent = [];
      if (descriptionEl) {
        cardContent.push(descriptionEl);
      }
      if (dataPointEl) {
        cardContent.push(dataPointEl);
      }
      if (cardContent.length > 0) {
        cells.push(cardContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-data", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll(".card-container > .card");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".image-container img.img-fluid");
      const heading = card.querySelector("h3.sub-header");
      const description = card.querySelector(".text-container .description.type-body");
      const ctaLink = card.querySelector(".cta-container a.cta-button");
      const contentCell = [];
      if (heading) {
        const cleanHeading = document.createElement("h3");
        const desktopSpan = heading.querySelector("span.d-none.d-lg-inline");
        cleanHeading.textContent = desktopSpan ? desktopSpan.textContent.trim() : heading.textContent.trim();
        contentCell.push(cleanHeading);
      }
      if (description) {
        contentCell.push(description);
      }
      if (ctaLink) {
        const cleanLink = document.createElement("a");
        cleanLink.href = ctaLink.href;
        cleanLink.textContent = ctaLink.textContent.trim();
        if (ctaLink.target) cleanLink.target = ctaLink.target;
        if (ctaLink.rel) cleanLink.rel = ctaLink.rel;
        contentCell.push(cleanLink);
      }
      const imageCell = image ? [image] : [];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote-executive.js
  function parse6(element, { document }) {
    const image = element.querySelector(".img-container img");
    const quoteParagraph = element.querySelector("blockquote.quote p, blockquote p");
    let quoteText = "";
    if (quoteParagraph) {
      quoteText = quoteParagraph.getAttribute("aria-label") || "";
      if (!quoteText) {
        const divs = quoteParagraph.querySelectorAll("div");
        if (divs.length > 0) {
          quoteText = Array.from(divs).map((d) => d.textContent.trim()).join(" ");
        } else {
          quoteText = quoteParagraph.textContent.trim();
        }
      }
    }
    const namePosition = element.querySelector(".name-position p, figcaption p");
    let authorName = "";
    let authorTitle = "";
    if (namePosition) {
      const spans = namePosition.querySelectorAll("span:not(.pipe)");
      if (spans.length >= 2) {
        authorName = spans[0].textContent.trim();
        authorTitle = spans[1].textContent.trim();
      } else if (spans.length === 1) {
        authorName = spans[0].textContent.trim();
      } else {
        const text = namePosition.textContent.trim();
        const parts = text.split("|").map((p) => p.trim());
        authorName = parts[0] || "";
        authorTitle = parts[1] || "";
      }
    }
    const cells = [];
    if (image) {
      const imgEl = document.createElement("img");
      imgEl.src = image.src;
      imgEl.alt = image.alt || "";
      cells.push([imgEl]);
    }
    const quoteP = document.createElement("p");
    quoteP.textContent = quoteText;
    cells.push([quoteP]);
    const attributionContainer = document.createElement("p");
    if (authorName) {
      attributionContainer.textContent = authorName;
    }
    if (authorTitle) {
      const comma = document.createTextNode(", ");
      const em = document.createElement("em");
      em.textContent = authorTitle;
      attributionContainer.appendChild(comma);
      attributionContainer.appendChild(em);
    }
    cells.push([attributionContainer]);
    const block = WebImporter.Blocks.createBlock(document, { name: "quote-executive", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-article.js
  function parse7(element, { document }) {
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

  // tools/importer/parsers/cards-topic.js
  function parse8(element, { document }) {
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

  // tools/importer/parsers/cards-icon.js
  function parse9(element, { document }) {
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

  // tools/importer/parsers/video-background.js
  function parse10(element, { document }) {
    const videoSource = element.querySelector(".media-container.video-container video source[src], video source[src]");
    const videoEl = element.querySelector(".media-container.video-container video, video");
    let videoUrl = "";
    if (videoSource) {
      videoUrl = videoSource.getAttribute("src") || "";
    }
    if (!videoUrl && videoEl) {
      videoUrl = videoEl.getAttribute("data-cvx-media-desktop") || videoEl.getAttribute("src") || "";
    }
    let posterUrl = "";
    if (videoEl) {
      posterUrl = videoEl.getAttribute("poster") || "";
    }
    const posterImg = element.querySelector(".media-container img, .video-container img, .opening-content img");
    const cells = [];
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.textContent = videoUrl;
      cells.push([link]);
    }
    if (posterUrl) {
      const img = document.createElement("img");
      img.src = posterUrl;
      img.alt = "";
      const picture = document.createElement("picture");
      picture.appendChild(img);
      cells.push([picture]);
    } else if (posterImg) {
      cells.push([posterImg]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-background (autoplay)", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-data.js
  function parse11(element, { document }) {
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

  // tools/importer/parsers/accordion-social.js
  function parse12(element, { document }) {
    const cells = [];
    const listItems = element.querySelectorAll("ul.list > li.list-item, ul > li.list-item, li.list-item");
    listItems.forEach((li) => {
      const link = li.querySelector('a.cta-link-parent, a[href*="OpenDialog"]');
      if (!link) return;
      const categoryEl = link.querySelector(".cta-date, .type-eyebrow");
      const titleEl = link.querySelector(".cta-text");
      const category = categoryEl ? categoryEl.textContent.trim() : "";
      const title = titleEl ? titleEl.textContent.trim() : "";
      const titleCell = [];
      if (category) {
        const categoryP = document.createElement("p");
        categoryP.textContent = category;
        titleCell.push(categoryP);
      }
      if (title) {
        const titleH = document.createElement("h3");
        titleH.textContent = title;
        titleCell.push(titleH);
      }
      const href = link.getAttribute("href") || "";
      const dialogIdMatch = href.match(/OpenDialog\('([^']+)'\)/);
      const dialogId = dialogIdMatch ? dialogIdMatch[1] : null;
      const contentCell = [];
      if (dialogId) {
        const dialog = document.querySelector(`#${dialogId}, dialog#${dialogId}`);
        if (dialog) {
          const description = dialog.querySelector(".description, .modal-body .description");
          if (description) {
            const descP = document.createElement("p");
            descP.textContent = description.textContent.trim();
            contentCell.push(descP);
          }
          const img = dialog.querySelector(".c17e img.img-fluid, .modal-body img.img-fluid, .opening-content img");
          if (img) {
            const imgClone = img.cloneNode(true);
            contentCell.push(imgClone);
          }
        }
      }
      if (contentCell.length === 0) {
        const fallbackP = document.createElement("p");
        fallbackP.textContent = title || "Content not available";
        contentCell.push(fallbackP);
      }
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse13(element, { document }) {
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

  // tools/importer/import-sustainability-topic.js
  var parsers = {
    "hero-video": parse,
    "video-infographic": parse2,
    "columns-strategy": parse3,
    "cards-data": parse4,
    "cards-feature": parse5,
    "quote-executive": parse6,
    "carousel-article": parse7,
    "cards-topic": parse8,
    "cards-icon": parse9,
    "video-background": parse10,
    "columns-data": parse11,
    "accordion-social": parse12,
    "embed-video": parse13
  };
  var PAGE_TEMPLATE = {
    name: "sustainability-topic",
    description: "Sustainability topic sub-pages covering climate, environment, and social investment",
    urls: [
      "https://www.chevron.com/sustainability/climate",
      "https://www.chevron.com/sustainability/environment",
      "https://www.chevron.com/sustainability/social-investment"
    ],
    blocks: [
      { name: "hero-video", instances: [".c74.video-common", ".c01r.video-common"] },
      { name: "video-infographic", instances: ["section.section-module:has(.c17e video)", "section.section-module:has(.c74 video):not(:first-child)"] },
      { name: "columns-strategy", instances: [".flex-container.column-count-2:has(.c17e)"] },
      { name: "cards-data", instances: [".c11b.background-color-dark-blue", ".c11b.background-color-dark-teal"] },
      { name: "cards-feature", instances: [".c81"] },
      { name: "quote-executive", instances: [".c62"] },
      { name: "carousel-article", instances: [".c57.carousel-shared"] },
      { name: "cards-topic", instances: [".c75:not(.background-color-dark-purple) .card-container"] },
      { name: "cards-icon", instances: [".c11b:not(.background-color-dark-blue):not(.background-color-dark-teal)"] },
      { name: "video-background", instances: [".c17e.full"] },
      { name: "columns-data", instances: [".c63:has(.list-container)"] },
      { name: "accordion-social", instances: [".c66"] },
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
  var import_sustainability_topic_default = {
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
  return __toCommonJS(import_sustainability_topic_exports);
})();
