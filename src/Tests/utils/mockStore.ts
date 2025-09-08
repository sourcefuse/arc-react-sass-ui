import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "redux/apiSlice";
import storageMiddleware from "redux/middlewares/storageMiddleware";
import authReducer from "../../redux/auth/authSlice";
import configReducer from "../../redux/config/configSlice";

export const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      config: configReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(storageMiddleware, apiSlice.middleware),
    preloadedState,
  });
};
