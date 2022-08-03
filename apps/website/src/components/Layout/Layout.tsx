import { styled } from "@stitches/react";

export const MainLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "280px 1fr 220px",
  gridColumnGap: "16px",
  maxWidth: 1320,
  margin: "auto",
});

export const LeftSidebar = styled("div", {
  padding: "16px",
  borderRight: "1px solid #e0e0e0",
  boxSizing: "border-box",
  overflowY: "auto",
  maxHeight: "100vh",
  position: "sticky",
  top: 0,
  zIndex: 1,
  overflowX: "hidden",
  "& > *": {
    marginBottom: "16px",
  },
  "& > *:last-child": {
    marginBottom: 0,
  },
});

export const RightSidebar = styled("div", {
  padding: "16px",
  borderLeft: "1px solid #e0e0e0",
  boxSizing: "border-box",
  overflowY: "auto",
  maxHeight: "100vh",
  position: "sticky",
  top: 0,
  zIndex: 1,
  overflowX: "hidden",
  "& > *": {
    marginBottom: "16px",
  },
  "& > *:last-child": {
    marginBottom: 0,
  },
});
