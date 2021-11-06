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

  it('should render welcomeCategories div', () => {
    expect(wrapper.find('div.welcomeCategories')).toHaveLength(1);
  });

  it('should render welcomeCategoriesHeader div inside welcomeCategories', () => {
    expect(wrapper
      .find('div.welcomeCategories')
      .find('div.welcomeCategoriesHeader')).toHaveLength(1);
  });
});
