import React, { Component } from 'react';
import StoreClient from '@fnndsc/chrisstoreapi';
import { Link } from 'react-router-dom';
import {
  Form, FormGroup, ControlLabel, FormControl, HelpBlock,
  Col, Icon, Card, Button, Alert, CardBody, HintBlock,
} from 'patternfly-react';
import classNames from 'classnames';
import './CreatePlugin.css';

import Plugin from '../Plugin/Plugin';

const generateFormGroup = (id, label, help, value, handleChange) => (
  <FormGroup controlId={id} key={id}>
    <Col componentClass={ControlLabel} sm={3}>
      {label}
    </Col>
    <Col sm={9}>
      <FormControl
        name={id}
        type="text"
        autoComplete="off"
        onChange={handleChange}
        value={value}
      />
      <HelpBlock>
        {help}
      </HelpBlock>
    </Col>
  </FormGroup>
);

const formGroupsData = [
  {
    id: 'name',
    label: 'Plugin Name',
    help: 'Enter a unique plugin name',
  },
  {
    id: 'image',
    label: 'Docker Image',
    help: 'The docker image to be used',
  },
  {
    id: 'repo',
    label: 'Public Repo',
    help: 'For people to see your code',
  },
];

class CreatePlugin extends Component {
  constructor() {
    super();

    this.state = {
      dragOver: false,
      name: '',
      image: '',
      repo: '',
      pluginRepresentation: {},
      fileError: false,
      formError: null,
      success: false,
    };

    const methods = [
      'setFileError', 'handleError', 'hideError', 'handleChange',
      'handleFile', 'readFile', 'handleDrag', 'handleSubmit',
    ];
    methods.forEach((method) => { this[method] = this[method].bind(this); });
  }

  setFileError(state) {
    this.setState((prevState) => {
      const nextState = {};
      if (typeof state !== 'undefined') {
        nextState.fileError = state;
      } else {
        nextState.fileError = !prevState.fileError;
      }
      return nextState;
    });
  }

  handleError(message) {
    this.setState({ formError: message });
  }

