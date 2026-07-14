import { createContext, useContext, useReducer } from 'react'
import { playerReducer, initialState } from './playerReducer'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState)
  return <PlayerContext.Provider value={{ state, dispatch }}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider')
  return context
}
