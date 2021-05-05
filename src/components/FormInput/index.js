import { FormGroup, FormHelperText, TextInput } from '@patternfly/react-core';
import React from 'react';

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
  return (
    <FormGroup
      label={formLabel}
      fieldId={fieldId}
      validated={validationState}
      className={className}
      helperText={
        helperText ? 
        <FormHelperText isHidden={validationState === 'error'}>
          {helperText}
        </FormHelperText> : null
      }
      helperTextInvalid={error && error.controls.includes(fieldName) ? error.message: null}
    >
    {
      children ? children : (
        <TextInput
          validated={validationState}
          type={inputType}
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
      )
    }
    
    </FormGroup>
  )
};

export default FormInput;