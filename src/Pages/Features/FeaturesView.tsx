import { Button, Stack } from "@mui/material";
import DetailCard from "Components/DetailComponent/DetailCard";
import { FC, useMemo } from "react";
import { FeatureNode } from "redux/app/types";

type Props = {
  feature: FeatureNode;
  handleCloseModal: () => void;
};
type SectionItem = {
  label: string;
  value: string | number;
  color?: string;
  highlight?: boolean;
};
type Section = {
  title: string;
  data: SectionItem[];
};

export const FeatureView: FC<Props> = ({ handleCloseModal, feature }) => {
  const infoSections = useMemo(() => {
    const featureInformation: Section = {
      title: "Feature Information",
      data: [{ label: "Feature Name", value: feature.name }],
    };

    return [featureInformation];
  }, [feature]);

  return (
    <DetailCard
      title="Feature Details"
      sections={infoSections}
      handleClose={handleCloseModal}
      extraContent={<Stack sx={{ mt: 20 }}></Stack>}
      actions={
        <Button
          size="large"
          color="primary"
          variant="outlined"
          onClick={handleCloseModal}
          sx={{ minWidth: 140, minHeight: 50 }}
        >
          Close
        </Button>
      }
    />
  );
};
