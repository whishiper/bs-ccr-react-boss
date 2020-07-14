/* eslint-disable no-shadow */
import { message } from 'antd';
import moment from 'moment'

import {
  searchActiveCode,
  createActiveCode,
  getProductOpenList,
  getSetMealList
} from '@/services/api'


export default {
  namespace: 'activateCode',
  state: {
    activateCodeVisible: false,
    stepCurrent: 0,
    codelist: [],
    setMealList: [],
    productList: [],
    searchFormData: {},
    formData: {},
    codeUrl: '',
    form: {},
    createActiveCodeInfo: {},
    pageNum: 1,
    total: 0,
    pageSize: 10
  },

  effects: {

    *searchActiveCode({ payload }, { call, select, put }) {

      const { activateCode } = yield select(_ => _);
      const { searchFormData } = activateCode
      const { cdKey = '', username = '', isUsed = '' } = searchFormData
      const params = {
        pageNum: activateCode.pageNum,
        pageSize: activateCode.pageSize
      }

      if (cdKey) {
        Object.assign(params, { cdKey })
      }

      if (username) {
        Object.assign(params, { username })
      }

      if (typeof isUsed === 'number') {
        Object.assign(params, { isUsed })
      }

      const { list = [], total = 0, pageNum = 1, pageSize = 10 } = yield call(searchActiveCode, params)

      yield put({
        type: 'updateStatus',
        payload: {
          loading: false,
          codelist: list.map(item => Object.assign(item, { createAt: moment(item.createAt).format("YYYY-MM-DD hh:ss:mm") })),
          total,
          pageNum,
          pageSize
        }
      })
    },
    *handleSearch({ payload }, { put }) {

      const { values } = payload

      yield put({
        type: 'updateStatus', payload: {
          searchFormData: values,
        }
      })

      yield put({ type: 'searchActiveCode' })
    },
    *oPaginationChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          pageNum: payload
        }
      })

      yield put({ type: 'searchActiveCode' })
    },


    *getProductOpenList(_, { call, put }) {

      const data = yield call(getProductOpenList);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list))
        && JSON.stringify(data.list) !== '[]'
      ) {
        yield put({
          type: 'updateStatus', payload: {
            productList: [],
          }
        })
        return;
      }

      const productList = data.list.map(item => Object.assign(item, { key: item.id }))
      console.log(productList, 'productList')
      yield put({
        type: 'updateStatus', payload: {
          productList,
          setMealList: [],
        }
      })
    },

    *getSetMealList({ payload }, { call, put, }) {

      const params = {
        productId: payload,
      }

      const data = yield call(getSetMealList, params);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list))
        && JSON.stringify(data.list) !== '[]'
      ) {
        yield put({
          type: 'updateStatus', payload: {
            setMealList: []
          }
        })
        return;
      }

      const setMealList = data.list.map(item => Object.assign(item, { key: item.id, }));
      yield put({ type: 'updateStatus', payload: { setMealList } })
    },
    *createActiveCode({ payload }, { put, call, select }) {
      const { next } = payload;
      const { activateCode } = yield select(_ => _);
      const { formData } = activateCode
      const { number, productComboId, prefix, remark, timeType, productId, time } = formData
      const params = {
        number: Number(number),
        prefix,
        remark
      }
      if (timeType === 'setMeal') {
        Object.assign(params, { productComboId: Number(productComboId) })
      } else {
        Object.assign(params, {
          productId: Number(productId),
          time: Number(time),
          productComboId: 0
        })
      }
      const data = yield call(createActiveCode, params)
      if (!(data
        && Reflect.has(data, 'data')
        && Reflect.has(data, 'msg')
        && Reflect.get(data, 'msg') === 'success')
      ) {
        message.error(data.msg || '生成二维码失败');
        return
      }
      yield put({
        type: 'updateStatus',
        payload: {
          codeUrl: data.data,
          formData: {}
        }
      })
      window.open(data.data, '_blank')
      message.success(data.msg || '生成二维码成功');
      next()
    },

    *handleActiveCodeSuBmit({ payload }, { put, call, select }) {
      const { form, values } = payload;
      const { activateCode } = yield select(_ => _);
      const { setMealList, productList } = activateCode

      const { number, productId, productComboId, prefix, remark, timeType, time } = values

      const setMealItem = setMealList.filter(item => Number(item.id) === Number(productComboId))
      const productItem = productList.filter(item => Number(item.id) === Number(productId))
      yield put({
        type: 'updateStatus', payload: {
          formData: values,
          form,
          createActiveCodeInfo: {
            number,
            productName: productItem ? productItem[0].name : '',
            time: timeType === 'setMeal' ? setMealItem[0].time : time,
            setMealType: timeType === 'setMeal' ? setMealItem[0].name : '自定义套餐',
            prefix,
            remark
          },
        }
      })
    },

    *handleActivateCodeShow({ payload }, { put }) {
      yield put({
        type: 'updateStatus',
        payload
      })
    },

    *handleActivateCodeOk({ payload }, { put }) {
      yield put({
        type: 'updateStatus',
        payload
      })
    },

  },

  reducers: {

    updateStatus(state, { payload }) {
      console.log(payload,'-----payload')
      return {
        ...state,
        ...payload,
      };
    },

  },
};
