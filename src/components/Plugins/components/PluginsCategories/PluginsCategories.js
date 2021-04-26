import React from "react";
import PropTypes from "prop-types";

import "./PluginsCategories.css";

const PluginsCategories = ({ categories, ...props }) => (
  <div {...props}>
    <div className="plugins-categories">
      <div className="plugins-categories-header">Categories</div>
      <div>
        {categories.map(({ name, length }) => (
          <div key={name} className="plugins-category">
            <div className="plugins-category-name">{name}</div>
            <div className="plugins-category-length">{length}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

PluginsCategories.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      length: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PluginsCategories;
