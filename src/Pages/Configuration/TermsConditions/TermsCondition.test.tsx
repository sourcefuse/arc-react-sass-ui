import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TermsCondition from "./index";
import * as notistack from "notistack";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import * as permissionHook from "Hooks/usePermission";

import * as tenantManagementApiSlice from "redux/app/tenantManagementApiSlice";
const mockTnCData = {
  deleted: false,
  deletedOn: null,
  deletedBy: null,
  createdOn: "2025-03-11T14:52:55.580Z",
  modifiedOn: "2025-03-11T14:52:55.580Z",
  createdBy: "85205ff3-3fe7-4e05-a3dd-855ffc236d8c",
  modifiedBy: "85205ff3-3fe7-4e05-a3dd-855ffc236d8c",
  id: "9180cfc8-dd64-1206-89ff-18cb363a2efd",
  fileKey: "1741704773584",
  originalName: "Tnc.pdf",
  source: 0,
  size: 21000,
  downloadUrl: "https://example.com/files/dummy.pdf",
};
const type = "application/pdf";

describe("TermsCondition Component", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockGetTnCDoc = vi.fn().mockReturnValue({ data: mockTnCData });
  const mockUpdateTnCDoc = vi.fn();
  const mockCreateTnCDoc = vi.fn();

  beforeEach(() => {
    vi.spyOn(notistack, "useSnackbar").mockImplementation(() => ({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    }));

    // Mock the API hooks
    vi.spyOn(tenantManagementApiSlice, "useLazyGetTnCDocQuery").mockReturnValue(
      [
        mockGetTnCDoc,
        {
          isLoading: false,
          data: mockTnCData,
          isError: false,
          isFetching: false,
        },
        { lastArg: {} as any },
      ]
    );

    vi.spyOn(
      tenantManagementApiSlice,
      "useUpdateTnCDocMutation"
    ).mockReturnValue([mockUpdateTnCDoc, { isLoading: false, reset: vi.fn() }]);

    vi.spyOn(
      tenantManagementApiSlice,
      "useCreateTnCDocMutation"
    ).mockReturnValue([mockCreateTnCDoc, { isLoading: false, reset: vi.fn() }]);
    vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with correct initial state", () => {
    render(
      <Provider store={store}>
        <TermsCondition />
      </Provider>
    );

    expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please upload a terms & conditions to further the process"
      )
    ).toBeInTheDocument();
  });

  it("shows loader when data is being fetched", () => {
    vi.spyOn(
      tenantManagementApiSlice,
      "useLazyGetTnCDocQuery"
    ).mockReturnValueOnce([
      mockGetTnCDoc,
      {
        isLoading: true,
        data: undefined,
        isError: false,
        isFetching: true,
      },
      { lastArg: {} as any },
    ]);

    render(
      <Provider store={store}>
        <TermsCondition />
      </Provider>
    );
    expect(screen.getByTestId("upload-document-loader")).toBeInTheDocument();
  });

  it("loads existing T&C document when available", async () => {
    render(
      <Provider store={store}>
        <TermsCondition />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(mockTnCData.originalName)).toBeInTheDocument();
    });
  });

  it("handles file upload successfully", async () => {
    render(
      <Provider store={store}>
        <TermsCondition />
      </Provider>
    );

    const removeButton = await screen.findByTestId("file-remove-btn");
    fireEvent.click(removeButton); // remove previous file and then upload new

    const file = new File(["content"], "test.pdf", { type });
    const dropZone = screen.getByTestId("file-drop-zone-input");

    const data = {
      dataTransfer: {
        files: [file],
        items: [
          {
            kind: "file",
            type,
            getAsFile: () => file,
          },
        ],
        types: ["Files"],
      },
    };

    fireEvent.drop(dropZone, data);

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });
  });
});
