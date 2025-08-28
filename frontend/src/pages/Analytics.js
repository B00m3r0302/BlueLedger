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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(Card)`
  padding: 2rem;
`;

const MetricTitle = styled.h3`
  color: ${theme.colors.gray700};
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const MetricDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const DetailItem = styled.div`
  padding: 0.75rem;
  background: ${theme.colors.gray50};
  border-radius: 0.5rem;
  text-align: center;
`;

const DetailValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
  margin-bottom: 0.25rem;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.gray600};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled(Card)`
  padding: 1.5rem;
  min-height: 300px;
`;

const ChartTitle = styled.h3`
  color: ${theme.colors.gray700};
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const StatusBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${theme.colors.gray50};
  border-radius: 0.5rem;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color || theme.colors.gray400};
`;

const StatusLabel = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray700};
`;

const StatusCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
`;

const StatusPercentage = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.gray600};
`;

const TopItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TopItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${theme.colors.gray50};
  border-radius: 0.5rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray800};
  margin-bottom: 0.25rem;
`;

const ItemDetail = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.gray600};
`;

const ItemValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.primary};
  text-align: right;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  text-align: center;
  padding: 2rem;
  background: ${theme.colors.errorLight};
  border-radius: 0.5rem;
  margin: 1rem 0;
