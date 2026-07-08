import json
import logging
import os
import random
import tempfile
import urllib.parse
import urllib.request

log = logging.getLogger(__name__)

_MUSIC_API = "https://pixabay.com/api/music/"


def fetch_random_track(genre: str = "ambient") -> str:
    """Download a random Pixabay music track and return a path to a temp MP3 file.
    Caller is responsible for deleting it.
    Raises RuntimeError if PIXABAY_API_KEY is not set or no tracks are found.
    """
    api_key = os.environ.get("PIXABAY_API_KEY", "")
    if not api_key:
        raise RuntimeError("PIXABAY_API_KEY env var is not set")

    params = urllib.parse.urlencode({"key": api_key, "genre": genre, "per_page": 20})
    url = f"{_MUSIC_API}?{params}"
    log.info("Fetching Pixabay music: %s", url.replace(api_key, "***"))

    req = urllib.request.Request(url, headers={"User-Agent": "saju-youtube-bot/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read()

    data = json.loads(raw)
    hits = data.get("hits", [])
    log.info("Pixabay response: total=%s hits=%s", data.get("total"), len(hits))

    if not hits:
        raise RuntimeError(
            f"No Pixabay tracks found for genre={genre!r}. "
            f"Raw response (first 500 chars): {raw[:500]}"
        )

    track = random.choice(hits)
    log.info("Track keys available: %s", list(track.keys()))

    audio_url = track.get("audio") or track.get("audioUrl") or track.get("url") or track.get("previewUrl")
    if not audio_url:
        raise RuntimeError(
            f"Could not find audio URL in track. Keys were: {list(track.keys())}. "
            f"Track data: {json.dumps(track)}"
        )

    log.info("Downloading audio from: %s", audio_url)
    fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
    os.close(fd)
    urllib.request.urlretrieve(audio_url, tmp_path)
    log.info("Audio saved to: %s (%d bytes)", tmp_path, os.path.getsize(tmp_path))
    return tmp_path
