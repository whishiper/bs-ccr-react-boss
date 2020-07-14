import React from 'react'
import { Result, Row, Col, Button } from 'antd';
import styles from './CreateActivateCodeFinish.less'

export default function CreateActivateCodeFinish({ codeUrl }) {
  return (
    <>
      <Result status="success" title="设置完成！" style={{ padding: '10px' }} />
      <Row type='flex' justify='center' align='middle'>
        <Col className={styles.download}>
          <div>激活码已生成</div>
          <div>
            <span>如果未提示下载，请点击</span>
            <Button type="link" href={codeUrl} target='_blank'>
              下载
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}
