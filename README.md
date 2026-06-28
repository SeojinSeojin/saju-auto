# saju.card 자동 업로드 시스템

## 전체 구조

```
cron-job.org (매일 20:00 KST)
  → POST /run-job → Render.com 서버
                      → queue.json에서 5개 선택
                      → Instagram Graph API 업로드
                      → Gmail로 결과 이메일
```

---

## 셋업 순서

### 1단계 — 콘텐츠 생성 (로컬, 주 1회)

```bash
# Claude Code에서 마스터 프롬프트 실행
# → saju-posts/ 폴더에 HTML 35개 + queue.json + captions.json 생성

# PNG 렌더링
npm install
node render.js
# → saju-png/ 폴더에 PNG 35개 생성
```

### 2단계 — 환경변수 설정

```bash
cp .env.example .env
# .env 파일 열어서 값 입력:
```

필요한 값들:
- `INSTAGRAM_ACCESS_TOKEN` — 아래 발급 방법 참고
- `INSTAGRAM_USER_ID` — 아래 발급 방법 참고
- `GMAIL_USER` — Gmail 주소
- `GMAIL_APP_PASSWORD` — Google 계정 → 보안 → 앱 비밀번호
- `NOTIFY_EMAIL` — 결과 받을 이메일
- `JOB_SECRET` — 아무 문자열 (예: saju2024secret)
- `SERVER_BASE_URL` — Render 배포 후 생기는 URL

### 3단계 — Instagram Graph API 토큰 발급

1. https://developers.facebook.com 접속
2. 앱 생성 → 비즈니스 유형
3. Instagram Graph API 제품 추가
4. Instagram 계정 연결 (saju.card — 크리에이터 계정이어야 함)
5. 액세스 토큰 발급 (기본 60일짜리)
6. 장기 토큰으로 교환 (아래 명령어):

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={앱ID}
  &client_secret={앱시크릿}
  &fb_exchange_token={단기토큰}"
```

7. User ID 확인:
```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token={토큰}"
```

### 4단계 — Render.com 배포

1. https://render.com 가입
2. New → Web Service → GitHub 레포 연결
3. 환경변수 설정 (Render 대시보드 → Environment)
4. 배포 완료 후 URL 복사 (예: https://saju-card.onrender.com)
5. `.env`의 `SERVER_BASE_URL`에 입력

### 5단계 — cron-job.org 설정

1. https://cron-job.org 가입
2. New Cronjob 생성:
   - URL: `https://saju-card.onrender.com/run-job`
   - Method: POST
   - Schedule: `0 11 * * *` (UTC 11시 = KST 20시)
   - Header 추가: `x-job-secret: {JOB_SECRET 값}`
3. 슬립 방지용 ping job도 추가:
   - URL: `https://saju-card.onrender.com/ping`
   - Schedule: `*/10 * * * *` (10분마다)

---

## 주간 워크플로우

매주 월요일:
```bash
# Claude Code 실행 → 새 35개 생성
# render.js 실행 → PNG 변환
# Render에 push → 자동 배포
```

이후 자동으로 매일 저녁 8시에 5개씩 올라감.

---

## 큐 상태 확인

```bash
# 브라우저에서
https://saju-card.onrender.com/status
```

---

## 로컬 테스트

```bash
# 로컬에서 job 실행 테스트 (인스타 실제 업로드 안 함)
node -e "
  const q = require('./saju-posts/queue.json');
  console.log('pending:', q.filter(i=>i.status==='pending').length);
  console.log('posted:', q.filter(i=>i.status==='posted').length);
"
```