`;

const Analytics = () => {
  // Hardcoded realistic chemical industry analytics data
  const analytics = {
    revenue: {
      total: 22690875, // $22.69M total contract value
      contracts: 6, // 6 active contracts
      avgPerContract: 3781813, // Average contract value
      growth: 24.8 // Year-over-year growth percentage
    },
    customers: {
      total: 8, // Total customers in CRM
      active: 7, // Active customers
      prospects: 1, // Prospect customers
      retention: 87.5 // Customer retention rate
    },
    shipments: {
      total: 6, // Total shipments
      delivered: 3, // Successfully delivered
      pending: 1, // Pending shipments
      onTime: 83.3 // On-time delivery rate
    },
    contracts: {
      total: 6, // Total contracts
      active: 5, // Currently active
      expiring: 2, // Expiring within 30 days
      value: 22690875 // Total contract value
    }
  };

  const breakdown = {
    shipmentStatus: [
      {
        label: 'delivered',
        count: 3,
        percentage: '50.0',
        color: theme.colors.success
      },
      {
        label: 'in transit',
        count: 1,
        percentage: '16.7',
        color: theme.colors.info
      },
      {
        label: 'customs',
        count: 1,
        percentage: '16.7',
        color: theme.colors.warning
      },
      {
        label: 'pending',
        count: 1,
        percentage: '16.7',
        color: theme.colors.gray400
      }
    ],
    contractStatus: [
      {
        label: 'active',
        count: 5,
        percentage: '83.3',
        color: theme.colors.success
      },
      {
        label: 'pending approval',
        count: 1,
        percentage: '16.7',
        color: theme.colors.warning
      }
    ],
    customerTypes: [
      {
        label: 'buyer',
        count: 7,
        percentage: '87.5',
        color: theme.colors.primary
      },
      {
        label: 'supplier',
        count: 1,
        percentage: '12.5',
        color: theme.colors.success
      }
    ],
    topCustomers: [
      {
        name: 'PetroSynth Corporation',
        orders: 56,
        value: 6750000,
        industry: 'Petrochemical Manufacturing'
      },
      {
        name: 'PharmaCore Industries',
        orders: 42,
        value: 4250000,
        industry: 'Pharmaceutical Manufacturing'
      },
      {
        name: 'Industrial Polymers Ltd',
        orders: 24,
        value: 3120000,
        industry: 'Polymer Manufacturing'
      },
      {
        name: 'AgriChem Enterprises',
        orders: 35,
        value: 2890000,
        industry: 'Agricultural Chemicals'
      },
      {
        name: 'BioLab Innovations',
        orders: 31,
        value: 2340000,
        industry: 'Biotechnology'
      }
    ]
  };

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
      <AnalyticsContainer>
        <Title>Business Analytics</Title>

        <MetricsGrid>
          <MetricCard>
            <MetricTitle>Revenue Overview</MetricTitle>
            <MetricValue>{formatCurrency(analytics.revenue.total)}</MetricValue>
            <MetricLabel>Total Contract Value</MetricLabel>
            <MetricDetails>
              <DetailItem>
                <DetailValue>{analytics.revenue.contracts}</DetailValue>
                <DetailLabel>Active Contracts</DetailLabel>
              </DetailItem>
              <DetailItem>
                <DetailValue>{formatCurrency(analytics.revenue.avgPerContract)}</DetailValue>
                <DetailLabel>Avg per Contract</DetailLabel>
              </DetailItem>
            </MetricDetails>
          </MetricCard>

          <MetricCard>
            <MetricTitle>Customer Metrics</MetricTitle>
            <MetricValue>{analytics.customers.total}</MetricValue>
            <MetricLabel>Total Customers</MetricLabel>
            <MetricDetails>
              <DetailItem>
                <DetailValue>{analytics.customers.active}</DetailValue>
                <DetailLabel>Active</DetailLabel>
              </DetailItem>
              <DetailItem>
                <DetailValue>{analytics.customers.retention.toFixed(1)}%</DetailValue>
                <DetailLabel>Retention Rate</DetailLabel>
              </DetailItem>
            </MetricDetails>
          </MetricCard>

          <MetricCard>
            <MetricTitle>Shipment Performance</MetricTitle>
            <MetricValue>{analytics.shipments.total}</MetricValue>
            <MetricLabel>Total Shipments</MetricLabel>
            <MetricDetails>
              <DetailItem>
                <DetailValue>{analytics.shipments.delivered}</DetailValue>
                <DetailLabel>Delivered</DetailLabel>
              </DetailItem>
              <DetailItem>
                <DetailValue>{analytics.shipments.onTime.toFixed(1)}%</DetailValue>
                <DetailLabel>Success Rate</DetailLabel>
              </DetailItem>
            </MetricDetails>
          </MetricCard>
        </MetricsGrid>

        <ChartsGrid>
          <ChartCard>
            <ChartTitle>Shipment Status Distribution</ChartTitle>
            <StatusBreakdown>
              {breakdown.shipmentStatus.map((status, index) => (
                <StatusItem key={index}>
                  <StatusInfo>
                    <StatusDot color={status.color} />
                    <StatusLabel>{status.label}</StatusLabel>
                  </StatusInfo>
                  <StatusCount>
                    <StatusValue>{status.count}</StatusValue>
                    <StatusPercentage>({status.percentage}%)</StatusPercentage>
                  </StatusCount>
                </StatusItem>
              ))}
            </StatusBreakdown>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Contract Status Breakdown</ChartTitle>
            <StatusBreakdown>
              {breakdown.contractStatus.map((status, index) => (
                <StatusItem key={index}>
                  <StatusInfo>
                    <StatusDot color={status.color} />
                    <StatusLabel>{status.label}</StatusLabel>
                  </StatusInfo>
                  <StatusCount>
                    <StatusValue>{status.count}</StatusValue>
                    <StatusPercentage>({status.percentage}%)</StatusPercentage>
                  </StatusCount>
                </StatusItem>
              ))}
            </StatusBreakdown>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Customer Types</ChartTitle>
            <StatusBreakdown>
              {breakdown.customerTypes.map((type, index) => (
                <StatusItem key={index}>
                  <StatusInfo>
                    <StatusDot color={type.color} />
                    <StatusLabel>{type.label}</StatusLabel>
                  </StatusInfo>
                  <StatusCount>
                    <StatusValue>{type.count}</StatusValue>
                    <StatusPercentage>({type.percentage}%)</StatusPercentage>
                  </StatusCount>
                </StatusItem>
              ))}
            </StatusBreakdown>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Top Customers by Value</ChartTitle>
            <TopItemsList>
              {breakdown.topCustomers.map((customer, index) => (
                <TopItem key={index}>
                  <ItemInfo>
                    <ItemName>{customer.name}</ItemName>
                    <ItemDetail>{customer.industry} • {customer.orders} orders</ItemDetail>
                  </ItemInfo>
                  <ItemValue>{formatCurrency(customer.value)}</ItemValue>
                </TopItem>
              ))}
            </TopItemsList>
          </ChartCard>
        </ChartsGrid>
      </AnalyticsContainer>
    </Layout>
  );
};

export default Analytics;