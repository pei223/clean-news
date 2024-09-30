import { User } from 'firebase/auth'
import { auth } from '../../firebase'
import { useEffect } from 'react'

interface Args {
  setUser: (user: User | null) => void
  setUserInitialized: (initialized: boolean) => void
}

export const useAuthEffect = ({ setUser, setUserInitialized }: Args) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user)
      setUserInitialized(true)
      if (!user) {
        setUser(null)
        return
      }
      setUser(user)
    })
    return unsubscribe
  }, [setUser])
}
