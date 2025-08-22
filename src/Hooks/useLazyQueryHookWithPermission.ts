import { usePermission } from "./usePermission";
import { PermissionsEnum } from "Constants/enums";

/**
 * Wraps a lazy RTK query hook with permission check.
 *
 * @param requiredPermissions Permissions required to run the query
 * @param useLazyQueryHook RTK lazy query hook (e.g., useLazyGetUserQuery)
 * @returns A guarded trigger function and the result object
 */
export function useLazyQueryHookWithPermission<
  TTriggerArgs extends any[],
  TResult
>(
  requiredPermissions: PermissionsEnum[],
  useLazyQueryHook: () => [(...args: TTriggerArgs) => any, TResult]
): [(...args: TTriggerArgs) => any, TResult] {
  const hasPermission = usePermission(requiredPermissions);
  const [trigger, result] = useLazyQueryHook();

  const guardedTrigger = (...args: TTriggerArgs) => {
    if (!hasPermission) return;
    return trigger(...args);
  };

  return [guardedTrigger, result];
}
