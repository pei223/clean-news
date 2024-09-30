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
import { AppContext } from './stores/appContext'

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
    element: <IndexPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])

function App() {
  const [developperMode, setDevelopperMode] = useState(false)
  const [user, setUser] = useState<User | null>(null)

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
              <RouterProvider router={router} />
            </ErrorBoundary>
          </AppContext.Provider>
        </SnackbarProvider>
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
