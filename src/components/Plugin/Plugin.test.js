import React from 'react';
import { shallow } from 'enzyme';
import Plugin from './Plugin';

// define mock for @fnndsc/chrisstoreapi module
jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

describe('Plugin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Plugin />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a plugin div', () => {
    expect(wrapper.find('div.plugin')).toHaveLength(1);
  });

  it('should render plugin div based on className prop', () => {
    expect(wrapper.find('div.plugin.testClass')).toHaveLength(0);
    wrapper.setProps({ className: 'testClass' });
    expect(wrapper.find('div.plugin.testClass')).toHaveLength(1);
  });

  /* ============================== */
  /* =========== METHODS ========== */
  /* ============================== */

  it('sets mounted to true on after mounting', () => {
    expect(Plugin.prototype.mounted).toBeFalsy();
    Plugin.prototype.componentWillMount();
    expect(Plugin.prototype.mounted).toBeTruthy();
  });

  it('sets mounted to false after componentWillUnmount is called', () => {
    const instance = wrapper.instance();
    expect(instance.mounted).toBeTruthy();
    instance.componentWillUnmount();
    expect(instance.mounted).toBeFalsy();
  });

  /* ============================== */
  /* ==== FETCH PLUGIN DATA FN ==== */
  /* ============================== */

  it('should have fetchPluginData function', () => {
    const { fetchPluginData } = wrapper.instance();
    expect(fetchPluginData).toBeDefined();
  });

  it('should be able to fetch plugin data', () => {
    const { fetchPluginData } = wrapper.instance();

    wrapper.setProps({
      match: {
        params: {
          plugin: '1',
        },
      },
    });

    return fetchPluginData().then((pluginData) => {
      expect(pluginData).toBeDefined();
      expect(pluginData.name).toEqual('testName1');
    });
  });

  const propsData = {
    modification_date: '3/14/15',
    creation_date: '9/26/53',
    version: '0.1',
    authors: 'testAuthor (user@domain.com)',
  };

  it('should set pluginData state to pluginData props if passed', () => {
    const wrapperWithoutProps = shallow(<Plugin />);
    expect(wrapperWithoutProps.state('pluginData')).toBeNull();
    const wrapperWithProps = shallow(<Plugin pluginData={propsData} />);
    expect(wrapperWithProps.state('pluginData')).toEqual(propsData);
  });
});

/* ============================== */
/* ===== WITHOUT PLUGIN DATA ==== */
/* ============================== */

describe('Plugin without data', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Plugin />);
  });

  xit('should render LoadingPlugin component', () => {
    expect(wrapper.find('LoadingPlugin')).toHaveLength(1);
  });
});

/* ============================== */
/* ====== WITH PLUGIN DATA ====== */
/* ============================== */

const sampleData = {
  pluginData: {
    modification_date: '3/14/15',
    version: '0.1',
    authors: 'testAuthor (user@domain.com)',
  },
};

describe('Plugin with data', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Plugin />);
    wrapper.setState(sampleData);
  });

  xit('should render a plugin-name Link', () => {
    expect(wrapper.find('Link.plugin-name')).toHaveLength(1);
  });

  xit('should render plugin name', () => {
    wrapper.setProps({
      match: {
        params: {
          plugin: 'testName1',
        },
      },
    });

    expect(wrapper
      .find('.plugin-name')
      .childAt(0)
      .text())
      .toEqual('testName1');
  });

  xit('plugin-name Link should render correct "to" and "href" props', () => {
    wrapper.setProps({
      match: {
        params: {
          plugin: 'testName',
        },
      },
    });

    const link = wrapper.find('Link.plugin-name');
    const whatItShould = '/plugin/testName';
    expect(link.prop('to')).toEqual(whatItShould);
    expect(link.prop('href')).toEqual(whatItShould);
  });

  xit('should render plugin-modified div', () => {
    expect(wrapper.find('div.plugin-modified')).toHaveLength(1);
  });

  xit('should render plugin-modified div if valid date is provided', () => {
    Date.now = jest.fn(() => 1530814238992);
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.modification_date = '2018-06-19T15:29:11.349272Z';
    wrapper.setState(changedData);

    expect(wrapper
      .find('div.plugin-modified')
      .text())
      .toEqual('Last modified 16 days ago');
  });

  xit('should not render plugin-modified if invalid date is provided', () => {
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.modification_date = 'invalid date';

    wrapper.setState(changedData);

    expect(wrapper.find('div.plugin-modified')).toHaveLength(0);
  });

  xit('should render plugin-stats div', () => {
    expect(wrapper.find('div.plugin-stats')).toHaveLength(1);
  });

  xit('should render plugin-version div inside plugin-stats', () => {
    expect(wrapper
      .find('div.plugin-stats')
      .find('div.plugin-version'))
      .toHaveLength(1);
  });

  xit('should render correct plugin version inside plugin-version div', () => {
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.version = 'testVersion';
    wrapper.setState(changedData);

    expect(wrapper
      .find('div.plugin-version')
      .text())
      .toEqual('testVersion');
  });

  xit('should render plugin-created div inside plugin-stats', () => {
    expect(wrapper
      .find('div.plugin-stats')
      .find('div.plugin-created'))
      .toHaveLength(1);
  });

  xit('should render Link inside plugin-created', () => {
    expect(wrapper
      .find('div.plugin-created')
      .find('Link.plugin-author'))
      .toHaveLength(1);
  });

  xit('plugin-author Link should render correct "to" and "href" props', () => {
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.authors = 'testAuthor (user@domain.com)';
    wrapper.setState(changedData);

    const link = wrapper.find('Link.plugin-author');
    const whatItShould = '/author/testAuthor';
    expect(link.prop('to')).toEqual(whatItShould);
    expect(link.prop('href')).toEqual(whatItShould);
  });

  xit('plugin-author Link should render correct text', () => {
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.authors = 'testAuthor (user@domain.com)';
    wrapper.setState(changedData);

    expect(wrapper
      .find('Link.plugin-author')
      .childAt(0)
      .text())
      .toEqual('testAuthor');
  });

  xit('plugin-author Link should render "to" and "href" props based on pluginData.authorURL prop', () => {
    const pluginData = {
      authorURL: '/test/url',
    };
    wrapper.setProps({ pluginData });

    const link = wrapper.find('Link.plugin-author');
    expect(link.prop('to')).toEqual('/test/url');
    expect(link.prop('href')).toEqual('/test/url');
  });

  const getPluginCreatedText = () => {
    const pluginCreationDiv = wrapper.find('div.plugin-created');
    const receivedText = pluginCreationDiv.text();
    // remove html elements
    return receivedText.replace(/(<.*>)/g, '');
  };

  xit('should render the value of creationDate if it is a valid date', () => {
    Date.now = jest.fn(() => 1530814238992);
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.creation_date = '2018-06-19T15:29:11.349272Z';
    wrapper.setState(changedData);
    expect(getPluginCreatedText()).toEqual(' created 16 days ago');
  });

  xit('should not render the value of creationDate if it is not a valid date', () => {
    const changedData = Object.assign({}, sampleData);
    changedData.pluginData.creation_date = 'invalid date';
    wrapper.setState(changedData);
    expect(getPluginCreatedText()).toEqual('');
  });

  xit('should render PluginBody component inside plugin-container', () => {
    expect(wrapper
      .find('div.plugin-container')
      .find('PluginBody'))
      .toHaveLength(1);
  });
});
