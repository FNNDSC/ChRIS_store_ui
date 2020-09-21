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
    id: 1,
  },
  {
    title: 'testTitle2',
    name: 'testName2',
    authors: 'testAuthor2 (user@domain.com)',
    dock_image: 'dock/image2',
    creation_date: '2018-06-19T15:29:11.349272Z',
    modification_date: '3/14/15',
    version: '0.1',
    id: 2,
  },
];

class StoreClient {
  constructor(url, options) {
    this.url = url;

    if (url && options && options.token === 'testToken') {
      this.validToken = true;
    }
  }

  static getAuthToken(_authURL, username, password) {
    return new Promise((resolve, reject) => {
      if (username === 'cube' && password === 'cube1234') {
        resolve('testToken');
      } else {
        reject(new Error('incorrect login'));
      }
    });
  }

  getPlugins() {
    return new Promise((resolve, reject) => {
      if (this.url) {
        return resolve({ data: samplePluginList });
      }
      return reject(new Error('invalid URL'));
    });
  }

  getPlugin() {
    return new Promise((resolve, reject) => {
      if (this.url) {
        return resolve({ data: samplePluginList[0] });
      }
      return reject(new Error('invalid URL'));
    });
  }

  addPlugin(name, image, representation, repo) {
    if (this.validToken) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const { target: { result } } = e;

          const pluginRepresentation = JSON.parse(result);
          if (pluginRepresentation.title === undefined) {
            reject(new Error('Missing JSON'));
          } else {
            resolve({
              data: {
                name, image, repo, ...pluginRepresentation,
              },
            });
          }
        };
        reader.readAsText(representation);
      });
    }
    return Promise.reject(new Error('invalid Token'));
  }
  createPlugin(data, uploadFileObj) {
    if (this.validToken) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const { target: { result } } = e;

          const pluginRepresentation = JSON.parse(result);
          if (pluginRepresentation.title === undefined) {
            reject(new Error('Missing JSON'));
          } else {
            resolve({
              data: {
                data, ...pluginRepresentation,
              },
            });
          }
        };
        reader.readAsText(uploadFileObj.descriptor_file);
      });
    }
    return Promise.reject(new Error('invalid Token'));
  }

  async getPluginStars() {
    if (this.url) {
      return {
        data: [],
      };
    }
    throw new Error('invalid URL');
  }

  createPluginStar() {
    if (this.url) {
      return { data: {} };
    }
    throw new Error('invalid URL');
  }

  async getPluginStar() {
    if (this.url) {
      return {
        delete: () => {},
      };
    }
    throw new Error('invalid URL');
  }
}

export default StoreClient;
