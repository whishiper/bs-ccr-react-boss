import React, { Component } from 'react';
import router from 'umi/router';
import { Input, Form, Button } from 'antd';
import { connect } from 'dva';
import styles from './AdminForm.less';

const FormItem = Form.Item;
const { Password } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 4 },
    xl: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 15, offset: 1 },
    xl: { span: 15, offset: 1 }
  }
};

@Form.create({
  mapPropsToFields(props) {
    const { formData } = props;
    const {
      password,
      account,
    } = formData;
    return {
      account: Form.createFormField({
        value: account
      }),
      password: Form.createFormField({
        value: password
      }),
    };
  }
})

@connect(({ admin }) => ({ admin }))

class AdminForm extends Component {
  render() {
    const { props } = this;
    const { form, dispatch } = props;
    // const {  } = admin;
    const { getFieldDecorator } = props.form;

    const handleSubmit = e => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          dispatch({ type: 'admin/handleSubmit', payload: { values, form } })
        }
      });
    };
    const onBack = () => {
      router.goBack()
    }

    return (
      <Form onSubmit={handleSubmit} className={styles.form}>
        <FormItem className={styles.form_item} {...formItemLayout} label="用户名">
          {getFieldDecorator('account', {
            rules: [
              {
                required: true,
                message: '请输入用户名.',
              },
            ],
          })(<Input placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem className={styles.form_item} {...formItemLayout} label="密码">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码.',
              },
            ],
          })(<Password placeholder="请输入密码" />)}
        </FormItem>
        <FormItem className={styles.but}>
          <Button style={{ marginRight: '10px' }} onClick={() => onBack()}>取消</Button>
          <Button style={{ marginLeft: '10px' }} type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }
}

export default AdminForm;
