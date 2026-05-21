const SLIDE_DURATION = 8000;

function showSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  const total = slides.length;
  const idx = ((slideIndex % total) + total) % total;
  block.dataset.activeSlide = idx;

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== idx);
    const video = slide.querySelector('video');
    if (video) {
      if (i === idx) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });
}

function createSlide(row, slideIndex) {
  const slide = document.createElement('div');
  slide.dataset.slideIndex = slideIndex;
  slide.classList.add('carousel-hero-slide');
  if (slideIndex > 0) slide.setAttribute('aria-hidden', 'true');

  const columns = row.querySelectorAll(':scope > div');
  const mediaCol = columns[0];
  const contentCol = columns[1];

  if (mediaCol) {
    const codes = mediaCol.querySelectorAll('code');
    let videoSrc = '';
    let posterSrc = '';

    codes.forEach((code) => {
      const text = code.textContent.trim();
      if (text.includes('.mp4')) videoSrc = text;
      else if (text.match(/\.(jpg|jpeg|png|webp)/i)) posterSrc = text;
    });

    if (!videoSrc) {
      const link = mediaCol.querySelector('a[href*=".mp4"]');
      if (link) videoSrc = link.href;
    }
    if (!posterSrc) {
      const img = mediaCol.querySelector('img');
      if (img && img.src && !img.src.includes('about:error')) posterSrc = img.src;
    }

    const videoWrap = document.createElement('div');
    videoWrap.className = 'carousel-hero-slide-video';

    if (videoSrc) {
      const video = document.createElement('video');
      video.autoplay = slideIndex === 0;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      if (posterSrc) video.poster = posterSrc;
      const source = document.createElement('source');
      source.src = videoSrc;
      source.type = 'video/mp4';
      video.append(source);
      videoWrap.append(video);
    } else if (posterSrc) {
      const img = document.createElement('img');
      img.src = posterSrc;
      img.alt = '';
      videoWrap.append(img);
    }

    slide.append(videoWrap);
  }

  if (contentCol) {
    contentCol.className = 'carousel-hero-slide-content';
    slide.append(contentCol);
  }

  return slide;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  block.textContent = '';
  block.dataset.activeSlide = 0;

  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-hero-slides';

  rows.forEach((row, idx) => {
    slidesContainer.append(createSlide(row, idx));
  });

  block.append(slidesContainer);

  if (rows.length > 1) {
    let current = 0;
    setInterval(() => {
      current += 1;
      showSlide(block, current);
    }, SLIDE_DURATION);
  }
}
