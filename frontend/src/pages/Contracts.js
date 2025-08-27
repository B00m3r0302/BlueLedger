import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Card, Button, theme } from '../styles/GlobalStyles';

const ContractsContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.gray800};
`;

const ComingSoon = styled(Card)`
  text-align: center;
  padding: 4rem 2rem;
`;

const ComingSoonTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${theme.colors.gray700};
`;

const ComingSoonText = styled.p`
  color: ${theme.colors.gray500};
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Contracts = () => {
  return (
    <Layout>
      <ContractsContainer>
        <Header>
          <Title>Contract Management</Title>
          <Button variant="primary">New Contract</Button>
        </Header>

        <ComingSoon>
          <ComingSoonTitle>Contract Management Coming Soon</ComingSoonTitle>
          <ComingSoonText>
            Manage your contract lifecycle from creation to renewal. Features will include 
            contract templates, digital signatures, renewal notifications, milestone tracking, 
            and compliance management for all your business agreements.
          </ComingSoonText>
        </ComingSoon>
      </ContractsContainer>
    </Layout>
  );
};

export default Contracts;