import React from 'react';
import LoadingContainer from '../../../LoadingContainer/LoadingContainer';
import LoadingContent from '../../../LoadingContainer/components/LoadingContent/LoadingContent';
import './LoadingPluginItem.css';

const LoadingPluginItem = () => (
  <LoadingContainer className="loading-plugin-item" >
    <LoadingContent
      width="150px"
      height="37px"
      top="20px"
      left="20px"
    />
    <LoadingContent
      width="160px"
      height="23px"
      top="7.5px"
      left="20px"
    />
    <LoadingContent
      width="230px"
      height="23px"
      top="7.5px"
      left="20px"
    />
  </LoadingContainer>
);

export default LoadingPluginItem;
