import React from 'react';
import {
  Button,
  Brand,
  PageHeader,
  Nav,
  NavList,
  NavItem,
  PageHeaderTools,
  PageHeaderToolsItem,
} from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import LogoImg from '../../assets/img/chris-plugin-store_logo.png';
import ChrisStore from '../../store/ChrisStore';

const navLinks = [
  {
    label: 'Plugins',
    to: '/plugins',
  },
  {
    label: 'Pipelines',
    to: '/pipelines',
  },
  {
    label: 'Submit your Plugin',
    to: '/quickstart',
  },
  
  {
    label: 'Dashboard',
    to: '/dashboard',
    if: (store) => store.get('isLoggedIn')
  }
];

/**
 * Conditionally renders a list of links into a <Nav>.
 */
const Navigation = ChrisStore.withStore(({ store }) => (
  <Nav variant="horizontal">
    <NavList>
      {
        navLinks
          .filter(link => {
            if (!link.if)
              return true;
            return link.if(store);
          })
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
));

const Navbar = ({ searchComponent, store }) => {
  const HeaderTools = (
    <PageHeaderTools>
      <PageHeaderToolsItem>
        {searchComponent}
      </PageHeaderToolsItem>
      <PageHeaderToolsItem>
        <NavLink to="/signin">
          <Button id="login-button">
            {store.get('isLoggedIn') ? 'Sign Out' : 'Sign In'}
          </Button>
        </NavLink>
      </PageHeaderToolsItem>
    </PageHeaderTools>
  )

  const Logo = (<Brand className="logo" alt="ChRIS Plugin Store" src={LogoImg}/>)
  
  return (
    <PageHeader
      logo={Logo}
      logoComponent={NavLink}
      logoProps={{to: '/'}}
      topNav={(<Navigation />)}
      headerTools={HeaderTools}
    />
  )
}
export default ChrisStore.withStore(Navbar);
