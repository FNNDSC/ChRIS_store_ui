import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import RelativeDate from '../../../RelativeDate/RelativeDate';
import './PluginItem.css';

const dateIsValid = date => new RelativeDate(date).isValid();
const formatDate = date => dateIsValid(date) ? new RelativeDate(date).format() : undefined;

class PluginItem extends Component {
  renderStarButton() {
    const { isLoggedIn, isFavorite, onStarClicked } = this.props;
    let className;
    if (isLoggedIn) {
      className = isFavorite ? 'plugin-star favorite' : 'plugin-star';
      return <StarIcon className={className} onClick={onStarClicked} />;
    } else {
      return <StarIcon className="plugin-star disabled" onClick={onStarClicked} />;
    }
  }

  render() {
    const { name, author, title, creation_date, description } = this.props;

    return (
      <Card className="plugin-item-card">
        <CardBody className="plugin-item-card-body">
          <div>
            <div className="row no-flex">
              <p style={{ textTransform: 'uppercase', fontSize: '0.75em', fontWeight: 'bold' }}>{name}</p>
              <div className="plugin-item-name">
                <Link
                  href={`/plugin/${name}`}
                  to={`/plugin/${name}`}
                >
                  {title}
                </Link>
                {this.renderStarButton()}
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
                {`Created ${formatDate(creation_date)}`} | 
                { Object.keys(this.props.versions).length } versions
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
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
