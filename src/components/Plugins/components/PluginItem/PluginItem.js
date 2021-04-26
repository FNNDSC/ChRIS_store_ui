import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@patternfly/react-core";
import { StarIcon } from "@patternfly/react-icons";
import { Link } from "react-router-dom";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import "./PluginItem.css";

const dateIsValid = (date) => new RelativeDate(date).isValid();

const formatDate = (date) => new RelativeDate(date).format();

const Plugin = ({
  isLoggedIn,
  isFavorite,
  onStarClicked,
  id,
  name,
  author,
  title,
  creationDate,
  ...props
}) => {
  const renderStarButton = () => {
    let className;

    if (isLoggedIn) {
      className = isFavorite ? "plugin-star-favorite" : "plugin-star";
    } else {
      className = "plugin-star-disabled";
    }
    return <StarIcon className={className} onClick={onStarClicked} />;
  };

  return (
    <div {...props}>
      <Card className="plugin-item-card">
        <CardBody className="plugin-item-card-body">
          <div>
            <div className="row no-flex">
              <div className="plugin-item-name">
                <Link href={`/plugin/${id}`} to={`/plugin/${id}`}>
                  {name}
                </Link>
                {renderStarButton()}
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
                  ` created ${formatDate(creationDate)}`}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
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

export default Plugin;