  hideError() {
    this.setState({ formError: null });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleFile(event) {
    const { target: { files: [file] } } = event;
    if (file && file.type === 'application/json') {
      this.setState({ fileName: file.name });
      this.readFile(file)
        .then(() => this.setFileError(false))
        .catch(() => this.setFileError(true));
    } else if (!file) {
      this.setState({
        fileName: undefined,
        pluginRepresentation: {},
      });
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const invalidRepresentation = new Error('Invalid Plugin Representation');
      if (file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const { target: { result } } = e;

          let pluginRepresentation;
          try {
            pluginRepresentation = JSON.parse(result);
          } catch (_err) {
            reject(invalidRepresentation);
          }

          this.setState({ pluginRepresentation, fileError: false }, resolve);
        };

        reader.onerror = () => reject(invalidRepresentation);
        reader.readAsText(file);
      } else {
        reject(invalidRepresentation);
      }
    });
  }

  handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    const dt = event.dataTransfer;

    if (event.type === 'drop') {
      const file = dt.items[0].getAsFile();
      this.handleFile({ target: { files: [file] } });
    } else if (dt) {
      const { items } = dt;

      if (items.length > 0) {
        const isJSONFormat = Array.from(items)
          .every(item => item.type === 'application/json');
        if (!isJSONFormat) {
          dt.dropEffect = 'none';
          return false;
        }
      }
      dt.dropEffect = 'copy';
    }

    switch (event.type) {
      case 'dragover':
      case 'dragenter':
        this.setState({ dragOver: true });
        break;
      case 'dragleave':
      case 'dragend':
      case 'drop':
        this.setState({ dragOver: false });
        break;
      default:
    }

    return true;
  }

  async handleSubmit() {
    const {
      name: pluginName,
      image: pluginImage,
      repo: pluginRepo,
      pluginRepresentation,
    } = this.state;

    // Array to store the errors
    const errors = [];
    let missingRepresentationString = '';

    if (!(
      pluginName.trim() && pluginImage.trim() &&
      pluginRepo.trim() && pluginRepresentation &&
      Object.keys(pluginRepresentation).length > 0
    )) {
      // Checks for individual field completion
      if (!pluginName.trim()) {
        errors.push('Plugin Name');
      }
      if (!pluginImage.trim()) {
        errors.push('Docker Image');
      }
      if (!pluginRepo.trim()) {
        errors.push('Public Repo');
      }
      if (!Object.keys(pluginRepresentation).length > 0) {
        missingRepresentationString = 'upload the plugin representation and ';
      }

      // If all the fields are empty in submission
      if (errors.length === 3 && missingRepresentationString !== '') {
        return this.handleError('All fields are required.');
      // If one fields is empty
      } else if (errors.length === 1) {
        return this.handleError(`Please ${missingRepresentationString}enter
          the ${errors[0]}`);
      // If two fields are empty
      } else if (errors.length === 2) {
        return this.handleError(`Please ${missingRepresentationString}enter
          the ${errors[0]} and ${errors[1]}`);
      // If more than Plugin Representation or two fields are empty or
      }
      // If only the Plugin Representation is missing
      if (errors.length === 0) {
        return this.handleError('Please upload the plugin representation');
      }
      const lastError = errors.pop();
      return this.handleError(`Please ${missingRepresentationString}enter
          the ${errors.join(', ')}, and ${lastError}`);
    }

    const fileData = JSON.stringify(pluginRepresentation);
    const file = new Blob([fileData], { type: 'application/json' });

    const storeURL = process.env.REACT_APP_STORE_URL;
    const token = window.sessionStorage.getItem('AUTH_TOKEN');
    const client = new StoreClient(storeURL, { token });

    let newPlugin;
    try {
      newPlugin = await client.addPlugin(pluginName, pluginImage, file, pluginRepo);
    } catch ({ message }) {
      return this.handleError(message);
    }

    this.hideError();
    this.setState({ success: true, newPlugin });
    return newPlugin;
  }

  render() {
    const { state } = this;
    const {
      dragOver, fileName, name, image, repo,
      pluginRepresentation, fileError, formError, success, newPlugin,
    } = state;

    let pluginId;
    if (newPlugin) {
      pluginId = newPlugin.items[0].data.filter(dataItem =>
        dataItem.name === 'id')[0].value;
    }
    // generate formGroups based on data
    const formGroups = formGroupsData.map((formGroup) => {
      const { id, label, help } = formGroup;
      return generateFormGroup(id, label, help, state[id], this.handleChange);
    });

    const pluginData = {
      plugin: name.trim() ? name : '[PLUGIN NAME]',
      pluginURL: '/create',
      authorURL: '/create',
      dock_image: image.trim() ? image : '[DOCKER IMAGE]',
      public_repo: repo,
      authors: '[AUTHOR]',
      version: '[VERSION]',
      title: '[TITLE]',
      description: '[DESCRIPTION]',
      ...pluginRepresentation,
    };

    // change file icon based on state
    let iconName;
    let fileText;
    if (fileError === true) {
      iconName = 'exclamation-triangle';
      fileText = 'Invalid JSON';
    } else if (typeof fileName !== 'undefined') {
      iconName = 'file';
      fileText = fileName;
    } else {
      iconName = 'upload';
      fileText = 'Upload Plugin Representation';
    }

    const labelClassNames = classNames('createplugin-upload-label', {
      dragover: dragOver,
      hasfile: fileName,
      haserror: fileError,
    });

    return (
      <div className="createplugin">
        <section className="createplugin-form-section">
          <div className="createplugin-header">
            <div className="row">
              <div className="createplugin-header-container">
                <div className="createplugin-display-1">
                  Add Plugin Details
                </div>
                <div className="createplugin-create-btn-container">
                  <Button
                    className="createplugin-create-btn"
                    bsStyle="primary"
                    bsSize="large"
                    onClick={this.handleSubmit}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {
            formError && (
              <div className="createplugin-message-container error">
                <div className="row">
                  <Alert
                    className="createplugin-message"
                    type="error"
                    onDismiss={this.hideMessage}
                  >
                    {formError}
                  </Alert>
                </div>
              </div>
            )
          }
          {
            success && (
              <div className="createplugin-message-container success">
                <div className="row">
                  <Alert
                    className="createplugin-message"
                    type="success"
                  >
                    {'Plugin was successfully created! '}
                    <Link
                      className="createplugin-success-message-link"
                      to={`/plugin/${pluginId}`}
                      href={`/plugin/${pluginId}`}
                    >
                      Click Here
                    </Link>
                    {' to view it.'}
                  </Alert>
                </div>
              </div>
            )
          }
          <Form className="createplugin-form" horizontal>
            <div className="row">
              <div className="createplugin-col">
                <Card className="createplugin-info">
                  <CardBody>
                    <HintBlock
                      title=""
                      body="Plugins should already exist and have their own public source repo
                      and existing docker image. Adding a plugin to the store simply adds
                      the location of your plugin, as well as some metadata, to the store,
                      allowing other users easy access to it."
                    />
                  </CardBody>
                </Card>
                <div className="createplugin-form-fields">
                  {formGroups}
                </div>
              </div>
              <div className="createplugin-col">
                <FormGroup className="createplugin-form-upload" controlId="file">
                  <FormControl
                    className="createplugin-upload"
                    type="file"
                    accept=".json"
                    onChange={this.handleFile}
                  />
                  <ControlLabel
                    className={labelClassNames}
                    onDragOver={this.handleDrag}
                    onDragEnter={this.handleDrag}
                    onDragLeave={this.handleDrag}
                    onDragEnd={this.handleDrag}
                    onDrop={this.handleDrag}
                  >
                    <div className="createplugin-upload-body">
                      <Icon
                        className="createplugin-upload-icon"
                        type="fa"
                        name={iconName}
                      />
                      {fileText}
                    </div>
                  </ControlLabel>
                </FormGroup>
              </div>
            </div>
          </Form>
        </section>
        <section className="createplugin-preview-section">
          <div className="row">
            <Card className="createplugin-preview-container">
              <Plugin className="createplugin-preview-plugin" pluginData={pluginData} />
            </Card>
          </div>
        </section>
      </div>
    );
  }
}

export default CreatePlugin;
