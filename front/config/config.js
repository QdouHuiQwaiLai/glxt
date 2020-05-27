// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'register',
          path: '/user/register',
          component: './user/register',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/dataMate',
              name: 'dataMate',
              icon: 'barChart',
              routes: [
                {
                  path: '/dataMate/used',
                  name: 'used',
                  icon: 'heatMap',
                  component: './dataMate/used',
                },
                {
                  path: '/dataMate/compare',
                  name: 'compare',
                  icon: 'radarChart',
                  component: './dataMate/compare',
                },
              ],
            },
            {
              path: '/dataSet',
              name: 'dataSet',
              icon: 'import',
              component: './dataSet',
              authority: ['admin'],
            },
            {
              path: '/dataOne',
              name: 'dataOne',
              icon: 'form',
              component: './dataOne',
              authority: ['admin'],
            },
            {
              path: '/',
              redirect: '/dataMate/used',
            },
            {
              path: '/account',
              name: 'account',
              icon: 'user',
              routes: [
                {
                  path: '/account/people',
                  name: 'people',
                  icon: 'usergroupAdd',
                  component: './account/people',
                },
                {
                  path: '/account/change',
                  name: 'change',
                  icon: 'userSwitch',
                  component: './account/change',
                },
              ],
            },
            // {
            //   path: '/admin',
            //   name: 'admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            //   routes: [
            //     {
            //       path: '/admin/sub-page',
            //       name: 'sub-page',
            //       icon: 'smile',
            //       component: './Welcome',
            //       authority: ['admin'],
            //     },
            //   ],
            // },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
