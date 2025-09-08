import { PermissionsEnum } from "Constants/enums/permissions";

export const hasPermission = (
  userPermissions: PermissionsEnum[],
  requiredPermissions?: PermissionsEnum[]
) => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
};
