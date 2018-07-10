import React from 'react';
import { shallow, mount } from 'enzyme';
import WelcomeFeature from './WelcomeFeature';

describe('WelcomeFeature', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<WelcomeFeature img="" name="" />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render welcome-feature div', () => {
    expect(wrapper.find('div.welcome-feature')).toHaveLength(1);
  });

  it('should render welcome-feature-img img', () => {
    expect(wrapper.find('img.welcome-feature-img')).toHaveLength(1);
  });

  it('should render welcome-feature-text div', () => {
    expect(wrapper.find('div.welcome-feature-text')).toHaveLength(1);
  });
});

describe('mounted WelcomeFeature', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<WelcomeFeature img="" name="" />);
  });

  it('renders the value of img', () => {
    wrapper.setProps({ img: 'testImageSrc' });
    expect(wrapper.find('img').prop('src')).toEqual('testImageSrc');
  });

  it('renders the value of name', () => {
    wrapper.setProps({ name: 'testName' });
    expect(wrapper.find('div.welcome-feature-text').text()).toEqual('testName');
  });
});
