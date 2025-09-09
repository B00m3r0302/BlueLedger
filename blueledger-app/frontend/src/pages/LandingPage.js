import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, theme } from '../styles/GlobalStyles';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
  color: ${theme.colors.white};
`;

const Header = styled.header`
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChemicalIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  font-weight: bold;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const WhiteButton = styled(Button)`
  background-color: ${theme.colors.white};
  color: ${theme.colors.primary};
  
  &:hover:not(:disabled) {
    background-color: ${theme.colors.gray100};
    transform: translateY(-2px);
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: ${theme.colors.white};
  border: 2px solid ${theme.colors.white};
  
  &:hover:not(:disabled) {
    background-color: ${theme.colors.white};
    color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: bold;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${theme.colors.white};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${theme.colors.primary};
  font-size: 1.5rem;
  font-weight: bold;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  opacity: 0.9;
  line-height: 1.6;
`;

const Footer = styled.footer`
  padding: 2rem 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const LandingPage = () => {
  const features = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with JWT authentication and role-based access control'
    },
    {
      icon: '📋',
      title: 'CRM Management',
      description: 'Comprehensive customer relationship management with detailed contact tracking'
    },
    {
      icon: '🚢',
      title: 'Shipment Tracking',
      description: 'Real-time tracking of imports and exports with detailed logistics management'
    },
    {
      icon: '📄',
      title: 'Contract Management',
      description: 'Complete contract lifecycle management with automated renewal notifications'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Comprehensive business metrics and reporting with interactive charts'
    },
    {
      icon: '⚙️',
      title: 'Admin Controls',
      description: 'Powerful administrative tools for user management and system configuration'
    }
  ];

  return (
    <LandingContainer>
      <Header>
        <Nav>
          <Logo>
            <ChemicalIcon>S</ChemicalIcon>
            Sinamoa Chemicals
          </Logo>
          <Link to="/login">
            <WhiteButton size="sm">
              Sign In
            </WhiteButton>
          </Link>
        </Nav>
      </Header>

      <HeroSection>
        <HeroTitle>
          Leading Global Supplier of<br />
          Synthalon Solutions
        </HeroTitle>
        <HeroSubtitle>
          Advanced chemical supply chain management for biomedical applications. 
          Streamline your operations with our comprehensive platform for imports, 
          exports, contracts, and analytics.
        </HeroSubtitle>
        
        <CTAButtons>
          <Link to="/login">
            <WhiteButton size="lg">
              Get Started
            </WhiteButton>
          </Link>
          <OutlineButton size="lg">
            Learn More
          </OutlineButton>
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Comprehensive Supply Chain Management</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <Footer>
        <div className="container">
          <p>&copy; 2024 Sinamoa Chemicals. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
            Secure • Reliable • Global
          </p>
        </div>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;