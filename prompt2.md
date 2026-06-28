# saju.card — Second Batch Content Generation (Week 06~10)

Use the exact same design rules, font rotation, template rotation, color themes, copy tone, and technical requirements as the first batch prompt.

---

## Key Differences from First Batch

- Output folders: `week06/` through `week10/`
- File IDs start from 36 (e.g., `week06/36_eulmokilgan.html`)
- **Append** new entries to existing `queue.json` and `captions.json` — do NOT overwrite them
- Continue font/template rotation from where the first batch left off (no repeating same font/template consecutively across batches)

---

## Folder Structure

```
saju-posts/
├── week06/   (topics 36~42)
├── week07/   (topics 43~49)
├── week08/   (topics 50~56)
├── week09/   (topics 57~63)
├── week10/   (topics 64~70)
```

---

## Topic List (Korean — use exactly as written)

### week06
36. 천을귀인 + 문창귀인 동시에 있으면 생기는 일
37. 공망살 있는 사람이 종교/철학에 빠지는 이유
38. 괴강살 있는 사람이 연애를 어려워하는 이유
39. 양인살 있는 사람 직업 궁합 총정리
40. 화개살 + 도화살 동시에 있으면?
41. 귀문관살 있는 사람 수면 패턴이 남다른 이유
42. 백호살 운에서 만나면 조심해야 할 것들

### week07
43. 식신 있는 사람이 요식업/크리에이터에 많은 이유
44. 편관 있는 사람이 번아웃에 취약한 이유
45. 상관 있는 사람이 유독 직장 상사와 부딪히는 이유
46. 정인 있는 사람이 공부를 평생 놓지 못하는 이유
47. 비견 많은 사주 — 동업하면 안 되는 이유
48. 편재 있는 사람이 고정 수입보다 사업을 선호하는 이유
49. 관성 없는 사주 — 조직 생활이 유독 힘든 이유

### week08
50. 을목 일간 — 유연한 척하지만 절대 안 꺾이는 사람
51. 정화 일간 — 주변을 따뜻하게 하다가 혼자 꺼져버리는 사람
52. 무토 일간 — 다 받아줄 것 같지만 한계가 있는 사람
53. 신금 일간 — 완벽주의자인데 자기 자신에게 제일 가혹한 사람
54. 계수 일간 — 섬세하고 눈치 빠른데 상처도 잘 받는 사람
55. 갑목 vs 을목 — 같은 목인데 왜 이렇게 다른가
56. 병화 vs 정화 — 같은 화인데 왜 이렇게 다른가

### week09
57. 일주가 충(沖)인 커플 — 싸워도 못 떠나는 이유
58. 월주 궁합이 중요한 이유
59. 사주 궁합 볼 때 진짜 봐야 할 것 3가지
60. 오행이 서로 보완되는 커플 특징
61. 천간합 이루는 커플 — 운명처럼 끌리는 조합
62. 인신충 궁합 — 끊임없이 자극하는 조합
63. 사주로 보는 오래 못 가는 커플 패턴

### week10
64. 내 사주로 보는 최적 기상 시간
65. 오행별 추천 직업 총정리
66. 사주로 보는 나한테 맞는 운동 스타일
67. 대운 바뀌기 전에 해야 할 것들
68. 사주로 보는 돈 모이지 않는 습관
69. 올해 木 운이 강한 사람 주의사항
70. 사주 공부 처음 시작하는 사람을 위한 로드맵

---

## queue.json Append Format

Load the existing `saju-posts/queue.json`, parse it, and push new entries starting from id 36:

```json
{
  "id": 36,
  "week": "week06",
  "filename": "week06/36_chuneulgwiyin_munchang.html",
  "topic": "천을귀인 + 문창귀인 동시에 있으면 생기는 일",
  "status": "pending",
  "scheduled_date": null,
  "posted_date": null,
  "instagram_post_id": null
}
```

Then write the full merged array back to `queue.json`.
Do the same for `captions.json`.

---

## Execution Order

1. Create week06~week10 folders inside `saju-posts/`
2. Generate HTML files in order (36 → 70)
3. Write caption for each file immediately after generating it
4. After all 35 files, load existing queue.json and captions.json, append new entries, and save
5. Final report: list all files created, font/template combinations used

## Progress Reporting

After each file: `[N/35] filename.html — template: X, font: Y, theme: Z`
