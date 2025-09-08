import PageLoader from "Components/Loaders/PageLoader";

const ClustersPageLoader = () => {
  return (
    <PageLoader
      fieldCount={4}
      showButtons={true}
      data-testid="clusters-page-loader"
    />
  );
};

export default ClustersPageLoader;
