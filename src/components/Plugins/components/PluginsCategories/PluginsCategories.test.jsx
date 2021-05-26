import React from 'react';
import { shallow, mount } from 'enzyme';
import PluginsCategories from './PluginsCategories';

describe('PluginsCategories', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PluginsCategories categories={[]} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render plugins-categories div', () => {
    expect(wrapper.find('div.plugins-categories')).toHaveLength(1);
  });

  it('should render plugins-categories-header div', () => {
    expect(wrapper.find('div.plugins-categories-header')).toHaveLength(1);
  });
});

const sampleCategories = [
  {
    name: 'sampleCategory1',
    length: 1,
  },
  {
    name: 'sampleCategory2',
    length: 2,
  },
];

describe('mounted PluginsCategories', () => {
  let wrapper;
  let categories;
  beforeEach(() => {
    wrapper = mount(<PluginsCategories categories={sampleCategories} />);
    categories = Array.from(wrapper.find('div.plugins-category'));
  });

  it('should render the correct number of plugins-category divs', () => {
    expect(categories).toHaveLength(2);
  });

  it('should render name value', () => {
    categories.forEach((category, i) => {
      expect(shallow(category)
        .find('div.plugins-category-name')
        .text())
        .toEqual(`sampleCategory${i + 1}`);
    });
  });

  it('should render length value', () => {
    categories.forEach((category, i) => {
      expect(shallow(category)
        .find('div.plugins-category-length')
        .text())
        .toEqual(`${i + 1}`);
    });
  });
});
