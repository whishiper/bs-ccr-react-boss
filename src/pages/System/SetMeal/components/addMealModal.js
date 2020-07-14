import React, { Component } from 'react';
import { Input, Form, Modal, Row, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14, offset: 1 },
};
@connect(({ setMeal }) => ({ setMeal }))

@Form.create({
  mapPropsToFields(props) {
    const { formData } = props;
    const { name, time, price, remark } = formData;
    return {
      name: Form.createFormField({
        value: name
      }),
      time: Form.createFormField({
        value: time
      }),
      price: Form.createFormField({
        value: price
      }),
      remark: Form.createFormField({
        value: remark
      })
    };
  }
})

class addMealModal extends Component {

  render() {
    const { props } = this;
    const { form, visible, handleOk, handleCancel, setMeal } = props;
    const { activeProduct } = setMeal;
    const { getFieldDecorator } = props.form;
    const newHandleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          handleOk({ values, form });
        }
      });
    };

    const newHandleCancel = () => {
      handleCancel({ form })
    }

    return (
      <Modal
        title="添加套餐"
        visible={visible}
        onOk={newHandleOk}
        onCancel={newHandleCancel}
        okText="提交"
      >
        <Form>
          <Row style={{ paddingBottom: '24px', borderBottom: '1px solid #e8e8e8', margin: '0 -24px 24px' }}>
            <Col span={5} style={{ textAlign: 'right' }}>产品名称：</Col>
            <Col span={14} offset={1}>{Reflect.has(activeProduct, 'name') ? activeProduct.name : ''}</Col>
          </Row>
          <FormItem {...formItemLayout} label="套餐名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入套餐名称.',
                },
              ],
            })(<Input placeholder="请输入套餐名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="套餐时长">
            {getFieldDecorator('time', {
              rules: [
                {
                  required: true,
                  message: '请输入套餐时长.',
                },
              ],
            })(<Input placeholder="请输入套餐时长" style={{ width: 'calc( 100% - 30px)' }} />)}
            <span style={{ paddingLeft: '10px' }}>天</span>
          </FormItem>
          <FormItem {...formItemLayout} label="套餐价格">
            {getFieldDecorator('price', {
              rules: [
                {
                  required: true,
                  message: '请输入套餐价格.',
                },
              ],
            })(<Input placeholder="请输入套餐价格" />)}
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

export default addMealModal;
