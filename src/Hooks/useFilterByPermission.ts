import { PermissionsEnum } from "Constants/enums/permissions";
import { hasPermission } from "Helpers/permissionCheck";
import { useSelector } from "react-redux";
import { selectCurrentPermissions } from "redux/auth/authSlice";

interface FilteredPermissionsBase<T> {
  permissions?: PermissionsEnum[];
  children?: T[];
}

export const useFilteredPermissions = <T extends FilteredPermissionsBase<T>>(
  arr: T[]
): T[] => {
  const userPermissions = useSelector(selectCurrentPermissions);
  return filterItemsByPermission(arr, userPermissions ?? []);
};

const filterItemsByPermission = <T extends FilteredPermissionsBase<T>>(
  items: T[],
  userPermissions: PermissionsEnum[]
): T[] => {
  if (userPermissions.includes(PermissionsEnum.Admin)) {
    return items;
  }
  return items.reduce((filteredItems, item) => {
    if (!item.permissions) {
      filteredItems.push(item);
      return filteredItems;
    }

    // Recursively filter children if they exist
    const childrenItems =
      item.children && filterItemsByPermission(item.children, userPermissions);

    // Check if item passes permission check and if children are valid (either empty or valid after filtering)
    const hasValidPermission =
      item.permissions.length &&
      hasPermission(userPermissions, item.permissions);
    const hasValidChildren = childrenItems?.length;
    const canBeDisplayed = !item.children
      ? hasValidPermission
      : hasValidChildren;

    if (canBeDisplayed) {
      filteredItems.push({ ...item, children: childrenItems });
    }

    return filteredItems;
  }, [] as T[]);
};
