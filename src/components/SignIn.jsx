import { useState } from 'react'
import { signIn } from '../auth/googleAuth'

export function SignIn({ onSignedIn }) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      await signIn()
      onSignedIn()
    } catch {
      setError('Sign-in was cancelled or failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sign-in">
      <h1>YouTube Playlist Player</h1>
      <button type="button" onClick={handleClick} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in with Google'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
