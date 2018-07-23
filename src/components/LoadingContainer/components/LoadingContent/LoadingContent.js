import React from 'react';
import PropTypes from 'prop-types';

const LoadingContent = (props) => {
  const computedStyle = {
    width: props.width,
    height: props.height,
    marginTop: props.top,
    marginLeft: props.left,
    marginBottom: props.bottom,
    marginRight: props.right,
  };

  let addedClasses = props.className;
  switch (props.type) {
    case 'white':
      addedClasses += ' white';
      break;
    default:
  }

  return (
    <div
      className={`loading ${addedClasses}`}
      style={computedStyle}
    />
  );
};

LoadingContent.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  top: PropTypes.string,
  left: PropTypes.string,
  bottom: PropTypes.string,
  right: PropTypes.string,
};

LoadingContent.defaultProps = {
  className: '',
  type: '',
  top: '0',
  left: '0',
  bottom: '0',
  right: '0',
};

export default LoadingContent;
