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
    expect(wrapper.find('div.plugin-item-name')).toHaveLength(1);
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
      .find('div.plugin-item-name')
      .find('Link')
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


describe('PluginItem: When user is NOT logged in', () => {
  it('should render the star with class plugin-star-disabled', () => {
    const wrapper = shallow(<PluginItem
      title=""
      id=""
      name=""
      author=""
      creationDate=""
    />);

    expect(wrapper.find('Icon.plugin-star-disabled')).toHaveLength(1);
  });
});

describe('PluginItem: when user is logged in', () => {
  describe('and the item is NOT a user favorite', () => {
    it('should render the star with class plugin-star', () => {
      const wrapper = shallow(<PluginItem
        title=""
        id=""
        name=""
        author=""
        creationDate=""
        isLoggedIn
      />);

      expect(wrapper.find('Icon.plugin-star')).toHaveLength(1);
    });

    it('should call the API endpoint when Icon is clicked', () => {
      const onFavoriteHandler = jest.fn();

      const wrapper = shallow(<PluginItem
        title=""
        id=""
        name=""
        author=""
        creationDate=""
        isLoggedIn
        onFavorited={onFavoriteHandler}
      />);

      wrapper.find('Icon.plugin-star').simulate('click');

      expect(onFavoriteHandler).toHaveBeenCalled();
    });
  });

  describe('and the item is a user favorite', () => {
    it('should render the star with class plugin-star-favorite', () => {
      const wrapper = shallow(<PluginItem
        title=""
        id=""
        name=""
        author=""
        creationDate=""
        isLoggedIn
        isFavorite
      />);

      expect(wrapper.find('Icon.plugin-star-favorite')).toHaveLength(1);
    });
  });
});
