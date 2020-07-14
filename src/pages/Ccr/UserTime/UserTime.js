import React, { Component } from 'react';
import { Row, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import AddTimeModal from './components/AddTimeModal';
import HandleRecordModal from './components/handleRecordModal';
import SearchForm from '../components/SearchForm';
import NewTable from '../components/NewTable';
import InfoModal from './components/InfoModal';
import styles from './UserTime.less';

// @Form.create()
@connect(({ userTime }) => ({ userTime }))

class UserTime extends Component {

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({ type: 'userTime/start' })
  }

  render() {
    const { dispatch, userTime } = this.props;
    const {
      loading,
      recordLoading,
      page,
      total,
      dataSource,
      addTimeVisible,
      recordVisible,
      handleRecordList,
      handleRecordTotal,
      handleRecordPage,
      handleRecordPageSize,
      infoModalVisible,
      addTimeInfo,
      dataItem,
      causeList,
      searchForm
    } = userTime;

    const addTimeModalShow = (item) => {

      dispatch({
        type: 'userTime/addTimeModalShow',
        payload: item,
      });
    };

    const handleRecordModalShow = (item) => {

      dispatch({
        type: 'userTime/handleRecordModalShow',
        payload: item,
      })
    }

    const columns = [{
      align: 'center',
      title: '产品',
      dataIndex: 'productName',
      key: 'productName'
    },{
      align: 'center',
      title: '机器人编号',
      dataIndex: 'id',
      key: 'id'
    },  {
      align: 'center',
      title: '套餐',
      dataIndex: 'productComboName',
      key: 'productComboName'
    }, {
      align: 'center',
      title: '部署时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => moment(text).format('YYYY-MM-HH hh:mm:ss')
    }, {
      align: 'center',
      title: '剩余时长（天）',
      dataIndex: 'remainTime',
      key: 'remainTime',

    }, {
      align: 'center',
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (text, record) => (
        <Row type="flex" justify="space-around" align="middle">
          <a onClick={() => { addTimeModalShow(record) }}>增补时长</a>
          <a onClick={() => { handleRecordModalShow(record) }}>操作记录</a>
        </Row>
      )
    }];

    const handleRecordOpagination = {
      defaultCurrent: 1,
      pageSize: Number(handleRecordPageSize),
      current: Number(handleRecordPage),
      total: Number(handleRecordTotal),
      onChange: (_page) => {
        dispatch({
          type: 'userTime/handleRecordOpagination',
          payload: _page
        })
      },
    }

    const oPaginationChangee = (_page) => {

      dispatch({
        type: 'userTime/oPaginationChange',
        payload: _page
      })
    }

    const handleSearch = (payload) => {

      dispatch({
        type: 'userTime/handleSearch',
        payload
      })
    }

    const handleAddTimeModalOk = value => {

      dispatch({
        type: 'userTime/handleAddTimeModalOk',
        payload: value,
      });
    };

    const handleAddTimeCancel = (value) => {

      dispatch({
        type: 'userTime/handleAddTimeCancel',
        payload: value
      });
    };

    const handleRecordCancel = () => {

      dispatch({
        type: 'userTime/updateStatus',
        payload: { recordVisible: false },
      })
    }

    const handleInfoModalOk = () => {
      dispatch({ type: 'userTime/handleInfoModalOk' })
    }

    const handleInfoModalCancel = () => {
      dispatch({ type: 'userTime/handleInfoModalCancel' })
    }

    return (
      <div>
        <Spin spinning={loading}>
          <div className={styles.header}>
            <Row type="flex" justify="center" align="middle" className={styles.title}>用户时长管理</Row>
            <SearchForm 
              handleSearch={handleSearch}
            />
          </div>
          <div className={styles.main}>
            <div
              className={styles.no_content}
              style={{ display: dataSource.length === 0 ? 'block' : 'none' }}
            >
              查询不到该手机号
            </div>
            <div className={styles.content} style={{ display: dataSource.length !== 0 ? 'block' : 'none' }}>
              <div className={styles.handleRecord}>
                <h4>机器人信息</h4>
                <NewTable
                  columns={columns}
                  dataSource={dataSource}
                  oPaginationChange={oPaginationChangee}
                  pageNum={page}
                  total={total}
                />
              </div>
            </div>
          </div>
          <AddTimeModal
            dataItem={dataItem}
            addTimeVisible={addTimeVisible}
            handleOk={handleAddTimeModalOk}
            handleCancel={handleAddTimeCancel}
            causeList={causeList}
          />
          <HandleRecordModal
            loading={recordLoading}
            visible={recordVisible}
            dataSource={handleRecordList}
            pagination={handleRecordOpagination}
            handleCancel={handleRecordCancel}
          />
          <InfoModal
            visible={infoModalVisible}
            formData={addTimeInfo}
            handleOk={handleInfoModalOk}
            handleCancel={handleInfoModalCancel}
          />
        </Spin>
      </div>
    );
  }
}

export default UserTime;
