import { stringify } from 'querystring';
import { history } from 'umi';
import { changePwd } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
  namespace: 'change',
  state: {
  },
  effects: {
    *change({ payload }, { call, put }) {
      const response = yield call(changePwd, payload);
      if (response.code === 0) {
        notification.success({
          message: '修改成功',
        });
      }
    },
  },
  reducers: {
  },
};
export default Model;
