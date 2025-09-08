import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";

interface IInfoTooltipProps extends Omit<TooltipProps, "children"> {
  // Add any additional props if needed
}
const InfoTooltip: React.FC<IInfoTooltipProps> = ({ ...rest }) => {
  return (
    <Tooltip {...rest}>
      <IconButton disableRipple>
        <HelpRoundedIcon sx={{ color: "secondary.main" }} fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;
