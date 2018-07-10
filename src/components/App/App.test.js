import React from 'react';
import { shallow } from 'enzyme';
import Router from '../Router/Router';
import App from './App';

describe('App', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a <div />', () => {
    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('should render the Router component', () => {
    expect(wrapper.containsMatchingElement(<Router />)).toEqual(true);
  });
});
