import {
  Card,
  CardHeader,
  CardActions,
  Divider,
  IconButton,
  Typography,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";
import { DataItem } from "./DataItem";

interface Section {
  title: string;
  data: { label: string; value: string | number }[];
}

interface DetailCardProps {
  title: string;
  sections: Section[];
  actions?: ReactNode;
  extraContent?: ReactNode;
  handleClose: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  sections,
  actions,
  extraContent,
  handleClose,
}) => {
  return (
    <Card
      sx={{
        minWidth: "100%",
        border: "none",
        boxShadow: "none",
        maxHeight: "40rem",
        overflow: "auto",
        margin: 0,
        px: 1,
      }}
    >
      <CardHeader
        title={title}
        action={
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        sx={{ boxShadow: "none", px: 0, py: 1 }}
      />
      <Divider />
      {sections.map((section, index) => (
        <Stack
          key={`${index}-${section.title}`}
          sx={{ mt: 2 }}
          spacing={1}
          flexDirection="column"
        >
          <Typography
            sx={{ color: "customText.header", fontSize: 16, fontWeight: 700 }}
          >
            {section.title}
          </Typography>
          <Box
            sx={{
              padding: 2,
              mt: 1,
              backgroundColor: "background.secondaryDark",
              borderRadius: 3,
            }}
          >
            <Grid container spacing={2} sx={{ padding: 1 }}>
              {section.data.map((item, idx) => (
                <Grid item xs={4} key={`${idx}-${item.label}`}>
                  <DataItem {...item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      ))}
      {extraContent}
      <CardActions sx={{ mt: 2 }}>
        <Stack
          direction={"row"}
          justifyContent={"flex-end"}
          width={"100%"}
          gap={2}
        >
          {actions}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default DetailCard;
