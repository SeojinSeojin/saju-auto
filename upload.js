// upload.js — Instagram Graph API 업로드
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const BASE_URL = `https://graph.facebook.com/v19.0`;

// PNG 파일을 임시 공개 URL로 올려야 함
// Render.com에서 돌릴 때는 static file serving으로 해결
// 로컬 테스트 시엔 ngrok 등 사용 가능
const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:3000';

async function uploadToInstagram({ pngPath, caption }) {
  const filename = path.basename(pngPath);
  const imageUrl = `${SERVER_BASE_URL}/png/${filename}`;

  console.log(`  📤 Uploading: ${filename}`);
  console.log(`  🔗 Image URL: ${imageUrl}`);

  // Step 1: 미디어 컨테이너 생성
  const containerRes = await axios.post(
    `${BASE_URL}/${IG_USER_ID}/media`,
    null,
    {
      params: {
        image_url: imageUrl,
        caption: caption,
        access_token: IG_TOKEN
      }
    }
  );

  const containerId = containerRes.data.id;
  console.log(`  📦 Container created: ${containerId}`);

  // Step 2: 업로드 완료 대기 (보통 5~10초)
  await new Promise(resolve => setTimeout(resolve, 8000));

  // Step 3: 게시
  const publishRes = await axios.post(
    `${BASE_URL}/${IG_USER_ID}/media_publish`,
    null,
    {
      params: {
        creation_id: containerId,
        access_token: IG_TOKEN
      }
    }
  );

  const postId = publishRes.data.id;
  console.log(`  ✅ Published! Post ID: ${postId}`);

  return postId;
}

module.exports = { uploadToInstagram };
