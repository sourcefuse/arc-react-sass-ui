export enum PermissionsEnum {
  CreateLead = "10200",
  UpdateLead = "10201",
  DeleteLead = "10202",
  ViewLead = "10203",
  CreateTenant = "10204",
  ProvisionTenant = "10216",
  DeprovisionTenant = "10217",
  UpdateTenant = "10205",
  DeleteTenant = "10206",
  ViewTenant = "10207",
  CreateContact = "10208",
  UpdateContact = "10209",
  DeleteContact = "10210",
  ViewContact = "10211",
  CreateInvoice = "10212",
  UpdateInvoice = "10213",
  DeleteInvoice = "10214",
  ViewInvoice = "10215",
  CreateNotification = "2",
  DownloadInvoice = "DownloadInvoice",
  SendInvoice = "SendInvoice",
  CreateSubscription = "7001",
  UpdateSubscription = "7002",
  DeleteSubscription = "7003",
  ViewSubscription = "7004",
  CreateTenantConfig = "10220",
  ViewTenantConfig = "10221",
  UpdateTenantConfig = "10222",
  DeleteTenantConfig = "10223",

  // notification service
  ViewNotificationTemplate = "8000",
  CreateNotificationTemplate = "8001",
  UpdateNotificationTemplate = "8002",
  DeleteNotificationTemplate = "8003",

  CreateBillingCustomer = "5321",
  CreateBillingPaymentSource = "5322",
  CreateBillingInvoice = "5323",
  GetBillingCustomer = "5324",
  GetBillingPaymentSource = "5325",
  GetBillingInvoice = "5326",
  UpdateBillingCustomer = "5327",
  UpdateBillingPaymentSource = "5328",
  UpdateBillingInvoice = "5329",
  DeleteBillingCustomer = "5331",
  DeleteBillingPaymentSource = "5332",
  DeleteBillingInvoice = "5333",

  // subscription tier
  CreateTier = "10230",
  UpdateTier = "10231",
  DeleteTier = "10232",
  ViewTier = "10233",

  // plan-items
  CreatePlanItems = "CreatePlanItems",
  ViewPlanItems = "ViewPlanItems",
  UpdatePlanItems = "UpdatePlanItems",
  DeletePlanItems = "DeletePlanItems",

  // cluster
  CreateCluster = "CreateCluster",
  ViewCluster = "ViewCluster",
  UpdateCluster = "UpdateCluster",
  DeleteCluster = "DeleteCluster",

  // features
  ViewFeature = "ViewFeature",
  CreateFeature = "CreateFeature",
  UpdateFeature = "UpdateFeature",
  DeleteFeature = "DeleteFeature",

  ViewStrategy = "ViewStrategy",
  CreateStrategy = "CreateStrategy",
  UpdateStrategy = "UpdateStrategy",
  DeleteStrategy = "DeleteStrategy",

  ViewFeatureValues = "ViewFeatureValues",
  CreateFeatureValues = "CreateFeatureValues",
  UpdateFeatureValues = "UpdateFeatureValues",
  DeleteFeatureValues = "DeleteFeatureValues",

  ViewFeatureNum = "1",
  CreateFeatureNum = "2",
  UpdateFeatureNum = "3",
  DeleteFeatureNum = "4",

  ViewStrategyNum = "5",
  CreateStrategyNum = "6",
  UpdateStrategyNum = "7",
  DeleteStrategyNum = "8",

  ViewFeatureValuesNum = "9",
  CreateFeatureValuesNum = "10",
  UpdateFeatureValuesNum = "11",
  DeleteFeatureValuesNum = "12",

  CreatePayment = "5334",
  UpdatePayment = "5335",
  DeletePayment = "5336",
  ViewPayment = "5337",

  ViewPlan = "7008",
  CreatePlan = "7009",
  UpdatePlan = "7010",
  DeletePlan = "7011",

  CreateClusterType = "10234",
  UpdateClusterType = "10235",
  DeleteClusterType = "10236",
  ViewClusterType = "10237",

  CreateTags = "10238",
  UpdateTags = "10239",
  DeleteTags = "10240",
  ViewTags = "10241",

  CreateBillingCycle = "7021",
  UpdateBillingCycle = "7022",
  DeleteBillingCycle = "7023",
  ViewBillingCycle = "7024",

  CreateCurrency = "7025",
  UpdateCurrency = "7026",
  DeleteCurrency = "7027",
  ViewCurrency = "7028",

  CreateTnCDocuments = "CreateTnCDocuments",
  UpdateTnCDocuments = "UpdateTnCDocuments",
  DeleteTnCDocuments = "DeleteTnCDocuments",
  ViewTnCDocuments = "ViewTnCDocuments",

  // observability
  ViewObservability = "ViewObservability",

  CreateAdminSettings = "6010",
  UpdateAdminSettings = "6011",
  DeleteAdminSettings = "6012",
  ViewAdminSettings = "6013",

  StartProvisioning = "6014",
  // tenant logs
  CreateTenantLogs = "CreateTenantLogs",
  ViewTenantLogs = "ViewTenantLogs",
  UpdateTenantLogs = "UpdateTenantLogs",
  DeleteTenantLogs = "DeleteTenantLogs",
  // tenant history
  CreateTenantHistory = "6015",
  ViewTenantHistory = "6016",
  UpdateTenantHistory = "6017",
  DeleteTenantHistory = "6018",
  ViewTenantDeploymentHistory = "ViewTenantDeploymentHistory",
  // ADMIN
  Admin = "*",
}
