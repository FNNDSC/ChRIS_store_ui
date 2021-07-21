import React from 'react';
import { shallow } from 'enzyme';
import LoadingContainer from './LoadingContainer';

describe('LoadingContainer', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LoadingContainer />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading-container div', () => {
    expect(wrapper.find('div.loading-container')).toHaveLength(1);
  });

  it('should render className prop', () => {
    wrapper.setProps({ className: 'testClass' });
    expect(wrapper.find('div.loading-container.testClass')).toHaveLength(1);
  });
});

const withChildren = (
  <LoadingContainer>
    <div className="test-div" />
  </LoadingContainer>
);

describe('rendered LoadingContainer', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(withChildren);
  });

  it('should render children prop', () => {
    expect(wrapper
      .find('div.loading-container')
      .find('div.test-div'))
      .toHaveLength(1);
  });
});
