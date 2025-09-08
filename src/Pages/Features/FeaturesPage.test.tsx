import { screen } from "@testing-library/react";
import { PermissionsEnum } from "Constants/enums/permissions";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { SnackbarProvider } from "notistack";
import { dummyFeatures } from "./FeaturesPage.utils";
import { MemoryRouter } from "react-router-dom";
import FeaturesPage from "./FeaturesPage";

describe("Features Page Tests", () => {
  it("should render the feature page", () => {
    renderWithStore(
      <MemoryRouter>
        <SnackbarProvider>
          <FeaturesPage />
        </SnackbarProvider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: [PermissionsEnum.ViewFeature] },
          api: {
            queries: {
              'getFeatures({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: dummyFeatures,
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );
    const component = screen.getByTestId("feature-page");
    expect(component).toBeVisible();
  });

  it("should render Table Loader while loading", () => {
    renderWithStore(
      <MemoryRouter>
        <SnackbarProvider>
          <FeaturesPage />
        </SnackbarProvider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: [PermissionsEnum.ViewFeature] },
          api: {
            queries: {
              'getFeatures({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  status: "pending",
                  endpointName: "getFeatures",
                  requestId: "",
                },
            },
          },
        },
      }
    );

    const tableLoader = screen.getByTestId("table-loader");
    expect(tableLoader).toBeInTheDocument();
  });

  it("should render No data view if no data", () => {
    renderWithStore(
      <MemoryRouter>
        <SnackbarProvider>
          <FeaturesPage />
        </SnackbarProvider>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: [PermissionsEnum.ViewFeature] },
          api: {
            queries: {
              'getFeatures({"filter":{"where":{"and":[]}},"limit":5,"offset":0,"sortBy":null})':
                {
                  data: [],
                  status: "fulfilled",
                },
            },
          },
        },
      }
    );

    const noDataView = screen.getByText("No Results Found.");
    expect(noDataView).toBeInTheDocument();
  });
});
