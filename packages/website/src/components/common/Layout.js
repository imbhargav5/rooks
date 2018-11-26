import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import fetch from "isomorphic-fetch";
import useInput from "@rooks/use-input";
import matchSorter, { rankings, caseRankings } from "match-sorter";
import useDidMount from "@rooks/use-did-mount";
import { Box, Flex, Heading } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HookNamesContext } from "../../utils/contexts";

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)``;

const StyledAside = styled.aside.attrs({
  className: "menu"
})`
  padding: 1rem;
`;

const StyledMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  a {
    color: ${props => props.theme.colors.blue};
  }
  ${StyledFontAwesomeIcon} {
    height: 1em;
    margin-right: 1em;
  }
`;

const Logo = styled.img`
  height: 3.5rem !important;
  max-height: 3.5rem !important;
`;

const useNpmBlob = () => {
  const [searchInfo, setSearchInfo] = useState([]);
  useDidMount(async () => {
    try {
      const response = await fetch("https://react-hooks.org/api/search");
      const jsonResponse = await response.json();
      const { results } = jsonResponse;
      const filteredList = results
        .filter(result => result.name[0].startsWith("@rooks/"))
        .map(r => {
          return {
            ...r,
            _name: r.name[0].slice(7)
          };
        });
      setSearchInfo(filteredList);
    } catch (err) {
      console.warn(err);
    }
  });
  return searchInfo;
};

const useFilteredNpmResults = inputValue => {
  const [results, setResults] = useState([]);
  const npmBlob = useNpmBlob();
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

const Sidebar = () => {
  const hooks = useContext(HookNamesContext);
  const autoCompleteInput = useInput("");
  const filteredResults = useFilteredNpmResults(autoCompleteInput.value);
  const hooksWithDisplayNames = hooks.map(hookName => `use-${hookName}`);
  const listToShow = autoCompleteInput.value.length
    ? filteredResults
    : hooksWithDisplayNames;
  return (
    <StyledAside className="menu">
      <Heading my={2}>Hooks</Heading>
      <input {...autoCompleteInput} />
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
            src="/static/logo.png"
            alt="Bulma: a modern CSS framework based on Flexbox"
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
    lightgray: "#f6f6ff",
    red: "#ff3860"
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
        <Header />
        <Flex>
          <Box width={[`30rem`]}>
            <Sidebar />
          </Box>
          <Box width={[1]} mx={4}>
            {children}
            <Footer />
          </Box>
        </Flex>
      </>
    </ThemeProvider>
  );
};

export default Layout;
