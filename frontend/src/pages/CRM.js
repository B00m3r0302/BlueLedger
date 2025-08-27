import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Card, Button, theme } from '../styles/GlobalStyles';

const CRMContainer = styled.div`
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

const CRM = () => {
  return (
    <Layout>
      <CRMContainer>
        <Header>
          <Title>Customer Relationship Management</Title>
          <Button variant="primary">Add Customer</Button>
        </Header>

        <ComingSoon>
          <ComingSoonTitle>CRM System Coming Soon</ComingSoonTitle>
          <ComingSoonText>
            Our comprehensive CRM system will help you manage customer relationships, 
            track interactions, and analyze customer data. Features will include contact management, 
            interaction history, customer analytics, and automated follow-ups.
          </ComingSoonText>
        </ComingSoon>
      </CRMContainer>
    </Layout>
  );
};

export default CRM;