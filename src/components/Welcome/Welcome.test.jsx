import React from 'react';
import { shallow } from 'enzyme';
import Welcome from './Welcome';

/* components */
import WelcomeCTA from './components/WelcomeCTA/WelcomeCTA';
import WelcomeCategories from './components/WelcomeCategories/WelcomeCategories';
import WelcomeChRIS from './components/WelcomeChRIS/WelcomeChRIS';
import WelcomeDevelopers from './components/WelcomeDevelopers/WelcomeDevelopers';

describe('Welcome', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Welcome />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render WelcomeCTA component', () => {
    expect(wrapper.containsMatchingElement(<WelcomeCTA />)).toEqual(true);
  });

  it('should render WelcomeCategories component', () => {
    expect(wrapper.containsMatchingElement(<WelcomeCategories />)).toEqual(true);
  });

  it('should render WelcomeChRIS component', () => {
    expect(wrapper.containsMatchingElement(<WelcomeChRIS />)).toEqual(true);
  });

  it('should render WelcomeDevelopers component', () => {
    expect(wrapper.containsMatchingElement(<WelcomeDevelopers />)).toEqual(true);
  });
});
