import { Box, Button, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { getStatusColor, getStatusLabel } from "./tenants.utils";
import { TenantDataType } from "type/tenant.type";
import { convertToDate } from "Helpers/utils";
import { PlansTable } from "./PlansTable";
import { useGetSubscriptionsQuery } from "redux/app/tenantManagementApiSlice";
import DetailCard from "Components/DetailComponent/DetailCard";
import { SubscriptionStatus } from "redux/app/types/subscription";
import { Section } from "types/modalView.types";

type Props = {
  tenant: TenantDataType;
  handleCloseModal: () => void;
};

export const TenantView: FC<Props> = ({ handleCloseModal, tenant }) => {
  const filter = {
    where: {
      tenantId: tenant.tenantId,
      status: {
        inq: [
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.PENDING,
          SubscriptionStatus.PENDING_CANCELLATION,
        ],
      },
    },
    include: [
      { relation: "plan", scope: { include: [{ relation: "billingCycle" }] } },
    ],
  };
  const { data: plans } = useGetSubscriptionsQuery(
    { filter },
    { refetchOnMountOrArgChange: true }
  );

  const infoSections = useMemo(() => {
    const leadInformation: Section = {
      title: "Tenant Information",
      data: [
        { label: "Tenant Name", value: tenant.tenantName },
        {
          label: "Status",
          value: getStatusLabel(tenant.status),
          color: getStatusColor(tenant.status),
          highlight: true,
        },
        {
          label: "Created Date",
          value: String(convertToDate(tenant.createdDate)),
        },
        {
          label: "Billing Date",
          value: String(convertToDate(tenant.billingDate)),
        },
        { label: "Tier", value: tenant.tier ?? "" },
        { label: "Subdomain", value: tenant.key ?? "" },
      ],
    };
    const primaryContact = tenant.contacts?.find(
      (contact) => contact.isPrimary
    );
    const contactInformation: Section = {
      title: "Contact Details",
      data: primaryContact
        ? [
            { label: "First Name", value: primaryContact.firstName },
            { label: "Last Name", value: primaryContact.lastName }, // Fixed "Lase Name"
            { label: "Designation", value: primaryContact.designation },
            { label: "Email Address", value: primaryContact.email },
            {
              label: "Mobile No.",
              value: `${primaryContact.countryCode} ${primaryContact.phoneNumber}`,
            },
            { label: "Language", value: tenant.lang },
          ]
        : [], // Return an empty array if no primary contact exists
    };

    return [leadInformation, contactInformation];
  }, [tenant]);

  return (
    <div data-testid="tenant-view">
      <DetailCard
        title="Tenant Details"
        sections={infoSections}
        handleClose={handleCloseModal}
        extraContent={
          <Stack sx={{ mt: 2 }} spacing={1} flexDirection="column">
            <Typography
              sx={{ color: "customText.header", fontSize: 16, fontWeight: 700 }}
            >
              Plan Details
            </Typography>
            <Box
              sx={{
                padding: 2,
                mt: 1,
                backgroundColor: "background.secondaryDark",
                borderRadius: 3,
              }}
            >
              <PlansTable plans={plans ?? []} />
            </Box>
          </Stack>
        }
        actions={
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={handleCloseModal}
            sx={{ minWidth: 110, minHeight: 40 }}
          >
            Close
          </Button>
        }
      />
    </div>
  );
};
