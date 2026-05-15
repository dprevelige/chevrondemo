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

  // tools/importer/import-who-we-are-topic.js
  var import_who_we_are_topic_exports = {};
  __export(import_who_we_are_topic_exports, {
    default: () => import_who_we_are_topic_default
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

  // tools/importer/parsers/hero-brand.js
  function parse2(element, { document }) {
    const bgContainer = element.querySelector(".background-container");
    let bgImageEl = null;
    if (bgContainer) {
      const bgStyle = bgContainer.getAttribute("style") || "";
      const bgMatch = bgStyle.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch && bgMatch[1]) {
        bgImageEl = document.createElement("img");
        bgImageEl.src = bgMatch[1];
        bgImageEl.alt = "";
      }
    }
    if (!bgImageEl) {
      const imgEl = element.querySelector(".background-container img, .inner-container img, img");
      if (imgEl) {
        bgImageEl = imgEl;
      }
    }
    const heading = element.querySelector(
      ".text-window-container h1, .parent-container h1, .parent-container h2, h1, h2"
    );
    const description = element.querySelector(
      ".description-container .description, .parent-container .description, .description, .parent-container p"
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(".parent-container a[href], .description-container a[href], .inner-container > a[href]")
    ).filter((a) => !a.closest("button"));
    const cells = [];
    if (bgImageEl) {
      cells.push([bgImageEl]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-history.js
  function parse3(element, { document }) {
    const bgDiv = element.querySelector(".background-container .background, .background-container");
    let bgImageEl = null;
    if (bgDiv) {
      const bgStyle = bgDiv.getAttribute("style") || "";
      const bgMatch = bgStyle.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch && bgMatch[1]) {
        bgImageEl = document.createElement("img");
        bgImageEl.src = bgMatch[1];
        bgImageEl.alt = "";
      }
    }
    if (!bgImageEl) {
      const imgEl = element.querySelector(".background-container img, .inner-container img, img");
      if (imgEl) {
        bgImageEl = imgEl;
      }
    }
    const heading = element.querySelector(
      ".text-container h1, .text-container h2, h1, h2"
    );
    const description = element.querySelector(
      ".text-container .description, .description, .text-container p"
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(".buttons-container a[href], .text-container a.cta-button, a.cta-button")
    ).filter((a) => {
      const href = a.getAttribute("href") || "";
      return href && !href.startsWith("javascript:") && !href.startsWith("#");
    });
    const cells = [];
    if (bgImageEl) {
      cells.push([bgImageEl]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-history", cells });
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

  // tools/importer/parsers/columns-brand.js
  function parse5(element, { document }) {
    let image = null;
    const bgDiv = element.querySelector('.background-container .background[style], .background[style*="background-image"]');
    if (bgDiv) {
      const style = bgDiv.getAttribute("style") || "";
      const urlMatch = style.match(/url\(([^)]+)\)/);
      if (urlMatch) {
        const imgSrc = urlMatch[1].replace(/['"]/g, "").trim();
        image = document.createElement("img");
        image.setAttribute("src", imgSrc);
        image.setAttribute("alt", "");
      }
    }
    if (!image) {
      const directImg = element.querySelector(".list-container > div > img, .list-container img, img");
      if (directImg) {
        image = directImg;
      }
    }
    const textContainer = element.querySelector(".caption-container, .text-container, .lists");
    const heading = textContainer ? textContainer.querySelector('h2, h1, h3, [class*="header"]') : element.querySelector("h2, h1, h3");
    let description = null;
    if (textContainer) {
      const descDiv = textContainer.querySelector(".description");
      if (descDiv) {
        description = descDiv;
      } else {
        const typeBody = textContainer.querySelector(".type-body, div.text-base");
        if (typeBody) {
          const firstP = typeBody.querySelector("p");
          if (firstP && !firstP.querySelector("a.cta-link, a.cta-button")) {
            description = firstP;
          }
        }
      }
    }
    let ctaLinks = [];
    if (textContainer) {
      const listLinks = textContainer.querySelectorAll("ul li a");
      if (listLinks.length > 0) {
        ctaLinks = Array.from(listLinks);
      } else {
        const typeBody = textContainer.querySelector(".type-body, div.text-base");
        if (typeBody) {
          const pLinks = typeBody.querySelectorAll("p a.cta-link, p a.cta-button");
          if (pLinks.length > 0) {
            ctaLinks = Array.from(pLinks);
          }
        }
        if (ctaLinks.length === 0) {
          const directLinks = textContainer.querySelectorAll(":scope > a.cta-link, :scope > a.cta-button, :scope > a");
          ctaLinks = Array.from(directLinks);
        }
      }
    }
    if (ctaLinks.length === 0) {
      ctaLinks = Array.from(element.querySelectorAll("a.cta-link, a.cta-button"));
    }
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctaLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.getAttribute("href") || "";
      a.textContent = link.textContent.trim();
      const target = link.getAttribute("target");
      if (target) a.setAttribute("target", target);
      p.appendChild(a);
      contentCell.push(p);
    });
    const cells = [
      [imageCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-mosaic.js
  function parse6(element, { document }) {
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

  // tools/importer/parsers/carousel-image.js
  function parse8(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".splide__slide");
    slides.forEach((slide) => {
      const img = slide.querySelector(".background img, img.img-fluid, img");
      const captionContainer = slide.querySelector(".caption-container");
      const captionText = captionContainer ? captionContainer.querySelector("p, div, span") : null;
      if (img) {
        const contentCell = [];
        if (captionText) {
          contentCell.push(captionText);
        }
        cells.push([img, contentCell.length > 0 ? contentCell : ""]);
      }
    });
    if (cells.length === 0) {
      const fallbackImages = element.querySelectorAll("img");
      fallbackImages.forEach((img) => {
        cells.push([img, ""]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-image",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-feature.js
  function parse9(element, { document }) {
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

  // tools/importer/parsers/cards-data.js
  function parse10(element, { document }) {
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

  // tools/importer/parsers/cards-leadership.js
  function parse11(element, { document }) {
    const cells = [];
    let officerLinks;
    if (element.tagName === "A" || element.matches("a.officer-featured")) {
      officerLinks = [element];
    } else {
      officerLinks = Array.from(element.querySelectorAll(":scope > a"));
      if (officerLinks.length === 0) {
        officerLinks = Array.from(element.querySelectorAll("a[href]"));
      }
    }
    officerLinks.forEach((link) => {
      const image = link.querySelector("img");
      const contentCell = [];
      const infoDiv = link.querySelector(".officer-info");
      if (infoDiv) {
        const nameSpan = infoDiv.querySelector("span.name, .name");
        const titleSpan = infoDiv.querySelector("span.title, .title");
        if (nameSpan) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = link.getAttribute("href") || "";
          const strong = document.createElement("strong");
          strong.textContent = nameSpan.textContent.trim();
          a.appendChild(strong);
          p.appendChild(a);
          contentCell.push(p);
        }
        if (titleSpan) {
          const p = document.createElement("p");
          p.textContent = titleSpan.textContent.trim();
          contentCell.push(p);
        }
      } else {
        const textContent = link.textContent.trim();
        if (textContent) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = link.getAttribute("href") || "";
          a.textContent = textContent;
          p.appendChild(a);
          contentCell.push(p);
        }
      }
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-leadership", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-timeline.js
  function parse12(element, { document }) {
    const cells = [];
    const tabLinks = Array.from(
      element.querySelectorAll("ul.nav-tabs .nav-item a.nav-link, ul.nav-tabs li a.cta-link")
    );
    const tabPanels = Array.from(
      element.querySelectorAll('.c71-container > section.section-module, .c71-container > section[class*="chapter"]')
    );
    tabPanels.forEach((panel, index) => {
      let tabLabel = "";
      if (tabLinks[index]) {
        const labelSpan = tabLinks[index].querySelector(".cta-underline");
        tabLabel = labelSpan ? labelSpan.textContent.trim() : tabLinks[index].textContent.trim();
      }
      if (!tabLabel) {
        const eyebrow = panel.querySelector(".c06r .type-eyebrow, .type-eyebrow");
        tabLabel = eyebrow ? eyebrow.textContent.trim() : `Tab ${index + 1}`;
      }
      const labelCell = document.createElement("p");
      labelCell.textContent = tabLabel;
      const contentCell = [];
      const eraHeading = panel.querySelector(".c06r h2, h2.type-display");
      if (eraHeading) {
        const h2 = document.createElement("h2");
        h2.textContent = eraHeading.textContent.trim();
        contentCell.push(h2);
      }
      const eraDesc = panel.querySelector(".c06r .description, .c06r .type-body");
      if (eraDesc) {
        const descP = document.createElement("p");
        descP.textContent = eraDesc.textContent.trim();
        contentCell.push(descP);
      }
      const dialogItems = Array.from(
        panel.querySelectorAll(".c71 .dialog-item, .dialog-text .dialog-item")
      );
      const panelSections = Array.from(
        panel.querySelectorAll(".c71 .panels > section")
      );
      const mediaUrls = [];
      panelSections.forEach((sec) => {
        const bg = sec.querySelector(".bg");
        if (!bg) {
          mediaUrls.push("");
          return;
        }
        const videoEl = bg.querySelector("video");
        if (videoEl) {
          const videoSrc = videoEl.getAttribute("data-cvx-media-desktop") || videoEl.querySelector("source") && videoEl.querySelector("source").getAttribute("src");
          mediaUrls.push(videoSrc || "");
          return;
        }
        const style = bg.getAttribute("style") || "";
        const urlMatch = style.match(/background-image:\s*url\(\s*['"]?([^'")\s]+)['"]?\s*\)/);
        if (urlMatch) {
          let imgUrl = urlMatch[1];
          const qIndex = imgUrl.indexOf("?");
          if (qIndex > -1) {
            imgUrl = imgUrl.substring(0, qIndex);
          }
          mediaUrls.push(imgUrl);
        } else {
          mediaUrls.push("");
        }
      });
      dialogItems.forEach((item, itemIndex) => {
        const yearEl = item.querySelector("h3.title, h3");
        const descEl = item.querySelector(".description, .type-body");
        if (yearEl) {
          const yearH3 = document.createElement("h3");
          yearH3.textContent = yearEl.textContent.trim();
          contentCell.push(yearH3);
        }
        if (descEl) {
          const entryP = document.createElement("p");
          entryP.innerHTML = descEl.innerHTML.trim();
          contentCell.push(entryP);
        }
        if (mediaUrls[itemIndex]) {
          const mediaUrl = mediaUrls[itemIndex];
          if (mediaUrl.endsWith(".mp4") || mediaUrl.includes("/videos/")) {
            const videoLink = document.createElement("a");
            videoLink.href = mediaUrl;
            videoLink.textContent = mediaUrl;
            contentCell.push(videoLink);
          } else {
            const img = document.createElement("img");
            img.src = mediaUrl;
            img.alt = yearEl ? yearEl.textContent.trim() : "";
            contentCell.push(img);
          }
        }
      });
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-timeline", cells });
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

  // tools/importer/import-who-we-are-topic.js
  var parsers = {
    "hero-video": parse,
    "hero-brand": parse2,
    "hero-history": parse3,
    "columns-feature": parse4,
    "columns-brand": parse5,
    "columns-mosaic": parse6,
    "carousel-article": parse7,
    "carousel-image": parse8,
    "carousel-feature": parse9,
    "cards-data": parse10,
    "cards-leadership": parse11,
    "tabs-timeline": parse12
  };
  var PAGE_TEMPLATE = {
    name: "who-we-are-topic",
    description: "Who we are topic sub-pages covering culture, brands, leadership, and history",
    urls: [
      "https://www.chevron.com/who-we-are/culture",
      "https://www.chevron.com/who-we-are/our-brands",
      "https://www.chevron.com/who-we-are/leadership",
      "https://www.chevron.com/who-we-are/history"
    ],
    blocks: [
      { name: "hero-video", instances: [".c74.video-common"] },
      { name: "hero-brand", instances: [".c74:not(.video-common)"] },
      { name: "hero-history", instances: [".c01r.video-common"] },
      { name: "columns-feature", instances: [".c69.contained"] },
      { name: "columns-brand", instances: [".c55", ".c69:not(.contained)", ".c63:not(.background-color-offwhite)"] },
      { name: "columns-mosaic", instances: [".c72"] },
      { name: "carousel-article", instances: [".c57.carousel-shared"] },
      { name: "carousel-image", instances: [".c58.carousel-shared"] },
      { name: "carousel-feature", instances: [".c56.carousel-shared"] },
      { name: "cards-data", instances: [".c11b"] },
      { name: "cards-leadership", instances: [".c75:has(.officers-grid)", ".c75:has(.officer-featured)"] },
      { name: "tabs-timeline", instances: [".c71-container"] }
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
  var import_who_we_are_topic_default = {
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
  return __toCommonJS(import_who_we_are_topic_exports);
})();
