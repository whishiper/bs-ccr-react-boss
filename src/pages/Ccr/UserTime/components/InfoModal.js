import React from 'react';
import { Modal, Row, Col } from 'antd';
import styles from './InfoModal.less';

const InfoModal = ({
  formData,
  visible,
  handleOk,
  handleCancel
}) => {
  const { tel, number, id, cause, orderNumber, remark } = formData
  return (
    <Modal
      title="变更确认"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认"
    >
      <div className={styles.info_change_main}>
        <h4 className={styles.info_change_title}>请核对以下信息</h4>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>用户手机：</Col>
          <Col span={12}>{tel || '----'}</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>机器人编号：</Col>
          <Col span={12}>{id || '----'}</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>增补时长：</Col>
          <Col span={12}><span>{number || '----'}</span>天</Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className={styles.info_change_row}
        >
          <Col span={12} className={styles.info_change_row_name}>增补事由：</Col>
          <Col span={12}>{cause || '----'}</Col>
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
          <Col span={12} className={styles.info_change_row_name}>备注：</Col>
          <Col span={12}>{remark || '----'}</Col>
        </Row>

      </div>
    </Modal>
  );
}

export default InfoModal;
