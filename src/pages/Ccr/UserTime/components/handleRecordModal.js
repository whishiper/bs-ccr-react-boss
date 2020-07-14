import React from 'react';
import { Modal, Spin, Table } from 'antd';
import moment from 'moment';

const handleRecordModal = ({
  visible,
  loading,
  dataSource,
  pagination,
  handleCancel
}) => {
  const columns = [{
    align: 'center',
    title: '操作时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => moment(text).format('YYYY-MM-HH hh:mm:ss')
  }, {
    align: 'center',
    title: '变更时长',
    dataIndex: 'number',
    key: 'number'
  },
  {
    align: 'center',
    title: '事由',
    dataIndex: 'reasonName',
    key: 'reasonName'
  },
  {
    align: 'center',
    title: '订单号',
    dataIndex: 'orderNumber',
    key: 'orderNumber'
  }, {
    align: 'center',
    title: '操作帐号',
    dataIndex: 'adminAccount',
    key: 'adminAccount'
  }, {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },];
  return (
    <Modal
      title="操作记录"
      width='80%'
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Spin spinning={loading}>

        <Table columns={columns} dataSource={dataSource} pagination={pagination} />
      </Spin>
    </Modal>
  );
}

export default handleRecordModal;
