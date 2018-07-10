import React from 'react';
import { shallow } from 'enzyme';
import WelcomeCategories from './WelcomeCategories';

describe('WelcomeCategories', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<WelcomeCategories />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render welcome-categories div', () => {
    expect(wrapper.find('div.welcome-categories')).toHaveLength(1);
  });

  it('should render welcome-categories-header div inside welcome-categories', () => {
    expect(wrapper
      .find('div.welcome-categories')
      .find('div.welcome-categories-header')).toHaveLength(1);
  });
});
