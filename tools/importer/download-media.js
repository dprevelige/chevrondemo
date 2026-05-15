import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import puppeteer from 'puppeteer';

const mapping = JSON.parse(readFileSync('/tmp/url-mapping.json', 'utf8'));
const mediaDir = join(process.cwd(), 'content', 'media');
mkdirSync(mediaDir, { recursive: true });

const entries = Object.entries(mapping).filter(([path]) => {
  const ext = extname(path).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'].includes(ext);
});

console.log(`Downloading ${entries.length} images (skipping videos/PDFs)...\n`);

async function downloadBatch(page, batch) {
  const results = await page.evaluate(async (urls) => {
    const out = [];
    for (const [localPath, url] of urls) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) { out.push({ localPath, error: `HTTP ${resp.status}` }); continue; }
        const blob = await resp.blob();
        const buffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        out.push({ localPath, base64, size: buffer.byteLength });
      } catch (e) {
        out.push({ localPath, error: e.message });
      }
    }
    return out;
  }, batch);

  for (const r of results) {
    if (r.error) {
      console.log(`  ❌ ${r.localPath}: ${r.error}`);
      continue;
    }
    const filepath = join(mediaDir, r.localPath.replace('/media/', ''));
    writeFileSync(filepath, Buffer.from(r.base64, 'base64'));
    console.log(`  ✅ ${r.localPath} (${Math.round(r.size / 1024)}KB)`);
  }
}

const BATCH_SIZE = 10;

async function main() {
  const execPath = ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium']
    .find(p => existsSync(p)) || undefined;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.chevron.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('Browser ready on chevron.com\n');

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(entries.length / BATCH_SIZE)} (${batch.length} images):`);
    await downloadBatch(page, batch);
    console.log('');
  }

  await browser.close();

  const downloaded = readdirSync(mediaDir).length;
  console.log(`\n✅ Done. ${downloaded} images saved to content/media/`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
