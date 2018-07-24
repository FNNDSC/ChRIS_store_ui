import React from 'react';
import { shallow } from 'enzyme';
import SignIn from './SignIn';

describe('SignIn', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SignIn />);
  });

  it('should render signin div', () => {
    expect(wrapper.find('div.signin')).toHaveLength(1);
  });

  it('should render h1 inside signin div', () => {
    expect(wrapper
      .find('div.signin')
      .find('h1'))
      .toHaveLength(1);
  });
});
