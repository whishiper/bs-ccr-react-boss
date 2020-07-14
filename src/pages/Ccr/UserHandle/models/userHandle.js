/* eslint-disable no-shadow */
// import moment from 'moment';
import { message } from 'antd';
import { getUserHandleRecordList } from '@/services/api';

export default {
  namespace: 'userHandle',
  state: {
    loading: false,
    pageSize: 10,
    pageNum: 1,
    total: 1,
    dataSource: [],
    userTel: '',
    userProductCombold:''
  },

  effects: {

    *start(_, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          dataSource: [],
        }
      })
    },

    *getUserHandleRecordList(_, { call, put, select }) {

      const { userHandle } = yield select(_ => _);
      
      const {userProductCombold, userTel, pageSize, pageNum} = userHandle
      const params = {
        pageNum,
        pageSize,
      }

      if(userTel === '' && userProductCombold==='') {
        message.error('请输入手机号码或者机器人编号')
      }

      if(userProductCombold) {
        Object.assign(params,{userProductCombold}) 
      }

      if(userTel) {
        Object.assign(params,{tel:userTel}) 
      }

      yield put({
        type: 'updateStatus', payload: {
          loading: true
        }
      })

      const data= yield call(getUserHandleRecordList, params);

      const is_true = !(data 
      && typeof data ==='object'
      && Reflect.has(data,'list'))

      if(is_true) {
        return
      }

      const dataSource = data.list.map(item => Object.assign(item, { key: item.id, }))

      yield put({
        type: 'updateStatus', payload: {
          loading: false,
          dataSource,
          total:data.total,
          pageSize:data.pageSize,
          pageNum:data.pageNum,
        }
      })
    },

    *handleSearch({ payload }, { put }) {

      const { values } = payload;
      const { userProductCombold, userTel } = values

      yield put({
        type: 'updateStatus', payload: {
          userTel,
          userProductCombold,
        }
      })

      yield put({ type: 'getUserHandleRecordList' })
    },

    *oPaginationChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          pageNum: payload
        }
      })

      yield put({ type: 'getUserHandleRecordList' })
    },

  },
  reducers: {

    updateStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

  },
};
