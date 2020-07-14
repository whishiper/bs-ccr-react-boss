import React, { Component } from 'react';
import router from 'umi/router';
import { PageHeader, Spin } from 'antd';
import { connect } from 'dva';
import styles from './EditProduct.less';
import ProductForm from './components/ProductForm';

@connect(({ product }) => ({ product }))

class EditProduct extends Component {

  componentDidMount() {

    const { dispatch, match } = this.props;
    
    dispatch({
      type: 'product/getProductInfo', payload: {
        id: match.params.id
      }
    })
  }

  render() {
    const { product } = this.props;
    const { formData, logoUploadUrl, editLoading } = product;

    return (
      <div className={styles.add_product}>
        <PageHeader
          className={styles.header}
          backIcon={<div>返回</div>}
          onBack={() => router.goBack()}
          title='编辑产品'
        />
        <Spin spinning={editLoading}>

          <ProductForm
            formData={formData}
            logoUploadUrl={logoUploadUrl}
          />
        </Spin>
      </div>
    );
  }
}

export default EditProduct; 
