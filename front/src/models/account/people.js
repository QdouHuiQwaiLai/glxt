import { stringify } from 'querystring';
import { history } from 'umi';
import { parentCreate, getUserList, deleteUser } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';

const Model = {
  namespace: 'people',
  state: {
    status: false,  // 是否为加载状态
    peopleList: []
  },
  effects: {
    *getPeopleList({ payload }, { call, put }) {
      yield put({type: 'startUpdate'})
      const response = yield call(getUserList, );
      if (response.code === 0) {
        yield put({
          type: 'updatePeopleList',
          payload: response['data'],
        }); // Login successfully
      }
    },
    *parentCreate({ payload }, { call, put }) {
      const response = yield call(parentCreate, payload);
      if (response.code === 0) {
        notification.success({
          message: '增加成功',
        });
        yield put({type: 'getPeopleList', payload: {}})
      }
    },
    *deleteUser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      if (response.code === 0) {
        notification.success({
          message: '删除成功',
        });
        yield put({type: 'getPeopleList', payload: {}})
      }
    },
  },
  reducers: {
    updatePeopleList(state, { payload }) {
      return {...state, peopleList: payload, status: true};
    },
    startUpdate(state, { }) {
      return {...state, status: false}
    }
  },
};


export default Model;
