import React from 'react';
import LoadingContainer from '../../../LoadingContainer/LoadingContainer';
import LoadingContent from '../../../LoadingContainer/components/LoadingContent/LoadingContent';
import './LoadingPlugin.css';

const LoadingPlugin = () => (
  <LoadingContainer className="loading-plugin-container">
    <div className="plugin-header">
      <div className="row no-flex">
        <LoadingContent
          width="8em"
          height="1.5em"
        />
        <LoadingContent
          width="12em"
          height="2.3em"
          top="1em"
        />
        <LoadingContent
          width="13em"
          height="1em"
          top="0.8em"
        />
        <LoadingContent
          className="loading-plugin-tag"
          width="4em"
          height="1.5em"
          top="0.5em"
        />
        <LoadingContent
          className="loading-plugin-tag"
          width="14em"
          height="1.5em"
          top="1em"
          left="0.5em"
        />
      </div>
    </div>
    <div className="plugin-body">
      <div className="row">
        <div className="plugin-body-main-col">
          <LoadingContent
            type="white"
            width="100%"
            height="9em"
          />
          <LoadingContent
            type="white"
            width="100%"
            height="9em"
            top="1em"
          />
        </div>
        <div className="plugin-body-side-col">
          <LoadingContent
            type="white"
            width="100%"
            height="9em"
          />
        </div>
      </div>
    </div>
  </LoadingContainer>
);

export default LoadingPlugin;
