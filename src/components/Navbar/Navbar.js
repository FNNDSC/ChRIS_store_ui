import React, { Component } from 'react';
import {
  Brand,
  PageHeader,
  Nav,
  NavList,
  NavItem,
  PageHeaderTools,
  PageHeaderToolsItem
} from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';
import Search from './components/Search/Search';
import './Navbar.css';
import LogoImg from '../../assets/img/chris-plugin-store_logo.png';
import ChrisStore from '../../store/ChrisStore';

const Logo = (<Brand alt="ChRIS Plugin Store" src={LogoImg}/>);

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
  },
  // TODO special style for sign in/out buttons
  {
    label: 'Sign In',
    to: '/signin',
    cond: (store) => !store.get('isLoggedIn')
  },
  {
    label: 'Sign Out',
    to: '/signin',
    cond: (store) => store.get('isLoggedIn')
  }
];

/**
 * Conditionally renders a list of links into a <Nav>.
 */
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0
    };
  }

  onSelect(result) {
    this.setState({
      activeItem: result.itemId
    });
  }

  shouldShowLink(linkInfo) {
    if (!linkInfo.cond) {
      return true;
    }
    return linkInfo.cond(this.props.store);
  }

  render() {
    const { activeItem } = this.state;
    return (
      <Nav onSelect={this.onSelect} variant="horizontal">
        <NavList>
          {
            navLinks
              .filter((l) => this.shouldShowLink(l))
              .map(link => (
                <NavItem
                  key={link.to}
                  itemId={link.to}
                  isActive={activeItem === link.to}>
                  <NavLink to={link.to} activeClassName="pf-m-current">
                    {link.label}
                  </NavLink>
                </NavItem>
              ))
          }
        </NavList>
      </Nav>
    )
  }
}

const StatefulNavigation = ChrisStore.withStore(Navigation);
const statefulNavigation = (<StatefulNavigation />);

const HeaderTools = (
  <PageHeaderTools>
    <PageHeaderToolsItem>
      <Search />
    </PageHeaderToolsItem>
  </PageHeaderTools>
)

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
