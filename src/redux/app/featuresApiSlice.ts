import { apiSlice } from "../apiSlice";
import { FEATURES_BASE_URL } from "Constants/apiConfig";
import { ApiSliceIdentifier } from "Constants/enums";
import { FeatureNode } from "./types";
import { Filter } from "Components/FilterPopup";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;

export const featuresApiSlice = apiSlice.injectEndpoints({
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
        url: FEATURES_BASE_URL,
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
        url: `${FEATURES_BASE_URL}/count`,
        method: "GET",
        apiSliceIdentifier,
        params: { where: JSON.stringify(where) },
      }),
    }),
    uploadFeatureCsv: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: `${FEATURES_BASE_URL}/import-csv`,
        method: "POST",
        apiSliceIdentifier,
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetFeaturesQuery,
  useLazyGetFeaturesQuery,
  useGetFeaturesCountQuery,
  useLazyGetFeaturesCountQuery,
  useUploadFeatureCsvMutation,
} = featuresApiSlice;
