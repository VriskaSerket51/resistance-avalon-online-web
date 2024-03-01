import { create } from "zustand";

import * as Storage from "@/utils/Storage";

type ColorSchemeProps = {
  scheme: Storage.ColorScheme;
};

export const useColorScheme = create<ColorSchemeProps>(() => ({
  scheme: Storage.getColorScheme(),
}));

export function changeColorScheme(scheme: Storage.ColorScheme) {
  useColorScheme.setState({
    scheme: scheme,
  });
  Storage.setColorScheme(scheme);
}
