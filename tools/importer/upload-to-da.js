/**
 * Upload fixed content to DA content store.
 *
 * Usage:
 *   node tools/importer/upload-to-da.js <DA_TOKEN>
 *
 * Get your DA token:
 *   1. Open https://da.live in your browser (logged in)
 *   2. Open DevTools > Application > Cookies
 *   3. Copy the value of the "auth_token" cookie
 *   OR
 *   1. Open https://da.live in your browser
 *   2. Open DevTools > Console
 *   3. Run: copy(document.cookie.match(/auth_token=([^;]+)/)?.[1])
 *   4. Paste as the argument to this script
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ORG = 'dprevelige';
const SITE = 'chevrondemo';
const DA_ADMIN = 'https://admin.da.live';

const token = process.argv[2];
if (!token) {
  console.error('Usage: node tools/importer/upload-to-da.js <DA_TOKEN>');
  console.error('');
  console.error('Get your token from da.live cookies (auth_token)');
  process.exit(1);
}

function findFiles(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...findFiles(full, ext));
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

const uploadDir = join(process.cwd(), 'content', 'upload-to-da');
const files = findFiles(uploadDir, '.html');

console.log(`Uploading ${files.length} files to DA (${ORG}/${SITE})...\n`);

let success = 0;
let failed = 0;

for (const file of files) {
  const rel = relative(uploadDir, file);
  const daPath = `/${rel}`;
  const url = `${DA_ADMIN}/source/${ORG}/${SITE}${daPath}`;
  const html = readFileSync(file, 'utf-8');

  const body = new FormData();
  body.append('data', html);

  try {
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/html',
      },
      body: html,
    });

    if (resp.ok) {
      console.log(`  ✅ ${daPath}`);
      success++;
    } else {
      console.log(`  ❌ ${daPath} — ${resp.status} ${resp.statusText}`);
      failed++;
    }
  } catch (e) {
    console.log(`  ❌ ${daPath} — ${e.message}`);
    failed++;
  }
}

console.log(`\nDone. Success: ${success}, Failed: ${failed}`);
