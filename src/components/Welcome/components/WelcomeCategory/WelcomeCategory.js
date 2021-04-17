import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
} from "@patternfly/react-core";
import PropTypes from "prop-types";
import "./WelcomeCategory.css";

const WelcomeCategory = ({ category }) => (
  <Card className="welcome-category">
    <CardTitle className="welcome-category-header">{category.name}</CardTitle>
    <CardBody>
      {category.items.map(({ name, desc, img, tags }) => (
        <div className="welcome-category-item" key={name}>
          <img src={img} alt="" className="welcome-category-item-img" />
          <div className="welcome-category-item-body">
            <div className="welcome-category-item-name">{name}</div>
            <div className="welcome-category-item-desc">{desc}</div>
            <div className="welcome-category-item-tags">{tags.join(" ")}</div>
          </div>
        </div>
      ))}
    </CardBody>
    <CardFooter>
      <Button bsstyle="primary" bssize="large" className="btn-block">
        View More ...
      </Button>
    </CardFooter>
  </Card>
);

WelcomeCategory.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ),
  }).isRequired,
};

export default WelcomeCategory;
