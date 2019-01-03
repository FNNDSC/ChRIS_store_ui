import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import windowStorage from './components/__mocks__/windowStorage';

configure({ adapter: new Adapter() });

// global sessionStorage and localStorage mock
Object.defineProperty(window, 'sessionStorage', {
  value: windowStorage,
});

Object.defineProperty(window, 'localStorage', {
  value: windowStorage,
});
