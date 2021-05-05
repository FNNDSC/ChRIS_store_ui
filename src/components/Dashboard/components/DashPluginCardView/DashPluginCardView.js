import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import {
  Col,
  EmptyStateAction,
  EmptyStateInfo,
  FieldLevelHelp,
  MessageDialog
} from "patternfly-react";
import { CardTitle, CardBody, Card, DropdownItem, Dropdown, KebabToggle, GridItem, Grid, Form } from "@patternfly/react-core";
import Button from "../../../Button";
import "./DashPluginCardView.css";
import BrainImg from "../../../../assets/img/empty-brain-xs.png";
import PluginPointer from "../../../../assets/img/brainy_welcome-pointer.png";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import FormInput from "../../../FormInput";

const DashGitHubEmptyState = () => (
  <Col xs={12}>
    <Card>
      <CardTitle>My Plugins</CardTitle>
      <CardBody className="card-body-empty">
        <h1 className="card-body-header-text">
          You have no plugins in the ChRIS store
        </h1>
        <h2 className="card-body-subhead">Lets fix that!</h2>
        <div className="card-body-content-parent">
          <div>
            <img src={PluginPointer} alt="Click Add Plugin" />
          </div>
          <div className="card-body-content-child-right">
            <p>
              Create a new listing for your plugin in the ChRIS store by
              clicking &#34;Add Plugin&#34; below.
            </p>
            <Button variant="primary" toRoute="/create">
              Add Plugin
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
);

const DashApplicationType = type => {
  if (type === "ds") {
    return (
      <React.Fragment>
        <span className="fa fa-database" /> Data System
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <span className="fa fa-file" /> File System
    </React.Fragment>
  );
};

class DashPluginCardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteConfirmation: false,
      showEditConfirmation: false,
      pluginToDelete: null,
      pluginToEdit: null,
      publicRepo: "",
      isOpen: [],
    };

    const methods = [
      "deletePlugin",
      "secondaryDeleteAction",
      "showDeleteModal",
      "editPlugin",
      "secondaryEditAction",
      "showEditModal",
      "handlePublicRepo"
    ];
    methods.forEach(method => {
      this[method] = this[method].bind(this);
    });
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
      pluginToDelete: plugin
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
      pluginToEdit: plugin
    });
  }
  handlePublicRepo(value) {
    this.setState({ publicRepo: value });
  }
  toggle = (value, id) => {
    const pluginLength = this.props.plugins.length;
    let isOpen = new Array(pluginLength);
    isOpen[id] = value;
    this.setState({
      isOpen: [...isOpen],
    });
  }
  onSelect = (event, plugin) => {
    const actionType = event.target.innerText;
    if (actionType.includes('Edit')) {
      this.showEditModal(plugin);
    } else if (actionType.includes('Delete')) {
      this.showDeleteModal(plugin);
    }
  }
  render() {
    let pluginCardBody;
    const { plugins } = this.props;
    const {
      pluginToDelete,
      showDeleteConfirmation,
      pluginToEdit,
      showEditConfirmation
    } = this.state;
    const showEmptyState = isEmpty(plugins);
    const primaryDeleteContent = <p className="lead">Are you sure?</p>;
    const secondaryDeleteContent = (
      <p>
        Plugin <b>{pluginToDelete ? pluginToDelete.name : null}</b> will be
        permanently deleted
      </p>
    );
    const secondaryEditContent = pluginToEdit ? (
      <Grid sm={12} md={12} x12={12} lg={12} className="edit-grid">
        <GridItem>
          <Form isHorizontal>
            <FormInput
              formLabel="Public Repo"
              inputType="text"
              defaultValue={pluginToEdit.public_repo}
              onChange={(value) => this.handlePublicRepo(value)}
              fieldName="publicRepo"
              helperText="Enter the public repo URL for your plugin"
            />
          </Form>
        </GridItem>
      </Grid>
    ) : null;
    const addNewPlugin = (
      <GridItem key="addNewPlugin">
        <Card>
          <CardBody className="card-view-add-plugin">
            <div>
              <img width="77" height="61" src={BrainImg} alt="Add new plugin" />
            </div>
            <EmptyStateInfo>
              Click below to add a new ChRIS plugin
            </EmptyStateInfo>
            <EmptyStateAction>
              <Button variant="primary" toRoute="/create">
                Add Plugin
              </Button>
            </EmptyStateAction>
          </CardBody>
        </Card>
      </GridItem>
    );
    if (plugins) {
      pluginCardBody = plugins.map((plugin, id) => {
        const creationDate = new RelativeDate(plugin.creation_date);
        const applicationType = DashApplicationType(plugin.type);
        return (
          <GridItem  key={plugin.name}>
            <Card>
              <CardTitle className="card-view-title">
                <div>
                  <Link to={`/plugin/${plugin.id}`} href={`/plugin/${plugin.id}`}>
                    {plugin.name}
                  </Link>
                  <div className="card-view-tag-title">
                    <FieldLevelHelp content={<div>{plugin.description}</div>} />
                  </div>
                </div>
                <Dropdown
                  className="card-view-kebob"
                  onSelect={(event) => this.onSelect(event, plugin)}
                  toggle={<KebabToggle onToggle={(value) => this.toggle(value, id)} id={`kebab-${plugin.id}`}/>}
                  isOpen={this.state.isOpen[id]}
                  isPlain
                  dropdownItems={[
                    <DropdownItem key={`edit-${plugin.id}`} id="edit" className="kebab-item">Edit</DropdownItem>,
                    <DropdownItem key={`delete-${plugin.id}`} id="delete" className="kebab-item">Delete</DropdownItem>
                  ]}
                />
                
              </CardTitle>
              <CardBody>
                <div className="card-view-app-type">{applicationType}</div>
                <div>
                  <div className="card-view-plugin-tag">
                    {`Version ${plugin.version}`}
                  </div>
                </div>
                <div>
                  <div className="card-view-plugin-tag">
                    {creationDate.isValid() &&
                      `Created ${creationDate.format()}`}
                  </div>
                </div>
                <div>
                  <div className="card-view-plugin-tag">
                    {`${plugin.license} license`}
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        );
      });
      pluginCardBody.push(addNewPlugin);
    }
    return showEmptyState ? (
      <DashGitHubEmptyState />
    ) : (
      <React.Fragment>
        <div className="card-view-row">
          <Grid sm={12} md={4} lg={4} x12={4} hasGutter className="card-view-grid">
          {pluginCardBody}
          </Grid>
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
  onEdit: PropTypes.func.isRequired
};

DashPluginCardView.defaultProps = {
  plugins: []
};

export default DashPluginCardView;
