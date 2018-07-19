import React from 'react';
import { shallow } from 'enzyme';
import Search from './Search';

/* define props based on an object template */
const propsToMatch = (wrapper, template) => Object.keys(template)
  .every(key => wrapper.prop(key) === template[key]);

describe('Search', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Search />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form with class search-pf', () => {
    expect(wrapper.find('form.search-pf')).toHaveLength(1);
  });

  it('should render search-pf form with required props', () => {
    const form = wrapper.find('form.search-pf');
    const template = {
      method: 'get',
      action: '/plugins',
      autoComplete: 'off',
    };

    expect(propsToMatch(form, template)).toBeTruthy();
  });

  it('should render form-group div inside form', () => {
    expect(wrapper
      .find('form')
      .find('div.form-group'))
      .toHaveLength(1);
  });

  it('should render search-pf-input-group div inside form-group', () => {
    expect(wrapper
      .find('div.form-group')
      .find('div.search-pf-input-group'))
      .toHaveLength(1);
  });

  it('should render search-icon div inside search-pf-input-group', () => {
    expect(wrapper
      .find('div.search-pf-input-group')
      .find('div.search-icon'))
      .toHaveLength(1);
  });

  it('should render Icon inside search-icon div', () => {
    expect(wrapper
      .find('div.search-icon')
      .find('Icon'))
      .toHaveLength(1);
  });

  it('should render form-control input inside search-pf-input-group', () => {
    expect(wrapper
      .find('div.search-pf-input-group')
      .find('input#search.form-control'))
      .toHaveLength(1);
  });

  it('should render form-control with required props', () => {
    const input = wrapper.find('input#search.form-control');
    const template = {
      type: 'search',
      name: 'q',
      placeholder: 'Search plugins',
    };

    expect(propsToMatch(input, template)).toBeTruthy();
  });

  /* ====== PROP BASED TESTS ====== */

  it('should render className prop value', () => {
    wrapper.setProps({ className: 'testClass' });
    expect(wrapper
      .find('form.search-pf')
      .hasClass('testClass'))
      .toBeTruthy();
  });

  it('should render input defaultValue based off location prop', () => {
    wrapper.setProps({
      location: {
        search: '?q=testQuery',
      },
    });
    const input = wrapper.find('input#search.form-control');
    const template = { defaultValue: 'testQuery' };

    expect(propsToMatch(input, template));
  });
});
