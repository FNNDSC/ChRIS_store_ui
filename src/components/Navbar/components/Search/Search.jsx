import React, { useEffect, useState } from 'react';
import './Search.css';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
// import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

import { TextInput } from '@patternfly/react-core';

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
const Search = ({
  value,
  // onClear,
  onSearch,
  onChange,
  placeholder,
  onBlur,
  autoCompleteData,
}) => {
  // const  = props;
  const searchRef = React.useRef(null);
  const downKeyPress = useKeyPress('ArrowDown');
  const upArrowPress = useKeyPress('ArrowUp');
  const enterKeyPress = useKeyPress('Enter');

  const [cursorState, setCursorState] = useState(0);
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length && enterKeyPress) {
      onSearch(autoCompleteData[cursorState].name, 'ENTER');
      onBlur();
    }
  }, [cursorState, enterKeyPress, autoCompleteData, onBlur, onSearch]);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length && downKeyPress) {
      setCursorState((prevCursorState) => (prevCursorState < autoCompleteData.length - 1 ? prevCursorState + 1 : prevCursorState));
    }
  }, [downKeyPress, autoCompleteData]);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length && upArrowPress) {
      setCursorState((prevCursorState) => (prevCursorState > 0 ? prevCursorState - 1 : prevCursorState));
    }
  }, [upArrowPress, autoCompleteData]);

  useEffect(() => {
    if (autoCompleteData && autoCompleteData.length) {
      setShowAutoComplete(true);
    }
    setCursorState(0);
  }, [autoCompleteData]);

  return (
    <>
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
              if (e.key === 'Enter' && value.length >= 3) {
                onSearch(value, 'ENTER');
                setShowAutoComplete(false);
              }
            }}
            onBlur={onBlur}
          />
        </div>
        {showAutoComplete && autoCompleteData && autoCompleteData.length > 0 && (
          <ul className="ws-global-search-autocomplete">
            {autoCompleteData.map((item, id) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={`search-autocomplete-${item.name}`}
                className={id === cursorState ? 'active-dropdown' : ''}
                data-id={item.id}
                onMouseDown={() => { onSearch(item.name, 'ENTER'); }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;
