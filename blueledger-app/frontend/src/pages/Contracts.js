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

const ContractsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const ContractCard = styled(Card)`
  position: relative;
`;

const ContractHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContractNumber = styled.h3`
  color: ${theme.colors.gray800};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ContractTitle = styled.h4`
  color: ${theme.colors.gray700};
  margin: 0.25rem 0 0 0;
  font-size: 1rem;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  background: ${props => 
    props.status === 'active' ? theme.colors.success :
    props.status === 'pending_approval' ? theme.colors.warning :
    props.status === 'draft' ? theme.colors.gray400 :
    props.status === 'completed' ? theme.colors.info :
    props.status === 'cancelled' ? theme.colors.error : theme.colors.gray400
  };
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const PriorityBadge = styled.span`
  background: ${props => 
    props.priority === 'critical' ? theme.colors.error :
    props.priority === 'high' ? theme.colors.warning :
    props.priority === 'medium' ? theme.colors.info : theme.colors.gray400
  };
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
`;

const ContractDetails = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ProductsSection = styled.div`
  background: ${theme.colors.gray50};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${theme.colors.gray200};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProductName = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray800};
  font-size: 0.875rem;
`;

const ProductQuantity = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
`;

const ContractFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.gray200};
`;

const ContractValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
  font-size: 1.1rem;
`;

const ContractDates = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: ${theme.colors.gray500};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  text-align: center;
  padding: 2rem;
  background: ${theme.colors.errorLight};
  border-radius: 0.5rem;
  margin: 1rem 0;
`;

