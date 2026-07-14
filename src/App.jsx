import { useCallback, useState } from 'react'
import { getStoredToken, signOut } from './auth/googleAuth'
import { PlayerProvider } from './state/PlayerContext'
import { SignIn } from './components/SignIn'
import { PlaylistList } from './components/PlaylistList'
import { VideoList } from './components/VideoList'
import { PlayerBar } from './components/PlayerBar'
import './App.css'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(() => Boolean(getStoredToken()))
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)

  const handleAuthError = useCallback(() => {
    setIsSignedIn(false)
  }, [])

  function handleSignOut() {
    signOut()
    setIsSignedIn(false)
    setSelectedPlaylistId(null)
  }

  if (!isSignedIn) {
    return <SignIn onSignedIn={() => setIsSignedIn(true)} />
  }

  return (
    <PlayerProvider>
      <div className="app">
        <header className="app-header">
          <h1>YouTube Playlist Player</h1>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </header>
        <div className="app-body">
          <PlaylistList
            selectedId={selectedPlaylistId}
            onSelect={setSelectedPlaylistId}
            onAuthError={handleAuthError}
          />
          <VideoList playlistId={selectedPlaylistId} onAuthError={handleAuthError} />
        </div>
        <PlayerBar />
      </div>
    </PlayerProvider>
  )
}

export default App
