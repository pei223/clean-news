import { useEffect, useState } from 'react'
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
  const [emailErrorMsg, setEmailErrorMsg] = useState('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const disableSubmit =
    email === '' || password === '' || emailErrorMsg !== '' || passwordErrorMsg !== ''

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

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setEmail(e.target.value)
    if (text === '') {
      setEmailErrorMsg('emailを入力してください')
      return
    }
    if (text.length > 255) {
      setEmailErrorMsg('emailは255文字以内で入力してください')
      return
    }
    setEmailErrorMsg('')
  }

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setPassword(text)
    if (text === '') {
      setPasswordErrorMsg('パスワードを入力してください')
      return
    }
    if (text.length > 30) {
      setPasswordErrorMsg('パスワードは30文字以内で入力してください')
      return
    }
    setPasswordErrorMsg('')
  }

  const onFormKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disableSubmit && e.key === 'Enter') {
      onLogin()
    }
  }

  return (
    <NoAuthenticatedLayout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: 'auto',
          }}
        >
          <Typography variant="h5" component="h1">
            ログイン
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              id="email"
              label="email"
              type="email"
              size="small"
              sx={{
                minWidth: '350px',
              }}
              value={email}
              error={emailErrorMsg !== ''}
              helperText={emailErrorMsg}
              onChange={onEmailChange}
              onKeyDown={onFormKeyDown}
            />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              id="password"
              label="password"
              type="password"
              size="small"
              sx={{
                minWidth: '350px',
              }}
              value={password}
              error={passwordErrorMsg !== ''}
              helperText={passwordErrorMsg}
              onChange={onPasswordChange}
              onKeyDown={onFormKeyDown}
            />
          </Box>
          <Box sx={{ marginTop: 4 }}>
            <Button
              sx={{
                minWidth: '350px',
              }}
              variant="contained"
              disabled={disableSubmit}
              onClick={onLogin}
            >
              ログイン
            </Button>
          </Box>
        </Box>
      </Box>
      {loading && <LoadingScreen />}
    </NoAuthenticatedLayout>
  )
}
export default LoginPage
