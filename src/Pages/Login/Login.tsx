import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import arcLogo from "Assets/logo-header.png";
import cloudBg from "Assets/arcSaas.png";
import { colors } from "Providers/theme/colors";
import useConfig from "Hooks/useConfig";
import {
  BackgroundContainer,
  BackgroundImage,
  ContentLayer,
  MainContent,
  ContentBox,
  Logo,
} from "./styles";
import { AuthButton, LoadingSpinner } from "./Buttons";
import { AuthProviders } from "./AuthProviders";
import { redirectToAuthLoginPage } from "Helpers/utils";
import { AuthProvider } from "Constants/enums/AuthProvider.enum";

interface LoginPageProps {
  onSignIn?: (provider: string) => void;
}

const Login: React.FC<LoginPageProps> = ({
  onSignIn = (provider) => console.log(`Signing in with ${provider}`),
}) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const providers = AuthProviders.getProviders();
  const { config } = useConfig();

  const handleSignIn = async (providerId: string) => {
    setIsLoading(providerId);
    const provider = providerId as AuthProvider;
    redirectToAuthLoginPage(config.authApiBaseUrl, provider);
    setTimeout(() => {
      setIsLoading(null);
      onSignIn(providerId);
    }, 1000);
  };

  return (
    <BackgroundContainer>
      <BackgroundImage src={cloudBg} alt="ARC SaaS Cloud Background" />
      <ContentLayer>
        <MainContent>
          <ContentBox>
            <Logo src={arcLogo} alt="ARC Logo" />
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: "2.5rem", lg: "3rem" },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                  color: colors.blackText,
                }}
              >
                {config.appName}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.125rem",
                  lineHeight: 1.5,
                  color: colors.blackText,
                }}
              >
                {config.appDescription}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {providers.map((provider) => (
                <Box key={provider.id} sx={{ position: "relative" }}>
                  <AuthButton
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading === provider.id}
                    isLoading={isLoading === provider.id}
                  >
                    {provider.name}
                    {isLoading === provider.id && (
                      <LoadingSpinner size={24} thickness={4} />
                    )}
                  </AuthButton>
                </Box>
              ))}
            </Box>
          </ContentBox>
        </MainContent>
      </ContentLayer>
    </BackgroundContainer>
  );
};
export default Login;
