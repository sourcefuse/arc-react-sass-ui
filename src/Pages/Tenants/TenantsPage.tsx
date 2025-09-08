import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Row } from "@tanstack/react-table";
import { Table } from "Components/Table";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  useLazyGetTenantLogsQuery,
  useLazyGetTenantsCountQuery,
  useLazyGetTenantsQuery,
  useStartProvisionMutation,
} from "redux/app/tenantManagementApiSlice";
import { TenantAndLogsDataType, TenantDataType } from "type/tenant.type";
import Button from "../../Components/Button";
import {
  buildFilters,
  Filter,
  FilterPopupState,
} from "../../Components/FilterPopup";
import {
  tenantStatusesAllowedForDirectProvisioning,
  tenantFilterConfig,
  tenantsSearchConfig,
  tenantTableColumns,
  getLogStatusColor,
} from "./tenants.utils";
import CustomModal from "Components/CustomModal";
import { TenantView } from "./TenantsView";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import { useFilteredPermissions } from "Hooks/useFilterByPermission";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import { Stack, Tooltip } from "@mui/material";
import ConfirmDialog from "Components/ConfirmDialog/ConfirmDialog";
import { PaymentMethodEnum } from "type";
import { RouteConstant } from "Constants/routeConstant";
import { TenantLogsType, TenantStatus } from "redux/app/types";
import { colors } from "Providers/theme/colors";
import groupBy from "lodash/groupBy";
import TenantLogsView from "./TenantLogsView";
import { Dictionary } from "@reduxjs/toolkit";
import ProvisioningStatusIcon from "../../Assets/ProvisionStatusIcon";
import CutOffIcon from "../../Assets/cut-off-icon.svg";
import TenantHistoryView from "./TenantHistoryView";
import HistoryIcon from "@mui/icons-material/History";
import { usePermission } from "Hooks/usePermission";
interface IActionButtonsProps {
  row: TenantAndLogsDataType;
  refreshTenants: () => void;
}

