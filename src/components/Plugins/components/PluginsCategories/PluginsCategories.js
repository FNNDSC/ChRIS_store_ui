import React from 'react';
import PropTypes from 'prop-types';

import './PluginsCategories.css';

const PluginsCategories = props => (
  <div className="plugins-categories">
    <div className="plugins-categories-header">Categories</div>
    <div>
      {
        props.categories.map(category => (
          <div key={category.name} className="plugins-category">
            <div className="plugins-category-name">{category.name}</div>
            <div className="plugins-category-length">{category.length}</div>
          </div>
        ))
      }
    </div>
  </div>
);

PluginsCategories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
  })).isRequired,
};

export default PluginsCategories;
