import { getStoredToken, clearStoredToken } from '../auth/googleAuth'

const API_BASE = 'https://www.googleapis.com/youtube/v3'

class AuthError extends Error {}

async function apiGet(path, params) {
  const token = getStoredToken()
  const url = new URL(`${API_BASE}/${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401) {
    clearStoredToken()
    throw new AuthError('Access token expired or invalid')
  }
  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export { AuthError }

export async function fetchPlaylists() {
  const playlists = []
  let pageToken

  do {
    const data = await apiGet('playlists', {
      part: 'snippet,contentDetails',
      mine: 'true',
      maxResults: '50',
      ...(pageToken ? { pageToken } : {}),
    })
    playlists.push(
      ...data.items.map((item) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails?.default?.url ?? null,
        videoCount: item.contentDetails.itemCount,
      }))
    )
    pageToken = data.nextPageToken
  } while (pageToken)

  return playlists
}

export async function fetchPlaylistVideos(playlistId) {
  const items = []
  let pageToken

  do {
    const data = await apiGet('playlistItems', {
      part: 'snippet',
      playlistId,
      maxResults: '50',
      ...(pageToken ? { pageToken } : {}),
    })
    items.push(...data.items)
    pageToken = data.nextPageToken
  } while (pageToken)

  return items
    .filter((item) => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video')
    .map((item) => ({
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails?.default?.url ?? null,
    }))
}
