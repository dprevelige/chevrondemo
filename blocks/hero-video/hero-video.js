export default function decorate(block) {
  // Row 1: video URL link; Row 2: text content (h1 + p)
  const rows = [...block.children];
  const videoRow = rows[0];
  const textRow = rows[1];

  // Extract video URL from the link in row 1
  const videoLink = videoRow.querySelector('a');
  const videoUrl = videoLink ? videoLink.href || videoLink.textContent.trim() : '';

  // Extract text content from row 2
  const textCell = textRow ? textRow.querySelector('div') : null;
  const h1 = textCell ? textCell.querySelector('h1') : null;
  const description = textCell ? textCell.querySelector('p') : null;

  // Clear block content and rebuild
  block.textContent = '';

  // Create video container with autoplay background video
  if (videoUrl) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'hero-video-bg';

    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');

    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = 'video/mp4';
    video.append(source);
    videoContainer.append(video);

    // Gradient overlay for nav readability
    const gradient = document.createElement('div');
    gradient.className = 'hero-video-gradient';
    videoContainer.append(gradient);

    block.append(videoContainer);
  }

  // Create text overlay area at bottom
  const textOverlay = document.createElement('div');
  textOverlay.className = 'hero-video-text';

  if (h1) {
    const headingWrap = document.createElement('div');
    headingWrap.className = 'hero-video-heading';
    headingWrap.append(h1);
    textOverlay.append(headingWrap);
  }

  if (description) {
    const descWrap = document.createElement('div');
    descWrap.className = 'hero-video-description';
    descWrap.append(description);
    textOverlay.append(descWrap);
  }

  block.append(textOverlay);
}
