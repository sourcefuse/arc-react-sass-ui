import { Box, Button, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { getStatusColor, getStatusDisplayName } from "./payments.utils";
import { PaymentTable } from "./PaymentTable";
import { IBillingInvoice } from "redux/app/types/invoice.type";
import { InvoiceStatus } from "Constants/enums/invoice-status.enum";
import { convertToDate, getCurrencySymbol } from "Helpers/utils";
import DetailCard from "Components/DetailComponent/DetailCard";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";

type Props = {
  invoice: IBillingInvoice;
  handleCloseModal: () => void;
  handleDownloadInvoice: (invoice: IBillingInvoice) => void;
  handleSendPaymentLink: (invoice: IBillingInvoice) => void;
};

const useInvoiceInformation = (invoice: IBillingInvoice) => {
  const baseInvoiceData = [
    { label: "Invoice No.", value: invoice.invoiceNo },
    {
      label: "Invoice Date",
      value: invoice.createdOn ? convertToDate(invoice.createdOn) : "NA",
    },
    {
      label: "Due Date",
      value: invoice.dueDate ? convertToDate(invoice.dueDate) : "NA",
    },
    {
      label: "From",
      value: invoice.startDate ? convertToDate(invoice.startDate) : "NA",
    },
    {
      label: "To",
      value: invoice.endDate ? convertToDate(invoice.endDate) : "NA",
    },
    {
      label: "Status",
      value: getStatusDisplayName(invoice.invoiceStatus),
      color: getStatusColor(invoice.invoiceStatus),
      highlight: true,
    },
  ];

  const invoiceAmount = {
    label: "Invoice Amount",
    value: `${getCurrencySymbol(invoice.currencyCode.trim())}${invoice.amount}`,
  };

  return { baseInvoiceData, invoiceAmount };
};

const PaymentDetails: FC<{ invoice: IBillingInvoice }> = ({ invoice }) => (
  <Stack sx={{ mt: 2 }} spacing={1} flexDirection="column">
    <Typography
      sx={{ color: "customText.header", fontSize: 16, fontWeight: 700 }}
    >
      Payment Details
    </Typography>
    <Box
      sx={{
        padding: 2,
        mt: 1,
        backgroundColor: "background.secondaryDark",
        borderRadius: 3,
      }}
    >
      <PaymentTable invoice={invoice} />
    </Box>
  </Stack>
);

const DownloadButton: FC<{
  invoice: IBillingInvoice;
  handleDownloadInvoice: (invoice: IBillingInvoice) => void;
}> = ({ invoice, handleDownloadInvoice }) => (
  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
    <Button
      onClick={() => handleDownloadInvoice(invoice)}
      sx={{
        minWidth: 180,
        minHeight: 50,
        color: "text.secondary",
        textTransform: "none",
      }}
      startIcon={
        <img
          src="/download.svg"
          alt="Download"
          style={{ width: 20, height: 20, opacity: 0.5 }}
        />
      }
    >
      {invoice.invoiceStatus === InvoiceStatus.PAID
        ? "Download receipt"
        : "Download invoice"}
    </Button>
  </Box>
);

export const PaymentView: FC<Props> = ({
  handleCloseModal,
  invoice,
  handleDownloadInvoice,
  handleSendPaymentLink,
}) => {
  const openStatuses = [InvoiceStatus.PENDING, InvoiceStatus.OPEN];
  const downloadInvoiceStatuses = [
    InvoiceStatus.PAID,
    InvoiceStatus.PENDING,
    InvoiceStatus.OPEN,
  ];
  const { baseInvoiceData, invoiceAmount } = useInvoiceInformation(invoice);

  const infoSections = useMemo(() => {
    const invoiceInformation = {
      title: "Invoicing Information",
      data: [...baseInvoiceData],
    };

    const tenantInformation = {
      title: "Tenant Information",
      data: [
        {
          label: "Tenant Name",
          value: invoice.billingCustomer?.tenant?.name ?? "",
        },
      ],
    };

    if (invoice.invoiceStatus === InvoiceStatus.PAID) {
      invoiceInformation.data = [...invoiceInformation.data, invoiceAmount];
    } else {
      invoiceInformation.data = [
        ...invoiceInformation.data,
        invoiceAmount,
        { ...invoiceAmount, label: "Total Due" },
      ];
    }

    return [tenantInformation, invoiceInformation];
  }, [invoice, baseInvoiceData, invoiceAmount]);

  return (
    <div data-testid="tenant-view">
      <DetailCard
        title="Payment Details"
        sections={infoSections}
        handleClose={handleCloseModal}
        extraContent={
          <>
            {invoice.invoiceStatus === InvoiceStatus.PAID && (
              <PaymentDetails invoice={invoice} />
            )}
            <PermissionWrapper
              requiredPermissions={[PermissionsEnum.DownloadInvoice]}
            >
              {downloadInvoiceStatuses.includes(invoice.invoiceStatus) && (
                <DownloadButton
                  invoice={invoice}
                  handleDownloadInvoice={handleDownloadInvoice}
                />
              )}
            </PermissionWrapper>
          </>
        }
        actions={
          <>
            <Button
              size="large"
              color="primary"
              variant={
                invoice.invoiceStatus === InvoiceStatus.PAID
                  ? "contained"
                  : "outlined"
              }
              onClick={handleCloseModal}
              sx={{ minWidth: 140, minHeight: 50 }}
            >
              Close
            </Button>
            <PermissionWrapper
              requiredPermissions={[PermissionsEnum.SendInvoice]}
            >
              {openStatuses.includes(invoice.invoiceStatus) && (
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  onClick={() => handleSendPaymentLink(invoice)}
                  sx={{ minWidth: 140, minHeight: 50 }}
                >
                  Send payment link
                </Button>
              )}
            </PermissionWrapper>
          </>
        }
      />
    </div>
  );
};
