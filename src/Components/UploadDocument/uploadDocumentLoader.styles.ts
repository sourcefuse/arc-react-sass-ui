export const uploadDocumentLoaderStyles = {
  container: {
    p: 1,
  },
  paper: {
    display: "flex",
    borderRadius: 4,
    p: 1,
    width: "100%",
    backgroundColor: "background.secondary",
    minHeight: "20rem",
  },
  contentContainer: {
    flex: 1,
    p: 2,
  },
  titleSkeleton: {
    width: "80%",
    height: 24,
    mb: 2,
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    width: "90%",
    backgroundColor: "background.secondaryDark",
    borderRadius: "0.625rem",
    padding: "0.125rem 1rem",
  },
  itemSkeleton: {
    width: "100%",
    height: 40,
  },
  previewContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    width: "50%",
    padding: "1rem",
  },
  previewSkeleton: {
    width: "100%",
    height: 200,
    borderRadius: 2,
    backgroundColor: "background.paper",
  },
  footerSkeleton: {
    width: "60%",
    height: 24,
    alignSelf: "flex-end",
    mt: 1,
  },
};
