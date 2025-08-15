import React from 'react';
import styled, { css } from 'styled-components';
import { colors, getColorWithOpacity } from '../../theme/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const getButtonStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${colors.background.gradient.primary};
        color: ${colors.text.inverse};
        border: 2px solid transparent;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${getColorWithOpacity(colors.primary[500], 0.3)};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;

    case 'secondary':
      return css`
        background-color: ${colors.secondary[500]};
        color: ${colors.text.inverse};
        border: 2px solid ${colors.secondary[500]};

        &:hover:not(:disabled) {
          background-color: ${colors.secondary[600]};
          border-color: ${colors.secondary[600]};
        }
      `;

    case 'outline':
      return css`
        background-color: transparent;
        color: ${colors.primary[500]};
        border: 2px solid ${colors.primary[500]};

        &:hover:not(:disabled) {
          background-color: ${getColorWithOpacity(colors.primary[500], 0.1)};
        }
      `;

    case 'ghost':
      return css`
        background-color: transparent;
        color: ${colors.primary[500]};
        border: 2px solid transparent;

        &:hover:not(:disabled) {
          background-color: ${colors.button.hover};
        }
      `;

    default:
      return css``;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        min-height: 2.25rem;
      `;

    case 'large':
      return css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
        min-height: 3.5rem;
      `;

    case 'medium':
    default:
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        min-height: 3rem;
      `;
  }
};

const StyledButton = styled.button<{
  variant: string;
  size: string;
  fullWidth?: boolean;
  loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-decoration: none;
  outline: none;
  position: relative;
  overflow: hidden;

  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => getButtonStyles(props.variant)}
  ${props => getSizeStyles(props.size)}

  &:focus {
    box-shadow: 0 0 0 3px ${getColorWithOpacity(colors.primary[500], 0.2)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  ${props => props.loading && css`
    pointer-events: none;
  `}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {startIcon && <IconWrapper>{startIcon}</IconWrapper>}
          {children}
          {endIcon && <IconWrapper>{endIcon}</IconWrapper>}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
