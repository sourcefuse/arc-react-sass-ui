import { CircularProgress, Stack } from "@mui/material";

const CircularLoader = () => {
  return (
    <Stack
      sx={{ height: "100%", p: 10 }}
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress
        data-testid="circular-progress"
        sx={{ color: "secondary.main" }}
      />
      ;
    </Stack>
  );
};

export default CircularLoader;
