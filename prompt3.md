# saju.card — Quick Batch (10 posts for manual upload)

Use the exact same design rules as the main master prompt.
Generate 10 self-contained HTML files in a single folder.

---

## Output Folder

```
saju-posts/quick10/
├── 01_gwimunshinsal_cheonjae.html
├── 02_sikshin_money.html
├── 03_ilgan_test.html
├── 04_daeun_change.html
├── 05_bigyeon_friend.html
├── 06_yeokmasal_work.html
├── 07_gongmangsal_love.html
├── 08_ohaeng_personality.html
├── 09_jeongkwan_vs_pyeonkwan.html
├── 10_saju_mbti.html
```

Do NOT modify existing queue.json or captions.json.
Instead, create a new file: `saju-posts/quick10/captions.json`

---

## Design Rules (same as master prompt — summary)

- Card size: 360×640px
- Top padding: minimum 60px / Bottom padding: minimum 80px
- No card border — glow box-shadow on inner boxes only
- Bright text colors always
- No unnecessary lines
- All copy in Korean only
- No heteronormative language
- Title = hook (make reader feel "that's literally me")
- Header font: rotate between `Black Han Sans`, `Gasoek One`, `Gugi`
- Body font: `Noto Sans KR`
- Template: rotate between numbered list / left accent line / grid / full-bleed typo
- Color theme: match to topic category
- Background SVG: stars + crescent moon + thematic decoration + shimmer animation
- Footer: `@saju.card` bottom-right, small and faint
- Fact-check 3 times before writing each card

---

## Topic List

### 반응 잘 나올 주제 10개 (저장률/공유율 높은 것 위주)

1. **귀문관살 있는 사람이 천재인 이유**
   - 카테고리: 신살 / 색상: 딥 퍼플
   - 훅: "머리가 좋은 게 아니라 귀문관살이다"

2. **식신 있는 사람이 돈 걱정 없는 이유**
   - 카테고리: 십성 / 색상: 골드
   - 훅: "굶어 죽을 사주가 아니라는 게 이런 뜻이다"

3. **내 일간으로 보는 번아웃 유형**
   - 카테고리: 일간 / 색상: 다크 네이비
   - 훅: "번아웃 이유가 일간마다 다르다"

4. **대운 바뀌면 진짜 인생이 바뀌나?**
   - 카테고리: 실용 / 색상: 인디고
   - 훅: "10년이 한 번에 바뀌는 게 맞다"

5. **비견 많은 사람이 혼자 있고 싶은 이유**
   - 카테고리: 십성 / 색상: 다크 네이비
   - 훅: "외로운 게 아니라 비견이 많아서다"

6. **역마살 있는 사람이 이직을 반복하는 이유**
   - 카테고리: 신살 / 색상: 블루
   - 훅: "의지 문제가 아니라 역마살이다"

7. **공망살 있는 사람의 연애 패턴**
   - 카테고리: 신살·연애 / 색상: 로즈
   - 훅: "잡힐 듯 잡히지 않는 사람의 정체"

8. **오행으로 보는 내 성격 한 줄 요약**
   - 카테고리: 실용 / 색상: 오행별 그라디언트
   - 훅: "목화토금수 — 한 줄로 설명되는 내 성격"

9. **정관 vs 편관 — 직장생활 스타일이 이렇게 다르다**
   - 카테고리: 십성 / 색상: 다크 네이비
   - 훅: "같은 관인데 왜 이렇게 다른가"

10. **사주가 MBTI보다 정확한 이유**
    - 카테고리: 실용 / 색상: 골드
    - 훅: "MBTI는 내가 답하지만 사주는 하늘이 정한다"

---

## captions.json Format (quick10 전용)

```json
[
  {
    "id": 1,
    "filename": "01_gwimunshinsal_cheonjae.html",
    "topic": "귀문관살 있는 사람이 천재인 이유",
    "caption": "full caption...",
    "hashtags": "#귀문관살 #사주 ..."
  }
]
```

---

## Caption Rules

Same as master prompt:
- Hook first line
- 3~5 line summary
- 만세력 앱 안내
- `@@야 너 이거 아니야? 🫵` 태그 유도
- 10~12 hashtags (2 large + 4 medium + 4 small)

---

## Execution Order

1. Create `saju-posts/quick10/` folder
2. Generate 10 HTML files in order
3. Write caption immediately after each HTML
4. Save `saju-posts/quick10/captions.json`
5. Final report: list files + font/template combos used

## Progress Reporting

`[N/10] filename.html — template: X, font: Y, theme: Z`
