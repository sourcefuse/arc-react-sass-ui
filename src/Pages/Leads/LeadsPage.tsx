import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { CellContext, Row } from "@tanstack/react-table";
import { buildFilters } from "Components/FilterPopup/Filter.utils";
import { FilterPopupState } from "Components/FilterPopup/FilterPopup";
import { Table } from "Components/Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useLazyGetLeadsCountQuery,
  useLazyGetLeadsQuery,
  useUpdateLeadAsConfirmedMutation,
  useUpdateLeadAsInvalidMutation,
} from "redux/app/tenantManagementApiSlice";
import { LeadDataType } from "type";
import {
  disableLeadAction,
  filterConfig,
  leadTableColumns,
  searchConfig,
} from "./LeadsPage.utils";
import Icon from "../../Assets/lead-cta-icon.svg";
import CustomModal from "Components/CustomModal";
import { LeadView } from "./LeadsView";
import { useNavigate } from "react-router";
import ConfirmDialog from "Components/ConfirmDialog/ConfirmDialog";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "Providers/theme/colors";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import { useFilteredPermissions } from "Hooks/useFilterByPermission";

interface IActionButtonsProps {
  row: CellContext<LeadDataType, unknown>;
  refreshLeads: () => void;
}
export const LeadActionButtons: React.FC<IActionButtonsProps> = ({
  row,
  refreshLeads,
}) => {
  const {
    row: { original },
  } = row;
  const navigate = useNavigate();
  const [isConvertDialogOpen, setIsConvertDialogOpen] =
    useState<boolean>(false);
  const [isInvalidDialogOpen, setIsInvalidDialogOpen] =
    useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [updateLeadAsConfirmed] = useUpdateLeadAsConfirmedMutation();
  const [updateLeadAsInvalid] = useUpdateLeadAsInvalidMutation();

  const handleConvertLead = async (data: LeadDataType) => {
    try {
      setIsConvertDialogOpen(false);
      navigate(`/tenants/create-tenant/${data.leadId}`);
      await updateLeadAsConfirmed({ leadId: data.leadId });
    } catch (error) {}
  };

  const handleInvalidateLead = async (data: LeadDataType) => {
    try {
      setIsInvalidDialogOpen(false);
      await updateLeadAsInvalid({ leadId: data.leadId });
      enqueueSnackbar("Lead marked as invalid successfully!", {
        variant: "success",
      });
      refreshLeads();
    } catch (error) {}
  };

  const toggleConvertDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsConvertDialogOpen(!isConvertDialogOpen);
  };

  const toggleInvalidDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsInvalidDialogOpen(!isInvalidDialogOpen);
  };

  const isLeadActionButtonDisable = disableLeadAction.includes(original.status);

  return (
    <Stack
      justifyContent={"center"}
      display="flex"
      flexDirection={"row"}
      alignItems={"center"}
    >
      <PermissionWrapper requiredPermissions={[PermissionsEnum.CreateTenant]}>
        <Tooltip title="Convert Lead">
          <IconButton
            onClick={toggleConvertDialog}
            disabled={isLeadActionButtonDisable}
            sx={{
              opacity: isLeadActionButtonDisable ? 0.5 : 1,
              pointerEvents: isLeadActionButtonDisable ? "none" : "auto",
            }}
          >
            <img
              src={Icon}
              alt="Convert Lead"
              style={{
                height: "1.4rem",
                width: "1.4rem",
              }}
            />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={[PermissionsEnum.UpdateLead]}>
        <Tooltip title="Invalid Lead">
          <IconButton
            onClick={toggleInvalidDialog}
            disabled={isLeadActionButtonDisable}
            sx={{
              opacity: isLeadActionButtonDisable ? 0.5 : 1,
              pointerEvents: isLeadActionButtonDisable ? "none" : "auto",
            }}
          >
            <CloseIcon fontSize="medium" sx={{ color: colors.secondary }} />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>

      <ConfirmDialog
        title="Convert lead to tenant?"
        description="Are you sure you want to convert this lead to a tenant?"
        open={isConvertDialogOpen}
        onClose={toggleConvertDialog}
        onConfirm={() => handleConvertLead(original)}
      />

      <ConfirmDialog
        title="Mark lead as invalid?"
        description="Are you sure you want to mark this lead as invalid?"
        open={isInvalidDialogOpen}
        onClose={toggleInvalidDialog}
        onConfirm={() => handleInvalidateLead(original)}
      />
    </Stack>
  );
};

const LeadsPage = () => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [finalFilter, setFinalFilter] = useState<FilterPopupState | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<LeadDataType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [getLeadsCount, { data: response }] = useLazyGetLeadsCountQuery();
  const [getLeads, { data: leads, isError, isLoading }] =
    useLazyGetLeadsQuery();

  const filters = useMemo(
    () => buildFilters(searchConfig, finalFilter, searchFilter),
    [finalFilter, searchFilter]
  );

  const refreshLeads = useCallback(() => {
    getLeads({ filter: { where: { and: filters } }, limit, offset, sortBy });
    getLeadsCount({ where: { and: filters } });
  }, [limit, offset, filters, getLeads, getLeadsCount, sortBy]);

  useEffect(() => {
    refreshLeads();
  }, [refreshLeads]);

  useEffect(() => {
    setOffset(0);
  }, [finalFilter, searchFilter, sortBy]);

  return (
    <Box data-testid="lead-page">
      <Table
        tableName="Leads"
        columns={useFilteredPermissions(leadTableColumns(refreshLeads))}
        data={leads || []}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        count={Number(response?.count) || 0}
        manualPagination={true}
        enablePagination
        enableGlobalFiltering
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        globalFilterPlaceholder="Search lead"
        filterConfig={filterConfig}
        isTableLoading={isLoading}
        isErrorLoading={isError}
        handleRowClick={(row: Row<LeadDataType>) => {
          setSelectedLead(row.original);
          setIsOpen(true);
        }}
        enableSorting={true}
        handleSortColumnChange={setSortBy}
      />
      {selectedLead && (
        <CustomModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          modalWidth={700}
        >
          <LeadView
            lead={selectedLead}
            handleCloseModal={() => {
              setIsOpen(false);
            }}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default LeadsPage;
