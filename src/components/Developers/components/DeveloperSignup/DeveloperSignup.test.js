import React from 'react';
import { shallow } from 'enzyme';
import DeveloperSignup from './DeveloperSignup';

describe('DeveloperSignup', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<DeveloperSignup />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Form component', () => {
    expect(wrapper.find('Form')).toHaveLength(1);
  });

  it('should render 4 FormGroup components', () => {
    expect(wrapper.find('FormGroup')).toHaveLength(4);
  });

  it('should render 4 ControlLabel components', () => {
    expect(wrapper.find('ControlLabel')).toHaveLength(4);
  });

  it('should render 4 FormControl components', () => {
    expect(wrapper.find('FormControl')).toHaveLength(4);
  });

  it('should render 4 HelpBlock components', () => {
    expect(wrapper.find('HelpBlock')).toHaveLength(4);
  });
});
