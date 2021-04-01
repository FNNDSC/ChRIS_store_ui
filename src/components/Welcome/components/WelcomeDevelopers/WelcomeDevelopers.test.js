import React from 'react';
import { shallow } from 'enzyme';
import WelcomeDevelopers from './WelcomeDevelopers';

describe('WelcomeDevelopers', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<WelcomeDevelopers />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render column div', () => {
    expect(wrapper.find('div.column')).toHaveLength(1);
  });

  it('should render the column div with class welcome-developers', () => {
    expect(wrapper
      .find('div.column')
      .hasClass('welcome-developers'))
      .toEqual(true);
  });

  it('should render the div with class welcome-developers-header', () => {
    expect(wrapper
      .find('div.column')
      .find('div.welcome-developers-header').length)
      .toEqual(1);
  });
});
