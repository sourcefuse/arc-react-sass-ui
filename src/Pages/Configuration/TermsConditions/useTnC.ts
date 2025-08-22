import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import {
  useLazyGetTnCDocQuery,
  useUpdateTnCDocMutation,
  useCreateTnCDocMutation,
} from "redux/app/tenantManagementApiSlice";
import { IFile } from "type/tenant.type";

export function useTnCLogic() {
  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [getTnCDoc, { isLoading, data: currentTnCData, isError }] =
    useLazyGetTnCDocQuery();
  const [updateTnCDoc] = useUpdateTnCDocMutation();
  const [createTnCDoc] = useCreateTnCDocMutation();

  useEffect(() => {
    if (!isLoading && !currentTnCData && !isError) getTnCDoc();
  }, [getTnCDoc, isLoading, currentTnCData, isError]);

  useEffect(() => {
    if (currentTnCData?.downloadUrl) {
      setSelectedFiles([
        {
          ...currentTnCData,
          url: currentTnCData.downloadUrl,
          fileKey: currentTnCData.id,
          tenantId: "",
        },
      ]);
    }
  }, [currentTnCData]);

  const handleFileUpload = (uploaded: File[]) => {
    setFiles(uploaded);
    setSelectedFiles([]);
  };

  const handleFileRemove = () => {
    setFiles([]);
  };

  const handleSubmit = useCallback(async () => {
    if (!files.length) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const isUpdate = !!currentTnCData?.originalName;
      const action = isUpdate
        ? updateTnCDoc({ id: currentTnCData.id, formData }).unwrap()
        : createTnCDoc(formData).unwrap();

      await action;
      await getTnCDoc();
      setFiles([]);
      enqueueSnackbar("Document uploaded successfully!", {
        variant: "success",
      });
    } catch {
      // optional: error handling
    } finally {
      setIsSubmitting(false);
    }
  }, [
    files,
    currentTnCData,
    updateTnCDoc,
    createTnCDoc,
    getTnCDoc,
    enqueueSnackbar,
  ]);

  return {
    files,
    selectedFiles,
    isSubmitting,
    isError,
    isLoadingTnCDoc: (isLoading || !currentTnCData) && !isError,
    handleFileUpload,
    handleFileRemove,
    handleSubmit,
    setSelectedFiles,
  };
}
