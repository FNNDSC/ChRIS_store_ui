/* a mock of the @fnndsc/chrisstoreapi module for testing purposes */

const samplePluginList = [
  {
    title: 'testTitle1',
    name: 'testName1',
    authors: 'testAuthor1 (user@domain.com)',
    dock_image: 'dock/image1',
    creation_date: '2018-06-19T15:29:11.349272Z',
    modification_date: '3/14/15',
    version: '0.1',
  },
  {
    title: 'testTitle2',
    name: 'testName2',
    authors: 'testAuthor2 (user@domain.com)',
    dock_image: 'dock/image2',
    creation_date: '2018-06-19T15:29:11.349272Z',
    modification_date: '3/14/15',
    version: '0.1',
  },
];

class StoreClient {
  constructor(url, { token }) {
    if (url && token === 'testToken') {
      this.validToken = true;
    }
  }

  static getAuthToken() {
    return new Promise(resolve => resolve('testToken'));
  }

  getPlugins() {
    return new Promise((resolve, reject) => {
      if (this.validToken) {
        return resolve(samplePluginList);
      }
      return reject(new Error('invalid token'));
    });
  }

  getPlugin() {
    return new Promise((resolve, reject) => {
      if (this.validToken) {
        return resolve(samplePluginList[0]);
      }
      return reject(new Error('invalid token'));
    });
  }
}

export default { StoreClient };
