import React, { Component } from 'react'
import { Form, Input, Button, Select, Radio, Row, InputNumber, message } from 'antd';
import { connect } from 'dva';
import styles from './CreateActivateCodeForm.less'

const { TextArea } = Input;
const { Option } = Select;


@connect(({ activateCode }) => ({ activateCode }))


class CreateActivateCodeForm extends Component {
  handleSubmit = () => {
    // e.preventDefault();
    const { form, dispatch, next } = this.props
    form.validateFields((err, values) => {
      if (!err) {

        if (!values.time && values.timeType === 'custom') {
          message.error('请输入天数')
          return
        }

        if (!values.productComboId && values.timeType === 'setMeal') {
          message.error('请选择套餐')
          return
        }

        dispatch({
          type: 'activateCode/handleActiveCodeSuBmit',
          payload: {
            values,
            form
          }
        })
        next()
      }
    });
  };


  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const formItemLayout1 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const { form, handleCancel, activateCode, dispatch, formData } = this.props
    const { productList, setMealList } = activateCode
    const { getFieldDecorator, getFieldValue } = form;
    const { number='', productId='', productComboId='', prefix='', remark='', timeType='', time='' } = formData

    const handleProductChange = (e) => {

      dispatch({
        type: 'activateCode/getSetMealList', payload: e
      })
    }

    const validate = (initialValue, required, msg) => {
      const rule = {
        rules: [{ required, message: msg }],
      }
      if (initialValue) {
        Object.assign(rule, { initialValue })
      }

      return rule
    }


    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout} className='active_code_form'>
        <Form.Item label='生成数量' className='create_active_code'>
          {getFieldDecorator('number', {
            initialValue: number || '',
            rules: [{ required: true, message: '请输入数量' }],
          })(
            <InputNumber min={1} placeholder="请输入数量" style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item label='产品'>
          {getFieldDecorator('productId', validate(productId, true, '请选择产品'))(
            <Select onChange={(e) => handleProductChange(e)} placeholder='请选择产品'>
              {
                productList.map(item => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))
              }
            </Select>
          )}
        </Form.Item>
        <Form.Item label='时长'>
          {getFieldDecorator('timeType', {
            initialValue: timeType || '',
            rules: [{ required: true, message: '请选择时长类型' }],
          })(
            <Radio.Group className={styles.radio_group}>
              <Radio value='setMeal' className={styles.radio} style={{ paddingBottom: '15px' }}>
                <Form.Item
                  label='使用套餐'
                  {...formItemLayout1}
                  className={styles.form_item_set_meal}
                >
                  {getFieldDecorator('productComboId', validate(productComboId, false, '请选择'))(
                    <Select disabled={getFieldValue('timeType') !== 'setMeal'} placeholder='请选择' style={{ width: '150px', marginLeft: '10px' }}>
                      {
                        setMealList.map(item => (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </Form.Item>
              </Radio>
              <Radio value='custom' className={styles.radio}>
                <Form.Item
                  label='自定义套餐'
                  {...formItemLayout1}
                  className={styles.form_item_set_meal}
                >
                  {getFieldDecorator('time', {
                    initialValue: time || '',
                  })(
                    <Input
                      placeholder="请输入天数"
                      disabled={getFieldValue('timeType') !== 'custom'}
                      style={{ width: '150px', marginLeft: '10px' }}
                    />
                  )}
                </Form.Item>
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label='前缀'>
          {getFieldDecorator('prefix', {
            initialValue: prefix || '',
          })(
            <Input placeholder="请输入前缀" />
          )}
          <div style={{ fontSize: '12px', textAlign: 'left', height: '16px' }}>可以输入 大小写英文 或 数字</div>
        </Form.Item>

        <Form.Item label='备注'>
          {getFieldDecorator('remark', {
            initialValue: remark || '',
          })(
            <TextArea
              placeholder="请输入备注"
              rows={4}
              maxLength="120"
            />
          )}
          <div style={{ fontSize: '12px', textAlign: 'left', height: '16px' }}>最长120个字符</div>
        </Form.Item>

        <Row
          type='flex'
          justify='end'
          align='middle'
          style={{ borderTop: '1px solid #e9e9e9', margin: '0 -24px', paddingTop: '24px' }}
        >
          <Button onClick={() => handleCancel()}>
            取消
          </Button>
          <Button type="primary" style={{ margin: '0 15px' }} onClick={() => { this.handleSubmit() }}>
            下一步
          </Button>
        </Row>
      </Form>
    )
  }
}

export default CreateActivateCodeForm;