import React from 'react';
import PropTypes from 'prop-types';

import './PluginsCategories.css';

const PluginsCategories = ({ categories, selected, onSelect }) => (
  <div className="plugins-categories">
    <div className="plugins-categories-header">Categories</div>
    <div role="menu">
      {categories.map(({ name, length }) => (
        <div
          key={name}
          role="menuitem"
          tabIndex="-1"
          className={`plugins-category ${name === selected ? 'selected' : ''}`}
          onClick={() => onSelect(name)}
          onKeyPress={() => {}}
        >
          <div className="plugins-category-name">{name}</div>
          <div className="plugins-category-length">{length}</div>
        </div>
      ))}

      <div role="menuitem" tabIndex="-1" onClick={() => onSelect(null)} onKeyPress={() => {}}>
        <div style={{ color: '#aaa', cursor: 'pointer' }}>Clear</div>
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
  selected: PropTypes.string,
  onSelect: PropTypes.func,
};

export default PluginsCategories;
