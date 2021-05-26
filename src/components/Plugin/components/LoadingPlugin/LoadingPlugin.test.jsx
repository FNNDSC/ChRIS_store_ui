import React from 'react';
import { shallow } from 'enzyme';
import LoadingPlugin from './LoadingPlugin';

describe('LoadingPlugin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LoadingPlugin />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render LoadingContainer component', () => {
    expect(wrapper.find('LoadingContainer.loading-plugin-container')).toHaveLength(1);
  });

  /* ============================== */
  /* ====== PLUGIN HEADER DIV ===== */
  /* ============================== */

  it('should render plugin-header div inside LoadingContainer', () => {
    expect(wrapper
      .find('LoadingContainer')
      .find('div.plugin-header'))
      .toHaveLength(1);
  });

  it('should render no-flex row div inside plugin-header', () => {
    expect(wrapper
      .find('div.plugin-header')
      .find('div.row.no-flex'))
      .toHaveLength(1);
  });

  it('should render 5 LoadingContent components inside plugin-header', () => {
    expect(wrapper
      .find('div.plugin-header')
      .find('LoadingContent'))
      .toHaveLength(5);
  });

  /* ============================== */
  /* ======= PLUGIN BODY DIV ====== */
  /* ============================== */

  it('should render plugin-body div inside LoadingContainer', () => {
    expect(wrapper
      .find('LoadingContainer')
      .find('div.plugin-body'))
      .toHaveLength(1);
  });

  it('should render row div inside plugin-body', () => {
    expect(wrapper
      .find('div.plugin-body')
      .find('div.row'))
      .toHaveLength(1);
  });

  it('should render 3 LoadingContent components in plugin-body with type="white', () => {
    wrapper
      .find('div.plugin-body')
      .find('LoadingContent')
      .forEach((loadingContent) => {
        expect(loadingContent.is('[type="white"]')).toBeTruthy();
      });
  });

  it('should render plugin-body-main-col div inside plugin-body', () => {
    expect(wrapper
      .find('div.plugin-body')
      .find('div.plugin-body-main-col'))
      .toHaveLength(1);
  });

  it('should render plugin-body-side-col div inside plugin-body', () => {
    expect(wrapper
      .find('div.plugin-body')
      .find('div.plugin-body-side-col'))
      .toHaveLength(1);
  });

  it('should render 2 LoadingContent components in plugin-body-main-col', () => {
    expect(wrapper
      .find('div.plugin-body')
      .find('div.plugin-body-main-col')
      .find('LoadingContent'))
      .toHaveLength(2);
  });

  it('should render 1 LoadingContent component in plugin-body-side-col', () => {
    expect(wrapper
      .find('div.plugin-body')
      .find('div.plugin-body-side-col')
      .find('LoadingContent'))
      .toHaveLength(1);
  });
});
