import { PermissionsEnum } from "Constants/enums/permissions";
import { hasPermission } from "Helpers/permissionCheck";
import { useSelector } from "react-redux";
import { selectCurrentPermissions } from "redux/auth/authSlice";

export const usePermission = (requiredPermissions?: PermissionsEnum[]) => {
  const userPermissions = useSelector(selectCurrentPermissions) || []; // Default to an empty array

  if (!userPermissions || userPermissions.length === 0) {
    return undefined;
  }
  if (userPermissions.includes(PermissionsEnum.Admin)) {
    return true;
  }
  return hasPermission(userPermissions, requiredPermissions);
};
