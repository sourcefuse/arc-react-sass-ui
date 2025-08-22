import { InvoiceStatus } from "Constants/enums/invoice-status.enum";

export interface IPayment {
  paymentDate: string;
  amount: string;
  totalAmount: string;
  currencyCode: string;
  taxRate: string;
  id: string;
}

interface ITenant {
  id: string;
  name: string;
  key: string;
  status: number;
  lang: string;
  domains: string[];
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  deleted: boolean;
  deletedBy: string | null;
  deletedOn: string | null;
  addressId: string | null;
  leadId: string | null;
  spocUserId: string | null;
}
interface IBillingCustomer {
  customerId: string;
  description?: string | null;
  id?: string;
  language?: string | null;
  paymentSourceId?: string | null;
  priority?: string | null;
  tenantId: string;
  tenant?: ITenant;
}
export interface IBillingInvoice {
  id: string;
  invoiceId: string;
  billingCustomerId: string;
  amount: string;
  tax: string;
  discount: string;
  payment: IPayment;
  currencyCode: string;
  dueDate: string;
  startDate: string;
  endDate: string;
  invoiceDate: string;
  invoiceNo: string;
  invoiceStatus: InvoiceStatus;
  createdOn: string;
  billingCustomer: IBillingCustomer;
}
export interface IInvoice {
  id: string;
  tenantId: string;
  billingAccountNo: string;
  invoiceNo: string;
  status: InvoiceStatus;
  invoiceDate: string;
  amount: number;
  dueDate: string;
  action?: string;
  startDate: string;
  endDate: string;
  currencyCode: string;
  billingInvoice?: IBillingInvoice;
  tenant?: ITenant;
}

export interface IDownloadInvoiceResponse {
  file: string;
}
