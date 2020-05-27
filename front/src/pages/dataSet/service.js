import request from '@/utils/request';

export async function queryUploadList(params) {
  return request('/v1/entry/getUploadList', {
    params,
  });
}

export async function getSchoolList() {
  return request(`/v1/school/getSchoolList`);
}


export async function addSchoolName(params) {
  return request('/v1/school/addName', {
    method: 'POST',
    data: params,
  });
}

export async function deleteTaskFile(params) {
  return request('/v1/entry/deleteTaskFile', {
    method: 'POST',
    data: params,
  });
}

export async function uploadTask(params) {
  return request('/v1/entry/upload', {
    method: 'POST',
    data: params,
  });
}

export async function getTaskProgress(params) {
  return request('/v1/entry/getTaskProgress', {
    params,
  });
}
