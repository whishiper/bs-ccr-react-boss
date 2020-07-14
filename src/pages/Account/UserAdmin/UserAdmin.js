import React, { Component } from 'react'
import { connect } from 'dva';
import { Row, Button, Table, Modal, Badge, Spin, Pagination } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from './components/SearchForm'
import UserFormModal from './components/UserFormModal'

import styles from './UserAdmin.less'

@connect(({ userAdmin }) => ({ userAdmin }))


class UserAdmin extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({ type: 'userAdmin/userSearch' })
  }

  render() {
    const { dispatch, userAdmin } = this.props;
    const { formVisible, formType, userList, pageNum, total, formData, loading, formLoading } = userAdmin;

    const handleSearch = (value) => {
      dispatch({
        type: 'userAdmin/updateStatus', payload: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      })
      dispatch({
        type: 'userAdmin/userSearch', payload: value
      })
    }
    const handleTitle = (item) => {
      Modal.confirm({
        title: '封号',
        cancelText: '我再想想',
        okText: '确认',
        content: (
          <div>封号后，用户将不能正常登录<br />确认封号？</div>
        ),
        onOk() {
          dispatch({
            type: 'userAdmin/handleUserStatus', payload: {
              id: item.id,
              status: 0,
              type: 'close'
            }
          })
        },
      });
    }

    const handleUnseal = (item) => {
      Modal.confirm({
        title: '解封',
        cancelText: '我再想想',
        okText: '确认',
        content: (
          <div>解封后，用户将恢复正常登录<br />确认解封？</div>
        ),
        onOk() {
          dispatch({
            type: 'userAdmin/handleUserStatus', payload: {
              id: item.id,
              status: 1,
              type: 'remove'
            }
          })
        },
      });
    }

    const handleResetGoogle = (item) => {
      Modal.confirm({
        title: '重置谷歌',
        cancelText: '我再想想',
        okText: '确认',
        content: (
          <div>重置谷歌验证后，用户可以重新绑定谷歌验证，<br />如果已经核对过用户身份，请确认是否重置。</div>
        ),
        onOk() {
          dispatch({
            type: 'userAdmin/resetGoogleVerify', payload: {
              id: item.id,
              isBinding:0
            }
          })

        },
      });
    }

    const handleAddFormModalShow = () => {
      dispatch({
        type: 'userAdmin/handleAddFormModalShow'
      })
    }
    const handleFormModalOk = (e) => {
      dispatch({
        type: 'userAdmin/handleFormModalOk',
        payload: e
      })
    }

    const handleFormModalCancel = (value) => {
      dispatch({
        type: 'userAdmin/handleFormModalCancel', payload: value
      })
    }

    const handleEditFormModalShow = (value) => {
      dispatch({
        type: 'userAdmin/handleEditFormModalShow', payload: value
      })
    }

    const handleResetSearch = (value) => {
      dispatch({
        type: 'userAdmin/updateStatus', payload: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      })
      dispatch({
        type: 'userAdmin/handleResetSearch', payload: value
      })
    }
    const oPaginationChange = (_page) => {

      dispatch({
        type: 'userAdmin/handlePageChange', payload: _page
      })
    }

    const userAccountState = (value) => {
      if (Number(value) === 1) {
        return <span style={{ color: '#008B45' }}><Badge status="success" /> 正常</span>
      }
      return <span style={{ color: 'red' }}><Badge status="error" /> 封号</span>
    }

    const isBinding = (value) => {
      if (Number(value) === 1) {
        return <span style={{ color: '#008B45' }}><Badge status="success" /> 已绑定</span>
      }
      return <span style={{ color: 'red' }}><Badge status="error" /> 未绑定</span>
    }

    const columns = [
      {
        title: '手机号',
        dataIndex: 'tel',
        key: 'tel',
        align: 'center',
      },
      {
        title: '注册时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
      {
        title: '谷歌验证',
        dataIndex: 'isBinding',
        key: 'isBinding',
        align: 'center',
        render: (text) => isBinding(text)
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text) => userAccountState(text)
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        align: 'center',
        render: (_, record) => (
          <Row type='flex' justify='space-around' align='middle'>
            <a onClick={() => handleEditFormModalShow(record)}>编辑</a>
            <Button
              type='link'
              disabled={Number(record.isBinding) === 0}
              onClick={() => handleResetGoogle(record)}
            >
              重置谷歌
            </Button>
            <a
              style={{ display: Number(record.status) === 1 ? 'block' : 'none' }}
              onClick={() => handleTitle(record)}
            >
              封号
            </a>
            <a
              style={{ display: Number(record.status) === 0 ? 'block' : 'none' }}
              onClick={() => handleUnseal(record)}
            >
              解封
            </a>
          </Row>
        )
      },
    ];

    return (
      <>
        <PageHeaderWrapper title='用户管理'>
          <div className={styles.wrapper}>
            <SearchForm handleSearch={handleSearch} handleResetSearch={handleResetSearch} />
            <Row type='flex' justify='end' align='middle' style={{ margin: '10px 0 20px 0' }}>
              <Button type='primary' onClick={() => handleAddFormModalShow()}>添加用户</Button>
            </Row>
            <Spin spinning={loading} delay={500}>
              <Table columns={columns} dataSource={userList} pagination={false} />
              <Row type='flex' justify='end' align='middle' style={{ padding: '25px 0' }}>
                <Pagination current={pageNum} onChange={(e) => oPaginationChange(e)} total={total} />
              </Row>
            </Spin>
            <UserFormModal
              visible={formVisible}
              handleOk={handleFormModalOk}
              handleCancel={handleFormModalCancel}
              formType={formType}
              formData={formData}
              formLoading={formLoading}
            />
          </div>
        </PageHeaderWrapper>
      </>
    )
  }
}

export default UserAdmin