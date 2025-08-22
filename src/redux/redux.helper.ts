import { ApiSliceIdentifier } from "Constants/enums";
import { RootState } from "./store";

export function getBaseUrl(
  state: RootState,
  apiSliceIdentifier?: ApiSliceIdentifier
) {
  if (!Number.isInteger(apiSliceIdentifier))
    return state.config.configData?.authApiBaseUrl;

  const baseUrlMap: Partial<Record<ApiSliceIdentifier, string | undefined>> = {
    [ApiSliceIdentifier.TENANT_FACADE]:
      state.config.configData?.tenantApiBaseUrl,
    [ApiSliceIdentifier.AUDIT_FACADE]: state.config.configData?.auditApiBaseUrl,
  };

  return baseUrlMap[apiSliceIdentifier!];
}
