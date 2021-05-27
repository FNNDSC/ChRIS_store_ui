import React from 'react';
import PropTypes from 'prop-types';

import './PluginsCategories.css';

const PluginsCategories = props => {
  return (
    <div className="plugins-categories">
      <div className="plugins-categories-header">Categories</div>
      <div>
        {
          props.categories.map(({name, length}) => (
            <div key={name} className={`plugins-category ${name === props.selected ? 'selected' : ''}`}
              onClick={() => { 
                props.onSelect(name);
              }}>
              <div className="plugins-category-name">{name}</div>
              <div className="plugins-category-length">{length}</div>
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
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

export default PluginsCategories;
