let iframeApiPromise = null

function loadIframeApi() {
  if (iframeApiPromise) return iframeApiPromise
  iframeApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }
    window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return iframeApiPromise
}

export async function createPlayer(element, { onEnded, onError, onPlaying, onPaused }) {
  const YT = await loadIframeApi()

  return new Promise((resolve) => {
    const player = new YT.Player(element, {
      height: '100%',
      width: '100%',
      playerVars: { playsinline: 1 },
      events: {
        onReady: () => resolve(player),
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) onEnded()
          else if (event.data === YT.PlayerState.PLAYING) onPlaying()
          else if (event.data === YT.PlayerState.PAUSED) onPaused()
        },
        onError: () => onError(),
      },
    })
  })
}

export function loadVideo(player, videoId) {
  player.loadVideoById(videoId)
}

export function play(player) {
  player.playVideo()
}

export function pause(player) {
  player.pauseVideo()
}
