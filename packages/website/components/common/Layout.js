import React from "react";
import styled from "styled-components";

const StyledAside = styled.aside.attrs({
  className: "menu"
})`
  padding: 1rem;
`;

const Logo = styled.img`
  height: 3.5rem !important;
  max-height: 3.5rem !important;
`;

const Sidebar = () => {
  return (
    <StyledAside className="menu">
      <p className="menu-label">Hooks</p>
      <ul className="menu-list">
        <li>
          <a>useVisibilitySensor</a>
        </li>
        <li>
          <a>useNetworkStatus</a>
        </li>
      </ul>
    </StyledAside>
  );
};

function Header(props) {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://react-hooks.org">
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

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div class="columns is-gapless">
        <div class="column is-2">
          <Sidebar />
        </div>

        <div class="column">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
