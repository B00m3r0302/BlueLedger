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

const ShipmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 1.5rem;
`;

const ShipmentCard = styled(Card)`
  position: relative;
`;

const ShipmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TrackingNumber = styled.h3`
  color: ${theme.colors.gray800};
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const ShipmentType = styled.span`
  background: ${props => props.type === 'import' ? theme.colors.info : theme.colors.success};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span`
  background: ${props => 
    props.status === 'delivered' ? theme.colors.success :
    props.status === 'in_transit' ? theme.colors.info :
    props.status === 'customs' ? theme.colors.warning :
    props.status === 'pending' ? theme.colors.gray400 :
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
    props.priority === 'urgent' ? theme.colors.error :
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

const ShipmentDetails = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const RouteSection = styled.div`
  background: ${theme.colors.gray50};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const RouteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LocationLabel = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray700};
  font-size: 0.875rem;
`;

const LocationValue = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.875rem;
`;

const TrackingSection = styled.div`
  background: ${theme.colors.gray50};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const TrackingItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TrackingDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.latest ? theme.colors.primary : theme.colors.gray400};
  border-radius: 50%;
  margin-right: 1rem;
  margin-top: 0.5rem;
  flex-shrink: 0;
`;

const TrackingContent = styled.div`
  flex: 1;
`;

const TrackingStatus = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray800};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const TrackingLocation = styled.div`
  color: ${theme.colors.gray600};
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const TrackingTime = styled.div`
  color: ${theme.colors.gray500};
  font-size: 0.75rem;
`;

const ShipmentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.gray200};
`;

const ShipmentValue = styled.div`
  font-weight: bold;
  color: ${theme.colors.gray800};
  font-size: 1.1rem;
`;

const CarrierInfo = styled.div`
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

