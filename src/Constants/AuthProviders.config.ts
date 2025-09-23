import { AuthProvider } from "./enums/AuthProvider.enum";
export const AuthProviderConfig: Record<
  AuthProvider,
  { name: string; loginPath: string }
> = {
  [AuthProvider.KEYCLOAK]: {
    name: "Sign in with Keycloak",
    loginPath: "/auth/login",
  },
  [AuthProvider.COGNITO]: {
    name: "Sign in with Cognito",
    loginPath: "/auth/cognito/login", 
  },
};
