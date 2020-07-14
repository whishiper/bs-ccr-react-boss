import React, { Component } from 'react';
import router from 'umi/router';
import { PageHeader } from 'antd';
import { connect } from 'dva';
import styles from './AddAdmin.less';
import AdminForm from './components/AdminForm';

@connect(({ admin }) => ({ admin }))

class AddAdmin extends Component {

  render() {
    const { props } = this;
    const { admin } = props;
    const { formData, submitType } = admin;

    return (
      <div className={styles.add_admin}>
        <PageHeader
          className={styles.header}
          backIcon={<div>返回</div>}
          onBack={() => router.goBack()}
          title={submitType === 'add' ? "添加管理员" : '编辑管理员'}
        />
        <AdminForm
          formData={formData}
        />
      </div>
    );
  }
}

export default AddAdmin; 
