import styled from "styled-components";

export const H1 = styled.h1`
  color: ${props =>
    props.theme.h1Color || props.theme.headingColor || "cornflowerblue"};
`;
export const H2 = styled.h2`
  color: ${props =>
    props.theme.h2Color || props.theme.headingColor || "cornflowerblue"};
`;

export const H3 = styled.h3`
  text-decoration: underline;
  color: ${props =>
    props.theme.h3Color || props.theme.headingColor || "cornflowerblue"};
`;
