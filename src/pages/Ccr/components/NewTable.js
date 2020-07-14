import React from 'react';
import { Table,Row,Pagination } from 'antd';

const NewTable = ({ columns, dataSource, pageNum,total,oPaginationChange }) => {
  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Row type='flex' justify='end' align='middle' style={{ padding: '25px 0' }}>
        <Pagination current={pageNum} onChange={(e) => oPaginationChange(e)} total={total} />
      </Row>
    </>
  );
}

export default NewTable;
