/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import NotificationProvider from "Providers/NotificationProvider";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../redux/store";
import MainLayout from "./Mainlayout";

const MockMainLayout = () => (
  <Provider store={store}>
    <NotificationProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </NotificationProvider>
  </Provider>
);

describe("MainLayout", () => {
  it("should be render sidenav on initially", () => {
    render(<MockMainLayout />);
    const sidenav = screen.getByTestId("sidenav");
    expect(sidenav.firstChild).toBeVisible();
  });
});
