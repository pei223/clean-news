import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import NoAuthenticatedLayout from '../components/NoAuthenticatedLayout'
import LoadingScreen from '../components/common/LoadingScreen'
import { isCredentialError, isFirebaseError } from '../utils/firebase-errors'
import { auth } from '../firebase'

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const onLogin = async () => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (e) {
      if (!isFirebaseError(e)) {
        enqueueSnackbar(`unexpected error: ${e}`, { variant: 'error' })
        return
      }
      if (isCredentialError(e)) {
        enqueueSnackbar('認証情報が正しくありません', { variant: 'warning' })
        return
      }
      enqueueSnackbar(`unexpected firebase error: ${e}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <NoAuthenticatedLayout>
      <Typography variant="h5">ログイン</Typography>
      <Box sx={{ marginTop: 4 }}>
        <TextField
          id="email"
          label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <TextField
          label="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Button onClick={onLogin} variant="contained">
          ログイン
        </Button>
      </Box>
      {loading && <LoadingScreen />}
    </NoAuthenticatedLayout>
  )
}
export default LoginPage
