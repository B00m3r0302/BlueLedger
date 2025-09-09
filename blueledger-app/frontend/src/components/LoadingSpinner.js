import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.height || '200px'};
  width: 100%;
`;

const Spinner = styled.div`
  width: ${props => props.size || '2rem'};
  height: ${props => props.size || '2rem'};
  border: 2px solid ${theme.colors.gray200};
  border-top: 2px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner = ({ size, height }) => {
  return (
    <SpinnerContainer height={height}>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;