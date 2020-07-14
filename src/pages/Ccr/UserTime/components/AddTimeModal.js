import React, { Component } from 'react';
import { Input, Form, Modal, Row, Col, Select, InputNumber } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 5 },
    xl: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 14, offset: 1 },
    xl: { span: 14, offset: 1 }
  }
};

@Form.create()

class addTimeModal extends Component {
  render() {
    const { props } = this;
    const { form, addTimeVisible, handleOk, handleCancel, dataItem, causeList } = props;
    const { id, tel, remainTime } = dataItem;
    const { getFieldDecorator } = props.form;

    const newHandleOk = () => {

      form.validateFields((err, values) => {
        if (!err) {
          handleOk({
            values,
            form,
          });
        }
      });
    };

    const newHandleCancel = () => {
      handleCancel({ form })
    }

    return (
      <Modal
        title="增补时长"
        visible={addTimeVisible}
        onOk={newHandleOk}
        onCancel={newHandleCancel}
        okText="确定"
      >
        <Row type="flex" align="middle" style={{ paddingBottom: '20px' }}>
          <Col span={5} style={{ textAlign: 'right' }}>手机号：</Col>
          <Col span={14} offset={1}>{tel || '---'}</Col>
        </Row>
        <Row type="flex" align="middle" style={{ paddingBottom: '20px' }}>
          <Col span={5} style={{ textAlign: 'right' }}>机器人编号：</Col>
          <Col span={14} offset={1}>{id || '---'}</Col>
        </Row>
        <Row type="flex" align="middle" style={{ paddingBottom: '20px' }}>
          <Col span={5} style={{ textAlign: 'right' }}>剩余天数：</Col>
          <Col span={14} offset={1}>
            <span style={{ color: 'red', paddingRight: '10px' }}>{remainTime || '---'}</span>天
          </Col>
        </Row>
        <Form>
          <FormItem {...formItemLayout} label="增补时长">
            {getFieldDecorator('number', {
              rules: [
                {
                  required: true,
                  message: '请输入天数',
                },
              ],
            })(<InputNumber placeholder="请输入天数" style={{ width: 'calc( 100% - 30px)' }} min={1} />)}
            <span style={{ paddingLeft: '10px' }}>天</span>
          </FormItem>
          <Form.Item label="事由" {...formItemLayout}>
            {getFieldDecorator('reasonId', {
              rules: [
                {
                  required: true,
                  message: '请选择事由.',
                },
              ],
            })(
              <Select
                placeholder="请选择事由"
              >
                {causeList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>,
            )}
          </Form.Item>
          <FormItem {...formItemLayout} label="订单号">
            {getFieldDecorator('orderNumber', {
            })(<Input placeholder="请输入订单号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
            })(<TextArea rows={4} placeholder='请输入备注' />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default addTimeModal;