const Contracts = () => {
  // Hardcoded realistic chemical industry contract data
  const contracts = [
    {
      _id: '1',
      contractNumber: 'CNT-2025-078',
      title: 'Pharmaceutical Grade Solvents Supply Agreement',
      description: 'Multi-year supply contract for high-purity pharmaceutical grade solvents including acetonitrile, methanol, and ethyl acetate',
      customer: { name: 'PharmaCore Industries' },
      type: 'supply',
      status: 'active',
      priority: 'high',
      dates: {
        startDate: '2025-01-15',
        endDate: '2026-01-14',
        signed: '2024-12-20'
      },
      terms: {
        paymentTerms: 'net_30',
        deliveryTerms: 'fob',
        currency: 'USD'
      },
      products: [
        {
          name: 'Acetonitrile HPLC Grade',
          description: 'Ultra-pure acetonitrile for pharmaceutical analysis',
          quantity: { value: 2000, unit: 'L' },
          unitPrice: 48.50,
          totalPrice: 97000,
          specifications: [
            { parameter: 'Purity', value: '99.9', unit: '%' },
            { parameter: 'Water Content', value: '<50', unit: 'ppm' }
          ]
        },
        {
          name: 'Methanol HPLC Grade',
          description: 'High-purity methanol for chromatography applications',
          quantity: { value: 1500, unit: 'L' },
          unitPrice: 42.75,
          totalPrice: 64125
        }
      ],
      financial: {
        totalValue: 161125,
        paidAmount: 85000,
        outstandingAmount: 76125
      }
    },
    {
      _id: '2',
      contractNumber: 'CNT-2025-092',
      title: 'Bulk Chemical Feedstock Agreement',
      description: 'Long-term supply contract for petrochemical feedstocks including benzene, toluene, and xylene',
      customer: { name: 'PetroSynth Corporation' },
      type: 'supply',
      status: 'active',
      priority: 'critical',
      dates: {
        startDate: '2025-03-01',
        endDate: '2027-02-28',
        signed: '2025-02-15'
      },
      terms: {
        paymentTerms: 'net_45',
        deliveryTerms: 'cif',
        currency: 'USD'
      },
      products: [
        {
          name: 'Benzene Technical Grade',
          description: 'Industrial grade benzene for chemical synthesis',
          quantity: { value: 500, unit: 'MT' },
          unitPrice: 1250.00,
          totalPrice: 625000
        },
        {
          name: 'Toluene Industrial Grade',
          description: 'High-quality toluene for manufacturing applications',
          quantity: { value: 300, unit: 'MT' },
          unitPrice: 980.00,
          totalPrice: 294000
        }
      ],
      financial: {
        totalValue: 919000,
        paidAmount: 450000,
        outstandingAmount: 469000
      }
    },
    {
      _id: '3',
      contractNumber: 'CNT-2025-065',
      title: 'Specialty Polymer Raw Materials Contract',
      description: 'Supply agreement for specialty polymer precursors and additives for advanced manufacturing',
      customer: { name: 'Industrial Polymers Ltd' },
      type: 'supply',
      status: 'active',
      priority: 'medium',
      dates: {
        startDate: '2025-02-01',
        endDate: '2025-12-31',
        signed: '2025-01-25'
      },
      terms: {
        paymentTerms: 'net_30',
        deliveryTerms: 'fob',
        currency: 'USD'
      },
      products: [
        {
          name: 'Styrene Monomer',
          description: 'Polymer-grade styrene monomer with inhibitor',
          quantity: { value: 150, unit: 'MT' },
          unitPrice: 1450.00,
          totalPrice: 217500
        },
        {
          name: 'Polyethylene Glycol 400',
          description: 'PEG 400 for plasticizer and polymer applications',
          quantity: { value: 80, unit: 'MT' },
          unitPrice: 890.00,
          totalPrice: 71200
        }
      ],
      financial: {
        totalValue: 288700,
        paidAmount: 120000,
        outstandingAmount: 168700
      }
    },
    {
      _id: '4',
      contractNumber: 'CNT-2025-103',
      title: 'Agricultural Chemical Supply Partnership',
      description: 'Comprehensive supply agreement for agricultural chemicals including fertilizers and crop protection products',
      customer: { name: 'AgriChem Enterprises' },
      type: 'supply',
      status: 'active',
      priority: 'medium',
      dates: {
        startDate: '2025-04-01',
        endDate: '2025-11-30',
        signed: '2025-03-28'
      },
      terms: {
        paymentTerms: 'net_60',
        deliveryTerms: 'fob',
        currency: 'USD'
      },
      products: [
        {
          name: 'Ammonium Sulfate Crystalline',
          description: 'Agricultural grade ammonium sulfate fertilizer',
          quantity: { value: 200, unit: 'MT' },
          unitPrice: 295.00,
          totalPrice: 59000
        }
      ],
      financial: {
        totalValue: 59000,
        paidAmount: 0,
        outstandingAmount: 59000
      }
    },
    {
      _id: '5',
      contractNumber: 'CNT-2025-045',
      title: 'Water Treatment Chemicals Contract',
      description: 'Supply contract for water treatment and purification chemicals',
      customer: { name: 'CleanWater Technologies' },
      type: 'supply',
      status: 'pending_approval',
      priority: 'medium',
      dates: {
        startDate: '2025-09-01',
        endDate: '2026-08-31',
        signed: null
      },
      terms: {
        paymentTerms: 'net_30',
        deliveryTerms: 'fob',
        currency: 'USD'
      },
      products: [
        {
          name: 'Sodium Hypochlorite Solution',
          description: '12% sodium hypochlorite for water disinfection',
          quantity: { value: 50000, unit: 'L' },
          unitPrice: 2.85,
          totalPrice: 142500
        }
      ],
      financial: {
        totalValue: 142500,
        paidAmount: 0,
        outstandingAmount: 142500
      }
    },
    {
      _id: '6',
      contractNumber: 'CNT-2025-034',
      title: 'Laboratory Reagents Supply Agreement',
      description: 'Annual supply contract for analytical and laboratory grade reagents',
      customer: { name: 'BioLab Innovations' },
      type: 'supply',
      status: 'active',
      priority: 'high',
      dates: {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        signed: '2024-12-10'
      },
      terms: {
        paymentTerms: 'net_30',
        deliveryTerms: 'fob',
        currency: 'USD'
      },
      products: [
        {
          name: 'Hydrochloric Acid ACS Grade',
          description: '37% HCl for analytical applications',
          quantity: { value: 500, unit: 'L' },
          unitPrice: 15.50,
          totalPrice: 7750
        },
        {
          name: 'Sodium Hydroxide ACS Grade',
          description: 'High purity NaOH pellets',
          quantity: { value: 250, unit: 'kg' },
          unitPrice: 3.20,
          totalPrice: 800
        }
      ],
      financial: {
        totalValue: 8550,
        paidAmount: 8550,
        outstandingAmount: 0
      }
    }
  ];

  // Calculate stats
  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending_approval').length,
    totalValue: contracts.reduce((sum, c) => sum + (c.financial?.totalValue || 0), 0)
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <Layout>
      <ContractsContainer>
        <Header>
          <Title>Contract Management</Title>
          <Button variant="primary">New Contract</Button>
        </Header>


        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Contracts</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.active}</StatNumber>
            <StatLabel>Active Contracts</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.pending}</StatNumber>
            <StatLabel>Pending Approval</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatCurrency(stats.totalValue)}</StatNumber>
            <StatLabel>Total Value</StatLabel>
          </StatCard>
        </StatsGrid>

        <ContractsGrid>
          {contracts.map((contract) => (
            <ContractCard key={contract._id}>
              <ContractHeader>
                <div>
                  <ContractNumber>{contract.contractNumber}</ContractNumber>
                  <ContractTitle>{contract.title}</ContractTitle>
                </div>
                <div>
                  <StatusBadge status={contract.status}>
                    {contract.status.replace('_', ' ')}
                  </StatusBadge>
                  <PriorityBadge priority={contract.priority}>
                    {contract.priority}
                  </PriorityBadge>
                </div>
              </ContractHeader>

              <ContractDetails>
                <div><strong>Type:</strong> {contract.type}</div>
                <div><strong>Customer:</strong> {contract.customer?.name || 'Loading...'}</div>
                <div><strong>Payment Terms:</strong> {contract.terms?.paymentTerms?.replace('_', ' ')}</div>
                <div><strong>Delivery Terms:</strong> {contract.terms?.deliveryTerms?.toUpperCase()}</div>
              </ContractDetails>

              {contract.products && contract.products.length > 0 && (
                <ProductsSection>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: theme.colors.gray700 }}>
                    Products ({contract.products.length})
                  </div>
                  {contract.products.slice(0, 3).map((product, index) => (
                    <ProductItem key={index}>
                      <div>
                        <ProductName>{product.name}</ProductName>
                        <ProductQuantity>
                          {product.quantity?.value} {product.quantity?.unit}
                        </ProductQuantity>
                      </div>
                      <ProductPrice>
                        {formatCurrency(product.totalPrice || (product.quantity?.value * product.unitPrice))}
                      </ProductPrice>
                    </ProductItem>
                  ))}
                  {contract.products.length > 3 && (
                    <div style={{ textAlign: 'center', marginTop: '0.5rem', color: theme.colors.gray500, fontSize: '0.875rem' }}>
                      +{contract.products.length - 3} more products
                    </div>
                  )}
                </ProductsSection>
              )}

              <ContractFooter>
                <ContractValue>
                  {formatCurrency(contract.financial?.totalValue || 0)}
                </ContractValue>
                <ContractDates>
                  <div>Start: {formatDate(contract.dates?.startDate)}</div>
                  <div>End: {formatDate(contract.dates?.endDate)}</div>
                  {contract.dates?.signed && (
                    <div>Signed: {formatDate(contract.dates.signed)}</div>
                  )}
                </ContractDates>
              </ContractFooter>
            </ContractCard>
          ))}
        </ContractsGrid>
      </ContractsContainer>
    </Layout>
  );
};

export default Contracts;