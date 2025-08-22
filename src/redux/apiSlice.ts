import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiSliceIdentifier } from "Constants/enums";
import {
  AuthResData,
  setCredentials,
  unsetCredentials,
} from "./auth/authSlice";
import type { RootState } from "./store";
import { getBaseUrl } from "./redux.helper";
import { getErrorMessage, getHashHeader } from "Helpers/utils";
import { enqueueSnackbar } from "notistack";

/**
 * Base query function with re-Authentication handling and header preparation.
 * This function serves as an interceptor for API requests.
 *
 * @param args - The fetch arguments for the request.
 * @param api - The API object provided by `createApi`.
 * @param extraOptions - Extra options for the query.
 */
const RESULT_ERROR_STATUS = 401;
const baseQueryWithReauth: BaseQueryFn<
  {
    url: string;
    method?: string;
    body?: any;
    apiSliceIdentifier?: ApiSliceIdentifier;
  },
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;

  const baseUrl = getBaseUrl(state, args.apiSliceIdentifier);
  const hashSecretKey = state.auth.hashSecret;
  const enableHashSecret = state.config.configData?.enableHashSecret === "true";

  // Add hash headers for POST and PUT only
  let newHeaders: Record<string, string> = {};
  const method = args.method?.toUpperCase() ?? "GET"; // Default to GET if no method is provided
  const isHashMethod = method
    ? ["POST", "PUT", "PATCH", "GET"].includes(method)
    : false;

  if (isHashMethod && enableHashSecret) {
    newHeaders = getHashHeader(
      hashSecretKey,
      JSON.stringify({ body: args.body, path: args.url })
    );
  }

  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (defaultHeaders, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        defaultHeaders.set("Authorization", `Bearer ${token}`);
      }

      // Merge in hash headers if present
      for (const [key, value] of Object.entries(newHeaders)) {
        defaultHeaders.set(key, value);
      }

      return defaultHeaders;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === RESULT_ERROR_STATUS) {
    // try to get a new token
    const refreshResult = await baseQuery(
      {
        url: getBaseUrl(state) + "/auth/refresh",
        method: "POST",
        body: { refreshToken: (api.getState() as RootState).auth.refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data as AuthResData));

      result = await baseQuery(args, api, extraOptions);
    } else {
      await baseQuery(
        {
          url: getBaseUrl(state) + "/auth/logout",
          method: "POST",
          body: {
            refreshToken: (api.getState() as RootState).auth.refreshToken,
          },
        },
        api,
        extraOptions
      );
      api.dispatch(unsetCredentials());
    }
  } else if (result.error) {
    const errorMessage = getErrorMessage(result.error);
    enqueueSnackbar(`${errorMessage}`, { variant: "error" });
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["PlanItem"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
