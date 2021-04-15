import React, { useState } from 'react';
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
import { NavLink, useHistory } from 'react-router-dom';
import Search from './components/Search/Search';
import './Navbar.css';
import LogoImg from '../../assets/img/chris-plugin-store_logo.png';
import ChrisStore from '../../store/ChrisStore';

const navLinks = [
  {
    label: 'Plugins',
    to: '/plugins'
  },
  {
    label: 'Quick Start',
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
  const [searchKey, setSearchKey] = useState('');
  const history = useHistory();
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
        <NavItem>
          <Search 
            placeholder="Search Plugin"
            value={searchKey}
            onChange={(value) => setSearchKey(value)}
            onClear={() => setSearchKey('')}
            onSearch={() => {history.push('/plugins')}}
          />
        </NavItem>
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

const HeaderTools = (
  <PageHeaderTools>
    <PageHeaderToolsItem>
      <StatefulLoginButton />
    </PageHeaderToolsItem>
  </PageHeaderTools>
)

const Logo = (<Brand alt="ChRIS Plugin Store" src={LogoImg}/>);

const Navbar = () => (
  <PageHeader
    logo={Logo}
    logoComponent={NavLink}
    logoProps={{to: '/'}}
    topNav={statefulNavigation}
    headerTools={HeaderTools}
  />
);

export default Navbar;
