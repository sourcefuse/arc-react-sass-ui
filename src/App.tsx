import BackdropLoader from "Components/BackdropLoader";
import SessionTimeout from "Components/SessionTimeout/SessionTimeout";
import useAuth from "Hooks/useAuth";
import useConfig from "Hooks/useConfig";
import AppRoutes from "Routes/Routes";
import { getRouteConfig } from "Routes/layoutRouteConfig";
import { useEffect } from "react";
import { selectConfigStatus } from "redux/config/configSlice";
import { fetchConfigData } from "redux/config/configThunk";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { Helmet } from "react-helmet-async";
function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectConfigStatus);
  const { config } = useConfig();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchConfigData());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <BackdropLoader />;
  }

  return (
    <>
      <AppRoutes routesConfig={getRouteConfig()} />
      {config.enableSessionTimeout && isLoggedIn ? (
        <SessionTimeout
          expiryTimeInMinute={config.expiryTimeInMinute}
          promptTimeBeforeIdleInMinute={config.promptTimeBeforeIdleInMinute}
        />
      ) : null}
      <Helmet>
        <title>{config.appName}</title>
        <meta
          name="description"
          content={config?.appDescription || "Generic app description"}
        />
      </Helmet>
    </>
  );
}

export default App;
