import React, { Component } from 'react';
import Client from '@fnndsc/chrisstoreapi';
import { Link } from 'react-router-dom';
import {
  CardHeader,
  Grid,
  GridItem,
  Form,
  FormGroup,
  TextInput,
  FileUpload,
  Alert,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import { FileIcon, UploadIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

import Button from '../Button';
import './CreatePlugin.css';

class CreatePlugin extends Component {
  constructor() {
    super();

    this.state = {
      dragOver: false,
      isNameValidated: 'default',
      name: String(),
      image: String(),
      repo: String(),
      pluginRepresentation: Object(),
      fileError: false,
      formError: null,
      success: false,
    };

    this.storeURL = process.env.REACT_APP_STORE_URL;

    this.formGroupsData = [
      {
        id: 'name',
        label: 'Plugin Name',
        help: 'Choose a unique name',
        validated: 'isNameValidated',
        validation: async (value) => {
          if (value.length < 5) return 'warning';

          try {
            const result = await this.Client().getPluginMetas({
              name_title_category: value,
            });
            if (result.data.length === 0) return 'success';
            return 'error';
          } catch (error) {
            return 'warning';
          }
        },
      },
      {
        id: 'image',
        label: 'Docker Image',
        help: 'DockerHub URL of the image to be used',
      },
      {
        id: 'repo',
        label: 'Repository',
        help: 'Public URL to your source code',
      },
    ];

    [
      'setFileError', 'handleError', 'hideError', 'handleChange',
      'handleFile', 'readFile', 'handleSubmit',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
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

  handleChange(value, { target }, check) {
    const nextState = { [target.name]: value };
    this.setState(nextState);

    if (check) {
      check.validation(value).then((status) => {
        this.setState({
          [check.validated]: status,
        });
      });
    }
  }

  handleFile(value, filename) {
    if (value && value.type === 'application/json') {
      this.setState({ fileName: filename });
      this.readFile(value)
        .then(() => this.setFileError(false))
        .catch(() => this.setFileError(true));
    } else {
      this.setState({
        fileName: undefined,
        pluginRepresentation: {},
      });
      this.setFileError(true);
    }
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
    if (inputImage) {
      if (inputImage.endsWith(':latest')) {
        this.handleError(
          <span>
            The
            <code>:latest</code>
            tag is discouraged.
          </span>,
        );
      } else if (!inputImage.includes(':')) {
        /**
         * @todo
         * We can provide specific feedback based on the plugin's JSON description,
         * if it is uploaded.
         */
        const tag = inputImage.split(':')[0];
        this.handleError(
          <div>
            <p>
              Please tag your Docker image by version.
              <br />
              Example:
            </p>
            <CodeBlock>
              <CodeBlockCode>
                docker tag
                {tag}
                {tag}
                :1.0.1
                <br />
                docker push
                {tag}
                :1.0.1
              </CodeBlockCode>
            </CodeBlock>
          </div>,
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
      } if (errors.length === 1) {
        return this.handleError(`Please ${missingRepresentationString}enter
          the ${errors[0]}`);
      // If two fields are empty
      } if (errors.length === 2) {
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

    const client = this.Client();

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

  Client() {
    const token = window.sessionStorage.getItem('AUTH_TOKEN');
    return new Client(this.storeURL, { token });
  }

  hideError() {
    this.setState({ formError: null });
  }

  render() {
    const {
      fileName, fileError, formError, success, newPlugin,
    } = this.state;

    let pluginId;
    if (newPlugin) {
      pluginId = newPlugin.id;
    }

    // generate formGroups based on data
    const PluginFormDataGroups = this.formGroupsData.map(
      ({ id, label, help, validated, validation  }) => (
        <FormGroup label={label} key={id} type="text">
          <TextInput id={id} name={id}
            autoComplete="off"
            // eslint-disable-next-line react/destructuring-assignment
            validated={validated ? this.state[validated] : undefined}
            // eslint-disable-next-line react/destructuring-assignment
            value={this.state[id]}
            onChange={!validated ? this.handleChange : (
              (...args) => this.handleChange(...args, { validated, validation })
            )}
            placeholder={help}
            isRequired
          />
        </FormGroup>
      )
    );

    return (
      <article className="createplugin">
        <Grid hasGutter className="createplugin-form-container">
          <GridItem lg={6} xs={12}>
            <Grid hasGutter>
              <GridItem xs={12}>
                <h1>Create Plugin</h1><br/>
              </GridItem>

              <GridItem xs={12}>
                <h3><b>Plugin Creation</b></h3>
                <p style={{ fontSize: '1.25em' }}>
                  Plugins should already exist and have their own public source repo and existing docker image.
                  Adding a plugin to the store simply adds the location of your plugin, allowing other users to access it.
                </p>
              </GridItem>

              <GridItem xs={12}>
                <h3><b>About Plugins</b></h3>
                <p style={{ fontSize: '1.25em' }}>
                  Plugins should already exist and have their own public source repo and existing docker image.
                  Adding a plugin to the store simply adds the location of your plugin, allowing other users to access it.
                </p>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem lg={6} xs={12}>
            <Grid hasGutter>
              {
                formError ? (
                  <GridItem xs={12}>
                    <Alert
                      className="createplugin-message"
                      variant="danger"
                      title={formError}
                      timeout={5000}
                    />
                  </GridItem>
                ) : null
              }

              {
                success ? (
                  <GridItem xs={12}>
                    <Alert
                      className="createplugin-message"
                      variant="success"
                      title="Plugin was successfully created!"
                      timeout={5000}
                    >
                      <Link
                        className="createplugin-success-message-link"
                        to={`/p/${pluginId}`}
                      >
                        Click Here to view.
                      </Link>
                    </Alert>
                  </GridItem>
                ) : null
              }

              <GridItem xs={12}>
                <Card>
                  <CardHeader>
                    <h2>Add Plugin Details</h2>
                  </CardHeader>

                  <CardBody>
                    <Form id="createplugin-form">
                      { PluginFormDataGroups }

                      <FormGroup label="Representation File" id="createplugin-upload">
                        <div id="createplugin-upload-file">
                          <span id="createplugin-upload-icon">
                            { // eslint-disable-next-line no-nested-ternary
                              fileError ? <ExclamationTriangleIcon /> : (
                              !fileName ? <UploadIcon /> : <FileIcon />
                            )}
                          </span>
                          <FileUpload
                            id="createplugin-upload-fileupload"
                            className="fileupload"
                            type="file"
                            isRequired
                            accept=".json"
                            browseButtonText="Select File"
                            filename={fileName}
                            onChange={this.handleFile}
                          />
                        </div>
                      </FormGroup>

                      <Button
                        id="createplugin-create-btn"
                        variant="primary"
                        onClick={this.handleSubmit}
                      >
                        Create
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </article>
    );
  }
}

export default CreatePlugin;
