import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { errorStyles } from "./error.styles";

interface IProps {
  errorMsg?: string;
}

const ErrorView = (props: IProps) => {
  const { errorMsg = "Error Fetching Data. Please Try Refreshing." } = props;
  return (
    <Box sx={errorStyles.container} data-testid="table-error">
      <Paper sx={errorStyles.paper}>
        <Box sx={errorStyles.contentBox}>
          <ErrorOutlineOutlinedIcon sx={errorStyles.icon} />
          <Typography sx={errorStyles.text}>{errorMsg}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorView;
