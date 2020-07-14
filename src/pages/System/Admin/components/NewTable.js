import React from 'react';
import { Table } from 'antd';

const NewTable = ({ columns, dataSource, pagination }) => {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
    />
  );
}

export default NewTable;
