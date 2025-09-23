import useAuth from "Hooks/useAuth";
import useConfig from "Hooks/useConfig";
import React, { useEffect, useRef } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import BackdropLoader from "./BackdropLoader";

interface AuthRedirectWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for redirecting authenticated users.
 * Authenticated users will be redirected to the home page, while unauthenticated users will render the provided children.
 *
 * @param children - JSX element that will be rendered if the user is unauthenticated.
 * @returns The authentication redirect component.
 */
// sonarignore:start
export const AuthRedirectWrapper: React.FC<AuthRedirectWrapperProps> = ({
  children,
}) => {
  const { isLoggedIn, login, loginLoading } = useAuth();
  const {
    config: { authApiBaseUrl },
  } = useConfig();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isLoggedInRef = useRef(isLoggedIn);

  const code = searchParams.get("code");

  useEffect(() => {
    if (
      location.pathname === "/login" &&
      code &&
      !isLoggedInRef.current &&
      authApiBaseUrl
    ) {
      isLoggedInRef.current = true;
      login({ code });
    }
  }, [code, authApiBaseUrl, location.pathname, login]);

  if (loginLoading) return <BackdropLoader />;

  if (isLoggedIn) return <Navigate to={"/dashboard"} replace />;

  return <>{children}</>;
};
