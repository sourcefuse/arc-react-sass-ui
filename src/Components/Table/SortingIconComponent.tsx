import { IconButton } from "@mui/material";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import StraightRoundedIcon from "@mui/icons-material/StraightRounded";

interface ISortingIconComponentProps {
  direction: string | boolean;
  handleTrigger: ((event: unknown) => void) | undefined;
  className?: string;
}
const SortingIconComponent: React.JSXElementConstructor<
  ISortingIconComponentProps
> = ({ direction, handleTrigger, className }) => {
  return (
    <IconButton
      className={className}
      onClick={handleTrigger}
      disableRipple
      sx={{ m: 0, p: 0 }}
    >
      {typeof direction === "string" ? (
        <StraightRoundedIcon fontSize="small" />
      ) : (
        <SwapVertRoundedIcon fontSize="small" />
      )}
    </IconButton>
  );
};

export default SortingIconComponent;
