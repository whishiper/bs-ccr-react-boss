import React, { Component } from 'react';
import { Input, Form, Row, Col, Button } from 'antd';
import styles from './SearchForm.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

@Form.create()
class SearchForm extends Component {
  render() {
    const { props } = this;
    const { form, handleSearch } = props;
    const { getFieldDecorator, validateFields } = form;

    const onSubmit = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          handleSearch({
            values,
            form
          })
        }
      });
    };

    return (
      <Form onSubmit={onSubmit} className={styles.search_form}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={9}>
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
              {getFieldDecorator('userName', {
                rules: [
                  {
                    message: '请输入用户名.',
                  },
                ],
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem
              {...formItemLayout}
              label="手机号"
            >
              {getFieldDecorator('phone', {
                rules: [
                  {
                    message: '请输入手机号码.',
                  }],
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
          </Col>
          <Col className={styles.but}>
            <Button htmlType="submit">查找</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
