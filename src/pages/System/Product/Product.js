import React, { Component } from 'react';
import { Table, Modal, Row, Spin } from 'antd';
import { connect } from 'dva';
// import Link from 'umi/link';
import router from 'umi/router';
import { fixedZero } from '@/utils/utils';
import styles from './Product.less';

@connect(({ product }) => ({ product }))

class Product extends Component {

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'product/getProductList',
    })
  }

  render() {
    const { props } = this;
    const { product, dispatch } = props;
    const { productList, pageSize, total, page, loading } = product;

    const oPaginationChange = {
      defaultCurrent: 1,
      pageSize,
      current: page,
      total,
      onChange: _page => {

        dispatch({
          type: "product/oPaginationChange",
          payload: _page
        });
      },
    };

    const handleStop = (record) => {

      Modal.confirm({
        title: '停用套餐',
        content: '停用后将不能选择该套餐，确认停用一年套餐？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk() {
          dispatch({
            type: 'product/startAddCloseProduct',
            payload: {
              status: record.status,
              id: record.id,
            }
          })
        }
      });
    }

    const handleStart = (record) => {

      Modal.confirm({
        title: '启用产品',
        content: '确认启用一年套餐？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk() {
          dispatch({
            type: 'product/startAddCloseProduct',
            payload: {
              status: record.status,
              id: record.id,
            }
          })
        }
      });
    }

    const handleEdit = (record) => {
      router.push(`/system/edit_product/${record.key}`);
    }

    const columns = [{
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (<span>{fixedZero(text)}</span>)
    },
    {
      title: 'logo',
      align: 'center',
      width: 100,
      dataIndex: 'logo',
      key: 'logo',
      render: (text) => (
        <img
          src={`http://yun-img.bosenkeji.cn${text}`}
          alt='LOGO'
          style={{ width: '30px', height: '30px', borderRadius: '50%' }}
        />
      )
    },
    {
      title: '产品名称',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: (_text, record) => (
        
        <Row type="flex" justify="space-around" align="middle">
          <a
            onClick={() => { handleStop(record) }}
            style={{ display: Number(_text) === 1 ? 'block' : 'none' }}
          >
            停用
          </a>
          <a
            onClick={() => { handleStart(record) }}
            style={{ display: Number(_text) === 2 ? 'block' : 'none' }}
          >
            启用
          </a>
          <a
            onClick={() => { handleEdit(record) }}
          >
            编辑
          </a>
        </Row>
      )
    },
    ];

    return (
      <div className={styles.wrapper}>
        <Spin spinning={loading}>
          <Row className={styles.title} type="flex" justify="center" align="middle">产品管理</Row>
          <Table dataSource={productList} columns={columns} pagination={oPaginationChange} />
        </Spin>
      </div>
    );
  }
}

export default Product; 
