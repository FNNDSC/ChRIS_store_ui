import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import './Search.css';

// a helper function to get query params from page url
const getQueryParams = (search) => {
  const groups = search.slice(1).split('&');
  const splitGroups = groups.map(group => group.split('='));
  const queryParams = splitGroups.reduce((acc, group) => {
    const [key, value] = group;
    acc[key] = value;
    return acc;
  }, {});
  return queryParams;
};

const Search = ({ className, location }) => {
  const { search } = location;
  const { q: query } = getQueryParams(search);
  return (
    <form
      method="get"
      action="/plugins"
      autoComplete="off"
      className={`search-pf ${className}`}
    >
      <div className="form-group has-icon">
        <div className="search-pf-input-group">
          <div className="search-icon">
            <Icon name="search" />
          </div>
          <input
            type="search"
            id="search"
            className="form-control"
            name="q"
            placeholder="Search plugins"
            defaultValue={query}
          />
        </div>
      </div>
    </form>
  );
};

Search.propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
Search.defaultProps = {
  className: '',
  location: {
    search: '',
  },
};

export default Search;
