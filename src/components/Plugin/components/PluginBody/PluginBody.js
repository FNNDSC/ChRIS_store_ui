import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeading, CardTitle, CardBody } from 'patternfly-react';
import './PluginBody.css';

const PluginBody = ({ pluginData }) => (
  <div className="plugin-body">
    <div className="row">
      <div className="plugin-body-main-col">
        <Card className="plugin-body-title">
          <CardHeading>
            <CardTitle>Title</CardTitle>
          </CardHeading>
          <CardBody>{pluginData.title}</CardBody>
        </Card>
        <Card className="plugin-body-description">
          <CardHeading>
            <CardTitle>Description</CardTitle>
          </CardHeading>
          <CardBody>{pluginData.description}</CardBody>
        </Card>
      </div>
      <div className="plugin-body-side-col">
        <Card className="plugin-body-image">
          <CardHeading>
            <CardTitle>Docker Image</CardTitle>
          </CardHeading>
          <CardBody>{pluginData.dock_image}</CardBody>
        </Card>
      </div>
    </div>
  </div>
);

PluginBody.propTypes = {
  pluginData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dock_image: PropTypes.string,
    license: PropTypes.string,
    public_repo: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default PluginBody;

