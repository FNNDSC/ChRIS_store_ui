import React from 'react';
import { mount, shallow } from 'enzyme';
import Clipboard from 'react-clipboard.js';
import CopyToClipboard from './CopyToClipboard';


describe('CopyToClipboard', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CopyToClipboard clipboardText="" />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Clipboard component', () => {
    expect(wrapper.find(Clipboard)).toHaveLength(1);
  });

  it('should render copy Icon component with name', () => {
    expect(wrapper.find('Icon').prop('name')).toEqual('copy');
  });

  it('should render OverlayTrigger component', () => {
    expect(wrapper.find('OverlayTrigger')).toHaveLength(1);
  });
});

describe('mounted CopyToClipboard', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<CopyToClipboard clipboardText="" />);
  });

  it('renders the data-clipboard-text attribute', () => {
    wrapper.setProps({ clipboardText: 'text' });
    const clipboardElement = wrapper.find(Clipboard);
    expect(clipboardElement.prop('data-clipboard-text')).toEqual('text');
  });

  it('should show tooltip when the copy button is clicked', () => {
    const overlayTrigger = wrapper.find('OverlayTrigger');
    overlayTrigger.simulate('click');
    expect(overlayTrigger.instance().state.show).toEqual(true);
  });
});
