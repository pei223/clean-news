import { ThemeProvider, createTheme } from "@mui/material";
import { green, teal } from "@mui/material/colors";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import AppErrorFallback from "./AppErrorFallback";
import { SWRConfig } from "swr";
import { createContext, useState } from "react";

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
]);

interface AppContextType {
  developperMode: boolean;
  setDevelopperMode: (v: boolean) => void;
}

export const AppContext = createContext<AppContextType>({
  developperMode: false,
  setDevelopperMode: () => {},
});

function App() {
  const [developperMode, setDevelopperMode] = useState(false);

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
