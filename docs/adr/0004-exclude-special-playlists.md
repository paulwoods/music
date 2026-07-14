# Only list the user's regular (self-created) playlists — exclude Watch Later and Liked Videos

The YouTube Data API v3's `playlistItems.list` explicitly does not support listing items from the Watch Later playlist (it returns an `invalidValue` 400 error) — this is a hard platform limitation, not a bug we can work around. Liked Videos isn't a real playlist from the API's perspective either; its videos come from a different endpoint (`videos.list?myRating=like`), not `playlistItems.list`.

We fetch playlists via `playlists.list?mine=true`, which returns only the user's own created playlists — Watch Later and Liked Videos never appear. We deliberately did not special-case Liked Videos in (which would require a second, differently-shaped fetch path just for that one entry). If Liked Videos support is wanted later, it needs its own fetch/display logic distinct from the regular Playlist → Queue flow.
