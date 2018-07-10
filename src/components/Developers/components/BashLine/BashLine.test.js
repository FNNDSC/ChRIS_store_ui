import React from 'react';
import { mount, shallow } from 'enzyme';
import BashLine from './BashLine';

describe('BashLine', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<BashLine command="" />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('mounted BashLine', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<BashLine command="" />);
  });

  it('renders the value of command', () => {
    wrapper.setProps({ command: 'command' });
    expect(wrapper.find('.bash-line-command').text()).toEqual('$ command');
  });
});
