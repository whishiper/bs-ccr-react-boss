import React from 'react'
import { Row, Button, Col } from 'antd';

export default function CreateActivateCodeInfo({ next, prev, createActiveCodeInfo, dispatch }) {
  const {
    number,
    productName,
    time,
    setMealType,
    prefix,
    remark
  } = createActiveCodeInfo

  const new_next = () => {
    dispatch({
      type:'activateCode/createActiveCode',
      payload: {
        next
      }
    })
  }
  return (
    <>
      <Row style={{ margin: '10px 0' }}>
        <Col span={12} style={{ textAlign: 'right' }}>生成数量：</Col>
        <Col span={12} style={{ textAlign: 'left' }}>{number}个</Col>
      </Row>
      <Row style={{ margin: '10px 0' }}>
        <Col span={12} style={{ textAlign: 'right' }}>产品：</Col>
        <Col span={12} style={{ textAlign: 'left' }}>{productName}</Col>
      </Row>
      <Row style={{ margin: '10px 0' }}>
        <Col span={12} style={{ textAlign: 'right' }}>套餐：</Col>
        <Col span={12} style={{ textAlign: 'left' }}>{setMealType || '自定义'}</Col>
      </Row>
      <Row style={{ margin: '10px 0' }}>
        <Col span={12} style={{ textAlign: 'right' }}>时长：</Col>
        <Col span={12} style={{ textAlign: 'left' }}>{time}天</Col>
      </Row>
      <Row style={{ margin: '10px 0' }}>
        <Col span={12} style={{ textAlign: 'right' }}>前缀：</Col>
        <Col span={12} style={{ textAlign: 'left' }}>{prefix || '无'}</Col>
      </Row>
      <Row style={{ margin: '10px 0' }}>
        <Col span={12} style={{ textAlign: 'right' }}>备注：</Col>
        <Col span={12} style={{ textAlign: 'left' }}>{remark || '无'}</Col>
      </Row>
      <Row
        type='flex'
        justify='end'
        align='middle'
        style={{ borderTop: '1px solid #e9e9e9', margin: '0 -24px', paddingTop: '24px' }}
      >
        <Button onClick={() => prev()}>
          上一步
        </Button>
        <Button type="primary" onClick={() => new_next()} style={{ margin: '0 15px' }}>
          下一步
        </Button>
      </Row>
    </>
  )
}
