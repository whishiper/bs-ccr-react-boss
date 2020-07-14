import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import { userLogin, getUserInfo } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {

    *login({ payload }, { call, put }) {

      const value = {
        username: payload.userName,
        password: payload.password
      }

      let loginToken = {};
      let userInfo = {};
      try {

        loginToken = yield call(userLogin, value);

        if (!(typeof loginToken === 'object' &&
          Reflect.has(loginToken, 'access_token') &&
          Reflect.has(loginToken, 'expires_in'))) {

          message.error('账号或者密码错误！');
          return;
        }

        sessionStorage.setItem('access_token', loginToken.access_token)


        userInfo = yield call(getUserInfo);

        if (!(typeof userInfo === 'object'
          && Reflect.has(userInfo, 'id')
        )) {
          message.error('您还不是管理员！');
          return
        }

        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

        message.success('登陆成功！');
      } catch (e) {

        message.error('账号或者密码错误！');
      }

      const currentAuthority = userInfo.authorities
        && Array.isArray(userInfo.authorities)
        ? userInfo.authorities[0].authority.toLowerCase()
        : '';

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          type: 'account',
          currentAuthority,
        },
      });


      reloadAuthorized();
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          redirect = null;
        }
      }
      yield put(routerRedux.replace(redirect || '/'))
    },


    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      sessionStorage.clear()
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
