# Player is a persistent app-level bar, not a per-view/page player

Clicking a video does not navigate to a dedicated player screen. Instead, a persistent player bar (Queue, Now Playing, play/pause/skip/repeat controls) stays visible while the user keeps browsing other playlists — matching how dedicated music apps behave, and enabling the "start something playing, then keep browsing" use case that a jukebox-style tool needs.

Consequence: Queue and Now Playing must live in app-level state (not state scoped to a single view/route), since the player has to keep running and stay visible regardless of which playlist the user is currently looking at.
