import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, Label, ErrorMessage, theme } from '../styles/GlobalStyles';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  background: ${theme.colors.white};
  border-radius: 1rem;
  box-shadow: ${theme.shadows.xl};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const ChemicalIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  color: ${theme.colors.gray800};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlertMessage = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  ${props => props.type === 'error' && `
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: ${theme.colors.danger};
  `}
  
  ${props => props.type === 'success' && `
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: ${theme.colors.success};
  `}
`;

const ForgotPassword = styled(Link)`
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BackToHome = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.white};
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    position: static;
    margin-bottom: 1rem;
    justify-content: center;
  }
`;

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BackToHome to="/">
        ← Back to Home
      </BackToHome>
      
      <LoginCard>
        <LogoSection>
          <Logo>
            <ChemicalIcon>S</ChemicalIcon>
            Sinamoa Chemicals
          </Logo>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to access your account</Subtitle>
        </LogoSection>

        {errorMessage && (
          <AlertMessage type="error">
            {errorMessage}
          </AlertMessage>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              error={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              error={!!errors.password}
              disabled={isLoading}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="1rem" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <ForgotPassword to="/forgot-password">
          Forgot your password?
        </ForgotPassword>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;