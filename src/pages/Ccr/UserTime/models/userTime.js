/* eslint-disable no-shadow */
// import { message } from 'antd';
// import moment from 'moment';
import { message } from 'antd';
import {
  byTelAndIdFindUserTimeList,
  getHandleRecordList,
  addUserTime,
  getCauseList,
} from '@/services/api';


export default {
  namespace: 'userTime',
  state: {
    loading: false,
    recordLoading: false,
    addTimeVisible: false,
    recordVisible: false,
    infoModalVisible: false,
    userTel: '',
    userProductCombold: '',
    pageSize: 15,
    pageNum: 1,
    total: 0,
    dataSource: [],
    handleRecordPageSize: 10,
    handleRecordPage: 1,
    handleRecordTotal: 20,
    handleRecordList: [],
    dataItem: {},
    addTimeInfo: {},
    form: {},
    causeList: [],
  },

  effects: {

    *start(_, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          dataSource: [],
          handleRecordList: [],
        }
      })
    },

    *byTelAndIdFindUserTimeList(_, { call, put, select }) {

      const { userTime } = yield select(_ => _);
      const {userProductCombold, userTel, pageSize, pageNum} = userTime
      const params = {
        userTel,
        pageNum,
        pageSize,
      }

      if(userTel === '' && userProductCombold==='') {
        message.error('请输入手机号码或者机器人编号')
      }

      if(userProductCombold) {
        Object.assign(params,{id:userProductCombold}) 
      }

      if(userTel) {
        Object.assign(params,{userTel}) 
      }


      yield put({
        type: 'updateStatus', payload: {
          loading: true
        }
      })

      const data = yield call(byTelAndIdFindUserTimeList, params);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list)
      )) {
        yield put({
          type: 'updateStatus', payload: {
            loading: false,
            dataSource: [],
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        })
        return
      }

      yield put({
        type: 'updateStatus', payload: {
          loading: false,
          dataSource: data.list.map(item => Object.assign(item, { key: item.id })),
          total: data.total,
          pageSize: data.pageSize,
          pageNum: data.pageNum,
        }
      })
    },

    *handleSearch({ payload }, { put }) {

      const { values } = payload
      const { userProductCombold, userTel } = values
      yield put({
        type: 'updateStatus', payload: {
          userTel,
          userProductCombold,
        }
      })

      yield put({ type: 'byTelAndIdFindUserTimeList' })
    },

    *oPaginationChange({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          pageNum: payload
        }
      })

      yield put({ type: 'byTelAndIdFindUserTimeList' })
    },


    *getCauseList({ payload }, { call, put, select }) {
      const params = {
        reasonTypeId: 1,
      }

      const { list = [] } = yield call(getCauseList, params);
      yield put({
        type: 'updateStatus', payload: {
          causeList: list
        }
      })
    },

    *addTimeModalShow({ payload }, { put }) {
      yield put({
        type: 'updateStatus', payload: {
          addTimeVisible: true,
          dataItem: payload,
        }
      });
      yield put({ type: 'getCauseList' })
    },

    *handleAddTimeModalOk({ payload }, { put, select }) {

      const { userTime } = yield select(_ => _);
      const { dataItem, causeList } = userTime
      const { id, tel, robotNumber, productComboId } = dataItem;
      const { values, form } = payload;
      const { reasonId } = values
      const reason = causeList.find(item => Number(item.id) === Number(reasonId))
      const cause = reason.name || ''

      yield put({
        type: 'updateStatus', payload: {
          addTimeVisible: false,
          infoModalVisible: true,
          addTimeInfo: Object.assign(values, { id, robotNumber, tel, productComboId, cause }),
          form,
        }
      });
    },

    *handleAddTimeCancel({ payload }, { put }) {

      const { form } = payload;

      yield put({
        type: 'updateStatus', payload: {
          addTimeVisible: false,
        }
      });
      form.resetFields();
    },

    *handleInfoModalOk(_, { put, select, call }) {

      const { userTime } = yield select(_ => _);
      const { addTimeInfo } = userTime;
      const { id, number, comboDayReasonId, orderNumber, remark, reasonId } = addTimeInfo;

      const params = {
        comboDayReasonId,
        orderNumber,
        remark,
        reasonId,
        userProductComboDay: {
          number: Number(number),
          userProductComboId: id,
        },
      }

      let data;
      try {
        data = yield call(addUserTime, params);

        if (!(typeof data === 'object'
          && Reflect.has(data, 'data')
          && Reflect.get(data, 'data') === 1
          && Reflect.has(data, 'msg')
          && Reflect.get(data, 'msg') === 'success'
        )) {
          message.error(data.msg);
          yield put({
            type: 'updateStatus', payload: {
              infoModalVisible: false,
            }
          });
          userTime.form.resetFields();
          return;
        }

        message.success('增补时长成功！');
      } catch (e) {
        message.error('增补时长失败！');
      }

      yield put({
        type: 'updateStatus', payload: {
          infoModalVisible: false,
        }
      });
      userTime.form.resetFields();
      yield put({ type: 'byTelAndIdFindUserTimeList' });
    },

    *handleInfoModalCancel(_, { put, select }) {

      const { userTime } = yield select(_ => _);
      userTime.form.resetFields();

      yield put({
        type: 'updateStatus', payload: {
          infoModalVisible: false,
          addTimeFrom: {},
        }
      });
    },

    *handleRecordModalShow({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          recordVisible: true,
          dataItem: payload,
        }
      });

      yield put({ type: 'getHandleRecordList' });
    },

    *getHandleRecordList(_, { call, put, select }) {

      const { userTime } = yield select(_ => _);

      const params = {
        userProductComboId: userTime.dataItem.key,
        pageNum: userTime.handleRecordPage,
        pageSize: userTime.handleRecordPageSize,
      }

      yield put({
        type: 'updateStatus',
        payload: {
          recordLoading: true,
        }
      })

      const data = yield call(getHandleRecordList, params);

      if (!(typeof data === 'object'
        && Reflect.has(data, 'list')
        && Array.isArray(data.list)
      )) {
        yield put({
          type: 'updateStatus', payload: {
            recordLoading: false,
          }
        })
        return;
      }

      yield put({
        type: 'updateStatus', payload: {
          recordLoading: false,
          handleRecordList: data.list.map(item => Object.assign(item, { key: item.id })),
          handleRecordTotal: data.total,
          handleRecordPageSize: data.pageSize,
          handleRecordPage: data.pageNum,
        }
      })
    },

    *handleRecordOpagination({ payload }, { put }) {

      yield put({
        type: 'updateStatus', payload: {
          handleRecordPage: payload
        }
      })

      yield put({ type: 'getHandleRecordList' });
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
