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
  min-height: 400px;
  padding: 1.5rem;
`;

const ChartTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: ${theme.colors.gray800};
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${theme.colors.gray50};
  border-radius: 0.5rem;
`;

const StatusLabel = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
`;

const StatusValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
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

const ActivityMeta = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.primary};
  margin-top: 0.25rem;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  text-align: center;
  padding: 2rem;
  background: ${theme.colors.errorLight};
  border-radius: 0.5rem;
  margin: 1rem 0;
`;

const Dashboard = () => {
  // Hardcoded realistic data for chemical company dashboard
  const stats = {
    totalCustomers: 156,
    activeShipments: 24,
    activeContracts: 18,
    totalRevenue: 13750000 // $13.75M
  };

  const businessOverview = {
    activeCustomers: 134,
    totalCustomers: 156,
    deliveredShipments: 89,
    totalShipments: 113,
    contractCompletion: 78, // percentage
    avgContractValue: 763889 // Average contract value
  };

  const recentActivity = [
    {
      title: 'Shipment SNM-2025-047 delivered to PharmaCore',
      time: '23 minutes ago',
      meta: 'EXPORT • HIGH PRIORITY'
    },
    {
      title: 'New contract CNT-2025-089 signed with BioTech Industries',
      time: '1 hour ago',
      meta: 'SUPPLY • $2,450,000'
    },
    {
      title: 'Benzene shipment cleared customs in Houston',
      time: '2 hours ago',
      meta: 'IMPORT • MEDIUM PRIORITY'
    },
    {
      title: 'Quality control completed for Acetone batch #A-2025-156',
      time: '3 hours ago',
      meta: 'QC APPROVAL • PHARMACEUTICAL GRADE'
    },
    {
      title: 'Contract CNT-2025-034 renewal notification sent',
      time: '4 hours ago',
      meta: 'RENEWAL • $890,000'
    },
    {
      title: 'Temperature-controlled shipment departed from facility',
      time: '5 hours ago',
      meta: 'EXPORT • URGENT'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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
          <StatCard>
            <StatNumber>{stats.totalCustomers}</StatNumber>
            <StatLabel>Total Customers</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.activeShipments}</StatNumber>
            <StatLabel>Active Shipments</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.activeContracts}</StatNumber>
            <StatLabel>Active Contracts</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatCurrency(stats.totalRevenue)}</StatNumber>
            <StatLabel>Total Contract Value</StatLabel>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <ChartCard>
            <ChartTitle>Business Overview</ChartTitle>
            <StatusGrid>
              <StatusItem>
                <StatusLabel>Active Customers</StatusLabel>
                <StatusValue>{businessOverview.activeCustomers}/{businessOverview.totalCustomers}</StatusValue>
              </StatusItem>
              <StatusItem>
                <StatusLabel>Delivered Shipments</StatusLabel>
                <StatusValue>{businessOverview.deliveredShipments}/{businessOverview.totalShipments}</StatusValue>
              </StatusItem>
              <StatusItem>
                <StatusLabel>Contract Success Rate</StatusLabel>
                <StatusValue>{businessOverview.contractCompletion}%</StatusValue>
              </StatusItem>
              <StatusItem>
                <StatusLabel>Avg Contract Value</StatusLabel>
                <StatusValue>{formatCurrency(businessOverview.avgContractValue)}</StatusValue>
              </StatusItem>
            </StatusGrid>
            
            <div style={{ 
              marginTop: '2rem', 
              padding: '2rem', 
              background: theme.colors.gray50, 
              borderRadius: '0.5rem',
              textAlign: 'center' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: theme.colors.gray700 }}>
                Data Visualization
              </h4>
              <p style={{ color: theme.colors.gray500, fontSize: '0.875rem' }}>
                Interactive charts and graphs with real-time data coming soon
              </p>
            </div>
          </ChartCard>

          <ActivityCard>
            <h3>Recent Activity</h3>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
                {activity.meta && <ActivityMeta>{activity.meta}</ActivityMeta>}
              </ActivityItem>
            ))}
          </ActivityCard>
        </ContentGrid>
      </DashboardContainer>
    </Layout>
  );
};

export default Dashboard;