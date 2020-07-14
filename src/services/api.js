import { stringify } from 'qs';
import request from '@/utils/request';
import { api } from '@/utils/config';

const {
  login_code,
  login,
  user,
  user_search,
  user_status,
  reset_google_verify,
  by_tel_get_User_info,
  get_user_info,
  product,
  product_open,
  set_meal,
  set_meal_list,
  set_meal_open_list,
  by_tel_find_user_product_list_and_id,
  robot_deploy,
  // by_tel_find_user_time_list,
  by_id_find_user_tiem_list_handle,
  addOrReduceTime,
  get_cause_list,
  by_tel_and_id_find_user_tiem_list_handle,
  admin,
  create_active_code,
  search_active_code
} = api;

/* --------------------------用户登录------------------------- */

// 用户登录
export function userLogin(params) {
  return request(login, {
    method: 'post',
    data: params,
  })
}

// 获取用户信息
export async function byTelGetUserInfo(params) {
  return request(`${by_tel_get_User_info}?${stringify(params)}`, {
    expirys: false,
  });
}

// 获取当前用户信息
export async function getUserInfo() {
  return request(get_user_info, {
    expirys: false,
  });
}

// 获取验证码
export async function getloginCode(params) {
  return request(login_code, {
    method: 'post',
    data: params,
  });
}

/* --------------------------用户管理------------------------- */

/**
 * 用户管理 - 搜索
 * @param {object} params - pageNum页 pageSize条数 status：0封号 1正常 不传所有 tel手机号
 */

export async function userSearch(params) {
  return request(`${user_search}?${stringify(params)}`);
}

// 获取用户详情
export async function getUser(params) {
  return request(`${user}${params}`);
}

// 添加用户
export async function addUser(params) {
  return request(user, {
    method: 'post',
    data: params,
  });
}

// 编辑用户
export async function editUser(params) {
  return request(user, {
    method: 'put',
    data: params,
  });
}

/**
 * 用户管理 - 解封和封号
 * @param {object} params -- id：用户id ，status：0 封号、1 解封
 */

export async function handleUserStatus(params) {
  return request(`${user_status}?${stringify(params)}`, {
    method: 'put'
  });
}

/**
 * 用户管理 - 重置谷歌验证
 * @params {string} params -- id：用户ID
 */

export async function resetGoogleVerify(params) {
  return request(`${reset_google_verify}?${stringify(params)}`, {
    method: 'put'
  });
}


/* --------------------------产品管理------------------------- */

// 产品列表
export async function getProductList() {
  return request(product);
}

//  启用 或者 停止
export async function startAddCloseProduct(params) {
  const { id, param } = params;
  return request(`${product}${id}?${stringify(param)}`, {
    method: 'put',
  });
}

// 获取产品详情
export async function getProductInfo(params) {
  return request(`${product}${params}`);
}

// 编辑产品
export async function editProduct(params) {
  return request(product, {
    method: 'put',
    data: params,
  });
}

/* --------------------------套餐管理------------------------- */

// 启用产品列表
export async function getProductOpenList() {
  return request(product_open);
}

// 套餐列表
export async function getSetMealList(params) {
  return request(`${set_meal_list}?${stringify(params)}`);
}

// 启用 或者 关闭
export async function startAddCloseSetMeal(params) {
  const { id, param } = params;
  return request(`${set_meal}${id}?${stringify(param)}`, {
    method: 'put',
  });
}

// 删除 套餐
export async function deleteSetMeal(params) {
  return request(`${set_meal}${params}`, {
    method: 'delete',
  });
}

// 添加 套餐
export async function addSetMeal(params) {
  return request(set_meal, {
    method: 'post',
    data: params,
  });
}

// 获取套餐详情
export async function getSetMealInfo(params) {
  return request(`${set_meal}${params}`);
}

// 修改套餐
export async function editSetMeal(params) {
  return request(set_meal, {
    method: 'put',
    data: params,
  });
}

/* --------------------------机器人部署------------------------- */

// 通过 手机 查找用户 套餐
export async function byTelAndIdFindUserTimeList(params) {

  return request(`${by_tel_find_user_product_list_and_id}?${stringify(params)}`);
}

