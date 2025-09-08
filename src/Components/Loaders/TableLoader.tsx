import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface ITableLoaderProps {
  hasHeader?: boolean;
}
const TableRowLoader = () => (
  <Stack p={3} display="flex" flexDirection="row" justifyContent="space-evenly">
    {[...Array(6)].map((_, idx) => {
      const uniqueKey = `skeleton-cell-${idx}`;
      return (
        <Skeleton key={uniqueKey} variant="rounded" width={120} height={20} />
      );
    })}
  </Stack>
);

const TableLoader: React.FC<ITableLoaderProps> = ({ hasHeader = true }) => {
  return (
    <Box data-testid="skeleton-loader">
      {hasHeader && (
        <Paper data-testid="skeleton-header">
          <Stack p={2} justifyContent="space-between" flexDirection="row">
            <Skeleton variant="rounded" width={210} height={40} />
            <Box display="flex" flexDirection="row" gap={1}>
              <Skeleton variant="rounded" width={210} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Stack>
        </Paper>
      )}

      <Paper sx={{ marginBlock: 2 }}>
        <TableRowLoader />
        <Divider sx={{ marginInline: 2 }} />
        {[...Array(6)].map((_, idx) => {
          const uniqueKey = `skeleton-cell-${idx}`;
          return <TableRowLoader key={uniqueKey} />;
        })}
        <Box minHeight={80} />
      </Paper>
    </Box>
  );
};

export default TableLoader;
