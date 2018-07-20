import React from 'react';
import { shallow } from 'enzyme';
import Navbar from './Navbar';

describe('Navbar', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Navbar />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render nav element', () => {
    expect(wrapper.find('nav')).toHaveLength(1);
  });

  it('should render navbar-row div inside nav', () => {
    expect(wrapper.find('div.navbar-row')).toHaveLength(1);
  });

  it('should render 5 NavLink components', () => {
    expect(wrapper.find('NavLink')).toHaveLength(5);
  });

  it('navbar brand should have href="/" attribute', () => {
    expect(wrapper.find('NavLink.navbar-brand').prop('href')).toEqual('/');
  });

  it('navbar brand should have to="/" attribute', () => {
    expect(wrapper.find('NavLink.navbar-brand').prop('to')).toEqual('/');
  });

  it('should render navbar-trigger inside navbar-header', () => {
    expect(wrapper
      .find('div.navbar-header')
      .find('div.navbar-trigger'))
      .toHaveLength(1);
  });

  it('should change state when the navbar-trigger div is clicked', () => {
    expect(wrapper.state('open')).toEqual(false);
    wrapper.find('div.navbar-trigger').simulate('click');
    expect(wrapper.state('open')).toEqual(true);
  });

  it('should render Search component inside navbar-header', () => {
    expect(wrapper
      .find('div.navbar-header')
      .find('Search'))
      .toHaveLength(1);
  });

  it('should render navbar-logo-img img inside navbar-brand Link', () => {
    expect(wrapper
      .find('Link.navbar-brand')
      .find('img.navbar-logo-img'))
      .toHaveLength(1);
  });

  it('should render navbar-collapse div', () => {
    expect(wrapper.find('div.navbar-collapse')).toHaveLength(1);
  });

  it("should render 2 navbar-nav ul's", () => {
    expect(wrapper.find('ul.navbar-nav')).toHaveLength(2);
  });

  it('should render plugins NavLink', () => {
    expect(wrapper.find('NavLink.navbar-plugins-btn')).toHaveLength(1);
  });

  it('plugins button should have href="/plugins" attribute', () => {
    expect(wrapper.find('NavLink.navbar-plugins-btn').prop('href'))
      .toEqual('/plugins');
  });

  it('plugins button should have to="/plugins" attribute', () => {
    expect(wrapper.find('NavLink.navbar-plugins-btn').prop('to'))
      .toEqual('/plugins');
  });

  it('should render developers NavLink', () => {
    expect(wrapper.find('NavLink.navbar-developers-btn')).toHaveLength(1);
  });

  it('developers button should have href="/developers" attribute', () => {
    expect(wrapper.find('NavLink.navbar-developers-btn').prop('href'))
      .toEqual('/developers');
  });

  it('developers button should have to="/developers" attribute', () => {
    expect(wrapper.find('NavLink.navbar-developers-btn').prop('to'))
      .toEqual('/developers');
  });

  it('should render Sign in button', () => {
    expect(wrapper.find('Button.navbar-signin-btn')).toHaveLength(1);
  });

  it("should change state when navbar-dropdown-btn's are clicked", () => {
    wrapper.find('NavLink.navbar-dropdowns-btn').forEach((NavLink) => {
      expect(wrapper.state('open')).toEqual(false);
      NavLink.simulate('click');
      expect(wrapper.state('open')).toEqual(true);
      wrapper.setState({ open: false });
    });
  });

  it('should change state when enter key is pressed on navbar-trigger', () => {
    expect(wrapper.state('open')).toEqual(false);
    wrapper.find('div.navbar-trigger').simulate('keypress', { key: 'Enter' });
    expect(wrapper.state('open')).toEqual(true);
  });

  it('should change Collapse in attribute according to open state', () => {
    // prop should be false
    let collapse = wrapper.find('Collapse');
    expect(collapse.prop('in')).toEqual(false);

    // set state
    wrapper.setState({ open: true });

    // prop should be true
    collapse = wrapper.find('Collapse');
    expect(collapse.prop('in')).toEqual(true);
  });
});
