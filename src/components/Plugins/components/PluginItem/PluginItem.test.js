import React from 'react';
import { shallow } from 'enzyme';
import PluginItem from './PluginItem';

describe('Plugin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PluginItem
      title=""
      id=""
      name=""
      author=""
      creationDate=""
    />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Card component with plugin-item-card class', () => {
    expect(wrapper.find('Card.plugin-item-card')).toHaveLength(1);
  });

  it('should render CardBody component with plugin-item-card-body class', () => {
    expect(wrapper.find('CardBody.plugin-item-card-body')).toHaveLength(1);
  });

  it('should render div with row and no-flex classes', () => {
    expect(wrapper.find('div.row')).toHaveLength(1);
  });

  it('should render plugin-item-title div', () => {
    expect(wrapper.find('div.plugin-item-title')).toHaveLength(1);
  });

  it('should render plugin-item-name div', () => {
    expect(wrapper.find('Link.plugin-item-name')).toHaveLength(1);
  });

  it('should render plugin-item-creation div', () => {
    expect(wrapper.find('div.plugin-item-creation')).toHaveLength(1);
  });

  it('should render plugin-item-author Link inside plugin-item-creation', () => {
    expect(wrapper
      .find('div.plugin-item-creation')
      .find('Link.plugin-item-author'))
      .toHaveLength(1);
  });

  it('should render a large star Icon', () => {
    expect(wrapper.find('Icon[size="lg"]')).toHaveLength(1);
  });
});

describe('rendered Plugin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PluginItem
      title=""
      id=""
      name=""
      author=""
      creationDate=""
    />);
  });

  it('should render the value of title', () => {
    wrapper.setProps({ title: 'testTitle' });
    expect(wrapper.find('div.plugin-item-title').text()).toEqual('testTitle');
  });

  it('should render the value of name', () => {
    wrapper.setProps({ name: 'testName' });
    expect(wrapper
      .find('Link.plugin-item-name')
      .childAt(0)
      .text())
      .toEqual('testName');
  });

  it('should render the value of author', () => {
    wrapper.setProps({ author: 'testAuthor' });
    expect(wrapper
      .find('Link.plugin-item-author')
      .childAt(0)
      .text())
      .toEqual('testAuthor');
  });

  const getPluginCreationText = () => {
    const pluginCreationDiv = wrapper.find('div.plugin-item-creation');
    const receivedText = pluginCreationDiv.text();
    // remove html elements
    return receivedText.replace(/(<.*>)/g, '');
  };

  it('should not render the value of creationDate if not valid date', () => {
    wrapper.setProps({ creationDate: 'testDate' });
    expect(getPluginCreationText()).toEqual('');
  });

  it('should render the date value as relative date if valid date', () => {
    Date.now = jest.fn(() => 1530814238992);
    wrapper.setProps({ creationDate: '2018-06-19T15:29:11.349272Z' });
    expect(getPluginCreationText()).toEqual(' created 16 days ago');
  });
});
