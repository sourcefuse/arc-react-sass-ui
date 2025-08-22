import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import useContextWrapper from "Hooks/useContextWrapper";
import { createContext, ReactNode, useMemo } from "react";
import { commonConfig, paletteConfig } from "./default";

interface IThemeContext {
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<IThemeContext | null>(null);

export const useThemeContext = () =>
  useContextWrapper(ThemeContext, {
    contextName: useThemeContext.name,
    providerName: ThemeProvider.name,
  });

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        // this is intentional
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          ...paletteConfig.light,
        },
        ...commonConfig,
      }),
    []
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
