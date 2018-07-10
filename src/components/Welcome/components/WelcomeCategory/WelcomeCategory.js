import React from 'react';
import { Card, CardTitle, CardBody, CardFooter, Button } from 'patternfly-react';
import PropTypes from 'prop-types';
import './WelcomeCategory.css';

const WelcomeCategory = props => (
  <Card className="welcome-category">
    <CardTitle className="welcome-category-header">
      {props.category.name}
    </CardTitle>
    <CardBody>
      {
        props.category.items.map(item => (
          <div className="welcome-category-item" key={item.name}>
            <img src={item.img} alt="" className="welcome-category-item-img" />
            <div className="welcome-category-item-body">
              <div className="welcome-category-item-name">{item.name}</div>
              <div className="welcome-category-item-desc">{item.desc}</div>
              <div className="welcome-category-item-tags">
                {item.tags.join(' ')}
              </div>
            </div>
          </div>
        ))
      }
    </CardBody>
    <CardFooter>
      <Button bsStyle="primary" bsSize="large" className="btn-block">View More ...</Button>
    </CardFooter>
  </Card>
);

WelcomeCategory.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      img: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    })),
  }).isRequired,
};

export default WelcomeCategory;
