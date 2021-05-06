import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@patternfly/react-core";
import { StarIcon } from "@patternfly/react-icons";
import { Link } from "react-router-dom";
import RelativeDate from "../../../RelativeDate/RelativeDate";
import "./PluginItem.css";

const dateIsValid = (date) => new RelativeDate(date).isValid();

const formatDate = (date) => new RelativeDate(date).format();

const PluginItem = ({
  isLoggedIn,
  isFavorite,
  onStarClicked,
  pluginId,
  name,
  author,
  pluginTitle,
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
                <Link href={`/plugin/${pluginId}`} to={`/plugin/${pluginId}`}>
                  {name}
                </Link>
                {renderStarButton()}
              </div>
              <div className="plugin-item-title">{pluginTitle}</div>
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

PluginItem.propTypes = {
  pluginTitle: PropTypes.string.isRequired,
  pluginId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool,
  isFavorite: PropTypes.bool,
  onStarClicked: PropTypes.func.isRequired,
};

PluginItem.defaultProps = {
  isLoggedIn: false,
  isFavorite: false,
};

export default PluginItem;
