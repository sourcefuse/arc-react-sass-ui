import { LinearProgress } from "@mui/material";
import { PermissionsEnum } from "Constants/enums/permissions";
import { usePermission } from "Hooks/usePermission";

import { Navigate } from "react-router-dom";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions?: PermissionsEnum[];
}

export const PermissionGuardWrapper = ({
  children,
  requiredPermissions,
}: PermissionGuardProps) => {
  const hasAccess = usePermission(requiredPermissions);
  if (hasAccess === undefined) return <LinearProgress />;
  return (
    <>{hasAccess ? children : <Navigate to={"/not-authorized"} replace />}</>
  );
};
