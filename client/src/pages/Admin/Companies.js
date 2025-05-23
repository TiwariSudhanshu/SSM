import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from 'antd';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [form] = Form.useForm();

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      message.error('Failed to fetch companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddEdit = (company = null) => {
    setEditingCompany(company);
    if (company) {
      form.setFieldsValue(company);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCompany) {
        await api.put(`/admin/companies/${editingCompany._id}`, values);
        message.success('Company updated successfully');
      } else {
        await api.post('/admin/companies', values);
        message.success('Company added successfully');
      }
      setIsModalVisible(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error submitting company:', error);
      message.error('Operation failed');
    }
  };

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
    },
    {
      title: 'Stock Price',
      dataIndex: 'stockPrice',
      key: 'stockPrice',
      render: (price) => `$${(price || 0).toFixed(2)}`,
    },
    {
      title: 'ESG Score',
      dataIndex: 'esgScore',
      key: 'esgScore',
      render: (score) => score || 0,
    },
    {
      title: 'Available Shares',
      dataIndex: 'availableShares',
      key: 'availableShares',
      render: (shares) => shares || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleAddEdit(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={() => handleAddEdit()}>
          Add New Company
        </Button>
      </div>

      <Table columns={columns} dataSource={companies} rowKey="_id" />

      <Modal
        title={editingCompany ? 'Edit Company' : 'Add New Company'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sector"
            label="Sector"
            rules={[{ required: true, message: 'Please enter sector' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="stockPrice"
            label="Stock Price"
            rules={[{ required: true, message: 'Please enter stock price' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="esgScore"
            label="ESG Score"
            rules={[
              { required: true, message: 'Please enter ESG score' },
              { type: 'number', min: 0, max: 100, message: 'ESG score must be between 0 and 100' }
            ]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="availableShares"
            label="Available Shares"
            rules={[{ required: true, message: 'Please enter available shares' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCompany ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Companies; 