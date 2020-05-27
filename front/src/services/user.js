import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function changePwd(params) {
  return request('/v1/user/changePwd', {
    method: 'POST',
    data: params,
  });
}

export async function parentCreate(params) {
  return request('/v1/user/parentCreate', {
    method: 'POST',
    data: params,
  });
}

export async function getUserList() {
  return request('/v1/user/getUserList')
}

export async function deleteUser(params) {
  return request('/v1/user/deleteUser', {
    method: 'POST',
    data: params,
  });
}