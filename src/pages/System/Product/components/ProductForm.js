import React, { Component } from 'react';
import { Input, Form, Button, Icon, Upload, message } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './ProductForm.less';

import { api } from '@/utils/config';

const { upload } = api;

const FormItem = Form.Item;
const { TextArea } = Input;
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
    const { logo, name, remark } = formData;

    return {
      name: Form.createFormField({
        value: name
      }),
      logo: Form.createFormField({
        value: `http://bs-follow.oss-cn-shenzhen.aliyuncs.com/${logo}`
      }),
      remark: Form.createFormField({
        value: remark
      })
    };
  }
})

@connect(({ product }) => ({ product }))

class ProductForm extends Component {

  beforeUpload = file => {

    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };


  render() {
    const { props } = this;
    const { form, dispatch, formData, logoUploadUrl } = props;
    const { getFieldDecorator } = props.form;

    let newUploadStatus = '';

    const handleChange = info => {

      const fileOnItem = info.fileList[0]
      const { status, response } = fileOnItem;
      newUploadStatus = status === 'done' ? '' : 'uploading'
      if (status === 'done') {
        dispatch({
          type: 'product/upload', payload: {
            url: response.url,
          }
        })
      }

    };

    const handleSubmit = e => {

      e.preventDefault();
      form.validateFields((err, values) => {

        if (!err) {
          const newValues = {
            name: values.name,
            logo: typeof (values.logo) === 'string' ? values.logo : values.logo.file.response.url,
            remark: values.remark
          }
          console.log(newValues, 'newValues')
          dispatch({
            type: 'product/handleSubmit', payload: {
              values: newValues,
              form
            }
          })
        }
      });
    };

    const uploadButton = (
      <div style={{ padding: '20px', border: '1px solid #ddd' }}>
        <Icon
          type={newUploadStatus === 'uploading' ? 'loading' : 'plus'}
          style={{ fontSize: '35px' }}
        />
      </div>
    );

    return (
      <Form onSubmit={handleSubmit} className={styles.form}>
        <FormItem className={styles.form_item} {...formItemLayout} label="产品名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入产品名称.',
              },
            ],
          })(<Input placeholder="请输入产品名称" />)}
        </FormItem>
        <Form.Item {...formItemLayout} label="产品LOGO" className={styles.form_item}>
          {getFieldDecorator('logo', {
            rules: [
              {
                required: true,
                message: '请输上传产品LOGO',
              },
            ],
          })(
            <Upload action={upload} onPreview={this.beforeUpload} onChange={(e) => { handleChange(e) }}>
              {logoUploadUrl || formData.logo ? (
                <img
                  alt="logo"
                  style={{ width: '100px', height: '100px' }}
                  src={`http://bs-follow.oss-cn-shenzhen.aliyuncs.com${logoUploadUrl || formData.logo}`}
                />
              ) : (
                  uploadButton
                )}
            </Upload>
          )}
        </Form.Item>
        <FormItem className={styles.form_item} {...formItemLayout} label="备注">
          {getFieldDecorator('remark')(<TextArea rows={4} placeholder="请输入备注" />)}
        </FormItem>
        <FormItem className={styles.but}>
          <Button style={{ marginRight: '10px' }}>
            <Link to="/system/product">取消</Link>
          </Button>
          <Button style={{ marginLeft: '10px' }} type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default ProductForm;
