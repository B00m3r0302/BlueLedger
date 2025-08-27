import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { Card, Button, theme } from '../styles/GlobalStyles';

const AdminContainer = styled.div`
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

const Admin = () => {
  return (
    <Layout>
      <AdminContainer>
        <Header>
          <Title>Admin Panel</Title>
          <Button variant="primary">Add User</Button>
        </Header>

        <ComingSoon>
          <ComingSoonTitle>Admin Panel Coming Soon</ComingSoonTitle>
          <ComingSoonText>
            Comprehensive administrative controls for system management. Features will include 
            user management, role assignments, system configuration, audit logs, 
            and security settings for complete platform administration.
          </ComingSoonText>
        </ComingSoon>
      </AdminContainer>
    </Layout>
  );
};

export default Admin;