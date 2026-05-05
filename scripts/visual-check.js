const { chromium } = require('playwright');

const baseUrl = process.env.VISUAL_CHECK_URL || 'http://localhost:4011/';
const pathName = process.env.VISUAL_CHECK_PATH || '/';
const cases = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 900 }
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const item of cases) {
    const page = await browser.newPage({
      viewport: { width: item.width, height: item.height },
      deviceScaleFactor: 1
    });

    const targetUrl = baseUrl.startsWith('file://') ? baseUrl : new URL(pathName, baseUrl).toString();
    const safePath = baseUrl.startsWith('file://')
      ? 'file-' + baseUrl.split('/').filter(Boolean).slice(-2).join('-').replace(/[^\w-]+/g, '-')
      : (pathName === '/' ? 'home' : pathName.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '-'));

    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `tmp/visual-${safePath}-${item.name}.png`, fullPage: true });

    const metrics = await page.evaluate(() => {
      const nav = document.querySelector('.button-bar');
      const links = Array.from(document.querySelectorAll('.nav-links a'));
      const navRect = nav ? nav.getBoundingClientRect() : { height: 0, bottom: 0 };
      const overflowingLinks = links
        .map((link) => {
          const rect = link.getBoundingClientRect();
          return {
            text: link.textContent.trim(),
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            scrollWidth: link.scrollWidth,
            clientWidth: link.clientWidth
          };
        })
        .filter((link) => link.right > window.innerWidth || link.left < 0 || link.scrollWidth > link.clientWidth + 1);

      return {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        navHeight: Math.round(navRect.height),
        navBottom: Math.round(navRect.bottom),
        links: links.map((link) => link.textContent.trim()),
        overflowingLinks
      };
    });

    results.push({
      name: item.name,
      screenshot: `tmp/visual-${safePath}-${item.name}.png`,
      ...metrics
    });

    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
