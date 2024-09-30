import { createContext } from 'react'
import { User } from 'firebase/auth'

interface AppContextType {
  developperMode: boolean
  setDevelopperMode: (v: boolean) => void
  user: User | null
}

export const AppContext = createContext<AppContextType>({
  developperMode: false,
  setDevelopperMode: () => {},
  user: null,
})
