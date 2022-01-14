/* eslint-disable react/no-danger */
// Required for setting README html

import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  Popover,
  ClipboardCopy,
  Button,
  ExpandableSection,
  Spinner,
} from '@patternfly/react-core';
import { DownloadIcon, UserAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import marked from 'marked';
import { sanitize } from 'dompurify';

import './PluginBody.css';
import ErrorNotification from '../../../Notification';
import HttpApiCallError from '../../../../errors/HttpApiCallError';
import { GithubAPIRepoError, GithubAPIReadmeError } from '../../../../errors/GithubError';
import { removeEmail } from '../../../../utils/common';

const PluginBody = ({ pluginData }) => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (_, tabIndex) => setActiveTab(tabIndex);

  const [repoData, setRepoData] = useState();
  const [readme, setReadme] = useState();
  const setReadmeHTML = ($) => setReadme(sanitize($));

  const [errors, setErrors] = useState([]);
  const showNotifications = useCallback((error) => {
    setErrors((prev) => [...prev, error.message]);
  }, []);

  const fetchReadme = useCallback(async (repo) => {
    const ghreadme = await fetch(`https://api.github.com/repos/${repo}/readme`);
    if (!ghreadme.ok) throw new GithubAPIReadmeError(repo, ghreadme);

    // Has to be done since key is snake_case in data coming from Github
    // eslint-disable-next-line camelcase
    const { download_url, content } = await ghreadme.json();
    const file = Buffer.from(content, "base64").toString("utf8");
    const type = download_url.split('.').reverse().shift();

    return { file, type };
  }, []);

  const fetchRepoData = useCallback(async (repo) => {
    const data = await fetch(`https://api.github.com/repos/${repo}`);
    if (!data.ok) throw new GithubAPIRepoError(repo, data);

    // Has to be done to avoid reassigning `data`
    // eslint-disable-next-line no-return-await
    return (await data.json());
  }, []);

  useEffect(() => {
    const expectRepoName = pluginData.public_repo.split('github.com/')[1];
    async function fetchRepo() {
      try {
        const data = await fetchRepoData(expectRepoName);
        setRepoData(data);

        const { file, type } = await fetchReadme(expectRepoName);
        if (type === 'md' || type === 'rst') { setReadmeHTML(marked(file)); } else setReadmeHTML(file);
      } catch (error) {
        showNotifications(new HttpApiCallError(error));
      }
    }

    if (expectRepoName)
      fetchRepo();
  }, [fetchReadme, fetchRepoData, pluginData.public_repo, showNotifications]);

  const InstallButton = () => {
    if (pluginData.version)
      return <ClipboardCopy isReadOnly>{ pluginData.url }</ClipboardCopy>

    if (pluginData.versions)
      return <>
        <p><b>Version { pluginData.versions[0].version }</b></p>
        <ClipboardCopy isReadOnly>
          { pluginData.versions[0].url }
        </ClipboardCopy>
        <br />
        {
          pluginData.versions.length > 1 &&
          <ExpandableSection toggleText="More Versions">
            { pluginData.versions.slice(1).map((version) =>(
              <div key={version.version}>
                <a href={`/p/${version.id}`}>
                  Version {version.version}
                </a>
              </div>
            ))}
          </ExpandableSection>
        }
      </>

    return <Spinner size="lg" />
  }

  const authors = removeEmail(pluginData.authors.split(','))

  return (
    <>
      { errors.map((message, index) => (
        <ErrorNotification
          title={message}
          position="top-right"
          variant="danger"
          closeable
          onClose={() => {
            setErrors(errors.splice(index));
          }}
        />
      ))}

      <article>
        <Card id="plugin-body">
          <Grid hasGutter>
            <GridItem md={8} sm={12}>
              <Tabs activeKey={activeTab} onSelect={handleTabClick}>
                <Tab eventKey={1} title={<TabTitleText>Overview</TabTitleText>}>
                  <div style={{ color: 'gray', margin: '1em 0' }}>README</div>
                  { readme ? <div dangerouslySetInnerHTML={{ __html: readme }} /> : null }
                </Tab>

                <Tab eventKey={2} title={<TabTitleText>Parameters</TabTitleText>}>
                  <Grid hasGutter className="plugin-body-main">
                    <GridItem sm={12}>Parameters content</GridItem>
                  </Grid>
                </Tab>

                {
                  pluginData.versions &&
                  <Tab eventKey={3} title={<TabTitleText>Versions</TabTitleText>}>
                    <Grid hasGutter className="plugin-body-main">
                      <GridItem sm={12}>
                        <h2>Versions of this plugin</h2>
                        { pluginData.versions.map((version) => (
                          <a key={version} href={`/p/${version.id}`}>
                            <b>Version { version.version }</b>
                          </a>
                        ))}
                      </GridItem>
                    </Grid>
                  </Tab>
                }
              </Tabs>
            </GridItem>

            <GridItem md={4} sm={12}>
              <div className="plugin-body-side-col">
                <div className="plugin-body-detail-section">
                  <h4>Install</h4>
                  <p>Click to install this plugin to your ChRIS Server.</p>
                  <br />
                  <Popover
                    position="bottom"
                    maxWidth="30rem"
                    headerContent={<b>Install to your ChRIS server</b>}
                    bodyContent={() => (
                      <div>
                        <p>
                          Copy and Paste the URL below into your ChRIS Admin Dashboard
                          to install this plugin.
                        </p>
                        <br />
                        <InstallButton/>
                      </div>
                    )}
                  >
                    <Button isBlock style={{ fontSize: '1.125em' }}>
                      <DownloadIcon />
                      {' '}
                      Install to ChRIS
                    </Button>
                  </Popover>
                </div>
                <div className="plugin-body-detail-section">
                  <h4>Repository</h4>
                  <a href={pluginData.public_repo}>
                    {pluginData.public_repo}
                  </a>
                </div>

                <div className="plugin-body-detail-section">
                  <h4>Author</h4>
                  { authors.map((author) => (
                    <a key={author} href={`#${author}`}>
                      <p><UserAltIcon /> {author}</p>
                    </a>
                  ))}
                </div>
                <div className="plugin-body-detail-section">
                  <h4>Collaborators</h4>
                  {
                    // FIXME this view is responsible for both /plugin/:pluginName routes
                    // and /p/:pluginId routes. But pluginData is different depending
                    // on whether we're looking at plugin meta or a specific plugin.
                    pluginData.collaborators ?
                      pluginData.collaborators.map((collaborator) => (
                        <a key={collaborator.id} href={`#${collaborator.username}`}>
                          <p><UserAltIcon /> {collaborator.username}</p>
                        </a>
                      ))
                      :
                      <a className="pf-m-link" href={`${pluginData.public_repo}/graphs/contributors`}>
                        View contributors on Github
                      </a>
                  }
                </div>

                <div className="plugin-body-detail-section">
                  <h4>License</h4>
                  { repoData ? repoData.license.name : pluginData.license }
                </div>
                <div className="plugin-body-detail-section">
                  <h4>Content Type</h4>
                  {pluginData.type}
                </div>
                <div className="plugin-body-detail-section">
                  <h4>Date added</h4>
                  {(new Date(pluginData.creation_date)).toDateString()}
                </div>
              </div>
            </GridItem>
          </Grid>
        </Card>
      </article>
    </>
  );
};

PluginBody.propTypes = {
  pluginData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    dock_image: PropTypes.string,
    license: PropTypes.string,
    public_repo: PropTypes.string,
    type: PropTypes.string,
    authorURL: PropTypes.string,
    authors: PropTypes.oneOfType([
      PropTypes.string, PropTypes.arrayOf(PropTypes.string)
    ]),
    versions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.any), PropTypes.any
    ])
  }).isRequired,
};

export default PluginBody;
