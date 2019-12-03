import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
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
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
            },
            {
              name: 'center',
              icon: 'smile',
              path: '/account/center',
              component: './account/center',
            },
            {
              name: '用户管理',
              icon: 'smile',
              path: '/list/table-list',
              component: './list/table-list',
            },
            {
              name: '工作包管理',
              icon: 'smile',
              path: '/list/work-list',
              component: './list/work-list',
            },
            {
              name: 'advanced-form',
              icon: 'smile',
              path: '/form/advanced-form',
              component: './form/advanced-form',
              hideInMenu: true,
            },
            {
              name: 'settings',
              icon: 'smile',
              path: '/account/settings',
              component: './account/settings',
              hideInMenu: true,
            },
            {
              name: 'basic-form',
              icon: 'smile',
              path: '/form/basic-form',
              component: './form/basic-form',
              hideInMenu: true,
            },
            {
              name: 'workapplication-detail',
              icon: 'smile',
              path: '/account/settings/components/WorkApplication/components/detail',
              component: './account/settings/components/WorkApplication/components/detail',
              hideInMenu: true,
            },
            {
              name: 'workpremeeting-update-detail',
              icon: 'smile',
              path: '/account/settings/components/WorkPreMeeting/components/updateDetail',
              component: './account/settings/components/WorkPreMeeting/components/updateDetail',
              hideInMenu: true,
            },
            {
              name: 'workpremeeting-view-detail',
              icon: 'smile',
              path: '/account/settings/components/WorkPreMeeting/components/viewDetail',
              component: './account/settings/components/WorkPreMeeting/components/viewDetail',
              hideInMenu: true,
            },
            {
              name: 'relateman-list',
              icon: 'smile',
              path: '/account/settings/components/RalateMan',
              component: './account/settings/components/RalateMan',
              hideInMenu: true,
            },
            {
              name: 'deptTree-list',
              icon: 'smile',
              path: '/account/settings/components/RalateMan/components/userlist/Userlist',
              component: './account/settings/components/RalateMan/components/userlist/Userlist',
              hideInMenu: true,
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
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://localhost:12345/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
} as IConfig;
