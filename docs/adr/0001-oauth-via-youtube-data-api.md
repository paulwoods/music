# Authenticate via OAuth 2.0 against the YouTube Data API v3, not credential-based login

We need the app to access a user's YouTube playlists and video data. The tempting literal reading of "log into a user's YouTube page" is to accept the user's Google credentials directly (or drive a headless browser session against youtube.com). We rejected this: it violates Google's Terms of Service, triggers bot/CAPTCHA defenses, requires us to handle raw Google passwords (a serious liability), and breaks whenever YouTube's markup changes.

Instead, the app uses Google's OAuth 2.0 flow — the user grants a scoped permission (e.g. `youtube.readonly`) via Google's own consent screen — and all data access goes through the official YouTube Data API v3. The app never sees the user's password.
