import { createTheme, responsiveFontSizes } from "@mui/material";

export const lightTheme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: "NotoSansKR",
    },
    palette: {
      mode: "light",
    },
  })
);

export const darkTheme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: "NotoSansKR",
    },
    palette: {
      mode: "dark",
    },
  })
);
