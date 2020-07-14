export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/account/user/admin', authority: ['admin', 'user'] },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/user/admin',
            name: 'account_user_admin',
            component: './Account/UserAdmin/UserAdmin',
          },
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            hideInMenu:true,
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          // {
          //   path: '/account/settings',
          //   name: 'settings',
          //   component: './Account/Settings/Info',
          //   routes: [
          //     {
          //       path: '/account/settings',
          //       redirect: '/account/settings/base',
          //     },
          //     {
          //       path: '/account/settings/base',
          //       component: './Account/Settings/BaseView',
          //     },
          //     {
          //       path: '/account/settings/security',
          //       component: './Account/Settings/SecurityView',
          //     },
          //     {
          //       path: '/account/settings/binding',
          //       component: './Account/Settings/BindingView',
          //     },
          //     {
          //       path: '/account/settings/notification',
          //       component: './Account/Settings/NotificationView',
          //     },
          //   ],
          // },
        ],
      },
      {
        path: '/ccr',
        name: 'CCR',
        icon: 'dashboard',
        routes: [
          {
            path: '/ccr/user_time',
            name: 'user_time',
            component: './Ccr/UserTime/UserTime',
          }, 
          {
            path: '/ccr/user_handle',
            name: 'handle',
            component: './Ccr/UserHandle/UserHandle'
          },
        ],
      },
      {
        path: '/system',
        name: 'system',
        icon: 'dashboard',
        routes: [
          {
            path: '/system/admin',
            name: 'admin',
            component: './System/Admin/Admin',
          },
          {
            path: '/system/addadmin/:id',
            name: 'addadmin',
            component: './System/Admin/AddAdmin',
            hideInMenu: true,
          },
          {
            path: '/system/robot_deploy',
            name: 'robot_deploy',
            component: './System/RobotDeploy/RobotDeploy',
          },
          {
            path: '/system/set_meal',
            name: 'set_meal',
            component: './System/SetMeal/SetMeal',
          },          
          {
            path: '/system/product',
            name: 'product',
            component: './System/Product/Product',
          },
          {
            path: '/system/edit_product/:id',
            name: 'edit_product',
            component: './System/Product/EditProduct',
            hideInMenu: true,
          },
          {
            path: '/system/activation/code',
            name: 'activation_code',
            component: './System/ActivationCode/ActivationCode',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
