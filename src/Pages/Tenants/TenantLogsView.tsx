import { Box, CardHeader, Divider, IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import StatusChip from "Components/StatusChip/StatusChip";
import { colors } from "Providers/theme/colors";
import { Log } from "type/tenant.type";
import { convertToDate } from "Helpers/utils";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLazyGetTenantLogsQuery } from "redux/app/tenantManagementApiSlice";
import { useEffect, useState } from "react";
import { TenantLogsType } from "redux/app/types";

interface ITenantLogsViewProps {
  tenantId: string;
  name: string;
  logs?: Log[];
  handleClose: () => void;
}

export const getLogStatusColor = (status?: string): string => {
  const statusColorMap: Record<string, string> = {
    completed: `${colors.active}`,
    started: `${colors.pendingProvision}`,
    failed: `${colors.provisioningFailed}`,
    aborted: `${colors.provisioningFailed}`,
    default: `${colors.inactiveGray}`,
  };
  return statusColorMap[status ?? "Default"] || colors.inactiveGray;
};
const TenantLogsView: React.FC<ITenantLogsViewProps> = ({
  tenantId,
  name,
  logs,
  handleClose,
}) => {
  const [getTenantLogs, { data: tenantLogs, isLoading }] =
    useLazyGetTenantLogsQuery();
  const [provisionLogs, setProvisionLogs] = useState(logs);

  useEffect(() => {
    if (!isLoading && tenantLogs?.length) {
      const logArr: Log[] =
        tenantLogs.map((entry: TenantLogsType) => ({
          message: entry.message,
          createdOn: entry.createdOn,
        })) || [];
      const sortLogFunc = (a: Log, b: Log) =>
        new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
      const sortedLogs = [...logArr].sort(sortLogFunc);
      setProvisionLogs(sortedLogs);
    }
  }, [isLoading, tenantId, tenantLogs]);
  return (
    <Card
      sx={{
        minWidth: "100%",
        border: "none",
        boxShadow: "none",
        maxHeight: "40rem",
        overflow: "auto",
        margin: 0,
        px: 1,
      }}
      data-testid="tenant-logs-view"
    >
      <CardHeader
        title={
          <>
            <span style={{ marginRight: "0.313rem" }}>
              Provisioning Logs - {name}
            </span>
            <IconButton
              onClick={() =>
                getTenantLogs({
                  filter: {
                    where: {
                      and: [{ tenantId }],
                    },
                  },
                })
              }
            >
              <RefreshIcon />
            </IconButton>
          </>
        }
        action={
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        sx={{ boxShadow: "none", px: 0, py: 1 }}
      />
      <Divider />
      {provisionLogs?.length ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 0.5rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Timestamp</th>
              <th style={{ textAlign: "left" }}>Stage Name</th>
              <th style={{ textAlign: "left" }}>Stage Status</th>
            </tr>
          </thead>
          <tbody>
            {provisionLogs.map((log: Log) => (
              <tr
                key={`${log.createdOn}-${log.message.stageName}`}
                style={{ fontSize: "0.875rem" }}
              >
                <td style={{ textAlign: "left" }}>
                  [{convertToDate(log.createdOn, "yyyy-MM-dd HH:mm")}]
                </td>
                <td style={{ textAlign: "left" }}>{log.message.stageName}</td>
                <td style={{ textAlign: "left" }}>
                  <StatusChip
                    label={log.message.stageStatus}
                    color={getLogStatusColor(
                      log.message.stageStatus.toLowerCase()
                    )}
                    minWidth="5.25rem"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "center",
            p: 4,
          }}
        >
          No logs to display
        </Box>
      )}
    </Card>
  );
};

export default TenantLogsView;
