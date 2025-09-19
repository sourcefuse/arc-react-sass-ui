import { Box, styled } from "@mui/material";
export const BackgroundContainer = styled(Box)({
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
});

export const BackgroundImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
});

export const ContentLayer = styled(Box)({
  position: "relative",
  zIndex: 10,
  minHeight: "100vh",
});

export const MainContent = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "0 90px",
});

export const ContentBox = styled(Box)({
  maxWidth: 420,
  width: "100%",
  textAlign: "left",
});

export const Logo = styled("img")({
  height: 48,
  width: "auto",
  marginBottom: 32,
});
