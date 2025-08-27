import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Card, theme } from '../styles/GlobalStyles';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
  color: ${theme.colors.white};
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray500};
`;

const ActivityCard = styled(Card)`
  h3 {
    margin-bottom: 1rem;
    color: ${theme.colors.gray800};
  }
`;

const ActivityItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.colors.gray200};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.gray500};
`;

const Dashboard = () => {
  const stats = [
    { label: 'Active Shipments', value: '24', change: '+12%' },
    { label: 'Pending Contracts', value: '8', change: '+3' },
    { label: 'Total Customers', value: '156', change: '+5%' },
    { label: 'Revenue (MTD)', value: '$2.4M', change: '+18%' },
  ];

  const activities = [
    {
      title: 'New shipment created',
      time: '2 minutes ago',
    },
    {
      title: 'Contract renewal approved',
      time: '1 hour ago',
    },
    {
      title: 'Customer payment received',
      time: '3 hours ago',
    },
    {
      title: 'Shipment delivered successfully',
      time: '5 hours ago',
    },
  ];

  return (
    <Layout>
      <DashboardContainer>
        <WelcomeCard>
          <WelcomeTitle>Dashboard Overview</WelcomeTitle>
          <WelcomeSubtitle>
            Welcome back! Here's what's happening with your operations today.
          </WelcomeSubtitle>
        </WelcomeCard>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatNumber>{stat.value}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <ContentGrid>
          <ChartCard>
            <div>
              <h3>Analytics Charts</h3>
              <p>Interactive charts and graphs will be displayed here</p>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: theme.colors.gray400 }}>
                Chart.js integration coming soon...
              </p>
            </div>
          </ChartCard>

          <ActivityCard>
            <h3>Recent Activity</h3>
            {activities.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityItem>
            ))}
          </ActivityCard>
        </ContentGrid>
      </DashboardContainer>
    </Layout>
  );
};

export default Dashboard;