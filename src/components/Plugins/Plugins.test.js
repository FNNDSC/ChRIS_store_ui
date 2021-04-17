import React from 'react';
import { shallow } from 'enzyme';
import { Plugins } from './Plugins';

// define mock for @fnndsc/chrisstoreapi module
jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

describe('Plugins', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Plugins store={new Map()} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render plugins-container div', () => {
    expect(wrapper.find('div.plugins-container')).toHaveLength(1);
  });

  it('should render plugins-stats inside of plugins-container', () => {
    expect(wrapper
      .find('div.plugins-container')
      .find('div.plugins-stats'))
      .toHaveLength(1);
  });

  it('should render row div inside plugins-stats', () => {
    expect(wrapper
      .find('div.plugins-stats')
      .find('div.row'))
      .toHaveLength(1);
  });

  it('should render LoadingContainer component inside plugins-stats row', () => {
    expect(wrapper
      .find('div.plugins-stats-row')
      .find('LoadingContainer'))
      .toHaveLength(1);
  });

  it('should render LoadingContent component inside LoadingContainer', () => {
    expect(wrapper
      .find('div.plugins-stats-row')
      .find('LoadingContainer')
      .find('LoadingContent'))
      .toHaveLength(1);
  });

  it('should render DropdownButton component inside plugins-stats row', () => {
    expect(wrapper
      .find('div.plugins-stats-row')
      .find('DropdownButton'))
      .toHaveLength(1);
  });

  it('should render 3 MenuItem component inside DropdownButton', () => {
    expect(wrapper
      .find('DropdownButton')
      .find('MenuItem'))
      .toHaveLength(3);
  });

  it('every MenuItem component should have eventKey prop', () => {
    wrapper.find('MenuItem').forEach((item) => {
      expect(item.prop('eventKey')).toBeDefined();
    });
  });

  it('should render plugins-row inside of plugins-container', () => {
    expect(wrapper
      .find('div.plugins-container')
      .find('div.plugins-row.row').length)
      .toEqual(1);
  });

  it('should render PluginsCategories component inside plugins-row', () => {
    expect(wrapper
      .find('div.plugins-row')
      .find('PluginsCategories'))
      .toHaveLength(1);
  });

  it('should render plugins-list div inside plugins-row', () => {
    expect(wrapper
      .find('div.plugins-row')
      .find('div.plugins-list').length)
      .toEqual(1);
  });

  it('should render 6 LoadingPluginItem components if pluginList is null', () => {
    expect(wrapper
      .find('div.plugins-list')
      .find('LoadingPluginItem'))
      .toHaveLength(6);
  });

  /* ============================== */
  /* =========== METHODS ========== */
  /* ============================== */

  it('sets mounted to true on after mounting', () => {
    expect(Plugins.prototype.mounted).toBeFalsy();
    Plugins.prototype.componentWillMount();
    expect(Plugins.prototype.mounted).toBeTruthy();
  });

  it('sets mounted to false after componentWillUnmount is called', () => {
    const instance = wrapper.instance();
    expect(instance.mounted).toBeTruthy();
    instance.componentWillUnmount();
    expect(instance.mounted).toBeFalsy();
  });

  /* ============================== */
  /* ====== FETCH PLUGINS FN ====== */
  /* ============================== */

  it('should have fetchPlugins function', () => {
    const { fetchPlugins } = wrapper.instance();
    expect(fetchPlugins).toBeDefined();
  });

  it('should be able to fetch plugins', () => {
    const { fetchPlugins } = wrapper.instance();
    return fetchPlugins().then((plugins) => {
      expect(plugins).toBeDefined();
    });
  });
});


