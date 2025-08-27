import { Box, Card, CardHeader, Divider, IconButton } from "@mui/material";
import { Row } from "@tanstack/react-table";
import { buildFilters } from "Components/FilterPopup/Filter.utils";
import { FilterPopupState } from "Components/FilterPopup/FilterPopup";
import { Table } from "Components/Table";
import { useEffect, useMemo, useState } from "react";
import {
  featureExpandedTableColumns,
  featureFilterConfig,
  featureTableColumns,
  searchConfig,
} from "./FeaturesPage.utils";
import CustomModal from "Components/CustomModal";
import {
  useLazyGetFeaturesCountQuery,
  useLazyGetFeaturesQuery,
} from "redux/app/featuresApiSlice";
import { FeatureNode } from "redux/app/types";
import CloseIcon from "@mui/icons-material/Close";

const DEFAULT_LIMIT = 5;
const DEFAULT_OFFSET = 0;

const FeaturesPage = () => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [finalFilter, setFinalFilter] = useState<FilterPopupState | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<FeatureNode | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [getFeaturesCount, { data: response }] = useLazyGetFeaturesCountQuery();
  const [getFeatures, { data: features, isError, isLoading }] =
    useLazyGetFeaturesQuery();

  const filters = useMemo(
    () => buildFilters(searchConfig, finalFilter, searchFilter),
    [finalFilter, searchFilter]
  );

  useEffect(() => {
    getFeatures({ filter: { where: { and: filters } }, limit, offset, sortBy });
    getFeaturesCount({ where: { and: filters } });
  }, [limit, offset, filters, getFeaturesCount, getFeatures, sortBy]);

  useEffect(() => {
    setOffset(0);
  }, [finalFilter, searchFilter, sortBy]);

  return (
    <Box data-testid="feature-page">
      <Table
        tableName="Features"
        columns={featureTableColumns}
        data={features || []}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        count={Number(response?.count) || 0}
        manualPagination={true}
        enablePagination
        enableGlobalFiltering
        setFinalFilter={setFinalFilter}
        setSearchFilter={setSearchFilter}
        globalFilterPlaceholder="Search feature"
        filterConfig={featureFilterConfig}
        isTableLoading={isLoading}
        isErrorLoading={isError}
        handleRowClick={(row: Row<FeatureNode>) => {
          setSelectedFeature(row.original);
          setIsOpen(true);
        }}
        enableSorting={true}
        handleSortColumnChange={setSortBy}
      />
      {selectedFeature && (
        <CustomModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          modalWidth={1000}
          padding={0}
        >
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              padding: 0,
              maxHeight: "40rem",
              overflowY: "auto",
              margin: 0,
            }}
          >
            <CardHeader
              title="Features Details"
              action={
                <IconButton onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              }
            />
            <Divider />
            <Table
              tableName={selectedFeature.name}
              columns={featureExpandedTableColumns}
              data={selectedFeature.metadata.data || []}
              enablePagination
              showBackground={false}
            ></Table>
          </Card>
        </CustomModal>
      )}
    </Box>
  );
};

export default FeaturesPage;
