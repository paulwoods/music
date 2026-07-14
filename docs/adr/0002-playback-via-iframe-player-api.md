# Play videos via the YouTube IFrame Player API, not extracted media streams

The YouTube Data API v3 returns only metadata — it does not expose a video/audio stream URL, and there is no ToS-compliant way to extract one. The only supported playback path is embedding YouTube's own player via the IFrame Player API: the app renders an `<iframe src="youtube.com/embed/{videoId}">` and drives it (play/pause/seek/auto-advance) through YouTube's postMessage-based JS API.

Consequence: playback is subject to the video owner's embedding permissions — some private/unlisted or embed-disabled videos may refuse to play inside our player. This is a platform constraint, not a bug in our app.
