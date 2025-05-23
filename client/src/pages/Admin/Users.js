import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Modal, message, Space, Tag } from 'antd';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role ? role.toUpperCase() : 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => `$${(balance || 0).toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Table columns={columns} dataSource={users} rowKey="_id" />

      <Modal
        title="User Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>Username:</strong> {selectedUser.username || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
            <p><strong>Role:</strong> {selectedUser.role || 'USER'}</p>
            <p><strong>Balance:</strong> ${(selectedUser.balance || 0).toFixed(2)}</p>
            <p><strong>Created At:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
            <h4>Portfolio Holdings:</h4>
            {selectedUser.portfolio && selectedUser.portfolio.length > 0 ? (
              <ul>
                {selectedUser.portfolio.map((holding) => (
                  <li key={holding.companyId}>
                    {holding.companyName || 'Unknown Company'}: {holding.shares || 0} shares
                  </li>
                ))}
              </ul>
            ) : (
              <p>No holdings</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users; 