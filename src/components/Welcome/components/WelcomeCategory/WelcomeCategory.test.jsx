import React from 'react';
import { shallow, mount } from 'enzyme';
import WelcomeCategory from './WelcomeCategory';
import sampleCategories from '../WelcomeCategories/sampleCategories';

describe('WelcomeCategory', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<WelcomeCategory category={sampleCategories[0]} />);
  });

  it('should render Card component with class welcome-category', () => {
    expect(wrapper.find('Card.welcome-category')).toHaveLength(1);
  });

  it('should render CardTitle component with class welcome-category-header', () => {
    expect(wrapper.find('CardTitle.welcome-category-header')).toHaveLength(1);
  });

  it('should render CardBody component', () => {
    expect(wrapper.find('CardBody')).toHaveLength(1);
  });

  it('should render 4 welcome-category-item divs', () => {
    expect(wrapper.find('div.welcome-category-item')).toHaveLength(4);
  });

  it('should have an img element to go with every welcome-category-item div', () => {
    expect(Array
      .from(wrapper.find('div.welcome-category-item'))
      .every((div) => shallow(div).find('img.welcome-category-item-img').length === 1))
      .toEqual(true);
  });

  it('should have an item-body to go with every category-item', () => {
    expect(Array
      .from(wrapper.find('div.welcome-category-item'))
      .every((div) => shallow(div)
        .find('div.welcome-category-item-body').length === 1))
      .toEqual(true);
  });

  it('should have an item-name to go with every item-body', () => {
    expect(Array
      .from(wrapper.find('div.welcome-category-item'))
      .every((div) => shallow(div)
        .find('div.welcome-category-item-body')
        .find('div.welcome-category-item-name').length === 1))
      .toEqual(true);
  });

  it('should have an item-desc to go with every item-body', () => {
    expect(Array
      .from(wrapper.find('div.welcome-category-item'))
      .every((div) => shallow(div)
        .find('div.welcome-category-item-body')
        .find('div.welcome-category-item-desc').length === 1))
      .toEqual(true);
  });

  it('should have an item-tags to go with every item-body', () => {
    expect(Array
      .from(wrapper.find('div.welcome-category-item'))
      .every((div) => shallow(div)
        .find('div.welcome-category-item-body')
        .find('div.welcome-category-item-tags').length === 1))
      .toEqual(true);
  });

  it('should render CardFooter component', () => {
    expect(wrapper.find('CardFooter')).toHaveLength(1);
  });

  it('should render Button inside CardFooter', () => {
    expect(wrapper.find('CardFooter').find('Button')).toHaveLength(1);
  });

  it('should render Button with btn-block class', () => {
    expect(wrapper.find('Button').hasClass('btn-block')).toEqual(true);
  });
});

const testCategory = {
  name: 'testTitle',
  items: [
    {
      img: 'testImage',
      name: 'testName',
      desc: 'testDesc',
      tags: ['testTag1', 'testTag2'],
    },
  ],
};

describe('mounted WelcomeCategory', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<WelcomeCategory category={testCategory} />);
  });

  it('should render category name in CardTitle', () => {
    expect(wrapper
      .find('CardTitle.welcome-category-header')
      .text())
      .toEqual('testTitle');
  });

  it('should render 1 welcome-category-item', () => {
    expect(wrapper.find('div.welcome-category-item')).toHaveLength(1);
  });

  it('should render img src in welcome-category-item', () => {
    expect(wrapper
      .find('img.welcome-category-item-img')
      .prop('src'))
      .toEqual('testImage');
  });

  it('should render item name in welcome-category-item-name', () => {
    expect(wrapper
      .find('div.welcome-category-item-name')
      .text())
      .toEqual('testName');
  });

  it('should render item description in welcome-category-item-desc', () => {
    expect(wrapper
      .find('div.welcome-category-item-desc')
      .text())
      .toEqual('testDesc');
  });

  it('should render item tags in welcome-category-item-tags', () => {
    expect(wrapper
      .find('div.welcome-category-item-tags')
      .text())
      .toEqual('testTag1 testTag2');
  });
});
