import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Table } from "Components/Table";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useNavigate } from "react-router";
import { RouteConstant } from "Constants/routeConstant";
import {
  useLazyGetPlanItemsCountQuery,
  useLazyGetPlanItemsQuery,
} from "redux/app/planItemsApiSlice";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import {
  filterConfig,
  planItemsTableColumns,
  searchConfig,
} from "Pages/Configuration/PlanItems/utils";
import { buildFilters, Filter, FilterPopupState } from "Components/FilterPopup";
import { QueryFilterObject } from "redux/app/types";
import { PlanItemNode } from "redux/app/types/plan.type";
import { PermissionsEnum } from "Constants/enums";
import { useFilteredPermissions } from "Hooks/useFilterByPermission";
import CustomModal from "Components/CustomModal";
import PlanItemView from "./PlanItemDetail/PlanItemView";
import { Row } from "@tanstack/react-table";

const planItemsDefaultFilter: QueryFilterObject<keyof PlanItemNode> = {
  fields: {
    id: true,
    name: true,
    createdOn: true,
    modifiedOn: true,
  },
};

const PlanItemsListing = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [getPlanItemsCount, { data: planItemsCount }] =
    useLazyGetPlanItemsCountQuery();
  const [getPlanItems, { data: planItems, isLoading, isError }] =
    useLazyGetPlanItemsQuery();
  const filteredPlanItemsTableColumns = useFilteredPermissions(
    planItemsTableColumns
  );

  const [finalFilter, setFinalFilter] = useState<FilterPopupState | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const [selectedPlanItemId, setSelectedPlanItemId] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filters: Filter[] = useMemo(
    () => buildFilters(searchConfig, finalFilter, searchFilter),
    [finalFilter, searchFilter]
  );

  useEffect(() => {
    getPlanItems({
      ...planItemsDefaultFilter,
      order: sortBy ? [sortBy] : ["modifiedOn DESC", "name ASC"],
      where: { and: filters },
      limit,
      offset,
    });
  }, [limit, offset, getPlanItems, filters, sortBy]);

  useEffect(() => {
    getPlanItemsCount({
      and: filters,
    });
  }, [filters, getPlanItemsCount]);

  useEffect(() => {
    setOffset((prevOffset) => (prevOffset !== 0 ? 0 : prevOffset));
  }, [searchFilter, finalFilter, sortBy]);

  const handlePlanItemViewClose = () => {
    setIsOpen(false);
  };
  return (
    <Box>
      <Table
        tableName="Plan Items"
        enableGlobalFiltering
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        filterConfig={filterConfig}
        enablePagination
        manualPagination
        headerBtnName="Add Plan Items"
        headerBtnEndIcon={<AddOutlinedIcon />}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        data={planItems || []}
        count={Number(planItemsCount?.count ?? 0)}
        isTableLoading={isLoading}
        isErrorLoading={isError}
        headerBtnStartIcon={<AddOutlinedIcon />}
        headerBtnPermissions={[PermissionsEnum.CreatePlanItems]}
        handleHeaderBtnClick={() =>
          navigate(RouteConstant.CONFIGURATION_PLAN_ITEMS_CREATE)
        }
        columns={filteredPlanItemsTableColumns}
        globalFilterPlaceholder="Search Plan Items"
        enableSorting={true}
        handleSortColumnChange={setSortBy}
        handleRowClick={(row: Row<PlanItemNode>) => {
          setSelectedPlanItemId(row.original.id);
          setIsOpen(true);
        }}
      />
      {selectedPlanItemId && (
        <CustomModal
          open={isOpen}
          handleClose={handlePlanItemViewClose}
          modalWidth={500}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <PlanItemView
            planItemId={selectedPlanItemId}
            handleCloseModal={handlePlanItemViewClose}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default PlanItemsListing;
