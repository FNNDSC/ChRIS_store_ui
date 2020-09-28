import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Icon } from 'patternfly-react';
import { Link } from 'react-router-dom';
import RelativeDate from '../../../RelativeDate/RelativeDate';
import './PluginItem.css';

const dateIsValid = date => new RelativeDate(date).isValid();

const formatDate = date => new RelativeDate(date).format();


class Plugin extends Component {
  renderStarButton() {
    let name;
    let className;

    const { isLoggedIn, isFavorite, onStarClicked } = this.props;

    if (isLoggedIn) {
      className = isFavorite ? 'plugin-star-favorite' : 'plugin-star';
      name = isFavorite ? 'star' : 'star-o';
    } else {
      className = 'plugin-star-disabled';
      name = 'star-o';
    }
    return <Icon name={name} className={className} onClick={onStarClicked} />;
  }

  render() {
    const {
      id, name, author, title, creationDate,
    } = this.props;

    return (
      <Card className="plugin-item-card">
        <CardBody className="plugin-item-card-body">
          <div>
            <div className="row no-flex">
              <div className="plugin-item-name">
                <Link
                  href={`/plugin/${id}`}
                  to={`/plugin/${id}`}
                >
                  {name}
                </Link>
                {this.renderStarButton()}
              </div>
              <div className="plugin-item-title">{title}</div>
              <div className="plugin-item-creation">
                <Link
                  href={`/author/${author}`}
                  to={`/author/${author}`}
                  className="plugin-item-author"
                >
                  {author}
                </Link>
                {dateIsValid(creationDate) &&
                  ` created ${formatDate(creationDate)}`
                }
              </div>
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

export default Plugin;
