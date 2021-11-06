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

  it('should render welcomeFeature div', () => {
    expect(wrapper.find('div.welcomeFeature')).toHaveLength(1);
  });

  it('should render welcomeFeatureImg img', () => {
    expect(wrapper.find('img.welcomeFeatureImg')).toHaveLength(1);
  });

  it('should render welcomeFeatureText div', () => {
    expect(wrapper.find('div.welcomeFeatureText')).toHaveLength(1);
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
    expect(wrapper.find('div.welcomeFeatureText').text()).toEqual('testName');
  });
});
