import React from 'react';
import './Search.css';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

import { Button, TextInput } from '@patternfly/react-core';

/*
 * (C) 2020 Red Hat, MIT License
 * https://github.com/patternfly/patternfly-org/blob/d6e1950b764b55b612709dfe8e84e6e636116d23/packages/theme-patternfly-org/layouts/sideNavLayout/sideNavLayout.js#L52-76
 */

/*
 * TODO search bar is not accessible on small screens.
 * Neither does it "focus" correctly on Firefox for Android (tested 2020-11-13)
 * as in the on-screen keyboard fails to pop up.
 * This problem exists upstream on https://patternfly.org
 *
 * Feasible workaround: hide the logo or move the search somewhere else
 * if screen size is too small.
 */
const Search = (props) => {
  const { value, onClear, onSearch, onChange, placeholder } = props;
  const searchRef = React.useRef();
  return (
    <div id="search">
      <div id="ws-global-search-wrapper" >
        <SearchIcon
          className="global-search-icon"
          onClick={onSearch}
        />
          <TextInput
            id="ws-global-search"
            innerRef={searchRef} 
            value={value}
            name="q" 
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={(e) => {
              if(e.key === 'Enter' ) onSearch();
            }}
          />
      </div>
      {value.length > 0 && (
        <Button
          variant="plain"
          className="ws-clear-search"
          onClick={onClear}
        >
          <TimesIcon />
        </Button>
      )}
    </div>
  )
}

export default Search;
