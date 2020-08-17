import React from 'react';
import { shallow } from 'enzyme';
import PluginBody from './PluginBody';

const samplePluginData = {
  title: '',
  description: '',
  dock_image: '',
  license: '',
  public_repo: '',
  type: '',
};

describe('PluginBody', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PluginBody pluginData={samplePluginData} />);
  });

  it('should render plugin-body div', () => {
    expect(wrapper.find('div.plugin-body')).toHaveLength(1);
  });

  it('should render row div inside plugin-body', () => {
    expect(wrapper
      .find('div.plugin-body')
      .find('div.row'))
      .toHaveLength(1);
  });

  it("should render plugin-col's inside row", () => {
    const row = wrapper.find('div.row').first();
    expect(row.find('div.plugin-body-main-col')).toHaveLength(1);
    expect(row.find('div.plugin-body-side-col')).toHaveLength(1);
  });

  it('should render plugin-body-title Card component', () => {
    expect(wrapper
      .find('Card.plugin-body-title'))
      .toHaveLength(1);
  });

  it('should render plugin-body-description card', () => {
    expect(wrapper
      .find('Card.plugin-body-description'))
      .toHaveLength(1);
  });


  /* ============================== */
  /* =========== CARDS ============ */
  /* ============================== */

  it('should render CardHeading component inside each Card', () => {
    const cards = wrapper.find('Card');
    cards.forEach((card) => {
      expect(card
        .find('CardHeading'))
        .toHaveLength(1);
    });
  });

  it('should render CardTitle component inside each CardHeading', () => {
    const cardHeadings = wrapper.find('CardHeading');
    cardHeadings.forEach((cardHeading) => {
      expect(cardHeading
        .find('CardTitle'))
        .toHaveLength(1);
    });
  });

  it('should render CardBody component inside each Card', () => {
    const cards = wrapper.find('Card');
    cards.forEach((card) => {
      expect(card
        .find('CardBody'))
        .toHaveLength(1);
    });
  });
});

describe('rendered PluginBody', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PluginBody pluginData={samplePluginData} />);
  });

  it('should render title inside plugin-body-title', () => {
    const changedData = Object.assign({}, samplePluginData);
    changedData.title = 'testTitle';
    wrapper.setProps({ pluginData: changedData });
    expect(wrapper
      .find('Card.plugin-body-title')
      .find('CardBody')
      .childAt(0)
      .text())
      .toEqual('testTitle');
  });

  it('should render description inside plugin-body-description', () => {
    const changedData = Object.assign({}, samplePluginData);
    changedData.description = 'testDescription';
    wrapper.setProps({ pluginData: changedData });
    expect(wrapper
      .find('Card.plugin-body-description')
      .find('CardBody')
      .childAt(0)
      .text())
      .toEqual('testDescription');
  });
});
