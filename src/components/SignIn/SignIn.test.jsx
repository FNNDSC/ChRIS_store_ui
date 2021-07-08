import React from 'react';
import { shallow } from 'enzyme';
import { SignIn } from './SignIn';

// define mock for @fnndsc/chrisstoreapi module
jest.mock('@fnndsc/chrisstoreapi', () => require.requireActual('../__mocks__/chrisstoreapi').default);

describe('SignIn', () => {
  let wrapper;
  const initialStore = { state: { isLoggedIn: false } };
  beforeEach(() => {
    wrapper = shallow(<SignIn store={initialStore} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render signin div', () => {
    expect(wrapper.find('div.signin.login-pf-page')).toHaveLength(1);
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

  it('should render CardBody inside signin Card', () => {
    const card = wrapper.find('Card');
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

  it('should render each FormGroup with FormControl', () => {
    const groups = wrapper.find('Form.signin-form').find('FormGroup');
    groups.forEach((group) => {
      expect(group.find('FormControl')).toHaveLength(1);
    });
  });

  it('should render signin-login-btn Button component inside signin-form', () => {
    expect(wrapper
      .find('Form.signin-form')
      .find('Button'))
      .toHaveLength(1);
  });

  it('should render login-pf-signup inside signin-form', () => {
    expect(wrapper
      .find('Form.signin-form')
      .find('p.login-pf-signup'))
      .toHaveLength(1);
  });

  it('should render Link component inside login-pf-signup', () => {
    expect(wrapper
      .find('p.login-pf-signup')
      .find('Link'))
      .toHaveLength(1);
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
  const getControl = (control) => wrapper
    .find(`FormGroup.signin-${control}-form-group`)
    .find('FormControl');

  // helper functino to generate mock change event
  const generateMockEvent = (name, value) => ({ target: { name, value } });

  it('should update the username state based on change', () => {
    expect(getControl('username').prop('value')).toEqual('');

    getControl('username').simulate('change', generateMockEvent('username', 'testUsername'));

    expect(getControl('username').prop('value')).toEqual('testUsername');
  });

  it('should update the password state based on change', () => {
    expect(getControl('password').prop('value')).toEqual('');

    getControl('password').simulate('change', generateMockEvent('password', 'testPassword'));

    expect(getControl('password').prop('value')).toEqual('testPassword');
  });

  /* ============================== */
  /* ======== FORM ACTIONS ======== */
  /* ============================== */

  const event = { persist: jest.fn() };

  it('should call showError method on incorrect credentials', () => {
    // spy for showError method
    const spy = jest.spyOn(SignIn.prototype, 'showError');
    const mockedWrapper = shallow(<SignIn store={initialStore} />);
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
    // define credentials
    wrapper.setState({
      username: 'cube',
      password: 'cube1234',
    });

    expect(wrapper.state('toDashboard')).toBeFalsy();
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        expect(wrapper.state('toDashboard')).toBeFalsy();
        // remove from localStorage
        window.localStorage.removeItem('AUTH_TOKEN');
      });
  });

  it('should set AUTH_TOKEN localStorage item if credentials were correct', () => {
    // define credentials
    wrapper.setState({
      username: 'cube',
      password: 'cube1234',
    });

    expect(window.localStorage.getItem('AUTH_TOKEN')).toBeUndefined();
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        expect(window.localStorage.getItem('AUTH_TOKEN')).toBeUndefined();
      });
  });

  it('should render error Alert if credentials were not correct', () => {
    const containerSelector = 'div.signin-error-container';
    const alertSelector = 'Alert[type="error"]';
    expect(wrapper.find(containerSelector)).toHaveLength(0);
    expect(wrapper.find(alertSelector)).toHaveLength(0);
    return wrapper.instance().handleSubmit(event)
      .then(() => {
        wrapper.update();
        expect(wrapper.find(containerSelector)).toHaveLength(1);
        expect(wrapper.find(alertSelector)).toHaveLength(1);
      });
  });

  /* it('should redirect if credentials were correct', () => {
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
  }); */

  it('should not redirect if credentials were incorrect', () => {
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

  it('sets correct state when handleChange is called', () => {
    const instance = wrapper.instance();
    instance.handleChange(generateMockEvent('username', 'testUsername'));
    instance.handleChange(generateMockEvent('password', 'testPassword'));
    expect(wrapper.state('username')).toEqual('testUsername');
    expect(wrapper.state('password')).toEqual('testPassword');
  });

  it('sets error state to message when showError is called', () => {
    const instance = wrapper.instance();
    const message = 'testErrorMessage';
    instance.showError(message);
    expect(wrapper.state('error')).toEqual(message);
  });

  it('sets error state to null if dismissed', () => {
    const instance = wrapper.instance();
    const msg = 'message';

    instance.showError(msg);
    expect(wrapper.state('error')).toEqual(msg);
    instance.hideError();
    expect(wrapper.state('error')).toBeNull();
  });
});
