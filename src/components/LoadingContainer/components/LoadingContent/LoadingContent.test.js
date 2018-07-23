import React from 'react';
import { shallow } from 'enzyme';
import LoadingContent from './LoadingContent';

describe('LoadingContent', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LoadingContent width="" height="" />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading div', () => {
    expect(wrapper.find('div.loading')).toHaveLength(1);
  });

  it('should render width and height props in CSS', () => {
    wrapper.setProps({
      width: '314px',
      height: '159px',
    });

    const styleProp = wrapper.find('div.loading').prop('style');
    expect(styleProp.width).toEqual('314px');
    expect(styleProp.height).toEqual('159px');
  });

  it('should render className prop', () => {
    wrapper.setProps({
      className: 'testClass',
    });

    expect(wrapper.find('div.loading.testClass')).toHaveLength(1);
  });

  it('should render type prop', () => {
    wrapper.setProps({
      className: 'shouldHaveThisAlso',
      type: 'white',
    });

    expect(wrapper
      .find('div.loading.white.shouldHaveThisAlso'))
      .toHaveLength(1);
  });

  it('should render margin props in CSS', () => {
    wrapper.setProps({
      top: '265px',
      left: '358px',
      bottom: '979px',
      right: '323px',
    });

    const styleProp = wrapper.find('div.loading').prop('style');
    expect(styleProp.marginTop).toEqual('265px');
    expect(styleProp.marginLeft).toEqual('358px');
    expect(styleProp.marginBottom).toEqual('979px');
    expect(styleProp.marginRight).toEqual('323px');
  });
});
