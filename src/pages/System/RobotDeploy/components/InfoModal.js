import React from 'react';
import { Modal, Row, Col } from 'antd';
import styles from './InfoModal.less';

const InfoModal = ({
  productName,
  productComboTime,
  formData,
  visible,
  handleOk,
  handleCancel
}) => {
  const { userTel, orderNumber, remark } = formData

  return (
    <Modal
      title="部署确认"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认"
    >
      <div className={styles.info_change_main}>
        <h4 className={styles.info_change_title}>机器人将被部署，请核对以下信息</h4>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>用户手机：</Col>
          <Col span={12}>{userTel || '----'}</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>订单号：</Col>
          <Col span={12}>{orderNumber || '----'}</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>部署版本：</Col>
          <Col span={12}>{productName || '----'}</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>授权套餐：</Col>
          <Col span={12}><span>{productComboTime || '----'}</span>天</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>备注：</Col>
          <Col span={12}>{remark || '----'}</Col>
        </Row>

      </div>
    </Modal>
  );
}

export default InfoModal;
