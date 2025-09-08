import { setupServer } from "msw/node";
import { handlers } from "./mockHandler";

export const server = setupServer(...handlers);
