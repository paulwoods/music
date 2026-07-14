import { useEffect, useState } from 'react'
import { fetchPlaylists, AuthError } from '../api/youtube'

export function PlaylistList({ selectedId, onSelect, onAuthError }) {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPlaylists()
      .then(setPlaylists)
      .catch((err) => {
        if (err instanceof AuthError) onAuthError()
        else setError('Could not load playlists.')
      })
      .finally(() => setLoading(false))
  }, [onAuthError])

  if (loading) return <p className="status">Loading playlists…</p>
  if (error) return <p className="status error">{error}</p>
  if (playlists.length === 0) return <p className="status">No playlists found.</p>

  return (
    <ul className="playlist-list">
      {playlists.map((playlist) => (
        <li key={playlist.id}>
          <button
            type="button"
            className={playlist.id === selectedId ? 'selected' : ''}
            onClick={() => onSelect(playlist.id)}
          >
            {playlist.title} <span className="count">({playlist.videoCount})</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
