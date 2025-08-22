import { Filter, IncludeFilter } from "Components/FilterPopup";
import { ApiSliceIdentifier } from "Constants/enums";
import {
  adaptToLead,
  adaptToTierSelect,
  adaptToPlan,
  adaptToTopPlans,
} from "Helpers/adapter";
import { adaptToTenant } from "Helpers/adapter/tenant.adapter";
import { InvoiceTransactionType, LeadDataType, ManagePlanDataType } from "type";
import { TenantDataType } from "type/tenant.type";
import { apiSlice } from "../apiSlice";
import {
  BillingCycleType,
  LeadType,
  PlanType,
  TagType,
  TenantType,
  TierSelectBoxType,
  TierType,
  IBillingInvoice,
  TnCDocumentsItem,
  PlanStatus,
  TenantLogsType,
} from "./types";
import { PlanDetails } from "Pages/Tenants/PlansTable";
import { adaptToPlans } from "Helpers/adapter/plan.adapter";
import { Subscription, SubscriptionStatus } from "./types/subscription";
import {
  adaptToClusterSelect,
  Cluster,
  SelectBoxType,
} from "Pages/Plans/utils";
import {
  FormAddTenant,
  transformLeadData,
} from "Pages/Tenants/AddTenant/addTenantsUtils";
import { IPieData } from "Components/CustomPieChart/CustomPieChart";
import {
  ClusterFormData,
  transformClusters,
} from "Pages/Configuration/Clusters/clusters.utils";
import {
  adaptTenantHistory,
  TenantHistory,
  TransformedTenantHistory,
} from "./types/tenant-history.type";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;
const orderBy = { order: ["modifiedOn DESC"] };
const sortByColumn = "modifiedOn DESC";

