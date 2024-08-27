import { ThemeProvider, createTheme } from "@mui/material";
import { green, teal } from "@mui/material/colors";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import AppErrorFallback from "./AppErrorFallback";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={3000}
      >
        <ErrorBoundary FallbackComponent={AppErrorFallback}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
