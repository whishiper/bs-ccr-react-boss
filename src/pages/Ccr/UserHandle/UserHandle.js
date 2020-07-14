import React, { Component } from 'react';
import { Row, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SearchForm from '../components/SearchForm';
import NewTable from '../components/NewTable';
import styles from './UserHandle.less';

// @Form.create()
@connect(({ userHandle }) => ({ userHandle }))

class UserHandle extends Component {

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({ type: 'userHandle/start' })
  }

  render() {
    const { userHandle, dispatch } = this.props;

    const {
      loading,
      pageNum,
      total,
      dataSource,
    } = userHandle;

    const columns = [{
      align: 'center',
      title: '机器人编号',
      dataIndex: 'userProductComboId',
      key: 'userProductComboId'
    }, {
      align: 'center',
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => moment(text).format('YYYY-MM-HH hh:mm:ss'),
    }, {
      align: 'center',
      title: '操作帐号',
      dataIndex: 'adminAccount',
      key: 'adminAccount'
    }, {
      align: 'center',
      title: '手机号',
      dataIndex: 'tel',
      key: 'tel'
    }, {
      align: 'center',
      title: '增补时长',
      dataIndex: 'number',
      key: 'remainTime'
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },];


    const oPaginationChangee = (_page) => {

      dispatch({
        type: 'userHandle/oPaginationChange',
        payload: _page
      })
    }

    const handleSearch = (payload) => {

      dispatch({
        type: 'userHandle/handleSearch',
        payload
      })
    }

    return (
      <div>
        <Spin spinning={loading}>
          <div className={styles.header}>
            <Row type="flex" justify="center" align="middle" className={styles.title}>增补时长记录</Row>
            <SearchForm handleSearch={handleSearch} />
          </div>
          <div className={styles.main}>
            <div
              className={styles.no_content}
              style={{ display: dataSource.length === 0 ? 'block' : 'none' }}
            >
              查询不到该手机号
            </div>
            <div style={{ display: dataSource.length !== 0 ? 'block' : 'none' }}>
              <NewTable
                columns={columns}
                dataSource={dataSource}
                oPaginationChange={oPaginationChangee}
                pageNum={pageNum}
                total={total}
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default UserHandle;
