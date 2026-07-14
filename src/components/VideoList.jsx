import { useEffect, useState } from 'react'
import { fetchPlaylistVideos, AuthError } from '../api/youtube'
import { usePlayer } from '../state/PlayerContext'

export function VideoList({ playlistId, onAuthError }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { state, dispatch } = usePlayer()

  useEffect(() => {
    if (!playlistId) return
    setLoading(true)
    setError(null)
    fetchPlaylistVideos(playlistId)
      .then(setVideos)
      .catch((err) => {
        if (err instanceof AuthError) onAuthError()
        else setError('Could not load videos.')
      })
      .finally(() => setLoading(false))
  }, [playlistId, onAuthError])

  if (!playlistId) return <p className="status">Select a playlist.</p>
  if (loading) return <p className="status">Loading videos…</p>
  if (error) return <p className="status error">{error}</p>
  if (videos.length === 0) return <p className="status">This playlist has no playable videos.</p>

  return (
    <ul className="video-list">
      {videos.map((video, index) => {
        const isNowPlaying = state.playlistId === playlistId && state.currentIndex === index
        return (
          <li key={`${video.videoId}-${index}`}>
            <button
              type="button"
              className={isNowPlaying ? 'now-playing' : ''}
              onClick={() =>
                dispatch({ type: 'PLAY_VIDEO', videos, startIndex: index, playlistId })
              }
            >
              {video.title}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
