import { create } from "zustand";

export type ColorScheme = "light" | "dark";

type ColorSchemeProps = {
  scheme: ColorScheme;
};

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

darkModeMediaQuery.addEventListener("change", (e) => {
  changeColorScheme(e.matches ? "dark" : "light");
});

export const useColorScheme = create<ColorSchemeProps>(() => ({
  scheme: darkModeMediaQuery.matches ? "dark" : "light",
}));

export function changeColorScheme(scheme: ColorScheme) {
  useColorScheme.setState({
    scheme: scheme,
  });
}
