import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  BankOutlined,
  LineChartOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    window.location.href = '/admin-login';
  };

  const menuItems = [
    {
      key: '/admin/companies',
      icon: <BankOutlined />,
      label: <Link to="/admin/companies">Companies</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    // {
    //   key: '/admin/shares',
    //   icon: <LineChartOutlined />,
    //   label: <Link to="/admin/shares">Share Management</Link>,
    // },
    {
      key: '/admin/rounds',
      icon: <PlayCircleOutlined />,
      label: <Link to="/admin/rounds">Round Management</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 16px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Admin Panel</h2>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 