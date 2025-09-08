const uuid = "3f79fcca-9d6d-0188-53fe-e09040e5be32";
const cycleId = "e3eb-2c4a-9815-374a9d7e5194";
const planItemId = "105be72a-1589-17b0-7729-194ecc8c5ce8";
const featureName = "CPQ Document";
const planValues = ["cpq-document-hub", "cpq-discount"];
const testTenantId = "test-tenant-id";
export interface Feature {
  title: string;
  id: number;
  items: { name: string; standard: any; plus: any }[];
}
export const features = [
  {
    name: "Installed Base",
  },
  {
    name: "CPQ Site",
  },
  {
    name: "CPQ agreement management",
  },
  {
    name: "Promotion Management",
  },
  {
    name: "Product Catalog",
  },
  {
    name: "CPQ integration",
  },
  {
    name: "CPQ Feasibility",
  },
  {
    name: "Asset Management",
  },
  {
    name: "CPQ Task",
  },
  {
    name: "party management",
  },
  {
    name: "Back office",
  },
  {
    name: "CPQ Portal",
  },
];

export const plans = [
  { id: "retail", label: "Retail" },
  { id: "cpq", label: "CPQ" },
  { id: "custom", label: "Commerce" },
];

export interface Plan {
  id: string;
  label: string;
}

export const clusterData = [
  {
    id: uuid, // NOSONAR
    value: uuid, // NOSONAR
    label: "Free",
    description: "free cluster",
  },
  {
    id: "a40fe4bb-5a87-7a46-10c0-720ba8f38977",
    value: "a40fe4bb-5a87-7a46-10c0-720ba8f38977",
    label: "Cloud Cluster",
    description: "Cluster for cloud-based workloads",
  },
  {
    id: "c4d77f69-9ec4-d35b-4646-5550bcf72bda",
    value: "c4d77f69-9ec4-d35b-4646-5550bcf72bda",
    label: "On-Prem Cluster",
    description: "Cluster for on-premises workloads",
  },
];

export const tierData = [
  {
    id: "silo",
    label: "silo",
    value: "silo",
    description: "silo tier",
  },
];

export const standardPlanData = [
  {
    id: "standard",
    name: "Plus",
    description: "description",
    amount: "2000.00",
    metadata: null,
    isCustomPlan: false,
    billingCycleId: cycleId,
    currencyId: "currencyId",
    clusterId: "clusterId",
    tier: [
      {
        id: "tierId",
        label: "silo",
        description: "silo tier",
      },
    ],
    planItem: [
      {
        id: planItemId,
        name: "product",
        description: null,
        planItemType: 0,
        planValue: [
          {
            name: planValues[0],
            featureName,
            chart_version: "17.0.7",
            "ingress-rewrite-target": true,
          },
          {
            name: planValues[1],
            featureName: "feature-cpq-discount",
            chart_version: "17.0.4",
            "ingress-rewrite-target": true,
          },
          {
            name: "service",
            featureName: "CPQ Discount Service",
            chart_version: "17.0.4",
            "ingress-rewrite-target": true,
          },
        ],
      },
    ],
  },
  {
    id: "plusImax",
    name: "PlusImax",
    description: "plus description",
    amount: "2000.00",
    metadata: null,
    isCustomPlan: false,
    billingCycleId: "56916d96-e3eb-2c4a-9815-374a9d7e5194",
    currencyId: "currencyId",
    clusterId: "clusterId",
    tier: [
      {
        id: "tierId",
        label: "silo",
        description: "silo tier",
      },
    ],
    planItem: [
      {
        id: "105be72a",
        name: "product",
        description: null,
        planItemType: 0,
        planValue: [
          {
            name: "cpq-discount-service",
            featureName: "Back office",
            chart_version: "17.0.4",
            "ingress-rewrite-target": true,
          },
        ],
      },
    ],
  },
];

