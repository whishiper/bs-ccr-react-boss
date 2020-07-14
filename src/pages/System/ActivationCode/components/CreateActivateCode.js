/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import { Modal, Steps, Form } from 'antd';
import { connect } from 'dva';
import CreateActivateCodeForm from './CreateActivateCodeForm'
import CreateActivateCodeInfo from './CreateActivateCodeInfo'
import CreateActivateCodeFinish from './CreateActivateCodeFinish'
import styles from './createActivateCode.less'

const { Step } = Steps;

@Form.create()
@connect(({ activateCode }) => ({ activateCode }))

class CreateActivateCode extends Component {
  render() {
    const {
      visible,
      handleOk,
      formData,
      createActiveCodeInfo,
      codeUrl,
      stepCurrent,
      dispatch,
      form } = this.props

    const handleCancel = () => {
      form.resetFields()
      dispatch({
        type: 'activateCode/updateStatus',
        payload: {
          activateCodeVisible: false,
          formData: {
            number: '',
            productId: '',
            productComboId: '',
            prefix: '',
            remark: '',
            timeType: '',
            time: ''
          }
        }
      })
    }

    const next = () => {
      dispatch({
        type: 'activateCode/updateStatus',
        payload: {
          stepCurrent: stepCurrent + 1
        }
      })
    }

    const prev = () => {
      dispatch({
        type: 'activateCode/updateStatus',
        payload: {
          stepCurrent: stepCurrent - 1
        }
      });
    }

    const steps = [
      {
        title: '参数设置',
        content: [
          <CreateActivateCodeForm
            form={form}
            formData={formData}
            handleCancel={() => handleCancel()}
            next={() => next()}
          />
        ],
      },
      {
        title: '核对信息',
        content: [
          <CreateActivateCodeInfo
            next={() => next()}
            prev={() => prev()}
            dispatch={dispatch}
            createActiveCodeInfo={createActiveCodeInfo}
          />
        ],
      },
      {
        title: '完成',
        content: [<CreateActivateCodeFinish codeUrl={codeUrl} />],
      },
    ];
    return (
      <Modal
        title='生成激活码'
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Steps current={stepCurrent}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className={styles.steps_content}>
          {steps[stepCurrent].content.map((item, index) => (
            <span key={index.toString()}>{item}</span>
          ))}
        </div>

      </Modal>
    )
  }
}


export default CreateActivateCode