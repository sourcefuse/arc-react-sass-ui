import { apiSlice } from "../apiSlice";
import { ApiSliceIdentifier } from "Constants/enums";
import { IFormAdminSettings } from "Pages/Configuration/Settings/settings.utils";
import {
  AdminSettings,
  CombinedAdminSettings,
} from "./types/adminSettings.type";
import { adaptToAdminSettings } from "Helpers/adapter";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;

export const adminSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSettings: builder.query<IFormAdminSettings, void>({
      query: () => ({
        url: "/admin-settings",
        apiSliceIdentifier,
      }),
      transformResponse: (
        response: CombinedAdminSettings
      ): IFormAdminSettings => {
        return adaptToAdminSettings(response);
      },
    }),

    updateAdminSettings: builder.mutation<
      AdminSettings,
      { id: string; settings: Partial<AdminSettings> }
    >({
      query: ({ id, settings }) => ({
        url: `/admin-settings/${id}`,
        method: "PATCH",
        apiSliceIdentifier,
        body: { ...settings },
      }),
    }),
  }),
});

export const { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } =
  adminSettingsApiSlice;
