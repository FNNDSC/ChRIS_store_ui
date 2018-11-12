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

  it('should render 3 FormGroup components', () => {
    expect(wrapper.find('FormGroup')).toHaveLength(3);
  });

  it('should render 3 ControlLabel components', () => {
    expect(wrapper.find('ControlLabel')).toHaveLength(3);
  });

  it('should render 3 FormControl components', () => {
    expect(wrapper.find('FormControl')).toHaveLength(3);
  });

  it('should render 3 HelpBlock components', () => {
    expect(wrapper.find('HelpBlock')).toHaveLength(3);
  });
});
