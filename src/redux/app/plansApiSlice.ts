import { apiSlice } from "../apiSlice";
import { ApiSliceIdentifier } from "Constants/enums";
import { CreatePlan, PlanType, UpdatePlan } from "./types/plan.type";
import { Filter } from "Components/FilterPopup";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;

export const plansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetPlanByIdQuery,
  useLazyGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useUpdatePlanAsSuspendMutation,
  useUpdatePlanAsCustomMutation,
} = plansApiSlice;
