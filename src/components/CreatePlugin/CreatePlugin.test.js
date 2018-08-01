import React from 'react';
import { shallow } from 'enzyme';
import { ControlLabel } from 'patternfly-react';
import CreatePlugin from './CreatePlugin';

describe('CreatePlugin', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<CreatePlugin />);
  });

  it('should render div', () => {
    expect(wrapper.find('div.createplugin')).toHaveLength(1);
  });

  it('should render createplugin-*-section sections inside createplugin div', () => {
    const container = wrapper.find('div.createplugin');
    expect(container.find('section.createplugin-form-section')).toHaveLength(1);
    expect(container.find('section.createplugin-preview-section')).toHaveLength(1);
  });

  it('should render createplugin-header inside createplugin div', () => {
    expect(wrapper
      .find('div.createplugin')
      .find('div.createplugin-header'))
      .toHaveLength(1);
  });

  it('should render row div inside createplugin-header div', () => {
    expect(wrapper
      .find('div.createplugin-header')
      .find('div.row'))
      .toHaveLength(1);
  });

  it('should render createplugin-display-1 div inside row div', () => {
    expect(wrapper
      .find('div.createplugin-header')
      .find('div.row')
      .find('div.createplugin-display-1'))
      .toHaveLength(1);
  });

  it('should render row div inside createplugin div', () => {
    expect(wrapper
      .find('div.createplugin')
      .find('div.row')
      .at(1))
      .toEqual(expect.anything());
  });

  it('should render 2 createplugin-col divs inside createplugin-form Form', () => {
    expect(wrapper
      .find('Form.createplugin-form')
      .find('div.createplugin-col'))
      .toHaveLength(2);
  });

  /* ============================== */
  /* ============= FORM =========== */
  /* ============================== */

  it('should render createplugin-form Form inside createplugin div', () => {
    expect(wrapper
      .find('div.createplugin')
      .find('Form.createplugin-form'))
      .toHaveLength(1);
  });

  it('should render createplugin-form-fields inside left createplugin-col', () => {
    expect(wrapper
      .find('Form.createplugin-form')
      .find('div.createplugin-col')
      .first()
      .find('div.createplugin-form-fields'))
      .toHaveLength(1);
  });

  it("should render all FormGroup's in the left column correctly", () => {
    const formGroups = wrapper
      .find('Form.createplugin-form')
      .find('div.createplugin-form-fields')
      .find('FormGroup');

    formGroups.forEach((formGroup) => {
      expect(formGroup.children('Col')).toHaveLength(2);
      expect(formGroup
        .children('Col')
        .first()
        .prop('componentClass'))
        .toEqual(ControlLabel);

      const secondCol = formGroup.children('Col').at(1);
      expect(secondCol.find('FormControl')).toHaveLength(1);
      expect(secondCol.find('HelpBlock')).toHaveLength(1);
    });
  });

  const getFormGroupFromId = id => wrapper
    .find('Form.createplugin-form')
    .find(`FormGroup[controlId="${id}"]`);

  it("should render defined FormGroup's inside createplugin-form", () => {
    expect(getFormGroupFromId('name')).toHaveLength(1);
    expect(getFormGroupFromId('image')).toHaveLength(1);
    expect(getFormGroupFromId('repo')).toHaveLength(1);
  });

  it('should update state with handleChange method', () => {
    expect(wrapper.state('testInputName')).toBeUndefined();
    wrapper.instance().handleChange({
      target: {
        name: 'testInputName',
        value: 'testValue',
      },
    });
    expect(wrapper.state('testInputName')).toBe('testValue');
  });

  it('should render formGroups based on state values', () => {
    const ids = ['name', 'image', 'repo'];
    ids.forEach((id) => {
      const formGroup = wrapper.find(`FormControl[name="${id}"]`);
      expect(formGroup.prop('value')).toBe('');
    });

    wrapper.setState({
      name: 'testValue',
      image: 'testValue',
      repo: 'testValue',
    });

    ids.forEach((id) => {
      const formGroup = wrapper.find(`FormControl[name="${id}"]`);
      expect(formGroup.prop('value')).toBe('testValue');
    });
  });

  /* ============================== */
  /* ============ UPLOAD ========== */
  /* ============================== */

  const findUploadFormGroup = shallowWrapper => shallowWrapper
    .find('Form.createplugin-form')
    .find('FormGroup[controlId="file"]');

  it('should render FormGroup in second Col', () => {
    expect(findUploadFormGroup(wrapper)).toHaveLength(1);
  });

  it('should structure upload FormGroup correctly', () => {
    expect(findUploadFormGroup(wrapper).find('FormControl')).toHaveLength(1);
    const controlLabel = findUploadFormGroup(wrapper).find('ControlLabel');
    expect(controlLabel).toHaveLength(1);
    expect(controlLabel.find('div.createplugin-upload-body')).toHaveLength(1);
  });

  it('should structure createplugin-upload-body correctly', () => {
    const body = wrapper.find('div.createplugin-upload-body');
    expect(body.find('Icon.createplugin-upload-icon')).toHaveLength(1);
  });

  it('should render createplugin-upload-body based on fileName state', () => {
    wrapper.setState({ fileName: 'test.json' });
    const body = wrapper.find('div.createplugin-upload-body');
    expect(body.find('div.createplugin-upload-body').text()).toBe('<Icon />test.json');
    expect(body
      .find('Icon.createplugin-upload-icon')
      .prop('name'))
      .toBe('file');
  });

  const defaultEventProps = {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  };

  it('should set dragOver to true when handleDrag is called', () => {
    expect(wrapper.state('dragOver')).toBe(false);
    const event = { type: 'dragover', ...defaultEventProps };
    wrapper.instance().handleDrag(event);
    expect(wrapper.state('dragOver')).toBe(true);
  });

  it('should set dragOver to false when handleDrag is called', () => {
    wrapper.setState({ dragOver: true });
    const event = { type: 'dragleave', ...defaultEventProps };
    wrapper.instance().handleDrag(event);
    expect(wrapper.state('dragOver')).toBe(false);
  });

  it('should prevent event when handleDrag is called', () => {
    const event = { type: 'dragstart', ...defaultEventProps };
    wrapper.instance().handleDrag(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('handleDrag method should return false when the dataTransfer has incorrect type', () => {
    const event = {
      dataTransfer: {
        items: [
          {
            type: 'image/png',
          },
        ],
      },
      ...defaultEventProps,
    };
    expect(wrapper.instance().handleDrag(event)).toBe(false);
  });

  it('should call handleFile method when valid file has been dropped', () => {
    // spy for handleFile method
    const spy = jest.spyOn(CreatePlugin.prototype, 'handleFile');
    const mockedWrapper = shallow(<CreatePlugin />);
    spy.mockRestore();

    const blob = new Blob([JSON.stringify({ test: 'json' }, null, 2)]);
    const file = new File([blob], 'test.json', { type: 'application/json' });

    const mockFn = jest.fn().mockReturnValue(file);
    const event = {
      type: 'drop',
      dataTransfer: {
        items: [
          {
            getAsFile: mockFn,
          },
        ],
      },
      ...defaultEventProps,
    };

    mockedWrapper.instance().handleDrag(event);
    expect(mockFn).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should set fileName state when handleFile method is called with a valid file', () => {
    const options = { type: 'application/json' };
    const blob = new Blob([JSON.stringify({ test: 'json' }, null, 2)]);
    const file = new File([blob], 'test.json', options);

    const event = {
      target: {
        files: [file],
      },
    };

    wrapper.instance().handleFile(event);
    expect(wrapper.state('fileName')).toBe('test.json');
  });

  it('should remove fileName state when handleFile method is called with invalid file', () => {
    wrapper.setState({ fileName: 'test.json' });

    const event = {
      target: {
        files: [],
      },
    };

    expect(wrapper.state('fileName')).toBeDefined();
    wrapper.instance().handleFile(event);
    expect(wrapper.state('fileName')).toBeUndefined();
  });

  it('should remove pluginRepresentation state when handleFile method is called with invalid file', () => {
    const { handleFile } = wrapper.instance();
    const event = {
      target: {
        files: [],
      },
    };
    wrapper.setState({ pluginRepresentation: { test: 'value' } });

    expect(wrapper.state('pluginRepresentation')).toEqual({ test: 'value' });
    handleFile(event);
    expect(wrapper.state('pluginRepresentation')).toEqual({});
  });

  it('should set pluginRepresentation state when readFile method is called with valid file', () => {
    const { readFile } = wrapper.instance();
    const blob = new Blob([JSON.stringify({ test: 'json' }, null, 2)], { type: 'application/json' });

    expect(wrapper.state('pluginRepresentation')).toEqual({});
    return readFile(blob)
      .then(() => {
        expect(wrapper.state('pluginRepresentation')).toEqual({ test: 'json' });
      });
  });

  it('should render createplugin-upload-label with className "dragover" when dragover is true', () => {
    const getLabel = () => wrapper.find('ControlLabel.createplugin-upload-label.dragover');
    expect(getLabel()).toHaveLength(0);
    wrapper.setState({ dragOver: true });
    expect(getLabel()).toHaveLength(1);
  });

  it('should set fileError state to true when handleFileError is called with state', () => {
    const { setFileError } = wrapper.instance();
    expect(wrapper.state('fileError')).toBeFalsy();
    setFileError(true);
    expect(wrapper.state('fileError')).toBeTruthy();
    setFileError(false);
    expect(wrapper.state('fileError')).toBeFalsy();
  });

  it('should toggle fileError state when setFileError is called without a state', () => {
    const { setFileError } = wrapper.instance();
    expect(wrapper.state('fileError')).toBeFalsy();
    setFileError();
    expect(wrapper.state('fileError')).toBeTruthy();
  });

  it('should render createplugin-upload-label with className "haserror" after setFileError is called', () => {
    const getLabel = () => wrapper.find('ControlLabel.createplugin-upload-label.haserror');
    expect(getLabel()).toHaveLength(0);
    wrapper.setState({ fileError: true });
    expect(getLabel()).toHaveLength(1);
  });

  it('should render createplugin-upload-icon with name "exclamation-triangle" prop if fileError state is true', () => {
    const getIcon = () => wrapper.find('Icon.createplugin-upload-icon[name="exclamation-triangle"]');
    expect(getIcon()).toHaveLength(0);
    wrapper.setState({ fileError: true });
    expect(getIcon()).toHaveLength(1);
  });

  /* ============================== */
  /* =========== PREVIEW ========== */
  /* ============================== */

  it('should render pluginData prop for Plugin component based on form state', () => {
    const state = {
      name: 'testName',
      image: 'testImage',
      repo: 'testRepo',
    };
    wrapper.setState(state);

    expect(wrapper
      .find('section.createplugin-preview-section')
      .find('Plugin')
      .prop('pluginData'))
      .toEqual({
        dock_image: state.image,
        plugin: state.name,
        pluginURL: '/create',
        authorURL: '/create',
        public_repo: state.repo,
        authors: '[AUTHOR]',
        description: '[DESCRIPTION]',
        title: '[TITLE]',
        version: '[VERSION]',
      });
  });

  it('should render pluginData prop for Plugin component based on upload state', () => {
    const state = {
      name: 'testName',
      image: 'testImage',
      repo: 'testRepo',
      pluginRepresentation: {
        title: 'testTitle',
        version: '1.0',
        authors: 'testAuthor',
        description: 'testDescription',
      },
    };
    wrapper.setState(state);

    expect(wrapper
      .find('section.createplugin-preview-section')
      .find('Plugin')
      .prop('pluginData'))
      .toEqual({
        dock_image: state.image,
        plugin: state.name,
        pluginURL: '/create',
        authorURL: '/create',
        public_repo: state.repo,
        authors: 'testAuthor',
        description: 'testDescription',
        title: 'testTitle',
        version: '1.0',
      });
  });
});
