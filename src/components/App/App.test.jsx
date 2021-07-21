import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('App', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a div with className App', () => {
    expect(wrapper.find('div.App')).toHaveLength(1);
  });

  it('should render a BrowserRouter component', () => {
    expect(wrapper.find('BrowserRouter')).toHaveLength(1);
  });

  it('should render a Switch component inside BrowserRouters', () => {
    expect(wrapper
      .find('BrowserRouter')
      .find('Switch'))
      .toHaveLength(1);
  });

  it('should render 2 routes inside Switch component', () => {
    expect(wrapper
      .find('Switch')
      .find('Route'))
      .toHaveLength(2);
  });
});
