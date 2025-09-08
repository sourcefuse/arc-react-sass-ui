import { RouteConstant } from "Constants/routeConstant";
import { PermissionsEnum } from "Constants/enums/permissions";
import { lazy } from "react";

const FeaturesPage = lazy(() => import("Pages/Features/FeaturesPage"));
const LeadsPage = lazy(() => import("Pages/Leads/LeadsPage"));
const TenantsPage = lazy(() => import("Pages/Tenants/TenantsPage"));
const AddTenantPage = lazy(() => import("Pages/Tenants/AddTenant"));
const PlansPage = lazy(() => import("Pages/Plans/PlansPage"));
const AddPlanPage = lazy(() => import("Pages/Plans/AddPlanPage"));
const EditPlanPage = lazy(() => import("Pages/Plans/EditPlan"));
const NotAuthorized = lazy(() => import("Pages/NotAuthorized"));
const PaymentsPage = lazy(() => import("Pages/Payments/PaymentsPage"));
const TermsCondition = lazy(
  () => import("Pages/Configuration/TermsConditions")
);
const PlanItemsListing = lazy(
  () => import("Pages/Configuration/PlanItems/PlanItemsListing")
);
const CreatePlanItem = lazy(
  () => import("Pages/Configuration/PlanItems/CreatePlanItem")
);
const EditPlanItem = lazy(
  () => import("Pages/Configuration/PlanItems/EditPlanItem")
);
const Dashboard = lazy(() => import("Pages/Dashboard/Dashboard"));
const SettingsPage = lazy(
  () => import("Pages/Configuration/Settings/SettingsPage")
);
const EditTenant = lazy(() => import("Pages/Tenants/EditTenant"));
const ClustersPage = lazy(
  () => import("Pages/Configuration/Clusters/ClustersPage")
);
const BillingCyclesPage = lazy(
  () => import("Pages/Configuration/BillingCycles/BillingCyclesPage")
);

const mainLayoutRouteConfig = [
  {
    path: RouteConstant.DASHBOARD,
    component: Dashboard,
  },
  {
    path: RouteConstant.LEADS,
    component: LeadsPage,
    permissions: [PermissionsEnum.ViewLead],
  },
  {
    path: RouteConstant.TENANTS,
    component: TenantsPage,
    permissions: [PermissionsEnum.ViewTenant],
  },
  {
    path: RouteConstant.TENANTS_CREATE,
    component: AddTenantPage,
    permissions: [PermissionsEnum.CreateTenant],
  },
  {
    path: RouteConstant.TENANTS_CREATE_FROM_LEAD,
    component: AddTenantPage,
    permissions: [PermissionsEnum.UpdateTenant],
  },
  {
    path: RouteConstant.TENANT_VIEW_FROM_DASHBOARD,
    component: TenantsPage,
    permissions: [PermissionsEnum.ViewTenant],
  },
  {
    path: RouteConstant.CONFIGURATION_PLANS,
    component: PlansPage,
    permissions: [PermissionsEnum.ViewPlan],
  },
  {
    path: RouteConstant.CONFIGURATION_PLANS_CREATE,
    component: AddPlanPage,
    permissions: [PermissionsEnum.CreatePlan],
  },
  {
    path: RouteConstant.CONFIGURATION_PLAN_EDIT,
    component: EditPlanPage,
    permissions: [PermissionsEnum.UpdatePlan],
  },
  {
    path: RouteConstant.NOT_AUTHORIZED,
    component: NotAuthorized,
  },
  {
    path: RouteConstant.BILLINGS_AND_INVOICES,
    component: PaymentsPage,
    permissions: [PermissionsEnum.ViewInvoice],
  },
  {
    path: RouteConstant.CONFIGURATION_TERMS_CONDITION,
    component: TermsCondition,
    permissions: [PermissionsEnum.ViewTnCDocuments],
  },
  {
    path: RouteConstant.CONFIGURATION_PLAN_ITEMS,
    component: PlanItemsListing,
    permissions: [PermissionsEnum.ViewPlanItems],
  },
  {
    path: RouteConstant.CONFIGURATION_PLAN_ITEMS_CREATE,
    component: CreatePlanItem,
    permissions: [PermissionsEnum.CreatePlanItems],
  },
  {
    path: RouteConstant.CONFIGURATION_PLAN_ITEMS_EDIT,
    component: EditPlanItem,
    permissions: [PermissionsEnum.UpdatePlanItems],
  },
  {
    path: RouteConstant.CONFIGURATION_PLANS,
    component: PlansPage,
    permissions: [PermissionsEnum.ViewPlan],
  },
  {
    path: RouteConstant.CONFIGURATION_FEATURES,
    component: FeaturesPage,
    permissions: [PermissionsEnum.ViewFeature],
  },
  {
    path: RouteConstant.CONFIGURATION_FEATURES,
    component: FeaturesPage,
  },
  {
    path: RouteConstant.CONFIGURATION_SETTINGS,
    component: SettingsPage,
    permissions: [PermissionsEnum.ViewAdminSettings],
  },
  {
    path: RouteConstant.TENANTS_EDIT,
    component: EditTenant,
    permissions: [PermissionsEnum.UpdateTenant],
  },
  {
    path: RouteConstant.CONFIGURATION_CLUSTERS,
    component: ClustersPage,
    permissions: [PermissionsEnum.ViewCluster],
  },
  {
    path: RouteConstant.CONFIGURATION_BILLING,
    component: BillingCyclesPage,
    permissions: [PermissionsEnum.ViewBillingCycle],
  },
];

export default mainLayoutRouteConfig;