export const ActionButtons: React.FC<IActionButtonsProps> = ({
  row,
  refreshTenants,
}) => {
  const [isStartProvisionDialogOpen, setIsStartProvisionDialogOpen] =
    useState<boolean>(false);
  const [isTenantLogsDialogOpen, setIsTenantLogsDialogOpen] = useState(false);
  const [isTenantHistoryDialogOpen, setIsTenantHistoryDialogOpen] =
    useState(false);
  const [startProvision] = useStartProvisionMutation();
  const navigate = useNavigate();
  const handleEditBtn = useCallback(() => {
    navigate(RouteConstant.TENANTS_EDIT.replace(":id", row.tenantId));
  }, [navigate, row.tenantId]);

  const handleStartProvisioning = async (data: TenantDataType) => {
    setIsStartProvisionDialogOpen(false);
    await startProvision({
      tenantId: data.tenantId,
      transaction: {
        method: PaymentMethodEnum.Other,
        comment: "bypassing payment",
      },
    });
  };

  const toggleStartProvisionDialog = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setIsStartProvisionDialogOpen(!isStartProvisionDialogOpen);
  };
  const isStartProvisioningDisabled =
    !tenantStatusesAllowedForDirectProvisioning.includes(row.status);

  const handleTenantLogsViewClose = () => {
    setIsTenantLogsDialogOpen(false);
    refreshTenants();
  };

  const handleTenantLogsDialogOpen = () => {
    setIsTenantLogsDialogOpen(true);
  };

  return (
    <Stack
      justifyContent={"center"}
      display="flex"
      flexDirection={"row"}
      alignItems={"center"}
    >
      <PermissionWrapper requiredPermissions={[PermissionsEnum.UpdateTenant]}>
        <Tooltip title="Edit Tenant">
          <IconButton
            onClick={() => {
              handleEditBtn();
            }}
            disabled={row.status === TenantStatus.PROVISIONING}
          >
            <ModeEditOutlineOutlinedIcon
              style={
                row.status !== TenantStatus.PROVISIONING
                  ? { color: colors.text }
                  : {}
              }
            />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper
        requiredPermissions={[PermissionsEnum.StartProvisioning]}
      >
        <Tooltip title="Start Provisioning">
          <IconButton
            onClick={toggleStartProvisionDialog}
            disabled={isStartProvisioningDisabled}
            sx={{
              opacity: isStartProvisioningDisabled ? 0.5 : 1,
              pointerEvents: isStartProvisioningDisabled ? "none" : "auto",
            }}
          >
            <img
              src={CutOffIcon}
              alt="Convert Lead"
              style={{
                height: "1.4rem",
                width: "1.4rem",
              }}
            />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper requiredPermissions={[PermissionsEnum.ViewTenantLogs]}>
        <Tooltip title="View Logs">
          <IconButton onClick={handleTenantLogsDialogOpen}>
            <ProvisioningStatusIcon
              color={getLogStatusColor(row.logs?.[0]?.message?.stageStatus)}
            />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>
      <PermissionWrapper
        requiredPermissions={[PermissionsEnum.ViewTenantDeploymentHistory]}
      >
        <Tooltip title="View History">
          <IconButton onClick={() => setIsTenantHistoryDialogOpen(true)}>
            <HistoryIcon style={{ color: colors.text }} />
          </IconButton>
        </Tooltip>
      </PermissionWrapper>

      <ConfirmDialog
        title="Start Provisioning?"
        description="Are you sure you want to start provisioning for this tenant?"
        open={isStartProvisionDialogOpen}
        onClose={toggleStartProvisionDialog}
        onConfirm={() => handleStartProvisioning(row)}
      />
      {/* Logs modal */}
      <CustomModal
        open={isTenantLogsDialogOpen}
        onClose={handleTenantLogsViewClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        modalWidth={800}
      >
        <TenantLogsView
          logs={row.logs}
          handleClose={handleTenantLogsViewClose}
          tenantId={row.tenantId}
          name={row.tenantName}
        />
      </CustomModal>
      {/* History modal */}
      <CustomModal
        open={isTenantHistoryDialogOpen}
        onClose={() => setIsTenantHistoryDialogOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        modalWidth={900}
      >
        <TenantHistoryView
          tenantName={row.tenantName}
          tenantId={row.tenantId}
          handleClose={() => setIsTenantHistoryDialogOpen(false)}
        />
      </CustomModal>
    </Stack>
  );
};

function mergeTenantMessages(
  tenants: TenantDataType[],
  stageData: Dictionary<TenantLogsType[]>
): TenantAndLogsDataType[] {
  return tenants?.map((tenant) => {
    const logs =
      stageData[tenant.tenantId]?.map((entry) => ({
        message: entry.message,
        createdOn: entry.createdOn,
      })) || [];

    // Separate sort operation
    const sortedLogs = [...logs].sort((a, b) => {
      const dateA = new Date(b.createdOn).getTime();
      const dateB = new Date(a.createdOn).getTime();
      return dateA - dateB;
    });

    return {
      ...tenant,
      logs: sortedLogs,
    };
  });
}

const TenantsPage = () => {
  const params = useParams();
  const tenantId = params.id;
  const navigate = useNavigate();
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [finalFilter, setFinalFilter] = useState<FilterPopupState | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedTenant, setSelectedTenant] = useState<TenantDataType | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tenants, setTenants] = useState<TenantAndLogsDataType[]>([]);

  const [getTenants, { data: tenantsData, isError, isLoading }] =
    useLazyGetTenantsQuery();
  const [getTenantLogs, { data: tenantLogs }] = useLazyGetTenantLogsQuery();
  const [getTenantsCount, { data: tenantsCount }] =
    useLazyGetTenantsCountQuery();
  const hasViewTenantLogsPermission = usePermission([
    PermissionsEnum.ViewTenantLogs,
  ]);

  const refreshTenants = useCallback(() => {
    const filters: Filter[] = buildFilters(
      tenantsSearchConfig,
      finalFilter,
      searchFilter
    );

    getTenants({ filter: { where: { and: filters } }, limit, offset, sortBy });
    getTenantsCount({ where: { and: filters } });
    if (hasViewTenantLogsPermission) {
      getTenantLogs({});
    }
  }, [
    finalFilter,
    searchFilter,
    getTenants,
    limit,
    offset,
    sortBy,
    getTenantsCount,
    hasViewTenantLogsPermission,
    getTenantLogs,
  ]);

  const handleNavigateToAddTenant = () => {
    navigate("/tenants/create-tenant");
  };

  useEffect(() => {
    refreshTenants();
  }, [refreshTenants]);

  useEffect(() => {
    if (tenantId) {
      const tenantToView = tenants?.find((item) => item.tenantId === tenantId);
      if (tenantToView) {
        setSelectedTenant(tenantToView);
        setIsOpen(true);
      }
    }
  }, [tenantId, tenants]);

  useEffect(() => {
    setOffset(0);
  }, [searchFilter, finalFilter, sortBy]);

  const handleTenantViewClose = () => {
    // to clear the id from the url
    if (tenantId) {
      navigate(`/tenants`);
    }
    setIsOpen(false);
  };
  const createTenantPermission = [PermissionsEnum.CreateTenant];

  useEffect(() => {
    if (!isLoading) {
      const data = groupBy(tenantLogs, "tenantId");
      const merged = mergeTenantMessages(tenantsData ?? [], data);
      setTenants(merged);
    }
  }, [tenantsData, tenantLogs, isLoading]);

  const filteredTenantTableColumns = useFilteredPermissions(
    tenantTableColumns(refreshTenants)
  );

  return (
    <Box data-testid="tenants-page">
      <Table
        tableName={"Tenants"}
        columns={filteredTenantTableColumns}
        data={tenants || []}
        enablePagination
        enableGlobalFiltering
        globalFilterPlaceholder="Search tenant"
        headerBtnName="Add Tenant"
        headerBtnEndIcon={<AddOutlinedIcon />}
        handleHeaderBtnClick={handleNavigateToAddTenant}
        isTableLoading={isLoading}
        isErrorLoading={isError}
        headerBtnPermissions={createTenantPermission}
        noDataView={
          <PermissionWrapper requiredPermissions={createTenantPermission}>
            <Button
              variant="outlined"
              onClick={handleNavigateToAddTenant}
              data-testid="add-tenant-btn"
            >
              Add Tenant
            </Button>
          </PermissionWrapper>
        }
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        filterConfig={tenantFilterConfig}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        count={Number(tenantsCount?.count) || 0}
        manualPagination={true}
        handleRowClick={(row: Row<TenantDataType>) => {
          setSelectedTenant(row.original);
          setIsOpen(true);
        }}
        enableSorting={true}
        handleSortColumnChange={setSortBy}
      />
      {selectedTenant && (
        <CustomModal
          open={isOpen}
          onClose={handleTenantViewClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          modalWidth={900}
        >
          <TenantView
            tenant={selectedTenant}
            handleCloseModal={handleTenantViewClose}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default TenantsPage;
