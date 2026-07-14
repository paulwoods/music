const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly'
const TOKEN_STORAGE_KEY = 'yt_access_token'

let tokenClient = null
let gisLoadPromise = null

function loadGisScript() {
  if (gisLoadPromise) return gisLoadPromise
  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'))
    document.head.appendChild(script)
  })
  return gisLoadPromise
}

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

export function clearStoredToken() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function signIn() {
  await loadGisScript()

  return new Promise((resolve, reject) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error))
          return
        }
        sessionStorage.setItem(TOKEN_STORAGE_KEY, response.access_token)
        resolve(response.access_token)
      },
      error_callback: (error) => {
        reject(new Error(error.type || 'Sign-in failed'))
      },
    })
    tokenClient.requestAccessToken()
  })
}

export function signOut() {
  const token = getStoredToken()
  clearStoredToken()
  if (!token) return

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = 'https://oauth2.googleapis.com/revoke'
  const tokenField = document.createElement('input')
  tokenField.type = 'hidden'
  tokenField.name = 'token'
  tokenField.value = token
  form.appendChild(tokenField)
  form.style.display = 'none'
  document.body.appendChild(form)

  fetch(form.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `token=${encodeURIComponent(token)}`,
  }).finally(() => form.remove())
}
