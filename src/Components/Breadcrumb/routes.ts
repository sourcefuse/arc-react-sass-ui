import { BreadcrumbsRoute } from "use-react-router-breadcrumbs";

const routes: BreadcrumbsRoute[] = [
  { path: "/", breadcrumb: null },
  { path: "/tenants", breadcrumb: "Tenants" },
  { path: "/tenants/create-tenant", breadcrumb: "Add Tenant" },
];

export default routes;
