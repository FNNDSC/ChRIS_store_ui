import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import RelativeDate from '../../../RelativeDate/RelativeDate';
import './PluginItem.css';

const dateIsValid = date => new RelativeDate(date).isValid();
const formatDate = date => dateIsValid(date) ? new RelativeDate(date).format() : undefined;

const PluginItem = ({ name, author, title, creation_date, description, isFavorite, isLoggedIn, onStarClicked }) => {
  function renderStarButton() {
    let className = "plugin-star";
    
    if (!isLoggedIn)
      className += ' disabled';
    
    if (isFavorite)
      className += ' favorite';

    return <StarIcon className={className} onClick={onStarClicked} />;
  }

  return (
    <Card className="plugin-item-card">
      <CardBody className="plugin-item-card-body">
        <div>
          <div className="row no-flex">
            <p style={{ fontSize: '0.9em', fontWeight: 'bold' }}>{name}</p>
            <div className="plugin-item-name">
              <Link
                href={`/plugin/${name}`}
                to={`/plugin/${name}`}
              >
                {title}
              </Link>
              {renderStarButton()}
            </div>
            <div className="plugin-item-title">{description}</div>
            <Link
              href={`/author/${author}`}
              to={`/author/${author}`}
              className="plugin-item-author"
            >
              {author}
            </Link>
            <p style={{ color: 'gray', fontWeight: '600', fontSize: 'small' }}>
              {`Created ${formatDate(creation_date)}`}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

Plugin.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool,
  isFavorite: PropTypes.bool,
  onStarClicked: PropTypes.func.isRequired,
};

Plugin.defaultProps = {
  isLoggedIn: false,
  isFavorite: false,
};

export default PluginItem;
