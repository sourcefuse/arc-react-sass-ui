import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { Configuration, fetchConfigData } from "./configThunk";

const initialState: {
  configData: Configuration | null;
  status: string;
  error: string | null;
} = {
  configData: null,
  status: "idle",
  error: null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConfigData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.configData = action.payload;
      })
      .addCase(fetchConfigData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      });
  },
});

export default configSlice.reducer;

// Selectors
export const selectConfigData = (state: RootState) => state.config.configData;
export const selectConfigStatus = (state: RootState) => state.config.status;
export const selectConfigError = (state: RootState) => state.config.error;
