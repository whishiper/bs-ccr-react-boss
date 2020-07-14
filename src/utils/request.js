/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';

/**
 * 异常处理程序
 */
const errorHandler = async error => {
  const { response = {} } = error;
  const { status } = response;

  if (status === 401) {

    let url = '';
    const errorType = await response.json();
    if (typeof errorType === 'object'
      && Reflect.has(errorType, 'name')
      && errorType.name === 'UnauthorizedError'
    ) {
      if (process.env.NODE_ENV === 'development') {
        if (window.location.pathname === '/user/login') {
          return
        }
        url = '/user/login';
      } else if (process.env.NODE_ENV === 'production') {
        if (window.location.hash === '#/user/login') {
          return
        }
        url = '#/user/login';
      }
      setTimeout(() => {
        sessionStorage.clear();
        window.location.href = url;
      }, 1000)
    }

    // eslint-disable-next-line no-useless-return
    return;

  }

};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  mode: 'cors',
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {

  if (sessionStorage.getItem('access_token')) {
    const newOptions = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
      }
    }

    Object.assign(options, newOptions)
  }
  return (
    {
      options: { ...options, interceptors: true },
    }
  );
});



export default request;
