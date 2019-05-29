import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  Col,
  CardTitle,
  CardBody,
  EmptyStateAction,
  EmptyStateInfo,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Card,
  Grid,
  HelpBlock,
  CardHeading,
  DropdownKebab,
  MenuItem,
  FieldLevelHelp,
  MessageDialog,
} from 'patternfly-react';

import './DashPluginCardView.css';
import BrainImg from '../../../../assets/img/empty-brain-xs.png';
import PluginPointer from '../../../../assets/img/brainy_welcome-pointer.png';
import RelativeDate from '../../../RelativeDate/RelativeDate';

const DashGitHubEmptyState = () => (
  <Col xs={12}>
    <Card>
      <CardTitle>
        My Plugins
      </CardTitle>
      <CardBody className="card-body-empty">
        <h1 className="card-body-header-text">You have no plugins in the ChRIS store</h1>
        <h2 className="card-body-subhead">Lets fix that!</h2>
        <div className="card-body-content-parent">
          <div>
            <img src={PluginPointer} alt="Click Add Plugin" />
          </div>
          <div className="card-body-content-child-right">
            <p>
              Create a new listing for your plugin in the ChRIS
              store by clicking &#34;Add Plugin&#34; below.
            </p>
            <Button bsStyle="primary" bsSize="large" href="/create">
              Add Plugin
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>);

const DashApplicationType = (type) => {
  if (type === 'ds') {
    return (<React.Fragment><span className="fa fa-database" /> Data System</React.Fragment>);
  }
  return (<React.Fragment><span className="fa fa-file" /> File System</React.Fragment>);
};

class DashPluginCardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteConfirmation: false,
      showEditConfirmation: false,
      pluginToDelete: null,
      pluginToEdit: null,
      publicRepo: '',
    };

    const methods = [
      'deletePlugin', 'secondaryDeleteAction', 'showDeleteModal',
      'editPlugin', 'secondaryEditAction', 'showEditModal', 'handlePublicRepo',
    ];
    methods.forEach((method) => { this[method] = this[method].bind(this); });
  }
  deletePlugin() {
    const { onDelete } = this.props;
    const { pluginToDelete } = this.state;
    onDelete(pluginToDelete.id);
    this.setState({ showDeleteConfirmation: false });
  }
  secondaryDeleteAction() {
    this.setState({ showDeleteConfirmation: false });
  }
  showDeleteModal(plugin) {
    this.setState({
      showDeleteConfirmation: true,
      pluginToDelete: plugin,
    });
  }
  editPlugin() {
    const { onEdit } = this.props;
    const { pluginToEdit } = this.state;
    onEdit(pluginToEdit.id, this.state.publicRepo);
    this.setState({ showEditConfirmation: false });
  }
  secondaryEditAction() {
    this.setState({ showEditConfirmation: false });
  }
  showEditModal(plugin) {
    this.setState({
      showEditConfirmation: true,
      pluginToEdit: plugin,
    });
  }
  handlePublicRepo(event) {
    this.setState({ publicRepo: event.target.value });
  }


  render() {
    let pluginCardBody;
    const { plugins } = this.props;
    const {
      pluginToDelete, showDeleteConfirmation, pluginToEdit, showEditConfirmation,
    } = this.state;
    const showEmptyState = isEmpty(plugins);
    const primaryDeleteContent = <p className="lead">Are you sure?</p>;
    const secondaryDeleteContent = (
      <p>
        Plugin <b>{pluginToDelete ? pluginToDelete.name : null}</b> will be permanently deleted
      </p>);
    const secondaryEditContent = (
      pluginToEdit ? (
        <Grid>
          <Form horizontal>
            <FormGroup controlId="name" disabled={false}>
              <Col componentClass={ControlLabel} sm={2}>
                Public Repo
              </Col>
              <Col sm={5}>
                <FormControl
                  type="text"
                  defaultValue={pluginToEdit.public_repo}
                  onChange={this.handlePublicRepo}
                  name="publicRepo"
                />
                <HelpBlock>
                  Enter the public repo URL for your plugin
                </HelpBlock>
              </Col>
            </FormGroup>
          </Form>
        </Grid>
      )
        : null
    );
    const addNewPlugin = (
      <Col xs={12} sm={6} md={4} key="addNewPlugin">
        <Card>
          <CardBody className="card-view-add-plugin">
            <div>
              <img width="77" height="61" src={BrainImg} alt="Add new plugin" />
            </div>
            <EmptyStateInfo>
              Click below to add a new ChRIS plugin
            </EmptyStateInfo>
            <EmptyStateAction>
              <Button bsStyle="primary" bsSize="large" href="/create">
                Add Plugin
              </Button>
            </EmptyStateAction>
          </CardBody>
        </Card>
      </Col>);
    if (plugins) {
      pluginCardBody = plugins.map((plugin) => {
        const creationDate = new RelativeDate(plugin.creation_date);
        const applicationType = new DashApplicationType(plugin.type);
        return (
          <Col xs={12} sm={6} md={4} key={plugin.name}>
            <Card>
              <CardHeading>
                <CardTitle>
                  <DropdownKebab id="myKebab" pullRight className="card-view-kebob">
                    <MenuItem eventKey={plugin} onSelect={this.showEditModal}>
                      Edit
                    </MenuItem>
                    <MenuItem eventKey={plugin} onSelect={this.showDeleteModal}>
                      Delete
                    </MenuItem>
                  </DropdownKebab>
                  <Link
                    to={`/plugin/${plugin.id}`}
                    href={`/plugin/${plugin.id}`}
                  >{plugin.name}
                  </Link>
                  <div className="card-view-tag-title">
                    <FieldLevelHelp content={
                      <div>{plugin.description}</div>}
                    />
                  </div>
                </CardTitle>
              </CardHeading>
              <CardBody>
                <div className="card-view-app-type">
                  {applicationType}
                </div>
                <div>
                  <div className="card-view-plugin-tag">
                    {`Version ${plugin.version}`}
                  </div>
                </div>
                <div>
                  <div className="card-view-plugin-tag">
                    {creationDate.isValid() &&
                    `Created ${creationDate.format()}`
                    }
                  </div>
                </div>
                <div>
                  <div className="card-view-plugin-tag">
                    {`${plugin.license} license`}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      });
      pluginCardBody.push(addNewPlugin);
    }
    return (
      showEmptyState ?
        <DashGitHubEmptyState />
        :
        <React.Fragment>
          <div className="card-view-row">
            {pluginCardBody}
            <MessageDialog
              show={showDeleteConfirmation}
              onHide={this.secondaryDeleteAction}
              primaryAction={this.deletePlugin}
              secondaryAction={this.secondaryDeleteAction}
              primaryActionButtonContent="Delete"
              secondaryActionButtonContent="Cancel"
              primaryActionButtonBsStyle="danger"
              title="Plugin Delete Confirmation"
              primaryContent={primaryDeleteContent}
              secondaryContent={secondaryDeleteContent}
              accessibleName="deleteConfirmationDialog"
              accessibleDescription="deleteConfirmationDialogContent"
            />
            <MessageDialog
              show={showEditConfirmation}
              onHide={this.secondaryEditAction}
              primaryAction={this.editPlugin}
              secondaryAction={this.secondaryEditAction}
              primaryActionButtonContent="Save"
              secondaryActionButtonContent="Cancel"
              title="Edit Plugin Details"
              secondaryContent={secondaryEditContent}
              accessibleName="editConfirmationDialog"
              accessibleDescription="editConfirmationDialogContent"
            />
          </div>
        </React.Fragment>
    );
  }
}

DashPluginCardView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

DashPluginCardView.defaultProps = {
  plugins: [],
};


export default DashPluginCardView;
