import "@/styles/Fonts.css";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { Routes } from "@/routes";
import { useColorScheme } from "@/hooks/useColorScheme";
import { darkTheme, lightTheme } from "@/constants/Theme";

export default function App() {
  const { scheme } = useColorScheme();

  return (
    <ThemeProvider theme={scheme == "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}
