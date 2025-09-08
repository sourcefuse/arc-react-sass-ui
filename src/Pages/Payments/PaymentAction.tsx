import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { CellContext } from "@tanstack/react-table";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import React from "react";
import { IBillingInvoice } from "redux/app/types/invoice.type";

interface ActionButtonsContainerProps {
  row: CellContext<IBillingInvoice, unknown>;
  handleDownload: (invoice: IBillingInvoice) => void;
}

export const ActionButtonsContainer: React.FC<ActionButtonsContainerProps> = ({
  row,
  handleDownload,
}) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      <PermissionWrapper
        requiredPermissions={[PermissionsEnum.DownloadInvoice]}
      >
        <Tooltip title="Download Invoice">
          <IconButton
            aria-label="download"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(row?.row?.original);
            }}
          >
            <SaveAltIcon />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>
    </Stack>
  );
};
