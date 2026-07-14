# YouTube Playlist Player

A personal web app that signs in with your Google account, lists your YouTube playlists, and plays through them jukebox-style. See [CONTEXT.md](./CONTEXT.md) for domain vocabulary and [docs/adr](./docs/adr) for the design decisions behind it.

## One-time Google Cloud setup

You need an OAuth Client ID before the app can authenticate. This is a manual, one-time setup in Google Cloud Console — it can't be scripted since it requires signing in with your own Google account.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or pick an existing one).
2. Go to **APIs & Services → Library**, search for **YouTube Data API v3**, and click **Enable**.
3. Go to **APIs & Services → OAuth consent screen**.
   - User type: **External**.
   - Fill in the required app name/support email fields.
   - Publishing status: leave it as **Testing** (this is what keeps the app personal — no Google verification review needed).
   - Under **Test users**, add your own Google account email.
   - Add the scope `.../auth/youtube.readonly` under **Scopes**.
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**.
   - Under **Authorized JavaScript origins**, add `http://localhost:5173` (Vite's default dev port).
   - Save, then copy the generated **Client ID**.
5. Copy `.env.local.example` to `.env.local` and paste your Client ID:
   ```
   cp .env.local.example .env.local
   ```

## Running the app

```
npm install
npm run dev
```

Open the printed `localhost` URL and sign in with the Google account you added as a test user.

## Architecture

- No backend — a pure client-side React SPA. Auth happens via Google Identity Services' browser-only OAuth token flow.
- Playback happens via YouTube's IFrame Player API (an embedded player), since the Data API only returns metadata, not video streams.
- Access token lives in `sessionStorage`; when it expires (~1 hour), you'll be prompted to sign in again.

Full reasoning for these choices is recorded in [docs/adr](./docs/adr).
