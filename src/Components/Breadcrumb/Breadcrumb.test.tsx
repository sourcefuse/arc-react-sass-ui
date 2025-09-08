import React from "react";
import { render, screen } from "@testing-library/react";
import Breadcrumb from "./Breadcrumb";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";

describe("Breadcrumb Component", () => {
  test("renders Breadcrumb component", () => {
    render(
      <BrowserRouter>
        <Breadcrumb routes={routes} />
      </BrowserRouter>
    );
    const breadcrumbElement = screen.getByTestId("breadcrumb");
    expect(breadcrumbElement).toBeVisible();
  });
});
