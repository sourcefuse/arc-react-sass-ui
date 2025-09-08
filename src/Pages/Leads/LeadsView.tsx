import { Button, Stack } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { LeadDataType } from "type";
import {
  disableLeadAction,
  getLeadStatusColor,
  getLeadStatusDisplayName,
} from "./LeadsPage.utils";
import ConfirmDialog from "Components/ConfirmDialog/ConfirmDialog";
import { useUpdateLeadAsConfirmedMutation } from "redux/app/tenantManagementApiSlice";
import { convertToDate } from "Helpers/utils";
import DetailCard from "Components/DetailComponent/DetailCard";
import { Section } from "types/modalView.types";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";

type Props = {
  lead: LeadDataType;
  handleCloseModal: () => void;
};

export const LeadView: FC<Props> = ({ handleCloseModal, lead }) => {
  const navigate = useNavigate();
  const [updateLead] = useUpdateLeadAsConfirmedMutation();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const infoSections = useMemo(() => {
    const leadInformation: Section = {
      title: "Lead Information",
      data: [
        { label: "Lead Name", value: lead.leadName },
        {
          label: "Status",
          value: getLeadStatusDisplayName(lead.status),
          color: getLeadStatusColor(lead.status),
          highlight: true,
        },
        { label: "Created Date", value: String(convertToDate(lead.createdAt)) },
        { label: "Email Address", value: lead.email },
        { label: "Phone Number", value: lead.phone },
        { label: "Employer", value: lead.employer },
        { label: "No. of Employees", value: lead.numberOfEmployee },
      ],
    };

    return [leadInformation];
  }, [lead]);

  const handleConvertLead = async (data: LeadDataType) => {
    try {
      setIsDialogOpen(false);
      navigate(`/tenants/create-tenant/${data.leadId}`);
      await updateLead({ leadId: data.leadId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDialogOpen(!isDialogOpen);
  };
  return (
    <>
      <DetailCard
        title="Lead Details"
        sections={infoSections}
        handleClose={handleCloseModal}
        extraContent={<Stack sx={{ mt: 20 }}></Stack>}
        actions={
          <>
            <Button
              size="large"
              color="primary"
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ minWidth: 140, minHeight: 50 }}
            >
              Close
            </Button>
            {!disableLeadAction.includes(lead.status) && (
              <PermissionWrapper
                requiredPermissions={[PermissionsEnum.CreateTenant]}
              >
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  onClick={toggle}
                  sx={{ minWidth: 140, minHeight: 50 }}
                >
                  Convert Lead
                </Button>
              </PermissionWrapper>
            )}
          </>
        }
      />
      <ConfirmDialog
        title="Convert lead to tenant ?"
        description="Are you sure, you want to convert lead to tenant ?"
        open={isDialogOpen}
        onClose={toggle}
        onConfirm={() => {
          handleConvertLead(lead);
        }}
      />
    </>
  );
};
