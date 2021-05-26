import React from 'react';
import { shallow } from 'enzyme';
import { DeveloperCTA } from './DeveloperCTA';
import ConnectedDeveloperSignup from '../DeveloperSignup/DeveloperSignup';

describe('DeveloperCTA', () => {
  let wrapper;
  const initialStore = { state: { isLoggedIn: false }, get() { return false; } };
  beforeEach(() => {
    wrapper = shallow(<DeveloperCTA store={initialStore} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render developer-cta div', () => {
    expect(wrapper.find('div.developer-cta')).toHaveLength(1);
  });

  it('should render the Card component', () => {
    expect(wrapper.find('Card')).toHaveLength(1);
  });

  it('should render the CardBody component', () => {
    expect(wrapper.find('CardBody')).toHaveLength(1);
  });

  it('should render the DeveloperSignup component', () => {
    expect(wrapper.containsMatchingElement(<ConnectedDeveloperSignup />)).toEqual(true);
  });
});
