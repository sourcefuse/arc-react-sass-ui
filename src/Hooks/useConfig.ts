import { selectConfigData } from "redux/config/configSlice";
import { useAppSelector } from "redux/hooks";

export interface AppConfiguration {
  clientId: string;
  authApiBaseUrl: string;
  appApiBaseUrl?: string;
  enableSessionTimeout: boolean;
  storageSessionTimeKey?: string;
  expiryTimeInMinute: number;
  promptTimeBeforeIdleInMinute: number;
  defaultTierId?: string;
  tenantApiBaseUrl?: string;
  auditApiBaseUrl?: string;
  grafanaUrl?: string;
  hashSecretKey?: string;
  enableHashSecret?: string;
  appName?: string;
  appDescription?: string;
}
const DEFAULT_EXPIRY_TIME = 15;
const useConfig = () => {
  const configData = useAppSelector(selectConfigData);

  if (!configData) {
    return { config: {} as AppConfiguration };
  }

  const config: AppConfiguration = {
    ...configData,
    enableSessionTimeout: configData.enableSessionTimeout === "true",
    expiryTimeInMinute: configData.expiryTimeInMinute
      ? +configData.expiryTimeInMinute
      : DEFAULT_EXPIRY_TIME,
    promptTimeBeforeIdleInMinute: configData.promptTimeBeforeIdleInMinute
      ? +configData.promptTimeBeforeIdleInMinute
      : 1,
  };

  return { config };
};

export default useConfig;
