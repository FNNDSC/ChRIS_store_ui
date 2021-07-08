import React, { useCallback, useState } from 'react';
import { Page, SkipToContent } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import Client from '@fnndsc/chrisstoreapi';
import ConnectedNavbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './applayout.css';
import Search from '../Navbar/components/Search/Search';
import { debounce } from '../../utils/common';
import ChrisStore from '../../store/ChrisStore';

const PageSkipToContent = (
  <SkipToContent href="#primary-app-container">
    Skip to Content
  </SkipToContent>
);

const AppLayout = ({ store, children }) => {
  const [searchKey, setSearchKey] = useState('');

  const [autoCompleteData, setAutoCompleteData] = useState(null);
  const auth = { token: store.get('authToken') };

  const history = useHistory();
  const storeURL = process.env.REACT_APP_STORE_URL;
  const client = new Client(storeURL, auth);

  // eslint-disable-next-line consistent-return
  const onSearch = async (value, MODE = 'AUTO') => {
    const body = {
      limit: 20,
      offset: 0,
      name_title_category: value,
    };
    try {
      if (MODE === 'ENTER') {
        history.push({
          pathname: '/plugins',
          search: `q=${value}`,
        });
      } else if (MODE === 'AUTO') {
        const searchResults = await client.getPlugins(body);
        setAutoCompleteData(searchResults.data);
        return searchResults.data;
      }
    } catch (error) {
      return error;
    }
  };

  const debounceSearch = useCallback(debounce((value) => { onSearch(value); }, 250), []);
  const searchComponent = (
    <Search
      autoCompleteData={autoCompleteData}
      placeholder="Search Plugin"
      value={searchKey}
      history={history}
      onChange={(value) => {
        setSearchKey(value);
        if (value.length >= 3) debounceSearch(value);
      }}
      onBlur={() => {
        setSearchKey('');
        setAutoCompleteData(null);
      }}
      onClear={() => setSearchKey('')}
      onSearch={onSearch}
    />
  );
  return (
    <Page
      header={<ConnectedNavbar searchComponent={searchComponent} />}
      mainContainerId="primary-app-container"
      skipToContent={PageSkipToContent}
      additionalGroupedContent={<div className="searchbar">{searchComponent}</div>}
    >
      {children}
      <Footer />
    </Page>
  );
};

export default ChrisStore.withStore(AppLayout);
