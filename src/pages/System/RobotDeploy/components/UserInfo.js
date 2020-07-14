import React, { Component } from 'react';
import { Row, Table } from 'antd';
import { connect } from 'dva';
import style from './UserInfo.less';

@connect(({ robotDeploy }) => ({ robotDeploy }))

class UserInfo extends Component {
  render() {
    const { props } = this;
    const { robotDeploy } = props;
    const { userSetMeal, formData } = robotDeploy;
    const columns = [
      {
        title: '产品',
        align: 'center',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '套餐',
        align: 'center',
        dataIndex: 'productComboName',
        key: 'productComboName',
      },
      {
        title: '剩余时长',
        align: 'center',
        dataIndex: 'remainTime',
        key: 'remainTime',
      },
    ];

    return (
      <div className={style.wrapper}>
        <h4 className={style.title}>用户信息</h4>
        <div className={style.main}>
          <Row className={style.user_phone}>手机号码：{formData.userTel}</Row>
          <Table dataSource={userSetMeal} columns={columns} pagination={{ hideOnSinglePage: true }} />
        </div>
      </div>
    )
  }
}

export default UserInfo;
