import json
import os
import random
import tempfile
import urllib.parse
import urllib.request

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
    req = urllib.request.Request(
        f"{_MUSIC_API}?{params}",
        headers={"User-Agent": "saju-youtube-bot/1.0"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read())

    hits = data.get("hits", [])
    if not hits:
        raise RuntimeError(f"No Pixabay tracks found for genre={genre!r}")

    track = random.choice(hits)
    audio_url = track.get("audio") or track.get("audioUrl") or track.get("url")
    if not audio_url:
        raise RuntimeError(f"Could not find audio URL in Pixabay response: {list(track.keys())}")

    fd, tmp_path = tempfile.mkstemp(suffix=".mp3")
    os.close(fd)
    urllib.request.urlretrieve(audio_url, tmp_path)
    return tmp_path
