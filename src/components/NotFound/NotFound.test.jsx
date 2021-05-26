import React from 'react';
import { shallow } from 'enzyme';
import NotFound from './NotFound';

describe('NotFound', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NotFound />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render not-found div', () => {
    expect(wrapper
      .find('div.not-found')
      .find('img'))
      .toHaveLength(1);
  });
});
