import React, { Component } from 'react';
import { Button, Icon } from 'patternfly-react';
import { Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LogoImg from '../../assets/img/chris-plugin-store_logo.png';

class Navbar extends Component {
  constructor() {
    super();

    this.state = { open: false };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  toggleDropdown() {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') this.toggleDropdown();
  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-pf-vertical navbar-default">
          <div className="row no-flex">
            <div className="navbar-header">
              <Link to="/" href="/" className="navbar-brand navbar-logo" tabIndex="0">
                <img
                  className="navbar-logo-img"
                  src={LogoImg}
                  alt="ChRIS Plugin Store"
                />
              </Link>
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
                  <Link to="/plugins" href="/plugins" className="navbar-plugins-btn">
                    Plugins
                  </Link>
                </li>
                <li>
                  <Link to="/developers" href="/developers" className="navbar-developers-btn">
                    Developers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Collapse in={this.state.open} className="navbar-dropdown">
          <div>
            <div className="navbar-dropdown-container">
              <div className="navbar-btn-container">
                <Link
                  to="/plugins"
                  href="/plugins"
                  className="navbar-dropdown-btn"
                  onClick={this.toggleDropdown}
                >
                  Plugins
                </Link>
              </div>
              <div className="navbar-btn-container">
                <Link
                  to="/developers"
                  href="/developers"
                  className="navbar-dropdown-btn"
                  onClick={this.toggleDropdown}
                >
                  Developers
                </Link>
              </div>
            </div>
          </div>
        </Collapse>
      </header>
    );
  }
}

export default Navbar;
