/* eslint-disable no-shadow */
import { message } from 'antd';
import router from 'umi/router';
import {
  getAdminList,
  addAdmin,
  deleteAdmin,
  reSetAdminPassword
} from '@/services/api';

export default {
  namespace: 'admin',
  state: {
    loading: false,
    submitType: 'add',
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    pageSize: 10,
    page: 1,
    total: 20,
    formData: {
      account: '',
      password: ''
    },
    dataSource: [],
  },

  effects: {

    *getAdminList(_, { put, select, call }) {

      const { admin } = yield select(_ => _);

      const params = {
        pageNum: admin.page,
        pageSize: admin.pageSize
      }

      yield put({
        type: 'updateStatus', payload: {
          loading: true,
        }
      })

      const data = yield call(getAdminList, params)

      if (!(typeof data === 'object' && Reflect.has(data, 'list'))) {
        yield put({
          type: 'updateStatus', payload: {
            loading: false,
          }
        })
        return
      }

      yield put({
        type: 'updateStatus', payload: {
          loading: false,
          dataSource: data.list.map(item => Object.assign(item, { key: item.id, page: '所以页面' })),
          page: data.pageNum,
          pageSize: data.pageSize,
          total: data.total,
        }
      })
      console.log(data, 'getAdminList')
    },


    *handleSubmit({ payload }, { select, call }) {

      const { admin } = yield select(_ => _);
      const { values, form } = payload;

      let data;
      try {

        if (admin.submitType === 'add') {
          data = yield call(addAdmin, Object.assign(values, { status: 1 }))
        }

        if (!(typeof data === 'object'
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg);
          return;
        }

        message.success('添加管理员成功！');
        router.push(`/system/admin`);
        form.resetFields();
      } catch (e) {

        message.error('添加管理员失败！');
      }
    },

    *addAdmin(_, { put }) {

      yield put({
        type: 'updateStatus',
        payload: {
          submitType: 'add'
        }
      })

      router.push(`/system/addadmin/${'add'}`)

    },

    *oPaginationChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          page: payload
        }
      })

      yield put({
        type: 'getAdminList'
      })
    },

    *onShowSizeChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          pageSize: payload.size,
          page: payload.current
        }
      })

      yield put({
        type: 'getAdminList'
      })
    },

    *deleteAdmin({ payload }, { put, call }) {

      const { id } = payload;

      try {
        const data = yield call(deleteAdmin, id);

        if (!(typeof data === 'object'
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg);
        }

        message.success('删除管理员成功！');
      } catch (e) {
        message.error('删除管理员失败！');
      }

      yield put({
        type: 'getAdminList',
      })
    },

    *reSetAdminPassword({ payload }, { put, call }) {

      const { account, id, } = payload;
      const params = {
        account,
        id,
        status: 1,
        password: '888888'
      }

      let data;
      try {

        data = yield call(reSetAdminPassword, params)

        if (!(typeof data === 'object'
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg);
          return;
        }

        message.success('重置密码成功！');
      } catch (e) {

        message.error('重置密码失败！');
      }

      yield put({
        type: 'getAdminList',
      })
    }


  },

  reducers: {

    updateStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    onExpand(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    onCheck(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
