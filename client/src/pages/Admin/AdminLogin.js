import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Space,
} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    // Check if passkey matches
    if (values.passkey === 'ecellrgpv@123') {
      localStorage.setItem('isAdmin', 'true');
      message.success('Welcome Admin!');
      window.location.href = '/admin';  // Using window.location for hard redirect
    } else {
      message.error('Invalid passkey');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>Admin Login</Title>
          </div>
          
          <Form
            name="admin_login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
              />
            </Form.Item>

            <Form.Item
              name="passkey"
              rules={[{ required: true, message: 'Please input the passkey!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Passkey"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default AdminLogin; 