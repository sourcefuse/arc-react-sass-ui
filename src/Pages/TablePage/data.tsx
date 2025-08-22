export type BillingDataType = {
  _id: string;
  companyName: string;
  userName: string;
  planName: string; // The subscription plan (string)
  startDate: string;
  endDate: string;
  subscription: string; // The subscription status (Active/Inactive)
};

export const billingData = [
  {
    _id: "1",
    companyName: "TechCorp Inc.",
    userName: "Alice Johnson",
    planName: "Enterprise",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    subscription: "Active",
  },
  {
    _id: "2",
    companyName: "Innovatech Solutions",
    userName: "John Doe",
    planName: "Business",
    startDate: "2023-02-01",
    endDate: "2024-02-01",
    subscription: "Active",
  },
  {
    _id: "3",
    companyName: "GreenEarth Group",
    userName: "Sarah Lee",
    planName: "Basic",
    startDate: "2022-06-15",
    endDate: "2023-06-15",
    subscription: "Inactive",
  },
];
