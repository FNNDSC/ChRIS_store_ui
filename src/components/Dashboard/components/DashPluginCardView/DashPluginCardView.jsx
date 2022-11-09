import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody, 
  CardActions,
  DropdownItem, 
  Dropdown, 
  KebabToggle,
  Grid, 
  GridItem, 
  Form, 
  Modal 
} from "@patternfly/react-core";
import Button from "../../../Button";
import "./DashPluginCardView.css";
import BrainImg from "../../../../assets/img/empty-brain-xs.png";
import PluginPointer from "../../../../assets/img/brainy_welcome-pointer.png";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import FormInput from "../../../FormInput";

const DashGitHubEmptyState = () => (
  <Card>
    <CardTitle>My Plugins</CardTitle>
    <CardBody className="card-body-empty">
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
);

const DashApplicationType = type => {
  if (type === "ds") {
    return (
      <>
        <span className="fa fa-database" /> {" "}
        <span style={{ fontWeight: 'bold' }}>Data System</span>
      </>
    );
  }
  return (
    <>
      <span className="fa fa-file" /> {" "}
      <span style={{ fontWeight: 'bold' }}>File System</span>
    </>
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
  }
  
  editPlugin = () => {
    const { onEdit } = this.props;
    const { pluginToEdit, publicRepo } = this.state;
    onEdit(pluginToEdit.id, publicRepo);
    this.setState({ showEditConfirmation: false });
  }
  
  deletePlugin = () => {
    const { onDelete } = this.props;
    const { pluginToDelete } = this.state;
    onDelete(pluginToDelete.id);
    this.setState({ showDeleteConfirmation: false });
  }
  
  showDeleteModal = (plugin) => {
    this.setState({
      showDeleteConfirmation: true,
      pluginToDelete: plugin
    });
  }

  showEditModal = (plugin) => {
    this.setState({
      showEditConfirmation: true,
      pluginToEdit: plugin
    });
  }
  
  handlePublicRepo = (value) => {
    this.setState({ publicRepo: value });
  }

  toggleEditMenu = (value, cardidx) => {
    const { plugins } = this.props;
    const isOpen = new Array(plugins.length);
    isOpen[cardidx] = value;
    this.setState({ isOpen });
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
    const { plugins } = this.props;
    const {
      pluginToDelete,
      pluginToEdit,
      showDeleteConfirmation,
      showEditConfirmation,
      isOpen,
    } = this.state;
    
    const showEmptyState = isEmpty(plugins);
      
    const pluginCardBody = plugins.map((plugin, index) => {
      const creationDate = new RelativeDate(plugin.creation_date);
      const applicationType = DashApplicationType(plugin.type);
      return (
        <GridItem sm={12} md={6} key={plugin.name}>
          <Card style={{ height: '100%' }}>
            <CardHeader>
              <CardTitle>
                <Link to={`/plugin/${plugin.name}`}>{plugin.name}</Link>
              </CardTitle>
              <CardActions>
                <Dropdown
                  className="card-view-kebob"
                  onSelect={(event) => this.onSelect(event, plugin)}
                  toggle={
                    <KebabToggle
                      onToggle={(value) => this.toggleEditMenu(value, index)}
                      id={`kebab-${plugin.id}`}
                    />
                  }
                  isOpen={isOpen[index]}
                  position={window.innerWidth <= 720 ? 'right' : 'left'}
                  isPlain
                  dropdownItems={[
                    <DropdownItem key={`edit-${plugin.id}`} id={`edit-${plugin.name}`}>
                      Edit
                    </DropdownItem>,
                    <DropdownItem key={`delete-${plugin.id}`} id={`delete-${plugin.name}`}>
                      Delete
                    </DropdownItem>,
                    <DropdownItem
                      key={`/manage/collaborators/${plugin.name}`}
                      component={
                        <Link to={`/manage/collaborators/${plugin.name}`}>
                          Manage Collaborators
                        </Link>
                      }
                    />,
                  ]}
                />
              </CardActions>
            </CardHeader>
            <CardBody>
              <h3>{plugin.title}</h3>
              <div className="card-info-points">
                <p>{creationDate.isValid() && `Created ${creationDate.format()}`}</p>
                <p>{`${plugin.license} license`}</p>
              </div>

              <div className="card-view-app-type">{applicationType}</div>
            </CardBody>
          </Card>
        </GridItem>
      );
    })

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

    const closeEditModal = () => {
      this.setState({ showEditConfirmation: false, pluginToEdit: null })
    }

    const secondaryDeleteContent = (
      <p>
        Plugin <b>{pluginToDelete ? pluginToDelete.name : null}</b> will be
        permanently deleted
      </p>
    );

    const closeDeleteModal = () => {
      this.setState({ showDeleteConfirmation: false, pluginToDelete: null })
    }
    
    const addNewPlugin = (
      <GridItem sm={12} key="addNewPlugin">
        <Card>
          <CardBody className="card-view-add-plugin">
            <div>
              <img width="77" height="61" src={BrainImg} alt="Add new plugin" />
            </div>
            <h2>Click below to add a new ChRIS plugin</h2>
            <div>
              <Button variant="primary" toRoute="/create">
                Add Plugin
              </Button>
            </div>
          </CardBody>
        </Card>
      </GridItem>
    );
    
    return showEmptyState ? (
      <DashGitHubEmptyState />
    ) : (
      <>
        <div className="card-view-row">
          <Grid style={{ width: '100%' }} hasGutter>
            {pluginCardBody}
            {addNewPlugin}
          </Grid>

          <Modal title="Edit Plugin Details"
            aria-label="edit-confirmation-dialog"
            isOpen={showEditConfirmation}
            onClose={closeEditModal}
            description=""
            actions={[
              <Button key="confirm" variant="primary" onClick={this.editPlugin}>
                Confirm
              </Button>,
              <Button key="cancel" variant="link" onClick={closeEditModal}>
                Cancel
              </Button>
            ]}
          >
            {secondaryEditContent}
          </Modal>

          <Modal title="Delete Plugin"
            aria-label="delete-confirmation-dialog"
            isOpen={showDeleteConfirmation}
            onClose={closeDeleteModal}
            description=""
            actions={[
              <Button key="confirm" variant="primary" onClick={this.deletePlugin}>
                Delete
              </Button>,
              <Button key="cancel" variant="link" onClick={closeDeleteModal}>
                Cancel
              </Button>
            ]}
          >
            {secondaryDeleteContent}
          </Modal>
        </div>
      </>
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
