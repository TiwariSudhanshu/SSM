import React, { useState, useEffect } from 'react';
import { Card, Button, message, Space, Typography, Modal, Form, InputNumber } from 'antd';
import api from '../../services/api';

const { Title } = Typography;

const Rounds = () => {
  const [currentRound, setCurrentRound] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCurrentRound = async () => {
    try {
      const response = await api.get('/admin/rounds/current');
      setCurrentRound(response.data);
    } catch (error) {
      console.error('Error fetching current round:', error);
    }
  };

  useEffect(() => {
    fetchCurrentRound();
  }, []);

  const handleStartRound = async (values) => {
    try {
      await api.post('/admin/rounds/start', values);
      message.success('Round started successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchCurrentRound();
    } catch (error) {
      message.error('Failed to start round');
    }
  };

  const handleEndRound = async () => {
    try {
      await api.post('/admin/rounds/end');
      message.success('Round ended successfully');
      fetchCurrentRound();
    } catch (error) {
      message.error('Failed to end round');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Round Management</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>Current Round Status</Title>
        {currentRound ? (
          <div>
            <p><strong>Round Number:</strong> {currentRound.roundNumber}</p>
            <p><strong>Status:</strong> {currentRound.isActive ? 'Active' : 'Ended'}</p>
            <p><strong>Start Time:</strong> {new Date(currentRound.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(currentRound.endTime).toLocaleString()}</p>
            {currentRound.isActive && (
              <Button type="primary" danger onClick={handleEndRound}>
                End Round
              </Button>
            )}
          </div>
        ) : (
          <div>
            <p>No active round</p>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Start New Round
            </Button>
          </div>
        )}
      </Card>

      <Modal
        title="Start New Round"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleStartRound} layout="vertical">
          <Form.Item
            name="duration"
            label="Round Duration (minutes)"
            rules={[{ required: true, message: 'Please enter round duration' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Start Round
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Rounds; 