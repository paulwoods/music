export const initialState = {
  queue: [],
  playlistId: null,
  currentIndex: -1,
  isPlaying: false,
  repeatAll: false,
}

function advance(state, direction) {
  if (state.queue.length === 0) return state

  let nextIndex = state.currentIndex + direction
  if (nextIndex < 0) {
    nextIndex = 0
  } else if (nextIndex >= state.queue.length) {
    if (!state.repeatAll) {
      return { ...state, isPlaying: false }
    }
    nextIndex = 0
  }

  return { ...state, currentIndex: nextIndex, isPlaying: true }
}

export function playerReducer(state, action) {
  switch (action.type) {
    case 'PLAY_VIDEO':
      return {
        ...state,
        queue: action.videos,
        playlistId: action.playlistId,
        currentIndex: action.startIndex,
        isPlaying: true,
      }
    case 'SKIP_NEXT':
    case 'VIDEO_ENDED':
    case 'VIDEO_ERRORED':
      return advance(state, 1)
    case 'SKIP_PREV':
      return advance(state, -1)
    case 'TOGGLE_REPEAT':
      return { ...state, repeatAll: !state.repeatAll }
    case 'TOGGLE_PLAY_PAUSE':
      if (state.currentIndex === -1) return state
      return { ...state, isPlaying: !state.isPlaying }
    case 'SET_PLAYING':
      return { ...state, isPlaying: true }
    case 'SET_PAUSED':
      return { ...state, isPlaying: false }
    default:
      return state
  }
}
