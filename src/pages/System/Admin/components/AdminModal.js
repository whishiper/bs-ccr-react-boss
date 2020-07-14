import React, { Component } from 'react';
import { Input, Form, Modal, Tree } from 'antd';
// import styles from './adminModal.less';

const FormItem = Form.Item;
const { Password } = Input;
const { TreeNode } = Tree;


const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14, offset: 1 },
};

@Form.create()
class AdminModal extends Component {
  render() {
    const { props } = this;
    const {
      form,
      adminVisible,
      handleOk,
      handleCancel,
      treeData,
      onExpand,
      onCheck,
      expandedKeys,
      autoExpandParent,
      checkedKeys
    } = props;
    const { getFieldDecorator } = props.form;

    const renderTreeNodes = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} />;
      });

    const newHandleCancel = () => {
      handleCancel({ form })
    }

    // const onNewCheck = checkedKeys => {
    //   onCheck(checkedKeys)
    //   form.setFieldsValue({ 'page': checkedKeys })
    // };

    const newHandleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          handleOk({ values, form });
        }
      });
    };

    return (
      <Modal
        title="添加管理员"
        visible={adminVisible}
        onOk={newHandleOk}
        onCancel={newHandleCancel}
        okText="提交"
      >
        <Form>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('userName1', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名.',
                },
              ],
            })(<Input placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password1', {
              rules: [
                {
                  required: true,
                  message: '请输入密码.',
                },
              ],
            })(<Password placeholder="请输入密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="页面权限">
            {getFieldDecorator('page', {
              rules: [
                {
                  required: true,
                  message: '请输选择页面权限',
                },
              ],
            })(
              <Tree
                showLine
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onNewCheck}
                checkedKeys={checkedKeys}
              >
                {renderTreeNodes(treeData)}
              </Tree>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AdminModal);
