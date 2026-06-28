// render.js — HTML 파일들을 PNG로 변환
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'saju-posts', 'quick10');
const OUTPUT_DIR = path.join(__dirname, 'saju-png', 'quick10');

async function renderHTMLtoPNG(htmlPath, pngPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 }); // 2x for retina

    const fileUrl = `file://${path.resolve(htmlPath)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // 폰트 로딩 대기
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: pngPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 360, height: 640 }
    });

    console.log(`  ✅ rendered: ${path.basename(pngPath)}`);
  } finally {
    await browser.close();
  }
}

async function renderAll() {
  // queue.json 읽기
  const queuePath = path.join(POSTS_DIR, 'queue.json');
  if (!fs.existsSync(queuePath)) {
    console.error('❌ queue.json not found. Run Claude Code prompt first.');
    process.exit(1);
  }

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));

  // PNG 출력 폴더 생성
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\n🎨 Rendering ${queue.length} HTML files to PNG...\n`);

  for (const item of queue) {
    const htmlPath = path.join(POSTS_DIR, item.filename);
    const pngFilename = item.filename.replace('.html', '.png').replace('/', '_');
    const pngPath = path.join(OUTPUT_DIR, pngFilename);

    if (!fs.existsSync(htmlPath)) {
      console.warn(`  ⚠️  skipped (not found): ${item.filename}`);
      continue;
    }

    if (fs.existsSync(pngPath)) {
      console.log(`  ⏭️  already exists: ${pngFilename}`);
      continue;
    }

    await renderHTMLtoPNG(htmlPath, pngPath);

    // queue에 png 경로 업데이트
    item.png_path = pngPath;
  }

  // queue.json 업데이트
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  console.log(`\n✅ All rendered. PNG files saved to: ${OUTPUT_DIR}\n`);
}

renderAll().catch(err => {
  console.error('❌ Render failed:', err);
  process.exit(1);
});
