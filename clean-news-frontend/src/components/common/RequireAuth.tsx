import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NoAuthenticatedLayout from '../NoAuthenticatedLayout'
import LoadingScreen from './LoadingScreen'
import { AppContext } from '../../stores/appContext'

type Props = {
  children?: React.ReactNode
}

function RequireAuth({ children }: Props) {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user == null) {
      navigate('/login')
    }
  }, [navigate, user])

  if (user == null) {
    return (
      <NoAuthenticatedLayout>
        <LoadingScreen />
      </NoAuthenticatedLayout>
    )
  }
  return <>{children}</>
}

export default RequireAuth
