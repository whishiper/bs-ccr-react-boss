import React, { Component } from 'react';
import { Input, Form, Row, Col, Button } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    md: { span: 8 },
    lg: { span: 8 },
  },
  wrapperCol: {
    md: { span: 15, offset: 1 },
    lg: { span: 15, offset: 1 },
  }
};

@Form.create()
class SearchForm extends Component {
  render() {
    const { props } = this;
    const { form, handleSearch } = props;
    const { getFieldDecorator, validateFields,resetFields } = form;

    const isPhone = (rule, value, callback) => {

      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

      if (value && !myreg.test(value) && typeof value !== 'number') {
        callback('请输入正确的手机号码');
      }
      callback();
    };

    const onSubmit = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          handleSearch({ values, form })
        }
      });
    };

    const handleSearchReset=()=>{
      resetFields()
    }

    return (
      <Form onSubmit={onSubmit} layout='horizontal'>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={8}>
            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('userTel', {
                rules: [{ validator: isPhone }],
              })(<Input placeholder="请输入手机号码" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="机器人编号">
              {getFieldDecorator('userProductCombold')(<Input placeholder="请输入机器人编号" />)}
            </FormItem>
          </Col>
          <Col style={{ paddingBottom: '20px' }}>
            <Button type='primary' htmlType="submit">查找</Button>
            <Button style={{ marginLeft: '20px' }} onClick={()=>{handleSearchReset()}}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
