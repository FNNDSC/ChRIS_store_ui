import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Icon } from 'patternfly-react';
import { Link } from 'react-router-dom';
import RelativeDate from '../../../RelativeDate/RelativeDate';
import './PluginItem.css';

const dateIsValid = date => new RelativeDate(date).isValid();

const formatDate = date => new RelativeDate(date).format();

const renderIcon = (isLoggedIn) => {
  const className = isLoggedIn ? 'plugin-star' : 'plugin-star-disabled';
  return <Icon name="star-o" className={className} />;
};

const Plugin = props => (
  <Card className="plugin-item-card">
    <CardBody className="plugin-item-card-body">
      <div>
        <div className="row no-flex">
          <div className="plugin-item-name">
            <Link
              href={`/plugin/${props.id}`}
              to={`/plugin/${props.id}`}
            >
              {props.name}
            </Link>
            {renderIcon(props.isLoggedIn)}
          </div>
          <div className="plugin-item-title">{props.title}</div>
          <div className="plugin-item-creation">
            <Link
              href={`/author/${props.author}`}
              to={`/author/${props.author}`}
              className="plugin-item-author"
            >
              {props.author}
            </Link>
            {dateIsValid(props.creationDate) &&
              ` created ${formatDate(props.creationDate)}`
            }
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);


Plugin.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool,
};

Plugin.defaultProps = {
  isLoggedIn: false,
};

export default Plugin;
