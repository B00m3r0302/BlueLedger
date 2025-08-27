import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Button, theme } from '../styles/GlobalStyles';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: ${props => props.collapsed ? '4rem' : '16rem'};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadows.lg};
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    width: 16rem;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.gray200};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  font-size: ${props => props.collapsed ? '1rem' : '1.125rem'};
`;

const ChemicalIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-weight: bold;
  flex-shrink: 0;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.gray500};
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
  
  &:hover {
    color: ${theme.colors.gray700};
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const Nav = styled.nav`
  padding: 1rem 0;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${theme.colors.gray600};
  text-decoration: none;
  transition: all 0.2s ease;
  
  ${props => props.active && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-right: 3px solid ${theme.colors.primaryHover};
  `}
  
  &:hover {
    background-color: ${props => props.active ? theme.colors.primaryHover : theme.colors.gray100};
    color: ${props => props.active ? theme.colors.white : theme.colors.gray800};
  }
`;

const NavIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const NavText = styled.span`
  ${props => props.collapsed && `
    display: none;
  `}
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '4rem' : '16rem'};
  transition: margin-left 0.3s ease;
  background: ${theme.colors.gray50};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  background: ${theme.colors.white};
  padding: 1rem 2rem;
  box-shadow: ${theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.gray600};
  cursor: pointer;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${theme.colors.gray800};
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.gray500};
  text-transform: capitalize;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: ${props => props.show ? 'block' : 'none'};
  
  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/crm', label: 'CRM', icon: '👥' },
    { path: '/shipments', label: 'Shipments', icon: '🚢' },
    { path: '/contracts', label: 'Contracts', icon: '📄' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : []),
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <LayoutContainer>
      <Overlay show={mobileMenuOpen} onClick={closeMobileMenu} />
      
      <Sidebar collapsed={sidebarCollapsed} mobileOpen={mobileMenuOpen}>
        <SidebarHeader>
          <Logo collapsed={sidebarCollapsed}>
            <ChemicalIcon>S</ChemicalIcon>
            {!sidebarCollapsed && 'Sinamoa'}
          </Logo>
          <CollapseButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </CollapseButton>
        </SidebarHeader>
        
        <Nav>
          {navigationItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
              onClick={closeMobileMenu}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavText collapsed={sidebarCollapsed}>{item.label}</NavText>
            </NavItem>
          ))}
        </Nav>
      </Sidebar>

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <TopBar>
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
            ☰
          </MobileMenuButton>
          
          <UserMenu>
            {user && (
              <UserInfo>
                <UserName>{user.firstName} {user.lastName}</UserName>
                <UserRole>{user.role}</UserRole>
              </UserInfo>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </UserMenu>
        </TopBar>
        
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;