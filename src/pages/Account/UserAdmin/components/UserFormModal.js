import React, { Component } from 'react'
import { Form, Input, Modal, Spin } from 'antd';

@Form.create({
  mapPropsToFields(props) {
    const { formData: { username, tel, password } } = props;

    return {
      username: Form.createFormField({
        value: username
      }),
      tel: Form.createFormField({
        value: tel
      }),
      password: Form.createFormField({
        value: password
      }),
    };
  }
})

class UserFormModal extends Component {

  render() {
    const { form, visible, handleOk, handleCancel, formType, formData, formLoading } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const handleSubmit = e => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          const { id, isBinding } = formData
          if (id) {
            Object.assign(values, { id, isBinding })
          }
          handleOk({ values, form })
        }
      });
    }

    return (
      <Modal
        title={formType === 'add' ? '添加用户' : '编辑用户'}
        visible={visible}
        onOk={(e) => { handleSubmit(e) }}
        onCancel={() => handleCancel({ form })}
      >
        <Spin spinning={formLoading} delay={500}>
          <Form {...formItemLayout}>
            <Form.Item label='用户名'>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input placeholder="请输入用户名" disabled={formType !== 'add'} />
              )}
            </Form.Item>
            <Form.Item label='手机号' help={formType !== 'add' ? '不修改，请勿修改' : ''}>
              {getFieldDecorator('tel', {
                rules: [{ required: true, message: '请输入手机号!' }],
              })(
                <Input placeholder="请输入手机号" />
              )}
            </Form.Item>
            <Form.Item label='密码' help={formType !== 'add' ? '不修改，请勿修改' : ''}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input placeholder="请输入密码" />
              )}
            </Form.Item>
          </Form>
        </Spin>

      </Modal>
    )
  }
}


export default UserFormModal