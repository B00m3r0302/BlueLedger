import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Card, Button, theme } from '../styles/GlobalStyles';

const ShipmentsContainer = styled.div`
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

const Shipments = () => {
  return (
    <Layout>
      <ShipmentsContainer>
        <Header>
          <Title>Shipment Tracking</Title>
          <Button variant="primary">New Shipment</Button>
        </Header>

        <ComingSoon>
          <ComingSoonTitle>Shipment Management Coming Soon</ComingSoonTitle>
          <ComingSoonText>
            Track your imports and exports with real-time updates. Features will include 
            shipment creation, status tracking, document management, customs clearance 
            tracking, and automated notifications for delivery updates.
          </ComingSoonText>
        </ComingSoon>
      </ShipmentsContainer>
    </Layout>
  );
};

export default Shipments;