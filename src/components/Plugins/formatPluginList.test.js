import formatPluginList from './formatPluginList';

const samplePluginList = [
  {
    href: 'http://localhost:8010/api/v2/2',
    data: [
      {
        value: 'testValue',
        name: 'testName',
      },
      {
        value: 'testValue2',
        name: 'testName2',
      },
    ],
  },
  {
    href: 'http://localhost:8010/api/v2/2',
    data: [
      {
        value: 'testValue',
        name: 'testName',
      },
      {
        value: 'testValue2',
        name: 'testName2',
      },
    ],
  },
];

const shouldEqual = [
  {
    href: 'http://localhost:8010/api/v2/2',
    data: {
      testName: 'testValue',
      testName2: 'testValue2',
    },
  },
  {
    href: 'http://localhost:8010/api/v2/2',
    data: {
      testName: 'testValue',
      testName2: 'testValue2',
    },
  },
];

describe('PluginFormatter', () => {
  it('should format pluginList correctly', () => {
    const formattedPluginList = formatPluginList(samplePluginList);
    expect(formattedPluginList).toEqual(shouldEqual);
  });
});
