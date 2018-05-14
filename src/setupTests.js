import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//mock Localstorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  global.localStorage = localStorageMock

//Configure React adapter
configure({ adapter: new Adapter() });