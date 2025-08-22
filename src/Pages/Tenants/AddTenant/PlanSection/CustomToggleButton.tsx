import { styled, Switch } from "@mui/material";

const CustomToggleButton = styled(Switch)(({ theme }) => ({
  width: 60, // Reduced width to match the smaller height
  height: 24, // Reduced height
  padding: 0,
  "& .MuiSwitch-switchBase": {
    margin: 0,
    padding: 2, // Adjusted padding to fit the smaller height
    width: "auto",
    transform: "translateX(0.25rem)", // Adjusted transform for the smaller size
    "&.Mui-checked": {
      transform: "translateX(2rem)", // Adjusted transform for the smaller size
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#ffffff",
        borderColor: "primary.switchBorder",
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#3366FF",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    backgroundColor: "#3366FF",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 24, // Adjusted border radius to match the new height
    border: "0.095rem solid #E0E0E0",
    backgroundColor: "#ffffff",
    opacity: 1,
    transition: theme.transitions.create(["background-color"]),
  },
}));

export default CustomToggleButton;
