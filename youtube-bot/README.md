# YouTube Shorts Auto-Poster

## Overview

This bot reads `saju-posts/queue.json`, converts each image into a 1080×1920 MP4 Short using ffmpeg, uploads it to YouTube via the Data API v3, and marks the item as posted by committing the updated `queue.json` back to the repo. Everything runs inside GitHub Actions — no local installs, no extra services.

---

## Setup Checklist

- [x] 1. Create a Google Cloud project and enable YouTube Data API v3
- [x] 2. Create OAuth 2.0 credentials (client ID + secret)
- [x] 3. Configure the OAuth consent screen and add yourself as a test user
- [ ] 4. Run the one-time auth flow locally to get `token.json`
- [ ] 5. Add three secrets to the GitHub repo
- [ ] 6. Push — the workflow runs automatically every 4 hours

---

## Step 1–3 — Google Cloud (already done)

You already have a Google Cloud project with OAuth credentials. Skip to Step 4.

If you ever need to redo this:
- Enable **YouTube Data API v3** under APIs & Services → Library
- Create an **OAuth 2.0 Client ID** (Desktop app type) under APIs & Services → Credentials
- Add yourself as a test user under APIs & Services → OAuth consent screen

---

## Step 4 — One-Time Auth Flow

This generates `token.json`, which the bot uses to upload on your behalf. You only do this once.

Install the dependencies locally just for this step (or skip if already installed):

```bash
pip install google-auth-oauthlib google-api-python-client python-dotenv
```

Create a minimal `.env` in `youtube-bot/`:

```
YOUTUBE_CLIENT_ID=<your client ID>
YOUTUBE_CLIENT_SECRET=<your client secret>
```

Then run:

```bash
cd youtube-bot
python app.py --auth
```

What happens:
1. A Google authorization URL is printed. Open it in your browser.
2. Sign in as the test user you added in Step 3.
3. Click **Advanced → Go to saju-bot (unsafe)** → **Allow**.
4. Copy the code shown and paste it back into the terminal.
5. `token.json` is saved in `youtube-bot/`.

---

## Step 5 — Add GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**.

Add these three secrets:

| Secret name | Value |
|---|---|
| `YOUTUBE_CLIENT_ID` | your Google OAuth client ID |
| `YOUTUBE_CLIENT_SECRET` | your Google OAuth client secret |
| `YOUTUBE_TOKEN_JSON` | the full contents of `token.json` (paste the entire JSON string) |

To get the token contents:

```bash
cat youtube-bot/token.json
```

Copy the entire output and paste it as the secret value.

---

## Step 6 — Push and You're Done

Push to GitHub. The workflow at `.github/workflows/post-short.yml` runs automatically every 4 hours.

After each successful upload:
- `saju-posts/queue.json` is updated: the item's `status` changes from `"pending"` to `"posted"` and `posted_date` is set.
- The change is committed back to the repo automatically.

---

## Dry Run (test without uploading)

Go to **Actions → Post YouTube Short → Run workflow**. The `dry_run` toggle defaults to **true** — this builds the MP4 and logs success without uploading anything to YouTube. No YouTube credentials are used.

---

## Adding New Items

Edit `saju-posts/queue.json`, add entries with `"status": "pending"` and a valid `png_path`, and push to GitHub. The bot picks the next pending item each run.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `YOUTUBE_CLIENT_ID` | Yes (live) | — | Google OAuth 2.0 client ID |
| `YOUTUBE_CLIENT_SECRET` | Yes (live) | — | Google OAuth 2.0 client secret |
| `OAUTH_TOKEN_PATH` | No | `token.json` | Path to the OAuth token file |
| `ITEMS_JSON` | No | `../saju-posts/queue.json` | Path to queue JSON |
| `AUDIO_DIR` | No | `./audio` | Folder of royalty-free audio tracks |
| `SHORT_DURATION_SECS` | No | `7` | Duration of each Short in seconds |
| `SAJU_BASE_DIR` | No | — | Set to `$GITHUB_WORKSPACE` in Actions to remap local png_path values |
| `DRY_RUN` | No | `false` | `true` = build MP4 but skip YouTube upload |

---

## Quota Notes

YouTube Data API v3 gives **10,000 units per day**. One video upload costs ~1,600 units → up to **6 uploads per day**. With 56 items at 4-hour intervals, the queue runs for ~9 days within the free quota.

To increase quota: **APIs & Services → Quotas** in Google Cloud Console.

---

## Token Expiry

The `token.json` stored in GitHub Secrets contains a refresh token that does not expire (unless you revoke access). The bot auto-refreshes the short-lived access token on each run. You should not need to redo Step 4.

If you ever see `Token refresh failed` in the Actions log, re-run Step 4 and update the `YOUTUBE_TOKEN_JSON` secret.