// 获取启用的产品套餐
export async function getSetMealOpenList(params) {
  return request(`${set_meal_open_list}?${stringify(params)}`);
}

// 部署机器人
export async function handleRobotDeploy(params) {
  return request(robot_deploy, {
    method: 'post',
    data: params,
  });
}

/* --------------------------用户时长管理------------------------- */


// 操作记录列表
export async function getHandleRecordList(params) {
  return request(`${by_id_find_user_tiem_list_handle}?${stringify(params)}`);
}

// 事由列表
export async function getCauseList(params) {
  return request(`${get_cause_list}?${stringify(params)}`);
}

// 增补用户 时长
export async function addUserTime(params) {
  return request(`${addOrReduceTime}/`, {
    method: 'post',
    data: params,
  });
}

/* --------------------------用户时长操作记录------------------------- */

// 手机 查找 用户时长操作记录
export async function getUserHandleRecordList(params) {
  return request(`${by_tel_and_id_find_user_tiem_list_handle}?${stringify(params)}`);
}

/* --------------------------用户时长操作记录------------------------- */

// 获取 管理员列表
export async function getAdminList(params) {
  return request(`${admin}?${stringify(params)}`);
}

// 添加 管理员
export async function addAdmin(params) {
  return request(admin, {
    method: 'post',
    data: params,
  });
}

// 删除 管理员
export async function deleteAdmin(params) {
  return request(`${admin}${params}`, {
    method: 'delete',
  });
}

// 重置 管理员密码
export async function reSetAdminPassword(params) {
  return request(admin, {
    method: 'put',
    data: params,
  });
}
/* -------------------------激活码管理------------------------- */

// 搜索激活码列表
export async function searchActiveCode(params) {
  return request(`${search_active_code}?${stringify(params)}`);
}

// 生成激活码
export async function createActiveCode(params) {
  return request(`${create_active_code}`, {
    method: 'post',
    data: params,
  });
}



// export async function queryProjectNotice() {
//   return request('/api/project/notice');
// }

// export async function queryActivities() {
//   return request('/api/activities');
// }

// export async function queryRule(params) {
//   return request(`/api/rule?${stringify(params)}`);
// }

// export async function removeRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }

// export async function addRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'post',
//     },
//   });
// }

// export async function updateRule(params = {}) {
//   return request(`/api/rule?${stringify(params.query)}`, {
//     method: 'POST',
//     data: {
//       ...params.body,
//       method: 'update',
//     },
//   });
// }

// export async function fakeSubmitForm(params) {
//   return request('/api/forms', {
//     method: 'POST',
//     data: params,
//   });
// }

// export async function fakeChartData() {
//   return request('/api/fake_chart_data');
// }

// export async function queryTags() {
//   return request('/api/tags');
// }

// export async function queryBasicProfile(id) {
//   return request(`/api/profile/basic?id=${id}`);
// }

// export async function queryAdvancedProfile() {
//   return request('/api/profile/advanced');
// }

// export async function queryFakeList(params) {
//   return request(`/api/fake_list?${stringify(params)}`);
// }

// export async function removeFakeList(params) {
//   const { count = 5, ...restParams } = params;
//   return request(`/api/fake_list?count=${count}`, {
//     method: 'POST',
//     data: {
//       ...restParams,
//       method: 'delete',
//     },
//   });
// }

// export async function addFakeList(params) {
//   const { count = 5, ...restParams } = params;
//   return request(`/api/fake_list?count=${count}`, {
//     method: 'POST',
//     data: {
//       ...restParams,
//       method: 'post',
//     },
//   });
// }

// export async function updateFakeList(params) {
//   const { count = 5, ...restParams } = params;
//   return request(`/api/fake_list?count=${count}`, {
//     method: 'POST',
//     data: {
//       ...restParams,
//       method: 'update',
//     },
//   });
// }

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

// export async function fakeRegister(params) {
//   return request('/api/register', {
//     method: 'POST',
//     data: params,
//   });
// }

// export async function queryNotices(params = {}) {
//   return request(`/api/notices?${stringify(params)}`);
// }

// export async function getFakeCaptcha(mobile) {
//   return request(`/api/captcha?mobile=${mobile}`);
// }
