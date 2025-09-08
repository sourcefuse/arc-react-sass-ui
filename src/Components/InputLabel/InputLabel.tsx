import MuiInputLabel, {
  InputLabelProps as MuiInputLabelProps,
} from "@mui/material/InputLabel";
import { ReactNode } from "react";

interface InputLabelProps extends MuiInputLabelProps {
  children: ReactNode;
  htmlFor?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({
  children,
  htmlFor,
  ...rest
}) => (
  <MuiInputLabel shrink variant="standard" htmlFor={htmlFor} {...rest}>
    {children}
  </MuiInputLabel>
);

export default InputLabel;
