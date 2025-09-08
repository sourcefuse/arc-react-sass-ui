import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { CellContext, Row } from "@tanstack/react-table";
import { buildFilters, FilterPopupState } from "Components/FilterPopup";
import { Table } from "Components/Table";
import { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import {
  useLazyGetPlansCountQuery,
  useLazyGetPlansQuery,
} from "redux/app/tenantManagementApiSlice";
import {
  getManagePlanTableColumns,
  planFilterConfig,
  planSearchConfig,
} from "./PlanPage.utils";
import { Box, Tooltip } from "@mui/material";
import { ManagePlanDataType } from "type";
import { colors } from "../../Providers/theme/colors";
import { useNavigate } from "react-router";
import { RouteConstant } from "Constants/routeConstant";
import { useFilteredPermissions } from "Hooks/useFilterByPermission";
import { PermissionsEnum } from "Constants/enums";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import { BlockOutlined } from "@mui/icons-material";
import ConfirmDialog from "Components/ConfirmDialog/ConfirmDialog";
import { useUpdatePlanAsSuspendMutation } from "redux/app/plansApiSlice";
import { useSnackbar } from "notistack";
import { PlanStatus } from "redux/app/types";
import CustomModal from "Components/CustomModal";
import PlanView from "./PlanIViewDetail/PlanView";
import { PermissionWrapper } from "Components/PermissionWrapper";

interface IActionButtonsContainerProps {
  row: CellContext<ManagePlanDataType, unknown>;
  handleSuspension: (plan: ManagePlanDataType) => void;
}

export const ActionButtonsContainer: React.FC<IActionButtonsContainerProps> = ({
  row,
  handleSuspension,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {
    row: { original },
  } = row;
  const navigate = useNavigate();
  const handlePlanEdit = useCallback(
    (originalArg: { id: string }) => {
      navigate(
        RouteConstant.CONFIGURATION_PLAN_EDIT.replace(":id", originalArg.id)
      );
    },
    [navigate]
  );

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Fragment>
      <Stack direction="row" justifyContent="center">
        <PermissionWrapper requiredPermissions={[PermissionsEnum.UpdatePlan]}>
          <Tooltip title="Edit Plan">
            <IconButton
              aria-label="edit"
              onClick={() => handlePlanEdit(original)}
              disabled={
                original.isCustomPlan ||
                original.status === PlanStatus.SUSPENDED
              }
            >
              <EditOutlinedIcon
                style={
                  !original.isCustomPlan &&
                  original.status !== PlanStatus.SUSPENDED
                    ? { color: colors.text }
                    : {}
                }
              />
            </IconButton>
          </Tooltip>
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={[PermissionsEnum.UpdatePlan]}>
          <Tooltip title="Suspend Plan">
            <IconButton
              aria-label="suspend"
              onClick={toggle}
              disabled={original.status === PlanStatus.SUSPENDED}
            >
              <BlockOutlined
                style={
                  original.status === PlanStatus.ACTIVE
                    ? { color: colors.destructive }
                    : {}
                }
              />
            </IconButton>
          </Tooltip>
        </PermissionWrapper>
      </Stack>
      <ConfirmDialog
        title="Suspend Plan ?"
        description="Are you sure, you want to suspend this plan ?"
        open={isDialogOpen}
        onClose={toggle}
        onConfirm={() => {
          handleSuspension(original);
        }}
      />
    </Fragment>
  );
};

const PlansPage = () => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [finalFilter, setFinalFilter] = useState<FilterPopupState | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [getPlansCount, { data: response }] = useLazyGetPlansCountQuery();
  const [getPlans, { data: plans, isError, isLoading }] =
    useLazyGetPlansQuery();
  const navigate = useNavigate();
  const [updatePlan] = useUpdatePlanAsSuspendMutation();
  const { enqueueSnackbar } = useSnackbar();

  // Memoize computed filters to prevent unnecessary recalculations
  const filters = useMemo(
    () => buildFilters(planSearchConfig, finalFilter, searchFilter),
    [finalFilter, searchFilter]
  );

  useEffect(() => {
    if (!filters) return;

    getPlans({ filter: { where: { and: filters } }, limit, offset, sortBy });
    getPlansCount({ where: { and: filters } });
  }, [filters, limit, offset, getPlans, getPlansCount, sortBy]);

  useEffect(() => {
    setOffset((prevOffset) => (prevOffset !== 0 ? 0 : prevOffset));
  }, [searchFilter, finalFilter, sortBy]);

  const handleNavigateToAddPlan = useCallback(() => {
    navigate(RouteConstant.CONFIGURATION_PLANS_CREATE);
  }, [navigate]);

  const handleSuspension = async (plan: ManagePlanDataType) => {
    try {
      await updatePlan({ id: plan.id }).unwrap();
      enqueueSnackbar("Plan Suspended Successfully", { variant: "success" });
      getPlans({ filter: { where: { and: filters } }, limit, offset });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };
  const managePlanTableColumns = getManagePlanTableColumns(handleSuspension);
  const filteredManagePlanTableColumns = useFilteredPermissions(
    managePlanTableColumns
  );

  const handlePlanViewModalClose = () => {
    setIsOpen(false);
  };
  return (
    <Box data-testid="plan-page">
      <Table
        tableName="Plans"
        columns={filteredManagePlanTableColumns}
        headerBtnName="Add Plan"
        headerBtnEndIcon={<AddOutlinedIcon />}
        handleHeaderBtnClick={handleNavigateToAddPlan}
        globalFilterPlaceholder="Search plan"
        data={plans || []}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        count={Number(response?.count) || 0}
        headerBtnPermissions={[PermissionsEnum.CreatePlan]}
        manualPagination
        enablePagination
        enableGlobalFiltering
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        filterConfig={planFilterConfig}
        isTableLoading={isLoading}
        isErrorLoading={isError}
        enableSorting={true}
        handleSortColumnChange={setSortBy}
        handleRowClick={(row: Row<ManagePlanDataType>) => {
          setSelectedPlanId(row.original.id);
          setIsOpen(true);
        }}
      />
      {selectedPlanId && (
        <CustomModal
          open={isOpen}
          handleClose={handlePlanViewModalClose}
          modalWidth={800}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <PlanView
            planId={selectedPlanId}
            handleCloseModal={handlePlanViewModalClose}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default PlansPage;
