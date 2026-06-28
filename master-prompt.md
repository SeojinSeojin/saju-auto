# Claude Code Master Prompt — saju.card Instagram Content Generation

Generate 35 Instagram reel card HTML files for a Korean astrology (사주) account called saju.card. Follow all instructions precisely.

---

## Folder Structure

Create the following structure:

```
saju-posts/
├── week01/   (topics 1~7)
├── week02/   (topics 8~14)
├── week03/   (topics 15~21)
├── week04/   (topics 22~28)
├── week05/   (topics 29~35)
├── queue.json
└── captions.json
```

---

## Card Specifications

### Layout
- Width: 360px, Height: 640px (9:16 ratio for Instagram Reels)
- **Top padding: minimum 60px** (iPhone notch clearance)
- **Bottom padding: minimum 80px** (Instagram UI clearance)
- No card border (border: none)
- Use glow box-shadow instead of borders on inner boxes
- Always use bright text colors (dark text on dark background is forbidden)
- No unnecessary decorative lines (no header dividers, no constellation connector lines)
- All copy in Korean only — no English phrases in the card content
- No heteronormative language (use 상대방 instead of 남사친/여사친, 배우자 instead of 남편/아내)
- **The title must be the hook** — make it feel like "oh that's literally me"

### Fonts
Load via Google Fonts CDN. Rotate header fonts — never use the same font twice in a row:
- Header font options: `Black Han Sans`, `Gasoek One`, `Gugi`
- Body font: `Noto Sans KR` (fixed)

### Templates
Rotate templates — never use the same template twice in a row:
1. **Numbered list** — 01 02 03... number + title + description
2. **Left accent line** — colored left border line + title + description
3. **Grid** — 2-column card grid (best for 4~6 items)
4. **Full-bleed typo** — large typography dominates the background

### Color Themes
Match color to topic category:
- 신살 (神煞) topics → Deep purple / indigo
- 연애/궁합 topics → Rose / pink
- 재물운 topics → Gold / amber
- 일간 설명 → Match the ohaeng color (목=green, 화=red, 토=earth tones, 금=silver/white, 수=blue)
- 실용 정보 → Dark navy

### Background SVG Elements (required on every card)
- 5~8 small faint star dots
- 1 crescent moon (top-right area)
- 1 thematic decoration matching the topic (flowers, chains, ohaeng characters, etc.)
- Shimmer animation effect (CSS keyframe)

---

## Content Rules

### Fact-checking
Before writing content for each card, mentally verify 3 times:
1. Is this consistent with 음양오행 principles?
2. Are there any logical contradictions in 생극제화?
3. Is uncertain content phrased as "~로 보기도 한다" rather than stated as absolute fact?

### Copy Tone
- Korean millennial/gen-Z meme tone
- Phrases like: "이거 나잖아", "본인도 모름", "몇 번째야", "근데 또 함", "뜨끔한 사람 🙋"
- Relatable and empathetic, not academic
- Each item: 1~2 lines max, punchy

### Item Count per Template
- Numbered list / Left accent line: 7~8 items
- Grid: 4~6 items
- Full-bleed typo: 1~3 key phrases + short explanation

### Footer
Every card must have `@saju.card` at bottom-right, small and faint.

---

## Topic List (Korean — use exactly as written for card titles and content)

### week01
1. 괴강살 있는 사람 특징 8가지
2. 공망살 — 뭘 해도 안 풀리는 진짜 이유
3. 백호살 있으면 실제로 이런 일이 생긴다
4. 화개살 있는 사람이 예술에 빠지는 이유
5. 양인살 — 무서운 살인가 강력한 무기인가
6. 귀문관살 있는 사람 주변에 꼭 한 명은 있음
7. 천을귀인 있으면 진짜 귀인이 나타나나?

### week02
8. 문창귀인 — 공부운이 열리는 사주
9. 홍염살 vs 도화살 차이
10. 겁살 있는 사람이 손해를 자주 보는 이유
11. 식신 관련 오해와 진실 5가지
12. 상관 있는 사람이 직장 못 다니는 이유
13. 편관(칠살) — 내 사주의 적인가 아군인가
14. 정관 있는 사람 vs 편관 있는 사람 차이

### week03
15. 겁재 있으면 진짜 돈을 빼앗기나
16. 편인 있는 사람의 뇌구조
17. 인성 강한 사람이 공부는 잘하는데 돈은 못 버는 이유
18. 비견 많은 사람이 독립하고 싶어하는 이유
19. 재성 없는 사주 — 진짜 돈복 없는 건가?
20. 식신과 상관 — 같은 식상인데 왜 이렇게 다른가
21. 육합 궁합 — 삼합보다 더 찰떡인 조합

### week04
22. 사주로 보는 오래 가는 커플의 공통점
23. 충(沖) 궁합 — 싸우는데 헤어지질 못하는 이유
24. 일주가 같은 커플 특징
25. 내 사주에 배우자 복 있는지 보는 법
26. 갑목 일간 — 리더인데 왜 이렇게 외로운가
27. 임수 일간 — 깊고 조용한데 속을 모르겠는 사람
28. 병화 일간 — 존재 자체가 에너지인 사람

### week05
29. 경금 일간 — 냉철한데 의외로 상처 잘 받음
30. 기토 일간 — 묵묵히 다 받아주다 한 번에 터짐
31. 대운 바뀌는 해에 생기는 일 총정리
32. 올해 세운으로 보는 2026년 주의해야 할 것들
33. 사주로 보는 내 번아웃 이유
34. 내 용신 색깔로 옷 입으면 운이 바뀐다? 팩트체크
35. 사주 볼 때 꼭 알아야 할 용어 10개

---

## Output File Naming

Use lowercase English with underscores:
- week01/01_goegangsal.html
- week01/02_gongmangsal.html
- week01/03_baekhosal.html
- (and so on)

---

## queue.json Format

```json
[
  {
    "id": 1,
    "week": "week01",
    "filename": "week01/01_goegangsal.html",
    "topic": "괴강살 있는 사람 특징 8가지",
    "status": "pending",
    "scheduled_date": null,
    "posted_date": null,
    "instagram_post_id": null
  }
]
```

## captions.json Format

```json
[
  {
    "id": 1,
    "topic": "괴강살 있는 사람 특징 8가지",
    "caption": "full caption text here...",
    "hashtags": "#괴강살 #사주 #사주팔자 ..."
  }
]
```

---

## Caption Rules

Write a caption for every card and save to captions.json.

Caption structure:
```
[Hook first line — make reader feel "that's me"]

[3~5 line summary of key content]

[How to check your own 살/십성 — mention 만세력 app]

@@야 너 이거 아니야? 🫵
저장해두고 확인해봐요

[10~12 hashtags: 2 large (#사주, #사주팔자) + 4 medium (#도화살 etc) + 4 small (#사주카드 etc)]
```

---

## Execution Order

1. Create folder structure: `saju-posts/` and all week subfolders
2. Generate HTML files in order, one by one (week01/01 → week01/02 → ... → week05/35)
3. After each HTML, write its caption entry
4. After all 35 files, generate queue.json and captions.json
5. Final report: list all files created, font/template combinations used per card

## Progress Reporting

After each file: report `[N/35] filename.html — template: X, font: Y, theme: Z`

---

## Technical Requirements

- Each HTML file must be fully self-contained (no external CSS/JS file dependencies)
- All styles inside `<style>` tag
- Google Fonts via CDN link tag
- Background decorations via inline SVG
- shimmer effect via CSS @keyframes animation
