import { apiSlice } from "../apiSlice";
import { PLAN_ITEMS_BASE_URL } from "Constants/apiConfig";
import { ApiSliceIdentifier } from "Constants/enums";
import {
  PlanItemNode,
  CreatePlanItemPayload,
  UpdatePlanItemByIdPayload,
} from "./types/plan.type";
import { QueryFilterObject, WhereFilterObj, CountResNode } from "./types";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;

export const planItemByIdProvisionTag = (id: string) => [
  { type: "PlanItem" as const, id },
];

export const planItemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetPlanItemsQuery,
  useLazyGetPlanItemsQuery,
  useGetPlanItemsCountQuery,
  useLazyGetPlanItemsCountQuery,
  useGetPlanItemByIdQuery,
  useLazyGetPlanItemByIdQuery,
  useCreatePlanItemsMutation,
  useUpdatePlanItemMutation,
} = planItemsApiSlice;
