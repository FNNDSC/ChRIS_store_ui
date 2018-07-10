import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';

describe('Footer', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Footer />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a div with class footer', () => {
    expect(wrapper.find('div.footer')).toHaveLength(1);
  });

  it('should render a footer-row div inside the footer div', () => {
    expect(wrapper
      .find('div.footer')
      .find('div.footer-row'))
      .toHaveLength(1);
  });

  it('should render a footer-logo div inside row div', () => {
    expect(wrapper
      .find('div.footer')
      .find('div.footer-logo'))
      .toHaveLength(1);
  });

  it('should render an img element inside footer-img div', () => {
    expect(wrapper
      .find('div.footer-logo')
      .find('img'))
      .toHaveLength(1);
  });

  it('should render a footer-body div inside row div', () => {
    expect(wrapper
      .find('div.footer')
      .find('div.footer-body'))
      .toHaveLength(1);
  });

  it('should render a footer-desc div inside footer-body div', () => {
    expect(wrapper
      .find('div.footer-body')
      .find('div.footer-desc'))
      .toHaveLength(1);
  });

  it('should render a footer-links div inside footer-body div', () => {
    expect(wrapper
      .find('div.footer-body')
      .find('div.footer-links'))
      .toHaveLength(1);
  });

  it('should render 8 footer-link divs inside footer-links div', () => {
    expect(wrapper
      .find('div.footer-links')
      .find('div.footer-link'))
      .toHaveLength(8);
  });

  it('should render footer-copyright inside footer div', () => {
    expect(wrapper
      .find('.footer')
      .find('div.footer-copyright'))
      .toHaveLength(1);
  });
});
