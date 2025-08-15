import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { colors, getColorWithOpacity } from '../../theme/colors';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<{ position: 'start' | 'end'; clickable?: boolean }>`
  position: absolute;
  ${props => props.position === 'start' ? 'left: 1rem' : 'right: 1rem'};
  display: flex;
  align-items: center;
  color: ${colors.text.secondary};
  z-index: 1;
  pointer-events: ${props => props.clickable ? 'auto' : 'none'};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.clickable ? colors.primary[500] : colors.text.secondary};
  }

  svg {
    font-size: 1.25rem;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
  display: block;
`;

const StyledInput = styled.input<{ hasError?: boolean; variant?: 'outlined' | 'filled'; hasStartIcon?: boolean; hasEndIcon?: boolean }>`
  padding: 0.75rem 1rem;
  padding-left: ${props => props.hasStartIcon ? '3rem' : '1rem'};
  padding-right: ${props => props.hasEndIcon ? '3rem' : '1rem'};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
  width: 100%;

  ${props => props.variant === 'filled' ? `
    background-color: ${colors.input.background};
    border: 2px solid transparent;
  ` : `
    background-color: ${colors.background.default};
    border: 2px solid ${props.hasError ? colors.error[500] : colors.input.border};
  `}

  &:focus {
    border-color: ${props => props.hasError ? colors.error[500] : colors.input.focus};
    box-shadow: 0 0 0 3px ${props => props.hasError 
      ? getColorWithOpacity(colors.error[500], 0.1) 
      : getColorWithOpacity(colors.input.focus, 0.1)};
  }

  &::placeholder {
    color: ${colors.text.hint};
  }

  &:disabled {
    background-color: ${colors.neutral[100]};
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${colors.error[500]};
  margin-top: 0.25rem;
  display: block;
`;

const HelperText = styled.span`
  font-size: 0.75rem;
  color: ${colors.text.hint};
  margin-top: 0.25rem;
  display: block;
`;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, fullWidth = true, variant = 'outlined', startIcon, endIcon, onEndIconClick, className, ...props }, ref) => {
    return (
      <InputWrapper fullWidth={fullWidth} className={className}>
        <Label htmlFor={props.id}>{label}</Label>
        <InputContainer>
          {startIcon && (
            <IconWrapper position="start">
              {startIcon}
            </IconWrapper>
          )}
          <StyledInput
            ref={ref}
            hasError={!!error}
            variant={variant}
            hasStartIcon={!!startIcon}
            hasEndIcon={!!endIcon}
            {...props}
          />
          {endIcon && (
            <IconWrapper position="end" clickable={!!onEndIconClick} onClick={onEndIconClick}>
              {endIcon}
            </IconWrapper>
          )}
        </InputContainer>
        {error && <ErrorText>{error}</ErrorText>}
        {!error && helperText && <HelperText>{helperText}</HelperText>}
      </InputWrapper>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
