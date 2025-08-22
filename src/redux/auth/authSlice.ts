/* eslint-disable camelcase */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PermissionsEnum } from "Constants/enums/permissions";
import { RootState } from "redux/store";

export interface AuthData {
  accessToken: string | null;
  refreshToken: string | null;
  expires: number | null;
}

export interface AuthResData {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

export interface AuthState extends AuthData {
  isLoggedIn: boolean;
  permissions: PermissionsEnum[] | null;
  hashSecret?: string;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") ?? null,
  refreshToken: localStorage.getItem("refreshToken") ?? null,
  expires: +localStorage.getItem("expires")! || null,
  isLoggedIn: !!localStorage.getItem("accessToken"),
  permissions: null,
  hashSecret: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResData>) => {
      const { access_token, refresh_token, expires_in } = action.payload;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.expires = expires_in;
      state.isLoggedIn = true;
    },
    unsetCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expires = null;
      state.isLoggedIn = false;
    },
    setPermissions: (state, action: PayloadAction<PermissionsEnum[]>) => {
      state.permissions = action.payload;
    },
    setHashSecret: (state, action: PayloadAction<string>) => {
      state.hashSecret = action.payload;
    },
  },
});

export const {
  setCredentials,
  unsetCredentials,
  setPermissions,
  setHashSecret,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentLoginStatus = (state: RootState) =>
  state.auth.isLoggedIn;
export const selectCurrentAccessToken = (state: RootState) =>
  state.auth.accessToken;
export const selectCurrentRefreshToken = (state: RootState) =>
  state.auth.refreshToken;
export const selectCurrentAuthState = (state: RootState) => state.auth;
export const selectCurrentPermissions = (state: RootState) =>
  state.auth.permissions;
export const selectHashSecret = (state: RootState) => state.auth.hashSecret;
