import React from 'react';
import { shallow } from 'enzyme';
import LoadingPluginItem from './LoadingPluginItem';

describe('LoadingPluginItem', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LoadingPluginItem />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render LoadingContainer component', () => {
    expect(wrapper.find('LoadingContainer')).toHaveLength(1);
  });

  it('should render LoadingContainer with loading-plugin-item class', () => {
    expect(wrapper
      .find('LoadingContainer.loading-plugin-item')
      .prop('className'))
      .toEqual('loading-plugin-item');
  });

  it('should render 3 LoadingContent components', () => {
    expect(wrapper.find('LoadingContent')).toHaveLength(3);
  });
});
