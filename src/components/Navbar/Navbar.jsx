import React from 'react';
import {
  Brand,
  PageHeader,
  Nav,
  NavList,
  NavItem,
  PageHeaderTools,
  PageHeaderToolsItem,
} from '@patternfly/react-core';
import Button from '../Button';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import LogoImg from '../../assets/img/chris-plugin-store_logo.png';
import ChrisStore from '../../store/ChrisStore';

const navLinks = [
  {
    label: 'Plugins',
    to: '/plugins'
  },
  {
    label: 'Submit your Plugin',
    to: '/quickstart'
  },
  {
    label: 'Dashboard',
    to: '/dashboard',
    cond: (store) => store.get('isLoggedIn')
  }
];

/**
 * Conditionally renders a list of links into a <Nav>.
 */
const Navigation = ({ store }) => {
  const shouldShowLink = (linkInfo) => {
    if (!linkInfo.cond) {
      return true;
    }
    return linkInfo.cond(store);
  };
  return (
    <Nav variant="horizontal">
      <NavList>
        {
          navLinks
            .filter((l) => shouldShowLink(l))
            .map(link => (
              <NavItem
                key={link.to}
                itemId={link.to}
                isActive={window && window.location.pathname === link.to}>
                <NavLink to={link.to} activeClassName="pf-m-current">
                  {link.label}
                </NavLink>
              </NavItem>
            ))
        }
      </NavList>
    </Nav>
  );
}

const StatefulNavigation = ChrisStore.withStore(Navigation);
const statefulNavigation = (<StatefulNavigation />);

const LoginButton = ({ store }) => (
  <NavLink to="/signin">
    <Button
      variant="primary"
      className="login-button"
    >
      {store.get('isLoggedIn') ? 'Sign Out' : 'Sign In'}
    </Button>
  </NavLink>
);
const StatefulLoginButton = ChrisStore.withStore(LoginButton);

const Logo = (<Brand className="logo" alt="ChRIS Plugin Store" src={LogoImg}/>);

const Navbar = ({ searchComponent }) => {
  const HeaderTools = (
    <PageHeaderTools>
      <PageHeaderToolsItem>
        {searchComponent}
      </PageHeaderToolsItem>
      <PageHeaderToolsItem>
        <StatefulLoginButton />
      </PageHeaderToolsItem>
    </PageHeaderTools>
  )
  return (
  <PageHeader
    logo={Logo}
    logoComponent={NavLink}
    logoProps={{to: '/'}}
    topNav={statefulNavigation}
    headerTools={HeaderTools}
  />)
}
export default ChrisStore.withStore(Navbar);
