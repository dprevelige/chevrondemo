import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const contentDir = join(process.cwd(), 'content');
const mediaDir = join(contentDir, 'media');

if (!existsSync(mediaDir)) {
  mkdirSync(mediaDir, { recursive: true });
}

const downloaded = new Map();

function hashUrl(url) {
  return createHash('md5').update(url).digest('hex').substring(0, 12);
}

function cleanUrl(rawUrl) {
  return rawUrl.replace(/&amp;/g, '&');
}

function getExtension(url) {
  const pathname = new URL(url).pathname;
  const ext = extname(pathname).split('?')[0];
  return ext || '.jpg';
}

function downloadImage(url) {
  if (downloaded.has(url)) return downloaded.get(url);

  const hash = hashUrl(url);
  const ext = getExtension(url);
  const filename = `${hash}${ext}`;
  const filepath = join(mediaDir, filename);
  const relativePath = `/media/${filename}`;

  if (existsSync(filepath)) {
    downloaded.set(url, relativePath);
    return relativePath;
  }

  try {
    execSync(
      `curl -sL -o "${filepath}" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "${url}"`,
      { timeout: 30000 },
    );

    const stat = existsSync(filepath) ? readFileSync(filepath).length : 0;
    if (stat < 100) {
      console.warn(`  ⚠️  Tiny file (${stat}b), may be blocked: ${url}`);
    } else {
      console.log(`  ✅ Downloaded ${filename} (${Math.round(stat / 1024)}KB)`);
    }

    downloaded.set(url, relativePath);
    return relativePath;
  } catch (e) {
    console.error(`  ❌ Failed to download: ${url} — ${e.message}`);
    downloaded.set(url, null);
    return null;
  }
}

function processFile(filePath) {
  let html = readFileSync(filePath, 'utf-8');
  let changed = false;

  const srcRegex = /src="(https?:\/\/www\.chevron\.com\/-\/media\/[^"]+)"/g;
  html = html.replace(srcRegex, (match, rawUrl) => {
    const url = cleanUrl(rawUrl);
    const localPath = downloadImage(url);
    if (localPath) {
      changed = true;
      return `src="${localPath}"`;
    }
    return match;
  });

  const relSrcRegex = /src="(\/-\/media\/[^"]+)"/g;
  html = html.replace(relSrcRegex, (match, rawPath) => {
    const url = cleanUrl(`https://www.chevron.com${rawPath}`);
    const localPath = downloadImage(url);
    if (localPath) {
      changed = true;
      return `src="${localPath}"`;
    }
    return match;
  });

  const hrefVideoRegex = /href="(https?:\/\/www\.chevron\.com\/-\/media\/[^"]+\.mp4[^"]*)"/g;
  html = html.replace(hrefVideoRegex, (match, rawUrl) => {
    const url = cleanUrl(rawUrl);
    const localPath = downloadImage(url);
    if (localPath) {
      changed = true;
      return `href="${localPath}"`;
    }
    return match;
  });

  const relHrefVideoRegex = /href="(\/-\/media\/[^"]+\.mp4[^"]*)"/g;
  html = html.replace(relHrefVideoRegex, (match, rawPath) => {
    const url = cleanUrl(`https://www.chevron.com${rawPath}`);
    const localPath = downloadImage(url);
    if (localPath) {
      changed = true;
      return `href="${localPath}"`;
    }
    return match;
  });

  if (changed) {
    writeFileSync(filePath, html, 'utf-8');
    return true;
  }
  return false;
}

function findFiles(dir, pattern) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== 'docs' && entry !== 'media') results.push(...findFiles(full, pattern));
    } else if (full.endsWith(pattern)) {
      results.push(full);
    }
  }
  return results;
}

const files = findFiles(contentDir, '.plain.html');
console.log(`Processing ${files.length} content files...\n`);

let totalUpdated = 0;
for (const file of files) {
  const rel = file.replace(contentDir + '/', '');
  console.log(`📄 ${rel}`);
  if (processFile(file)) {
    totalUpdated++;
    console.log(`   Updated.\n`);
  } else {
    console.log(`   No changes needed.\n`);
  }
}

console.log(`\n✅ Done. Updated ${totalUpdated}/${files.length} files.`);
console.log(`📁 Downloaded ${downloaded.size} unique images to content/media/`);
