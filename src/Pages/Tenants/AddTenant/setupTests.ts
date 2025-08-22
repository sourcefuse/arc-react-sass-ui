import { server } from "../../../Tests/utils/mockServer";

// Start the mock server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Stop the mock server after all tests
afterAll(() => server.close());
