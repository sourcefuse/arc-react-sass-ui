import { PermissionsEnum } from "Constants/enums";
import { usePermission } from "Hooks/usePermission";
import React from "react";

interface PermissionWrapperProps extends React.PropsWithChildren {
  requiredPermissions?: PermissionsEnum[];
}

export const PermissionWrapper = ({
  requiredPermissions,
  children,
}: PermissionWrapperProps) => {
  const hasPermission = usePermission(requiredPermissions);

  return <>{hasPermission ? <>{children}</> : <></>}</>;
};
