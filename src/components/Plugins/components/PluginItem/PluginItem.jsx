import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge, Card, CardBody, Split, SplitItem,
} from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import RelativeDate from '../../../RelativeDate/RelativeDate';
import './PluginItem.css';

const PluginItem = ({
  // Need to do this because the property "creation_date" comes from CUBE
  // eslint-disable-next-line camelcase
  name, authors, title, creation_date, modification_date, category, isFavorite, isLoggedIn, onStarClicked,
}) => {
  function renderStarButton() {
    let className = 'plugin-star';

    if (!isLoggedIn) className += ' disabled';

    if (isFavorite) className += ' favorite';

    return <StarIcon className={className} onClick={onStarClicked} />;
  }

  return (
    <Card className="plugin-item-card">
      <CardBody className="plugin-item-card-body">
        <div>
          <div className="row no-flex">
            <Split>
              <SplitItem isFilled><p style={{ fontSize: '0.9em', fontWeight: 'bold' }}>{name}</p></SplitItem>
              <SplitItem><Badge isRead>{category}</Badge></SplitItem>
            </Split>
            <div className="plugin-item-name">
              <Link
                href={`/plugin/${name}`}
                to={`/plugin/${name}`}
              >
                { title }
              </Link>
              {renderStarButton()}
            </div>
            <Link
              href={`/author/${authors}`}
              to={`/author/${authors}`}
              className="plugin-item-author"
            >
              { authors.join(', ') }
            </Link>
            <p style={{ color: 'gray', fontWeight: '600', fontSize: 'small' }}>
              {
                RelativeDate.isValid(modification_date) ?
                  `Updated ${new RelativeDate(modification_date).format()}`
                : 
                  `Created ${new RelativeDate(creation_date).format()}`
              }
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

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
