import fs from 'node:fs';

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/lighthouse_extract.mjs <report.json>');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const audits = report.audits ?? {};

const fmtMs = (ms) => (typeof ms === 'number' ? `${(ms / 1000).toFixed(2)}s` : 'n/a');

const perfScore = report.categories?.performance?.score;
const seoScore = report.categories?.seo?.score;

console.log(`Report: ${reportPath}`);
if (typeof perfScore === 'number') console.log(`Performance score: ${perfScore}`);
if (typeof seoScore === 'number') console.log(`SEO score: ${seoScore}`);

console.log(`FCP: ${fmtMs(audits['first-contentful-paint']?.numericValue)}`);
console.log(`LCP: ${fmtMs(audits['largest-contentful-paint']?.numericValue)}`);
console.log(`TBT: ${fmtMs(audits['total-blocking-time']?.numericValue)}`);
console.log(`CLS: ${audits['cumulative-layout-shift']?.numericValue ?? 'n/a'}`);

const lcpEl = audits['largest-contentful-paint-element'];
if (!lcpEl) {
  console.log('LCP element: (audit not present in this report)');
  process.exit(0);
}

const lcpItem = lcpEl.details?.items?.[0];
if (!lcpItem) {
  console.log('LCP element: (no items)');
  process.exit(0);
}

const snippet = lcpItem.node?.snippet;
const selector = lcpItem.node?.selector;
const path = lcpItem.node?.path;
const url = lcpItem.url;

console.log('LCP element snippet:', snippet ?? 'n/a');
if (selector) console.log('LCP element selector:', selector);
if (path) console.log('LCP element path:', path);
if (url) console.log('LCP element url:', url);

const reqAudit = audits['network-requests'];
const requests = reqAudit?.details?.items ?? [];
if (url && requests.length) {
  const match = requests.find((r) => r.url === url) ?? requests.find((r) => typeof r.url === 'string' && r.url.includes(url));
  if (match) {
    console.log('LCP resource transferSize (bytes):', match.transferSize ?? 'n/a');
    console.log('LCP resource resourceSize (bytes):', match.resourceSize ?? 'n/a');
    console.log('LCP resource mimeType:', match.mimeType ?? 'n/a');
    console.log('LCP resource statusCode:', match.statusCode ?? 'n/a');
  } else {
    console.log('LCP resource: (no matching entry found in network-requests)');
  }
}
