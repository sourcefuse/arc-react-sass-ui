import {
  Box,
  CardHeader,
  Divider,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import { useLazyGetTenantHistoryQuery } from "redux/app/tenantManagementApiSlice";
import { useEffect } from "react";
import { TransformedTenantHistory } from "redux/app/types/tenant-history.type";
import { convertToDate } from "Helpers/utils";
import StatusChip from "Components/StatusChip/StatusChip";
import { colors } from "Providers/theme/colors";

type Props = {
  tenantName: string;
  tenantId: string;
  handleClose: () => void;
};

const TenantHistoryView: React.FC<Props> = ({
  tenantName,
  tenantId,
  handleClose,
}) => {
  const [trigger, { data }] = useLazyGetTenantHistoryQuery();

  useEffect(() => {
    if (tenantId) {
      trigger(tenantId);
    }
  }, [tenantId, trigger]);

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
        title={`Tenant Deployment History - ${tenantName}`}
        action={
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        sx={{ boxShadow: "none", px: 0, py: 1 }}
      />
      <Divider />
      {data?.length ? (
        <Box sx={{ py: "1rem" }}>
          {data.map((log: TransformedTenantHistory) => (
            <Typography
              key={log.provisionStartOn}
              sx={{ mb: "1rem", fontSize: "0.875rem" }}
            >
              Tenant provisioning started at{" "}
              <strong>
                {convertToDate(log.provisionStartOn, "yyyy-MM-dd HH:mm")}
              </strong>
              {log.status && (
                <>
                  {" and "}
                  <StatusChip
                    label={
                      log.status.toLowerCase().includes("success")
                        ? "completed"
                        : "failed"
                    }
                    color={
                      log.status.toLowerCase().includes("success")
                        ? colors.success
                        : colors.warning
                    }
                  />
                </>
              )}
              {log.provisionEndOn && (
                <span style={{ marginLeft: "0.2rem" }}>
                  at{" "}
                  <strong>
                    {convertToDate(log.provisionEndOn, "yyyy-MM-dd HH:mm")}
                  </strong>
                </span>
              )}
              {" with "}
              {log.presignedUrl ? (
                <Link
                  href={log.presignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  style={{ marginRight: "0.5rem" }}
                  download
                >
                  features
                </Link>
              ) : (
                "features"
              )}
            </Typography>
          ))}
        </Box>
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

export default TenantHistoryView;
