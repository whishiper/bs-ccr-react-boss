import React, { Component } from 'react';
import { Input, Form, Button, Select } from 'antd';
import styles from './searchForm.less'

const FormItem = Form.Item;
const { Option } = Select;


const formItemLayout = {
  labelCol: null,
  wrapperCol: null
};

@Form.create()
class SearchForm extends Component {
  render() {
    const { props } = this;
    const { form, handleSearch } = props;
    const { getFieldDecorator, validateFields } = form;

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


    return (
      <Form
        onSubmit={onSubmit}
        layout='inline'
        className={styles.search_form}
      >
        <FormItem
          {...formItemLayout}
          label="激活码"
          className={styles.search_form_item}
        >
          {getFieldDecorator('cdKey', {
            rules: [
              {
                message: '请输入激活码！',
              }
            ],
          })(<Input placeholder="请输入激活码" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="激活用户"
          className={styles.search_form_item}
        >
          {getFieldDecorator('username', {
            rules: [
              {
                validator: isPhone,
              }],
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
          className={styles.search_form_item}
        >
          {getFieldDecorator('isUsed')(
            <Select placeholder='请选择'>
              <Option value=''>不限</Option>
              <Option value={1}>未激活</Option>
              <Option value={0}>已激活</Option>
            </Select>
          )}
        </FormItem>
        <span className={styles.search_form_item_but}>
          <Button type='primary' htmlType="submit">查找</Button>
          <Button style={{ marginLeft: '20px' }}>重置</Button>
        </span>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
