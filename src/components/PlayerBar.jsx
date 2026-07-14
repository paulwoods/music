import { useEffect, useRef } from 'react'
import { createPlayer, loadVideo, play, pause } from '../player/YouTubePlayer'
import { usePlayer } from '../state/PlayerContext'

export function PlayerBar() {
  const { state, dispatch } = usePlayer()
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const dispatchRef = useRef(dispatch)
  dispatchRef.current = dispatch

  useEffect(() => {
    let cancelled = false
    const mountNode = document.createElement('div')
    containerRef.current.appendChild(mountNode)
    createPlayer(mountNode, {
      onEnded: () => dispatchRef.current({ type: 'VIDEO_ENDED' }),
      onError: () => dispatchRef.current({ type: 'VIDEO_ERRORED' }),
      onPlaying: () => dispatchRef.current({ type: 'SET_PLAYING' }),
      onPaused: () => dispatchRef.current({ type: 'SET_PAUSED' }),
    }).then((player) => {
      if (cancelled) {
        player.destroy()
      } else {
        playerRef.current = player
      }
    })
    return () => {
      cancelled = true
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!playerRef.current || state.currentIndex === -1) return
    loadVideo(playerRef.current, state.queue[state.currentIndex].videoId)
  }, [state.currentIndex, state.queue])

  useEffect(() => {
    if (!playerRef.current || state.currentIndex === -1) return
    if (state.isPlaying) play(playerRef.current)
    else pause(playerRef.current)
  }, [state.isPlaying, state.currentIndex])

  const currentVideo = state.currentIndex !== -1 ? state.queue[state.currentIndex] : null

  return (
    <div className="player-bar">
      <div ref={containerRef} className="player-embed" />
      <div className="player-controls">
        <p className="now-playing-title">{currentVideo ? currentVideo.title : 'Nothing playing'}</p>
        <div className="controls">
          <button type="button" onClick={() => dispatch({ type: 'SKIP_PREV' })} disabled={!currentVideo}>
            ⏮ Prev
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_PLAY_PAUSE' })}
            disabled={!currentVideo}
          >
            {state.isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button type="button" onClick={() => dispatch({ type: 'SKIP_NEXT' })} disabled={!currentVideo}>
            ⏭ Next
          </button>
          <button
            type="button"
            className={state.repeatAll ? 'active' : ''}
            onClick={() => dispatch({ type: 'TOGGLE_REPEAT' })}
          >
            🔁 Repeat
          </button>
        </div>
      </div>
    </div>
  )
}
