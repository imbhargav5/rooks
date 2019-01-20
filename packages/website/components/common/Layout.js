import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import useInput from "@rooks/use-input";
import matchSorter, { rankings, caseRankings } from "match-sorter";
import { Box, Flex, Heading } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HookNamesContext, NpmBlobContext } from "../../utils/contexts";

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)``;

const StyledAside = styled.aside.attrs({
  className: "menu"
})`
  padding: 1rem;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const LeftBox = styled(Box)`
  position: relative;
  height: 100%;
  box-shadow: 0 0 0.5rem #9da5ab;
`;
const RightBox = styled(Box)`
  overflow: auto;
  height: 100%;
`;

const StyledInput = styled.input`
  background-color: #fff;
  border-color: #dbdbdb;
  color: #363636;
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  max-width: 100%;
  width: 100%;
`;

const StyledMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  a {
    transition: all 0.25s ease;
    padding: 0.75rem 1rem;
    margin: 0 -1rem;
    background-color: white;
    display: block;
    border-bottom: 1px solid ${props => props.theme.colors.lightgray};
    color: ${props => props.theme.colors.blue};
    &:hover {
      color: white;
      background-color: ${props => props.theme.colors.blue};
    }
  }
  ${StyledFontAwesomeIcon} {
    height: 1em;
    margin-right: 1em;
  }
`;

const Logo = styled.img`
  height: 8rem !important;
  max-height: 8rem !important;
`;

const useFilteredNpmResults = inputValue => {
  const [results, setResults] = useState([]);
  const npmBlob = useContext(NpmBlobContext);
  useEffect(
    () => {
      const newResults = matchSorter(npmBlob, inputValue, {
        keys: ["_name", "name", "keywords", "description"]
      }).map(result => result._name);
      setResults(newResults);
    },
    [inputValue]
  );
  return results;
};

const Sidebar = ({ children }) => {
  const hooks = useContext(HookNamesContext);
  const autoCompleteInput = useInput("");
  const filteredResults = useFilteredNpmResults(autoCompleteInput.value);
  const hooksWithDisplayNames = hooks.map(hookName => `use-${hookName}`);
  const listToShow = autoCompleteInput.value.length
    ? filteredResults
    : hooksWithDisplayNames;
  return (
    <StyledAside className="menu">
      {children}
      <Heading my={2}>Hooks</Heading>
      <StyledInput
        className="input"
        type="text"
        placeholder="Search hooks"
        {...autoCompleteInput}
      />
      <StyledMenu>
        {listToShow.map(hookDisplayName => {
          return (
            <li key={hookDisplayName}>
              <a href={`/hook/${hookDisplayName}`}>
                <StyledFontAwesomeIcon icon="arrow-right" />
                {hookDisplayName}
              </a>
            </li>
          );
        })}
      </StyledMenu>
    </StyledAside>
  );
};

function Header(props) {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <Logo
            src="https://i.gyazo.com/67b004be5aa811e9ccd8375b9ce274e1.png"
            alt="Rooks. A hooks framework for react."
          />
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>
    </nav>
  );
}

const Footer = () => (
  <footer className="footer">
    <div className="content has-text-centered">
      <p>
        <strong>react-hooks.org</strong> by{" "}
        <a href="https://imbhargav5.com" target="_blank">
          Bhargav Ponnapalli
        </a>
        . The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The
        website content is licensed{" "}
        <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
          CC BY NC SA 4.0
        </a>
        .
      </p>
    </div>
  </footer>
);

const theme = {
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
  colors: {
    blue: "#07c",
    blue2: "dodgerblue",
    blue3: "cornflowerblue",
    lightgray: "#f6f6ff",
    red: "#ff3860",
    purple: "rebeccapurple"
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fonts: {
    sans: "system-ui, sans-serif",
    mono: "Menlo, monospace"
  },
  fontWeights: {
    bold: 700,
    normal: 400,
    light: 100
  },
  shadows: {
    small: "0 0 4px rgba(0, 0, 0, .125)",
    large: "0 0 24px rgba(0, 0, 0, .125)"
  }
};

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Flex style={{ height: "100%" }}>
          <LeftBox width={[`30rem`]}>
            <Sidebar>
              <Header />
            </Sidebar>
          </LeftBox>
          <RightBox width={[1]} px={4} pb={100}>
            {children}
            <Footer />
          </RightBox>
        </Flex>
      </>
    </ThemeProvider>
  );
};

export default Layout;
