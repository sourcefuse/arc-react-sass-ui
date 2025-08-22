import { Filter } from "Components/FilterPopup";
import { PLAN_ITEMS_BASE_URL } from "Constants/apiConfig";
import { ApiSliceIdentifier } from "Constants/enums";
import { apiSlice } from "../apiSlice";
import {
  CountResNode,
  FeatureNode,
  QueryFilterObject,
  WhereFilterObj,
} from "./types";
import {
  CreatePlan,
  CreatePlanItemPayload,
  Currency,
  PlanItemNode,
  PlanType,
  UpdatePlan,
  UpdatePlanItemByIdPayload,
} from "./types/plan.type";
import {
  AdminSettings,
  CombinedAdminSettings,
} from "./types/adminSettings.type";
import { IFormAdminSettings } from "Pages/Configuration/Settings/settings.utils";
import { adaptToAdminSettings } from "Helpers/adapter";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;

export const planItemByIdProvisionTag = (id: string) => [
  { type: "PlanItem" as const, id },
];

export const configurationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeatures: builder.query<
      FeatureNode[],
      {
        limit?: number;
        offset?: number;
        filter?: { where: { and: Filter[] } };
        sortBy?: string | null;
      }
    >({
      query: ({ limit, offset, filter, sortBy }) => ({
        url: "/features",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            ...(limit !== undefined ? { limit } : {}),
            ...(offset !== undefined ? { offset } : {}),
            order: sortBy ? [sortBy] : ["name ASC"],
            ...(filter ? { where: filter.where } : {}),
          }),
        },
      }),
    }),
    getFeaturesCount: builder.query<
      { count: string },
      { where: Record<string, any> }
    >({
      query: ({ where }) => ({
        url: "/features/count",
        method: "GET",
        apiSliceIdentifier,
        params: { where: JSON.stringify(where) },
      }),
    }),

    getPlanItems: builder.query<
      PlanItemNode[],
      QueryFilterObject<keyof PlanItemNode>
    >({
      query: (filter) => ({
        url: PLAN_ITEMS_BASE_URL,
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify(filter),
        },
      }),
    }),

    getPlanItemsCount: builder.query<
      CountResNode,
      WhereFilterObj<keyof PlanItemNode>
    >({
      query: (filter) => ({
        url: `${PLAN_ITEMS_BASE_URL}/count`,
        apiSliceIdentifier,
        params: {
          where: JSON.stringify(filter),
        },
      }),
    }),

    createPlanItems: builder.mutation<PlanItemNode, CreatePlanItemPayload>({
      query: (newPlanItem) => ({
        url: PLAN_ITEMS_BASE_URL,
        method: "POST",
        apiSliceIdentifier,
        body: newPlanItem,
      }),
    }),

    getPlanItemById: builder.query<PlanItemNode, string>({
      query: (id) => ({
        url: `${PLAN_ITEMS_BASE_URL}/${id}`,
        apiSliceIdentifier,
      }),
      providesTags: (result, error, id) => planItemByIdProvisionTag(id),
    }),

    updatePlanItem: builder.mutation<PlanItemNode, UpdatePlanItemByIdPayload>({
      query: (updatePlanItem) => ({
        url: `${PLAN_ITEMS_BASE_URL}/${updatePlanItem.id}`,
        method: "PATCH",
        apiSliceIdentifier,
        body: updatePlanItem,
      }),
    }),
    getPlanById: builder.query<PlanType, { id: string; filter: Filter }>({
      query: ({ id, filter }) => ({
        url: `/plans/${id}`,
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify(filter),
        },
      }),
    }),
    createPlan: builder.mutation<PlanType, CreatePlan>({
      query: (newPlan) => ({
        url: `/plans`,
        method: "POST",
        apiSliceIdentifier,
        body: newPlan,
      }),
    }),
    updatePlan: builder.mutation<
      PlanType,
      { id: string; plan: Partial<UpdatePlan> }
    >({
      query: ({ id, plan }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        apiSliceIdentifier,
        body: { ...plan },
      }),
    }),
    updatePlanAsSuspend: builder.mutation<PlanType, { id: string }>({
      query: ({ id }) => ({
        url: `/plans/${id}/suspend`,
        method: "PATCH",
        apiSliceIdentifier,
      }),
    }),
    updatePlanAsCustom: builder.mutation<PlanType, { id: string }>({
      query: ({ id }) => ({
        url: `/plans/${id}/mark-as-custom`,
        method: "PATCH",
        apiSliceIdentifier,
      }),
    }),
    getCurrency: builder.query<Currency[], void>({
      query: () => ({
        url: `/currencies`,
        apiSliceIdentifier,
      }),
    }),
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
    uploadFeatureCsv: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/features/import-csv",
        method: "POST",
        apiSliceIdentifier,
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreatePlanItemsMutation,
  useGetFeaturesQuery,
  useGetPlanItemsCountQuery,
  useGetPlanItemsQuery,
  useLazyGetPlanItemsCountQuery,
  useLazyGetPlanItemsQuery,
  useGetPlanItemByIdQuery,
  useUpdatePlanItemMutation,
  useLazyGetFeaturesQuery,
  useLazyGetPlanByIdQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useLazyGetCurrencyQuery,
  useGetFeaturesCountQuery,
  useLazyGetFeaturesCountQuery,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useUpdatePlanAsSuspendMutation,
  useUpdatePlanAsCustomMutation,
  useUploadFeatureCsvMutation,
  useLazyGetPlanItemByIdQuery,
} = configurationApiSlice;
