// test.js — 각 모듈 테스트
// 실제 인스타 업로드 없이 모든 모듈 동작 확인
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✅ ${label}`);
  passed++;
}

function fail(label, err) {
  console.log(`  ❌ ${label}`);
  console.log(`     ${err?.message || err}`);
  failed++;
}

// ─────────────────────────────────────────
// 1. 환경변수 체크
// ─────────────────────────────────────────
async function testEnv() {
  console.log('\n📋 [1/5] 환경변수 체크');

  const required = [
    'INSTAGRAM_ACCESS_TOKEN',
    'INSTAGRAM_USER_ID',
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
    'NOTIFY_EMAIL',
    'JOB_SECRET',
    'SERVER_BASE_URL'
  ];

  for (const key of required) {
    if (process.env[key]) {
      ok(`${key} 설정됨`);
    } else {
      fail(`${key} 없음 — .env 파일 확인 필요`);
    }
  }
}

// ─────────────────────────────────────────
// 2. 큐 파일 체크
// ─────────────────────────────────────────
async function testQueue() {
  console.log('\n📋 [2/5] 큐 파일 체크');

  const queuePath = path.join(__dirname, 'saju-posts', 'queue.json');
  const captionsPath = path.join(__dirname, 'saju-posts', 'captions.json');

  // queue.json 존재 여부
  if (!fs.existsSync(queuePath)) {
    fail('queue.json 없음 — Claude Code로 콘텐츠 먼저 생성 필요');
    return;
  }
  ok('queue.json 존재');

  // queue.json 파싱
  try {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
    ok(`queue.json 파싱 성공 — 총 ${queue.length}개`);

    const pending = queue.filter(i => i.status === 'pending').length;
    const withPng = queue.filter(i => i.png_path && fs.existsSync(i.png_path)).length;
    ok(`pending: ${pending}개 / PNG 준비된 것: ${withPng}개`);

    if (withPng === 0) {
      fail('PNG 파일 없음 — node render.js 먼저 실행 필요');
    }

    // 필수 필드 체크
    const sample = queue[0];
    const fields = ['id', 'week', 'filename', 'topic', 'status'];
    for (const f of fields) {
      if (sample[f] !== undefined) {
        ok(`queue 필드 확인: ${f}`);
      } else {
        fail(`queue 필드 누락: ${f}`);
      }
    }
  } catch (err) {
    fail('queue.json 파싱 실패', err);
  }

  // captions.json 존재 여부
  if (fs.existsSync(captionsPath)) {
    try {
      const captions = JSON.parse(fs.readFileSync(captionsPath, 'utf-8'));
      ok(`captions.json 존재 — ${captions.length}개`);
    } catch (err) {
      fail('captions.json 파싱 실패', err);
    }
  } else {
    fail('captions.json 없음');
  }
}

// ─────────────────────────────────────────
// 3. Puppeteer 렌더링 테스트
// ─────────────────────────────────────────
async function testRender() {
  console.log('\n📋 [3/5] Puppeteer 렌더링 테스트');

  // 임시 테스트용 HTML 생성
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #0d0c18; width: 360px; height: 640px; display: flex; align-items: center; justify-content: center; }
  .text { color: #d4af37; font-size: 32px; font-family: sans-serif; }
</style>
</head>
<body><div class="text">✦ saju.card ✦</div></body>
</html>`;

  const testHtmlPath = path.join(__dirname, '_test_render.html');
  const testPngPath = path.join(__dirname, '_test_render.png');

  fs.writeFileSync(testHtmlPath, testHtml);

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
    ok('puppeteer 로드 성공');
  } catch (err) {
    fail('puppeteer 로드 실패 — npm install 확인', err);
    fs.unlinkSync(testHtmlPath);
    return;
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 2 });
    await page.goto(`file://${path.resolve(testHtmlPath)}`, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: testPngPath, clip: { x: 0, y: 0, width: 360, height: 640 } });
    await browser.close();

    if (fs.existsSync(testPngPath)) {
      const size = fs.statSync(testPngPath).size;
      ok(`PNG 렌더링 성공 — ${(size / 1024).toFixed(1)}KB`);
      fs.unlinkSync(testPngPath);
    } else {
      fail('PNG 파일 생성 안 됨');
    }
  } catch (err) {
    fail('puppeteer 실행 실패', err);
  } finally {
    if (fs.existsSync(testHtmlPath)) fs.unlinkSync(testHtmlPath);
  }
}

// ─────────────────────────────────────────
// 4. Instagram API 연결 테스트 (읽기만, 업로드 X)
// ─────────────────────────────────────────
async function testInstagram() {
  console.log('\n📋 [4/5] Instagram API 연결 테스트');

  if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_USER_ID) {
    fail('토큰 또는 유저ID 없음 — .env 설정 필요');
    return;
  }

  let axios;
  try {
    axios = require('axios');
    ok('axios 로드 성공');
  } catch (err) {
    fail('axios 로드 실패 — npm install 확인', err);
    return;
  }

  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${process.env.INSTAGRAM_USER_ID}`,
      {
        params: {
          fields: 'id,username,media_count',
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN
        },
        timeout: 10000
      }
    );

    ok(`Instagram 연결 성공 — @${res.data.username} (게시물 ${res.data.media_count}개)`);
  } catch (err) {
    if (err.response?.data?.error) {
      fail(`Instagram API 오류: ${err.response.data.error.message}`, null);
    } else {
      fail('Instagram API 연결 실패', err);
    }
  }
}

// ─────────────────────────────────────────
// 5. 이메일 테스트
// ─────────────────────────────────────────
async function testEmail() {
  console.log('\n📋 [5/5] 이메일 테스트');

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    fail('Gmail 설정 없음 — .env 확인');
    return;
  }

  let nodemailer;
  try {
    nodemailer = require('nodemailer');
    ok('nodemailer 로드 성공');
  } catch (err) {
    fail('nodemailer 로드 실패 — npm install 확인', err);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.verify();
    ok('Gmail SMTP 연결 성공');

    // 실제 테스트 이메일 발송
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: '[saju.card] 테스트 이메일',
      text: '✅ 이메일 알림이 정상적으로 설정되었습니다.\n\nsaju.card 자동화 시스템이 준비되었습니다.'
    });

    ok(`테스트 이메일 발송 성공 → ${process.env.NOTIFY_EMAIL}`);
  } catch (err) {
    fail('Gmail 연결 실패 — 앱 비밀번호 확인', err);
  }
}

// ─────────────────────────────────────────
// 실행
// ─────────────────────────────────────────
async function runAll() {
  console.log('🌙 saju.card 시스템 테스트 시작\n');
  console.log('='.repeat(40));

  await testEnv();
  await testQueue();
  await testRender();
  await testInstagram();
  await testEmail();

  console.log('\n' + '='.repeat(40));
  console.log(`\n결과: ✅ ${passed}개 통과 / ❌ ${failed}개 실패\n`);

  if (failed === 0) {
    console.log('🎉 모든 테스트 통과! 자동화 시스템 준비 완료.\n');
  } else {
    console.log('⚠️  위의 실패 항목들을 먼저 해결하세요.\n');
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('\n💥 테스트 크래시:', err);
  process.exit(1);
});
