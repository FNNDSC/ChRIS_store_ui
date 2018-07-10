import React from 'react';
import { shallow } from 'enzyme';
import Developers from './Developers';
import DeveloperCTA from './components/DeveloperCTA/DeveloperCTA';
import Instructions from './components/Instructions/Instructions';

describe('Developers', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Developers />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the DeveloperCTA component', () => {
    expect(wrapper.containsMatchingElement(<DeveloperCTA />)).toEqual(true);
  });

  it('should render the Instructions component', () => {
    expect(wrapper.containsMatchingElement(<Instructions />)).toEqual(true);
  });
});
