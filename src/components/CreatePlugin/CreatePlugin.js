import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, FormControl, HelpBlock, Col, Icon, Card } from 'patternfly-react';
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
    };

    this.handleError = this.handleError.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.readFile = this.readFile.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleError(message) {
    /* TODO */
    if (this) console.error(message);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleFile(event) {
    const { target: { files: [file] } } = event;
    if (file && file.type === 'application/json') {
      this.setState({ fileName: file.name });
      this.readFile(file)
        .catch(err => this.handleError(err.message));
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

          this.setState({ pluginRepresentation }, resolve);
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

  render() {
    const { state } = this;
    const {
      dragOver, fileName, name, image, repo, pluginRepresentation,
    } = state;

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

    return (
      <div className="createplugin">
        <section className="createplugin-form-section">
          <div className="createplugin-header">
            <div className="row">
              <div className="createplugin-display-1">
                Create Plugin
              </div>
            </div>
          </div>
          <Form className="createplugin-form" horizontal>
            <div className="row">
              <div className="createplugin-col">
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
                    className={`createplugin-upload-label ${dragOver ? 'dragover' : ''} ${fileName ? 'hasfile' : ''}`}
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
                        name={fileName ? 'file' : 'upload'}
                      />
                      {fileName || 'Upload Plugin Representation'}
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
