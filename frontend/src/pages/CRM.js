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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
`;

const CustomerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const CustomerCard = styled(Card)`
  position: relative;
`;

const CustomerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CustomerName = styled.h3`
  color: ${theme.colors.gray800};
  margin: 0;
  font-size: 1.25rem;
`;

const CustomerType = styled.span`
  background: ${props => props.type === 'supplier' ? theme.colors.success : 
                      props.type === 'both' ? theme.colors.warning : theme.colors.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const CustomerDetails = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  background: ${theme.colors.gray50};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ContactName = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray800};
`;

const ContactDetails = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.gray600};
`;

const CustomerStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.gray200};
`;

const CustomerStat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
`;

const StatDesc = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.gray500};
`;

const StatusBadge = styled.span`
  background: ${props => props.status === 'active' ? theme.colors.success :
                       props.status === 'prospect' ? theme.colors.warning : theme.colors.gray400};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  text-align: center;
  padding: 2rem;
  background: ${theme.colors.errorLight};
  border-radius: 0.5rem;
  margin: 1rem 0;
`;

const CRM = () => {
  // Hardcoded realistic chemical industry customer data
  const customers = [
    {
      _id: '1',
      name: 'PharmaCore Industries',
      email: 'procurement@pharmacore.com',
      phone: '+1-555-0145',
      website: 'https://pharmacore.com',
      industry: 'Pharmaceutical Manufacturing',
      customerType: 'buyer',
      address: {
        street: '2500 Research Parkway',
        city: 'Cambridge',
        state: 'MA',
        zipCode: '02139',
        country: 'USA'
      },
      contacts: [
        {
          name: 'Dr. Sarah Mitchell',
          title: 'Chief Procurement Officer',
          email: 's.mitchell@pharmacore.com',
          phone: '+1-555-0146',
          isPrimary: true
        },
        {
          name: 'James Rodriguez',
          title: 'Quality Assurance Manager',
          email: 'j.rodriguez@pharmacore.com',
          phone: '+1-555-0147',
          isPrimary: false
        }
      ],
      status: 'active',
      totalOrders: 42,
      totalValue: 4250000,
      lastOrderDate: '2025-08-25'
    },
    {
      _id: '2',
      name: 'GreenTech Solutions',
      email: 'orders@greentech-solutions.com',
      phone: '+1-555-0234',
      website: 'https://greentech-solutions.com',
      industry: 'Environmental Technology',
      customerType: 'buyer',
      address: {
        street: '1800 Eco Drive',
        city: 'Portland',
        state: 'OR',
        zipCode: '97205',
        country: 'USA'
      },
      contacts: [
        {
          name: 'Lisa Chen',
          title: 'Sustainability Director',
          email: 'l.chen@greentech-solutions.com',
          phone: '+1-555-0235',
          isPrimary: true
        }
      ],
      status: 'active',
      totalOrders: 28,
      totalValue: 1890000,
      lastOrderDate: '2025-08-20'
    },
    {
      _id: '3',
      name: 'PetroSynth Corporation',
      email: 'purchasing@petrosynth.com',
      phone: '+1-555-0567',
      website: 'https://petrosynth.com',
      industry: 'Petrochemical Manufacturing',
      customerType: 'buyer',
      address: {
        street: '5000 Refinery Boulevard',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA'
      },
      contacts: [
        {
          name: 'Michael Torres',
          title: 'Senior Vice President - Procurement',
          email: 'm.torres@petrosynth.com',
          phone: '+1-555-0568',
          isPrimary: true
        }
      ],
      status: 'active',
      totalOrders: 56,
      totalValue: 6750000,
      lastOrderDate: '2025-08-28'
    },
    {
      _id: '4',
      name: 'BioLab Innovations',
      email: 'supply@biolab-innovations.com',
      phone: '+1-555-0789',
      website: 'https://biolab-innovations.com',
      industry: 'Biotechnology',
      customerType: 'buyer',
      address: {
        street: '3400 Innovation Way',
        city: 'San Diego',
        state: 'CA',
        zipCode: '92121',
        country: 'USA'
      },
      contacts: [
        {
          name: 'Dr. Amanda Foster',
          title: 'Head of Laboratory Operations',
          email: 'a.foster@biolab-innovations.com',
          phone: '+1-555-0790',
          isPrimary: true
        }
      ],
      status: 'active',
      totalOrders: 31,
      totalValue: 2340000,
      lastOrderDate: '2025-08-15'
    },
    {
      _id: '5',
      name: 'Nordic Chemicals AB',
      email: 'export@nordic-chemicals.se',
      phone: '+46-8-555-1234',
      website: 'https://nordic-chemicals.se',
      industry: 'Specialty Chemicals',
      customerType: 'supplier',
      address: {
        street: 'Industrivägen 25',
        city: 'Stockholm',
        state: 'Stockholm County',
        zipCode: '11451',
        country: 'Sweden'
      },
      contacts: [
        {
          name: 'Erik Andersson',
          title: 'Export Manager',
          email: 'e.andersson@nordic-chemicals.se',
          phone: '+46-8-555-1235',
          isPrimary: true
        }
      ],
      status: 'active',
      totalOrders: 18,
      totalValue: 1450000,
      lastOrderDate: '2025-08-22'
    },
    {
      _id: '6',
      name: 'AgriChem Enterprises',
      email: 'orders@agrichem-enterprises.com',
      phone: '+1-555-0456',
      website: 'https://agrichem-enterprises.com',
      industry: 'Agricultural Chemicals',
      customerType: 'buyer',
      address: {
        street: '7200 Farm Road',
        city: 'Des Moines',
        state: 'IA',
        zipCode: '50309',
        country: 'USA'
      },
      contacts: [
        {
          name: 'Robert Johnson',
          title: 'Chief Technology Officer',
          email: 'r.johnson@agrichem-enterprises.com',
          phone: '+1-555-0457',
          isPrimary: true
        }
      ],
      status: 'active',
      totalOrders: 35,
      totalValue: 2890000,
      lastOrderDate: '2025-08-18'
    },
    {
      _id: '7',
      name: 'Industrial Polymers Ltd',
      email: 'procurement@ind-polymers.com',
      phone: '+1-555-0321',
      website: 'https://ind-polymers.com',
      industry: 'Polymer Manufacturing',
      customerType: 'buyer',
      address: {
        street: '4500 Industrial Circle',
        city: 'Detroit',
        state: 'MI',
        zipCode: '48201',
        country: 'USA'
      },
      contacts: [
        {
          name: 'Jennifer Martinez',
          title: 'Supply Chain Director',
          email: 'j.martinez@ind-polymers.com',
          phone: '+1-555-0322',
          isPrimary: true
        }
      ],
      status: 'active',
      totalOrders: 24,
      totalValue: 3120000,
      lastOrderDate: '2025-08-12'
    },
    {
      _id: '8',
      name: 'CleanWater Technologies',
      email: 'purchasing@cleanwater-tech.com',
      phone: '+1-555-0654',
      website: 'https://cleanwater-tech.com',
      industry: 'Water Treatment',
      customerType: 'buyer',
      address: {
        street: '1500 Water Works Drive',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'USA'
      },
      contacts: [
        {
          name: 'David Kim',
          title: 'Technical Director',
          email: 'd.kim@cleanwater-tech.com',
          phone: '+1-555-0655',
          isPrimary: true
        }
      ],
      status: 'prospect',
      totalOrders: 0,
      totalValue: 0,
      lastOrderDate: null
    }
  ];

  // Calculate stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    prospects: customers.filter(c => c.status === 'prospect').length,
    totalValue: customers.reduce((sum, c) => sum + (c.totalValue || 0), 0)
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
      <CRMContainer>
        <Header>
          <Title>Customer Relationship Management</Title>
          <Button variant="primary">Add Customer</Button>
        </Header>


        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Customers</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.active}</StatNumber>
            <StatLabel>Active Customers</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.prospects}</StatNumber>
            <StatLabel>Prospects</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatCurrency(stats.totalValue)}</StatNumber>
            <StatLabel>Total Value</StatLabel>
          </StatCard>
        </StatsGrid>

        <CustomerGrid>
          {customers.map((customer) => (
            <CustomerCard key={customer._id}>
              <CustomerHeader>
                <div>
                  <CustomerName>{customer.name}</CustomerName>
                  <div style={{ marginTop: '0.5rem' }}>
                    <StatusBadge status={customer.status}>
                      {customer.status}
                    </StatusBadge>
                  </div>
                </div>
                <CustomerType type={customer.customerType}>
                  {customer.customerType}
                </CustomerType>
              </CustomerHeader>

              <CustomerDetails>
                <div><strong>Industry:</strong> {customer.industry}</div>
                <div><strong>Location:</strong> {customer.address?.city}, {customer.address?.country}</div>
                <div><strong>Email:</strong> {customer.email}</div>
                <div><strong>Phone:</strong> {customer.phone}</div>
              </CustomerDetails>

              {customer.contacts && customer.contacts.length > 0 && (
                <ContactInfo>
                  <ContactName>Primary Contact</ContactName>
                  <ContactDetails>
                    {customer.contacts.find(c => c.isPrimary)?.name || customer.contacts[0].name}
                    <br />
                    {customer.contacts.find(c => c.isPrimary)?.title || customer.contacts[0].title}
                    <br />
                    {customer.contacts.find(c => c.isPrimary)?.email || customer.contacts[0].email}
                  </ContactDetails>
                </ContactInfo>
              )}

              <CustomerStats>
                <CustomerStat>
                  <StatValue>{customer.totalOrders || 0}</StatValue>
                  <StatDesc>Orders</StatDesc>
                </CustomerStat>
                <CustomerStat>
                  <StatValue>{formatCurrency(customer.totalValue || 0)}</StatValue>
                  <StatDesc>Total Value</StatDesc>
                </CustomerStat>
                <CustomerStat>
                  <StatValue>
                    {customer.lastOrderDate 
                      ? new Date(customer.lastOrderDate).toLocaleDateString()
                      : 'Never'
                    }
                  </StatValue>
                  <StatDesc>Last Order</StatDesc>
                </CustomerStat>
              </CustomerStats>
            </CustomerCard>
          ))}
        </CustomerGrid>
      </CRMContainer>
    </Layout>
  );
};

export default CRM;