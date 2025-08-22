import Box from "@mui/material/Box";
import { Row } from "@tanstack/react-table";
import CustomModal from "Components/CustomModal";
import {
  buildFilter,
  buildSearchFilter,
} from "Components/FilterPopup/Filter.utils";
import { FilterPopupState } from "Components/FilterPopup/FilterPopup";
import { Table } from "Components/Table";
import React, { useEffect, useMemo, useState } from "react";
import {
  useDownloadInvoiceMutation,
  useLazyGetInvoiceByIdQuery,
  useLazyGetPaymentDetailsCountQuery,
  useLazyGetPaymentDetailsQuery,
  useSendPaymentLinkMutation,
} from "redux/app/tenantManagementApiSlice";
import { IBillingInvoice } from "redux/app/types/invoice.type";
import {
  getInvoiceTableColumns,
  paymentPageFilterConfig,
  searchConfig,
} from "./payments.utils";
import { PaymentView } from "./PaymentView";
import { useSnackbar } from "notistack";
import { handleDownload } from "Helpers/utils";
import { InvoiceStatus } from "Constants/enums/invoice-status.enum";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import { useFilteredPermissions } from "Hooks/useFilterByPermission";

const PaymentsPage = () => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = React.useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] =
    React.useState<IBillingInvoice | null>(null);
  const [triggergetInvoiceById] = useLazyGetInvoiceByIdQuery();
  const [finalFilter, setFinalFilter] = useState<FilterPopupState | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const [getPaymentDetails, { data, isError, isLoading }] =
    useLazyGetPaymentDetailsQuery();
  const [getPaymentDetailsCount, { data: response }] =
    useLazyGetPaymentDetailsCountQuery();
  const [sendPaymentLinkApi] = useSendPaymentLinkMutation();
  const [downloadInvoice] = useDownloadInvoiceMutation();
  const { enqueueSnackbar } = useSnackbar();

  const filters = useMemo(() => {
    return buildFilter(
      finalFilter ?? {},
      searchFilter ?? "",
      searchConfig,
      { relation: "billingCustomer", field: "name" },
      ["createdOn"],
      true,
      "invoiceStatus"
    );
  }, [finalFilter, searchFilter]);

  const tenantFilter = useMemo(() => {
    return searchFilter ? buildSearchFilter(searchFilter, ["name"]) : [];
  }, [searchFilter]);

  useEffect(() => {
    getPaymentDetails({
      filter: filters,
      limit,
      offset,
      tenantFilter,
      sortBy,
    });
    getPaymentDetailsCount({
      filter: filters,
      tenantFilter,
    });
  }, [
    limit,
    offset,
    filters,
    getPaymentDetails,
    getPaymentDetailsCount,
    tenantFilter,
    sortBy,
  ]);

  useEffect(() => {
    setOffset(0);
  }, [searchFilter, finalFilter, sortBy]);

  const handleDownloadInvoice = async (invoice: IBillingInvoice) => {
    setViewOpen(false);
    try {
      const pdfUrl = await downloadInvoice(invoice.id).unwrap();
      if (pdfUrl) {
        const fileName =
          invoice.invoiceStatus === InvoiceStatus.PAID
            ? `receipt-${invoice.invoiceNo}.pdf`
            : `invoice-${invoice.invoiceNo}.pdf`;
        handleDownload(pdfUrl, fileName);
      }
    } catch (error) {}
  };

  const handleRowClick = async (row: Row<IBillingInvoice>) => {
    const result = await triggergetInvoiceById({
      invoiceId: row.original.id,
      filter: {
        include: [{ relation: "billingCustomer" }, { relation: "payment" }],
      },
    });
    if (!result.data) {
      return;
    }
    setSelectedPayment(result.data);
    setViewOpen(true);
  };

  const handleSendPaymentLink = async (invoice: IBillingInvoice) => {
    setViewOpen(false);
    try {
      await sendPaymentLinkApi(invoice.id).unwrap();
      enqueueSnackbar("Payment link sent successfully!", {
        variant: "success",
      });
    } catch (error) {
      const err = error as { data?: { error?: { message?: string } } };
      enqueueSnackbar(
        `Failed to send payment link. Please try again. ${
          err.data?.error?.message ?? ""
        }`,
        {
          variant: "error",
        }
      );
    }
  };

  const invoiceTableColumns = useFilteredPermissions(
    getInvoiceTableColumns(handleDownloadInvoice)
  );

  return (
    <Box data-testid="payment-page">
      <Table
        tableName={"Billing & Invoices"}
        columns={invoiceTableColumns}
        data={data || []}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        count={Number(response?.count) || 0}
        manualPagination={true}
        enablePagination
        enableGlobalFiltering
        isTableLoading={isLoading}
        isErrorLoading={isError}
        handleRowClick={handleRowClick}
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        filterConfig={paymentPageFilterConfig}
        enableSorting={true}
        handleSortColumnChange={setSortBy}
      />
      {selectedPayment && (
        <CustomModal
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          modalWidth={800}
        >
          <PaymentView
            invoice={selectedPayment}
            handleCloseModal={() => {
              setViewOpen(false);
            }}
            handleDownloadInvoice={handleDownloadInvoice}
            handleSendPaymentLink={handleSendPaymentLink}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default PaymentsPage;
