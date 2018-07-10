import React from 'react';
import { shallow } from 'enzyme';
import WelcomeChRIS from './WelcomeChRIS';

describe('WelcomeChRIS', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<WelcomeChRIS />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render welcome-chris div', () => {
    expect(wrapper.find('div.welcome-chris')).toHaveLength(1);
  });

  it('should render 2 row divs', () => {
    expect(wrapper.find('div.row')).toHaveLength(2);
  });

  it('should render welcome-chris-text div', () => {
    expect(wrapper.find('div.welcome-chris-text')).toHaveLength(1);
  });

  it('should render welcome-chris-text-container', () => {
    expect(wrapper.find('div.welcome-chris-text-container')).toHaveLength(1);
  });

  it('should render welcome-chris-video-column', () => {
    expect(wrapper.find('div.welcome-chris-video-column')).toHaveLength(1);
  });

  it('should render welcome-chris-video iframe', () => {
    expect(wrapper.find('iframe.welcome-chris-video')).toHaveLength(1);
  });

  it('should render welcome-chris-video desc p element', () => {
    expect(wrapper.find('p.welcome-chris-video-desc')).toHaveLength(1);
  });

  it('should render welcome-chris-btn-row div', () => {
    expect(wrapper.find('div.welcome-chris-btn-row')).toHaveLength(1);
  });

  it('should render 2 Button components in welcome-chris-btn-row', () => {
    expect(wrapper
      .find('div.welcome-chris-btn-row')
      .find('Button').length)
      .toEqual(2);
  });

  it('should render span inside welcome-chris div', () => {
    expect(wrapper
      .find('div.welcome-chris')
      .find('span')).toHaveLength(1);
  });

  it('should render welcome-chris-banner img', () => {
    expect(wrapper.find('img.welcome-chris-banner')).toHaveLength(1);
  });
});
