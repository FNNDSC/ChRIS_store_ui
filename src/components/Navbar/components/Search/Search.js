import React, { useEffect, useState } from 'react';
import './Search.css';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

import { Button, TextInput } from '@patternfly/react-core';
import { Fragment } from 'react';
import { useKeyPress } from '../../../../hooks/useKeyPressHook';

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
  } = props;
  const searchRef = React.useRef(null);
  const downKeyPress = useKeyPress('ArrowDown');
  const upArrowPress = useKeyPress('ArrowUp');
  const enterKeyPress = useKeyPress('Enter');

  const [cursorState, setCursorState] = useState(0);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length && enterKeyPress) {
      onSearch(autoCompleteData[cursorState].name, 'ENTER');
      onBlur();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorState, enterKeyPress]);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length && downKeyPress) {
      setCursorState(prevCursorState => prevCursorState < autoCompleteData.length - 1 ? prevCursorState + 1 : prevCursorState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[downKeyPress]);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length && upArrowPress) {
      setCursorState(prevCursorState => prevCursorState > 0 ? prevCursorState - 1 : prevCursorState)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upArrowPress]);

  useEffect(() => {
    if(autoCompleteData && autoCompleteData.length){
      setShowAutoComplete(true);
    }
    setCursorState(0);
  }, [autoCompleteData]);

  const [showAutoComplete, setShowAutoComplete] = useState(false);
  return (
    <Fragment>
      <div id="search">
        <div id="ws-global-search-wrapper">
          <SearchIcon
            className="global-search-icon"
            onClick={() => {
              searchRef.current.focus();
            }}
          />
          <TextInput
            id="ws-global-search"
            ref={searchRef}
            type="search"
            value={value}
            name="q"
            placeholder={placeholder}
            onChange={onChange}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.length >= 3 && !autoCompleteData.length){
                onSearch(value, 'ENTER');
                setShowAutoComplete(false);
              }
            }}
            onBlur={onBlur}
          />
        </div>
        {value.length > 0 && (
          <Button variant="plain" className="ws-clear-search" onClick={onClear}>
            <TimesIcon />
          </Button>
        )}
        {showAutoComplete && autoCompleteData && autoCompleteData.length > 0 && (
          <ul  className="ws-global-search-autocomplete">
            {autoCompleteData.map((item, id) => (
              <li
                key={id}
                className={id === cursorState ? 'active' : ''}
                data-id={item.id}
                onMouseDown={(e) => {onSearch(item.name, 'ENTER')}}
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
