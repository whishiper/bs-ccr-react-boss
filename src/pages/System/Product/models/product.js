import router from 'umi/router';
import { message } from 'antd'
import {
  getProductList,
  editProduct,
  startAddCloseProduct,
  getProductInfo,
} from '@/services/api';

export default {
  namespace: 'product',
  pageSize: 10,
  total: 0,
  page: 1,
  state: {
    loading: false,
    editLoading: false,
    productList: [],
    startProduct: {},
    formData: {},
    logoUploadUrl: '',
    handleSubmitType: 'add',
    page: 1,
    total: 0,
    pageSize: 10,
  },

  effects: {

    *getProductList(_, { call, put }) {

      yield put({
        type: 'updateStatus', payload: {
          loading: true
        }
      })

      const data = yield call(getProductList);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list)
        && JSON.stringify(data.list) !== '[]'
      )) {
        yield put({
          type: 'updataStatus', payload: {
            loading: false
          }
        })
        return;
      }

      const productList = data.list.map(item => Object.assign(item, { key: item.id }))
      yield put({
        type: 'updateStatus', payload: {
          loading: false,
          page: data.pageNum,
          total: data.total,
          pageSize: data.pageSize,
          productList,
        }
      })
    },

    *getProductInfo({ payload }, { call, put }) {

      const { id } = payload;

      yield put({
        type: 'updateStatus', payload: {
          editLoading: true,
        }
      })
      const data = yield call(getProductInfo, id);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'id'))
      ) {
        yield put({
          type: 'updateStatus', payload: {
            editLoading: false,
          }
        })
        return;
      }

      console.log(data, 'getProductInfo')
      yield put({
        type: 'updateStatus', payload: {
          editLoading: false,
          formData: data,
          handleSubmitType: 'edit',
        }
      })
    },

    *upload({ payload }, { put }) {

      const { url } = payload
      yield put({
        type: 'updateStatus', payload: {
          logoUploadUrl: url.replace('http://bs-follow.oss-cn-shenzhen.aliyuncs.com', ''),
        }
      })
    },

    *handleSubmit({ payload }, { put, select }) {

      const { product } = yield (select(_ => _))
      if (product.handleSubmitType === 'edit') {
        yield put({ type: 'editProduct', payload })
      }
    },

    *editProduct({ payload }, { call, select }) {

      const { product } = yield (select(_ => _))
      const { form, values } = payload;
      const { logo, name, remark } = values

      const params = {
        id: product.formData.id,
        logo: logo.replace('http://bs-follow.oss-cn-shenzhen.aliyuncs.com', ''),
        name,
        remark,
        versionName: product.formData.versionName,
      }

      let data;
      try {
        data = yield call(editProduct, params);

        if (!(typeof data === 'object')
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success') {
          message.error(data.msg)
        }

        message.success('编辑产品成功！')
      } catch (e) {
        message.error('编辑产品失败！');
      }

      router.push('/system/product');
      form.resetFields()
    },

    *startAddCloseProduct({ payload }, { put, call }) {

      // status 1 启用 2 停用
      const { id, status } = payload
      const params = {
        id,
        param: { status: Number(status) === 1 ? 2 : 1 }
      }

      let data;
      try {
        data = yield call(startAddCloseProduct, params);

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

      yield put({ type: 'getProductList' })
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
