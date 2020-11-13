import React, { useState } from 'react';
import './Search.css';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

import { Button, PageHeaderTools, PageHeaderToolsItem, TextInput } from '@patternfly/react-core';

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

const Search = () => {
  const [isSearchExpanded, setSearchExpanded] = useState(false);
  const searchRef = React.useRef();  // idk what this does

  return (
    <PageHeaderTools>
      <PageHeaderToolsItem id="ws-global-search-wrapper" className={isSearchExpanded ? '' : 'ws-hide-search-input'}>
        <form method="get" action="/plugins" autoComplete="off">
          <TextInput id="ws-global-search" ref={searchRef} placeholder="Search plugins" name="q"/>
        </form>
        {isSearchExpanded && <SearchIcon className="global-search-icon" />}
      </PageHeaderToolsItem>
      <Button
        aria-label={`${isSearchExpanded ? 'Collapse' : 'Expand'} search input`}
        variant="plain"
        className="ws-toggle-search"
        onClick={() => {
          setSearchExpanded(!isSearchExpanded);
          if (!isSearchExpanded) {
            setTimeout(() => searchRef.current && searchRef.current.focus(), 0);
          }
        }}
      >
        {isSearchExpanded
          ? <TimesIcon />
          : <SearchIcon className="global-search-icon" />
        }
      </Button>
    </PageHeaderTools>
  )
}

export default Search;
