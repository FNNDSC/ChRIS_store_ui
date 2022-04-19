import { FormGroup, FormHelperText, TextInput,Button, InputGroup, } from '@patternfly/react-core';
import React from 'react';

const PasswordValue = ({
    
      formLabel='',
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
      className='',
      toggleShow,
      hidden,
      style,
      ...props
    }) => (
        <FormGroup
          label={formLabel} {...props}
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
          children || (
            <InputGroup>
              <TextInput
              style={style}
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
            />
              <Button            
              variant="control"
              onClick={toggleShow}
              >
                {hidden}
              </Button>
            </InputGroup>
    
          )
        }
    
        </FormGroup>
      );
    
    export default PasswordValue; 