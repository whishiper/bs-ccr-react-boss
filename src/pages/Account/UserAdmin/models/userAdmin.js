/* eslint-disable no-shadow */
import moment from 'moment'
import { message } from 'antd'
import {
  userSearch,
  getUser,
  addUser,
  editUser,
  handleUserStatus,
  resetGoogleVerify,
} from '@/services/api';

export default {
  namespace: 'userAdmin',
  state: {
    formVisible: false,
    formLoading: false,
    loading: false,
    formType: 'add',
    userList: [],
    formData: {},
    pageNum: 1,
    pageSize: 10,
    total: 0
  },

  effects: {

    *userSearch({ payload }, { call, put, select }) {
      const { userAdmin } = yield select(_ => _);
      const params = {
        pageNum: userAdmin.pageNum,
        pageSize: userAdmin.pageSize,
      }
      if (payload) {
        const { values: { status, tel } } = payload
        if (status) {
          Object.assign(params, { status })
        }
        if (tel) {
          Object.assign(params, { tel })
        }
        yield put({
          type: 'updateStatus', payload: { loading: true }
        })
      }

      console.log('asddsaddas')

      const { list = [], pageNum = 1, pageSize = 10, total = 0 } = yield call(userSearch, params)
      yield put({
        type: 'updateStatus', payload: {
          userList: list.map(item => Object.assign(item, {
            key: item.id,
            createdAt: moment(item.createdAt).format("YYYY-MM-DD hh:ss:mm")
          })),
          loading: false,
          pageNum,
          pageSize,
          total
        }
      })
    },
    *handleResetSearch({ payload }, { put }) {
      const { form } = payload
      form.resetFields()
      yield put({ type: 'userSearch' })
    },

    *handlePageChange({ payload }, { put }) {
      yield put({
        type: 'updateStatus', payload: {
          pageNum: payload
        }
      })

      yield put({ type: 'userSearch' })
    },

    *handleAddFormModalShow(_, { put }) {
      yield put({
        type: 'updateStatus', payload: {
          formVisible: true,
          formType: 'add'
        }
      })
    },

    *handleFormModalOk({ payload }, { put, call }) {
      const { form, values } = payload
      const { id = '' } = values
      let data = {}

      yield put({
        type: 'updateStatus', payload: { formLoading: true }
      })

      if (id) {
        data = yield call(editUser, values)
      } else {
        data = yield call(addUser, values)

      }
      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'data')
        && Number(Reflect.get(data, 'data')) === 1)

      if (is_true) {
        const error = id ? '编辑用户失败' : '添加用户失败'
        message.error(error)
        return
      }
      const success = id ? '编辑用户成功' : '添加用户成功'
      message.success(success)

      yield put({
        type: 'updateStatus', payload: {
          pageNum: 1,
          pageSize: 10,
          formVisible: false,
          formData: {},
          formLoading: false
        }
      })
      form.resetFields()
      yield put({ type: 'userSearch' })

    },

    *handleFormModalCancel({ payload }, { put }) {
      const { form } = payload
      yield put({
        type: 'updateStatus', payload: { formVisible: false, formData: {} }
      })
      form.resetFields()
    },

    *handleEditFormModalShow({ payload }, { put, call }) {

      const { id = '', username = '', tel = '', password = '', isBinding = '' } = yield call(getUser, payload.id)

      yield put({
        type: 'updateStatus', payload: {
          formVisible: true,
          formType: 'edit',
          formData: { id, username, tel, password, isBinding }
        }
      })
    },

    *handleUserStatus({ payload }, { call, put }) {

      const { type, ...params } = payload
      const data = yield call(handleUserStatus, { ...params })

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'data')
        && Number(Reflect.get(data, 'data')) === 1)

      if (is_true) {
        const error = type === 'close' ? '封号失败' : '解封失败'
        message.error(error)
        return
      }
      const success = type === 'close' ? '封号成功' : '解封成功'
      message.success(success)
      yield put({ type: 'userSearch' })
    },
    *resetGoogleVerify({ payload }, { call, put }) {
      const data = yield call(resetGoogleVerify, payload)

      const is_true = !(data
        && typeof data === 'object'
        && Reflect.has(data, 'data')
        && Number(Reflect.get(data, 'data')) === 1)

      if (is_true) {
        message.error('重置谷歌失败')
        return
      }
      message.success('重置谷歌成功')
      yield put({ type: 'userSearch' })

    },

  },

  reducers: {

    updateStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

  },
};
