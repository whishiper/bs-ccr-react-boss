import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import InfoModal from './components/InfoModal';
import NewForm from './components/NewForm';
import UserInfo from './components/UserInfo';
import styles from './RobotDeploy.less';

@connect(({ robotDeploy }) => ({ robotDeploy }))

class RobotDeploy extends Component {
  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({ type: 'robotDeploy/start' })
  }

  render() {
    const { props } = this;
    const { robotDeploy, dispatch } = props;

    const {
      infoModalVisible,
      userInfo,
      formData,
      findBut,
      productList,
      setMealList,
      userSetMealIsShow,
      productName,
      productComboTime
    } = robotDeploy;

    const infoModalOk = () => {
      dispatch({ type: 'robotDeploy/infoModalOk' });
    };

    const infoModalCancel = () => {
      dispatch({ type: 'robotDeploy/infoModalCancel' });
    };

    return (
      <div className={styles.wrapper}>
        <Row className={styles.title} type="flex" justify="center" align="middle">机器人部署</Row>
        <Row>
          <Col span={16}>
            <NewForm
              formData={formData}
              productList={productList}
              findBut={findBut}
              setMealList={setMealList}
              userInfo={userInfo}
            />
          </Col>
          <Col span={8} style={{ display: userSetMealIsShow ? 'block' : 'none' }}>
            <UserInfo />
          </Col>
        </Row>
        <InfoModal
          productComboTime={productComboTime}
          productName={productName}
          formData={formData}
          visible={infoModalVisible}
          handleOk={infoModalOk}
          handleCancel={infoModalCancel}
        />
      </div>
    );
  }
}

export default RobotDeploy; 
