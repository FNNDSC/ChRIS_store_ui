import React, { Component } from 'react';
import Client from '@fnndsc/chrisstoreapi';
import { Link } from 'react-router-dom';
import {
  CardHeader,
  Grid,
  GridItem,
  Form,
  FormGroup,
  FileUpload,
  Alert,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import { FileIcon, UploadIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';

import FormInput from '../FormInput';
import Button from '../Button';
import './CreatePlugin.css';

class CreatePlugin extends Component {
  constructor() {
    super();

    this.state = {
      name: String(),
      dock_image: String(),
      public_repo: String(),
      pluginRepresentation: Object(),
      fileError: false,
      error: {
        message: String(),
        controls: [],
      },
      formError: null,
      success: false,
      isDisabled: true
    };

    this.storeURL = process.env.REACT_APP_STORE_URL;

    this.formGroupsData = [
      {
        id: 'name',
        label: 'Plugin Name',
        placeholder: 'Choose a unique name',
      },
      {
        id: 'dock_image',
        label: 'Docker Image',
        placeholder: 'DockerHub URL of the image to be used',
      },
      {
        id: 'public_repo',
        label: 'Repository',
        placeholder: 'Public URL to your source code',
      },
    ];

    [
      'setFileError', 'handleError', 'hideError', 'handleChange',
      'handleFile', 'readFile', 'handleSubmit', 'validatePluginName'
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  // eslint-disable-next-line consistent-return
  handleError(message) {
    let errorObj;
    try {
      errorObj = JSON.parse(message);
      if (Object.prototype.hasOwnProperty.call(errorObj, 'non_field_errors')) {
        return this.setState({
          formError: errorObj.non_field_errors,
        });
      } 
      
      if (Object.prototype.hasOwnProperty.call(errorObj, 'public_repo')) {
        return this.setState({
          error: {
            message: errorObj.public_repo,
            controls: ['public_repo']
          }
        })
      } 
      if (Object.prototype.hasOwnProperty.call(errorObj, 'dock_image')) {
        return this.setState({
          error: {
            message: errorObj.dock_image,
            controls: ['dock_image']
          }
        })
      } 

      if (Object.prototype.hasOwnProperty.call(errorObj, 'descriptor_file')) {
        return this.setState({ formError: errorObj.descriptor_file });
      } 

        this.setState({ formError: message });
      
    } catch (e) {
      return this.setState({ formError: message });
    }
  }

  
  // eslint-disable-next-line react/sort-comp
async validatePluginName(value) {
    try {
      const result = await this.Client().getPluginMetas({
        name_title_category: value,
      });
      if (result.data.length === 0) return 'success';
      return 'error';
    } catch (error) {
      return 'warning';
    }
}


 handleChange(value, name) {
    // eslint-disable-next-line camelcase
    const {dock_image, public_repo} = this.state

    this.setState({ [name]: value });

    if ((name.length < 5) || (dock_image.length <= 1) || (public_repo.length <= 1)) {
      this.setState({isDisabled: true})
    } else {
      this.setState({isDisabled: false})
    }
  }

  // eslint-disable-next-line consistent-return
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

  async handleSubmit(event) {
    event.preventDefault()
    event.persist()
    const {
      name: pluginName,
      dock_image: pluginImage,
      public_repo: pluginRepo,
      pluginRepresentation,
    } = this.state;    

    const inputImage = pluginImage.trim();

    if (pluginName.length < 5) {
      this.setState({ error: { message: "Name needs at least 5 characters", controls: ['name']}});
    }

    if (pluginName) {
      // validate if name already exists
      await this.validatePluginName(pluginName).then((status) => {
        if (status === 'error') {
          this.setState({ error: { message: "Name is already in use", controls: ['name']}});
        }
        if (status === "warning") {
          this.setState({ error: { message: "", controls: ['name']}});
        }
      })
    }
    if (inputImage) {
      if (inputImage.endsWith(':latest')) {
        return this.setState({
          error: {
            message:
          <span>
            The
            <code>:latest</code>
            tag is discouraged.
          </span>,
          controls: ['dock_image']
          }
        });
      }

      if (!inputImage.includes(':')) {
        /**
         * @todo
         * We can provide specific feedback based on the plugin's JSON description,
         * if it is uploaded.
         */
        const tag = inputImage.split(':')[0];
        return this.setState({
        error: {
          message: 
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
          controls: ['dock_image']
        }
          })
      }
    }

    if(!Object.keys(pluginRepresentation).length) {
      return this.handleError('Please upload the plugin representation')
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
      if (!this.formError) {
      const resp = await client.createPlugin(pluginData, fileObj);
      newPlugin = resp.data;
      }
    } catch ({ message }) {
      return this.handleError(message);
    }

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
      fileName, fileError, formError, success, newPlugin, error, isDisabled
    } = this.state;

    let pluginId;
    if (newPlugin) {
      pluginId = newPlugin.id;
    }

    // generate formGroups based on data
    const PluginFormDataGroups = this.formGroupsData.map(

      ({ id, label, placeholder }) => (
      
        <FormGroup label={label} key={id}>

          <FormInput 
            fieldId={id} 
            name={id}
            validationState={error.controls.includes(id) ? 'error' : 'default'}
            placeholder={placeholder}
            inputType="text"
            id={id}
            fieldName={id}
            onChange={(val) => this.handleChange(val, id)}
            error={error}
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
                      // timeout={5000}
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

                      <FormGroup label="Representation File" id="createplugin-upload " isRequired>
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
                            accept=".json"
                            browseButtonText="Select File"
                            filename={fileName}
                            onChange={((val) => this.handleFile(val, val.name))}
                            isRequired
                          />
                        </div>
                      </FormGroup>

                      <Button
                        id="createplugin-create-btn"
                        variant="primary"
                        type="submit"
                        isDisabled={isDisabled}
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