export const tenantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<
      LeadDataType[],
      {
        limit: number;
        offset: number;
        filter?: { where: { and: Filter[] } };
        sortBy?: string | null;
      }
    >({
      query: ({ limit, offset, filter, sortBy }) => ({
        url: "/leads",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: sortBy ? [sortBy] : [sortByColumn],
            ...(filter ? { where: filter.where } : {}),
          }),
        },
      }),
      transformResponse: (response: LeadType[]): LeadDataType[] =>
        adaptToLead(response),
    }),

    getLeadsCount: builder.query<
      { count: string },
      { where: Record<string, any> }
    >({
      query: ({ where }) => ({
        url: "/leads/count",
        method: "GET",
        apiSliceIdentifier,
        params: { where: JSON.stringify(where) },
      }),
    }),

    getPaymentDetails: builder.query<
      IBillingInvoice[],
      {
        limit: number;
        offset: number;
        filter: { where: { and: Filter[] } };
        tenantFilter?: Filter[];
        sortBy?: string | null;
      }
    >({
      query: ({ limit, offset, filter, tenantFilter, sortBy }) => ({
        url: "/invoices",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: sortBy ? [sortBy] : [sortByColumn],
            ...filter,
          }),
          tenantFilter: tenantFilter?.length
            ? JSON.stringify({ where: tenantFilter[0] })
            : undefined,
        },
      }),
    }),

    getPaymentDetailsCount: builder.query<
      { count: string },
      { filter?: Filter; tenantFilter?: Filter[] }
    >({
      query: ({ filter, tenantFilter }) => ({
        url: "/invoices/count",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify(filter),
          tenantFilter: tenantFilter?.length
            ? JSON.stringify({ where: tenantFilter[0] })
            : undefined,
        },
      }),
    }),

    getTenants: builder.query<
      TenantDataType[],
      {
        limit: number;
        offset: number;
        filter?: { where: { and: Filter[] } };
        sortBy?: string | null;
      }
    >({
      query: ({ limit, offset, filter, sortBy }) => ({
        url: "/tenants",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: sortBy ? [sortBy] : [sortByColumn],
            ...(filter ? { where: filter.where } : {}),
            include: [
              { relation: "contacts" },
              {
                relation: "subscriptions",
                scope: {
                  where: {
                    status: {
                      inq: [
                        SubscriptionStatus.ACTIVE,
                        SubscriptionStatus.PENDING,
                        SubscriptionStatus.PENDING_CANCELLATION,
                      ],
                    },
                  },
                  include: [
                    {
                      relation: "plan",
                      scope: { include: [{ relation: "billingCycle" }] },
                    },
                    {
                      relation: "tier",
                    },
                  ],
                },
              },
            ],
          }),
        },
      }),
      transformResponse: (response: TenantType[]): TenantDataType[] =>
        adaptToTenant(response) as TenantDataType[],
    }),

    getTenantsCount: builder.query<
      { count: string },
      { where: Record<string, any> }
    >({
      query: ({ where }) => ({
        url: "/tenants/count",
        method: "GET",
        apiSliceIdentifier,
        params: { where: JSON.stringify(where) },
      }),
    }),
    getInvoiceById: builder.query<
      IBillingInvoice,
      { invoiceId: string; filter?: { include?: IncludeFilter[] } }
    >({
      query: ({ invoiceId, filter }) => ({
        url: `/invoices/${invoiceId}`,
        method: "GET",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
        params: {
          filter: JSON.stringify({ ...filter }),
        },
      }),
    }),
    getSubscriptions: builder.query<
      PlanDetails[],
      { filter?: { where?: Record<string, any>; include?: IncludeFilter[] } }
    >({
      query: ({ filter }) => ({
        url: "/subscriptions",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({ ...filter }),
        },
      }),
      transformResponse: (response: Subscription[]): PlanDetails[] =>
        adaptToPlans(response),
    }),

    updateLead: builder.mutation<LeadType, { leadId: string; leadData: any }>({
      query: ({ leadId, leadData }) => ({
        url: `/leads/${leadId}`,
        method: "PUT",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
        body: leadData,
      }),
    }),
    updateLeadAsConfirmed: builder.mutation<LeadType, { leadId: string }>({
      query: ({ leadId }) => ({
        url: `/leads/${leadId}/mark-as-confirmed`,
        method: "PUT",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
      }),
    }),
    updateLeadAsInvalid: builder.mutation<LeadType, { leadId: string }>({
      query: ({ leadId }) => ({
        url: `/leads/${leadId}/mark-as-invalid`,
        method: "PUT",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
      }),
    }),
    updateLeadAsClosed: builder.mutation<LeadType, { leadId: string }>({
      query: ({ leadId }) => ({
        url: `/leads/${leadId}/mark-as-closed`,
        method: "PUT",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
      }),
    }),
    getPlans: builder.query<
      ManagePlanDataType[],
      {
        limit: number;
        offset: number;
        filter?: { where: { and: Filter[] } };
        sortBy?: string | null;
      }
    >({
      query: ({ limit, offset, filter, sortBy }) => ({
        url: "/plans",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: sortBy ? [sortBy] : [sortByColumn],
            ...(filter ? { where: filter.where } : {}),
          }),
        },
      }),
      transformResponse: (response: PlanType[]): ManagePlanDataType[] =>
        adaptToPlan(response),
    }),

    getPlansCount: builder.query<
      { count: string },
      { where: Record<string, any> }
    >({
      query: ({ where }) => ({
        url: "/plans/count",
        method: "GET",
        apiSliceIdentifier,
        params: { where: JSON.stringify(where) },
      }),
    }),
    createTenant: builder.mutation<TenantType, FormData>({
      query: (formData) => ({
        url: "/tenants",
        method: "POST",
        apiSliceIdentifier,
        body: formData,
      }),
    }),

    startProvision: builder.mutation<
      void,
      { tenantId: string; transaction: InvoiceTransactionType }
    >({
      query: ({ tenantId, transaction }) => ({
        url: `/invoices/${tenantId}/pay`,
        method: "POST",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
        body: transaction,
      }),
    }),

    getTiers: builder.query<
      TierSelectBoxType[],
      { limit?: number; offset?: number; id?: string }
    >({
      query: ({ limit, offset, id }) => ({
        url: "/tiers",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: "label ASC",
            where: {
              ...(id && { id }),
            },
          }),
        },
      }),
      transformResponse: (response: TierType[]): TierSelectBoxType[] => {
        return adaptToTierSelect(response);
      },
    }),

    getClusters: builder.query<
      TierSelectBoxType[],
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => ({
        url: "/cluster-types",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
          }),
        },
      }),
      transformResponse: (response: TierType[]): TierSelectBoxType[] => {
        return adaptToTierSelect(response);
      },
    }),

    getTags: builder.query<TagType[], { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({
        url: "/tags",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: "name ASC",
          }),
        },
      }),
    }),

    getBillingCycles: builder.query<
      BillingCycleType[],
      { limit?: number; offset?: number }
    >({
      query: ({ limit, offset }) => ({
        url: "/billing-cycles",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            order: "cycleName ASC",
          }),
        },
      }),
    }),
    createBillingCycles: builder.mutation({
      query: (billingCycle) => ({
        url: "/billing-cycles",
        method: "POST",
        body: billingCycle,
        apiSliceIdentifier,
      }),
    }),
    updateBillingCycles: builder.mutation({
      query: (billingCycle) => ({
        url: `/billing-cycles/${billingCycle.id}`,
        method: "PUT",
        body: billingCycle,
        apiSliceIdentifier,
      }),
    }),
    deleteBillingCycles: builder.mutation({
      query: (id) => ({
        url: `/billing-cycles/${id}`,
        method: "DELETE",
        apiSliceIdentifier,
      }),
    }),

    getPlansForTenant: builder.query<
      PlanType[],
      {
        limit: number;
        isCustomPlan: boolean;
        offset: number;
        tierId: string;
        billingCycleId?: string;
        clusterTypeId?: string;
        sortBy?: string[];
        tagId?: string;
      }
    >({
      query: ({
        limit,
        isCustomPlan,
        offset,
        tierId,
        billingCycleId,
        clusterTypeId,
        tagId,
        sortBy,
      }) => {
        const filter: Record<string, any> = {
          where: {
            isCustomPlan,
            status: PlanStatus.ACTIVE,
            tagId,
          },
          include: [
            {
              relation: "tier",
              scope: {
                where: {
                  id: tierId,
                },
              },
            },
            {
              relation: "planItem",
            },
            {
              relation: "billingCycle",
            },
          ],
          limit,
          offset,
          order: sortBy,
        };

        if (billingCycleId) {
          filter.where.billingCycleId = billingCycleId;
        }
        if (clusterTypeId) {
          filter.include.push({
            relation: "cluster",
            scope: {
              where: {
                clusterTypeId,
              },
              include: [
                {
                  relation: "clusterType",
                },
              ],
            },
          });
        }
        filter.include.push({
          relation: "tag",
          scope: tagId?.length
            ? {
                where: Array.isArray(tagId)
                  ? { id: { inq: tagId } }
                  : { id: tagId },
              }
            : {},
        });

        return {
          url: "/plans",
          method: "GET",
          apiSliceIdentifier,
          params: {
            filter: JSON.stringify(filter),
          },
        };
      },
      // Remove the code once we switch the backend to sequelize in order to remember this i haven't moved this to separate adapter function
      transformResponse: (response: PlanType[], _, arg): PlanType[] => {
        const { tagId, clusterTypeId } = arg;
        return response.filter((plan) => {
          // Always check cluster type ID
          const clusterTypeMatch =
            plan.cluster?.clusterTypeId === clusterTypeId;
          // If tagId is provided, check for tag match
          if (tagId) {
            const tagMatch = plan.tag?.some((tag) => tag.id === tagId);
            return clusterTypeMatch && tagMatch;
          }
          // If no tagId, just return cluster type match
          return clusterTypeMatch;
        });
      },
    }),
    sendPaymentLink: builder.mutation<void, string>({
      query: (invoiceId: string) => ({
        url: `/invoices/${invoiceId}/send-payment-link`,
        method: "POST",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
      }),
    }),
    downloadInvoice: builder.mutation<string, string>({
      query: (invoiceId: string) => ({
        url: `/invoices/download/${invoiceId}`,
        method: "GET",
        cache: "no-cache",
        apiSliceIdentifier: ApiSliceIdentifier.TENANT_FACADE,
        responseHandler: (response: any) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.blob();
        },
      }),
      transformResponse: (response: Blob | void): string => {
        if (response instanceof Blob) {
          const file = new File([response], "invoice.pdf", {
            type: "application/pdf",
          });
          return window.URL.createObjectURL(file);
        } else {
          return "";
        }
      },
    }),
    getClustersSelect: builder.query<
      TierSelectBoxType[],
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => ({
        url: "/clusters",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit,
            offset,
            include: [{ relation: "clusterType" }],
          }),
        },
      }),
      transformResponse: (response: Cluster[]): SelectBoxType[] => {
        return adaptToClusterSelect(response);
      },
    }),

    createTnCDoc: builder.mutation<TenantType, FormData>({
      query: (formData) => ({
        url: "/tnc-documents",
        method: "POST",
        apiSliceIdentifier,
        body: formData,
      }),
    }),
    updateTnCDoc: builder.mutation<
      TenantType,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/tnc-documents/${id}`,
        method: "PATCH",
        apiSliceIdentifier,
        body: formData,
      }),
    }),
    getTnCDoc: builder.query<TnCDocumentsItem, void>({
      query: () => ({
        url: "/tnc-documents",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            limit: 1,
            offset: 0,
          }),
        },
      }),
    }),
    getLeadById: builder.query<
      FormAddTenant,
      { leadId: string; filter?: { where: { and: Filter[] } } }
    >({
      query: ({ leadId, filter }) => ({
        url: `/leads/${leadId}`,
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            ...orderBy,
            ...(filter ? { where: filter.where } : {}),
          }),
        },
      }),
      transformResponse: (response: LeadType): FormAddTenant => {
        return transformLeadData(response);
      },
    }),
    getTenantById: builder.query<TenantDataType, string>({
      query: (tenantId) => ({
        url: `/tenants/${tenantId}`,
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            include: [
              { relation: "contacts" },
              { relation: "files" },
              {
                relation: "subscriptions",
                scope: {
                  where: {
                    status: {
                      inq: [
                        SubscriptionStatus.ACTIVE,
                        SubscriptionStatus.PENDING,
                      ],
                    },
                  },
                  include: [
                    {
                      relation: "plan",
                      scope: {
                        include: [
                          { relation: "billingCycle" },
                          { relation: "cluster" },
                          { relation: "tag" },
                          { relation: "tier" },
                          {
                            relation: "planItem",
                          },
                        ],
                      },
                    },
                    { relation: "tier" },
                  ],
                },
              },
            ],
          }),
        },
      }),
      transformResponse: (response: TenantType): TenantDataType =>
        adaptToTenant(response) as TenantDataType,
    }),
    updateTenantById: builder.mutation<
      TenantType,
      { id: string; body: FormData }
    >({
      query: ({ body, id }) => ({
        url: `/tenants/${id}`,
        method: "PATCH",
        apiSliceIdentifier,
        body,
      }),
    }),
    getTopSubscribedPlans: builder.query<IPieData[], void>({
      query: () => ({
        url: "/subscriptions",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            include: [
              {
                relation: "plan",
              },
            ],
          }),
        },
      }),
      transformResponse: (response: Subscription[]): IPieData[] => {
        return adaptToTopPlans(response);
      },
    }),
    getTenantLogs: builder.query<
      TenantLogsType[],
      { filter?: { where: { and: Filter[] } } }
    >({
      query: ({ filter }) => ({
        url: "/tenant-logs",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            ...(filter ? { where: filter.where } : {}),
          }),
        },
      }),
    }),
    getClusterWithType: builder.query<ClusterFormData[], void>({
      query: () => ({
        url: "/clusters",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            include: [{ relation: "clusterType" }],
          }),
        },
      }),
      transformResponse: (response: Cluster[]): ClusterFormData[] => {
        return transformClusters(response);
      },
    }),
    createClusters: builder.mutation<
      ClusterFormData,
      Omit<ClusterFormData, "id" | "clusterTypeId">
    >({
      query: (formData) => ({
        url: "/clusters",
        method: "POST",
        body: formData,
        apiSliceIdentifier,
      }),
    }),
    updateClusters: builder.mutation<ClusterFormData, ClusterFormData>({
      query: ({ id, ...formData }) => ({
        url: `/clusters/${id}`,
        method: "PUT",
        body: formData,
        apiSliceIdentifier,
      }),
    }),
    deleteCluster: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clusters/${id}`,
        method: "DELETE",
        apiSliceIdentifier,
      }),
    }),
    getTenantHistory: builder.query<TransformedTenantHistory[], string>({
      query: (tenantId) => ({
        url: "/tenant-deployment-history",
        method: "GET",
        apiSliceIdentifier,
        params: {
          filter: JSON.stringify({
            where: { tenantId },
            order: "provisionStartOn DESC",
          }),
        },
      }),
      transformResponse: (
        response: TenantHistory[]
      ): TransformedTenantHistory[] => adaptTenantHistory(response),
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useGetLeadsCountQuery,
  useLazyGetLeadsCountQuery,
  useGetPaymentDetailsQuery,
  useGetPaymentDetailsCountQuery,
  useLazyGetPaymentDetailsCountQuery,
  useLazyGetPaymentDetailsQuery,
  useLazyGetTenantsQuery,
  useCreateTenantMutation,
  useStartProvisionMutation,
  useLazyGetTenantsCountQuery,
  useGetPlansQuery,
  useLazyGetPlansQuery,
  useGetPlansCountQuery,
  useLazyGetPlansCountQuery,
  useLazyGetInvoiceByIdQuery,
  useUpdateLeadMutation,
  useGetTenantsQuery,
  useGetTiersQuery,
  useLazyGetPlansForTenantQuery,
  useGetClustersQuery,
  useLazyGetTagsQuery,
  useGetTagsQuery,
  useLazyGetBillingCyclesQuery,
  useGetSubscriptionsQuery,
  useGetBillingCyclesQuery,
  useSendPaymentLinkMutation,
  useDownloadInvoiceMutation,
  useGetClustersSelectQuery,
  useLazyGetTnCDocQuery,
  useCreateTnCDocMutation,
  useUpdateTnCDocMutation,
  useGetTenantsCountQuery,
  useLazyGetLeadByIdQuery,
  useGetTopSubscribedPlansQuery,
  useLazyGetTenantByIdQuery,
  useUpdateTenantByIdMutation,
  useUpdateLeadAsClosedMutation,
  useUpdateLeadAsConfirmedMutation,
  useUpdateLeadAsInvalidMutation,
  useLazyGetTenantLogsQuery,
  useCreateClustersMutation,
  useGetClusterWithTypeQuery,
  useUpdateClustersMutation,
  useDeleteClusterMutation,
  useCreateBillingCyclesMutation,
  useUpdateBillingCyclesMutation,
  useDeleteBillingCyclesMutation,
  useLazyGetTenantHistoryQuery,
} = tenantApiSlice;
