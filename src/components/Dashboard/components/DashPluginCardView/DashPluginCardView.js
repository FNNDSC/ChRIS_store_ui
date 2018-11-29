import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as _ from 'lodash-es';
import {
  Col,
  CardTitle,
  CardBody,
  EmptyStateAction,
  EmptyStateInfo,
  Button,
  Card,
  CardHeading,
  DropdownKebab,
  MenuItem,
  FieldLevelHelp,
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

    this.deletePlugin = this.deletePlugin.bind(this);
  }
  deletePlugin(name) {
    const { onDelete } = this.props;
    onDelete(name);
  }

  render() {
    let pluginCardBody;
    const { plugins } = this.props;
    const showEmptyState = _.isEmpty(plugins);
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
                    <MenuItem eventKey={plugin.name} onSelect={this.deletePlugin}>
                      Delete
                    </MenuItem>
                  </DropdownKebab>
                  <Link
                    to={`/plugin/${plugin.name}`}
                    href={`/plugin/${plugin.name}`}
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
          </div>
        </React.Fragment>
    );
  }
}

DashPluginCardView.propTypes = {
  plugins: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
};

DashPluginCardView.defaultProps = {
  plugins: [],
};


export default DashPluginCardView;
