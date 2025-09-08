import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { PermissionsEnum } from "Constants/enums/permissions";
import { ReactNode } from "react";
import { RouteConstant } from "../../Constants/routeConstant";
export interface SideNavDividerType {
  type: "divider";
  visible: boolean;
}

export interface SideNavTitleType extends Omit<SideNavDividerType, "type"> {
  label: string;
  type: "title";
}

export interface SideNavConfig
  extends Omit<SideNavDividerType, "type">,
    Omit<SideNavTitleType, "type"> {
  type?: "title" | "divider";
  link?: string;
  icon?: ReactNode;
  children?: (SideNavConfig | SideNavTitleType)[];
  permissions?: PermissionsEnum[];
  isExternal?: boolean; // Add this property
}

const sideNavConfig: SideNavConfig[] = [
  {
    label: "Dashboard",
    link: RouteConstant.DASHBOARD,
    icon: <DashboardRoundedIcon />,
    visible: true,
  },
  {
    label: "Tenants",
    link: RouteConstant.TENANTS,
    icon: <PeopleAltOutlinedIcon />,
    visible: true,
    permissions: [PermissionsEnum.ViewTenant],
  },
  {
    label: "Leads",
    link: RouteConstant.LEADS,
    icon: <PersonAddAlt1OutlinedIcon />,
    visible: true,
    permissions: [PermissionsEnum.ViewLead],
  },
  {
    label: "Billing & Invoices",
    link: RouteConstant.BILLINGS_AND_INVOICES,
    icon: <PaymentOutlinedIcon />,
    visible: true,
    permissions: [PermissionsEnum.ViewInvoice],
  },
  {
    label: "Observability",
    link: "/observability",
    icon: <LeaderboardOutlinedIcon />,
    visible: true,
    isExternal: true, // Add a new flag to identify external links
    permissions: [PermissionsEnum.ViewObservability],
  },
  {
    label: "Configuration",
    icon: <SettingsOutlinedIcon />,
    visible: true,
    permissions: [
      PermissionsEnum.ViewPlan,
      PermissionsEnum.ViewPlanItems,
      PermissionsEnum.ViewTnCDocuments,
      PermissionsEnum.ViewFeature,
    ],
    children: [
      {
        label: "Plans",
        link: RouteConstant.CONFIGURATION_PLANS,
        visible: true,
        permissions: [PermissionsEnum.ViewPlan],
      },
      {
        label: "Plan Items",
        link: RouteConstant.CONFIGURATION_PLAN_ITEMS,
        visible: true,
        permissions: [PermissionsEnum.ViewPlanItems],
      },
      {
        label: "Features",
        link: RouteConstant.CONFIGURATION_FEATURES,
        visible: true,
        permissions: [PermissionsEnum.ViewFeature],
      },
      {
        label: "Clusters",
        link: RouteConstant.CONFIGURATION_CLUSTERS,
        visible: true,
        permissions: [PermissionsEnum.ViewCluster],
      },
      {
        label: "Billing Cycles",
        link: RouteConstant.CONFIGURATION_BILLING,
        visible: true,
        permissions: [PermissionsEnum.ViewBillingCycle],
      },
      {
        label: "Terms & Conditions",
        link: RouteConstant.CONFIGURATION_TERMS_CONDITION,
        visible: true,
        permissions: [PermissionsEnum.ViewTnCDocuments],
      },
      {
        label: "Settings",
        link: RouteConstant.CONFIGURATION_SETTINGS,
        visible: true,
        permissions: [PermissionsEnum.ViewAdminSettings],
      },
    ],
  },
  {
    label: "Support",
    link: "/support",
    icon: <HeadphonesOutlinedIcon />,
    visible: false,
  },
];

export default sideNavConfig;
