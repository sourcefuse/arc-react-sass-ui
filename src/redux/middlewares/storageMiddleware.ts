/* eslint-disable camelcase */
import { Middleware } from "@reduxjs/toolkit";

const storageMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === "auth/setCredentials") {
    const { access_token, refresh_token, expires_in } = action.payload;

    // Update localStorage
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("expires", expires_in?.toString());
  }

  if (action.type === "auth/unsetCredentials") {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Pass the action to the next middleware or reducer
  return next(action);
};

export default storageMiddleware;
