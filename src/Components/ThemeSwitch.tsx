import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useThemeContext } from "Providers/theme/ThemeProvider";
import { memo } from "react";

const ThemeSwitch = () => {
  const theme = useTheme();
  const colorMode: { toggleColorMode: () => void } = useThemeContext();

  return (
    <Tooltip title="Theme Switch">
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default memo(ThemeSwitch);
