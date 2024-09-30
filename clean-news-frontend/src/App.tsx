import { ThemeProvider, createTheme } from '@mui/material'
import { green, teal } from '@mui/material/colors'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { IndexPage } from './pages'
import { SnackbarProvider } from 'notistack'
import { ErrorBoundary } from 'react-error-boundary'
import AppErrorFallback from './AppErrorFallback'
import { SWRConfig } from 'swr'
import { useState } from 'react'
import LoginPage from './pages/login'
import { User } from 'firebase/auth'
import RequireAuth from './components/common/RequireAuth'
import { AppContext } from './stores/appContext'
import { useAuthEffect } from './hooks/common/auth'
import LoadingScreen from './components/common/LoadingScreen'

const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: teal[800],
    },
    secondary: {
      main: green[500],
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <IndexPage />
      </RequireAuth>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
    handle: {},
  },
])

function App() {
  const [developperMode, setDevelopperMode] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userInitialized, setUserInitialized] = useState(false)

  useAuthEffect({ setUser, setUserInitialized })

  return (
    <ThemeProvider theme={theme}>
      <SWRConfig>
        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          autoHideDuration={3000}
        >
          <AppContext.Provider
            value={{
              developperMode,
              setDevelopperMode,
              user,
            }}
          >
            <ErrorBoundary FallbackComponent={AppErrorFallback}>
              {userInitialized ? <RouterProvider router={router} /> : <LoadingScreen />}
            </ErrorBoundary>
          </AppContext.Provider>
        </SnackbarProvider>
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
