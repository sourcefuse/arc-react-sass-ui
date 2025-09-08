import { FormHelperText } from "@mui/material";

export interface AnyErrorObj {
  [key: string]: any; // NOSONAR
}

export const FormHelperTextComponent: React.FC<{
  isError: boolean;
  errorMessage?: string | AnyErrorObj;
  helperText?: string;
}> = ({ isError, errorMessage, helperText }) => {
  const renderErrorMsg = isError ? <>{errorMessage}</> : helperText;
  return isError || helperText ? (
    <FormHelperText>{renderErrorMsg}</FormHelperText>
  ) : null;
};
