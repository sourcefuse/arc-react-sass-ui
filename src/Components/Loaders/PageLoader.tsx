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

interface PageLoaderProps {
  fieldCount: number;
  showButtons?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  fieldCount,
  showButtons = true,
}) => {
  return (
    <LoaderContainer data-testid="page-loader">
      <Grid container spacing={4} rowSpacing={4}>
        {[...Array(fieldCount)].map((_, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={`${index}-${fieldCount}`}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Stack spacing={1} width="100%">
              <AnimatedSkeleton variant="text" width={100} height={20} />
              <AnimatedSkeleton variant="rounded" height={56} />
            </Stack>
            {index === 5 && (
              <AnimatedSkeleton variant="circular" width={40} height={40} />
            )}
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
        >
          <Stack spacing={1} width="100%">
            <AnimatedSkeleton variant="text" width={100} height={20} />
            <AnimatedSkeleton variant="rounded" height={56} />
          </Stack>
        </Grid>
      </Grid>
      {showButtons && (
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
      )}
    </LoaderContainer>
  );
};

export default PageLoader;
