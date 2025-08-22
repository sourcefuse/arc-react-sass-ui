import { usePermission } from "./usePermission";
import { PermissionsEnum } from "Constants/enums";

/**
 * Wraps a standard RTK query hook with permission check.
 *
 * @param requiredPermissions Permissions required to run the query
 * @param useQueryHook RTK query hook (e.g., useGetUserQuery)
 * @param args Arguments passed to the RTK hook
 * @param options Optional config (e.g., skip, refetchOnMountOrArgChange)
 * @returns RTK Query result, or skipped if no permission
 */
export function useQueryHookWithPermission<TArgs, TResult>(
  requiredPermissions: PermissionsEnum[],
  useQueryHook: (args: TArgs, options?: any) => TResult,
  args: TArgs,
  options: any = {}
): TResult {
  const hasPermission = usePermission(requiredPermissions);

  return useQueryHook(args, {
    ...options,
    skip: !hasPermission,
  });
}
