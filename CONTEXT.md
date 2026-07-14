# YouTube Playlist Player

A personal web app that authenticates against a user's own Google/YouTube account, lists their playlists, and plays through selected videos jukebox-style.

## Language

**Playlist**:
A named, ordered collection of videos owned by the authenticated user's YouTube account, fetched via the YouTube Data API v3.

**Video**:
A single playable YouTube item within a Playlist, identified by its YouTube video ID. Playback happens via an embedded IFrame Player, not a downloaded/extracted stream.
_Avoid_: Track, song — not every video is music, and "track" implies audio-only which this app doesn't do.

**Queue**:
The ordered sequence of Videos currently lined up for playback: always exactly one Playlist's videos, in that Playlist's order, starting from whichever Video the user clicked. Distinct from the Playlist itself — the Queue is live playback state (current position), the Playlist is the source data from YouTube. Cross-playlist or ad-hoc queues are explicitly out of scope for now.

**Now Playing**:
The single Video currently loaded in the player. Advances automatically to the next Video in the Queue when playback ends.

**Unavailable Video**:
A playlist entry that cannot be played — either a deleted/private placeholder returned by the API at list-time (filtered out of the Video list entirely), or a video whose owner has disabled embedding, which surfaces as a player error at play-time and triggers an automatic skip to the next Video in the Queue.
