import { apiSlice } from "../apiSlice";
import { setHashSecret, setPermissions } from "./authSlice";
import { User } from "./user.model";

export interface ILoginForm {
  email: string;
  password: string;
}

export interface ICredentials extends ILoginForm {
  client_id: string;
}

export interface IAuthCallback {
  code: string;
}

export interface IAuthRedirectUrl {
  redirectUrl: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (authCode: IAuthCallback) => ({
        url: "/auth/callback",
        method: "POST",
        body: { ...authCode },
      }),
    }),
    logout: builder.mutation({
      query: (refreshToken: string | null) => ({
        url: "/auth/logout",
        method: "POST",
        body: { refreshToken },
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => ({ url: "/auth/me" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setPermissions(data.permissions));
          dispatch(setHashSecret(data.hashSecret));
        } catch (error) {
          console.error("Failed to set permissions:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetUserQuery } =
  authApiSlice;
