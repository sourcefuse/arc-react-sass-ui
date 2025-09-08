import { Box, Grid, Stack, Typography } from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StatsCard from "./Components/StatsCard/StatsCard";
import { colors } from "Providers/theme/colors";
import PageHeader from "Components/PageHeader";
import { Table } from "Components/Table";
import { dashboardTableColumns, supportData } from "./dashboard.utils";
import Button from "Components/Button";
import CustomPieChart from "Components/CustomPieChart/CustomPieChart";
import {
  useGetPlansCountQuery,
  useGetTenantsCountQuery,
  useGetTenantsQuery,
  useGetTopSubscribedPlansQuery,
} from "redux/app/tenantManagementApiSlice";
import { useNavigate } from "react-router";
import { dashboardStyles } from "./dashboard.styles";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import { TenantDataType } from "type/tenant.type";
import { Row } from "@tanstack/react-table";
import ActivePlansIcon from "../../Assets/active-plans-icon.png";
import { useQueryHookWithPermission } from "Hooks/useQueryHookWithPermission";

const STATUSES = {
  PLAN_SUSPENDED: "1",
  TENANT_INACTIVE: "5",
};
const Dashboard = () => {
  const navigate = useNavigate();
  const { data: tenantsCount, isLoading: isLoadingTenantsCount } =
    useQueryHookWithPermission(
      [PermissionsEnum.ViewTenant],
      useGetTenantsCountQuery,
      {
        where: { and: [{ status: { nin: [STATUSES.TENANT_INACTIVE] } }] }, // only added status for inactive as decommissioned does not exist.
      }
    );
  const { data: plansCount, isLoading: isLoadingPlansCount } =
    useQueryHookWithPermission(
      [PermissionsEnum.ViewPlan],
      useGetPlansCountQuery,
      {
        where: { and: [{ status: { nin: [STATUSES.PLAN_SUSPENDED] } }] },
      }
    );
  const { data: topSubscribedPlans } = useQueryHookWithPermission(
    [PermissionsEnum.ViewSubscription],
    useGetTopSubscribedPlansQuery,
    undefined,
    {}
  );

  const {
    data: tenantsData,
    isLoading: isTenantsLoading,
    isError: isTenantsError,
  } = useQueryHookWithPermission(
    [PermissionsEnum.ViewTenant],
    useGetTenantsQuery,
    {
      filter: { where: { and: [] } },
      limit: 3,
      offset: 0,
    }
  );

  const handleNavigateToTenantDialog = (id: string) => {
    navigate(`/tenants/${id}`);
  };
  const handleNavigateToTenantListing = () => {
    navigate("/tenants");
  };
  const handleNavigateToPlansListing = () => {
    navigate("/configuration/plans");
  };
  return (
    <Grid container data-testid="HomePage" sx={dashboardStyles.pageContainer}>
      <Box sx={dashboardStyles.backgroundBox}>
        <PageHeader pageName="Dashboard" />
      </Box>
      <Box sx={dashboardStyles.mainContainer}>
        <Box sx={dashboardStyles.leftContainer}>
          <Stack sx={dashboardStyles.statsStack}>
            <PermissionWrapper
              requiredPermissions={[PermissionsEnum.ViewTenant]}
            >
              <StatsCard
                dataValue={`${tenantsCount?.count ?? "NA"}`}
                dataLabel="Tenants"
                icon={
                  <PeopleAltOutlinedIcon
                    sx={dashboardStyles.statsIcon(colors.yellow ?? "#FFD700")}
                  />
                }
                iconBgColor={colors.yellow40 ?? "#FFD700"}
                isLoading={isLoadingTenantsCount}
                handleClick={handleNavigateToTenantListing}
              />
            </PermissionWrapper>
            <PermissionWrapper requiredPermissions={[PermissionsEnum.ViewPlan]}>
              <StatsCard
                dataValue={`${plansCount?.count ?? "NA"}`}
                dataLabel="Active Plans"
                icon={<img src={ActivePlansIcon} alt="active-plans" />}
                iconBgColor={colors.teal40 ?? "#008080"}
                isLoading={isLoadingPlansCount}
                handleClick={handleNavigateToPlansListing}
              />
            </PermissionWrapper>
          </Stack>
          <PermissionWrapper requiredPermissions={[PermissionsEnum.ViewTenant]}>
            <Stack sx={dashboardStyles.recentTableStack}>
              <Typography sx={dashboardStyles.recentTitle}>Recent</Typography>
              <Table
                data-testid="tenants-table"
                data={tenantsData ?? []}
                columns={dashboardTableColumns}
                tablePropsObject={{
                  tableContainerProps: { sx: dashboardStyles.recentTable },
                }}
                isTableLoading={isTenantsLoading}
                isErrorLoading={isTenantsError}
                handleRowClick={(row: Row<TenantDataType>) => {
                  handleNavigateToTenantDialog(row.original.tenantId);
                }}
              />
              <Stack sx={dashboardStyles.recentBtnStack}>
                <Button
                  sx={dashboardStyles.recentBtn}
                  endIcon={
                    <ChevronRightOutlinedIcon
                      sx={dashboardStyles.recentBtnIcon}
                    />
                  }
                  onClick={handleNavigateToTenantListing}
                >
                  View More
                </Button>
              </Stack>
            </Stack>
          </PermissionWrapper>
        </Box>
        <Box sx={dashboardStyles.graphsSection}>
          <Stack sx={dashboardStyles.graphContainer}>
            <Typography>Support Tickets</Typography>
            <CustomPieChart data={supportData} />
          </Stack>
          <Stack sx={dashboardStyles.graphContainer}>
            <Typography>Popular Plans</Typography>
            <CustomPieChart data={topSubscribedPlans ?? []} height={250} />
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
};

export default Dashboard;
