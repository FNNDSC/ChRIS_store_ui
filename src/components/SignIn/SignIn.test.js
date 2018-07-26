import React from 'react';
import { shallow } from 'enzyme';
import SignIn from './SignIn';

// import localStorage mock
import localStorage from '../__mocks__/localStorage';

// define mock for @fnndsc/chrisstoreapi module
jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

describe('SignIn', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SignIn />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render signin div', () => {
    expect(wrapper.find('div.signin')).toHaveLength(1);
  });

  it('should render signin-container div inside signin div', () => {
    expect(wrapper
      .find('div.signin')
      .find('div.signin-container'))
      .toHaveLength(1);
  });

  it('should render signin-logo-container', () => {
    expect(wrapper.find('div.signin-logo-container')).toHaveLength(1);
  });

  it('should render signin-logo-link inside signin-logo-container', () => {
    expect(wrapper
      .find('div.signin-logo-container')
      .find('Link.signin-logo-link'))
      .toHaveLength(1);
  });

  it('should render signin-logo img inside signin-logo-container', () => {
    expect(wrapper
      .find('div.signin-logo-container')
      .find('img.signin-logo'))
      .toHaveLength(1);
  });

  it('should render Card component inside signin div', () => {
    expect(wrapper
      .find('div.signin')
      .find('Card'))
      .toHaveLength(1);
  });

  it('should render Card children correctly', () => {
    const card = wrapper.find('Card');
    expect(card.find('CardTitle.signin-card-title')).toHaveLength(1);
    expect(card.find('CardBody')).toHaveLength(1);
  });

  /* ============================== */
  /* ========= SIGNIN FORM ======== */
  /* ============================== */

  it('should render signin-form inside CardBody', () => {
    expect(wrapper
      .find('CardBody')
      .find('Form.signin-form'))
      .toHaveLength(1);
  });

  it("should render 2 FormGroup's inside signin-form", () => {
    expect(wrapper
      .find('Form.signin-form')
      .find('FormGroup'))
      .toHaveLength(2);
  });

  it('should render each FormGroup with ControlLabel and FormControl', () => {
    const groups = wrapper.find('Form.signin-form').find('FormGroup');
    groups.forEach((group) => {
      expect(group.find('ControlLabel')).toHaveLength(1);
      expect(group.find('FormControl')).toHaveLength(1);
    });
  });

  it('should render 2 buttons inside signin-form', () => {
    expect(wrapper
      .find('Form.signin-form')
      .find('Button'))
      .toHaveLength(2);
  });

  /* ============================== */
  /* ====== STATE AND EVENTS ====== */
  /* ============================== */

  it('should update the username value based on state', () => {
    wrapper.setState({ username: 'testUsername' });
    expect(wrapper
      .find('FormGroup.signin-username-form-group')
      .find('FormControl')
      .prop('value'))
      .toEqual('testUsername');
  });

  it('should update the password value based on the state', () => {
    wrapper.setState({ password: 'testPassword' });
    expect(wrapper
      .find('FormGroup.signin-password-form-group')
      .find('FormControl')
      .prop('value'))
      .toEqual('testPassword');
  });

  // helper function to get FormControl
  const getControl = control => wrapper
    .find(`FormGroup.signin-${control}-form-group`)
    .find('FormControl');

  it('should update the username state based on change', () => {
    expect(getControl('username').prop('value')).toEqual('');

    getControl('username').simulate('change', { target: { value: 'testUsername' } });

    expect(getControl('username').prop('value')).toEqual('testUsername');
  });

  it('should update the password state based on change', () => {
    expect(getControl('password').prop('value')).toEqual('');

    getControl('password').simulate('change', { target: { value: 'testUsername' } });

    expect(getControl('password').prop('value')).toEqual('testUsername');
  });

  /* ============================== */
  /* ======== FORM ACTIONS ======== */
  /* ============================== */

  const event = { preventDefault: jest.fn() };

  it('should call handleSubmit method on signin-form submit', () => {
    // spy for handleSubmit method
    const spy = jest.spyOn(SignIn.prototype, 'handleSubmit');
    // a new shallow is needed so that the onClick refers to the mocked fn
    const mockedWrapper = shallow(<SignIn />);
    spy.mockRestore();

    mockedWrapper.find('Form.signin-form').simulate('submit', event);

    expect(spy).toHaveBeenCalled();
  });

  it('should call showError method on incorrect credentials', () => {
    // spy for showError method
    const spy = jest.spyOn(SignIn.prototype, 'showError');
    const mockedWrapper = shallow(<SignIn />);
    spy.mockRestore();

    // define credentials
    mockedWrapper.setState({
      username: 'bad',
      password: 'credentials',
    });

    // trigger submit
    return mockedWrapper.instance().handleSubmit(event)
      .then(() => expect(spy).toHaveBeenCalled());
  });

  it('should update loading state in accordance with the auth token promise', () => {
    const promise = wrapper.instance().handleSubmit(event);
    expect(wrapper.state('loading')).toBeTruthy();
    return promise.then(() => expect(wrapper.state('loading')).toBeFalsy());
  });

  it('should update toDashboard state if username and password were correct', () => {
    // setup localStorage mock
    window.localStorage = localStorage;

    // define credentials
    wrapper.setState({
      username: 'cube',
      password: 'cube1234',
    });

    expect(wrapper.state('toDashboard')).toBeFalsy();
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        expect(wrapper.state('toDashboard')).toBeTruthy();
        // remove from localStorage
        window.localStorage.removeItem('AUTH_TOKEN');
      });
  });

  it('should set AUTH_TOKEN localStorage item if credentials were correct', () => {
    // setup localStorage mock
    window.localStorage = localStorage;

    // define credentials
    wrapper.setState({
      username: 'cube',
      password: 'cube1234',
    });

    expect(window.localStorage.getItem('AUTH_TOKEN')).toBeUndefined();
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        expect(window.localStorage.getItem('AUTH_TOKEN')).toEqual('testToken');
      });
  });

  it('should render signin-error-container if credentials were not correct', () => {
    // setup localStorage mock
    window.localStorage = localStorage;

    expect(wrapper.find('div.signin-error-container')).toHaveLength(0);
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        wrapper.update();
        expect(wrapper.find('div.signin-error-container')).toHaveLength(1);
      });
  });

  it('should redirect if credentials were correct', () => {
    // setup localStorage mock
    window.localStorage = localStorage;

    // define credentials
    wrapper.setState({
      username: 'cube',
      password: 'cube1234',
    });

    expect(wrapper.find('Redirect')).toHaveLength(0);
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        wrapper.update();
        expect(wrapper.find('Redirect')).toHaveLength(1);
      });
  });

  it('should not redirect if credentials were incorrect', () => {
    // setup localStorage mock
    window.localStorage = localStorage;

    expect(wrapper.find('Redirect')).toHaveLength(0);
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        wrapper.update();
        expect(wrapper.find('Redirect')).toHaveLength(0);
      });
  });

  /* ============================== */
  /* =========== METHODS ========== */
  /* ============================== */

  it('sets mounted to true on after mounting', () => {
    expect(SignIn.prototype.mounted).toBeFalsy();
    SignIn.prototype.componentWillMount();
    expect(SignIn.prototype.mounted).toBeTruthy();
  });

  it('sets mounted to false after componentWillUnmount is called', () => {
    const instance = wrapper.instance();
    expect(instance.mounted).toBeTruthy();
    instance.componentWillUnmount();
    expect(instance.mounted).toBeFalsy();
  });

  const generateMockEvent = value => ({ target: { value } });

  it('sets username state when handleUsername is called', () => {
    const instance = wrapper.instance();
    instance.handleUsername(generateMockEvent('testUsername'));
    expect(wrapper.state('username')).toEqual('testUsername');
  });

  it('sets password state when handlePassword is called', () => {
    const instance = wrapper.instance();
    instance.handleUsername(generateMockEvent('testPassword'));
    expect(wrapper.state('username')).toEqual('testPassword');
  });

  it('sets error state to message when showError is called', () => {
    const instance = wrapper.instance();
    const message = 'testErrorMessage';
    instance.showError(message);
    expect(wrapper.state('error')).toEqual(message);
  });

  it('sets error state to null if e.key is undefined or if e.key is "Enter"', () => {
    const instance = wrapper.instance();
    const msg = 'message';

    instance.showError(msg);
    expect(wrapper.state('error')).toEqual(msg);
    instance.hideError({});
    expect(wrapper.state('error')).toBeNull();

    instance.showError(msg);
    expect(wrapper.state('error')).toEqual(msg);
    instance.hideError({ key: 'not Enter' });
    expect(wrapper.state('error')).toEqual(msg);

    instance.hideError({ key: 'Enter' });
    expect(wrapper.state('error')).toBeNull();
  });
});