const Shipments = () => {
  // Hardcoded realistic chemical industry shipment data
  const shipments = [
    {
      _id: '1',
      trackingNumber: 'SNM-2025-047',
      type: 'export',
      status: 'delivered',
      priority: 'high',
      customer: { name: 'PharmaCore Industries' },
      carrier: {
        name: 'DHL Express',
        service: 'Express Worldwide',
        awbNumber: 'DHL-9834756829'
      },
      origin: { city: 'Houston', state: 'TX', country: 'USA' },
      destination: { city: 'Cambridge', state: 'MA', country: 'USA' },
      dates: {
        shipped: '2025-08-25T08:30:00Z',
        estimatedArrival: '2025-08-26T14:00:00Z',
        actualArrival: '2025-08-26T13:45:00Z'
      },
      items: [
        {
          description: 'Acetonitrile HPLC Grade - 500L',
          quantity: 500,
          unit: 'L',
          hazardClass: '3.1',
          unNumber: 'UN1648'
        }
      ],
      totalValue: 24250,
      tracking: [
        {
          status: 'Package delivered',
          location: 'Cambridge, MA',
          timestamp: '2025-08-26T13:45:00Z',
          notes: 'Delivered to receiving dock, signed by S. Mitchell'
        },
        {
          status: 'Out for delivery',
          location: 'Cambridge, MA',
          timestamp: '2025-08-26T09:15:00Z',
          notes: 'Temperature-controlled vehicle'
        },
        {
          status: 'Arrived at delivery facility',
          location: 'Boston, MA',
          timestamp: '2025-08-26T06:30:00Z'
        },
        {
          status: 'In transit',
          location: 'Newark, NJ',
          timestamp: '2025-08-25T22:15:00Z'
        },
        {
          status: 'Package picked up',
          location: 'Houston, TX',
          timestamp: '2025-08-25T08:30:00Z',
          notes: 'Hazmat certified driver'
        }
      ]
    },
    {
      _id: '2',
      trackingNumber: 'SNM-2025-052',
      type: 'import',
      status: 'in_transit',
      priority: 'urgent',
      customer: { name: 'PetroSynth Corporation' },
      carrier: {
        name: 'FedEx Trade Networks',
        service: 'International Priority',
        awbNumber: 'FX-4827395610'
      },
      origin: { city: 'Rotterdam', country: 'Netherlands' },
      destination: { city: 'Houston', state: 'TX', country: 'USA' },
      dates: {
        shipped: '2025-08-24T14:20:00Z',
        estimatedArrival: '2025-08-28T16:00:00Z'
      },
      items: [
        {
          description: 'Benzene Technical Grade - 25MT',
          quantity: 25,
          unit: 'MT',
          hazardClass: '3.1',
          unNumber: 'UN1114'
        }
      ],
      totalValue: 31250,
      tracking: [
        {
          status: 'In transit to destination',
          location: 'Atlantic Ocean',
          timestamp: '2025-08-27T12:00:00Z',
          notes: 'Vessel MSC DIANA, ETA Houston 28-Aug'
        },
        {
          status: 'Departed export facility',
          location: 'Rotterdam Port, Netherlands',
          timestamp: '2025-08-24T18:45:00Z'
        },
        {
          status: 'Customs clearance completed',
          location: 'Rotterdam, Netherlands',
          timestamp: '2025-08-24T16:30:00Z'
        },
        {
          status: 'Package received at terminal',
          location: 'Rotterdam, Netherlands',
          timestamp: '2025-08-24T14:20:00Z'
        }
      ]
    },
    {
      _id: '3',
      trackingNumber: 'SNM-2025-048',
      type: 'export',
      status: 'customs',
      priority: 'medium',
      customer: { name: 'Industrial Polymers Ltd' },
      carrier: {
        name: 'UPS Supply Chain Solutions',
        service: 'Worldwide Express',
        awbNumber: 'UPS-1Z9482756'
      },
      origin: { city: 'Newark', state: 'NJ', country: 'USA' },
      destination: { city: 'Detroit', state: 'MI', country: 'USA' },
      dates: {
        shipped: '2025-08-26T10:15:00Z',
        estimatedArrival: '2025-08-28T12:00:00Z'
      },
      items: [
        {
          description: 'Styrene Monomer - 150MT',
          quantity: 150,
          unit: 'MT',
          hazardClass: '3.1',
          unNumber: 'UN2055'
        },
        {
          description: 'Polyethylene Glycol 400 - 80MT',
          quantity: 80,
          unit: 'MT'
        }
      ],
      totalValue: 288700,
      tracking: [
        {
          status: 'Customs inspection in progress',
          location: 'Detroit, MI',
          timestamp: '2025-08-27T14:20:00Z',
          notes: 'Chemical analysis required for styrene shipment'
        },
        {
          status: 'Arrived at customs facility',
          location: 'Detroit, MI',
          timestamp: '2025-08-27T11:45:00Z'
        },
        {
          status: 'In transit',
          location: 'Cleveland, OH',
          timestamp: '2025-08-27T02:30:00Z'
        },
        {
          status: 'Package picked up',
          location: 'Newark, NJ',
          timestamp: '2025-08-26T10:15:00Z'
        }
      ]
    },
    {
      _id: '4',
      trackingNumber: 'SNM-2025-055',
      type: 'export',
      status: 'delivered',
      priority: 'medium',
      customer: { name: 'BioLab Innovations' },
      carrier: {
        name: 'DB Schenker',
        service: 'Air & Ocean Logistics',
        awbNumber: 'DBS-8294756123'
      },
      origin: { city: 'Los Angeles', state: 'CA', country: 'USA' },
      destination: { city: 'San Diego', state: 'CA', country: 'USA' },
      dates: {
        shipped: '2025-08-24T09:00:00Z',
        estimatedArrival: '2025-08-24T16:00:00Z',
        actualArrival: '2025-08-24T15:30:00Z'
      },
      items: [
        {
          description: 'Hydrochloric Acid ACS Grade - 500L',
          quantity: 500,
          unit: 'L',
          hazardClass: '8',
          unNumber: 'UN1789'
        },
        {
          description: 'Sodium Hydroxide ACS Grade - 250kg',
          quantity: 250,
          unit: 'kg',
          hazardClass: '8',
          unNumber: 'UN1823'
        }
      ],
      totalValue: 8550,
      tracking: [
        {
          status: 'Package delivered',
          location: 'San Diego, CA',
          timestamp: '2025-08-24T15:30:00Z',
          notes: 'Delivered to laboratory receiving, signed by A. Foster'
        },
        {
          status: 'Out for delivery',
          location: 'San Diego, CA',
          timestamp: '2025-08-24T11:45:00Z',
          notes: 'Hazmat certified delivery'
        },
        {
          status: 'Package picked up',
          location: 'Los Angeles, CA',
          timestamp: '2025-08-24T09:00:00Z'
        }
      ]
    },
    {
      _id: '5',
      trackingNumber: 'SNM-2025-058',
      type: 'import',
      status: 'pending',
      priority: 'low',
      customer: { name: 'CleanWater Technologies' },
      carrier: {
        name: 'Maersk Line',
        service: 'Ocean Freight',
        awbNumber: 'MSK-7392846501'
      },
      origin: { city: 'Antwerp', country: 'Belgium' },
      destination: { city: 'Phoenix', state: 'AZ', country: 'USA' },
      dates: {
        shipped: '2025-08-30T00:00:00Z',
        estimatedArrival: '2025-09-15T00:00:00Z'
      },
      items: [
        {
          description: 'Sodium Hypochlorite Solution 12% - 50,000L',
          quantity: 50000,
          unit: 'L',
          hazardClass: '8',
          unNumber: 'UN1791'
        }
      ],
      totalValue: 142500,
      tracking: [
        {
          status: 'Scheduled for pickup',
          location: 'Antwerp, Belgium',
          timestamp: '2025-08-29T16:00:00Z',
          notes: 'Awaiting container loading scheduled for Aug 30'
        }
      ]
    },
    {
      _id: '6',
      trackingNumber: 'SNM-2025-041',
      type: 'export',
      status: 'delivered',
      priority: 'high',
      customer: { name: 'AgriChem Enterprises' },
      carrier: {
        name: 'CH Robinson',
        service: 'Expedited Ground',
        awbNumber: 'CHR-5829374610'
      },
      origin: { city: 'Chicago', state: 'IL', country: 'USA' },
      destination: { city: 'Des Moines', state: 'IA', country: 'USA' },
      dates: {
        shipped: '2025-08-22T07:30:00Z',
        estimatedArrival: '2025-08-22T18:00:00Z',
        actualArrival: '2025-08-22T17:15:00Z'
      },
      items: [
        {
          description: 'Ammonium Sulfate Crystalline - 200MT',
          quantity: 200,
          unit: 'MT'
        }
      ],
      totalValue: 59000,
      tracking: [
        {
          status: 'Package delivered',
          location: 'Des Moines, IA',
          timestamp: '2025-08-22T17:15:00Z',
          notes: 'Delivered to warehouse dock 3, signed by R. Johnson'
        },
        {
          status: 'Out for delivery',
          location: 'Des Moines, IA',
          timestamp: '2025-08-22T14:30:00Z'
        },
        {
          status: 'In transit',
          location: 'Davenport, IA',
          timestamp: '2025-08-22T11:20:00Z'
        },
        {
          status: 'Package picked up',
          location: 'Chicago, IL',
          timestamp: '2025-08-22T07:30:00Z'
        }
      ]
    }
  ];

  // Calculate stats
  const stats = {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => ['in_transit', 'customs'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'delivered').length
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <ShipmentsContainer>
        <Header>
          <Title>Shipment Tracking</Title>
          <Button variant="primary">New Shipment</Button>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Shipments</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.pending}</StatNumber>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.inTransit}</StatNumber>
            <StatLabel>In Transit</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.delivered}</StatNumber>
            <StatLabel>Delivered</StatLabel>
          </StatCard>
        </StatsGrid>

        <ShipmentsGrid>
          {shipments.map((shipment) => (
            <ShipmentCard key={shipment._id}>
              <ShipmentHeader>
                <div>
                  <TrackingNumber>{shipment.trackingNumber}</TrackingNumber>
                </div>
                <div>
                  <ShipmentType type={shipment.type}>
                    {shipment.type}
                  </ShipmentType>
                  <StatusBadge status={shipment.status}>
                    {shipment.status.replace('_', ' ')}
                  </StatusBadge>
                  <PriorityBadge priority={shipment.priority}>
                    {shipment.priority}
                  </PriorityBadge>
                </div>
              </ShipmentHeader>

              <ShipmentDetails>
                <div><strong>Customer:</strong> {shipment.customer?.name || 'Loading...'}</div>
                {shipment.carrier?.name && (
                  <div><strong>Carrier:</strong> {shipment.carrier.name}</div>
                )}
                {shipment.items && shipment.items.length > 0 && (
                  <div><strong>Items:</strong> {shipment.items[0].description}
                    {shipment.items.length > 1 && ` (+${shipment.items.length - 1} more)`}
                  </div>
                )}
              </ShipmentDetails>

              <RouteSection>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: theme.colors.gray700 }}>
                  Route Information
                </div>
                <RouteItem>
                  <LocationLabel>Origin:</LocationLabel>
                  <LocationValue>{shipment.origin?.city}, {shipment.origin?.country}</LocationValue>
                </RouteItem>
                <RouteItem>
                  <LocationLabel>Destination:</LocationLabel>
                  <LocationValue>{shipment.destination?.city}, {shipment.destination?.country}</LocationValue>
                </RouteItem>
                {shipment.dates?.shipped && (
                  <RouteItem>
                    <LocationLabel>Shipped:</LocationLabel>
                    <LocationValue>{formatDateTime(shipment.dates.shipped)}</LocationValue>
                  </RouteItem>
                )}
                {shipment.dates?.estimatedArrival && (
                  <RouteItem>
                    <LocationLabel>ETA:</LocationLabel>
                    <LocationValue>{formatDateTime(shipment.dates.estimatedArrival)}</LocationValue>
                  </RouteItem>
                )}
              </RouteSection>

              {shipment.tracking && shipment.tracking.length > 0 && (
                <TrackingSection>
                  <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: theme.colors.gray700 }}>
                    Tracking History
                  </div>
                  {shipment.tracking.slice(-3).reverse().map((track, index) => (
                    <TrackingItem key={index}>
                      <TrackingDot latest={index === 0} />
                      <TrackingContent>
                        <TrackingStatus>{track.status}</TrackingStatus>
                        {track.location && (
                          <TrackingLocation>{track.location}</TrackingLocation>
                        )}
                        <TrackingTime>{formatDateTime(track.timestamp)}</TrackingTime>
                        {track.notes && (
                          <div style={{ fontSize: '0.75rem', color: theme.colors.gray500, marginTop: '0.25rem' }}>
                            {track.notes}
                          </div>
                        )}
                      </TrackingContent>
                    </TrackingItem>
                  ))}
                  {shipment.tracking.length > 3 && (
                    <div style={{ textAlign: 'center', marginTop: '0.5rem', color: theme.colors.gray500, fontSize: '0.75rem' }}>
                      +{shipment.tracking.length - 3} more tracking updates
                    </div>
                  )}
                </TrackingSection>
              )}

              <ShipmentFooter>
                <ShipmentValue>
                  {formatCurrency(shipment.totalValue || 0)}
                </ShipmentValue>
                <CarrierInfo>
                  {shipment.carrier?.awbNumber && (
                    <div>AWB: {shipment.carrier.awbNumber}</div>
                  )}
                  {shipment.carrier?.service && (
                    <div>{shipment.carrier.service}</div>
                  )}
                </CarrierInfo>
              </ShipmentFooter>
            </ShipmentCard>
          ))}
        </ShipmentsGrid>
      </ShipmentsContainer>
    </Layout>
  );
};

export default Shipments;