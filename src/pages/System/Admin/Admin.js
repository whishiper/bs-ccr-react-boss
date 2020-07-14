import React, { Component } from 'react';
import { Row, Form, Button, Modal, Spin } from 'antd';
import { connect } from 'dva';

import NewTable from './components/NewTable';
import styles from './admin.less';

@Form.create()
@connect(({ admin }) => ({ admin }))
class Admin extends Component {

  componentDidMount() {

    const { dispatch } = this.props

    dispatch({ type: 'admin/getAdminList' })
  }

  render() {
    const { admin, dispatch } = this.props;
    const { pageSize, page, total, dataSource, loading } = admin;

    const oPaginationChange = {
      defaultCurrent: 1,
      pageSize,
      current: page,
      total,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: (_page) => {

        dispatch({
          type: 'admin/oPaginationChange',
          payload: _page
        })
      },
      onShowSizeChange: (current, size) => {

        dispatch({
          type: 'admin/onShowSizeChange',
          payload: {
            current,
            size,
          }
        })
      }
    }


    const confirm = (record) => {

      Modal.confirm({
        title: '删除管理员',
        content: `确认删除${record.account}`,
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk() {
          console.log(record)

          dispatch({
            type: 'admin/deleteAdmin',
            payload: record,
          })
        }
      });
    }

    const handleResetPassword = (record) => {

      Modal.confirm({
        title: '重置密码',
        content: `重置密码后，登录密码将初始化为888888@确认${record.account}的密码？`,
        okText: '重置',
        cancelText: '我再想想',
        icon: null,
        onOk() {

          dispatch({
            type: 'admin/reSetAdminPassword',
            payload: record,
          })
        }
      });
    }

    const addAdmin = () => {
      dispatch({ type: 'admin/addAdmin' })
    }

    const columns = [{
      align: 'center',
      title: '用户名',
      dataIndex: 'account',
      key: 'account'
    }, {
      align: 'center',
      title: '页面权限',
      dataIndex: 'page',
      key: 'page'
    }, {
      align: 'center',
      width: 200,
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (text, record) => (
        <Row type="flex" justify="space-around" align="middle">
          <a onClick={() => { handleResetPassword(record) }}>重置密码</a>
          {/*
           <Link to={`/system/addadmin/${record.key}`}>编辑权限</Link>
           */}
          <a onClick={() => { confirm(record) }}>删除</a>
        </Row>
      )
    }];


    return (
      <div>
        <Spin spinning={loading}>

          <Row type="flex" justify="center" align="middle" className={styles.title}>管理员管理</Row>
          <Row type="flex" justify="end" align="middle" className={styles.add_but}>
            <Button onClick={addAdmin}>添加管理员</Button>
          </Row>
          <NewTable
            columns={columns}
            dataSource={dataSource}
            pagination={oPaginationChange}
          />
        </Spin>
      </div>
    );
  }
}

export default Form.create()(Admin);
