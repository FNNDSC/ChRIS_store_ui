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

  it('should render a footerRow div inside the footer div', () => {
    expect(wrapper
      .find('div.footer')
      .find('div.footerRow'))
      .toHaveLength(1);
  });

  it('should render a footerLogo div inside row div', () => {
    expect(wrapper
      .find('div.footer')
      .find('div.footerLogo'))
      .toHaveLength(1);
  });

  it('should render an img element inside footerLogo div', () => {
    expect(wrapper
      .find('div.footerLogo')
      .find('img'))
      .toHaveLength(1);
  });

  it('should render img logo with alt text "ChRIS Plugin Store"', () => {
    expect(wrapper
      .find('div.footerLogo')
      .find('img')
      .prop('alt'))
      .toEqual('ChRIS Plugin Store');
  });

  it('should render a footerBody div inside row div', () => {
    expect(wrapper
      .find('div.footer')
      .find('div.footerBody'))
      .toHaveLength(1);
  });

  it('should render a footerDesc div inside footerBody div', () => {
    expect(wrapper
      .find('div.footerBody')
      .find('div.footerDesc'))
      .toHaveLength(1);
  });

  it('should render a footerLinks div inside footerBody div', () => {
    expect(wrapper
      .find('div.footerBody')
      .find('div.footerLinks'))
      .toHaveLength(1);
  });

  it('should render 5 footerLink divs inside footerLinks div', () => {
    expect(wrapper
      .find('div.footerLinks')
      .find('div.footerLink'))
      .toHaveLength(5);
  });

  it('should render footerCopyright inside footer div', () => {
    expect(wrapper
      .find('.footer')
      .find('div.footerCopyright'))
      .toHaveLength(1);
  });
});
