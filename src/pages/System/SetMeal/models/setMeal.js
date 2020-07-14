/* eslint-disable no-shadow */
import { message } from 'antd';
import {
  getProductOpenList,
  getSetMealList,
  startAddCloseSetMeal,
  deleteSetMeal,
  addSetMeal,
  getSetMealInfo,
  editSetMeal,
} from '@/services/api';

export default {
  namespace: 'setMeal',
  state: {
    loading: false,
    formData: {},
    handleSubmitType: 'add',
    activeProduct: {},
    productList: [],
    pageSize: 10,
    page: 1,
    total: 20,
    setMealList: [],
    formModalVisible: false,
  },

  effects: {

    *getProductOpenList(_, { call, put }) {

      const data = yield call(getProductOpenList);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list)
        && JSON.stringify(data.list) !== '[]'
      )) {
        yield put({
          type: 'updateStatus', payload: {
            productList: [],
          }
        })
        return
      }

      yield put({
        type: 'updateStatus', payload: {
          productList: data.list,
        }
      })

      yield put({ type: 'onChangeProduct', payload: Reflect.get(data, 'list')[0].id })
    },

    *getSetMealList(_, { call, put, select }) {

      const { setMeal } = yield (select(_ => _));
      const params = {
        productId: setMeal.activeProduct.id,
        pageNum: setMeal.page,
        pageSize: setMeal.pageSize,
      }

      yield put({
        type: 'updateStatus', payload: {
          loading: true,
        }
      })

      const data = yield call(getSetMealList, params);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list)
        && JSON.stringify(data.list) !== '[]'
      )) {
        yield put({
          type: 'updateStatus', payload: {
            loading: false,
            setMealList: [],
            page: 1,
            total: 0,
          }
        })
        return
      }

      const setMealList = data.list.map(item => Object.assign(item, { key: item.id }));
      yield put({
        type: 'updateStatus', payload: {
          loading: false,
          setMealList,
          page: data.pages,
          total: data.total,
        }
      })
    },

    *onChangeProduct({ payload }, { put, select }) {

      const { setMeal } = yield (select(_ => _));

      let activeProduct = {}
      setMeal.productList.map(item => {
        if (Number(item.id) === Number(payload)) {
          activeProduct = item
        }
        return item
      })

      yield put({
        type: 'updateStatus',
        payload: { activeProduct }
      })

      yield put({ type: 'getSetMealList' })
    },

    *oPaginationChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          page: payload
        }
      })

      yield put({ type: 'getSetMealList' })
    },

    *onShowSizeChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          pageSize: payload.size,
          page: payload.current
        }
      })

      yield put({ type: 'getSetMealList' })
    },

    *startAddCloseSetMeal({ payload }, { put, call }) {

      // status 1 启用 2 停用
      const { id, status } = payload
      const params = {
        id,
        param: { status: status === 1 ? 2 : 1 }
      }

      let data;
      try {
        data = yield call(startAddCloseSetMeal, params);

        if (!(typeof data === 'object'
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg)
          return;
        }

        const msg = Number(status) !== 1 ? '启用成功！' : '停用成功！'

        message.success(msg)

      } catch (e) {
        const error = Number(status) !== 1 ? '启用失败！' : '停用失败！'
        message.error(error)
      }

      yield put({ type: 'getSetMealList' })
    },

    *deleteSetMeal({ payload }, { put, call }) {

      const data = yield call(deleteSetMeal, payload.id)

      try {

        const data = yield call(deleteSetMeal, payload.id)

        if (!(typeof data === 'object'
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg);
          return;
        }

        message.success('删除套餐成功！')
      } catch (e) {
        message.error('删除套餐失败！')
      }
      yield put({ type: 'getSetMealList' })
    },

    *getSetMealInfo({ payload }, { call, put }) {

      const { id } = payload;
      const data = yield call(getSetMealInfo, id);

      if (!(typeof data === 'object' && Reflect.has(data, 'id'))) {
        return
      }

      yield put({
        type: 'updateStatus', payload: {
          formData: data,
        }
      })
    },

    *addOrEditMealMoadleShow({ payload }, { put }) {

      if (payload) {
        yield put({ type: 'getSetMealInfo', payload })
        yield put({
          type: 'updateStatus', payload: {
            visible: true,
            handleSubmitType: 'edit',
          }
        })
        return;
      }

      yield put({
        type: 'updateStatus', payload: {
          visible: true,
          handleSubmitType: 'add',
          formData: {},
        }
      })

    },

    *addMealModalOk({ payload }, { put, call, select }) {

      const { setMeal } = yield (select(_ => _));
      const { values, form } = payload;

      try {

        let data;
        if (setMeal.handleSubmitType === 'add') {
          const params = {
            productId: setMeal.activeProduct.id,
          }
          data = yield call(addSetMeal, Object.assign(values, params))

        } else if (setMeal.handleSubmitType === 'edit') {
          const params = {
            id: setMeal.formData.id,
            productId: setMeal.activeProduct.id,
          }
          data = yield call(editSetMeal, Object.assign(values, params))
        }

        if (!(typeof data === 'object'
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg);
          yield put({
            type: 'updateStatus', payload: {
              visible: false,
            }
          });
          form.resetFields();
          return;
        }

        const msg = setMeal.handleSubmitType === 'edit' ? '编辑成功！' : '添加成功！';
        message.success(msg)
      } catch (e) {

        const error = setMeal.handleSubmitType === 'edit' ? '编辑失败！' : '添加失败！';
        message.error(error)
      }

      yield put({
        type: 'updateStatus', payload: {
          visible: false,
        }
      });
      form.resetFields();
      yield put({ type: 'getSetMealList' })
    },

    *addMealModalCancel({ payload }, { put }) {

      const { form } = payload.value;
      yield put({
        type: 'updateStatus', payload: {
          visible: false,
        }
      });
      form.resetFields();
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
