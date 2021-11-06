import React from 'react';
import { shallow } from 'enzyme';
import WelcomeCTA from './WelcomeCTA';

describe('WelcomeCTA', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<WelcomeCTA />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render welcomeCtaImg div', () => {
    expect(wrapper.find('div.welcomeCtaImg')).toHaveLength(1);
  });

  it('should render welcomeCtaHeader with row class', () => {
    expect(wrapper.find('div.welcomeCtaHeader').hasClass('row')).toEqual(true);
  });

  it('should render welcomeCtaFeatured div', () => {
    expect(wrapper.find('div.welcomeCtaFeatured')).toHaveLength(1);
  });

  it('should render welcomeCtaFeaturedContainer div', () => {
    expect(wrapper.find('div.welcomeCtaFeatured')).toHaveLength(1);
  });

  it('featured container should have row class', () => {
    expect(wrapper
      .find('div.welcomeCtaFeaturedContainer')
      .hasClass('row'))
      .toEqual(true);
  });

  it('should render 5 welcome features in the featured container', () => {
    expect(wrapper
      .find('div.welcomeCtaFeaturedContainer')
      .find('WelcomeFeature'))
      .toHaveLength(5);
  });

  it('should render welcome-scroll-caret div', () => {
    expect(wrapper.find('div.welcome-scroll-caret')).toHaveLength(1);
  });

  it('should render an Icon component inside of the scroll caret div', () => {
    expect(wrapper
      .find('div.welcome-scroll-caret')
      .find('Icon'))
      .toHaveLength(1);
  });

  it('should render row with welcome-user-cta div inside', () => {
    expect(wrapper
      .find('div.row > div.welcome-user-cta')
      .find('div.welcome-user-cta'))
      .toHaveLength(1);
  });

  it('should render welcome-user-ctaHeader div', () => {
    expect(wrapper
      .find('div.welcome-user-cta')
      .find('div.welcome-user-ctaHeader'))
      .toHaveLength(1);
  });

  it('should render 2 text-light divs inside the welcome user cta', () => {
    expect(wrapper
      .find('div.welcome-user-cta')
      .find('div.text-light'))
      .toHaveLength(2);
  });

  it('should render br element inside the welcome user cta', () => {
    expect(wrapper
      .find('div.welcome-user-cta')
      .find('br'))
      .toHaveLength(1);
  });
});
