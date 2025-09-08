import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMockStore } from "./mockStore";
/**
 * Renders a react component with mock redux store.
 * @param ui - component passed to render
 * @param preloadedState - Initial state for mock store.
 */

export const renderWithStore = (
  component: React.ReactElement,
  { preloadedState = {}, store = createMockStore(preloadedState) } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};
