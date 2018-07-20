import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'patternfly-react';
import { Collapse } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Search from './components/Search/Search';
import './Navbar.css';
import LogoImg from '../../assets/img/chris-plugin-store_logo.png';

class Navbar extends Component {
  constructor() {
    super();

    this.state = { open: false };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  toggleDropdown(e) {
    // only toggle the dropdown if the button is not active
    const isActive = e && e.target.className.indexOf('active') !== -1;
    if (!isActive) {
      this.setState(prevState => ({
        open: !prevState.open,
      }));
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') this.toggleDropdown();
  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-pf-vertical navbar-default">
          <div className="navbar-row row">
            <div className="navbar-header">
              <NavLink to="/" href="/" className="navbar-brand navbar-logo" tabIndex="0">
                <img
                  className="navbar-logo-img"
                  src={LogoImg}
                  alt="ChRIS Plugin Store"
                />
              </NavLink>
              <Search className="navbar-search" location={this.props.location} />
              <div
                className="navbar-trigger"
                role="menuitem"
                tabIndex="0"
                onClick={this.toggleDropdown}
                onKeyPress={this.handleKeyPress}
              >
                <Icon name="bars" />
              </div>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Button className="navbar-signin-btn" bsStyle="info" bsSize="large">
                    Sign in
                  </Button>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <NavLink to="/plugins" href="/plugins" className="navbar-plugins-btn">
                    Plugins
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/developers" href="/developers" className="navbar-developers-btn">
                    Developers
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Collapse in={this.state.open} className="navbar-dropdown">
          <div>
            <div className="navbar-dropdown-container">
              <div className="navbar-btn-container">
                <NavLink
                  to="/plugins"
                  href="/plugins"
                  className="navbar-dropdown-btn"
                  onClick={this.toggleDropdown}
                >
                  Plugins
                </NavLink>
              </div>
              <div className="navbar-btn-container">
                <NavLink
                  to="/developers"
                  href="/developers"
                  className="navbar-dropdown-btn"
                  onClick={this.toggleDropdown}
                >
                  Developers
                </NavLink>
              </div>
            </div>
          </div>
        </Collapse>
      </header>
    );
  }
}

Navbar.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

Navbar.defaultProps = {
  location: {
    search: '',
  },
};

export default Navbar;
