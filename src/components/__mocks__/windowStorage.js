// a simple localStorage mock
class localStorage {
  static setItem(key, value) {
    this[key] = value;
  }

  static getItem(key) {
    return this[key];
  }

  static removeItem(key) {
    delete this[key];
  }
}

export default localStorage;
