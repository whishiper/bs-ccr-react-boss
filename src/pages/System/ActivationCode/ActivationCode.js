import React, { Component } from 'react'
import { connect } from 'dva';
import { Row, Col, Button, Table, Tooltip, Badge, Pagination } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from './components/SearchForm'
import CreateActivateCode from './components/CreateActivateCode'
import styles from './ActivationCode.less'

@connect(({ activateCode }) => ({ activateCode }))


class ActivationCode extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'activateCode/searchActiveCode'
    })

  }

  render() {
    const { activateCode, dispatch } = this.props;
    const {
      activateCodeVisible,
      codelist,
      formData,
      createActiveCodeInfo,
      codeUrl,
      stepCurrent,
      pageNum,
      total,
    } = activateCode

    const handleSearch = (value) => {
      dispatch({
        type: 'activateCode/handleSearch', payload: value
      })
    }
    const handleActivateCodeOk = () => {
      dispatch({
        type: 'activateCode/handleActivateCodeOk',
        payload: {
          activateCodeVisible: false
        }
      })
    }

    const handleActivateCodeShow = () => {

      dispatch({
        type: 'activateCode/handleActivateCodeShow',
        payload: {
          activateCodeVisible: true,
          stepCurrent: 0,
          formData: {}
        }
      })
      dispatch({
        type: 'activateCode/getProductOpenList'
      })
    }


    const columns = [
      {
        title: '激活码',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '生成时间',
        dataIndex: 'createAt',
        align: 'center',
        key: 'createAt',
        sorter: (a, b) => new Date(a.createAt) - new Date(b.createAt),
      },
      {
        title: '产品',
        dataIndex: 'productName',
        align: 'center',
        key: 'productName',
      },
      {
        title: '套餐',
        dataIndex: 'comboName',
        align: 'center',
        key: 'comboName',
      },
      {
        title: '时间（天）',
        dataIndex: 'time',
        align: 'center',
        key: 'time',
      },
      {
        title: '前缀',
        dataIndex: 'profix',
        align: 'center',
        key: 'profix',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        key: 'remark',
        render: (text) => (
          <Tooltip placement="bottom" title={text}>
            <span>{text}</span>
          </Tooltip>
        )
      },
      {
        title: '状态',
        dataIndex: 'isUsed',
        align: 'center',
        key: 'isUsed',
        render: (text) => (
          <span>
            {
              !Number(text)
                ?
                <span style={{ color: '#008B45' }}>
                  <Badge status="success" />
                  已激活
                  </span>
                :
                <span style={{ color: '#d9d9d9' }}>
                  < Badge status="default" />
                  未激活
                  </span>
            }

          </span>
        )
      },
      {
        title: '激活用户',
        align: 'center',
        dataIndex: 'username',
        key: 'username',
      },
    ];

    const oPaginationChange = (_page) => {
      dispatch({
        type: 'activateCode/oPaginationChange',
        payload: _page
      })
    }

    return (
      <>
        <PageHeaderWrapper title='激活码管理'>
          <div className={styles.wrapper}>
            <SearchForm handleSearch={handleSearch} />
            <Row type='flex' justify='space-between' align='middle' style={{ margin: '10px 0 20px 0' }}>
              <Col>共生成5000个激活码，已激活3000个，还剩200个</Col>
              <Button type='primary' onClick={() => { handleActivateCodeShow() }}>生成激活码</Button>
            </Row>
            <Table
              columns={columns}
              pagination={false}
              dataSource={codelist}
            />
            <Row type='flex' justify='end' align='middle' style={{ padding: '25px 0' }}>
              <Pagination current={pageNum} onChange={(e) => oPaginationChange(e)} total={total} />
            </Row>
            <CreateActivateCode
              stepCurrent={stepCurrent}
              codeUrl={codeUrl}
              dispatch={dispatch}
              formData={formData}
              createActiveCodeInfo={createActiveCodeInfo}
              visible={activateCodeVisible}
              handleOk={handleActivateCodeOk}
            />
          </div>
        </PageHeaderWrapper>
      </>
    )
  }
}

export default ActivationCode