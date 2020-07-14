import React, { Component } from 'react';
import { Input, Form, Button, Radio, Select, message } from 'antd';
import { connect } from 'dva';
// import { callbackify } from 'util';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14, offset: 1 },
};
const formItemLayout1 = {
  wrapperCol: { span: 18, offset: 7 },
};

@Form.create({
  mapPropsToFields(props) {
    const { formData } = props;
    const { userTel, orderNumber, productId, productComboId, remark } = formData
    return {
      userTel: Form.createFormField({
        value: userTel || ''
      }),
      orderNumber: Form.createFormField({
        value: orderNumber || ''
      }),
      productId: Form.createFormField({
        value: productId || ''
      }),
      productComboId: Form.createFormField({
        value: productComboId || ''
      }),
      remark: Form.createFormField({
        value: remark || ''
      }),
    }
  }
})

@connect(({ robotDeploy }) => ({ robotDeploy }))

class NewForm extends Component {

  render() {
    const { props } = this;
    const { form, productList, setMealList, dispatch, userInfo, formData } = props;
    const { getFieldDecorator, getFieldValue, resetFields } = props.form;
    const handleSubmit = e => {

      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'robotDeploy/handleSubmit',
            payload: {
              values,
              form
            }
          })
        }
      });
    };

    const isPhone = (rule, value, callback) => {

      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value && !myreg.test(value) && typeof value !== 'number') {
        callback('请输入正确的手机号码');
      }

      dispatch({
        type: 'updateStatus',
        payload: {
          formData: Object.assign(formData, { userTel: getFieldValue('userTel') })
        }
      })
      callback();
    };

    const byTelAndIdFindUserTimeList = () => {

      const userTel = getFieldValue('userTel')
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

      if (!userTel) {
        message.warning('手机号码不能为空！');
        return;
      }

      if (!myreg.test(userTel)) {
        message.warning('请输入正确的手机号码！');
        return;
      }

      dispatch({ type: 'robotDeploy/byTelAndIdFindUserTimeList', payload: userTel })
    }

    const handleProductChange = (e) => {

      resetFields('productComboId');

      const newFormData = {
        userTel: getFieldValue('userTel'),
        orderNumber: getFieldValue('orderNumber'),
        productId: e.target.value,
        productComboId: getFieldValue('productComboId'),
        remark: getFieldValue('remark'),
      }

      dispatch({
        type: 'robotDeploy/getSetMealList', payload: {
          formData: newFormData,
        }
      })
    }

    return (
      <Form onSubmit={handleSubmit}>
        <FormItem {...formItemLayout} label="手机号">
          {getFieldDecorator('userTel', {
            rules: [
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                validator: isPhone,
              }
            ],
          })(<Input style={{ width: 'calc( 100% - 84px)' }} placeholder="请输入手机号" />)}
          <Button
            style={{ marginLeft: '20px' }}
            onClick={byTelAndIdFindUserTimeList}
            type="primary"
          >
            查找
          </Button>
        </FormItem>
        <FormItem {...formItemLayout} label="订单号">
          {getFieldDecorator('orderNumber', {
            rules: [
              {
                required: true,
                message: '请输入订单号.',
              },
            ],
          })(<Input placeholder="请输入订单号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="选择产品">
          {getFieldDecorator('productId', {
            rules: [
              {
                required: true,
                message: '请选择产品.',
              },
            ],
          })(
            <Radio.Group style={{ width: '100%' }} onChange={handleProductChange}>
              {
                Array.isArray(productList) && productList.length !== 0
                  ?
                  productList.map(item => {
                    return <Radio value={item.id} key={item.id}>{item.name}</Radio>
                  })
                  :
                  <Radio value="没有可选产品" disabled>没有可选产品</Radio>
              }
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="选择套餐">
          {getFieldDecorator('productComboId', {
            rules: [
              {
                required: true,
                message: '请输入选择套餐.',
              },
            ],
          })(
            <Select>
              {
                Array.isArray(setMealList) && setMealList.length !== 0
                  ?
                  setMealList.map(item => {
                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                  })
                  :
                  <Option value="没有可选套餐" disabled>没有可选套餐</Option>
              }
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark', {
          })(<TextArea rows={4} placeholder='请输入备注' />)}
        </FormItem>
        <FormItem {...formItemLayout1}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              typeof userInfo === 'object' && !Reflect.has(userInfo, 'id')
            }
          >
            部署
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default NewForm;
