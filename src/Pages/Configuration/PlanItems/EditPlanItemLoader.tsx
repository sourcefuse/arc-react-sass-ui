import { Box, Grid, Paper, Skeleton, Stack, keyframes } from "@mui/material";
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
  }
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

const EditPlanItemLoader = () => {
  return (
    <LoaderContainer>
      {/* Breadcrumb Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AnimatedSkeleton variant="text" width={60} />
          <AnimatedSkeleton variant="text" width={20} />
          <AnimatedSkeleton variant="text" width={80} />
          <AnimatedSkeleton variant="text" width={20} />
          <AnimatedSkeleton variant="text" width={100} />
        </Stack>
      </Box>

      <Box sx={{ maxWidth: "md", mx: "auto", my: 4 }}>
        <Paper
          elevation={6}
          sx={{
            mb: 2,
            borderRadius: 4,
            p: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(0, 0, 0, 0.8)",
          }}
        >
          <Grid container spacing={4} rowSpacing={4}>
            {/* Form Fields */}
            {[
              { id: "field1", width: 80, height: 20, fieldHeight: 56 },
              { id: "field2", width: 70, height: 20, fieldHeight: 56 },
              { id: "field3", width: 90, height: 20, fieldHeight: 56 },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.id}>
                <Stack spacing={1}>
                  <AnimatedSkeleton
                    variant="text"
                    width={field.width}
                    height={field.height}
                  />
                  <AnimatedSkeleton
                    variant="rounded"
                    height={field.fieldHeight}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>

          {/* Buttons */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <AnimatedSkeleton variant="rounded" width={130} height={50} />
            <AnimatedSkeleton variant="rounded" width={130} height={50} />
          </Box>
        </Paper>
      </Box>
    </LoaderContainer>
  );
};

export default EditPlanItemLoader;
