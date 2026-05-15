export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-mosaic-${cols.length}-cols`);

  // setup image columns and convert video links
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-mosaic-img-col');
        }
      }

      // Convert video links (.mp4) into <video> elements
      const link = col.querySelector('a[href$=".mp4"]');
      if (link) {
        const videoSrc = link.href;
        const video = document.createElement('video');
        video.classList.add('columns-mosaic-video');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.muted = true; // programmatic mute for autoplay
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        video.append(source);

        // Replace the cell content with the video
        col.textContent = '';
        col.append(video);
        col.classList.add('columns-mosaic-video-col');
      }
    });
  });
}