export const customPlanMockData = [
  {
    id: "customPlan",
    name: "Plus",
    description: "plus description",
    amount: "2000.00",
    metadata: null,
    isCustomPlan: true,
    billingCycleId: cycleId,
    currencyId: "currencyId",
    clusterId: "clusterId",
    tier: [
      {
        id: "tierId",
        label: "silo",
        description: "silo tier",
      },
    ],
    billingCycle: {
      deleted: false,
      deletedOn: null,
      deletedBy: null,
      createdOn: "2025-03-11T13:20:59.321Z",
      modifiedOn: "2025-03-11T13:20:59.321Z",
      createdBy: "string",
      modifiedBy: null,
      id: "1c9915e9-5933-4fa8-2e4a-c108cc6eca70",
      cycleName: "Monthly",
      duration: 1,
      durationUnit: "MONTHLY",
      description: "Billing cycle for monthly subscriptions",
    },
    cluster: {
      deleted: false,
      deletedOn: null,
      deletedBy: null,
      createdOn: "string",
      modifiedOn: "string",
      createdBy: "string",
      modifiedBy: null,
      id: "0c9b2fd6-55c7-c729-7074-2906200d4c1e",
      clusterTypeId: "e39f2f18-3562-3927-00be-f59b00074e52",
      region: "ap-south",
      zone: "ap-south-1b",
      description: " Asia Pacific (Mumbai) region DEV Cluster",
      clusterType: {
        deleted: false,
        deletedOn: null,
        deletedBy: null,
        createdOn: "string",
        modifiedOn: "string",
        createdBy: "string",
        modifiedBy: null,
        id: "e39f2f18-3562-3927-00be-f59b00074e52",
        label: "DEV",
        description: "Development environment clusters",
      },
    },
    planItem: [
      {
        id: planItemId,
        name: "product",
        description: null,
        planItemType: 0,
        planValue: [
          {
            name: planValues[0],
            featureName,
            chart_version: "17.0.7",
            "ingress-rewrite-target": true,
          },
          {
            name: planValues[1],
            featureName: "CPQ Discount",
            chart_version: "17.0.4",
            "ingress-rewrite-target": true,
          },
          {
            name: "cpq-discount-service",
            featureName: "CPQ Discount",
            chart_version: "17.0.4",
            "ingress-rewrite-target": true,
          },
        ],
      },
    ],
  },
];

export const tagsData = [
  {
    id: "cpq",
    name: "CPQ",
  },
  {
    id: "retail",
    name: "Retail",
  },
];

export const billingCycleData = [
  {
    id: "29bbba2f-f4f3-2f54-a78e-ccb439f31f7f",
    cycleName: "Yearly",
    duration: 12,
    durationUnit: "MONTHLY",
    description: "Test",
  },
  {
    id: "56916d96-e3eb-2c4a-9815-374a9d7e5194",
    cycleName: "monthly",
    duration: 1,
    durationUnit: "MONTHLY",
    description: "some description",
  },
];

export const mockedTenantData = {
  id: testTenantId,
  name: "Emirates",
  status: 1,
  key: "emirates",
  spocUserId: null,
  domains: ["gmail.com"],
  leadId: null,
  addressId: null,
  lang: "English",
  contacts: [
    {
      firstName: "Test",
      lastName: "User",
      email: "test@gmail.com",
      designation: "Engineer",
      phoneNumber: "8078054465",
      countryCode: "+91",
      isPrimary: true,
      type: null,
      tenantId: testTenantId,
    },
  ],
  files: [
    {
      id: "test-file-id",
      tenantId: testTenantId,
      fileKey: "1743525599347",
      originalName: "Test File",
      source: 0,
      size: "34221",
      url: "https://example.com/test-file",
    },
  ],
  subscriptions: [
    {
      id: "test-subscription-id",
      subscriberId: "test-subscriber-id",
      startDate: "2025-04-01",
      endDate: null,
      status: 0,
      planId: "standard",
      tierId: "silo",
      clusterId: uuid,
      tenantId: testTenantId,
      externalSubscriptionId: "sub_1R985dKxH99wEJoTurid4gO6",
      plan: {
        id: "standard",
        name: "Plus",
        description: "description",
        amount: "2000.00",
        metadata: null,
        isCustomPlan: false,
        billingCycleId: cycleId,
        currencyId: "currencyId",
        clusterId: "clusterId",
        tier: [
          {
            id: "tierId",
            label: "silo",
            description: "silo tier",
          },
        ],
        planItem: [
          {
            id: planItemId,
            name: "product",
            description: null,
            planItemType: 0,
            planValue: [
              {
                name: planValues[0],
                featureName,
                chart_version: "17.0.7",
                "ingress-rewrite-target": true,
              },
              {
                name: planValues[1],
                featureName: "feature-cpq-discount",
                chart_version: "17.0.4",
                "ingress-rewrite-target": true,
              },
              {
                name: "service",
                featureName: "CPQ Discount Service",
                chart_version: "17.0.4",
                "ingress-rewrite-target": true,
              },
            ],
          },
        ],
        billingCycle: {
          id: "1c9915e9-5933-4fa8-2e4a-c108cc6eca70",
          cycleName: "Monthly",
          duration: 1,
          durationUnit: "MONTHLY",
          description: "Billing cycle for monthly subscriptions",
        },
      },
      tier: {
        id: "a5e77ed3-6395-1706-530e-2b3ad501cf24",
        label: "Standard",
        description: "Standard tier with all features",
      },
    },
  ],
};
