import React from "react";
import { Card, CardTitle, CardBody, CardFooter } from "@patternfly/react-core";
import Button from "../../../Button";
import PropTypes from "prop-types";
import styles from "./WelcomeCategory.module.css";

const WelcomeCategory = ({ category, ...props }) => (
  <div {...props}>
    <Card className={styles['welcome-category']}>
      <CardTitle className={styles['welcome-category-header']}>{category.name}</CardTitle>
      <CardBody>
        {category.items.map(({ name, desc, img, tags }) => (
          <div className={styles['welcome-category-item']} key={name}>
            <img src={img} alt="" className={styles['welcome-category-item-img']} />
            <div className={styles['welcome-category-item-body']}>
              <div className={styles['welcome-category-item-name']}>{name}</div>
              <div className={styles['welcome-category-item-desc']}>{desc}</div>
              <div className={styles['welcome-category-item-tags']}>{tags.join(" ")}</div>
            </div>
          </div>
        ))}
      </CardBody>
      <CardFooter>
        <Button variant="primary" className={styles['btn-block']}>
          View More ...
        </Button>
      </CardFooter>
    </Card>
  </div>
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
