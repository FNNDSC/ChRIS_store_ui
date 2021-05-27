import React, { Component } from 'react';
import classNames from 'classnames';
import Client from '@fnndsc/chrisstoreapi';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Form, FormGroup, TextInput, FileUpload, FormHelperText as HelpBlock } from '@patternfly/react-core';
import { Label as ControlLabel } from '@patternfly/react-core';
import { FileIcon, UploadIcon, ExclamationTriangleIcon } from '@patternfly/react-icons'

import Button from '../Button';
import './CreatePlugin.css';

import { Plugin } from '../Plugin/Plugin';
import { Alert, AlertActionCloseButton, Card, CardBody, CodeBlock, CodeBlockCode } from '@patternfly/react-core';
import HintBlock from '../Hintblock';

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

const createPluginHint = "Plugins should already exist and have their own public source repo and existing docker image. " +
"Adding a plugin to the store simply adds the location of your plugin, as well as some metadata, to the store, allowing other users easy access to it."

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

  generateFormGroup = (id, label, help, value, handleChange) => (
    <FormGroup controlId={id} key={id}>
      <Grid>
        <GridItem xs={3}>
          {label}
        </GridItem>
        <GridItem xs={9}>
          <TextInput
            name={id}
            type="text"
            autoComplete="off"
            onChange={handleChange}
            value={value}
          />
          <HelpBlock>
            {help}
          </HelpBlock>
        </GridItem>
      </Grid>
      {/* <Col componentClass={ControlLabel} sm={3}>
        
      </Col> */}
      {/* <Col sm={9}>
        
      </Col> */}
    </FormGroup>
  );

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
    let errorObj;
    try {
      errorObj = JSON.parse(message);
      if (Object.prototype.hasOwnProperty.call(errorObj, 'non_field_errors')) {
        this.setState({
          formError: errorObj.non_field_errors,
        });
      } else if (Object.prototype.hasOwnProperty.call(errorObj, 'public_repo')) {
        this.setState({
          formError: errorObj.public_repo,
        });
      } else {
        this.setState({ formError: message });
      }
    } catch (e) {
      this.setState({ formError: message });
    }
  }

  hideError() {
    this.setState({ formError: null });
  }

  handleChange(value, event) {
    event.persist();
    this.setState({ [event.target.name]: value });
  }

  handleFile({ value, filename }) {
    if (value && value.type === 'application/json') {
      this.setState({ fileName: filename });
      this.readFile(value)
        .then(() => this.setFileError(false))
        .catch(() => this.setFileError(true));
    } else if (!value) {
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
    const inputImage = pluginImage.trim();
    if(inputImage){
      if (inputImage.endsWith(':latest')) {
        return this.handleError(<span>The <code>:latest</code> tag is discouraged.</span>);
      }
      else if (!inputImage.includes(':')) {
        /*
         * TODO
         * We can provide specific feedback based on the plugin's JSON description,
         * if it is uploaded.
         */
        const tag = inputImage.split(':')[0];
        return this.handleError(
          <div>
            <p>
              Please tag your Docker image by version.<br />
              Example:
            </p>
            <CodeBlock>
              <CodeBlockCode>
                docker tag {tag} {tag}:1.0.1<br />
                docker push {tag}:1.0.1
              </CodeBlockCode>
            </CodeBlock>
          </div>
        );
      }
    }
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
    const fileObj = { descriptor_file: file };

    const pluginData = {
      name: pluginName,
      dock_image: pluginImage,
      public_repo: pluginRepo,
    };

    const storeURL = process.env.REACT_APP_STORE_URL;
    const token = window.sessionStorage.getItem('AUTH_TOKEN');
    const client = new Client(storeURL, { token });

    let newPlugin;
    try {
      const resp = await client.createPlugin(pluginData, fileObj);
      newPlugin = resp.data;
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
      pluginId = newPlugin.id;
    }
    // generate formGroups based on data
    const formGroups = formGroupsData.map((formGroup) => {
      const { id, label, help } = formGroup;
      return this.generateFormGroup(id, label, help, state[id], this.handleChange);
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
                    variant="primary"
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
                  variant="danger"
                  title={formError}
                  actionClose={<AlertActionCloseButton onClose={this.hideMessage} />}
                />
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
                    variant="success"
                    title="Plugin was successfully created!"
                  >
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
                      hintBody= {createPluginHint}
                    />
                  </CardBody>
                </Card>
                <div className="createplugin-form-fields">
                  {formGroups}
                </div>
              </div>
              <div className="createplugin-col">
                <FormGroup className="createplugin-form-upload" controlId="file">
                  <FileUpload
                    className="createplugin-upload"
                    type="file"
                    accept=".json"
                    onChange={this.handleFile}
                  />
                  <ControlLabel
                    className={classNames('createplugin-upload-label', {
                      dragover: dragOver,
                      hasfile: fileName,
                      haserror: fileError,
                    })}
                    onDragOver={this.handleDrag}
                    onDragEnter={this.handleDrag}
                    onDragLeave={this.handleDrag}
                    onDragEnd={this.handleDrag}
                    onDrop={this.handleDrag}
                  >
                    <div className="createplugin-upload-body">
                      {
                        fileError ? 
                        <><ExclamationTriangleIcon className="createplugin-upload-icon"/> {"Invalid JSON"}</>
                        : 
                        (
                          !fileName ? 
                          <><UploadIcon className="createplugin-upload-icon"/> {"Upload Plugin Representation"}</>
                          : 
                          <><FileIcon className="createplugin-upload-icon"/> {fileName}</>
                        )
                      }
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