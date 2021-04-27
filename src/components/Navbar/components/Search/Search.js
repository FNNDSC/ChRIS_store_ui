import React, { useState } from 'react';
import styles from './Search.module.css';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

import { Button, TextInput } from '@patternfly/react-core';
import { Fragment } from 'react';

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
  const {
    value,
    onClear,
    onSearch,
    onChange,
    placeholder,
    onBlur,
    autoCompleteData,
    history,
  } = props;
  const searchRef = React.useRef(null);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  return (
    <Fragment>
      <div className={styles['search']}>
        <div className={styles['ws-global-search-wrapper']}>
          <SearchIcon
            className={styles['global-search-icon']}
            onClick={() => {
              searchRef.current.focus();
            }}
          />
          <TextInput
            id={styles['ws-global-search']}
            ref={searchRef}
            type="search"
            value={value}
            name="q"
            placeholder={placeholder}
            onChange={onChange}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.length >= 3){
                onSearch(value, 'ENTER');
                setShowAutoComplete(false);
              }
              else {
                setShowAutoComplete(true);
              }
            }}
            onBlur={onBlur}
          />
        </div>
        {value.length > 0 && (
          <Button variant="plain" className={styles['ws-clear-search']} onClick={onClear}>
            <TimesIcon />
          </Button>
        )}
        {showAutoComplete && autoCompleteData && autoCompleteData.length > 0 && (
          <ul  className={styles['ws-global-search-autocomplete']}>
            {autoCompleteData.map((item, id) => (
              <li
                key={id}
                data-id={item.id}
                onMouseDown={(e) => {
                  history.push({
                  pathname: '/plugins',
                  search: item.name,
                })}}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
};

export default Search;
