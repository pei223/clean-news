import { ThemeProvider, createTheme } from "@mui/material";
import { green, teal } from "@mui/material/colors";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import AppErrorFallback from "./AppErrorFallback";
import { SWRConfig } from "swr";
import { createContext, useState } from "react";
import LoginPage from "./pages/login";
import { User } from "firebase/auth";

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
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

interface AppContextType {
  developperMode: boolean;
  setDevelopperMode: (v: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AppContext = createContext<AppContextType>({
  developperMode: false,
  setDevelopperMode: () => {},
  user: null,
  setUser: () => {},
});

function App() {
  const [developperMode, setDevelopperMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <SWRConfig>
        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          autoHideDuration={3000}
        >
          <AppContext.Provider
            value={{
              developperMode,
              setDevelopperMode,
              user,
              setUser,
            }}
          >
            <ErrorBoundary FallbackComponent={AppErrorFallback}>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </AppContext.Provider>
        </SnackbarProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}

export default App;
