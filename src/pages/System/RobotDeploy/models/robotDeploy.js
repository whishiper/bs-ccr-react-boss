/* eslint-disable no-shadow */
import { Modal } from 'antd';
import { byTelGetUserInfo, byTelAndIdFindUserTimeList, getProductOpenList, getSetMealOpenList, handleRobotDeploy } from '@/services/api';

export default {
  namespace: 'robotDeploy',
  state: {
    infoModalVisible: false,
    userSetMealIsShow: false,
    userInfo: {},
    formData: {},
    userSetMeal: [],
    productList: [],
    setMealList: [],
  },

  effects: {

    *start(_, { put }) {

      yield put({ type: 'getProductOpenList' })

      yield put({
        type: 'updateStatus', payload: {
          userSetMealIsShow: false,
          formData: {},
          userSetMeal: [],
          userInfo: {},
        }
      });
    },

    *byTelAndIdFindUserTimeList({ payload }, { put, call, select }) {

      const { robotDeploy } = yield select(_ => _);

      const userInfo = yield call(byTelGetUserInfo, { tel: payload });

      if (!(userInfo &&
        typeof userInfo === 'object'
        && Reflect.has(userInfo, 'id')
        && Reflect.has(userInfo, 'tel'))) {
        return
      }

      yield put({
        type: 'updateStatus', payload: {
          userInfo
        }
      })

      const params = {
        userTel: payload
      }

      const data = yield call(byTelAndIdFindUserTimeList, params)

      let userSetMeal = []
      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list))
        && JSON.stringify(data.list) !== '[]'
      ) {
        return;
      }

      userSetMeal = data.list.map(item => Object.assign(item, { key: item.id }))


      yield put({
        type: 'updateStatus', payload: {
          userSetMeal,
          userSetMealIsShow: true,
          formData: Object.assign(robotDeploy.formData, { userTel: payload })
        }
      })
    },

    *getProductOpenList(_, { call, put, select }) {

      const { robotDeploy } = yield select(_ => _);

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
      yield put({
        type: 'updateStatus', payload: {
          productList,
          setMealList: [],
          formData: Object.assign(robotDeploy.formData, { productId: productList[0].id })
        }
      })

      yield put({
        type: 'getSetMealOpenList', payload: {
          formData: Object.assign(robotDeploy.formData, { productId: productList[0].id })
        }
      })
    },

    *getSetMealOpenList({ payload }, { call, put }) {

      const { formData } = payload

      const params = {
        productId: formData.productId,
      }

      yield put({
        type: 'updateStatus', payload: {
          formData,
        }
      })

      const data = yield call(getSetMealOpenList, params);

      console.log(data, 'dsa')

      if (!(typeof data === 'object'
        && Reflect.has(data, 'data')
        && Array.isArray(data.data))
        && JSON.stringify(data.data) !== '[]'
      ) {
        yield put({
          type: 'updateStatus', payload: {
            setMealList: []
          }
        })
        return;
      }

      const setMealList = data.data.map(item => Object.assign(item, { key: item.id }));
      yield put({ type: 'updateStatus', payload: { setMealList } })
    },

    *handleSubmit({ payload }, { put, select }) {

      const { robotDeploy } = yield select(_ => _);
      const { values, form } = payload

      let productName = ''
      robotDeploy.productList.forEach(item => {
        if (values.productId === item.id) {
          productName = item.name
        }
        return item
      })

      let productComboTime = ''
      robotDeploy.setMealList.forEach(item => {
        if (values.productComboId === item.id) {
          productComboTime = item.time
        }
        return item
      })

      yield put({
        type: 'updateStatus', payload: {
          infoModalVisible: true,
          formData: values,
          productName,
          productComboTime,
          form,
        }
      });
    },

    *infoModalOk(_, { put, select, call }) {

      const { robotDeploy } = yield select(_ => _);
      const { userInfo, formData } = robotDeploy

      const params = {
        userId: userInfo.id,
        orderNumber: formData.orderNumber,
        productComboId: formData.productComboId,
        remark: formData.remark
      }

      const data = yield call(handleRobotDeploy, params)

      if (!(typeof data === 'object'
        && Reflect.has(data, 'msg')
        && Reflect.get(data, 'msg') === 'success'
      )) {
        Modal.error({
          title: '部署失败',
          content: data.msg,
          okText: '确认',
          centered: true,
        });
        return;
      }

      Modal.success({
        title: '部署成功',
        content: '部署成功',
        okText: '确认',
        centered: true,
      });

      yield put({
        type: 'updateStatus', payload: {
          infoModalVisible: false,
          userSetMealIsShow: false,
          formData: {},
          userSetMeal: [],
          userInfo: {}
        }
      });
      robotDeploy.form.resetFields()
    },

    *infoModalCancel(_, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          infoModalVisible: false,
          productName: '',
          productComboTime: '',
        }
      });
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
