import React from 'react';
import { shallow } from 'enzyme';
import Instructions from './Instructions';


describe('Instructions', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Instructions />);
  });

  it('should render instructions div', () => {
    expect(wrapper.find('div.instructions')).toHaveLength(1);
  });

  it('should render instructions-steps div', () => {
    expect(wrapper.find('div.instructions-steps')).toHaveLength(1);
  });

  it('should render 5 instructions-step divs', () => {
    expect(wrapper.find('div.instructions-step')).toHaveLength(5);
  });

  it('should render an h1 element', () => {
    expect(wrapper.find('h1')).toHaveLength(1);
  });

  it('should have a number to go with every instruction step', () => {
    expect(Array
      .from(wrapper.find('div.instructions-step'))
      .every(step => shallow(step).find('div.instructions-number').length > 0))
      .toEqual(true);
  });

  it('should have a sub to go with every instruction number', () => {
    expect(Array
      .from(wrapper.find('div.instructions-step'))
      .every(step => shallow(step).find('div.instructions-number > sub').length > 0))
      .toEqual(true);
  });

  it('should have a body to go with every instruction step', () => {
    expect(Array
      .from(wrapper.find('div.instructions-step'))
      .every(step => shallow(step).find('div.instructions-body').length > 0))
      .toEqual(true);
  });
});
