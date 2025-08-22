import { Box, Grid, Skeleton, Stack, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";

// Create pulse animation
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
`;

// Styled Skeleton component with animation
const AnimatedSkeleton = styled(Skeleton)(({ theme }) => ({
  animation: `${pulse} 1.5s ease-in-out infinite`,
  backgroundColor:
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.11)"
      : "rgba(255, 255, 255, 0.11)",
}));

// Styled Container for consistent spacing
const LoaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  "& .MuiSkeleton-root": {
    borderRadius: theme.shape.borderRadius,
  },
}));

const ChoosePlanLoader = () => {
  return (
    <LoaderContainer data-testid="choose-plan-loader">
      <Grid container spacing={4} rowSpacing={4}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
        >
          <Stack spacing={1} width="100%">
            <AnimatedSkeleton variant="text" width={100} height={20} />
            <AnimatedSkeleton variant="rounded" height={56} />
          </Stack>
        </Grid>
        {["plan-1", "plan-2", "plan-3"].map((planKey) => (
          <Grid
            item
            xs={12}
            sm={12}
            key={planKey}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Stack spacing={1} width="100%">
              <AnimatedSkeleton variant="text" width={100} height={20} />
              <AnimatedSkeleton variant="rounded" height={56} />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </LoaderContainer>
  );
};

export default ChoosePlanLoader;
