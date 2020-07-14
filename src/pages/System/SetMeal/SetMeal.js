import React, { Component } from 'react';
import { Row, Button, Modal, Tabs, Spin } from 'antd';
import { connect } from 'dva';
import NewTable from './components/NewTable';
import AddMealModal from './components/addMealModal';
import styles from './setMeal.less';

const { TabPane } = Tabs;

@connect(({ setMeal }) => ({ setMeal }))

class SetMeal extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'setMeal/getProductOpenList' })
  }

  render() {
    const { setMeal, dispatch } = this.props;
    const {
      loading,
      productList,
      activeProduct,
      pageSize,
      page,
      total,
      setMealList,
      visible,
      formData,
    } = setMeal;

    const oPaginationChange = {
      defaultCurrent: 1,
      pageSize,
      current: page,
      total,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: _page => {

        dispatch({
          type: 'setMeal/oPaginationChange',
          payload: _page,
        });
      },
      onShowSizeChange: (current, size) => {

        dispatch({
          type: 'setMeal/onShowSizeChange',
          payload: {
            current,
            size,
          },
        });
      },
    };

    const addOrEditMealMoadleShow = (value) => {
      dispatch({ type: 'setMeal/addOrEditMealMoadleShow', payload: value });
    };

    const addMealModalOk = value => {
      dispatch({ type: 'setMeal/addMealModalOk', payload: value });
    };

    const addMealModalCancel = value => {

      dispatch({
        type: 'setMeal/addMealModalCancel',
        payload: {
          value,
        },
      });
    };

    const onChangeProduct = key => {

      dispatch({
        type: 'setMeal/onChangeProduct',
        payload: key,
      });
    };

    const handleStop = record => {

      Modal.confirm({
        title: '停用套餐',
        content: '停用后将不能选择该套餐，确认停用一年套餐？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk() {
          dispatch({
            type: 'setMeal/startAddCloseSetMeal', payload: {
              id: record.key,
              status: record.status
            }
          })
        },
      });
    };

    const handleStart = record => {

      Modal.confirm({
        title: '启用产品',
        content: '确认启用一年套餐？',
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk() {
          dispatch({
            type: 'setMeal/startAddCloseSetMeal', payload: {
              id: record.key,
              status: record.status
            }
          })
        },
      });
    };

    const handleDelte = record => {

      Modal.confirm({
        title: '删除套餐',
        content: `确认删除${record.name}`,
        okText: '确认',
        cancelText: '我再想想',
        icon: null,
        onOk() {
          dispatch({ type: 'setMeal/deleteSetMeal', payload: record })
        },
      });
    };

    const columns = [
      {
        align: 'center',
        title: '套餐名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        align: 'center',
        title: '套餐时长',
        dataIndex: 'time',
        key: 'time',
        render: text => <span>{text}天</span>,
      },
      {
        align: 'center',
        title: '套餐价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        align: 'center',
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        align: 'center',
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render: (_text, record) => (
          <Row type="flex" justify="space-around" align="middle">
            <a>设置默认套餐</a>
            <Button type='danger' onClick={() => { handleStop(record) }} style={{ display: record.status === 1 ? 'block' : 'none' }}>停用</Button>
            <Button type="primary" onClick={() => { handleStart(record) }} style={{ display: record.status === 2 ? 'block' : 'none' }}>启用</Button>
            <a onClick={() => { addOrEditMealMoadleShow(record) }}>编辑</a>
            <Button type='danger' onClick={() => { handleDelte(record) }}>删除</Button>
          </Row>
        ),
      },
    ];

    const newTabPane = () => {
      return productList.map(item => {
        const newItem =
          <TabPane tab={item.name} key={`${item.id}`}>
            <Row type="flex" justify="end" align="middle" className={styles.add_but}>
              <Button onClick={() => { addOrEditMealMoadleShow() }}>添加套餐</Button>
            </Row>
            <NewTable columns={columns} dataSource={setMealList} pagination={oPaginationChange} />
          </TabPane>;
        return newItem;
      })
    }

    return (
      <div>
        <Spin spinning={loading}>
          <Row type="flex" justify="center" align="middle" className={styles.title}>
            套餐管理
          </Row>
          <Tabs activeKey={`${activeProduct.id}`} defaultActiveKey={`${activeProduct.id}`} onChange={onChangeProduct}>
            {newTabPane()}
          </Tabs>
          <AddMealModal
            visible={visible}
            handleOk={addMealModalOk}
            handleCancel={addMealModalCancel}
            formData={formData}
          />
        </Spin>
      </div>
    );
  }
}

export default SetMeal;
