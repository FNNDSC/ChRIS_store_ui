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

  it('should render welcome-cat-img div', () => {
    expect(wrapper.find('div.welcome-cta-img')).toHaveLength(1);
  });

  it('should render welcome-cta-header with row class', () => {
    expect(wrapper.find('div.welcome-cta-header').hasClass('row')).toEqual(true);
  });

  it('should render welcome-cta-featured div', () => {
    expect(wrapper.find('div.welcome-cta-featured')).toHaveLength(1);
  });

  it('should render welcome-cta-featured-container div', () => {
    expect(wrapper.find('div.welcome-cta-featured')).toHaveLength(1);
  });

  it('featured container should have row class', () => {
    expect(wrapper
      .find('div.welcome-cta-featured-container')
      .hasClass('row'))
      .toEqual(true);
  });

  it('should render 5 welcome features in the featured container', () => {
    expect(wrapper
      .find('div.welcome-cta-featured-container')
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

  it('should render welcome-user-cta-header div', () => {
    expect(wrapper
      .find('div.welcome-user-cta')
      .find('div.welcome-user-cta-header'))
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
