export enum PaymentMethodEnum {
  Cash = "cash",
  Check = "check",
  BankTranser = "bank_transfer",
  Other = "other",
  Custom = "custom",
  PaymentSource = "payment_source",
}

export type InvoiceTransactionType = {
  method: PaymentMethodEnum;
  comment?: string;
};
