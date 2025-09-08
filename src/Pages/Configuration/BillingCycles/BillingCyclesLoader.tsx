import PageLoader from "Components/Loaders/PageLoader";

const BillingCyclesLoader = () => {
  return (
    <PageLoader
      fieldCount={2}
      showButtons={true}
      data-testid="billing-cycles-page-loader"
    />
  );
};

export default BillingCyclesLoader;
