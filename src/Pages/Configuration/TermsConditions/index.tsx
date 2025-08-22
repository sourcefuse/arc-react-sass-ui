import React from "react";
import { Box, Paper } from "@mui/material";
import PageHeader from "Components/PageHeader";
import UploadDocuments from "Components/UploadDocument";
import RenderButton from "./RenderButton";
import UploadDocumentLoader from "Components/UploadDocument/UploadDocumentLoader";
import BackdropLoader from "Components/BackdropLoader";
import ErrorView from "Components/Error/ErrorView";
import { usePermission } from "Hooks/usePermission";
import { PermissionsEnum } from "Constants/enums";
import { useTnCLogic } from "./useTnC";

const createEditPermissions = [
  PermissionsEnum.CreateTnCDocuments,
  PermissionsEnum.UpdateTnCDocuments,
];

function TermsCondition() {
  const hasAccess = usePermission(createEditPermissions);
  const {
    files,
    selectedFiles,
    isSubmitting,
    isError,
    isLoadingTnCDoc,
    handleFileUpload,
    handleFileRemove,
    handleSubmit,
    setSelectedFiles,
  } = useTnCLogic();

  if (isError) return <ErrorView />;

  return (
    <Box>
      {isSubmitting && <BackdropLoader />}
      <PageHeader pageName="Terms and Conditions" />
      <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
        {isLoadingTnCDoc ? (
          <UploadDocumentLoader />
        ) : (
          <>
            <UploadDocuments
              primaryText="Please upload a terms & conditions to further the process"
              onUpload={handleFileUpload}
              onRemoveFile={handleFileRemove}
              files={files}
              dropzoneProps={{ multiple: false, maxFiles: 1 }}
              enableReinitialize
              existingFiles={selectedFiles}
              onRemoveExistingFile={setSelectedFiles}
              cancelPermissions={createEditPermissions}
              fileUploadPermissions={createEditPermissions}
            />
            {hasAccess && (
              <RenderButton
                handleSubmit={handleSubmit}
                disableSubmitBtn={!files?.[0]?.name}
                handleCancel={() => false}
              />
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default TermsCondition;
