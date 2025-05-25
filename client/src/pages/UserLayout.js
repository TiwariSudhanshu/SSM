import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LineChartOutlined,
  BankOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Box, Typography } from '@mui/material';

const { Sider, Content } = Layout;

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  const menuItems = [
    {
      key: '/user/dashboard',
      icon: <LineChartOutlined />,
      label: <Link to="/user/dashboard">Dashboard</Link>,
    },
    {
      key: '/user/trade',
      icon: <BankOutlined />,
      label: <Link to="/user/trade">Trade</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const selectedKeys = menuItems.filter(item => location.pathname.startsWith(item.key)).map(item => item.key);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Box sx={{ padding: '16px', textAlign: 'center' }}>
          <Box sx={{ mb: 1 }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto', backgroundColor: '#4CAF50', borderRadius: '50%' }}></div>
          </Box>
          <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            IMPRENDITORE
          </Typography>
        </Box>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          style={{ height: 'calc(100% - 72px)', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Box sx={{ mt: 4, mb: 4, flex: 1 }}>
             <Outlet />
          </Box>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout; 