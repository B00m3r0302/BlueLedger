import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Card, theme } from '../styles/GlobalStyles';

const AnalyticsContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.gray800};
  margin-bottom: 2rem;
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

const Analytics = () => {
  return (
    <Layout>
      <AnalyticsContainer>
        <Title>Business Analytics</Title>

        <ComingSoon>
          <ComingSoonTitle>Advanced Analytics Coming Soon</ComingSoonTitle>
          <ComingSoonText>
            Gain insights into your business performance with comprehensive analytics. 
            Features will include revenue tracking, shipment analytics, customer insights, 
            contract performance metrics, and customizable reporting dashboards.
          </ComingSoonText>
        </ComingSoon>
      </AnalyticsContainer>
    </Layout>
  );
};

export default Analytics;