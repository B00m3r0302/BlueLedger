import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }
  
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }
  
  .p-1 { padding: 0.5rem; }
  .p-2 { padding: 1rem; }
  .p-3 { padding: 1.5rem; }
  .p-4 { padding: 2rem; }
`;

export const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    success: '#059669',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0891b2',
    light: '#f8fafc',
    dark: '#1e293b',
    white: '#ffffff',
    black: '#000000',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'primary' && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: ${theme.colors.gray200};
    color: ${theme.colors.gray700};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray300};
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: ${theme.colors.danger};
    color: ${theme.colors.white};
    
    &:hover:not(:disabled) {
      background-color: #b91c1c;
    }
  `}
  
  ${props => props.size === 'sm' && `
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  `}
  
  ${props => props.size === 'lg' && `
    padding: 1rem 2rem;
    font-size: 1rem;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

export const Card = styled.div`
  background-color: ${theme.colors.white};
  border-radius: 0.75rem;
  box-shadow: ${theme.shadows.md};
  padding: 1.5rem;
  
  ${props => props.padding && `
    padding: ${props.padding};
  `}
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.gray400};
  }
  
  ${props => props.error && `
    border-color: ${theme.colors.danger};
    
    &:focus {
      border-color: ${theme.colors.danger};
      box-shadow: 0 0 0 3px rgb(220 38 38 / 0.1);
    }
  `}
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.gray700};
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: ${theme.colors.danger};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid ${theme.colors.gray200};
  border-top: 2px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default GlobalStyles;