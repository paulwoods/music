# Build as a pure client-side SPA — no backend server

This is a personal, single-user tool (see consent-screen decision in Testing mode). Google's Identity Services JS library supports an OAuth token flow that runs entirely in the browser, with no client secret and no server-side token exchange — the browser gets an access token directly and calls the YouTube Data API v3 via `fetch`.

We chose not to add a backend. A server would let us custody the access token server-side (marginally safer against XSS), but for a single-user tool granting only read access to one person's own playlists, that protection isn't worth doubling the deployment surface (build + host + run a server) for a personal project. If multi-user support or server-side data storage becomes a real requirement later, this decision should be revisited — it will require rearchitecting the auth flow, not just adding a route.