describe('rendered Plugins', () => {
  let wrapper;
  let plugins;
  let samplePluginList;

  beforeEach(() => {
    samplePluginList = [
      {
        title: 'testTitle1',
        id: 1,
        name: 'testName1',
        authors: 'testAuthor1',
        dock_image: 'dock/image1',
        creation_date: '2018-06-19T15:29:11.349272Z',
      },
      {
        title: 'testTitle2',
        id: 2,
        name: 'testName2',
        authors: 'testAuthor2',
        dock_image: 'dock/image2',
        creation_date: '2018-06-19T15:29:11.349272Z',
      },
     
    ];
    wrapper = shallow(<Plugins store={new Map()} />);
    wrapper.setState({ pluginList: samplePluginList });
    plugins = Array.from(wrapper.find('Plugin'));
  });

  it('should render the correct number of Plugin components', () => {
    expect(wrapper.find('Plugin')).toHaveLength(2);
  });

  it('should render the correct number for "plugins found"', () => {
    expect(wrapper.find('span.plugins-found').text()).toEqual('2 plugins found');
  });

  it('should render the title prop for each Plugin', () => {
    plugins.forEach((plugin, i) => {
      expect(plugin.props.title).toEqual(`testTitle${i + 1}`);
    });
  });

  it('should render the name prop for each Plugin', () => {
    plugins.forEach((plugin, i) => {
      expect(plugin.props.name).toEqual(`testName${i + 1}`);
    });
  });

  it('should render the author prop for each Plugin', () => {
    plugins.forEach((plugin, i) => {
      expect(plugin.props.author).toEqual(`testAuthor${i + 1}`);
    });
  });

  it('should render the creation_date prop for each Plugin', () => {
    plugins.forEach((plugin) => {
      expect(plugin.props.creationDate).toEqual('2018-06-19T15:29:11.349272Z');
    });
  });

  it('should pass isLoggedIn for each Plugin', () => {
    const store = new Map([['isLoggedIn', true]]);
    wrapper = shallow(<Plugins store={store} />);
    wrapper.setState({ pluginList: samplePluginList });
    plugins = Array.from(wrapper.find('Plugin'));

    plugins.forEach((plugin) => {
      expect(plugin.props.isLoggedIn).toEqual(true);
    });
  });


  it('should mark plugin as favorited when a plugin star is clicked', async () => {
    // define mock for @fnndsc/chrisstoreapi module
    jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

    const store = new Map([['isLoggedIn', true]]);
    wrapper = shallow(<Plugins store={store} />);
    // wait for component to be mounted
    await Promise.resolve();

    wrapper.setState({ pluginList: samplePluginList });

    const firstPlugin = wrapper.find('Plugin').first();

    await firstPlugin.props().onStarClicked();

    const firstPluginId = firstPlugin.props().id;

    expect(wrapper.state().pluginList[firstPluginId]).toBeDefined();
  });

  it('should mark plugin as NOT favorited when plugin star is clicked and plugin is already a favorite', async () => {
    // define mock for @fnndsc/chrisstoreapi module
    jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

    const store = new Map([['isLoggedIn', true]]);
    wrapper = shallow(<Plugins store={store} />);
    // wait for component to be mounted
    await Promise.resolve();

    // The first plugin in the list is favorited
    const firstPluginId = samplePluginList[0].id;
    wrapper.setState({ starsByPlugin: { [firstPluginId]: { id: 4 } } });

    // Click the star button
    const firstPlugin = wrapper.find('Plugin').first();
    firstPlugin.props().onStarClicked();

    expect(wrapper.state().starsByPlugin[firstPluginId]).toBeUndefined();
  });

  it('should not change plugin status when user NOT logged in and star is clicked', async () => {
    // define mock for @fnndsc/chrisstoreapi module
    jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

    const store = new Map();
    wrapper = shallow(<Plugins store={store} />);
    // wait for component to be mounted
    await Promise.resolve();

    wrapper.setState({ pluginList: samplePluginList });

    const firstPlugin = wrapper.find('Plugin').first();

    await firstPlugin.props().onStarClicked();

    const firstPluginId = firstPlugin.props().id;

    expect(wrapper.state().starsByPlugin[firstPluginId]).toBeUndefined();
  });
});
