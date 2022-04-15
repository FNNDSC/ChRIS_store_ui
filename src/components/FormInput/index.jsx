import { FormGroup, FormHelperText, TextInput } from '@patternfly/react-core';
import React, { useState } from 'react';

import './FormInput.css';
import showPassword from '../../assets/img/show_password.png';

const FormInput = (props) => {
  const {
    formLabel,
    fieldId,
    validationState,
    helperText,
    error,
    inputType,
    fieldName,
    id,
    value,
    autoFocus,
    onChange,
    disableControls,
    children,
    placeholder,
    className,
    defaultValue,
  } = props;
  const [realInputType, setRealInputType] = useState(inputType);

  const togglePasswordToText = () => {
    setRealInputType(realInputType === "password" ? "text" : "password")
  }

  const togglePassword = () => {
    setRealInputType(realInputType === "text" ? "password" : "password")
  }


  return (
    <FormGroup
      label={formLabel}
      fieldId={fieldId}
      validated={validationState}
      className={className}
      helperText={
        helperText
          ? (
            <FormHelperText isHidden={validationState === 'error'}>
              {helperText}
            </FormHelperText>
          ) : null
      }
      helperTextInvalid={error && error.controls.includes(fieldName) ? error.message : null}
    >
      {
        children || (
          <div className="input-container">
            <TextInput
              validated={validationState}
              type={realInputType}
              id={id}
              name={fieldName}
              autoComplete="off"
              value={value}
              autoFocus={autoFocus}
              onChange={onChange}
              isDisabled={disableControls}
              placeholder={placeholder}
              defaultValue={defaultValue}
            />
            {inputType === "password" ? (
              <button 
              type="button" 
              className="toggle-password-btn" 
              onMouseEnter={togglePasswordToText}
              onMouseLeave={togglePassword}>
                <img src={showPassword} className="show__password" alt="hide-password" />
              </button>
            ) : null}
          </div>
        )
      }

    </FormGroup>
  );
};

export default FormInput;