import { FC, useEffect, useState } from "react";
import { Box, Card, CardHeader, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Table } from "Components/Table";
import {
  useGetPlanItemsCountQuery,
  useLazyGetPlanItemsQuery,
} from "redux/app/configurationApiSlice";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import { Plan, planItemsColumn } from "./utils";
import { QueryFilterObject } from "redux/app/types";
import { PlanItemNode } from "redux/app/types/plan.type";
import { Add, Clear } from "@mui/icons-material";
import { useFormikContext, FormikValues } from "formik";
import { SelectOption } from "Helpers/utils";
import Button from "Components/Button";

const planItemsDefaultFilter: QueryFilterObject<keyof PlanItemNode> = {
  order: ["name ASC"],
  fields: {
    id: true,
    name: true,
    description: true,
  },
};
interface AddButtonProps<T extends Plan> {
  rowData: T;
}

export const AddButton = <T extends Plan>({ rowData }: AddButtonProps<T>) => {
  const { setFieldValue, values } = useFormikContext<FormikValues>();
  const selectedItems: SelectOption = values.planItemIds || [];
  const isAdded =
    selectedItems?.some((item) => item.value?.includes(rowData.id)) ?? false;

  const handleTogglePlanItem = () => {
    if (isAdded) {
      setFieldValue(
        "planItemIds",
        selectedItems.filter((item) => item.label !== rowData.name)
      );
    } else {
      setFieldValue("planItemIds", [
        ...selectedItems,
        { label: rowData.name, value: rowData.id },
      ]);
    }
  };

  return (
    <Box sx={{ width: 50, display: "flex", justifyContent: "center" }}>
      <IconButton onClick={handleTogglePlanItem} disableRipple>
        {isAdded ? (
          <Clear style={{ color: "red" }} />
        ) : (
          <Add style={{ color: "green" }} />
        )}
        <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
          {isAdded ? "Remove" : "Add"}
        </Typography>
      </IconButton>
    </Box>
  );
};
type Props = {
  handleCloseModal: () => void;
  handleSaveCloseBtn: () => void;
  isSaveCloseBtnDisabled: boolean;
};
const PlanItemsView: FC<Props> = ({
  handleCloseModal,
  handleSaveCloseBtn,
  isSaveCloseBtnDisabled,
}) => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const { data: planItemsCount } = useGetPlanItemsCountQuery({});
  const [getPlanItems, { data: planItems, isLoading, isError }] =
    useLazyGetPlanItemsQuery();

  useEffect(() => {
    getPlanItems({ ...planItemsDefaultFilter, limit, offset });
  }, [limit, offset, getPlanItems]);

  return (
    <Card
      sx={{
        minWidth: "100%",
        border: "none",
        boxShadow: "none",
        padding: 0,
        maxHeight: "40rem",
        overflow: "auto",
        margin: 0,
        paddingBottom: 1,
      }}
    >
      <CardHeader
        title="Add Plan Item"
        action={
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        }
        sx={{ boxShadow: "none" }}
      />
      <Table
        enablePagination
        manualPagination
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        data={planItems || []}
        count={Number(planItemsCount?.count ?? 0)}
        isTableLoading={isLoading}
        isErrorLoading={isError}
        columns={planItemsColumn}
        tablePropsObject={{
          tableFooterProps: {
            sx: {
              "& tr td": {
                borderBottom: "none",
              },
            },
          },
          tableContainerProps: {
            sx: {
              boxShadow: "none",
            },
          },
        }}
      />

      <Button
        variant="contained"
        sx={{ ml: "auto", display: "block", px: 4, py: 1.5, mr: 2 }}
        color="primary"
        onClick={handleSaveCloseBtn}
        disabled={isSaveCloseBtnDisabled}
      >
        Save & Close
      </Button>
    </Card>
  );
};

export default PlanItemsView;
