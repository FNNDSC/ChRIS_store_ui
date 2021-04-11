import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './PluginsCategories.css';

const PluginsCategories = props => {
  return (
    <div className="plugins-categories">
      <div className="plugins-categories-header">Categories</div>
      <div>
        {
          props.categories.map(category => (
            <div key={category.name} className="plugins-category"
              onClick={() => { 
                props.onSelect(category.name);
              }}>
              <div className="plugins-category-name">{category.name}</div>
              <div className="plugins-category-length">{category.length}</div>
            </div>
          ))
        }
        
        <div onClick={() => { 
          props.onSelect(null);
        }}>
          <div style={{ color: '#aaa', cursor: 'pointer' }}>
            Clear
          </div>
        </div>
      </div>
    </div>
  );
}

PluginsCategories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
  })).isRequired,
  onSelect: PropTypes.func,
  onClear: PropTypes.func
};

export default PluginsCategories;
