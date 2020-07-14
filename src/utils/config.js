let url = '';
const {NODE_ENV, NODE_TEST} = process.env;

// 本地启动
if (NODE_TEST === 'test_start' && NODE_ENV === 'development') {
  // 测试环境
  url = 'http://node-ccr-server.bosenkeji.cn';
}

if (NODE_TEST === 'dev' && NODE_ENV === 'development') {

  // 线上环境
  url = 'http://ccr-control.bosenkeji.cn';
}

// 打包上线
if (NODE_TEST === 'test_start' && NODE_ENV === 'production') {
  // 测试环境
  url = 'http://node-ccr-server.bosenkeji.cn';
}

if (NODE_TEST === 'dev' && NODE_ENV === 'production') {
  // 线上环境
  url = 'http://ccr-control.bosenkeji.cn';
}

module.exports = {
  api: {
    upload: `${url}/upload`,
    login: `${url}/login`,
    user:`${url}/user/`,
    user_search: `${url}/user/search`,
    user_status: `${url}/user/status`,
    reset_google_verify: `${url}/user/update_binding`,
    by_tel_get_User_info: `${url}/user/get_by_tel`,
    get_cause_list: `${url}/reason/by_reason_type_id`,
    get_user_info: `${url}/admin/current_admin`,
    login_code: `${url}/login_code`,
    product: `${url}/product/`,
    product_open: `${url}/product/list_by_open`,
    set_meal_list: `${url}/product_combo/list_by_product_id`,
    set_meal_open_list: `${url}/product_combo/list_by_product_id_and_open`,
    set_meal: `${url}/product_combo/`,
    by_tel_find_user_product_list_and_id: `${url}/user_product_combo/list_by_user_tel_and_id`,
    robot_deploy: `${url}/user_product_combo/`,
    by_id_find_user_tiem_list_handle: `${url}/user_product_combo_day/list_by_user_product_combo_id`,
    addOrReduceTime: `${url}/user_product_combo_day_by_admin`,
    by_tel_and_id_find_user_tiem_list_handle: `${url}/user_product_combo_day/list_by_tel_and_combo_id`,
    admin: `${url}/admin/`,
    create_active_code: `${url}/cd_key/generation`,
    search_active_code: `${url}/cd_key/search`,
  },
}
